/* ==========================================================================
   DHEE Studio — Shared Zero-Reflow Motion & Interaction Runtime
   Performance guardrails:
   - NO .cursor-ring custom circle (native cursor preserved)
   - Cached marquee dimensions (no scrollWidth reads inside rAF)
   - IntersectionObserver-gated marquee & scroll-autoplay videos
   - Respects prefers-reduced-motion
   ========================================================================== */

export function initStudioMotion() {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReducedMotion = reducedMotionQuery.matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const progressBar = document.querySelector<HTMLElement>('[data-progress-bar]');
  const tonedSections = [...document.querySelectorAll<HTMLElement>('[data-section-tone]')];

  /* 1. Adaptive Header Tone + Scroll Progress */
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

  /* 2. Magnetic Kinetic CTAs, Card Spotlights & 3D Micro-Tilt */
  if (!isReducedMotion && finePointer) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
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

    document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
      card.addEventListener(
        'pointermove',
        (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        },
        { passive: true }
      );
    });

    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        const rx = (-ny * 6).toFixed(2);
        const ry = (nx * 6).toFixed(2);
        card.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* 3. Hero Cursor-Illuminated Perspective Micro-Grid */
  const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');
  if (heroStage && !isReducedMotion && finePointer) {
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

  /* 4. Interactive Tabs: Story Journey + First-Response Buyer Conversation */
  const bindTabKeys = (items: HTMLButtonElement[]) =>
    items.forEach((tab, index) =>
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const target =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[target]?.focus();
        items[target]?.click();
      })
    );

  const journey = document.querySelector<HTMLElement>('.journey-section');
  const storyTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-story-tab]')];
  const storyTitle = document.querySelector<HTMLElement>('[data-story-title-view]');
  const storyCopy = document.querySelector<HTMLElement>('[data-story-copy-view]');
  const storyCounter = document.querySelector<HTMLElement>('.journey-counter');
  const storyIndex = document.querySelector<HTMLElement>('.journey-caption-index');
  const storyCaption = document.querySelector<HTMLElement>('.journey-caption');
  const storyScenes = [...document.querySelectorAll<HTMLElement>('[data-story-image]')];

  bindTabKeys(storyTabs);
  storyTabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const step = Number(tab.dataset.storyTab);
      journey?.setAttribute('data-story-step', String(step));
      storyTabs.forEach((item, i) => {
        const active = i === step;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      document.querySelector('#story-preview')?.setAttribute('aria-labelledby', `story-tab-${step}`);
      storyScenes.forEach((scene, i) => {
        const active = i === step;
        scene.classList.toggle('is-active', active);
        scene.setAttribute('aria-hidden', String(!active));
      });
      storyCaption?.classList.add('is-changing');
      window.setTimeout(() => storyCaption?.classList.remove('is-changing'), 130);
      if (storyTitle) storyTitle.textContent = tab.dataset.storyTitle ?? '';
      if (storyCopy) storyCopy.textContent = tab.dataset.storyCopy ?? '';
      if (storyCounter) storyCounter.textContent = `0${step + 1} / 0${storyTabs.length}`;
      if (storyIndex) storyIndex.textContent = `0${step + 1}`;
    })
  );

  const reply = document.querySelector<HTMLElement>('.reply-section');
  const replyTabs = [...document.querySelectorAll<HTMLButtonElement>('[data-reply-tab]')];
  const replyPanel = document.querySelector<HTMLElement>('#buyer-preview');
  const replyQuestion = document.querySelector<HTMLElement>('[data-reply-question-view]');
  const replyAnswer = document.querySelector<HTMLElement>('[data-reply-answer-view]');
  const replyAsset = document.querySelector<HTMLElement>('[data-reply-asset-view]');

  bindTabKeys(replyTabs);
  replyTabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const step = Number(tab.dataset.replyTab);
      if (!tab.dataset.replyQuestion || !tab.dataset.replyAnswer || !tab.dataset.replyAsset) return;
      reply?.setAttribute('data-reply-step', String(step));
      replyTabs.forEach((item, i) => {
        const active = i === step;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      replyPanel?.setAttribute('aria-labelledby', `buyer-tab-${step}`);
      if (replyQuestion) replyQuestion.textContent = tab.dataset.replyQuestion;
      if (replyAnswer) replyAnswer.textContent = tab.dataset.replyAnswer;
      if (replyAsset) replyAsset.textContent = tab.dataset.replyAsset;
    })
  );

  document.querySelectorAll<HTMLAnchorElement>('[data-reply-link]').forEach((link) =>
    link.addEventListener('click', () => {
      replyTabs[Number(link.dataset.replyLink)]?.click();
    })
  );

  /* 5. Scroll Choreography: Word Scrub, Stage Tilt, Sticky Stack & Velocity Marquee */
  const scrubNodes = [...document.querySelectorAll<HTMLElement>('[data-scroll-scrub]')];
  const scrubWordsMap: Array<{ node: HTMLElement; spans: HTMLSpanElement[] }> = [];
  if (!isReducedMotion && scrubNodes.length) {
    scrubNodes.forEach((node) => {
      const words = (node.textContent || '').trim().split(/\s+/);
      const spans = words.map((w, idx) => {
        const sp = document.createElement('span');
        sp.className = 'scrub-word';
        sp.textContent = idx < words.length - 1 ? `${w} ` : w;
        sp.style.setProperty('--w-op', '0.28');
        return sp;
      });
      node.replaceChildren(...spans);
      scrubWordsMap.push({ node, spans });
    });
  }

  const stageEl = document.querySelector<HTMLElement>('[data-cinema-stage]');
  const stackCards = [...document.querySelectorAll<HTMLElement>('[data-stack-card]')];
  const marqueeTrack = document.querySelector<HTMLElement>('[data-marquee-track]');
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

  const updateScrollChoreography = () => {
    const vh = window.innerHeight || 800;

    if (stageEl && !isReducedMotion && window.innerWidth > 900) {
      const rect = stageEl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (vh * 0.96 - rect.top) / (vh * 0.62)));
      const tiltX = (1 - progress) * 4;
      const scale = 0.972 + progress * 0.028;
      stageEl.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    } else if (stageEl) {
      stageEl.style.transform = '';
    }

    for (const { node, spans } of scrubWordsMap) {
      const rect = node.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, (vh * 0.88 - rect.top) / (vh * 0.5)));
      const total = spans.length;
      for (let i = 0; i < total; i++) {
        const start = (i / total) * 0.8;
        const end = start + 0.2;
        const local = Math.max(0, Math.min(1, (prog - start) / (end - start)));
        spans[i].style.setProperty('--w-op', (0.28 + local * 0.72).toFixed(2));
      }
    }

    if (!isReducedMotion && window.innerWidth > 900 && stackCards.length > 1) {
      for (let i = 0; i < stackCards.length - 1; i++) {
        const cur = stackCards[i];
        const next = stackCards[i + 1];
        const curRect = cur.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(1, (curRect.bottom - nextRect.top) / Math.max(100, curRect.height)));
        const scale = 1 - overlap * 0.045;
        const op = 1 - overlap * 0.2;
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
        scrollVelocity = Math.min(14, Math.abs(dy) * 0.22);
      }
      updateScrollChoreography();
    },
    { passive: true }
  );
  window.addEventListener('resize', updateScrollChoreography, { passive: true });
  updateScrollChoreography();

  if (marqueeTrack && !isReducedMotion) {
    let cachedHalfWidth = marqueeTrack.scrollWidth / 2;
    let marqueeVisible = true;
    let marqueeRaf = 0;

    const refreshMarqueeWidth = () => {
      cachedHalfWidth = marqueeTrack.scrollWidth / 2;
    };
    window.addEventListener('resize', refreshMarqueeWidth, { passive: true });

    const tickMarquee = () => {
      marqueeRaf = 0;
      if (!marqueeVisible) return;
      if (cachedHalfWidth > 0) {
        const baseSpeed = marqueePaused ? 0.16 : 0.65;
        marqueeOffset += (baseSpeed + scrollVelocity) * marqueeDir;
        scrollVelocity *= 0.91;
        if (marqueeOffset >= cachedHalfWidth) marqueeOffset -= cachedHalfWidth;
        if (marqueeOffset < 0) marqueeOffset += cachedHalfWidth;
        marqueeTrack.style.transform = `translate3d(${(-marqueeOffset).toFixed(2)}px, 0, 0)`;
      }
      marqueeRaf = requestAnimationFrame(tickMarquee);
    };

    const ribbonEl = marqueeTrack.closest('.kinetic-ribbon');
    if ('IntersectionObserver' in window && ribbonEl) {
      const mqObs = new IntersectionObserver(
        (entries) => {
          marqueeVisible = entries[0]?.isIntersecting ?? true;
          if (marqueeVisible && !marqueeRaf) marqueeRaf = requestAnimationFrame(tickMarquee);
        },
        { rootMargin: '100px 0px' }
      );
      mqObs.observe(ribbonEl);
    } else {
      marqueeRaf = requestAnimationFrame(tickMarquee);
    }
  }

  /* 6. Scroll Reveals, Nav Sync, Telemetry Rail, Floating Dock & Counters */
  const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if ('IntersectionObserver' in window && !isReducedMotion && revealTargets.length) {
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

  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a, .mobile-menu nav a')];
  const navIds = [...new Set(navLinks.map((a) => a.getAttribute('href')?.replace(/^#/, '')).filter(Boolean) as string[])];
  const navSections = navIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));

  if ('IntersectionObserver' in window && navSections.length) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
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

  const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-rail-target]')];
  const railSections = railLinks
    .map((a) => document.getElementById(a.dataset.railTarget || ''))
    .filter((el): el is HTMLElement => Boolean(el));
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

  const floatingDock = document.querySelector<HTMLElement>('[data-floating-dock]');
  const closingEl = document.querySelector<HTMLElement>('#contact');
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

  const counters = [...document.querySelectorAll<HTMLElement>('[data-count-to]')];
  if (counters.length && 'IntersectionObserver' in window && !isReducedMotion) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.countTo || 0);
          if (target <= 0) {
            obs.unobserve(el);
            return;
          }
          const duration = 850;
          const startTime = performance.now();
          const step = (now: number) => {
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

  document.querySelectorAll<HTMLAnchorElement>('.mobile-menu nav a').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = link.closest('details');
      if (menu) menu.open = false;
    });
  });

  /* 7. Scroll-Autoplay Video Support */
  const scrollVideos = [...document.querySelectorAll<HTMLVideoElement>('video[data-scroll-autoplay]')];
  document.querySelector<HTMLAnchorElement>('[data-start-film]')?.addEventListener('click', () => {
    const video = document.querySelector<HTMLVideoElement>('#sample video');
    if (!video) return;
    video.muted = false;
    void video.play().catch(() => {});
  });

  if ('IntersectionObserver' in window && !isReducedMotion && scrollVideos.length) {
    const videoObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.dataset.reachedView = 'true';
            void video.play().catch(() => {});
          } else if (video.dataset.reachedView === 'true') {
            video.pause();
          }
        }),
      { threshold: 0.35 }
    );
    scrollVideos.forEach((video) => videoObserver.observe(video));
  }
}
