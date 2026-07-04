/* ============================================================
   OdontoPlus — Permisos (permissions.js)
   Control de acceso por rol gestionado dinámicamente desde el Backend
   ============================================================ */

const Permissions = {
    /** Obtiene los permisos del usuario desde la sesión actual (provistos por el backend) */
    getPermissions() {
        const session = Auth.getSession();
        return session ? session.permissions : null;
    },

    /** Verifica si el rol actual puede acceder a un módulo */
    canAccess(modulo) {
        const perms = this.getPermissions();
        if (!perms) return false;
        return perms[modulo]?.ver === true;
    },

    /** Verifica si puede crear en un módulo */
    canCreate(modulo) {
        const perms = this.getPermissions();
        if (!perms) return false;
        return perms[modulo]?.crear === true;
    },

    /** Verifica si puede editar en un módulo */
    canEdit(modulo) {
        const perms = this.getPermissions();
        if (!perms) return false;
        return perms[modulo]?.editar === true;
    },

    /** Verifica si puede eliminar en un módulo */
    canDelete(modulo) {
        const perms = this.getPermissions();
        if (!perms) return false;
        return perms[modulo]?.eliminar === true;
    },

    /** Obtiene el tipo de dashboard para el rol actual */
    getDashboardType() {
        // Lógica de fallback para visualización frontend, o puedes extender el backend
        const rol = Auth.getCurrentRole();
        if (rol === 'admin') return 'completo';
        if (rol === 'doctor' || rol === 'assistant') return 'clinico';
        if (rol === 'warehouse') return 'inventario';
        return 'limitado';
    },

    /** Obtiene el tipo de reportes para el rol actual */
    getReportType() {
        const rol = Auth.getCurrentRole();
        if (rol === 'admin') return 'todos';
        if (rol === 'doctor') return 'clinicos';
        if (rol === 'warehouse') return 'inventario';
        if (rol === 'receptionist') return 'atenciones';
        return null;
    },

    /** Obtiene los módulos del sidebar accesibles para el rol actual */
    getAccessibleModules() {
        const perms = this.getPermissions();
        if (!perms) return [];

        const allModules = [
            { id: 'dashboard', label: 'Inicio', icon: 'dashboard', route: '#/dashboard' },
            { id: 'pacientes', label: 'Pacientes', icon: 'person', route: '#/pacientes' },
            { id: 'agenda', label: 'Agenda', icon: 'calendar_month', route: '#/agenda' },
            { id: 'inventario', label: 'Inventario', icon: 'inventory_2', route: '#/inventario' },
            { id: 'facturacion', label: 'Facturación', icon: 'payments', route: '#/facturacion' },
            { id: 'reportes', label: 'Reportes', icon: 'analytics', route: '#/reportes' },
            { id: 'configuracion', label: 'Configuración', icon: 'settings', route: '#/configuracion' }
        ];

        // Filtramos usando la matriz generada por el backend en `Auth.login`
        // Nota: reportes y configuracion podrían añadirse a la estrategia del backend en el futuro.
        return allModules.filter(m => {
            if (m.id === 'reportes' || m.id === 'configuracion') {
                const rol = Auth.getCurrentRole();
                if (m.id === 'reportes') return ['admin', 'doctor', 'receptionist', 'warehouse'].includes(rol);
                if (m.id === 'configuracion') return rol === 'admin';
            }
            return this.canAccess(m.id);
        });
    }
};

window.Permissions = Permissions;
