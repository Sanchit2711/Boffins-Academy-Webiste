(() => {
  const roots = document.querySelectorAll(".figma-faq-list");
  if (!roots.length) return;

  roots.forEach((list) => {
    const items = Array.from(list.querySelectorAll("details"));
    if (!items.length) return;

    const sync = () => {
      items.forEach((item) => {
        const toggle = item.querySelector(".figma-faq-toggle");
        if (!toggle) return;
        toggle.textContent = item.open ? "-" : "+";
      });
    };

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
        sync();
      });
    });

    sync();
  });
})();
