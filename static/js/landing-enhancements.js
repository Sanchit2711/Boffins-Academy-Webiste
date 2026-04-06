(() => {
  const root = document.getElementById("home-landing");
  if (!root) return;
  document.body.classList.add("home-landing-page");

  const revealSelectors = [
    ".hero-trust",
    ".hero-heading",
    ".hero-ctas",
    ".hero-stats",
    ".fws-head",
    ".fws-card",
    ".fcourse-head",
    ".fcourse-card",
    ".fst-head",
    ".fst-card",
    ".fwcu-head",
    ".fwcu-grid article",
    ".fstats article",
    ".figma-companies-head",
    ".figma-company-ticker",
    ".figma-cta-grid",
    ".figma-faq-head",
    ".figma-faq-list details"
  ];

  const revealNodes = root.querySelectorAll(revealSelectors.join(","));
  revealNodes.forEach((node) => node.classList.add("landing-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const cardNodes = root.querySelectorAll(".fws-card, .fcourse-card, .fst-card, .fwcu-grid article");
  cardNodes.forEach((card) => {
    card.classList.add("interactive-card");

    card.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(max-width: 1024px)").matches) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 5.5;
      const rx = (0.5 - py) * 4.2;
      card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  });

  const statValues = root.querySelectorAll(".fstats h3");
  const statObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStat(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  statValues.forEach((node) => statObserver.observe(node));

  function animateStat(node) {
    const finalText = (node.textContent || "").trim();
    const hasPlus = finalText.includes("+");
    const hasPercent = finalText.includes("%");
    const numeric = Number(finalText.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric) || numeric <= 0) return;

    const duration = 1200;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(numeric * eased);
      const formatted = value >= 1000 ? value.toLocaleString("en-US") : String(value);
      node.textContent = `${formatted}${hasPercent ? "%" : ""}${hasPlus ? "+" : ""}`;
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }

  const faqItems = root.querySelectorAll(".figma-faq-list details");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("a[href^='#']");
    if (!trigger) return;
    const id = trigger.getAttribute("href");
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const navbar = document.getElementById("navbar");
    const offset = navbar ? navbar.getBoundingClientRect().height + 8 : 72;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  const isMobileViewport = () => window.matchMedia("(max-width: 768px)").matches;

  const setupMobileOnlyEnhancements = () => {
    if (!isMobileViewport()) return;

    const pressableCards = root.querySelectorAll(".fws-card, .fcourse-card, .fst-card, .fwcu-grid article");
    pressableCards.forEach((card) => {
      const pressOn = () => card.classList.add("is-pressed");
      const pressOff = () => card.classList.remove("is-pressed");
      card.addEventListener("touchstart", pressOn, { passive: true });
      card.addEventListener("touchend", pressOff, { passive: true });
      card.addEventListener("touchcancel", pressOff, { passive: true });
    });

    const ticker = root.querySelector(".figma-company-ticker");
    if (ticker) {
      let pauseTimer = null;
      ticker.addEventListener("touchstart", () => {
        ticker.classList.add("is-touch-paused");
        if (pauseTimer) window.clearTimeout(pauseTimer);
      }, { passive: true });

      ticker.addEventListener("touchend", () => {
        pauseTimer = window.setTimeout(() => ticker.classList.remove("is-touch-paused"), 1200);
      }, { passive: true });
    }

    if (!document.getElementById("home-mobile-top")) {
      const topBtn = document.createElement("button");
      topBtn.id = "home-mobile-top";
      topBtn.type = "button";
      topBtn.setAttribute("aria-label", "Back to top");
      topBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      `;
      document.body.appendChild(topBtn);

      const syncTopBtn = () => {
        topBtn.classList.toggle("is-visible", window.scrollY > 520 && isMobileViewport());
      };

      window.addEventListener("scroll", syncTopBtn, { passive: true });
      window.addEventListener("resize", syncTopBtn);
      syncTopBtn();

      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  setupMobileOnlyEnhancements();
})();
