/* ============================================================
   OdontoPlus — Usuarios Service (usuarioService.js)
   ============================================================ */

const UsuarioService = {
    getAll() {
        return ApiClient.get('/api/usuarios');
    },
    getOdontologos() {
        return ApiClient.get('/api/usuarios/odontologos');
    }
};

window.UsuarioService = UsuarioService;
