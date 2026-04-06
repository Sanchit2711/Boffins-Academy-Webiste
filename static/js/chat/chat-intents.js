window.ChatIntent = (() => {
  function detect(text) {
    const msg = text.toLowerCase();

    if (
      msg.includes("open courses") ||
      msg.includes("go to courses") ||
      msg.includes("courses") ||
      msg.includes("course") ||
      msg.includes("syllabus") ||
      msg.includes("curriculum") ||
      msg.includes("programs") ||
      msg.includes("program")
    ) {
      return { action: "navigate", path: "/courses" };
    }

    if (
      msg.includes("contact") ||
      msg.includes("contact page") ||
      msg.includes("reach out") ||
      msg.includes("call me") ||
      msg.includes("email") ||
      msg.includes("whatsapp")
    ) {
      return { action: "navigate", path: "/contact" };
    }

    if (
      msg.includes("about") ||
      msg.includes("about us") ||
      msg.includes("mission") ||
      msg.includes("vision") ||
      msg.includes("who are you") ||
      msg.includes("who is boffins")
    ) {
      return { action: "navigate", path: "/about" };
    }

    if (
      msg.includes("gallery") ||
      msg.includes("photos") ||
      msg.includes("images") ||
      msg.includes("campus") ||
      msg.includes("life at")
    ) {
      return { action: "navigate", path: "/gallery" };
    }

    if (
      msg.includes("success stories") ||
      msg.includes("success story") ||
      msg.includes("testimonials") ||
      msg.includes("reviews") ||
      msg.includes("alumni")
    ) {
      return { action: "navigate", path: "/success-stories" };
    }

    return null;
  }

  return { detect };
})();
