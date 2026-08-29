// Theme toggle (shared)
(function () {
  const html = document.documentElement;
  const stored = localStorage.getItem('sejoura-theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
  }

  document.querySelectorAll('#theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('sejoura-theme', html.classList.contains('dark') ? 'dark' : 'light');
      // Re-render lucide icons if needed
      if (window.lucide) lucide.createIcons();
    });
  });
})();
