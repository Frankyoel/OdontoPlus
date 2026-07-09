/* ============================================================
   OdontoPlus — Inicialización (app.js)
   Punto de entrada de la SPA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Toast
    Toast.init();

    // Configurar Rutas — Se usan arrow functions para preservar el contexto `this` de cada módulo
    Router.on('/login', (...args) => window.Modules.Login.render(...args));
    Router.on('/dashboard', (...args) => window.Modules.Dashboard.render(...args));
    Router.on('/pacientes', (...args) => window.Modules.Patients.render(...args));
    Router.on('/agenda', (...args) => window.Modules.Appointments.render(...args));
    Router.on('/inventario', (...args) => window.Modules.Inventory.render(...args));
    Router.on('/facturacion', (...args) => window.Modules.Billing.render(...args));
    Router.on('/reportes', (...args) => window.Modules.Reports.render(...args));
    Router.on('/configuracion', (...args) => window.Modules.Settings.render(...args));

    // Arrancar el Router
    Router.init('app-content');
});

window.Modules = window.Modules || {};
