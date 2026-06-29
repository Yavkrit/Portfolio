// Scroll Animations, Cursor, Nav, Skill Bars
(function() {

  // ── CURSOR ─────────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    if (cursor) {
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
    }
  });

  function animateFollower() {
    fx += (cx - fx) * 0.1;
    fy += (cy - fy) * 0.1;
    if (follower) {
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a,button,.project-card,.cert-card,.stat-card,.exp-nav-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ── NAV SCROLL ─────────────────────────────────────────
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 60);

    // Active link
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Smooth scroll nav links
  document.querySelectorAll('[data-nav], .mobile-link').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // hero is 400vh — clicking About should scroll past it
          if (href === '#hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const offset = target.offsetTop;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
        // Close mobile menu
        document.getElementById('mobile-menu')?.classList.remove('open');
        document.getElementById('hamburger')?.classList.remove('open');
      }
    });
  });

  // ── HAMBURGER ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // ── INTERSECTION OBSERVER ──────────────────────────────
  const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, revealOpts);

  document.querySelectorAll('.reveal-text').forEach(el => revealObs.observe(el));

  // Animate exp items
  const expObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        expObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.exp-item').forEach(el => expObs.observe(el));

  // Skill bars animation
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w + '%'; }, 100);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));

  // ── ESC TO CLOSE MODALS ────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });

  // ── ABOUT PORTRAIT 3D TILT ────────────────────────────
  const aboutPortrait = document.getElementById('about-portrait');
  if (aboutPortrait) {
    const frame = aboutPortrait.closest('.about-portrait-frame');
    if (frame) {
      frame.addEventListener('mousemove', e => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
        frame.style.transition = 'transform 0.5s ease';
      });
    }
  }

  // ── EXP DETAIL CARD TILT ──────────────────────────────
  document.addEventListener('mousemove', e => {
    const card = document.querySelector('.exp-detail-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 4;
    const y = ((e.clientY - rect.top ) / rect.height - 0.5) * 4;
    card.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    const card = document.querySelector('.exp-detail-card');
    if (card) card.style.transform = '';
  });

})();
