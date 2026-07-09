/* ============================================================
   OdontoPlus — Sidebar Component (sidebar.js)
   Sidebar dinámico según rol del usuario
   ============================================================ */

const Sidebar = {
    /** Renderiza el sidebar completo */
    render() {
        const modules = Permissions.getAccessibleModules();
        const user = Auth.getSession();
        const initials = Auth.getCurrentUserInitials();
        const rolesMap = {
            'admin': 'Administrador',
            'doctor': 'Odontólogo',
            'receptionist': 'Recepcionista',
            'assistant': 'Asistente Dental',
            'warehouse': 'Almacén'
        };
        const rolLabel = rolesMap[user?.rol] || 'Usuario';
        return `
            <aside class="sidebar" id="sidebar">
                <!-- Brand -->
                <div class="sidebar__brand">
                    <div class="sidebar__logo">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dentistry</span>
                    </div>
                    <div>
                        <div class="sidebar__title">OdontoPlus</div>
                        <div class="sidebar__subtitle">Centro Odontológico</div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="sidebar__nav">
                    ${modules.map(m => `
                        <a class="sidebar__link" data-route="${m.route}" href="${m.route}" onclick="event.preventDefault(); Router.navigate('${m.route}'); Sidebar.closeMobile();">
                            <span class="material-symbols-outlined">${m.icon}</span>
                            <span>${m.label}</span>
                        </a>
                    `).join('')}
                </nav>

                <!-- Footer -->
                <div class="sidebar__footer">
                    <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-md);">
                        <div class="avatar avatar--sm avatar--initials" style="width: 36px; height: 36px; font-size: 12px;">
                            ${initials}
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div class="text-body-sm font-semibold truncate" style="font-size: 13px;">${user?.nombre || ''}</div>
                            <div class="text-label-md text-muted">${rolLabel}</div>
                        </div>
                    </div>
                    <button class="sidebar__link sidebar__link--danger" onclick="Auth.logout()">
                        <span class="material-symbols-outlined">logout</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <div class="sidebar-overlay" id="sidebar-overlay" onclick="Sidebar.closeMobile()"></div>
        `;
    },

    /** Actualiza el estado activo de los links */
    updateActive(route) {
        document.querySelectorAll('.sidebar__link').forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === `#${route}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    /** Abre el sidebar en móvil */
    openMobile() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('visible');
    },

    /** Cierra el sidebar en móvil */
    closeMobile() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
    }
};

window.Sidebar = Sidebar;
