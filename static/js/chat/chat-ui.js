window.ChatUI = (() => {
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  let typingBubble = null;

  // Fail loudly in dev, safely in prod
  if (!messagesEl || !inputEl || !sendBtn) {
    console.error("[ChatUI] Required DOM elements not found");
    return null;
  }

  function addMessage(role, text, opts = {}) {
    const bubble = document.createElement("div");

    bubble.className =
      role === "user"
        ? "ml-auto max-w-[85%] rounded-xl bg-[#6C5CE7] text-white px-3 py-2"
        : "max-w-[85%] rounded-xl bg-white/70 px-3 py-2";

    const safeText = String(text ?? "");
    if (opts.preserveLines) {
      bubble.textContent = safeText;
      bubble.style.whiteSpace = "pre-line";
    } else {
      bubble.textContent = safeText;
    }
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function showTyping() {
    hideTyping(); // ensure no duplicates / race conditions

    typingBubble = document.createElement("div");
    typingBubble.className =
      "max-w-[60%] rounded-xl bg-white/50 px-3 py-2 text-sm text-gray-600 italic";
    typingBubble.textContent = "Assistant is thinking…";

    messagesEl.appendChild(typingBubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    if (!typingBubble) return;
    typingBubble.remove();
    typingBubble = null;
  }

  function disableInput(state) {
    sendBtn.disabled = state;
    inputEl.disabled = state;

    inputEl.placeholder = state
      ? "Assistant is responding…"
      : "Type a message…";
  }
  function addSuggestion(label, page) {
  const btn = document.createElement("button");
  btn.className =
    "mt-2 inline-block rounded-xl bg-[#6C5CE7] text-white px-4 py-2 text-sm";
  btn.textContent = label;

  btn.onclick = () => {
    window.ChatCommands.execute({
      type: "navigate",
      page: page,
    });
  };

  messagesEl.appendChild(btn);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

  function addQuickReplies(items = []) {
    if (!Array.isArray(items) || items.length === 0) return;

    const wrap = document.createElement("div");
    wrap.className = "mt-2 flex flex-wrap gap-2";

    items.forEach((item) => {
      const label = item && item.label ? item.label : "";
      if (!label) return;

      const btn = document.createElement("button");
      btn.className =
        "rounded-full border border-[#6C5CE7] text-[#6C5CE7] px-3 py-1.5 text-xs hover:bg-[#6C5CE7] hover:text-white transition";
      btn.textContent = label;

      btn.onclick = () => {
        if (item.action && window.ChatCommands) {
          window.ChatCommands.execute(item.action);
          return;
        }
        if (item.page && window.ChatCommands) {
          window.ChatCommands.execute({ type: "navigate", page: item.page });
          return;
        }
        if (item.message && window.ChatSend) {
          window.ChatSend(item.message);
        }
      };

      wrap.appendChild(btn);
    });

    if (wrap.children.length === 0) return;
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }


  function clearMessages() {
    messagesEl.innerHTML = "";
  }

  function typeMessage(text, opts = {}) {
    const safeText = String(text ?? "");
    const bubble = addMessage(opts.role || "assistant", "", {
      preserveLines: opts.preserveLines,
    });

    let i = 0;
    const speed = Number.isFinite(opts.speed) ? opts.speed : 35;

    function tick() {
      if (!bubble) return;
      if (i >= safeText.length) return;
      bubble.textContent += safeText[i];
      i += 1;
      messagesEl.scrollTop = messagesEl.scrollHeight;
      setTimeout(tick, speed);
    }

    tick();
  }

  return {
    addMessage,
    typeMessage,
    addSuggestion,
    addQuickReplies,
    showTyping,
    hideTyping,
    disableInput,
    clearMessages,
    inputEl,
    sendBtn
  };
})();
