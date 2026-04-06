import re
from .site_map import SITE_MAP

# =========================
# SECONDARY INTENT VOCABULARY
# =========================

SECONDARY_INTENTS = {
    "pricing": [
        "price", "prices", "fee", "fees", "cost", "charges", "payment"
    ],
    "duration": [
        "duration", "how long", "months", "weeks", "length"
    ],
    "eligibility": [
        "eligibility", "eligible", "requirements", "who can apply"
    ],
    "syllabus": [
        "syllabus", "curriculum", "topics", "modules", "what will i learn"
    ],
    "placements": [
        "placement support", "placement details", "placement assistance"
    ],
    "batch": [
        "batch", "start date", "next batch"
    ],
    "certificate": [
        "certificate", "certification", "degree", "recognition"
    ],
}

# =========================
# NORMALIZATION
# =========================

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return re.sub(r"\s+", " ", text).strip()

# =========================
# INTENT PARSER
# =========================

def parse_intent(text: str):
    """
    Returns:
    {
        "primary": "courses",
        "secondary": ["pricing", "duration"]
    }
    """

    text = normalize(text)

    primary = None
    secondary = []

    # 1️⃣ Detect PRIMARY intent (page-level only)
    for page_key, meta in SITE_MAP.items():
        for keyword in meta.get("keywords", []):
            if keyword in text:
                primary = page_key
                break
        if primary:
            break

    # 2️⃣ Detect SECONDARY intents (info-level only)
    for intent_key, keywords in SECONDARY_INTENTS.items():
        for kw in keywords:
            if kw in text:
                secondary.append(intent_key)
                break

    return {
        "primary": primary,
        "secondary": secondary,
    }
