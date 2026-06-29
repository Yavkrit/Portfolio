// Cinematic Hero — Single Portrait with Ken Burns + Parallax
(function() {
  const P = window.PORTFOLIO;
  if (!P) return;

  const roles = P.personal.roles;
  const roleCycle = document.getElementById('role-cycle');

  // ── Role text cycling ───────────────────────────────────
  let roleIdx = 0;
  function cycleRole() {
    if (!roleCycle) return;
    roleIdx = (roleIdx + 1) % roles.length;
    roleCycle.style.opacity = '0';
    roleCycle.style.transform = 'translateY(12px)';
    setTimeout(() => {
      roleCycle.textContent = roles[roleIdx];
      roleCycle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      roleCycle.style.opacity = '1';
      roleCycle.style.transform = 'translateY(0)';
    }, 300);
  }
  setInterval(cycleRole, 2800);

  // ── Scroll parallax on hero content ─────────────────────
  const hero = document.getElementById('hero');
  const heroSticky = document.getElementById('hero-sticky');
  const heroContent = document.querySelector('.hero-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroPortrait = document.getElementById('hero-portrait-main');

  if (!hero) return;

  function onScroll() {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / (heroH - vh)));

    // Fade out scroll indicator quickly
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollY < 80 ? '1' : '0';
    }

    // Parallax on portrait — moves up as user scrolls
    if (heroPortrait) {
      const translateY = scrollY * 0.25;
      const scale = 1 + scrollY * 0.00008;
      heroPortrait.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }

    // Hero text fades out on scroll
    if (heroContent) {
      const opacity = Math.max(0, 1 - progress * 3.5);
      const ty = progress * -60;
      heroContent.style.opacity = opacity;
      heroContent.style.transform = `translateY(${ty}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
