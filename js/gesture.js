// Gesture Navigation — MediaPipe Hands
(function () {
  'use strict';

  const SCROLL_SPEED   = 14;
  const NAV_COOLDOWN   = 1100;
  const PINCH_THRESH   = 0.055;
  const PINCH_FRAMES   = 3;    // consecutive frames before pinch fires
  const PINCH_COOLDOWN = 1400; // ms lockout after any click
  const TAB_COOLDOWN   = 550;

  let enabled      = false;
  let mpHands      = null;
  let mpCamera     = null;
  let lastNav      = 0;
  let lastPinch    = 0;
  let lastTab      = 0;
  let prevGesture  = null;
  let scrollDir    = 0;
  let rafScroll    = null;
  let pinchFrames  = 0;   // consecutive pinch frames counter
  let tabDirty     = true; // rebuild tab list only when needed

  let _tabIndex  = -1;
  let _tabList   = [];
  let _focusedEl = null;

  const SECTIONS = ['hero','about','experience','projects','research','skills','certificates','contact'];

  const toggle  = document.getElementById('gesture-toggle');
  const panel   = document.getElementById('gesture-panel');
  const preview = document.getElementById('gesture-preview');
  const label   = document.getElementById('gesture-label');
  const hint    = document.getElementById('gesture-hint');
  if (!toggle || !preview) return;

  toggle.addEventListener('click', () => enabled ? stop() : start());

  // ── Start / Stop ──────────────────────────────────────────
  async function start() {
    toggle.querySelector('.gest-icon').textContent = '⏳';
    try {
      await loadScripts([
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      ]);
      await initMediaPipe();
    } catch (e) {
      console.warn('Gesture nav failed:', e);
      toggle.querySelector('.gest-icon').textContent = '✋';
      setLabel('Camera access denied', 3000);
    }
  }

  function stop() {
    enabled = false;
    stopScrollRaf();
    if (mpCamera) { try { mpCamera.stop(); } catch (_) {} mpCamera = null; }
    if (mpHands)  { try { mpHands.close();  } catch (_) {} mpHands  = null; }
    if (preview.srcObject) {
      preview.srcObject.getTracks().forEach(t => t.stop());
      preview.srcObject = null;
    }
    clearGestureFocus();
    panel.classList.remove('visible');
    toggle.classList.remove('active');
    toggle.querySelector('.gest-icon').textContent = '✋';
  }

  function loadScripts(urls) {
    return urls.reduce((chain, url) =>
      chain.then(() => new Promise((res, rej) => {
        if (document.querySelector(`script[src="${url}"]`)) { res(); return; }
        const s = Object.assign(document.createElement('script'), { src: url, crossOrigin: 'anonymous' });
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      })), Promise.resolve()
    );
  }

  async function initMediaPipe() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240, facingMode: 'user' }
    });
    preview.srcObject = stream;
    await new Promise(r => { preview.onloadedmetadata = r; });
    await preview.play();

    mpHands = new window.Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });
    mpHands.setOptions({
      maxNumHands: 1, modelComplexity: 0,
      minDetectionConfidence: 0.72, minTrackingConfidence: 0.6
    });
    mpHands.onResults(onResults);

    mpCamera = new window.Camera(preview, {
      onFrame: async () => { if (enabled && mpHands) await mpHands.send({ image: preview }); },
      width: 320, height: 240
    });
    mpCamera.start();

    enabled = true;
    toggle.classList.add('active');
    toggle.querySelector('.gest-icon').textContent = '✋';
    panel.classList.add('visible');
    showLegend();
  }

  // ── Result handler ────────────────────────────────────────
  function onResults(results) {
    const lm = results.multiHandLandmarks && results.multiHandLandmarks[0];
    if (!lm) {
      if (scrollDir !== 0) { scrollDir = 0; stopScrollRaf(); }
      pinchFrames = 0;
      setLabel('');
      prevGesture = null;
      // Mark tab list stale so next POINT rebuilds it fresh
      if (prevGesture === 'POINT') tabDirty = true;
      return;
    }

    const g   = classify(lm);
    const now = Date.now();

    // Track consecutive pinch frames for debounce
    if (g === 'PINCH') { pinchFrames++; } else { pinchFrames = 0; }

    // When gesture changes away from POINT, mark tab list stale
    if (prevGesture === 'POINT' && g !== 'POINT') tabDirty = true;

    switch (g) {

      case 'OPEN_PALM':
        scrollDir = 1; startScrollRaf();
        setLabel('🖐️  Scroll Down');
        break;

      case 'THUMBS_UP':
        scrollDir = -1; startScrollRaf();
        setLabel('👍  Scroll Up');
        break;

      case 'FIST':
        scrollDir = 0; stopScrollRaf();
        setLabel('✊  Stop');
        break;

      case 'VICTORY':
        scrollDir = 0; stopScrollRaf();
        if (now - lastNav > NAV_COOLDOWN) {
          const name = jumpSection(1);
          setLabel(`✌️  → ${name}`, 1200);
          lastNav = now;
        }
        break;

      case 'THREE_FINGERS':
        scrollDir = 0; stopScrollRaf();
        if (now - lastNav > NAV_COOLDOWN) {
          const name = jumpSection(-1);
          setLabel(`🤟  ← ${name}`, 1200);
          lastNav = now;
        }
        break;

      case 'POINT':
        scrollDir = 0; stopScrollRaf();
        if (now - lastTab > TAB_COOLDOWN) {
          // Rebuild tab list only when entering POINT fresh
          if (tabDirty) { refreshTabList(); tabDirty = false; }
          cycleTab(1);
          setLabel('☝️  Focus Next');
          lastTab = now;
        }
        break;

      case 'PINCH':
        scrollDir = 0; stopScrollRaf();
        // Require PINCH_FRAMES consecutive frames + cooldown to fire
        if (pinchFrames === PINCH_FRAMES && now - lastPinch > PINCH_COOLDOWN) {
          smartAction(now);
          lastPinch = now;
          // Lockout tab for a moment too so we don't accidentally re-tab
          lastTab = now;
        } else if (pinchFrames < PINCH_FRAMES) {
          setLabel('🤏  Hold…');
        }
        break;

      default:
        scrollDir = 0; stopScrollRaf();
        setLabel('');
    }

    prevGesture = g;
  }

  // ── Gesture classifier ────────────────────────────────────
  function classify(lm) {
    function up(tip, pip) { return lm[tip].y < lm[pip].y - 0.03; }
    const i = up(8,6), m = up(12,10), r = up(16,14), p = up(20,18);
    const thumbUp  = lm[4].y < lm[3].y - 0.06;
    const thumbExt = Math.abs(lm[4].x - lm[2].x) > 0.08;
    const dx = lm[4].x - lm[8].x, dy = lm[4].y - lm[8].y;
    const pinchDist = Math.sqrt(dx*dx + dy*dy);

    if (pinchDist < PINCH_THRESH)           return 'PINCH';
    if (i && m && r && p)                   return 'OPEN_PALM';
    if (!i && !m && !r && !p && !thumbExt)  return 'FIST';
    if (i && m && !r && !p)                 return 'VICTORY';
    if (i && m && r && !p && !thumbExt)     return 'THREE_FINGERS';
    if (!i && !m && !r && !p && thumbUp)    return 'THUMBS_UP';
    if (i && !m && !r && !p)               return 'POINT';
    return null;
  }

  // ── Scroll RAF ────────────────────────────────────────────
  function startScrollRaf() {
    if (rafScroll) return;
    (function tick() {
      if (scrollDir !== 0) {
        window.scrollBy(0, scrollDir * SCROLL_SPEED);
        rafScroll = requestAnimationFrame(tick);
      } else { rafScroll = null; }
    })();
  }
  function stopScrollRaf() {
    if (rafScroll) { cancelAnimationFrame(rafScroll); rafScroll = null; }
  }

  // ── Section jump ──────────────────────────────────────────
  function jumpSection(dir) {
    const mid = window.scrollY + window.innerHeight / 2;
    let ci = 0, cd = Infinity;
    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const d = Math.abs(el.getBoundingClientRect().top + window.scrollY - mid);
      if (d < cd) { cd = d; ci = i; }
    });
    const ni = Math.max(0, Math.min(SECTIONS.length - 1, ci + dir));
    const el = document.getElementById(SECTIONS[ni]);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    return SECTIONS[ni].charAt(0).toUpperCase() + SECTIONS[ni].slice(1);
  }

  // ── Tab cycling ───────────────────────────────────────────
  function refreshTabList() {
    _tabList = [...document.querySelectorAll(
      'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), .cert-card, .exp-nav-item'
    )].filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= -20 && r.bottom <= window.innerHeight + 20 && r.width > 0;
    });
    // Keep _tabIndex pointing at same element if possible after rebuild
    if (_focusedEl) {
      const idx = _tabList.indexOf(_focusedEl);
      _tabIndex = idx >= 0 ? idx : -1;
    }
  }

  function cycleTab(dir) {
    if (!_tabList.length) return;
    clearGestureFocus();
    _tabIndex = (_tabIndex + dir + _tabList.length) % _tabList.length;
    _focusedEl = _tabList[_tabIndex];
    _focusedEl.classList.add('gesture-focused');
    _focusedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // ── Smart action ──────────────────────────────────────────
  function smartAction() {
    const projectModal = document.getElementById('project-modal');
    const certModal    = document.getElementById('cert-modal');

    if (projectModal && projectModal.classList.contains('open')) {
      document.getElementById('modal-close')?.click();
      setLabel('✕  Modal Closed', 1200);
      clearGestureFocus();
      return;
    }
    if (certModal && certModal.classList.contains('open')) {
      document.getElementById('cert-modal-close')?.click();
      setLabel('✕  Modal Closed', 1200);
      clearGestureFocus();
      return;
    }
    if (_focusedEl) {
      const el = _focusedEl;
      clearGestureFocus();
      setLabel('🤏  Opened!', 900);
      // Small delay so focus ring clears before click
      setTimeout(() => { el.click(); tabDirty = true; }, 80);
    } else {
      setLabel('☝️  Point to an item first', 1500);
    }
  }

  // ── Focus helpers ─────────────────────────────────────────
  function clearGestureFocus() {
    if (_focusedEl) { _focusedEl.classList.remove('gesture-focused'); _focusedEl = null; }
  }

  // ── Legend ────────────────────────────────────────────────
  function showLegend() {
    if (!hint) return;
    hint.innerHTML = `<div style="font-size:10.5px;line-height:1.8;color:rgba(0,200,255,.88);font-family:'JetBrains Mono',monospace;padding:4px 0">
      🖐️ Palm → Scroll Down<br>
      👍 Thumb Up → Scroll Up<br>
      ✊ Fist → Stop<br>
      ✌️ Victory → Next Section<br>
      🤟 3 Fingers → Prev Section<br>
      ☝️ Point → Highlight Item<br>
      🤏 Pinch (hold) → Open / Close
    </div>`;
    hint.style.opacity = '1';
    setTimeout(() => { hint.style.opacity = '0'; }, 10000);
  }

  // ── Label util ────────────────────────────────────────────
  let _lt;
  function setLabel(txt, dur = 0) {
    if (!label) return;
    label.textContent = txt;
    clearTimeout(_lt);
    if (dur) _lt = setTimeout(() => { label.textContent = ''; }, dur);
  }

})();
