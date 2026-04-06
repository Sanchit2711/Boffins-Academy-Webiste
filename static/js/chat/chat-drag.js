(() => {
  const notch = document.getElementById("chat-notch");
  if (!notch) return;

  let isDragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function applyPosition(x, y) {
    const rect = notch.getBoundingClientRect();
    const padding = 8;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    const nextX = clamp(x, padding, maxX);
    const nextY = clamp(y, padding, maxY);

    notch.style.left = `${nextX}px`;
    notch.style.top = `${nextY}px`;
    notch.style.right = "auto";
    notch.style.bottom = "auto";
    notch.style.transform = "none";
    notch.classList.add("is-dragged");
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    isDragging = true;
    moved = false;
    const rect = notch.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    originX = rect.left;
    originY = rect.top;
    notch.setPointerCapture(e.pointerId);
    notch.classList.add("is-dragging");
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    applyPosition(originX + dx, originY + dy);
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    notch.releasePointerCapture(e.pointerId);
    notch.classList.remove("is-dragging");
  }

  notch.addEventListener("pointerdown", onPointerDown);
  notch.addEventListener("pointermove", onPointerMove);
  notch.addEventListener("pointerup", onPointerUp);
  notch.addEventListener("pointercancel", onPointerUp);

  // Prevent click from firing after a drag
  notch.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  window.addEventListener("resize", () => {
    if (!notch.classList.contains("is-dragged")) return;
    const rect = notch.getBoundingClientRect();
    applyPosition(rect.left, rect.top);
  });

})();
