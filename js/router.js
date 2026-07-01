/* ============================================================
   OdontoPlus — Router (router.js)
   Navegación SPA basada en hash
   ============================================================ */

const Router = {
    routes: {},
    currentRoute: null,
    container: null,

    /** Inicializa el router */
    init(containerId = 'app-content') {
        this.container = document.getElementById(containerId);
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    /** Registra una ruta */
    on(path, handler) {
        this.routes[path] = handler;
    },

    /** Navega a una ruta */
    navigate(path) {
        window.location.hash = path;
    },

    /** Obtiene la ruta actual */
    getCurrentPath() {
        return window.location.hash.slice(1) || '/login';
    },

    /** Obtiene parámetros de la ruta */
    getParams() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/').filter(Boolean);
        return parts;
    },

    /** Maneja el cambio de ruta */
    handleRoute() {
        const path = this.getCurrentPath();
        const parts = path.split('/').filter(Boolean);
        const basePath = '/' + (parts[0] || 'login');
        const params = parts.slice(1);

        // Si no está autenticado y no es login, redirigir
        if (basePath !== '/login' && !Auth.isAuthenticated()) {
            this.navigate('#/login');
            return;
        }

        // Si está autenticado y es login, redirigir a dashboard
        if (basePath === '/login' && Auth.isAuthenticated()) {
            this.navigate('#/dashboard');
            return;
        }

        // Verificar permisos para la ruta
        const moduleMap = {
            '/dashboard': 'dashboard',
            '/pacientes': 'pacientes',
            '/agenda': 'agenda',
            '/inventario': 'inventario',
            '/facturacion': 'facturacion',
            '/reportes': 'reportes',
            '/configuracion': 'configuracion'
        };

        const moduleName = moduleMap[basePath];
        if (moduleName && !Permissions.canAccess(moduleName)) {
            this.renderAccessDenied();
            return;
        }

        // Buscar el handler de la ruta
        const handler = this.routes[basePath];
        if (handler) {
            this.currentRoute = basePath;
            this.transition(() => {
                handler(params);
            });
            this.updateSidebarActive(basePath);
        } else {
            this.render404();
        }
    },

    /** Renderiza contenido con transición suave */
    transition(renderFn) {
        if (!this.container) return;
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(8px)';

        setTimeout(() => {
            renderFn();
            requestAnimationFrame(() => {
                this.container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                this.container.style.opacity = '1';
                this.container.style.transform = 'translateY(0)';
            });
        }, 150);
    },

    /** Actualiza el estado activo del sidebar */
    updateSidebarActive(path) {
        document.querySelectorAll('.sidebar__link').forEach(link => {
            const href = link.getAttribute('data-route');
            if (href === `#${path}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // También actualizar bottom nav en móvil
        document.querySelectorAll('.bottom-nav__item').forEach(item => {
            const href = item.getAttribute('data-route');
            if (href === `#${path}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    /** Renderiza la vista de acceso denegado */
    renderAccessDenied() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="access-denied">
                <span class="material-symbols-outlined">lock</span>
                <h2 class="text-headline-lg" style="color: var(--color-on-surface); margin-bottom: var(--space-sm);">Acceso Restringido</h2>
                <p class="text-body-md text-muted" style="margin-bottom: var(--space-lg);">No tienes permisos para acceder a esta sección.</p>
                <button class="btn btn--secondary" onclick="Router.navigate('#/dashboard')">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Volver al Inicio
                </button>
            </div>
        `;
    },

    /** Renderiza la vista 404 */
    render404() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="access-denied">
                <span class="material-symbols-outlined" style="color: var(--color-on-surface-variant);">explore_off</span>
                <h2 class="text-headline-lg" style="color: var(--color-on-surface); margin-bottom: var(--space-sm);">Página no encontrada</h2>
                <p class="text-body-md text-muted" style="margin-bottom: var(--space-lg);">La sección que buscas no existe.</p>
                <button class="btn btn--primary" onclick="Router.navigate('#/dashboard')">
                    <span class="material-symbols-outlined">home</span>
                    Ir al Inicio
                </button>
            </div>
        `;
    }
};

window.Router = Router;
