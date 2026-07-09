/* ============================================================
   OdontoPlus — Citas Service (appointmentService.js)
   ============================================================ */

const AppointmentService = {
    getAll() {
        return ApiClient.get('/api/citas');
    },
    getById(id) {
        return ApiClient.get(`/api/citas/${id}`);
    },
    getToday() {
        const hoy = new Date().toISOString().split('T')[0];
        return ApiClient.get(`/api/citas?fecha=${hoy}`);
    },
    getByDate(fecha) {
        return ApiClient.get(`/api/citas?fecha=${fecha}`);
    },
    create(data) {
        return ApiClient.post('/api/citas', data);
    },
    update(id, data) {
        return ApiClient.put(`/api/citas/${id}`, data);
    },
    updateEstado(id, estado) {
        return ApiClient.put(`/api/citas/${id}/estado`, { estado });
    },
    delete(id) {
        return ApiClient.delete(`/api/citas/${id}`);
    }
};

window.AppointmentService = AppointmentService;
