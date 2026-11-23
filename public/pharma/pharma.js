(() => {
  const visual = document.querySelector('.science-visual');
  const toggle = document.querySelector('[data-motion-toggle]');
  const label = document.querySelector('[data-motion-label]');
  const icon = document.querySelector('.toggle-icon');
  const year = document.querySelector('[data-current-year]');
  const header = document.querySelector('[data-site-header]');
  const progressBar = document.querySelector('[data-progress-bar]');
  const stageIndex = document.querySelector('[data-step-index]');
  const stageTitle = document.querySelector('[data-step-title]');
  const stageCopy = document.querySelector('[data-step-copy]');
  const sceneDescription = document.querySelector('#scene-desc');
  if (year) year.textContent = String(new Date().getFullYear());
  const updateScrollChrome = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateScrollChrome();
  window.addEventListener('scroll', updateScrollChrome, { passive: true });
  window.addEventListener('resize', updateScrollChrome, { passive: true });
  const modes = {
    gpcr: {
      label: 'G-PROTEIN-COUPLED RECEPTOR',
      caption: 'FAMILY-LEVEL GPCR SCHEMATIC',
      sourceLabel: 'GPCR reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK541112/',
      desc: 'An illustrative GPCR family diagram. GPCRs have seven transmembrane helices; this simplified drawing is not a particular receptor structure or drug mechanism.',
      stages: {
        recognition: { title: 'A signal meets a GPCR', copy: 'G-protein-coupled receptors span the membrane seven times. A bound signal can alter receptor activity; the specific pathway depends on the receptor and cell.', label: 'Ligand recognition' },
        relay: { title: 'The receptor engages a G protein', copy: 'Activated GPCRs can promote nucleotide exchange on associated heterotrimeric G proteins. Which G-protein family and downstream partners matter is receptor-specific.', label: 'G-protein activation' },
        response: { title: 'Signals branch inside the cell', copy: 'G-protein signaling can influence different intracellular effectors. This diagram shows a family-level concept, not a predicted response or therapeutic effect.', label: 'Cell-specific signaling' }
      }
    },
    channel: {
      label: 'LIGAND-GATED ION CHANNEL',
      caption: 'ION-CHANNEL FAMILY SCHEMATIC',
      sourceLabel: 'Ion-channel reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK554403/',
      desc: 'An illustrative ligand-gated ion-channel family diagram. Ligand binding can open a channel and allow selected ions to cross the membrane; no particular channel or ion is identified.',
      stages: {
        recognition: { title: 'A ligand binds the channel', copy: 'For ligand-gated ion channels, ligand binding can change channel gating. The ligand, channel subtype, and binding details vary by system.', label: 'Ligand binding' },
        relay: { title: 'The channel changes state', copy: 'Opening a channel allows selected ions to cross the membrane down their electrochemical gradients. The ion species and direction depend on the channel and conditions.', label: 'Channel opens' },
        response: { title: 'Ion movement carries the signal', copy: 'A change in ion flow can alter cellular electrical or biochemical activity. The downstream effect depends on the cell and channel context.', label: 'Ion flow' }
      }
    },
    nuclear: {
      label: 'INTRACELLULAR RECEPTOR',
      caption: 'NUCLEAR-RECEPTOR FAMILY SCHEMATIC',
      sourceLabel: 'Nuclear-receptor reference',
      source: 'https://www.ncbi.nlm.nih.gov/books/NBK26813/',
      desc: 'An illustrative nuclear-receptor family diagram. Some small hydrophobic signals cross the membrane and bind intracellular receptors, which can regulate transcription in a cell-dependent way.',
      stages: {
        recognition: { title: 'Some signals enter the cell', copy: 'Certain small, hydrophobic signals can cross the plasma membrane and bind intracellular receptors. This route does not apply to every signal or receptor.', label: 'Membrane passage' },
        relay: { title: 'The signal binds its receptor', copy: 'Ligand binding can change nuclear-receptor activity. Receptor location and what happens next vary across receptor types and cell contexts.', label: 'Receptor binding' },
        response: { title: 'Gene regulation is context-specific', copy: 'Some nuclear receptors interact with specific DNA sequences to regulate transcription. Which genes respond depends on the receptor and the target cell.', label: 'Transcription' }
      }
    }
  };
  let activeMode = 'gpcr';
  let activeStage = 'recognition';
  const renderExplorer = () => {
    const mode = modes[activeMode];
    const stage = mode.stages[activeStage];
    if (visual) {
      visual.dataset.mode = activeMode;
      visual.dataset.stage = activeStage;
    }
    document.querySelectorAll('[data-mode-choice]').forEach((button) => {
      const active = button.dataset.modeChoice === activeMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-step]').forEach((button) => {
      const active = button.dataset.step === activeStage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (stageIndex) stageIndex.textContent = String(Object.keys(mode.stages).indexOf(activeStage) + 1).padStart(2, '0');
    if (stageTitle) stageTitle.textContent = stage.title;
    if (stageCopy) stageCopy.textContent = stage.copy;
    if (sceneDescription) sceneDescription.textContent = mode.desc;
    document.querySelector('[data-mode-label]')?.replaceChildren(document.createTextNode(mode.label));
    document.querySelector('[data-figure-caption]')?.replaceChildren(document.createTextNode(mode.caption));
    document.querySelector('[data-family-caption]')?.replaceChildren(document.createTextNode(`${mode.caption} · ILLUSTRATIVE`));
    document.querySelector('[data-science-source]')?.setAttribute('href', mode.source);
    const sourceLink = document.querySelector('[data-science-source]');
    if (sourceLink) sourceLink.firstChild.textContent = mode.sourceLabel + ' ';
    const structureSource = document.querySelector('[data-structure-source]');
    if (structureSource) structureSource.hidden = activeMode !== 'gpcr';
    document.querySelectorAll('[data-step-label]').forEach((node) => {
      node.textContent = mode.stages[node.dataset.stepLabel].label;
    });
  };
  document.querySelectorAll('[data-mode-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      activeMode = button.dataset.modeChoice;
      activeStage = 'recognition';
      renderExplorer();
    });
  });
  document.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!modes[activeMode].stages[button.dataset.step]) return;
      activeStage = button.dataset.step;
      renderExplorer();
    });
  });
  renderExplorer();
  const processTabs = [...document.querySelectorAll('[data-process-stage]')];
  const processPanel = document.querySelector('#process-panel');
  const processStages = {
    science: { title: 'Start with the science you trust.', copy: 'Your team shares approved references, the intended audience, and the scientific question the film needs to clarify.', ownerLabel: 'YOUR TEAM BRINGS', owner: 'Source material · audience context · claim owners', note: 'Scientific authority stays with your reviewers.' },
    direction: { title: 'Shape the story before production.', copy: 'DHEE develops the narrative and visual direction so your subject-matter experts can review the approach before the full film is produced.', ownerLabel: 'SHARED CHECKPOINT', owner: 'Narrative · visual language · review notes', note: 'The exact checkpoint is agreed at kickoff.' },
    production: { title: 'Build the film around the approved direction.', copy: 'DHEE manages AI-assisted production, motion, editing, captions, and agreed format adaptations within the scoped project.', ownerLabel: 'DHEE PREPARES', owner: 'Film · captions · agreed deliverable formats', note: 'Scope and formats are confirmed before production.' },
    review: { title: 'Your reviewers keep the final say.', copy: 'DHEE carries out human creative QA and prepares a clear version for your scientific, Medical, Legal, and Regulatory review.', ownerLabel: 'YOUR TEAM APPROVES', owner: 'Scientific claims · context · final approval', note: 'DHEE does not replace or guarantee MLR approval.' }
  };
  const selectProcessStage = (tab, focus = false) => {
    const stageName = tab.dataset.processStage;
    const stage = processStages[stageName];
    if (!stage || !processPanel) return;
    processTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      item.classList.toggle('is-active', active);
    });
    processPanel.setAttribute('aria-labelledby', tab.id);
    processPanel.dataset.stage = stageName;
    const index = String(processTabs.indexOf(tab) + 1).padStart(2, '0');
    const title = document.querySelector('[data-process-title]');
    const copy = document.querySelector('[data-process-copy]');
    const ownerLabel = document.querySelector('[data-process-owner-label]');
    const owner = document.querySelector('[data-process-owner]');
    const note = document.querySelector('[data-process-note]');
    const stepIndex = document.querySelector('[data-process-index]');
    if (stepIndex) stepIndex.textContent = `STEP ${index} / 04`;
    if (title) title.textContent = stage.title;
    if (copy) copy.textContent = stage.copy;
    if (ownerLabel) ownerLabel.textContent = stage.ownerLabel;
    if (owner) owner.textContent = stage.owner;
    if (note) note.textContent = stage.note;
    if (focus) tab.focus();
  };
  processTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProcessStage(tab));
    tab.addEventListener('keydown', (event) => {
      const keyDirection = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      const destination = event.key === 'Home' ? 0 : event.key === 'End' ? processTabs.length - 1 : (index + keyDirection + processTabs.length) % processTabs.length;
      if (!keyDirection && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      selectProcessStage(processTabs[destination], true);
    });
  });
  const usecaseTabs = [...document.querySelectorAll('[data-usecase-choice]')];
  const usecasePanel = document.querySelector('#usecase-panel');
  const usecases = {
    moa: { audience: 'MEDICAL AFFAIRS / SCIENTIFIC EDUCATION', title: 'Mechanism of action', description: 'Make a mechanism easier to follow through source-based visual storytelling, built for scientific education and your review pathway.', art: 'MECHANISM / VISUAL STUDY', formats: ['MOA / MOD film', 'Short concept scene', 'Interactive explainer'], cta: 'Explore a sample scene', href: 'https://dhee.studio/contact?industry=pharma&usecase=moa' },
    investor: { audience: 'BIOTECH LEADERSHIP / PARTNERING', title: 'Investor & partnering films', description: 'Explain a novel platform, therapeutic approach, or research program to the people considering what comes next.', art: 'PLATFORM / STORY STUDY', formats: ['Platform film', 'Partnering story', 'Research program film'], cta: 'Shape a science story', href: 'https://dhee.studio/contact?industry=pharma&usecase=investor-film' },
    training: { audience: 'MEDICAL AFFAIRS / MSL ENABLEMENT', title: 'MSL & scientific training', description: 'Build focused modules that help teams revisit approved scientific concepts with clear, consistent visual language.', art: 'LEARN / REVISIT', formats: ['Focused learning module', 'Scientific refresher', 'Reusable film excerpts'], cta: 'Discuss a training module', href: 'https://dhee.studio/contact?industry=pharma&usecase=scientific-training' },
    congress: { audience: 'CONGRESS / SCIENTIFIC EVENTS', title: 'Congress & event assets', description: 'Adapt a reviewed scientific story for event screens, a poster companion, or a QR-linked page—against an agreed calendar.', art: 'CONGRESS / CUTDOWN', formats: ['Event-screen film', 'Poster companion', 'QR-linked page'], cta: 'Plan an event asset', href: 'https://dhee.studio/contact?industry=pharma&usecase=congress' },
    patient: { audience: 'PATIENT EDUCATION / PLAIN LANGUAGE', title: 'Patient education & trial recruitment', description: 'Translate reviewed science into approachable, captioned, language-ready explainers for the intended audience.', art: 'CLEAR / ACCESSIBLE', formats: ['Plain-language explainer', 'Captioned video', 'Localized version'], cta: 'Discuss audience needs', href: 'https://dhee.studio/contact?industry=pharma&usecase=patient-education' },
    launch: { audience: 'LAUNCH READINESS / INTERNAL COMMS', title: 'Internal comms & launch readiness', description: 'Keep teams aligned around a scientific narrative with reusable video pieces that can be reviewed and refreshed over time.', art: 'ALIGN / UPDATE', formats: ['Internal science film', 'Reusable excerpts', 'Refresh-ready modules'], cta: 'Plan a first batch', href: 'https://dhee.studio/contact?industry=pharma&usecase=launch-readiness' }
  };
  const selectUsecase = (tab, focus = false) => {
    const key = tab.dataset.usecaseChoice;
    const item = usecases[key];
    if (!item || !usecasePanel) return;
    usecasePanel.closest('.usecase-studio').dataset.usecase = key;
    usecaseTabs.forEach((button) => {
      const active = button === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      button.classList.toggle('is-active', active);
    });
    usecasePanel.setAttribute('aria-labelledby', tab.id);
    const index = String(usecaseTabs.indexOf(tab) + 1).padStart(2, '0');
    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText('[data-usecase-audience]', item.audience);
    setText('[data-usecase-title]', item.title);
    setText('[data-usecase-description]', item.description);
    setText('[data-usecase-art-label]', item.art);
    setText('[data-usecase-art-index]', `${index} — 06`);
    const formatList = document.querySelector('[data-usecase-formats]');
    if (formatList) formatList.replaceChildren(...item.formats.map((format) => {
      const tag = document.createElement('b');
      tag.textContent = format;
      return tag;
    }));
    const link = document.querySelector('[data-usecase-link]');
    if (link) {
      link.href = item.href;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.replaceChildren(document.createTextNode(item.cta + ' '), arrow);
    }
    if (focus) tab.focus();
  };
  usecaseTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectUsecase(tab));
    tab.addEventListener('keydown', (event) => {
      const keyDirection = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
      const destination = event.key === 'Home' ? 0 : event.key === 'End' ? usecaseTabs.length - 1 : (index + keyDirection + usecaseTabs.length) % usecaseTabs.length;
      if (!keyDirection && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      selectUsecase(usecaseTabs[destination], true);
    });
  });
  const revealTargets = document.querySelectorAll('.section-kicker, .section-heading, .bottleneck-grid, .route-line, .offer-card, .governance-grid article, .dhee-copy, .dhee-process article, .dhee-delivery, .pilot-layout, .faq-layout, .closing-inner');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('motion-enabled');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }
  const navSections = ['use-cases', 'governance', 'dhee'].map((id) => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.desktop-nav a, .mobile-menu nav a').forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -58% 0px' });
    navSections.forEach((section) => navObserver.observe(section));
  }
  if (visual && toggle) {
    const pause = () => {
      visual.classList.add('is-paused');
      toggle.setAttribute('aria-pressed', 'true');
      if (label) label.textContent = 'Play motion';
      if (icon) icon.textContent = '▶';
    };
    const play = () => {
      visual.classList.remove('is-paused');
      toggle.setAttribute('aria-pressed', 'false');
      if (label) label.textContent = 'Pause motion';
      if (icon) icon.textContent = 'Ⅱ';
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) pause();
    toggle.addEventListener('click', () => visual.classList.contains('is-paused') ? play() : pause());
    reducedMotion.addEventListener?.('change', (event) => event.matches ? pause() : play());
  }
  document.querySelectorAll('.mobile-menu nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = link.closest('details');
      if (menu) menu.open = false;
    });
  });
})();
