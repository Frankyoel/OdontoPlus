/* ============================================================
   OdontoPlus — Inventario Service (inventoryService.js)
   ============================================================ */

const InventoryService = {
    getAll() {
        return ApiClient.get('/api/inventario');
    },
    getById(id) {
        return ApiClient.get(`/api/inventario/${id}`);
    },
    getLowStock() {
        return ApiClient.get('/api/inventario?estadoStock=critico,bajo');
    },
    create(data) {
        return ApiClient.post('/api/inventario', data);
    },
    update(id, data) {
        return ApiClient.put(`/api/inventario/${id}`, data);
    },
    delete(id) {
        return ApiClient.delete(`/api/inventario/${id}`);
    },
    // Proveedores
    getProveedores() {
        return ApiClient.get('/api/proveedores');
    },
    getProveedor(id) {
        return ApiClient.get(`/api/proveedores/${id}`);
    },
    createProveedor(data) {
        return ApiClient.post('/api/proveedores', data);
    },
    updateProveedor(id, data) {
        return ApiClient.put(`/api/proveedores/${id}`, data);
    }
};

window.InventoryService = InventoryService;
