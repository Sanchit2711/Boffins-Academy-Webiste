(() => {
  const notch = document.getElementById("chat-notch");
  const panel = document.getElementById("chat-panel");
  const backdrop = document.getElementById("chat-backdrop");
  const closeBtn = document.getElementById("chat-close");
  const root = document.getElementById("chat-root");

  if (!notch || !panel || !backdrop || !closeBtn || !root) {
    console.error("[ChatToggle] Missing DOM elements");
    return;
  }

  function openChat() {
    root.classList.add("open");
    notch.setAttribute("aria-expanded", "true");
    panel.classList.remove(
      "opacity-0",
      "scale-75",
      "translate-y-6",
      "pointer-events-none"
    );
    backdrop.classList.remove("opacity-0", "pointer-events-none");
    backdrop.classList.add("pointer-events-auto");
  }

  function closeChat() {
    root.classList.remove("open");
    notch.setAttribute("aria-expanded", "false");
    panel.classList.add(
      "opacity-0",
      "scale-75",
      "translate-y-6",
      "pointer-events-none"
    );
    backdrop.classList.add("opacity-0", "pointer-events-none");
    backdrop.classList.remove("pointer-events-auto");
  }

  notch.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  backdrop.addEventListener("click", closeChat);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeChat();
  });
})();
