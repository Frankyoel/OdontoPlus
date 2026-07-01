/* ============================================================
   OdontoPlus — Topbar Component (topbar.js)
   ============================================================ */

const Topbar = {
    render(title = '', subtitle = '') {
        const user = Auth.getSession();
        const rolLabel = Models.ROLES[user?.rol] || '';
        const initials = Auth.getCurrentUserInitials();

        return `
            <header class="topbar">
                <div class="topbar__left">
                    <button class="mobile-menu-btn" onclick="Sidebar.openMobile()">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                    <div class="topbar__greeting">
                        <h2>${title || 'Hola, ' + (user?.nombre?.split(' ')[0] || '')}</h2>
                        <p>${subtitle || 'Centro Odontológico OdontoPlus'}</p>
                    </div>
                </div>
                <div class="topbar__right">
                    <div class="topbar__search">
                        <span class="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Buscar pacientes, citas..." id="global-search" autocomplete="off">
                    </div>
                    <div class="topbar__role-badge">
                        <div class="status-dot status-dot--online"></div>
                        <span>${rolLabel}</span>
                    </div>
                    <button class="topbar__action" title="Cambiar Tema" onclick="Theme.toggle()">
                        <span class="material-symbols-outlined" id="theme-toggle-icon">${document.documentElement.getAttribute('data-theme') === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button class="topbar__action" title="Notificaciones" onclick="Toast.show('Sin notificaciones nuevas', 'info')">
                        <span class="material-symbols-outlined">notifications</span>
                    </button>
                    <div class="avatar avatar--sm avatar--initials" style="cursor: pointer; width: 36px; height: 36px; font-size: 12px;" title="${user?.nombre || ''}">
                        ${initials}
                    </div>
                </div>
            </header>
        `;
    }
};

window.Topbar = Topbar;
