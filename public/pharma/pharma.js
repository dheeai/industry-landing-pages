(() => {
  const visual = document.querySelector('.science-visual');
  const toggle = document.querySelector('[data-motion-toggle]');
  const label = document.querySelector('[data-motion-label]');
  const icon = document.querySelector('.toggle-icon');
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
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
