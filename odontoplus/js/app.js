/* ============================================================
   OdontoPlus — Inicialización (app.js)
   Punto de entrada de la SPA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Toast
    Toast.init();

    // Inicializar Base de Datos (localStorage)
    SeedData.init();

    // Configurar Rutas
    Router.on('/login', window.Modules.Login.render);
    Router.on('/dashboard', window.Modules.Dashboard.render);
    Router.on('/pacientes', window.Modules.Patients.render);
    Router.on('/agenda', window.Modules.Appointments.render);
    Router.on('/inventario', window.Modules.Inventory.render);
    Router.on('/facturacion', window.Modules.Billing.render);
    Router.on('/reportes', window.Modules.Reports.render);
    Router.on('/configuracion', window.Modules.Settings.render);

    // Arrancar el Router
    Router.init('app-content');
});

window.Modules = window.Modules || {};
