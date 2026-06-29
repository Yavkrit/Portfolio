// Main — Loader + Init
(function() {

  // ── LOADER ─────────────────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (loaderBar) loaderBar.style.width = Math.min(progress, 92) + '%';
    if (progress >= 92) clearInterval(interval);
  }, 120);

  window.addEventListener('load', () => {
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => { loader.style.display = 'none'; }, 600);
      }
    }, 400);
  });

  // Fallback if load doesn't fire
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
  }, 4000);

  // ── DYNAMIC HOVER CURSOR TARGETS (re-apply after render) ──
  setTimeout(() => {
    const targets = 'a,button,.project-card,.cert-card,.stat-card,.exp-nav-item,.highlight-chip,.cert-card,.cert-open-btn,.cert-tab-btn';
    document.querySelectorAll(targets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }, 500);

})();
