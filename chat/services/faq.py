FAQ = [
    {
        "q": ["placement support percentage", "placement rate"],
        "a": "We provide placement assistance with a strong placement record across programs."
    },
    {
        "q": ["certificate validity", "is certificate valid"],
        "a": "Yes, our certificates are industry-recognized."
    },
    {
        "q": ["online or offline", "mode of training"],
        "a": "We offer both online and offline training modes."
    },
]

def match_faq(text: str):
    text = text.lower()

    for item in FAQ:
        if any(q in text for q in item["q"]):
            return item["a"]

    return None
