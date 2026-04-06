console.log("VOICE FILE LOADED");

(() => {
  const micBtn = document.getElementById("chat-mic");
  const inputEl = document.getElementById("chat-input");

  if (!micBtn || !inputEl) {
    console.error("❌ Mic button or input not found");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition not supported");
    micBtn.style.display = "none";
    return;
  }

  let recognition = null;
  let isListening = false;

  function startRecognition() {
    if (isListening) return;

    recognition = new SpeechRecognition();

    // 🔑 BEST SETTINGS FOR SHORT COMMANDS
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log("STARTED");
      isListening = true;
      micBtn.classList.add("bg-purple-200");
      console.log("🎙️ Listening...");
    };

    recognition.onresult = (event) => {
      console.log("ONRESULT FIRED", event);
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.trim();

      if (!transcript) return;

      console.log("📝 Transcript:", transcript);

      // ✅ TYPE IT
      inputEl.value = transcript;

      // ✅ AUTO SEND
      if (window.ChatSend) {
        window.ChatSend(transcript);
      }
    };

    recognition.onerror = (e) => {
      console.error("❌ Speech error:", e.error);
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.classList.remove("bg-purple-200");
      console.log("🛑 Listening stopped");
    };

    recognition.start();
  }

  // 🎯 ONE ACTION: CLICK → LISTEN → SEND
  micBtn.addEventListener("click", startRecognition);
})();
