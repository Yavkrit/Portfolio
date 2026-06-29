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

  // ── YV LOGO → scroll to contact ──────────────────────────
  const navBrand = document.getElementById('nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── THEME TOGGLE (Dark / Light) ───────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('yv-theme', theme); } catch (_) {}
  }

  // Restore saved preference or system preference
  const savedTheme = (() => {
    try { return localStorage.getItem('yv-theme'); } catch (_) { return null; }
  })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

})();
