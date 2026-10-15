// Apply saved appearance before paint; System follows the device automatically.
(() => {
  let theme = 'system';
  try { theme = localStorage.getItem('portfolio-theme') || 'system'; } catch { /* Use system default. */ }
  document.documentElement.dataset.theme = ['light', 'dark', 'system'].includes(theme) ? theme : 'system';
})();
