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
  const portraitTech = document.getElementById('hero-portrait-tech');
  const portraitWrap = document.getElementById('hero-portrait-wrap');
  const heroAura     = document.getElementById('hero-aura-svg');
  const scrollInd    = document.querySelector('.scroll-indicator');
  const scanbeam     = document.getElementById('hero-scanbeam');
  const progFill     = document.getElementById('hero-prog-fill');

  if (!hero) return;

  /* ── Compute scale needed to fill viewport width ────────
     Images are now height:100% width:auto (natural ratio).
     fillScale zooms them up so they cover the viewport at rest,
     then JS unwinds this to 1.0 as the user scrolls.            */
  let fillScale = 1.6; // safe fallback until image loads

  function computeFillScale() {
    if (!portrait || !portrait.offsetWidth) return;
    const vpW  = hero.offsetWidth;
    const imgW = portrait.offsetWidth; // displayed width at height:100%
    fillScale  = Math.max(1, (vpW / imgW) * 1.02); // 2% overshoot avoids gap
    // Apply immediately so there's no flash of un-zoomed image
    const base = `translateX(-50%) scale(${fillScale})`;
    portrait.style.transform     = base;
    if (portraitTech) portraitTech.style.transform = base;
    if (heroAura)     heroAura.style.transform      = base;
  }

  if (portrait) {
    if (portrait.complete) computeFillScale();
    else portrait.addEventListener('load', computeFillScale);
  }

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

  /* ── Tech-layer cursor reveal ──────────────────────────── */
  let revealRaf = null;

  function updateReveal(clientX, clientY) {
    if (!portraitTech) return;
    // Use the tech image's own bounding rect so % coords map exactly to cursor
    const rect = portraitTech.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width  * 100).toFixed(2);
    const py = ((clientY - rect.top)  / rect.height * 100).toFixed(2);
    const r  = 110; // fixed px — same bubble size regardless of image zoom
    const mask = `radial-gradient(circle ${r.toFixed(0)}px at ${px}% ${py}%, black 0%, black 55%, transparent 90%)`;
    portraitTech.style.webkitMaskImage = mask;
    portraitTech.style.maskImage       = mask;
  }

  function onTechLeave() {
    if (!portraitTech) return;
    const mask = 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)';
    portraitTech.style.webkitMaskImage = mask;
    portraitTech.style.maskImage       = mask;
  }

  if (portraitWrap) {
    portraitWrap.addEventListener('mousemove', e => {
      if (revealRaf) return;
      revealRaf = requestAnimationFrame(() => {
        updateReveal(e.clientX, e.clientY);
        revealRaf = null;
      });
    }, { passive: true });

    portraitWrap.addEventListener('mouseleave', onTechLeave, { passive: true });
  }

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2; // −1 … +1
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });


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

    /* Portrait — zoom out from fillScale → 1.0 revealing full portrait */
    if (portrait) {
      const tx = scrollY < 60 ? mx * 9 : 0;
      const ty = scrollY * 0.12 + (scrollY < 60 ? my * 4 : 0);

      // Ease: fillScale at progress=0, reaches 1.0 around progress=0.6
      const ease = Math.min(1, progress * 1.7);
      const smoothEase = ease < 0.5
        ? 2 * ease * ease
        : 1 - Math.pow(-2 * ease + 2, 2) / 2; // ease-in-out quad
      const sc = fillScale - (fillScale - 1) * smoothEase;

      const t = `translateX(-50%) translate(${tx}px, ${ty}px) scale(${sc})`;
      const f = `brightness(${Math.max(0.65, 0.80 - progress * 0.18)}) saturate(${Math.max(0.85, 1.08 - progress * 0.25)}) contrast(1.04)`;
      portrait.style.transform = t;
      portrait.style.filter    = f;
      if (portraitTech) { portraitTech.style.transform = t; portraitTech.style.filter = f; }
      if (heroAura)     { heroAura.style.transform = t; }
    }

    /* Hero text parallax fade */
    if (heroContent) {
      const op = Math.max(0, 1 - progress * 3.5);
      heroContent.style.opacity   = op;
      heroContent.style.transform = `translateY(${progress * -55}px)`;
    }

    /* Vertical progress bar */
    if (progFill) progFill.style.height = (progress * 100).toFixed(1) + '%';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', computeFillScale, { passive: true });
  onScroll();
})();
