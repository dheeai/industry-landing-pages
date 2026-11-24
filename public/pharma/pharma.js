(() => {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reducedMotionQuery.matches;

  const stageEl = document.querySelector('.cinema-stage');
  const toggleBtn = document.querySelector('[data-motion-toggle]');
  const toggleLabel = document.querySelector('[data-motion-label]');
  const toggleIcon = document.querySelector('.toggle-icon');
  const resetCamBtn = document.querySelector('[data-reset-camera]');
  const yearNode = document.querySelector('[data-current-year]');
  const header = document.querySelector('[data-site-header]');
  const progressBar = document.querySelector('[data-progress-bar]');
  const cameraReadout = document.querySelector('[data-camera-readout]');

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------------
     1. Floating Adaptive Header Tone + Scroll Progress
     ------------------------------------------------------------------------ */
  const tonedSections = [...document.querySelectorAll('[data-section-tone]')];

  const updateScrollChrome = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
      const probeY = 56;
      let activeTone = 'dark';
      for (const sec of tonedSections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          activeTone = sec.dataset.sectionTone || 'dark';
          break;
        }
      }
      if (header.dataset.headerTone !== activeTone) {
        header.dataset.headerTone = activeTone;
      }
    }
  };

  updateScrollChrome();
  window.addEventListener('scroll', updateScrollChrome, { passive: true });
  window.addEventListener('resize', updateScrollChrome, { passive: true });

  /* ------------------------------------------------------------------------
     2. Magnetic Kinetic Buttons + Spotlight Cards
     ------------------------------------------------------------------------ */
  if (!isReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const pullX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const pullY = ((e.clientY - rect.top) / rect.height - 0.5) * 7;
        btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });

    document.querySelectorAll('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  /* ------------------------------------------------------------------------
     3. REAL-TIME 3D VOLUMETRIC MOLECULAR CINEMA ENGINE (HTML5 Canvas 3D)
     ------------------------------------------------------------------------ */
  const modes = {
    gpcr: {
      label: 'G-PROTEIN-COUPLED RECEPTOR',
      caption: 'FAMILY-LEVEL GPCR SCHEMATIC',
      sourceLabel: 'GPCR reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK541112/',
      desc: 'An illustrative 3D GPCR family diagram. GPCRs have seven transmembrane helices; this simplified model is not a particular receptor structure or drug mechanism.',
      stages: {
        recognition: {
          title: 'A signal meets a GPCR',
          copy: 'G-protein-coupled receptors span the membrane seven times. A bound signal can alter receptor activity; the specific pathway depends on the receptor and cell.',
          label: 'Ligand recognition'
        },
        relay: {
          title: 'The receptor engages a G protein',
          copy: 'Activated GPCRs can promote nucleotide exchange on associated heterotrimeric G proteins. Which G-protein family and downstream partners matter is receptor-specific.',
          label: 'G-protein activation'
        },
        response: {
          title: 'Signals branch inside the cell',
          copy: 'G-protein signaling can influence different intracellular effectors. This study shows a family-level concept, not a predicted response or therapeutic effect.',
          label: 'Cell-specific signaling'
        }
      }
    },
    channel: {
      label: 'LIGAND-GATED ION CHANNEL',
      caption: 'ION-CHANNEL FAMILY SCHEMATIC',
      sourceLabel: 'Ion-channel reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK554403/',
      desc: 'An illustrative 3D ligand-gated ion-channel diagram. Ligand binding can open a central pore and allow selected ions to cross the membrane.',
      stages: {
        recognition: {
          title: 'A ligand binds the channel',
          copy: 'For ligand-gated ion channels, ligand binding can change channel gating. The ligand, channel subtype, and binding details vary by system.',
          label: 'Ligand binding'
        },
        relay: {
          title: 'The channel pore opens',
          copy: 'Opening a channel allows selected ions to cross the membrane down their electrochemical gradients. The ion species and direction depend on the channel and conditions.',
          label: 'Channel opens'
        },
        response: {
          title: 'Ion movement carries the signal',
          copy: 'A change in ion flow can alter cellular electrical or biochemical activity. The downstream effect depends on the cell and channel context.',
          label: 'Ion flow'
        }
      }
    },
    nuclear: {
      label: 'INTRACELLULAR RECEPTOR',
      caption: 'NUCLEAR-RECEPTOR FAMILY SCHEMATIC',
      sourceLabel: 'Nuclear-receptor reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK26813/',
      desc: 'An illustrative 3D nuclear-receptor family diagram. Some small hydrophobic signals cross the membrane and bind intracellular receptors that interact with DNA.',
      stages: {
        recognition: {
          title: 'Some signals enter the cell',
          copy: 'Certain small, hydrophobic signals can cross the plasma membrane and bind intracellular receptors. This route does not apply to every signal or receptor.',
          label: 'Membrane passage'
        },
        relay: {
          title: 'The signal binds its receptor',
          copy: 'Ligand binding can change nuclear-receptor activity. Receptor location and what happens next vary across receptor types and cell contexts.',
          label: 'Receptor binding'
        },
        response: {
          title: 'Gene regulation is context-specific',
          copy: 'Some nuclear receptors interact with specific DNA sequences to regulate transcription. Which genes respond depends on the receptor and the target cell.',
          label: 'Transcription'
        }
      }
    }
  };

  const stageOrder = ['recognition', 'relay', 'response'];
  let activeMode = 'gpcr';
  let activeStage = 'recognition';
  let renderMode = 'optical';
  let isPaused = isReducedMotion;
  let autoTimer = null;

  // Interactive 3D Camera State
  let targetYaw = 0.25;
  let targetPitch = 0.22;
  let camYaw = 0.25;
  let camPitch = 0.22;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let simTime = 0;
  let stageProgress = 0; // smooth interpolation 0 -> 1 -> 2

  const canvas = document.querySelector('[data-mol-canvas]');
  const viewport = document.querySelector('[data-stage-viewport]');

  // Pre-seed ambient bokeh particles & lipid bilayer points
  const bokeh = Array.from({ length: 28 }, (_, i) => ({
    x: (Math.random() - 0.5) * 620,
    y: (Math.random() - 0.5) * 380,
    z: (Math.random() - 0.5) * 420,
    r: 1.5 + (i % 4) * 1.4,
    phase: Math.random() * Math.PI * 2,
    warm: i % 5 === 0
  }));

  const membraneHeads = [];
  for (let gx = -5; gx <= 5; gx++) {
    for (let gz = -2; gz <= 2; gz++) {
      const x = gx * 46;
      const z = gz * 44;
      if (Math.hypot(x, z) > 74) {
        membraneHeads.push({ x, y: -24, z });
        membraneHeads.push({ x, y: 24, z });
      }
    }
  }

  const getPalette = () => {
    if (renderMode === 'thermal') {
      return {
        proteinA: [255, 196, 112],
        proteinB: [215, 76, 56],
        ligand: [94, 234, 212],
        signal: [255, 138, 76],
        membrane: [180, 120, 140],
        wire: 'rgba(255, 176, 110, 0.55)'
      };
    }
    if (renderMode === 'wireframe') {
      return {
        proteinA: [94, 234, 212],
        proteinB: [59, 130, 246],
        ligand: [255, 107, 61],
        signal: [94, 234, 212],
        membrane: [94, 234, 212],
        wire: 'rgba(94, 234, 212, 0.55)'
      };
    }
    return {
      proteinA: [222, 249, 243],
      proteinB: [36, 176, 162],
      ligand: [255, 108, 62],
      signal: [94, 234, 212],
      membrane: [120, 196, 188],
      wire: 'rgba(94, 234, 212, 0.28)'
    };
  };

  if (canvas && canvas.getContext && viewport) {
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = viewport.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (x, y, z) => {
      const cy = Math.cos(camYaw);
      const sy = Math.sin(camYaw);
      const cp = Math.cos(camPitch);
      const sp = Math.sin(camPitch);

      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;

      const fov = 560;
      const scale = fov / (fov + z2 + 230);
      return {
        sx: W * 0.5 + x1 * scale,
        sy: H * 0.5 + y2 * scale,
        scale,
        z: z2
      };
    };

    const drawSphere = (p, radius, rgb, alpha, glow = false) => {
      const r = Math.max(1.2, radius * p.scale);
      if (renderMode === 'wireframe') {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, alpha * 0.9)})`;
        ctx.lineWidth = glow ? 1.5 : 1;
        ctx.stroke();
        return;
      }
      if (glow) {
        const halo = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 3.2);
        halo.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.45})`);
        halo.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      const grad = ctx.createRadialGradient(p.sx - r * 0.34, p.sy - r * 0.34, r * 0.08, p.sx, p.sy, r);
      grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.92})`);
      grad.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`);
      grad.addColorStop(1, `rgba(${Math.round(rgb[0] * 0.25)},${Math.round(rgb[1] * 0.32)},${Math.round(rgb[2] * 0.38)},${alpha})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const buildScenePoints = (t, stVal) => {
      const pal = getPalette();
      const items = [];
      const links = [];
      const relayAmt = Math.max(0, Math.min(1, stVal));
      const respAmt = Math.max(0, Math.min(1, stVal - 1));

      // Lipid bilayer field
      for (const h of membraneHeads) {
        const wave = Math.sin(t * 1.4 + h.x * 0.025 + h.z * 0.03) * 2.5;
        items.push({
          ...project(h.x, h.y + wave, h.z),
          r: 4.2,
          rgb: pal.membrane,
          a: 0.36,
          glow: false
        });
      }

      // Ambient bokeh
      for (const b of bokeh) {
        const bx = b.x + Math.sin(t * 0.4 + b.phase) * 14;
        const by = b.y + Math.cos(t * 0.35 + b.phase) * 10;
        items.push({
          ...project(bx, by, b.z),
          r: b.r,
          rgb: b.warm ? pal.ligand : pal.signal,
          a: 0.2,
          glow: true
        });
      }

      if (activeMode === 'gpcr') {
        // 7-Transmembrane Helices arranged in authentic elliptical GPCR bundle
        const helixCount = 7;
        for (let h = 0; h < helixCount; h++) {
          const angle = (h / helixCount) * Math.PI * 2 + 0.3;
          const shiftOut = h === 5 ? relayAmt * 18 : 0; // TM6 outward conformational shift!
          const baseX = Math.cos(angle) * (40 + shiftOut * 0.4);
          const baseZ = Math.sin(angle) * (28 + shiftOut * 0.4);
          let prev = null;
          for (let s = 0; s < 13; s++) {
            const frac = s / 12;
            const y = -76 + frac * 152;
            const twist = frac * Math.PI * 2.6 + h;
            const lowerOut = frac > 0.55 && h === 5 ? (frac - 0.55) * shiftOut * 1.8 : 0;
            const x = baseX + Math.cos(twist) * 5.2 + Math.cos(angle) * lowerOut;
            const z = baseZ + Math.sin(twist) * 5.2 + Math.sin(angle) * lowerOut;
            const p = project(x, y, z);
            const blend = 1 - Math.abs(frac - 0.5) * 0.7;
            const rgb = [
              Math.round(pal.proteinB[0] + (pal.proteinA[0] - pal.proteinB[0]) * blend),
              Math.round(pal.proteinB[1] + (pal.proteinA[1] - pal.proteinB[1]) * blend),
              Math.round(pal.proteinB[2] + (pal.proteinA[2] - pal.proteinB[2]) * blend)
            ];
            items.push({ ...p, r: 7.4, rgb, a: 0.92, glow: false });
            if (prev) links.push({ a: prev, b: p, color: pal.wire, w: 1.3 });
            prev = p;
          }
        }

        // Docking Ligand (descends into orthosteric pocket on stage 02/03)
        const ligY = -126 + relayAmt * 52 + (1 - relayAmt) * Math.sin(t * 2) * 8;
        const ligX = (1 - relayAmt) * Math.cos(t * 1.3) * 14;
        const ligPts = [
          [0, 0, 0],
          [11, -6, 6],
          [-11, -5, 6],
          [0, -13, -7],
          [8, 8, -5],
          [-9, 7, -4]
        ];
        const projLig = ligPts.map(([dx, dy, dz]) => project(ligX + dx, ligY + dy, dz));
        projLig.forEach((p, idx) => {
          items.push({ ...p, r: idx === 0 ? 11 : 6.2, rgb: pal.ligand, a: 0.98, glow: idx === 0 });
          if (idx > 0) links.push({ a: projLig[0], b: p, color: 'rgba(255, 168, 120, 0.7)', w: 1.6 });
        });

        // Stage 2: Heterotrimeric G-Protein Complex + Signal Energy Pulses
        if (relayAmt > 0.05) {
          const gCenters = [
            { x: -34, y: 118, z: 12, r: 17, rgb: pal.signal },
            { x: 34, y: 122, z: -10, r: 13, rgb: [96, 165, 250] },
            { x: 2, y: 132, z: 16, r: 10.5, rgb: pal.ligand }
          ];
          const anchor = project(8, 74, 0);
          gCenters.forEach((g) => {
            const p = project(g.x, g.y + Math.sin(t * 2.2 + g.x) * 3, g.z);
            items.push({ ...p, r: g.r * relayAmt, rgb: g.rgb, a: 0.92 * relayAmt, glow: true });
            links.push({ a: anchor, b: p, color: `rgba(94, 234, 212, ${0.5 * relayAmt})`, w: 1.8 });
          });
        }

        // Stage 3: Branching Intracellular Effectors
        if (respAmt > 0.05) {
          const hub = project(2, 132, 16);
          const effectors = [
            [-115, 168, 22],
            [115, 164, -18],
            [-64, 184, -42],
            [68, 184, 38]
          ];
          effectors.forEach(([ex, ey, ez], i) => {
            const pulse = 1 + Math.sin(t * 3 + i) * 0.14;
            const p = project(ex, ey, ez);
            items.push({ ...p, r: 10 * respAmt * pulse, rgb: i % 2 === 0 ? pal.signal : pal.ligand, a: 0.95 * respAmt, glow: true });
            links.push({ a: hub, b: p, color: `rgba(255, 142, 83, ${0.55 * respAmt})`, w: 1.5 });
          });
        }
      } else if (activeMode === 'channel') {
        // Pentameric Ligand-Gated Ion Channel Barrel (expands pore on relayAmt!)
        const subunits = 5;
        const poreRadius = 34 + relayAmt * 18;
        for (let u = 0; u < subunits; u++) {
          const ang = (u / subunits) * Math.PI * 2;
          let prev = null;
          for (let s = 0; s < 12; s++) {
            const frac = s / 11;
            const y = -82 + frac * 164;
            const funnel = frac < 0.3 ? (0.3 - frac) * 34 : 0;
            const rad = poreRadius + funnel + Math.sin(frac * Math.PI) * 8;
            const x = Math.cos(ang + frac * 0.35) * rad;
            const z = Math.sin(ang + frac * 0.35) * rad;
            const p = project(x, y, z);
            items.push({ ...p, r: 9.2, rgb: s % 2 === 0 ? pal.proteinA : pal.proteinB, a: 0.92, glow: false });
            if (prev) links.push({ a: prev, b: p, color: pal.wire, w: 1.5 });
            prev = p;
          }
        }

        // Two Ligands docking on extracellular subunits
        [-1, 1].forEach((side) => {
          const lx = side * (62 - relayAmt * 14);
          const ly = -76 + relayAmt * 14 + (1 - relayAmt) * Math.sin(t * 2.2) * 7;
          const p = project(lx, ly, side * 12);
          items.push({ ...p, r: 10.5, rgb: pal.ligand, a: 0.98, glow: true });
        });

        // Streaming Ion Spheres through Central Aqueous Pore
        if (relayAmt > 0.05) {
          for (let k = 0; k < 8; k++) {
            const flow = ((t * 0.72 + k / 8) % 1);
            const iy = -125 + flow * 290;
            const ix = Math.sin(flow * 9 + k) * (4 + respAmt * 6);
            const iz = Math.cos(flow * 7 + k) * (4 + respAmt * 6);
            const p = project(ix, iy, iz);
            const edgeFade = Math.sin(flow * Math.PI);
            items.push({
              ...p,
              r: 6.4,
              rgb: k % 2 === 0 ? pal.signal : pal.ligand,
              a: edgeFade * relayAmt,
              glow: true
            });
          }
        }

        // Stage 3: Intracellular Ion Spread
        if (respAmt > 0.05) {
          for (let w = 0; w < 6; w++) {
            const ang = (w / 6) * Math.PI * 2 + t * 0.5;
            const dist = 54 + respAmt * 55;
            const p = project(Math.cos(ang) * dist, 138 + Math.sin(t * 2 + w) * 8, Math.sin(ang) * dist);
            items.push({ ...p, r: 8.5 * respAmt, rgb: pal.signal, a: 0.88 * respAmt, glow: true });
          }
        }
      } else {
        // Nuclear Receptor + Crossing Hydrophobic Ligand + 3D DNA Double Helix
        const ligY = -112 + relayAmt * 156;
        const ligX = -60 + relayAmt * 38;
        const ligP = project(ligX, ligY, 16);
        items.push({ ...ligP, r: 11.5, rgb: pal.ligand, a: 0.98, glow: true });

        // Intracellular Receptor Globular Core
        const recX = -18 + respAmt * 46;
        const recY = 58 + respAmt * 22;
        const recNodes = [
          [0, 0, 0, 16],
          [18, -10, 10, 11],
          [-18, 10, -8, 11],
          [12, 16, -12, 10],
          [-14, -14, 12, 10]
        ];
        recNodes.forEach(([dx, dy, dz, r], idx) => {
          const p = project(recX + dx, recY + dy + Math.sin(t * 1.8 + idx) * 2.5, dz);
          items.push({ ...p, r, rgb: idx === 0 ? pal.proteinA : pal.proteinB, a: 0.94, glow: idx === 0 && relayAmt > 0.3 });
        });

        // 3D DNA Double Helix (Horizontal/Tilted chromatin strand in lower cell)
        let prevA = null;
        let prevB = null;
        for (let i = 0; i < 18; i++) {
          const frac = i / 17;
          const x = -120 + frac * 280;
          const theta = frac * Math.PI * 3.4 + t * 0.45;
          const yA = 128 + Math.sin(theta) * 22;
          const zA = Math.cos(theta) * 22;
          const yB = 128 - Math.sin(theta) * 22;
          const zB = -Math.cos(theta) * 22;
          const pA = project(x, yA, zA);
          const pB = project(x, yB, zB);
          const activeGene = respAmt > 0.1 && i >= 7 && i <= 12;
          items.push({ ...pA, r: activeGene ? 6.5 : 5, rgb: activeGene ? pal.ligand : pal.signal, a: 0.9, glow: activeGene });
          items.push({ ...pB, r: activeGene ? 6.5 : 5, rgb: activeGene ? pal.signal : [96, 165, 250], a: 0.9, glow: activeGene });
          links.push({ a: pA, b: pB, color: activeGene ? 'rgba(255, 142, 83, 0.7)' : 'rgba(182, 210, 224, 0.25)', w: activeGene ? 2 : 1 });
          if (prevA) links.push({ a: prevA, b: pA, color: 'rgba(94, 234, 212, 0.45)', w: 1.4 });
          if (prevB) links.push({ a: prevB, b: pB, color: 'rgba(96, 165, 250, 0.45)', w: 1.4 });
          prevA = pA;
          prevB = pB;
        }
      }

      return { items, links };
    };

    const renderFrame = () => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      const targetStageIdx = stageOrder.indexOf(activeStage);
      stageProgress += (targetStageIdx - stageProgress) * 0.08;

      if (!isPaused && !isDragging) {
        simTime += 0.016;
        targetYaw += 0.0028;
      }

      camYaw += (targetYaw - camYaw) * 0.1;
      camPitch += (targetPitch - camPitch) * 0.1;

      if (cameraReadout) {
        const yawDeg = (((Math.round((camYaw * 180) / Math.PI) % 360) + 360) % 360).toString().padStart(2, '0');
        const pitchDeg = Math.round((camPitch * 180) / Math.PI);
        cameraReadout.textContent = `YAW ${yawDeg}° · PITCH ${pitchDeg}°`;
      }

      // Subtle plasma membrane horizon glow
      const memTop = project(0, -24, 0).sy;
      const memBot = project(0, 24, 0).sy;
      const bandGrad = ctx.createLinearGradient(0, memTop - 16, 0, memBot + 16);
      bandGrad.addColorStop(0, 'rgba(45, 212, 191, 0)');
      bandGrad.addColorStop(0.5, renderMode === 'thermal' ? 'rgba(255, 120, 70, 0.09)' : 'rgba(45, 212, 191, 0.09)');
      bandGrad.addColorStop(1, 'rgba(45, 212, 191, 0)');
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, memTop - 16, W, memBot - memTop + 32);

      const { items, links } = buildScenePoints(simTime, stageProgress);

      // Draw structural bonds / signal vectors first
      for (const ln of links) {
        ctx.beginPath();
        ctx.moveTo(ln.a.sx, ln.a.sy);
        ctx.lineTo(ln.b.sx, ln.b.sy);
        ctx.strokeStyle = ln.color;
        ctx.lineWidth = ln.w;
        ctx.stroke();
      }

      // Depth-sort 3D spheres back-to-front
      items.sort((a, b) => b.z - a.z);
      for (const it of items) {
        drawSphere(it, it.r, it.rgb, it.a, it.glow);
      }

      requestAnimationFrame(renderFrame);
    };

    resize();
    renderFrame();
    window.addEventListener('resize', resize, { passive: true });

    // Drag to Orbit 3D Camera
    viewport.addEventListener('pointerdown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      viewport.setPointerCapture?.(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      targetYaw += dx * 0.008;
      targetPitch = Math.max(-0.55, Math.min(0.65, targetPitch + dy * 0.006));
    });

    const endDrag = () => {
      isDragging = false;
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    resetCamBtn?.addEventListener('click', () => {
      targetYaw = 0.25;
      targetPitch = 0.22;
    });
  }

  /* ------------------------------------------------------------------------
     4. Cinema Stage State & Auto-Cycle Controls
     ------------------------------------------------------------------------ */
  const restartAutoCycle = () => {
    clearTimeout(autoTimer);
    if (isPaused) return;
    autoTimer = setTimeout(() => {
      const nextIdx = (stageOrder.indexOf(activeStage) + 1) % stageOrder.length;
      activeStage = stageOrder[nextIdx];
      syncExplorer();
    }, 6000);
  };

  const syncExplorer = () => {
    const mode = modes[activeMode];
    const stage = mode.stages[activeStage];

    if (stageEl) {
      stageEl.dataset.mode = activeMode;
      stageEl.dataset.stage = activeStage;
      stageEl.dataset.render = renderMode;
    }

    document.querySelectorAll('[data-mode-choice]').forEach((btn) => {
      const active = btn.dataset.modeChoice === activeMode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-render-choice]').forEach((btn) => {
      const active = btn.dataset.renderChoice === renderMode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-step]').forEach((btn) => {
      const active = btn.dataset.step === activeStage;
      btn.classList.remove('is-active');
      void btn.offsetWidth;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const setText = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };

    setText('[data-step-index]', String(stageOrder.indexOf(activeStage) + 1).padStart(2, '0'));
    setText('[data-step-title]', stage.title);
    setText('[data-step-copy]', stage.copy);
    setText('#scene-desc', mode.desc);
    setText('[data-mode-label]', mode.label);
    setText('[data-figure-caption]', mode.caption);

    const src = document.querySelector('[data-science-source]');
    if (src) {
      src.setAttribute('href', mode.source);
      src.firstChild.textContent = `${mode.sourceLabel} `;
    }
    const pdb = document.querySelector('[data-structure-source]');
    if (pdb) pdb.hidden = activeMode !== 'gpcr';

    document.querySelectorAll('[data-step-label]').forEach((node) => {
      node.textContent = mode.stages[node.dataset.stepLabel].label;
    });

    restartAutoCycle();
  };

  document.querySelectorAll('[data-mode-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeMode = btn.dataset.modeChoice;
      activeStage = 'recognition';
      syncExplorer();
    });
  });

  document.querySelectorAll('[data-render-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderMode = btn.dataset.renderChoice;
      syncExplorer();
    });
  });

  document.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!modes[activeMode].stages[btn.dataset.step]) return;
      activeStage = btn.dataset.step;
      syncExplorer();
    });
  });

  if (stageEl && toggleBtn) {
    const pause = () => {
      isPaused = true;
      clearTimeout(autoTimer);
      stageEl.classList.add('is-paused');
      toggleBtn.setAttribute('aria-pressed', 'true');
      if (toggleLabel) toggleLabel.textContent = 'Play motion';
      if (toggleIcon) toggleIcon.textContent = '▶';
    };
    const play = () => {
      isPaused = false;
      stageEl.classList.remove('is-paused');
      toggleBtn.setAttribute('aria-pressed', 'false');
      if (toggleLabel) toggleLabel.textContent = 'Pause motion';
      if (toggleIcon) toggleIcon.textContent = 'Ⅱ';
      syncExplorer();
    };
    if (isReducedMotion) pause();
    toggleBtn.addEventListener('click', () => (isPaused ? play() : pause()));
  }

  syncExplorer();

  /* ------------------------------------------------------------------------
     5. Interactive Production Pipeline Console
     ------------------------------------------------------------------------ */
  const processTabs = [...document.querySelectorAll('[data-process-stage]')];
  const processPanel = document.querySelector('#process-panel');
  const routeFill = document.querySelector('[data-route-fill]');

  const processStages = {
    science: {
      title: 'Start with the science you trust.',
      copy: 'Your team shares approved references, the intended audience, and the scientific question the film needs to clarify.',
      ownerLabel: 'YOUR TEAM BRINGS',
      owner: 'Source material · audience context · claim owners',
      note: 'Scientific authority stays with your reviewers.',
      clientPct: 78,
      progressPct: 0
    },
    direction: {
      title: 'Shape the story before production.',
      copy: 'DHEE develops the narrative and visual direction so your subject-matter experts can review the approach before the full film is produced.',
      ownerLabel: 'SHARED CHECKPOINT',
      owner: 'Narrative · visual language · review notes',
      note: 'The exact checkpoint is agreed at kickoff.',
      clientPct: 48,
      progressPct: 33.3
    },
    production: {
      title: 'Build the film around the approved direction.',
      copy: 'DHEE manages AI-assisted production, motion, editing, captions, and agreed format adaptations within the scoped project.',
      ownerLabel: 'DHEE PREPARES',
      owner: 'Film · captions · agreed deliverable formats',
      note: 'Scope and formats are confirmed before production.',
      clientPct: 18,
      progressPct: 66.6
    },
    review: {
      title: 'Your reviewers keep the final say.',
      copy: 'DHEE carries out human creative QA and prepares a clear version for your scientific, Medical, Legal, and Regulatory review.',
      ownerLabel: 'YOUR TEAM APPROVES',
      owner: 'Scientific claims · context · final approval',
      note: 'DHEE does not replace or guarantee MLR approval.',
      clientPct: 68,
      progressPct: 100
    }
  };

  const selectProcess = (tab, focus = false) => {
    const key = tab.dataset.processStage;
    const st = processStages[key];
    if (!st || !processPanel) return;

    processTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    processPanel.setAttribute('aria-labelledby', tab.id);
    processPanel.dataset.stage = key;

    const idx = String(processTabs.indexOf(tab) + 1).padStart(2, '0');
    const setText = (sel, val) => {
      const n = document.querySelector(sel);
      if (n) n.textContent = val;
    };
    setText('[data-process-index]', `STEP ${idx} / 04`);
    setText('[data-process-title]', st.title);
    setText('[data-process-copy]', st.copy);
    setText('[data-process-owner-label]', st.ownerLabel);
    setText('[data-process-owner]', st.owner);
    setText('[data-process-note]', st.note);
    setText('[data-owner-client-pct]', `${st.clientPct}%`);
    setText('[data-owner-dhee-pct]', `${100 - st.clientPct}%`);

    if (routeFill) routeFill.style.width = `${st.progressPct}%`;
    const cBar = document.querySelector('[data-owner-client]');
    const dBar = document.querySelector('[data-owner-dhee]');
    if (cBar) cBar.style.width = `${st.clientPct}%`;
    if (dBar) dBar.style.width = `${100 - st.clientPct}%`;
    if (focus) tab.focus();
  };

  processTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProcess(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      const dest = e.key === 'Home' ? 0 : e.key === 'End' ? processTabs.length - 1 : (index + dir + processTabs.length) % processTabs.length;
      if (!dir && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      selectProcess(processTabs[dest], true);
    });
  });

  /* ------------------------------------------------------------------------
     6. Interactive Use-Case Storyboard Studio
     ------------------------------------------------------------------------ */
  const ucDeck = document.querySelector('.uc-deck');
  const ucTabs = [...document.querySelectorAll('[data-usecase-choice]')];
  const ucPanel = document.querySelector('#usecase-panel');

  const usecases = {
    moa: {
      audience: 'MEDICAL AFFAIRS / SCIENTIFIC EDUCATION',
      title: 'Mechanism of action',
      description: 'Make a mechanism easier to follow through source-based visual storytelling, built for scientific education and your review pathway.',
      formats: ['MOA / MOD film', 'Short concept scene', 'Interactive explainer'],
      runtime: '30–45s film · 5–10s sample',
      reviewer: 'Medical Affairs & MLR',
      channels: 'Web, MSL iPad & Congress',
      beats: [
        { cue: '00:00 — 00:10', title: 'Establish biological context', copy: 'Open on the target environment and disease state so scientific viewers immediately orient.' },
        { cue: '00:10 — 00:28', title: 'Show the mechanism step by step', copy: 'Reveal binding, structural change, and pathway sequence in clear, source-anchored beats.' },
        { cue: '00:28 — 00:40', title: 'Close with reviewable takeaway', copy: 'Anchor the key scientific point with clean captions and approved reference attribution.' }
      ],
      cta: 'Explore a sample scene',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=moa'
    },
    investor: {
      audience: 'BIOTECH LEADERSHIP / PARTNERING',
      title: 'Investor & partnering films',
      description: 'Explain a novel platform, therapeutic approach, or research program to the people considering what comes next.',
      formats: ['Platform film', 'Partnering story', 'Research program film'],
      runtime: '60–90s narrative film',
      reviewer: 'CSO, IR & BD Leads',
      channels: 'Pitch Decks, JPM & Web',
      beats: [
        { cue: '00:00 — 00:15', title: 'Frame the therapeutic gap', copy: 'Clarify why current modalities fall short in plain, scientifically grounded visual terms.' },
        { cue: '00:15 — 00:50', title: 'Differentiate your platform', copy: 'Demonstrate how your modality or delivery platform works without burying the audience in jargon.' },
        { cue: '00:50 — 01:15', title: 'Connect science to pipeline', copy: 'Transition smoothly from mechanism clarity into program milestones and partnering fit.' }
      ],
      cta: 'Shape a science story',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=investor-film'
    },
    training: {
      audience: 'MEDICAL AFFAIRS / MSL ENABLEMENT',
      title: 'MSL & scientific training',
      description: 'Build focused modules that help teams revisit approved scientific concepts with clear, consistent visual language.',
      formats: ['Focused learning module', 'Scientific refresher', 'Reusable film excerpts'],
      runtime: 'Modular 20–60s chapters',
      reviewer: 'Medical Education & MSL Leads',
      channels: 'LMS, Field Tablets & Onboarding',
      beats: [
        { cue: 'MODULE 01', title: 'Isolate one core concept', copy: 'Break dense clinical narratives into concise, repeatable chapters MSLs can review in minutes.' },
        { cue: 'MODULE 02', title: 'Standardize visual metaphors', copy: 'Keep receptor, pathway, and endpoint visuals consistent across every region and field deck.' },
        { cue: 'MODULE 03', title: 'Package reusable excerpts', copy: 'Deliver clean chapter clips and captions ready to update as new peer-reviewed data arrives.' }
      ],
      cta: 'Discuss a training module',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=scientific-training'
    },
    congress: {
      audience: 'CONGRESS / SCIENTIFIC EVENTS',
      title: 'Congress & event assets',
      description: 'Adapt a reviewed scientific story for event screens, a poster companion, or a QR-linked page—against an agreed calendar.',
      formats: ['Event-screen film', 'Poster companion', 'QR-linked page'],
      runtime: '15–30s silent-first loops',
      reviewer: 'Congress & MLR Team',
      channels: 'LED Walls, Posters & QR Pages',
      beats: [
        { cue: '00:00 — 00:05', title: 'Stop aisle traffic silently', copy: 'Lead with high-contrast biological motion and bold visual typography built for noisy halls.' },
        { cue: '00:05 — 00:18', title: 'Deliver the scientific hook', copy: 'Communicate the core mechanism in under 15 seconds with legible on-screen callouts.' },
        { cue: '00:18 — 00:25', title: 'Bridge booth to deeper science', copy: 'Hand off seamlessly to an MSL conversation or QR-linked scientific summary page.' }
      ],
      cta: 'Plan an event asset',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=congress'
    },
    patient: {
      audience: 'PATIENT EDUCATION / PLAIN LANGUAGE',
      title: 'Patient education & trial recruitment',
      description: 'Translate reviewed science into approachable, captioned, language-ready explainers for the intended audience.',
      formats: ['Plain-language explainer', 'Captioned video', 'Localized version'],
      runtime: '45–75s accessible explainer',
      reviewer: 'Patient Advocacy & MLR',
      channels: 'Trial Sites, Clinics & Mobile',
      beats: [
        { cue: 'BEAT 01', title: 'Lead with warmth and clarity', copy: 'Replace intimidating clinical diagrams with calm, empathetic, easy-to-follow visual storytelling.' },
        { cue: 'BEAT 02', title: 'Explain the journey plainly', copy: 'Walk patients and caregivers through how a study or mechanism works in everyday language.' },
        { cue: 'BEAT 03', title: 'Design for localization', copy: 'Build clean caption tracks and modular text frames ready for multi-language adaptation.' }
      ],
      cta: 'Discuss audience needs',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=patient-education'
    },
    launch: {
      audience: 'LAUNCH READINESS / INTERNAL COMMS',
      title: 'Internal comms & launch readiness',
      description: 'Keep teams aligned around a scientific narrative with reusable video pieces that can be reviewed and refreshed over time.',
      formats: ['Internal science film', 'Reusable excerpts', 'Refresh-ready modules'],
      runtime: 'Flagship film + modular kit',
      reviewer: 'Cross-Functional Brand & Med',
      channels: 'Town Halls, Intranet & Field',
      beats: [
        { cue: 'PHASE 01', title: 'Unify the scientific story', copy: 'Align Medical, Commercial, and Market Access around one clear, approved narrative foundation.' },
        { cue: 'PHASE 02', title: 'Spin out role-specific cuts', copy: 'Derive focused excerpts from the core visual library without starting every asset from scratch.' },
        { cue: 'PHASE 03', title: 'Keep assets refresh-ready', copy: 'Structure scenes cleanly so approved updates can slot in smoothly across launch milestones.' }
      ],
      cta: 'Plan a first batch',
      href: 'https://dhee.studio/contact?industry=pharma&usecase=launch-readiness'
    }
  };

  const selectUsecase = (tab, focus = false) => {
    const key = tab.dataset.usecaseChoice;
    const item = usecases[key];
    if (!item || !ucPanel || !ucDeck) return;

    ucDeck.dataset.usecase = key;
    ucTabs.forEach((btn) => {
      const active = btn === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });

    ucPanel.setAttribute('aria-labelledby', tab.id);
    const idx = String(ucTabs.indexOf(tab) + 1).padStart(2, '0');
    const setText = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = val;
    };

    setText('[data-usecase-audience]', item.audience);
    setText('[data-usecase-title]', item.title);
    setText('[data-usecase-description]', item.description);
    setText('[data-usecase-art-index]', `${idx} — 06`);
    setText('[data-usecase-cta-label]', item.cta);
    setText('[data-usecase-runtime]', item.runtime);
    setText('[data-usecase-reviewer]', item.reviewer);
    setText('[data-usecase-channels]', item.channels);

    const beatsWrap = document.querySelector('[data-usecase-beats]');
    if (beatsWrap && item.beats) {
      beatsWrap.replaceChildren(
        ...item.beats.map((b, i) => {
          const card = document.createElement('div');
          card.className = `sb-beat${i === 0 ? ' is-lead' : ''}`;
          const top = document.createElement('div');
          top.className = 'sb-beat-top';
          const num = document.createElement('span');
          num.className = 'sb-beat-num';
          num.textContent = `BEAT 0${i + 1}`;
          const cue = document.createElement('span');
          cue.className = 'sb-beat-cue';
          cue.textContent = b.cue;
          top.append(num, cue);

          const h4 = document.createElement('h4');
          h4.textContent = b.title;
          const p = document.createElement('p');
          p.textContent = b.copy;
          card.append(top, h4, p);
          return card;
        })
      );
    }

    const list = document.querySelector('[data-usecase-formats]');
    if (list) {
      list.replaceChildren(
        ...item.formats.map((f) => {
          const b = document.createElement('b');
          b.textContent = f;
          return b;
        })
      );
    }
    const link = document.querySelector('[data-usecase-link]');
    if (link) link.href = item.href;
    if (focus) tab.focus();
  };

  ucTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectUsecase(tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      const dest = e.key === 'Home' ? 0 : e.key === 'End' ? ucTabs.length - 1 : (index + dir + ucTabs.length) % ucTabs.length;
      if (!dir && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      selectUsecase(ucTabs[dest], true);
    });
  });

  /* ------------------------------------------------------------------------
     7. Interactive Sample Dossier Configurator
     ------------------------------------------------------------------------ */
  const sampleScopes = {
    moa: {
      head: 'SAMPLE DOSSIER · MOA / MOD',
      rows: [
        'One visual mechanism scene',
        'One hook or title frame',
        'One visual & motion direction',
        'One format & channel recommendation',
        'A suggested next production step'
      ]
    },
    'investor-film': {
      head: 'SAMPLE DOSSIER · INVESTOR PITCH',
      rows: [
        'One platform-story preview scene',
        'One executive opening title frame',
        'One visual language & pacing study',
        'Deck embed & partnering cutdown guide',
        'Full platform-film scope proposal'
      ]
    },
    'scientific-training': {
      head: 'SAMPLE DOSSIER · MSL TRAINING',
      rows: [
        'One modular scientific concept clip',
        'One chapter title & reference frame',
        'One reusable visual diagram system',
        'LMS & field-enablement format notes',
        'Series scoping & review checkpoint plan'
      ]
    },
    congress: {
      head: 'SAMPLE DOSSIER · CONGRESS',
      rows: [
        'One booth-screen motion loop preview',
        'One silent-first headline frame',
        'One high-contrast event visual style',
        'Booth screen, poster & QR aspect specs',
        'Congress calendar & review milestone note'
      ]
    }
  };

  const audienceLabels = {
    'medical-affairs': 'AUDIENCE: MEDICAL AFFAIRS',
    hcps: 'AUDIENCE: HCPS & KOLS',
    investors: 'AUDIENCE: INVESTORS & PARTNERS',
    patients: 'AUDIENCE: PATIENTS & CAREGIVERS'
  };

  let selectedFocus = 'moa';
  let selectedAudience = 'medical-affairs';
  const sampleCta = document.querySelector('[data-sample-cta]');

  const syncSampleDossier = () => {
    const scope = sampleScopes[selectedFocus];
    if (!scope) return;
    const head = document.querySelector('[data-manifest-title]');
    const aud = document.querySelector('[data-manifest-audience]');
    if (head) head.textContent = scope.head;
    if (aud) aud.textContent = audienceLabels[selectedAudience] || 'AUDIENCE: MEDICAL AFFAIRS';
    scope.rows.forEach((txt, i) => {
      const node = document.querySelector(`[data-manifest-${i + 1}]`);
      if (node) node.textContent = txt;
    });
    if (sampleCta) {
      sampleCta.href = `https://dhee.studio/contact?industry=pharma&usecase=${selectedFocus}&audience=${selectedAudience}`;
    }
  };

  document.querySelectorAll('[data-sample-focus]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedFocus = btn.dataset.sampleFocus;
      document.querySelectorAll('[data-sample-focus]').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      syncSampleDossier();
    });
  });

  document.querySelectorAll('[data-sample-audience]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedAudience = btn.dataset.sampleAudience;
      document.querySelectorAll('[data-sample-audience]').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      syncSampleDossier();
    });
  });

  /* ------------------------------------------------------------------------
     8. Scroll Reveals & Active Nav Pill Highlight
     ------------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !isReducedMotion) {
    document.body.classList.add('motion-enabled');
    const revObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );
    revealTargets.forEach((el) => revObs.observe(el));
  }

  const navSections = ['explorer', 'why', 'use-cases', 'governance', 'process']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll('.desktop-nav a, .mobile-menu nav a').forEach((link) => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-current', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-28% 0px -56% 0px' }
    );
    navSections.forEach((s) => navObs.observe(s));
  }

  document.querySelectorAll('.mobile-menu nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = link.closest('details');
      if (menu) menu.open = false;
    });
  });

  /* ------------------------------------------------------------------------
     9. Hero Cursor-Illuminated Perspective Grid & Spotlight Parallax
     ------------------------------------------------------------------------ */
  const heroStage = document.querySelector('[data-hero-stage]');
  if (heroStage && !isReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let targetX = 50;
    let targetY = 26;
    let curX = 50;
    let curY = 26;
    let rafHero = 0;

    const animateSpotlight = () => {
      curX += (targetX - curX) * 0.11;
      curY += (targetY - curY) * 0.11;
      heroStage.style.setProperty('--hx', `${curX.toFixed(2)}%`);
      heroStage.style.setProperty('--hy', `${curY.toFixed(2)}%`);
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        rafHero = requestAnimationFrame(animateSpotlight);
      } else {
        rafHero = 0;
      }
    };

    heroStage.addEventListener(
      'pointermove',
      (e) => {
        const rect = heroStage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
        if (!rafHero) rafHero = requestAnimationFrame(animateSpotlight);
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     10. Awwwards Scroll Choreography: Velocity Marquee, Word Scrub,
         Sticky Stacking Deck, 3D Perspective Stage & Telemetry Rail
     ------------------------------------------------------------------------ */
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // 10A. Scroll-Scrubbed Word-by-Word Editorial Statement Reveal
  const scrubNodes = [...document.querySelectorAll('[data-scroll-scrub]')];
  const scrubWordsMap = [];
  if (!isReducedMotion && scrubNodes.length) {
    scrubNodes.forEach((node) => {
      const words = node.textContent.trim().split(/\s+/);
      const spans = words.map((w, idx) => {
        const sp = document.createElement('span');
        sp.className = 'scrub-word';
        sp.textContent = idx < words.length - 1 ? `${w} ` : w;
        sp.style.setProperty('--w-op', '0.24');
        return sp;
      });
      node.replaceChildren(...spans);
      scrubWordsMap.push({ node, spans });
    });
  }

  // 10B. Velocity-Reactive Kinetic Marquee
  const marqueeTrack = document.querySelector('[data-marquee-track]');
  let marqueeOffset = 0;
  let marqueeDir = 1;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let marqueePaused = false;

  marqueeTrack?.closest('.kinetic-ribbon')?.addEventListener('pointerenter', () => {
    marqueePaused = true;
  });
  marqueeTrack?.closest('.kinetic-ribbon')?.addEventListener('pointerleave', () => {
    marqueePaused = false;
  });

  // 10C. Sticky Stacking Cards & Scroll-Linked Cinema Stage Perspective
  const stackCards = [...document.querySelectorAll('[data-stack-card]')];

  const updateScrollChoreography = () => {
    const vh = window.innerHeight || 800;

    // Hero 3D Cinema Stage smooth perspective flatten on scroll
    if (stageEl && !isReducedMotion && window.innerWidth > 900) {
      const rect = stageEl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (vh * 0.96 - rect.top) / (vh * 0.62)));
      const tiltX = (1 - progress) * 4.5;
      const scale = 0.968 + progress * 0.032;
      stageEl.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    } else if (stageEl) {
      stageEl.style.transform = '';
    }

    // Word-by-word scroll scrub illumination
    for (const { node, spans } of scrubWordsMap) {
      const rect = node.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, (vh * 0.86 - rect.top) / (vh * 0.52)));
      const total = spans.length;
      for (let i = 0; i < total; i++) {
        const start = (i / total) * 0.82;
        const end = start + 0.18;
        const local = Math.max(0, Math.min(1, (prog - start) / (end - start)));
        spans[i].style.setProperty('--w-op', (0.24 + local * 0.76).toFixed(2));
      }
    }

    // Sticky stacking depth scale on Studio Process cards (desktop)
    if (!isReducedMotion && window.innerWidth > 900 && stackCards.length > 1) {
      for (let i = 0; i < stackCards.length - 1; i++) {
        const cur = stackCards[i];
        const next = stackCards[i + 1];
        const curRect = cur.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(1, (curRect.bottom - nextRect.top) / Math.max(120, curRect.height)));
        const scale = 1 - overlap * 0.055;
        const op = 1 - overlap * 0.24;
        cur.style.transform = `scale(${scale.toFixed(3)})`;
        cur.style.opacity = op.toFixed(2);
      }
    } else {
      stackCards.forEach((c) => {
        c.style.transform = '';
        c.style.opacity = '';
      });
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (Math.abs(dy) > 0.5) {
        marqueeDir = dy > 0 ? 1 : -1;
        scrollVelocity = Math.min(14, Math.abs(dy) * 0.24);
        // Subtle 3D receptor yaw kick synced to scroll
        if (!isDragging && !isPaused) {
          targetYaw += dy * 0.00055;
        }
      }
      updateScrollChoreography();
    },
    { passive: true }
  );
  window.addEventListener('resize', updateScrollChoreography, { passive: true });
  updateScrollChoreography();

  // Marquee 60fps velocity ticker
  if (marqueeTrack && !isReducedMotion) {
    const tickMarquee = () => {
      const halfWidth = marqueeTrack.scrollWidth / 2;
      if (halfWidth > 0) {
        const baseSpeed = marqueePaused ? 0.16 : 0.68;
        marqueeOffset += (baseSpeed + scrollVelocity) * marqueeDir;
        scrollVelocity *= 0.91;
        if (marqueeOffset >= halfWidth) marqueeOffset -= halfWidth;
        if (marqueeOffset < 0) marqueeOffset += halfWidth;
        marqueeTrack.style.transform = `translate3d(${(-marqueeOffset).toFixed(2)}px, 0, 0)`;
      }
      requestAnimationFrame(tickMarquee);
    };
    requestAnimationFrame(tickMarquee);
  }

  // 10D. Tactile 3D Perspective Micro-Tilt on Cards
  if (!isReducedMotion && finePointer) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const rx = (-ny * 6.5).toFixed(2);
        const ry = (nx * 6.5).toFixed(2);
        card.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 10E. Precision Studio Cursor Ring (Desktop Fine Pointer)
  const cursorRing = document.querySelector('[data-cursor-ring]');
  const cursorLabel = document.querySelector('[data-cursor-label]');
  if (cursorRing && !isReducedMotion && finePointer) {
    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;
    let activeLoop = false;

    const animateCursor = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      const w = cursorRing.offsetWidth || 30;
      const h = cursorRing.offsetHeight || 30;
      cursorRing.style.transform = `translate3d(${(cx - w / 2).toFixed(1)}px, ${(cy - h / 2).toFixed(1)}px, 0)`;
      if (Math.hypot(tx - cx, ty - cy) > 0.4) {
        requestAnimationFrame(animateCursor);
      } else {
        activeLoop = false;
      }
    };

    window.addEventListener(
      'pointermove',
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
        cursorRing.classList.add('is-visible');
        if (!activeLoop) {
          activeLoop = true;
          requestAnimationFrame(animateCursor);
        }
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', () => cursorRing.classList.remove('is-visible'));

    const interactiveSel = 'a, button, summary, .uc-pill, .receptor-tab, .stage-btn';
    document.addEventListener('pointerover', (e) => {
      const overViewport = e.target.closest('[data-stage-viewport]');
      if (overViewport) {
        cursorRing.classList.remove('is-hover');
        cursorRing.classList.add('is-drag');
        if (cursorLabel) cursorLabel.textContent = 'DRAG';
        return;
      }
      cursorRing.classList.remove('is-drag');
      if (cursorLabel) cursorLabel.textContent = '';
      cursorRing.classList.toggle('is-hover', Boolean(e.target.closest(interactiveSel)));
    });
  }

  // 10F. Right-Edge Section Telemetry Rail Active Sync
  const railLinks = [...document.querySelectorAll('[data-rail-target]')];
  const railSections = railLinks.map((a) => document.getElementById(a.dataset.railTarget)).filter(Boolean);
  if ('IntersectionObserver' in window && railSections.length) {
    const railObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          railLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.railTarget === entry.target.id);
          });
        });
      },
      { rootMargin: '-30% 0px -52% 0px' }
    );
    railSections.forEach((sec) => railObs.observe(sec));
  }

  /* ------------------------------------------------------------------------
     11. Floating Bottom Cinema Action Dock & Telemetry Count-Up
     ------------------------------------------------------------------------ */
  const floatingDock = document.querySelector('[data-floating-dock]');
  const closingEl = document.querySelector('#request');

  if (floatingDock) {
    const syncDock = () => {
      const scrolledPastHero = window.scrollY > 560;
      const nearClosing = closingEl ? closingEl.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      floatingDock.classList.toggle('is-visible', scrolledPastHero && !nearClosing);
    };
    syncDock();
    window.addEventListener('scroll', syncDock, { passive: true });
    window.addEventListener('resize', syncDock, { passive: true });
  }

  const counters = [...document.querySelectorAll('[data-count-to]')];
  if (counters.length && 'IntersectionObserver' in window && !isReducedMotion) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = Number(el.dataset.countTo || 0);
          if (target <= 0) {
            obs.unobserve(el);
            return;
          }
          const duration = 900;
          const startTime = performance.now();
          const step = (now) => {
            const p = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = String(target);
          };
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((c) => countObs.observe(c));
  }
})();
