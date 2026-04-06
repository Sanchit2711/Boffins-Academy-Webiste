(() => {
  const heroRoot = document.getElementById("hero-figma");
  if (!heroRoot) return;

  const openBtn = heroRoot.querySelector(".hero-menu");
  const closeBtn = document.getElementById("hero-drawer-close");
  const miniCloseBtn = document.getElementById("hero-drawer-mini-close");
  const backdrop = document.getElementById("hero-drawer-backdrop");

  const setOpen = (open) => {
    heroRoot.classList.toggle("hero-drawer-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (openBtn) openBtn.addEventListener("click", () => setOpen(true));
  if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
  if (miniCloseBtn) miniCloseBtn.addEventListener("click", () => setOpen(false));
  if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();
