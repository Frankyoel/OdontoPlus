/* ============================================================
   OdontoPlus — Permisos (permissions.js)
   Control de acceso por rol
   ============================================================ */

const Permissions = {
    /** Matriz de permisos por rol y módulo */
    matrix: {
        administrador: {
            dashboard: { ver: true, tipo: 'completo' },
            pacientes: { ver: true, crear: true, editar: true, eliminar: true },
            historial: { ver: true, crear: true, editar: true },
            recetas: { ver: true, crear: true },
            agenda: { ver: true, crear: true, editar: true, eliminar: true },
            inventario: { ver: true, crear: true, editar: true, eliminar: true },
            facturacion: { ver: true, crear: true, editar: true, eliminar: true },
            reportes: { ver: true, tipo: 'todos' },
            configuracion: { ver: true, crear: true, editar: true, eliminar: true }
        },
        odontologo: {
            dashboard: { ver: true, tipo: 'clinico' },
            pacientes: { ver: true, crear: false, editar: true, eliminar: false },
            historial: { ver: true, crear: true, editar: true },
            recetas: { ver: true, crear: true },
            agenda: { ver: true, crear: false, editar: false, eliminar: false, soloPropio: true },
            inventario: { ver: true, crear: false, editar: false, eliminar: false },
            facturacion: { ver: false },
            reportes: { ver: true, tipo: 'clinicos' },
            configuracion: { ver: false }
        },
        asistente_dental: {
            dashboard: { ver: true, tipo: 'clinico_limitado' },
            pacientes: { ver: true, crear: false, editar: false, eliminar: false },
            historial: { ver: true, crear: false, editar: false },
            recetas: { ver: false },
            agenda: { ver: true, crear: false, editar: false, eliminar: false },
            inventario: { ver: false },
            facturacion: { ver: false },
            reportes: { ver: false },
            configuracion: { ver: false }
        },
        recepcionista: {
            dashboard: { ver: true, tipo: 'limitado' },
            pacientes: { ver: true, crear: true, editar: false, eliminar: false },
            historial: { ver: false },
            recetas: { ver: false },
            agenda: { ver: true, crear: true, editar: true, eliminar: true },
            inventario: { ver: false },
            facturacion: { ver: true, crear: true, editar: false, eliminar: false },
            reportes: { ver: true, tipo: 'atenciones' },
            configuracion: { ver: false }
        },
        almacenero: {
            dashboard: { ver: true, tipo: 'inventario' },
            pacientes: { ver: false },
            historial: { ver: false },
            recetas: { ver: false },
            agenda: { ver: false },
            inventario: { ver: true, crear: true, editar: true, eliminar: true },
            facturacion: { ver: false },
            reportes: { ver: true, tipo: 'inventario' },
            configuracion: { ver: false }
        }
    },

    /** Verifica si el rol actual puede acceder a un módulo */
    canAccess(modulo) {
        const rol = Auth.getCurrentRole();
        if (!rol) return false;
        const perms = this.matrix[rol]?.[modulo];
        return perms?.ver === true;
    },

    /** Verifica si puede crear en un módulo */
    canCreate(modulo) {
        const rol = Auth.getCurrentRole();
        if (!rol) return false;
        return this.matrix[rol]?.[modulo]?.crear === true;
    },

    /** Verifica si puede editar en un módulo */
    canEdit(modulo) {
        const rol = Auth.getCurrentRole();
        if (!rol) return false;
        return this.matrix[rol]?.[modulo]?.editar === true;
    },

    /** Verifica si puede eliminar en un módulo */
    canDelete(modulo) {
        const rol = Auth.getCurrentRole();
        if (!rol) return false;
        return this.matrix[rol]?.[modulo]?.eliminar === true;
    },

    /** Obtiene el tipo de dashboard para el rol actual */
    getDashboardType() {
        const rol = Auth.getCurrentRole();
        return this.matrix[rol]?.dashboard?.tipo || 'limitado';
    },

    /** Obtiene el tipo de reportes para el rol actual */
    getReportType() {
        const rol = Auth.getCurrentRole();
        return this.matrix[rol]?.reportes?.tipo || null;
    },

    /** Obtiene los módulos del sidebar accesibles para el rol actual */
    getAccessibleModules() {
        const rol = Auth.getCurrentRole();
        if (!rol) return [];

        const allModules = [
            { id: 'dashboard', label: 'Inicio', icon: 'dashboard', route: '#/dashboard' },
            { id: 'pacientes', label: 'Pacientes', icon: 'person', route: '#/pacientes' },
            { id: 'agenda', label: 'Agenda', icon: 'calendar_month', route: '#/agenda' },
            { id: 'inventario', label: 'Inventario', icon: 'inventory_2', route: '#/inventario' },
            { id: 'facturacion', label: 'Facturación', icon: 'payments', route: '#/facturacion' },
            { id: 'reportes', label: 'Reportes', icon: 'analytics', route: '#/reportes' },
            { id: 'configuracion', label: 'Configuración', icon: 'settings', route: '#/configuracion' }
        ];

        return allModules.filter(m => this.canAccess(m.id));
    }
};

window.Permissions = Permissions;
