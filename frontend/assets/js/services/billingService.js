/* ============================================================
   OdontoPlus — Facturación Service (billingService.js)
   ============================================================ */

const BillingService = {
    getAll() {
        return ApiClient.get('/api/facturas');
    },
    getById(id) {
        return ApiClient.get(`/api/facturas/${id}`);
    },
    getPendientes() {
        return ApiClient.get('/api/facturas?estado=pendiente');
    },
    create(data) {
        return ApiClient.post('/api/facturas', data);
    },
    update(id, data) {
        return ApiClient.put(`/api/facturas/${id}`, data);
    },
    marcarPagada(id, metodoPago) {
        return ApiClient.put(`/api/facturas/${id}/pagar`, { metodoPago });
    }
};

window.BillingService = BillingService;
