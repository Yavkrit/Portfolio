// Three.js — Enhanced Particle Background with Aurora & Depth
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // ── Particle field — 3 layers at different depths ────────
  const COUNTS  = [1400, 800, 400]; // near, mid, far
  const SPREADS = [22, 30, 40];
  const DEPTHS  = [8, 14, 20];
  const SIZES   = [0.05, 0.035, 0.022];
  const particleGroups = [];

  const c1 = new THREE.Color('#00b4ff'); // blue
  const c2 = new THREE.Color('#ff6b2b'); // orange
  const c3 = new THREE.Color('#a855f7'); // purple
  const c4 = new THREE.Color('#10b981'); // teal
  const palettes = [
    [c1, c1, c3],      // near: mostly blue + purple
    [c1, c2, c3, c4],  // mid: all colours
    [c3, c1]           // far: blue & purple
  ];

  COUNTS.forEach((COUNT, layer) => {
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const palette   = palettes[layer];

    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random()-.5) * SPREADS[layer];
      positions[i*3+1] = (Math.random()-.5) * SPREADS[layer];
      positions[i*3+2] = (Math.random()-.5) * DEPTHS[layer];

      const col = palette[Math.floor(Math.random() * palette.length)];
      // Slight colour variance per particle
      colors[i*3]   = col.r * (0.85 + Math.random()*0.3);
      colors[i*3+1] = col.g * (0.85 + Math.random()*0.3);
      colors[i*3+2] = col.b * (0.85 + Math.random()*0.3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const mat = new THREE.PointsMaterial({
      size: SIZES[layer],
      vertexColors: true,
      transparent: true,
      opacity: layer === 0 ? 0.65 : layer === 1 ? 0.45 : 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    particleGroups.push({ pts, speed: 0.018 - layer * 0.005 });
  });

  // ── Shooting-star streaks ─────────────────────────────────
  const streaks = [];
  function createStreak() {
    const geo = new THREE.BufferGeometry();
    const len = 0.4 + Math.random() * 0.6;
    const x   = (Math.random()-.5) * 20;
    const y   =  (Math.random()-.5) * 10;
    const z   = (Math.random()-.5) * 4;
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([x-len, y+len*0.3, z, x, y, z]), 3
    ));
    const mat = new THREE.LineBasicMaterial({
      color: Math.random() > 0.5 ? '#00b4ff' : '#a855f7',
      transparent: true, opacity: 0, blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    return { line, life: 0, maxLife: 60 + Math.random()*40 };
  }
  for (let i=0; i<6; i++) streaks.push(createStreak());

  // ── Mouse parallax ────────────────────────────────────────
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // ── Animation loop ────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.0003;

    // Smooth mouse lerp
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    // Rotate each layer at different speeds + mouse tilt
    particleGroups.forEach(({ pts, speed }, i) => {
      pts.rotation.y = t * speed         + mouseX * (0.4 - i * 0.08);
      pts.rotation.x = t * speed * 0.7  - mouseY * (0.3 - i * 0.06);
      // Gentle vertical drift per layer
      pts.position.y = Math.sin(t * 0.4 + i) * 0.04;
    });

    // Animate streaks
    streaks.forEach((s, idx) => {
      s.life++;
      const progress = s.life / s.maxLife;
      if (progress < 0.3) {
        s.line.material.opacity = progress / 0.3 * 0.7;
      } else {
        s.line.material.opacity = (1 - (progress - 0.3) / 0.7) * 0.7;
      }
      if (s.life > s.maxLife) {
        scene.remove(s.line);
        streaks[idx] = createStreak();
        // Stagger so not all reset at once
        streaks[idx].life = Math.random() * 30 | 0;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
