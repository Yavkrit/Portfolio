// Dynamic DOM Rendering from portfolio-data.js
(function() {
  const P = window.PORTFOLIO;
  if (!P) return;

  // ── PDF.js setup ──────────────────────────────────────────
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  // ── EDUCATION ─────────────────────────────────────────────
  const eduWrap = document.getElementById('about-edu');
  if (eduWrap && P.education) {
    P.education.forEach(e => {
      eduWrap.innerHTML += `
        <div class="edu-item">
          <div class="edu-icon">🎓</div>
          <div>
            <div class="edu-degree">${e.degree}</div>
            <div class="edu-inst">${e.institution} · ${e.period}</div>
            <div class="edu-detail">${e.details}</div>
          </div>
        </div>`;
    });
  }

  // ── EXPERIENCE — Split Layout ─────────────────────────────
  const navPanel    = document.getElementById('exp-nav-panel');
  const detailPanel = document.getElementById('exp-detail-panel');

  function renderExpDetail(exp) {
    if (!detailPanel) return;
    const techHtml = (exp.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');
    const hlHtml   = (exp.highlights  || []).map(h => `<li class="exp-detail-hl">${h}</li>`).join('');
    const clients  = exp.clients ? `<div class="exp-detail-clients"><strong>Key Clients:</strong> ${exp.clients.join(' · ')}</div>` : '';
    const sup      = exp.supervisor ? `<div class="exp-detail-clients"><strong>Supervisor:</strong> ${exp.supervisor}</div>` : '';
    const note     = exp.note ? `<div class="exp-detail-note">🔒 ${exp.note}</div>` : '';

    detailPanel.innerHTML = `
      <div class="exp-detail-card">
        <div class="exp-detail-header">
          <div class="exp-detail-role">${exp.role}</div>
          <div class="exp-detail-company">${exp.company}</div>
          <div class="exp-detail-meta">
            <span class="exp-detail-period">${exp.period}</span>
            <span class="exp-detail-loc">📍 ${exp.location}</span>
            <span class="exp-detail-badge ${exp.type}">${exp.type}</span>
          </div>
        </div>
        <p class="exp-detail-desc">${exp.description}</p>
        <div class="exp-detail-section-title">Key Contributions</div>
        <ul class="exp-detail-highlights">${hlHtml}</ul>
        ${clients}${sup}
        <div class="exp-detail-section-title">Technologies</div>
        <div class="exp-detail-tech">${techHtml}</div>
        ${note}
      </div>`;
  }

  if (navPanel && P.experience) {
    P.experience.forEach((exp, i) => {
      const item = document.createElement('div');
      item.className = 'exp-nav-item' + (i === 0 ? ' active' : '');
      item.innerHTML = `
        <div class="exp-nav-dot"></div>
        <div class="exp-nav-text">
          <div class="exp-nav-company">${exp.shortName || exp.company.split('(')[0].trim()}</div>
          <div class="exp-nav-period">${exp.period}</div>
        </div>
        <span class="exp-nav-badge ${exp.type}">${exp.type}</span>`;
      item.addEventListener('click', () => {
        document.querySelectorAll('.exp-nav-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        renderExpDetail(exp);
      });
      navPanel.appendChild(item);
    });
    // Render first by default
    if (P.experience.length) renderExpDetail(P.experience[0]);
  }

  // ── PROJECTS ──────────────────────────────────────────────
  const projectsGrid = document.getElementById('projects-grid');
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose   = document.getElementById('modal-close');

  // Animated capstone canvas per project
  function initCapstoneCanvas(canvas, color1, color2) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 480;
    canvas.height = canvas.offsetHeight || 200;
    const W = canvas.width, H = canvas.height;
    const particles = Array.from({length: 40}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      r: Math.random()*2+1, alpha: Math.random()*.7+.1
    }));

    function draw() {
      ctx.clearRect(0,0,W,H);
      // Draw gradient background
      const grad = ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0, 'rgba(5,10,18,1)');
      grad.addColorStop(1, 'rgba(11,20,33,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,W,H);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,180,255,0.06)';
      ctx.lineWidth = 1;
      for (let x=0; x<W; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y=0; y<H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        const pg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
        pg.addColorStop(0, color1.replace(')',`,${p.alpha})`).replace('rgb','rgba'));
        pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pg;
        ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
        ctx.fill();
      });

      // Connect nearby particles
      for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,180,255,${.15*(1-dist/80)})`;
            ctx.lineWidth = .5;
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  if (projectsGrid) {
    P.projects.forEach(p => {
      const tagsHtml = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
      const statusCls = p.status === 'Completed' ? 'status-completed' : 'status-progress';

      let thumbHtml;
      if (p.isCapstone) {
        thumbHtml = `
          <div class="project-capstone-vis">
            <canvas class="capstone-canvas" data-id="${p.id}"></canvas>
            <div class="capstone-icon-overlay">${p.capstoneIcon || '📊'}</div>
            <div class="capstone-label">${p.category}</div>
          </div>`;
      } else if (p.customVis === 'camera') {
        thumbHtml = `
          <div class="project-thumb">
            <canvas class="custom-vis-canvas" data-vis="camera" data-id="${p.id}" style="width:100%;height:100%;display:block"></canvas>
            <span class="project-status-badge ${statusCls}">${p.status}</span>
          </div>`;
      } else if (p.customVis === 'thz_plantar') {
        thumbHtml = `
          <div class="project-thumb">
            <canvas class="custom-vis-canvas" data-vis="thz_plantar" data-id="${p.id}" style="width:100%;height:100%;display:block"></canvas>
            <span class="project-status-badge ${statusCls}">${p.status}</span>
          </div>`;
      } else if (p.heroImage) {
        thumbHtml = `
          <div class="project-thumb">
            <img src="${p.heroImage}" class="project-thumb-img" alt="${p.title}" loading="lazy"
              onerror="this.parentElement.innerHTML='<div class=\\'project-thumb-placeholder\\'><div class=\\'project-thumb-icon\\'>⚙️</div></div>'">
            <span class="project-status-badge ${statusCls}">${p.status}</span>
          </div>`;
      } else {
        const icon = '📡';
        thumbHtml = `
          <div class="project-thumb">
            <div class="project-thumb-placeholder"><div class="project-thumb-icon">${icon}</div></div>
            <span class="project-status-badge ${statusCls}">${p.status}</span>
          </div>`;
      }

      const paperBtn = (!p.isCapstone && p.links.paper)
        ? `<a href="${p.links.paper}" target="_blank" class="btn-gh">📄 Full Report ↗</a>`
        : '';
      const ghBtn = p.links.github
        ? `<a href="${p.links.github}" target="_blank" class="btn-gh">GitHub ↗</a>`
        : '';
      const presBtn = p.links && p.links.presentation
        ? `<a href="${p.links.presentation}" target="_blank" class="btn-gh">🌐 View Webpage ↗</a>`
        : '';

      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        ${thumbHtml}
        <div class="project-body">
          <div class="project-category">${p.category}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-subtitle">${p.subtitle}</p>
          <p class="project-overview-text">${p.overview.replace(/\n/g,' ').slice(0,190)}…</p>
          <div class="project-tags">${tagsHtml}</div>
          <div class="project-cta">
            <button class="btn-case-study" onclick="openProject('${p.id}')">View Case Study →</button>
            ${paperBtn}${presBtn}${ghBtn}
          </div>
        </div>`;
      projectsGrid.appendChild(card);

      // Init canvases after DOM insert
      requestAnimationFrame(() => {
        if (p.isCapstone) {
          const cvs = card.querySelector(`.capstone-canvas[data-id="${p.id}"]`);
          initCapstoneCanvas(cvs, 'rgb(0,180,255)', 'rgb(168,85,247)');
        } else if (p.customVis === 'camera') {
          const cvs = card.querySelector(`.custom-vis-canvas[data-id="${p.id}"]`);
          initCameraVis(cvs);
        } else if (p.customVis === 'thz_plantar') {
          const cvs = card.querySelector(`.custom-vis-canvas[data-id="${p.id}"]`);
          initTHzVis(cvs);
        }
      });
    });
  }

  window.openProject = function(id) {
    const p = P.projects.find(x => x.id === id);
    if (!p || !modalContent) return;

    const archHtml  = (p.architecture || []).map(a => `<li>${a}</li>`).join('');
    const resHtml   = (p.results      || []).map(r => `<li>${r}</li>`).join('');
    const techHtml  = (p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    const heroImgHtml = p.heroImage
      ? `<img src="${p.heroImage}" class="modal-hero-img" alt="${p.title}" loading="lazy">`
      : '';

    const confidentialNote = p.confidential
      ? `<div class="modal-confidential">🔒 This is active doctoral research. Detailed methodology, implementation specifics, and results are intentionally withheld. Only a high-level overview is shared publicly.</div>`
      : '';

    const industryNote = p.industryNote
      ? `<div class="modal-industry-note">${p.industryNote}</div>`
      : '';

    const capstoneHeader = p.isCapstone
      ? `<div style="padding:32px 48px 0;background:var(--bg-panel);display:flex;align-items:center;gap:16px;border-bottom:1px solid var(--border-dim)">
           <span style="font-size:40px">${p.capstoneIcon || '📊'}</span>
           <div>
             <div style="font-size:10px;letter-spacing:3px;color:var(--accent-purple);text-transform:uppercase;margin-bottom:4px">Capstone Project</div>
             <div style="font-size:13px;color:var(--text-secondary)">${p.category}</div>
           </div>
         </div>`
      : '';

    const paperLink = (!p.isCapstone && p.links.paper)
      ? `<a href="${p.links.paper}" target="_blank" class="btn-primary" style="font-size:12px">📄 Download Full Report ↗</a>`
      : '';
    const ghLink = p.links.github
      ? `<a href="${p.links.github}" target="_blank" class="btn-ghost">View GitHub ↗</a>`
      : '';
    const presLink = p.links && p.links.presentation
      ? `<a href="${p.links.presentation}" target="_blank" class="btn-ghost">🌐 View Webpage ↗</a>`
      : '';

    modalContent.innerHTML = `
      ${heroImgHtml}
      ${capstoneHeader}
      <div style="padding:48px">
        <div class="modal-header">
          <div class="modal-category">${p.category} · ${p.year}</div>
          <h2 class="modal-title">${p.title}</h2>
          <p class="modal-subtitle">${p.subtitle}</p>
        </div>
        ${confidentialNote}${industryNote}
        <div class="modal-section">
          <div class="modal-section-title">Overview</div>
          <p class="modal-text">${p.overview.replace(/\n/g,'<br>')}</p>
        </div>
        <div class="modal-section">
          <div class="modal-section-title">Problem Statement</div>
          <p class="modal-text">${p.problem.replace(/\n/g,'<br>')}</p>
        </div>
        <div class="modal-section">
          <div class="modal-section-title">Solution</div>
          <p class="modal-text">${p.solution.replace(/\n/g,'<br>')}</p>
        </div>
        ${!p.confidential && archHtml ? `
        <div class="modal-section">
          <div class="modal-section-title">Architecture / Methodology</div>
          <ul class="modal-list">${archHtml}</ul>
        </div>` : ''}
        <div class="modal-section">
          <div class="modal-section-title">Results & Outcomes</div>
          <ul class="modal-list modal-results">${resHtml}</ul>
        </div>
        <div class="modal-section">
          <div class="modal-section-title">Technologies Used</div>
          <div class="modal-tags">${techHtml}</div>
        </div>
        <div class="modal-links">${paperLink}${presLink}${ghLink}</div>
      </div>`;

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => { projectModal.classList.remove('open'); document.body.style.overflow = ''; });
  }
  if (projectModal) {
    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) { projectModal.classList.remove('open'); document.body.style.overflow = ''; }
    });
  }

  // ── RESEARCH ──────────────────────────────────────────────
  const rCard = document.getElementById('research-hero-card');
  if (rCard && P.research.current) {
    const r = P.research.current;
    const hlHtml = r.highlights.map(h => `<li>${h}</li>`).join('');
    rCard.innerHTML = `
      <div class="research-badge">🔬 Active Doctoral Research · CSIR-CSIO / AcSIR</div>
      <h3 class="research-title">${r.title}</h3>
      <div class="research-meta">
        <div class="research-meta-item"><strong>Institution:</strong> ${r.institution}</div>
        <div class="research-meta-item"><strong>Supervisor:</strong> ${r.supervisor}</div>
        <div class="research-meta-item"><strong>Focus Areas:</strong> ${r.focus}</div>
      </div>
      <p class="research-summary">${r.summary.replace(/\n/g,' ')}</p>
      <div class="modal-section-title" style="margin-bottom:14px">Research Highlights</div>
      <ul class="research-highlights">${hlHtml}</ul>
      <div class="research-confidential">
        🔒 <strong>Note:</strong> This is active, ongoing doctoral research. Detailed methodology, experimental data, and results are not disclosed publicly at this stage.
      </div>`;
  }

  // ── SKILLS ────────────────────────────────────────────────
  const SKILL_ICONS = {
    'Languages & Programming': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="8" fill="rgba(0,180,255,0.08)"/><path d="M10 10L6 14L10 18" stroke="#00b4ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 10L22 14L18 18" stroke="#00b4ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 8L13 20" stroke="rgba(0,180,255,0.5)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    'Embedded & Hardware': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="8" fill="rgba(0,180,255,0.08)"/><rect x="9" y="9" width="10" height="10" rx="1.5" stroke="#00b4ff" stroke-width="1.6"/><rect x="11" y="11" width="6" height="6" rx="1" fill="rgba(0,180,255,0.2)"/><line x1="9" y1="12" x2="6" y2="12" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="9" y1="16" x2="6" y2="16" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="19" y1="12" x2="22" y2="12" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="19" y1="16" x2="22" y2="16" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="12" y1="9" x2="12" y2="6" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="16" y1="9" x2="16" y2="6" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="12" y1="19" x2="12" y2="22" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/><line x1="16" y1="19" x2="16" y2="22" stroke="#00b4ff" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    'Protocols & Standards': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="8" fill="rgba(0,180,255,0.08)"/><circle cx="14" cy="14" r="2.5" fill="#00b4ff"/><circle cx="7" cy="10" r="1.8" stroke="#00b4ff" stroke-width="1.4"/><circle cx="21" cy="10" r="1.8" stroke="#00b4ff" stroke-width="1.4"/><circle cx="7" cy="19" r="1.8" stroke="#00b4ff" stroke-width="1.4"/><circle cx="21" cy="19" r="1.8" stroke="#00b4ff" stroke-width="1.4"/><line x1="11.5" y1="13" x2="8.5" y2="11.2" stroke="rgba(0,180,255,0.6)" stroke-width="1.2"/><line x1="16.5" y1="13" x2="19.5" y2="11.2" stroke="rgba(0,180,255,0.6)" stroke-width="1.2"/><line x1="11.5" y1="15" x2="8.5" y2="17.2" stroke="rgba(0,180,255,0.6)" stroke-width="1.2"/><line x1="16.5" y1="15" x2="19.5" y2="17.2" stroke="rgba(0,180,255,0.6)" stroke-width="1.2"/></svg>`,
    'AI & Data Science': `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="28" rx="8" fill="rgba(168,85,247,0.08)"/><circle cx="14" cy="14" r="3" fill="rgba(168,85,247,0.3)" stroke="#a855f7" stroke-width="1.4"/><circle cx="14" cy="6" r="1.8" stroke="#a855f7" stroke-width="1.3"/><circle cx="14" cy="22" r="1.8" stroke="#a855f7" stroke-width="1.3"/><circle cx="6" cy="14" r="1.8" stroke="#a855f7" stroke-width="1.3"/><circle cx="22" cy="14" r="1.8" stroke="#a855f7" stroke-width="1.3"/><line x1="14" y1="11" x2="14" y2="7.8" stroke="rgba(168,85,247,0.7)" stroke-width="1.2"/><line x1="14" y1="17" x2="14" y2="20.2" stroke="rgba(168,85,247,0.7)" stroke-width="1.2"/><line x1="11" y1="14" x2="7.8" y2="14" stroke="rgba(168,85,247,0.7)" stroke-width="1.2"/><line x1="17" y1="14" x2="20.2" y2="14" stroke="rgba(168,85,247,0.7)" stroke-width="1.2"/><circle cx="8" cy="8" r="1.5" stroke="rgba(168,85,247,0.5)" stroke-width="1.2"/><circle cx="20" cy="8" r="1.5" stroke="rgba(168,85,247,0.5)" stroke-width="1.2"/><circle cx="8" cy="20" r="1.5" stroke="rgba(168,85,247,0.5)" stroke-width="1.2"/><circle cx="20" cy="20" r="1.5" stroke="rgba(168,85,247,0.5)" stroke-width="1.2"/><line x1="11.2" y1="11.2" x2="9.1" y2="9.1" stroke="rgba(168,85,247,0.4)" stroke-width="1"/><line x1="16.8" y1="11.2" x2="18.9" y2="9.1" stroke="rgba(168,85,247,0.4)" stroke-width="1"/><line x1="11.2" y1="16.8" x2="9.1" y2="18.9" stroke="rgba(168,85,247,0.4)" stroke-width="1"/><line x1="16.8" y1="16.8" x2="18.9" y2="18.9" stroke="rgba(168,85,247,0.4)" stroke-width="1"/></svg>`,
  };

  const skillsOuter = document.getElementById('skills-outer');
  if (skillsOuter) {
    Object.entries(P.skills).forEach(([cat, skills]) => {
      const icon = SKILL_ICONS[cat] || '';
      const skillsHtml = skills.map(s => `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">${s.name}</span>
            <span class="skill-pct">${s.level}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" data-width="${s.level}"></div>
          </div>
        </div>`).join('');
      skillsOuter.innerHTML += `
        <div class="skill-category">
          <div class="skill-cat-title">${icon}<span>${cat}</span></div>
          <div class="skill-list">${skillsHtml}</div>
        </div>`;
    });
  }

  // ── CERTIFICATES with PDF.js thumbnails ──────────────────
  const certsGrid        = document.getElementById('certs-grid');
  const certModal        = document.getElementById('cert-modal');
  const certModalContent = document.getElementById('cert-modal-content');
  const certModalClose   = document.getElementById('cert-modal-close');

  async function renderPdfThumb(pdfUrl, container) {
    const lib = window.pdfjsLib;
    if (!lib) { container.innerHTML = `<div class="cert-thumb-placeholder-icon">📜</div>`; return; }

    // Always (re)set worker here — safe to call multiple times
    lib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    container.innerHTML = `<div class="cert-thumb-loading"><div class="cert-thumb-spinner"></div><span>LOADING</span></div>`;
    try {
      const pdf      = await lib.getDocument(pdfUrl).promise;
      const page     = await pdf.getPage(1);
      const srcVP    = page.getViewport({ scale: 1 });

      // Use fixed 280px target width — reliable regardless of container paint state
      const scale    = 280 / srcVP.width;
      const viewport = page.getViewport({ scale });

      const canvas   = document.createElement('canvas');
      canvas.className = 'cert-thumb-canvas';
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      canvas.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';

      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

      container.innerHTML = '';
      container.appendChild(canvas);
      const ov = document.createElement('div');
      ov.className = 'cert-thumb-overlay';
      ov.textContent = '🔍 View PDF';
      container.appendChild(ov);
    } catch (err) {
      container.innerHTML = `<div class="cert-thumb-placeholder-icon">📜</div>`;
    }
  }

  if (certsGrid) {
    P.certificates.forEach(c => {
      const tagsHtml   = (c.tags || []).map(t => `<span class="cert-tag">${t}</span>`).join('');
      const multiNote  = c.pdfs && c.pdfs.length > 1 ? `<div class="cert-multi-badge">${c.pdfs.length} Certificates</div>` : '';
      const primaryPdf = c.pdfFile || (c.pdfs && c.pdfs[0].file) || null;

      const card = document.createElement('div');
      card.className = 'cert-card';
      card.innerHTML = `
        <div class="cert-thumb-wrap" id="cert-thumb-${c.id}">
          <div class="cert-thumb-loading"><div class="cert-thumb-spinner"></div><span>LOADING</span></div>
        </div>
        <div class="cert-body">
          ${multiNote}
          <div class="cert-title">${c.title}</div>
          <div class="cert-issuer">${c.issuer}</div>
          <div class="cert-date">${c.date}</div>
          <div class="cert-tags">${tagsHtml}</div>
        </div>`;
      card.addEventListener('click', () => openCert(c.id));
      certsGrid.appendChild(card);

      // Defer render so DOM is fully painted and pdfjsLib is guaranteed loaded
      const thumbWrap = document.getElementById(`cert-thumb-${c.id}`);
      if (primaryPdf && thumbWrap) {
        setTimeout(() => renderPdfThumb(primaryPdf, thumbWrap), 200);
      } else if (thumbWrap) {
        thumbWrap.innerHTML = `<div class="cert-thumb-placeholder-icon">📜</div>`;
      }
    });
  }

  window.openCert = function(id) {
    const c = P.certificates.find(x => x.id === id);
    if (!c || !certModalContent) return;

    // Multi-PDF cert
    if (c.pdfs && c.pdfs.length > 1) {
      let activeTab = 0;
      function buildViewer(tabIdx) {
        const tabsHtml = c.pdfs.map((p, i) =>
          `<button class="cert-tab-btn ${i===tabIdx?'active':''}" onclick="switchCertTab(${i})">${p.label}</button>`
        ).join('');
        certModalContent.innerHTML = `
          <div class="cert-pdf-viewer-wrap">
            <div class="cert-viewer-header">
              <div>
                <div class="cert-viewer-title">${c.title}</div>
                <div class="cert-viewer-issuer">${c.issuer} · ${c.date}</div>
              </div>
              <div class="cert-viewer-actions">
                <a href="${c.pdfs[tabIdx].file}" target="_blank" class="cert-open-btn">Open Full ↗</a>
              </div>
            </div>
            <div class="cert-tab-row">${tabsHtml}</div>
            <div class="cert-iframe-wrap">
              <iframe class="cert-pdf-iframe" src="${c.pdfs[tabIdx].file}" title="${c.title}"></iframe>
            </div>
          </div>`;
        window.switchCertTab = function(i) {
          activeTab = i;
          buildViewer(i);
        };
      }
      buildViewer(0);
    } else {
      // Single PDF
      const pdfSrc = c.pdfFile || (c.pdfs && c.pdfs[0].file) || null;
      if (pdfSrc) {
        certModalContent.innerHTML = `
          <div class="cert-pdf-viewer-wrap">
            <div class="cert-viewer-header">
              <div>
                <div class="cert-viewer-title">${c.title}</div>
                <div class="cert-viewer-issuer">${c.issuer} · ${c.date}</div>
              </div>
              <div class="cert-viewer-actions">
                <a href="${pdfSrc}" target="_blank" class="cert-open-btn">Open Full ↗</a>
              </div>
            </div>
            <div class="cert-iframe-wrap">
              <iframe class="cert-pdf-iframe" src="${pdfSrc}" title="${c.title}"></iframe>
            </div>
          </div>`;
      } else {
        certModalContent.innerHTML = `
          <div class="cert-modal-body">
            <div class="cert-modal-placeholder">📜</div>
            <div class="cert-modal-title">${c.title}</div>
            <div class="cert-modal-issuer">${c.issuer}</div>
            <div class="cert-modal-date">${c.date}</div>
          </div>`;
      }
    }

    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (certModalClose) certModalClose.addEventListener('click', () => { certModal.classList.remove('open'); document.body.style.overflow = ''; });
  if (certModal) certModal.addEventListener('click', e => { if (e.target === certModal) { certModal.classList.remove('open'); document.body.style.overflow = ''; } });

  // ── CAMERA VIS ────────────────────────────────────────────
  function initCameraVis(canvas) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 400, H = canvas.offsetHeight || 220;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    let t = 0;

    function drawCamera() {
      ctx.clearRect(0, 0, W, H);
      // Dark background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#050a12'); bg.addColorStop(1, '#0a1420');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,180,255,0.04)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      const cx = W/2, cy = H/2;
      const angle = t * 0.4;

      // Glow aura
      const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      aura.addColorStop(0, 'rgba(0,180,255,0.07)'); aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(cx, cy, 90, 0, Math.PI*2); ctx.fill();

      // 3D camera body wireframe (rotated box)
      const bw = 80, bh = 55, bd = 35;
      const cos = Math.cos(angle), sin = Math.sin(angle);

      function project([x, y, z]) {
        const rx = x*cos - z*sin, rz = x*sin + z*cos;
        const fov = 350, pz = rz + 200;
        return [cx + rx*fov/pz, cy + y*fov/pz];
      }

      const verts = [
        [-bw/2,-bh/2,-bd/2],[ bw/2,-bh/2,-bd/2],[ bw/2, bh/2,-bd/2],[-bw/2, bh/2,-bd/2],
        [-bw/2,-bh/2, bd/2],[ bw/2,-bh/2, bd/2],[ bw/2, bh/2, bd/2],[-bw/2, bh/2, bd/2],
      ].map(project);

      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.strokeStyle = 'rgba(0,180,255,0.6)'; ctx.lineWidth = 1.2;
      edges.forEach(([a,b]) => {
        ctx.beginPath(); ctx.moveTo(verts[a][0], verts[a][1]);
        ctx.lineTo(verts[b][0], verts[b][1]); ctx.stroke();
      });

      // Lens (circle on front face)
      const lc = project([0, 0, -bd/2]);
      const lr = 18;
      const lensGrad = ctx.createRadialGradient(lc[0], lc[1], 0, lc[0], lc[1], lr);
      lensGrad.addColorStop(0, 'rgba(0,180,255,0.35)'); lensGrad.addColorStop(0.5, 'rgba(0,100,200,0.15)'); lensGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lensGrad; ctx.beginPath(); ctx.arc(lc[0], lc[1], lr, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,180,255,0.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(lc[0], lc[1], lr, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,180,255,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(lc[0], lc[1], lr*0.6, 0, Math.PI*2); ctx.stroke();

      // Scan ring
      const pulse = 0.5 + 0.5*Math.sin(t * 2);
      ctx.strokeStyle = `rgba(0,180,255,${0.15 + pulse*0.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 60 + pulse*15, 0, Math.PI*2); ctx.stroke();

      // Data readout
      ctx.fillStyle = 'rgba(0,180,255,0.55)';
      ctx.font = '9px JetBrains Mono, monospace';
      const lines = ['ONVIF::ProfileT', 'SUNAPI v2.8', 'RTOS_SCHED: OK', 'BSP::STM32H7'];
      lines.forEach((l, i) => ctx.fillText(l, 14, 18 + i * 13));

      // Corner accent marks
      const corners = [[12,12],[W-12,12],[12,H-12],[W-12,H-12]];
      const dirs = [[1,1],[-1,1],[1,-1],[-1,-1]];
      ctx.strokeStyle = 'rgba(0,180,255,0.35)'; ctx.lineWidth = 1.5;
      corners.forEach(([x,y],[dx,dy]=dirs[corners.indexOf([x,y])]) => {
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+8*dx,y); ctx.moveTo(x,y); ctx.lineTo(x,y+8*dy); ctx.stroke();
      });

      t += 0.016;
      requestAnimationFrame(drawCamera);
    }
    drawCamera();
  }

  // ── THZ PLANTAR VIS ───────────────────────────────────────
  function initTHzVis(canvas) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 400, H = canvas.offsetHeight || 220;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    let t = 0;

    const footPath = new Path2D();
    const fx = W/2, fy = H/2 + 10, fs = 0.55;
    footPath.ellipse(fx, fy, 30*fs, 52*fs, 0, 0, Math.PI*2);

    function drawTHz() {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#04080f'); bg.addColorStop(1, '#080f1a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(168,85,247,0.04)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      const cx = W/2, cy = H/2;

      // Foot silhouette glow
      ctx.save();
      ctx.shadowColor = 'rgba(168,85,247,0.5)';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = 'rgba(168,85,247,0.7)';
      ctx.lineWidth = 1.8;

      // Draw simplified foot outline
      ctx.beginPath();
      ctx.ellipse(cx, cy+8, 22, 46, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();

      // Toes (5 ellipses at top)
      const toeAngles = [-0.35,-0.175,0,0.175,0.35];
      toeAngles.forEach((a, i) => {
        const tx2 = cx + Math.sin(a)*30, ty2 = cy - 42 + Math.abs(a)*8;
        const r = 6 - Math.abs(a)*4;
        ctx.beginPath();
        ctx.ellipse(tx2, ty2, r*0.7, r, 0, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(168,85,247,0.5)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // THz scan wave (horizontal lines sweeping)
      const scanY = cy - 46 + ((t * 30) % 95);
      for (let i = 0; i < 4; i++) {
        const sy = scanY + i * 3;
        const alpha = Math.max(0, 0.6 - i * 0.18);
        ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
        ctx.lineWidth = i === 0 ? 1.5 : 0.8;
        ctx.beginPath();
        const xStart = cx - 22, xEnd = cx + 22;
        ctx.moveTo(xStart, sy); ctx.lineTo(xEnd, sy);
        ctx.stroke();
      }

      // Heat map overlay on foot
      ctx.save();
      ctx.beginPath(); ctx.ellipse(cx, cy+8, 22, 46, 0, 0, Math.PI*2); ctx.clip();
      const heatGrad = ctx.createLinearGradient(cx-22, cy-38, cx+22, cy+54);
      heatGrad.addColorStop(0, 'rgba(168,85,247,0.08)');
      heatGrad.addColorStop(0.4, 'rgba(0,180,255,0.12)');
      heatGrad.addColorStop(0.7, 'rgba(168,85,247,0.15)');
      heatGrad.addColorStop(1, 'rgba(0,180,255,0.06)');
      ctx.fillStyle = heatGrad; ctx.fillRect(cx-25, cy-50, 50, 110);
      ctx.restore();

      // Pulsing outer ring
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);
      ctx.strokeStyle = `rgba(168,85,247,${0.12 + pulse*0.18})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 68 + pulse*10, 0, Math.PI*2); ctx.stroke();

      // Data readout
      ctx.fillStyle = 'rgba(168,85,247,0.55)';
      ctx.font = '9px JetBrains Mono, monospace';
      ['SUB-THz: 94 GHz', 'CW-FPA ACTIVE', 'AI ENHANCE: ON', 'AGE STRAT: v2'].forEach((l, i) =>
        ctx.fillText(l, 14, 18 + i * 13)
      );

      // Label bottom
      ctx.fillStyle = 'rgba(168,85,247,0.4)';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.fillText('PLANTAR IMAGING', cx - 40, H - 12);

      t += 0.016;
      requestAnimationFrame(drawTHz);
    }
    drawTHz();
  }

})();
