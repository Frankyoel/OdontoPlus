/* ============================================================
   OdontoPlus — Pacientes Service (patientService.js)
   Toda la comunicación con /api/pacientes pasa por aquí
   ============================================================ */

const PatientService = {
    getAll() {
        return ApiClient.get('/api/pacientes');
    },
    getById(id) {
        return ApiClient.get(`/api/pacientes/${id}`);
    },
    create(data) {
        return ApiClient.post('/api/pacientes', data);
    },
    update(id, data) {
        return ApiClient.put(`/api/pacientes/${id}`, data);
    },
    toggleActive(id, activo) {
        return ApiClient.put(`/api/pacientes/${id}`, { activo });
    },
    getHistorial(id) {
        return ApiClient.get(`/api/pacientes/${id}/historial`);
    },
    addHistorial(id, data) {
        return ApiClient.post(`/api/pacientes/${id}/historial`, data);
    },
    getRecetas(id) {
        return ApiClient.get(`/api/recetas?pacienteId=${id}`);
    },
    createReceta(data) {
        return ApiClient.post('/api/recetas', data);
    }
};

window.PatientService = PatientService;
