/* ============================================================
   OdontoPlus — Dashboard Service (dashboardService.js)
   Estadísticas y métricas del panel principal
   ============================================================ */

const DashboardService = {
    getStats() {
        return ApiClient.get('/api/dashboard/stats');
    },
    getIngresosSemanales() {
        return ApiClient.get('/api/dashboard/ingresos-semana');
    }
};

window.DashboardService = DashboardService;
