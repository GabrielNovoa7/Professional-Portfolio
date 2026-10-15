// Reveal each section once, without scroll handlers or animation dependencies.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('main > section')];
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        reveals.unobserve(entry.target);
      }
    }
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  for (const section of sections) {
    section.classList.add('reveal-pending');
    reveals.observe(section);
  }
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      reveals.disconnect();
      sections.forEach(section => section.classList.add('reveal-visible'));
    }
  });
}

// Use the section nearest the navigation as the current location.
const navLinks = [...document.querySelectorAll('#NavigationBar a')];
if ('IntersectionObserver' in window) {
  const visibleSections = new Set();
  const locations = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    const current = sections.find(section => visibleSections.has(section));
    navLinks.forEach(link => {
      if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-80px 0px -55% 0px', threshold: 0 });
  sections.forEach(section => locations.observe(section));
}

const themeSelect = document.querySelector('#theme-select');
themeSelect.value = document.documentElement.dataset.theme || 'system';
themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value;
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch { /* Theme still works without storage. */ }
});

// A separate sentinel detects docking without observing the animated bar itself.
const navSentinel = document.querySelector('.nav-sentinel');
const navigationPanel = document.querySelector('#NavigationBar');
if (navSentinel && navigationPanel && 'IntersectionObserver' in window) {
  const docking = new IntersectionObserver(([entry]) => {
    navigationPanel.classList.toggle('is-stuck', !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }, { threshold: 0, rootMargin: '-8px 0px 0px 0px' });
  docking.observe(navSentinel);
}

// Native disclosures remain usable by touch and keyboard; hover is an enhancement.
const hoverCapability = window.matchMedia('(hover: hover)');
document.querySelectorAll('.timeline-event').forEach(event => {
  const details = event.querySelector('details');
  if (!details) return;
  let openedByHover = false;
  event.addEventListener('pointerenter', () => {
    if (hoverCapability.matches && !details.open) {
      openedByHover = true;
      details.open = true;
    }
  });
  event.addEventListener('pointerleave', () => {
    if (openedByHover && !details.matches(':focus-within')) details.open = false;
    openedByHover = false;
  });
  details.querySelector('summary').addEventListener('click', () => { openedByHover = false; });
});
