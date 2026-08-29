// Séjoura Dashboard — Interactive demo logic

(function () {
  // --- Sidebar mobile ---
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const openBtn = document.getElementById('sidebar-open');
  const closeBtn = document.getElementById('sidebar-close');

  function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }

  openBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // --- Navigation pages ---
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page-content');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (!page) return;

      navItems.forEach(n => {
        n.classList.remove('active', 'bg-brand-600/20', 'text-brand-300');
        n.classList.add('text-slate-300');
      });
      item.classList.add('active', 'bg-brand-600/20', 'text-brand-300');
      item.classList.remove('text-slate-300');

      pages.forEach(p => p.classList.add('hidden'));
      const target = document.getElementById('page-' + page);
      if (target) target.classList.remove('hidden');

      closeSidebar();
      if (window.lucide) lucide.createIcons();
    });
  });

  // --- Notifications ---
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  const markAllRead = document.getElementById('mark-all-read');

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
  });
  document.addEventListener('click', () => notifDropdown?.classList.add('hidden'));
  notifDropdown?.addEventListener('click', e => e.stopPropagation());

  markAllRead?.addEventListener('click', () => {
    showToast('Toutes les notifications marquées comme lues');
    notifDropdown?.classList.add('hidden');
  });

  // --- Logout ---
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Se déconnecter de Séjoura ?')) {
      showToast('Déconnexion…');
      setTimeout(() => window.location.href = 'index.html', 800);
    }
  });

  // --- Modal booking ---
  const modal = document.getElementById('modal-booking');
  const openModalBtns = [document.getElementById('btn-new-booking'), document.getElementById('btn-new-booking-2')];
  const closeModal = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');

  function showModal() {
    modal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function hideModal() {
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => btn?.addEventListener('click', showModal));
  closeModal?.addEventListener('click', hideModal);
  backdrop?.addEventListener('click', hideModal);

  document.getElementById('booking-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    hideModal();
    showToast('Réservation créée avec succès !');
  });

  // --- Action buttons (check-in / check-out) ---
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const label = action === 'checkin' ? 'Check-in validé' : 'Check-out validé';
      btn.textContent = '✓ Fait';
      btn.classList.remove('text-brand-600');
      btn.classList.add('text-emerald-600');
      btn.disabled = true;
      showToast(label);
    });
  });

  // --- Filter buttons ---
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-brand-600', 'text-white');
        b.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });
      btn.classList.add('active', 'bg-brand-600', 'text-white');
      btn.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    });
  });

  // --- Toast helper ---
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('show');
    toast.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 2800);
  }

  // --- Charts ---
  const isDark = () => document.documentElement.classList.contains('dark');

  // Occupancy doughnut
  const occCtx = document.getElementById('occupancyChart');
  if (occCtx) {
    new Chart(occCtx, {
      type: 'doughnut',
      data: {
        labels: ['Occupées', 'Disponibles', 'En ménage'],
        datasets: [{
          data: [42, 6, 4],
          backgroundColor: ['#10b981', '#0c8ce9', '#f59e0b'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Revenue line
  const revCtx = document.getElementById('revenueChart');
  if (revCtx) {
    new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
          label: 'Recettes (FCFA)',
          data: [1800000, 2100000, 1950000, 2400000, 2650000, 2450000, 2200000],
          backgroundColor: '#0c8ce9',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
            ticks: {
              callback: (v) => (v / 1000000).toFixed(1) + 'M',
              color: isDark() ? '#94a3b8' : '#64748b',
              font: { size: 11 }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: isDark() ? '#94a3b8' : '#64748b', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Search demo
  document.getElementById('global-search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      showToast('Recherche : « ' + e.target.value + ' » (démo)');
    }
  });
})();
