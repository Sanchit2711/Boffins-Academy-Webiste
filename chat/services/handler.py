import uuid
import re
from .faq import match_faq
from .intents import parse_intent
from .session import get_session
from .site_map import SITE_MAP, get_courses_map
from .llm import llm_classify_intent, llm_assist



def handle_message(session_id: str | None, message: str):
    # =========================
    # 1️⃣ Session bootstrap
    # =========================
    session_id = session_id or str(uuid.uuid4())
    session = get_session(session_id)

    actions = []
    text = message.lower()

    # =========================
    # 2️⃣ Memory: name + goal
    # =========================
    name_match = re.search(
        r"(?:my name is|i am|i'm)\s+([a-zA-Z][a-zA-Z'\- ]{0,40})",
        message,
        flags=re.IGNORECASE,
    )
    if name_match:
        raw_name = re.split(r"[.!?,\n]", name_match.group(1).strip())[0]
        name_parts = raw_name.split()
        if name_parts:
            session["user_name"] = " ".join(name_parts[:2])

    goal_match = re.search(
        r"(?:i want to|i would like to|i'm looking to|i am looking to|i want|i need)\s+(.+)",
        message,
        flags=re.IGNORECASE,
    )
    if goal_match:
        raw_goal = re.split(r"[.!?\n]", goal_match.group(1).strip())[0]
        if raw_goal:
            session["user_goal"] = raw_goal[:120]

    # =========================
    # 3️⃣ Detect specific course
    # =========================
    detected_course = None
    for course_name, course in get_courses_map().items():
        if any(keyword in text for keyword in course["keywords"]):
            detected_course = {
                "name": course_name,
                **course,
            }
            session["active_course"] = detected_course
            break

    # Fallback to previous course context
    if not detected_course and session.get("active_course"):
        detected_course = session["active_course"]

    # =========================
    # 4️⃣ Intent (LLM first, then rules)
    # =========================
    llm_intent = llm_classify_intent(message)
    if llm_intent.get("primary") in SITE_MAP:
        primary = llm_intent["primary"]
        secondary = llm_intent.get("secondary", [])
        intent = llm_intent
    else:
        intent = parse_intent(message)
        primary = intent.get("primary")
        secondary = intent.get("secondary", [])

    # =========================
    # 5️⃣ Domain rules (IMPORTANT)
    # =========================

    # 🔥 Course context applies ONLY if user didn't ask for another page
    if detected_course and not primary:
        primary = "courses"

    # 🔥 If user explicitly switches page → clear course context
    if primary and primary != "courses":
        session["active_course"] = None
        detected_course = None

    # =========================
    # 6️⃣ If still no primary → FAQ fallback only
    # =========================
    if not primary:
        faq_answer = match_faq(message)
        if faq_answer:
            return {
                "session_id": session_id,
                "actions": [
                    {
                        "type": "message",
                        "content": faq_answer,
                    }
                ],
            }

        reply = llm_assist(
                message,
                context={
                    "current_page": session.get("current_page"),
                    "active_course": session.get("active_course"),
                    "user_name": session.get("user_name"),
                    "user_goal": session.get("user_goal"),
                }
            )

        return {
            "session_id": session_id,
            "actions": [
                {
                    "type": "message",
                    "content": reply,
                }
            ],
        }


    # =========================
    # 7️⃣ Resolve page + navigation
    # =========================
    page_info = SITE_MAP.get(primary)
    target_page = page_info["page"]

    # Resolve section (LLM or course-aware)
    section_selector = None
    if isinstance(intent, dict):
        section = intent.get("section")
        sections = page_info.get("sections", {})
        if section in sections:
            section_selector = sections[section]
        elif section in sections.values():
            section_selector = section

    if primary == "courses" and detected_course and not section_selector:
        section_selector = detected_course.get("section")

    if session.get("current_page") != target_page:
        actions.append({
            "type": "navigate",
            "page": target_page,
        })
        session["current_page"] = target_page
        session.setdefault("visited_pages", []).append(target_page)

    if section_selector:
        actions.append({
            "type": "scroll",
            "selector": section_selector,
        })

    # =========================
    # 8️⃣ Contextual message (LLM-first)
    # =========================
    reply = llm_assist(
        message,
        context={
            "current_page": session.get("current_page"),
            "active_course": session.get("active_course"),
            "intent": primary,
            "secondary": secondary,
            "user_name": session.get("user_name"),
            "user_goal": session.get("user_goal"),
        }
    )

    if reply:
        actions.append({
            "type": "message",
            "content": reply,
        })
    elif detected_course:
        actions.append({
            "type": "message",
            "content": (
                f"Here are the details for our "
                f"{detected_course['name'].title()} program."
            ),
        })
    else:
        actions.append({
            "type": "message",
            "content": f"Here’s what you need to know about our {primary}.",
        })

    # =========================
    # 9️⃣ Secondary intent handling
    # =========================
    for sec in secondary:

        # 💰 Pricing → CTA
        if sec == "pricing":
            if not page_info.get("has_price", True):
                cta = page_info.get("cta")
                if cta:
                    actions.append({
                        "type": "suggest",
                        "content": (
                            "Course pricing depends on counselling "
                            "and your background."
                        ),
                        "button": {
                            "label": cta["label"],
                            "page": cta["page"],
                        },
                    })

        # ⏱ Duration
        elif sec == "duration":
            actions.append({
                "type": "message",
                "content": (
                    "Course duration varies by program. "
                    "You’ll find the details on this page."
                ),
            })

        # 📘 Syllabus (course-aware)
        elif sec == "syllabus" and detected_course:
            actions.append({
                "type": "scroll",
                "selector": detected_course["section"],
            })
            actions.append({
                "type": "message",
                "content": "Here’s the syllabus section for this course.",
            })

        # 🎯 Placements
        elif sec == "placements":
            actions.append({
                "type": "message",
                "content": (
                    "Our programs include strong placement support "
                    "with real industry exposure."
                ),
            })

        # 🎓 Certificate
        elif sec == "certificate":
            actions.append({
                "type": "message",
                "content": (
                    "You’ll receive a recognized certificate "
                    "upon successful completion."
                ),
            })

        # 📅 Batch
        elif sec == "batch":
            actions.append({
                "type": "message",
                "content": (
                    "Batch start dates depend on the program. "
                    "The next batch details are available here."
                ),
            })

    # =========================
    # 10️⃣ Save intent for memory
    # =========================
    session["last_intent"] = intent

    # =========================
    # 🔟 Final response
    # =========================
    return {
        "session_id": session_id,
        "actions": actions,
    }
