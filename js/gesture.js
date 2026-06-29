// Gesture Navigation — MediaPipe Hands (browser-only, no server)
(function () {
  'use strict';

  const SCROLL_AMT   = 100;
  const NAV_COOLDOWN = 900;
  const SCR_COOLDOWN = 180;
  const PINCH_THRESH = 0.06; // normalised distance thumb↔index for pinch

  let enabled    = false;
  let mpHands    = null;
  let mpCamera   = null;
  let lastNav    = 0;
  let lastScroll = 0;
  let lastPinch  = 0;
  let prevGesture = null;

  const SECTIONS = ['hero','about','experience','projects','research','skills','certificates','contact'];

  // ── DOM refs ────────────────────────────────────────────────
  const toggle  = document.getElementById('gesture-toggle');
  const panel   = document.getElementById('gesture-panel');
  const preview = document.getElementById('gesture-preview');
  const label   = document.getElementById('gesture-label');
  const hint    = document.getElementById('gesture-hint');
  if (!toggle || !preview) return;

  // ── Toggle ──────────────────────────────────────────────────
  toggle.addEventListener('click', () => enabled ? stop() : start());

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

  // ── Script loader (sequential) ──────────────────────────────
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

  // ── MediaPipe init ──────────────────────────────────────────
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
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.55
    });
    mpHands.onResults(onResults);

    mpCamera = new window.Camera(preview, {
      onFrame: async () => {
        if (enabled && mpHands) await mpHands.send({ image: preview });
      },
      width: 320, height: 240
    });
    mpCamera.start();

    enabled = true;
    toggle.classList.add('active');
    toggle.querySelector('.gest-icon').textContent = '✋';
    panel.classList.add('visible');
    if (hint) { hint.style.opacity = '1'; setTimeout(() => { hint.style.opacity = '0'; }, 6000); }
  }

  // ── Result handler ──────────────────────────────────────────
  function onResults(results) {
    const lm = results.multiHandLandmarks && results.multiHandLandmarks[0];
    if (!lm) { setLabel(''); prevGesture = null; return; }

    const g   = classify(lm);
    const now = Date.now();

    switch (g) {
      case 'OPEN_PALM': {
        // Wrist y position: lower in frame (larger y) → scroll down
        const dir = lm[0].y > 0.5 ? 1 : -1;
        if (now - lastScroll > SCR_COOLDOWN) {
          window.scrollBy({ top: dir * SCROLL_AMT, behavior: 'smooth' });
          setLabel(dir > 0 ? '↓ Scroll Down' : '↑ Scroll Up');
          lastScroll = now;
        }
        break;
      }
      case 'FIST': {
        const dir = lm[0].y > 0.5 ? -1 : 1; // fist is opposite
        if (now - lastScroll > SCR_COOLDOWN) {
          window.scrollBy({ top: dir * SCROLL_AMT, behavior: 'smooth' });
          setLabel(dir > 0 ? '↓ Scroll Down' : '↑ Scroll Up');
          lastScroll = now;
        }
        break;
      }
      case 'VICTORY':
        if (now - lastNav > NAV_COOLDOWN) {
          const name = jumpSection(1);
          setLabel(`→ ${name}`);
          lastNav = now;
        }
        break;

      case 'THUMBS_UP':
        if (now - lastNav > NAV_COOLDOWN) {
          const name = jumpSection(-1);
          setLabel(`← ${name}`);
          lastNav = now;
        }
        break;

      case 'POINT':
        // Index finger pointing — highlight nearest button in viewport
        highlightNearestBtn();
        setLabel('☝ Point');
        break;

      case 'PINCH':
        // Thumb + index pinch — click highlighted element
        if (now - lastPinch > 900 && prevGesture === 'POINT') {
          clickFocused();
          setLabel('👌 Click!');
          lastPinch = now;
        }
        break;

      default:
        setLabel('');
        clearGestureFocus();
    }

    prevGesture = g;
  }

  // ── Gesture classifier ───────────────────────────────────────
  function classify(lm) {
    function up(tip, pip) { return lm[tip].y < lm[pip].y - 0.03; }

    const i = up(8, 6), m = up(12, 10), r = up(16, 14), p = up(20, 18);
    const thumbUp  = lm[4].y < lm[3].y - 0.06;
    const thumbExt = Math.abs(lm[4].x - lm[2].x) > 0.08;

    // Pinch: thumb tip and index tip very close
    const dx = lm[4].x - lm[8].x, dy = lm[4].y - lm[8].y;
    const pinchDist = Math.sqrt(dx*dx + dy*dy);

    if (pinchDist < PINCH_THRESH)           return 'PINCH';
    if (i && m && r && p)                   return 'OPEN_PALM';
    if (!i && !m && !r && !p && !thumbExt)  return 'FIST';
    if (i && m && !r && !p)                 return 'VICTORY';
    if (!i && !m && !r && !p && thumbUp)    return 'THUMBS_UP';
    if (i && !m && !r && !p)               return 'POINT';
    return null;
  }

  // ── Section navigation ───────────────────────────────────────
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

  // ── Point / click focus ──────────────────────────────────────
  let _focusedEl = null;

  function highlightNearestBtn() {
    const btns = [...document.querySelectorAll(
      '.btn-primary, .btn-ghost, .btn-outline-sm, .btn-case-study, .exp-nav-item, .cert-card, .project-card .btn-case-study'
    )].filter(el => {
      const r = el.getBoundingClientRect();
      return r.top > 0 && r.bottom < window.innerHeight && r.width > 0;
    });
    if (!btns.length) return;
    const mid = window.innerHeight / 2;
    btns.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return Math.abs(ra.top + ra.height/2 - mid) - Math.abs(rb.top + rb.height/2 - mid);
    });
    if (_focusedEl !== btns[0]) {
      clearGestureFocus();
      _focusedEl = btns[0];
      _focusedEl.classList.add('gesture-focused');
    }
  }

  function clickFocused() {
    if (_focusedEl) { _focusedEl.click(); clearGestureFocus(); }
  }

  function clearGestureFocus() {
    if (_focusedEl) { _focusedEl.classList.remove('gesture-focused'); _focusedEl = null; }
  }

  // ── Label util ────────────────────────────────────────────────
  let _lt;
  function setLabel(txt, dur = 0) {
    if (!label) return;
    label.textContent = txt;
    clearTimeout(_lt);
    if (dur) _lt = setTimeout(() => { label.textContent = ''; }, dur);
  }

})();
