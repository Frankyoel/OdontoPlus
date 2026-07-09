/* ============================================================
   OdontoPlus — Cliente HTTP Central (apiClient.js)
   - Inyecta JWT automáticamente en cada petición
   - Maneja errores comunes: 401, 403, 500, red
   - Todos los servicios usan ApiClient, nunca fetch directo
   ============================================================ */

const ApiClient = {

    /** Obtiene el token JWT guardado en sessionStorage */
    _getToken() {
        const raw = sessionStorage.getItem('odontoplus_session');
        if (!raw) return null;
        try { return JSON.parse(raw).token; } catch { return null; }
    },

    /** Construye los headers comunes para todas las peticiones */
    _buildHeaders(extra = {}) {
        const headers = { 'Content-Type': 'application/json', ...extra };
        const token = this._getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    },

    /**
     * Realiza una petición HTTP genérica.
     * @returns {Promise<any>} Datos de la respuesta (JSON parseado)
     * @throws {Error} Con propiedad `status` y mensaje legible
     */
    async request(method, path, body = null) {
        const url = `${Config.API_BASE}${path}`;
        const options = {
            method,
            headers: this._buildHeaders()
        };
        if (body !== null) options.body = JSON.stringify(body);

        let response;
        try {
            response = await fetch(url, options);
        } catch (networkError) {
            // Sin conexión al servidor
            Toast.error('No se pudo conectar al servidor. Verifica que el backend esté en ejecución.');
            throw Object.assign(new Error('Network error'), { status: 0 });
        }

        // Sesión expirada o token inválido → redirige al login
        if (response.status === 401) {
            sessionStorage.removeItem('odontoplus_session');
            Toast.warning('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
            setTimeout(() => { window.location.hash = '/login'; }, 1500);
            throw Object.assign(new Error('Unauthorized'), { status: 401 });
        }

        // Sin permisos para este recurso
        if (response.status === 403) {
            Toast.error('No tienes permiso para realizar esta acción.');
            throw Object.assign(new Error('Forbidden'), { status: 403 });
        }

        // Error de servidor
        if (response.status >= 500) {
            Toast.error('Error interno del servidor. Intenta de nuevo más tarde.');
            throw Object.assign(new Error('Server error'), { status: response.status });
        }

        // 204 No Content — respuesta vacía esperada
        if (response.status === 204) return null;

        // Intentar parsear JSON
        let data;
        try {
            data = await response.json();
        } catch {
            data = null;
        }

        // Error de validación u otros 4xx
        if (!response.ok) {
            const msg = data?.message || data?.title || `Error ${response.status}`;
            Toast.error(msg);
            throw Object.assign(new Error(msg), { status: response.status, data });
        }

        return data;
    },

    /** GET a un endpoint */
    get(path) {
        return this.request('GET', path);
    },

    /** POST con body JSON */
    post(path, body) {
        return this.request('POST', path, body);
    },

    /** PUT con body JSON */
    put(path, body) {
        return this.request('PUT', path, body);
    },

    /** DELETE */
    delete(path) {
        return this.request('DELETE', path);
    }
};

window.ApiClient = ApiClient;
