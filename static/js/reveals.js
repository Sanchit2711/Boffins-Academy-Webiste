(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
})();
