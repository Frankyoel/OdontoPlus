/* ============================================================
   OdontoPlus — Permisos (permissions.js)
   Control de acceso por rol gestionado dinámicamente desde el Backend.

   API disponible:
     - Permissions.canAccess(modulo)       → usa objeto legacy { ver }
     - Permissions.canCreate(modulo)       → usa objeto legacy { crear }
     - Permissions.canEdit(modulo)         → usa objeto legacy { editar }
     - Permissions.canDelete(modulo)       → usa objeto legacy { eliminar }
     - Permissions.hasPermission(perm)     → alias de Auth.hasPermission()
     - Auth.hasPermission('Patients.View') → usa array granular permissionsList
   ============================================================ */

const Permissions = {
    /** Obtiene los permisos del usuario desde la sesión actual (provistos por el backend) */
    getPermissions() {
        const session = Auth.getSession();
        return session ? session.permissions : null;
    },

    // ─── API Legacy — compatible con toda la interfaz existente ───────────────

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

    // ─── API Nueva — permisos granulares ─────────────────────────────────────

    /**
     * Alias de Auth.hasPermission(). Verifica un permiso granular por string.
     * Ejemplo: Permissions.hasPermission('Patients.Create')
     */
    hasPermission(permission) {
        return Auth.hasPermission(permission);
    },

    // ─── Helpers de tipo ─────────────────────────────────────────────────────

    /** Obtiene el tipo de dashboard para el rol actual */
    getDashboardType() {
        const rol = Auth.getCurrentRole();
        if (rol === 'admin')                return 'completo';
        if (rol === 'doctor')               return 'clinico';
        if (rol === 'warehouse')            return 'inventario';
        if (rol === 'receptionist' || rol === 'assistant') return 'limitado';
        return 'limitado';
    },

    /** Obtiene el tipo de reportes para el rol actual */
    getReportType() {
        const rol = Auth.getCurrentRole();
        if (rol === 'admin')        return 'todos';
        if (rol === 'doctor')       return 'clinicos';
        if (rol === 'warehouse')    return 'inventario';
        if (rol === 'receptionist') return 'atenciones';
        return null;
    },

    /** Obtiene los módulos del sidebar accesibles para el rol actual */
    getAccessibleModules() {
        const perms = this.getPermissions();
        if (!perms) return [];

        const allModules = [
            { id: 'dashboard',     label: 'Inicio',        icon: 'dashboard',    route: '#/dashboard' },
            { id: 'pacientes',     label: 'Pacientes',     icon: 'person',       route: '#/pacientes' },
            { id: 'agenda',        label: 'Agenda',        icon: 'calendar_month', route: '#/agenda' },
            { id: 'inventario',    label: 'Inventario',    icon: 'inventory_2',  route: '#/inventario' },
            { id: 'facturacion',   label: 'Facturación',   icon: 'payments',     route: '#/facturacion' },
            { id: 'reportes',      label: 'Reportes',      icon: 'analytics',    route: '#/reportes' },
            { id: 'configuracion', label: 'Configuración', icon: 'settings',     route: '#/configuracion' }
        ];

        // Filtra los módulos usando el objeto de permisos legacy (que ahora viene del PermissionService)
        return allModules.filter(m => this.canAccess(m.id));
    }
};

window.Permissions = Permissions;
