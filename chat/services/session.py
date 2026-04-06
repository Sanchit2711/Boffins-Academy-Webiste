# chat/services/session.py

SESSIONS = {}

def get_session(session_id: str):
    """
    Returns a mutable session dict for the given session_id.
    Creates one if it does not exist.
    """
    if session_id not in SESSIONS:
        SESSIONS[session_id] = {
            "current_page": None,
            "visited_pages": [],
            "last_intent": None,
            "active_course": None,
        }

    return SESSIONS[session_id]
