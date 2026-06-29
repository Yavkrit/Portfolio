// ══════════════════════════════════════════════════════════
//  HERO — Cinematic Reveal  (Lando-Norris-inspired aesthetic)
//  "System Online" engineering identity
// ══════════════════════════════════════════════════════════
(function () {
  'use strict';

  const P = window.PORTFOLIO;
  if (!P) return;

  /* ── DOM refs ──────────────────────────────────────────── */
  const hero         = document.getElementById('hero');
  const heroSticky   = document.getElementById('hero-sticky');
  const heroContent  = document.getElementById('hero-content');
  const heroLabel    = document.getElementById('hero-label');
  const heroName     = document.getElementById('hero-name');
  const heroFirst    = document.getElementById('hero-first');
  const heroLast     = document.getElementById('hero-last');
  const heroRoleWrap = document.getElementById('hero-role-wrap');
  const heroTagline  = document.getElementById('hero-tagline');
  const heroCta      = document.getElementById('hero-cta');
  const roleCycle    = document.getElementById('role-cycle');
  const portrait     = document.getElementById('hero-portrait-main');
  const scrollInd    = document.querySelector('.scroll-indicator');
  const scanbeam     = document.getElementById('hero-scanbeam');
  const speedlines   = document.getElementById('hero-speedlines');
  const hud          = document.getElementById('hero-hud');
  const progFill     = document.getElementById('hero-prog-fill');

  if (!hero) return;

  /* ── Step 1 — Set initial hidden state (CSS no longer does this) ── */
  // CSS animations removed from stylesheet — JS owns the full reveal
  [heroLabel, heroRoleWrap, heroTagline, heroCta].forEach(el => {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
  });

  // Name: visible but clipped (wipe-in reveals it)
  if (heroName)  { heroName.style.opacity = '1'; heroName.style.transform = 'none'; }
  if (heroFirst) { heroFirst.classList.add('hw-init'); }
  if (heroLast)  { heroLast.classList.add('hw-init');  }

  /* ── Step 2 — Count-up animation for HUD numbers ──────── */
  function countUp(el) {
    const target   = parseFloat(el.dataset.val);
    const decimals = parseInt(el.dataset.dec || '0', 10);
    const dur      = 1100;
    const t0       = performance.now();

    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);          // ease-out cubic
      el.textContent = (target * ease).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    })(t0);
  }

  /* ── Step 3 — Reveal a text element with slide+fade ───── */
  function revealEl(el, delay) {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1)';
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  /* ── Step 4 — Main cinematic reveal sequence ───────────── */
  let revealFired = false;

  function fireReveal() {
    if (revealFired) return;
    revealFired = true;

    /* — Scan beam sweeps top → bottom — */
    const sb = document.getElementById('hero-scanbeam');
    if (sb) {
      sb.style.animation = ''; // clear any inline override
      setTimeout(() => sb.classList.add('sb-active'), 20);
    }

    /* — Speed lines burst — */
    if (speedlines) {
      setTimeout(() => speedlines.classList.add('sl-active'), 60);
    }

    /* — Label slides in (from left, letter-spacing expands in) — */
    if (heroLabel) {
      setTimeout(() => {
        heroLabel.style.transform     = 'translateX(-20px)';
        heroLabel.style.letterSpacing = '8px';
        void heroLabel.offsetWidth;
        heroLabel.style.transition    = 'opacity .75s ease, transform .75s ease, letter-spacing .75s ease';
        heroLabel.style.opacity       = '1';
        heroLabel.style.transform     = 'translateX(0)';
        heroLabel.style.letterSpacing = '4px';
      }, 80);
    }

    /* — Name: wipe in first then last — */
    setTimeout(() => {
      if (heroFirst) { heroFirst.classList.remove('hw-init'); heroFirst.classList.add('hw-reveal'); }
      if (heroLast)  { heroLast.classList.remove('hw-init');  heroLast.classList.add('hw-reveal');  }
    }, 200);

    /* — Role line — */
    revealEl(heroRoleWrap, 680);

    /* — Tagline — */
    revealEl(heroTagline, 880);

    /* — CTAs — */
    setTimeout(() => {
      if (heroCta) {
        heroCta.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
        heroCta.style.opacity    = '1';
        heroCta.style.transform  = 'translateY(0)';
        heroCta.style.pointerEvents = 'all';
      }
    }, 1080);

    /* — HUD tags (left side) — */
    document.querySelectorAll('.hud-tag').forEach((tag, i) => {
      setTimeout(() => tag.classList.add('ht-vis'), 1150 + i * 140);
    });

    /* — HUD stats (right side) + count-up — */
    document.querySelectorAll('.hud-stat').forEach((stat, i) => {
      setTimeout(() => {
        stat.classList.add('hs-vis');
        const n = stat.querySelector('.hud-n');
        if (n) countUp(n);
      }, 1350 + i * 170);
    });
  }

  /* ── Step 5 — Watch for loader removal ────────────────── */
  const loaderEl = document.getElementById('loader');
  if (loaderEl) {
    const obs = new MutationObserver(() => {
      const gone = loaderEl.style.display === 'none'
                || loaderEl.classList.contains('fade-out');
      if (gone) { obs.disconnect(); setTimeout(fireReveal, 180); }
    });
    obs.observe(loaderEl, { attributes: true, attributeFilter: ['style', 'class'] });
    // Fallback: if loader already gone by the time this runs
    if (loaderEl.style.display === 'none') setTimeout(fireReveal, 100);
  } else {
    setTimeout(fireReveal, 200);
  }

  /* ── Role cycling ──────────────────────────────────────── */
  const roles = P.personal.roles;
  let roleIdx = 0;

  function cycleRole() {
    if (!roleCycle) return;
    roleIdx = (roleIdx + 1) % roles.length;
    roleCycle.style.transition = 'none';
    roleCycle.style.opacity    = '0';
    roleCycle.style.transform  = 'translateY(14px)';
    setTimeout(() => {
      roleCycle.textContent   = roles[roleIdx];
      roleCycle.style.transition = 'opacity .5s ease, transform .5s ease';
      roleCycle.style.opacity    = '1';
      roleCycle.style.transform  = 'translateY(0)';
    }, 280);
  }
  setInterval(cycleRole, 2800);

  /* ── Mouse parallax — portrait + HUD depth ────────────── */
  let mx = 0, my = 0;
  let hudTx = 0, hudTy = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2; // −1 … +1
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Smoothed HUD parallax via rAF
  function smoothHud() {
    if (hud && window.scrollY < 120) {
      const tx = mx * -6, ty = my * -3;
      hudTx += (tx - hudTx) * 0.08;
      hudTy += (ty - hudTy) * 0.08;
      hud.style.transform = `translate(${hudTx.toFixed(2)}px,${hudTy.toFixed(2)}px)`;
    }
    requestAnimationFrame(smoothHud);
  }
  smoothHud();

  /* ── Periodic name glitch ──────────────────────────────── */
  if (heroName) {
    setInterval(() => {
      if (window.scrollY > window.innerHeight * 0.6) return; // only when visible
      heroName.classList.add('glitch');
      setTimeout(() => heroName.classList.remove('glitch'), 400);
    }, 7500);
  }

  /* ── Scroll handler ────────────────────────────────────── */
  let scrollY = 0;

  function onScroll() {
    scrollY = window.scrollY;
    const heroH    = hero.offsetHeight;
    const vh       = window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / (heroH - vh)));

    /* Scroll indicator */
    if (scrollInd) scrollInd.style.opacity = scrollY < 80 ? '1' : '0';

    /* Portrait parallax (scroll + subtle mouse) */
    if (portrait) {
      const ty = scrollY * 0.25 + (scrollY < 60 ? my * 5 : 0);
      const tx = scrollY < 60 ? mx * 9 : 0;
      const sc = 1 + scrollY * 0.00008;
      portrait.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
    }

    /* Hero text parallax fade */
    if (heroContent) {
      const op = Math.max(0, 1 - progress * 3.5);
      heroContent.style.opacity   = op;
      heroContent.style.transform = `translateY(${progress * -55}px)`;
    }

    /* HUD fade on scroll */
    if (hud) hud.style.opacity = String(Math.max(0, 1 - progress * 4));

    /* Vertical progress bar */
    if (progFill) progFill.style.height = (progress * 100).toFixed(1) + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
