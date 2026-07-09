/* ============================================================
   OdontoPlus — Autenticación (auth.js)
   Login real contra el backend. Requiere el servidor activo.
   ============================================================ */

const Auth = {
    SESSION_KEY: 'odontoplus_session',

    /**
     * Inicia sesión llamando al endpoint POST /api/auth/login.
     * El backend valida las credenciales y devuelve el JWT + permisos.
     */
    async login(email, contrasena) {
        try {
            const data = await ApiClient.post('/api/auth/login', { email, password: contrasena });

            const session = {
                userId: data.user?.userId,
                nombre: data.user?.nombre,
                email: data.user?.email,
                rol: data.user?.rol,
                avatar: data.user?.avatar || '',
                token: data.token,
                permissions: data.permissions,
                loginTime: new Date().toISOString()
            };

            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            return { success: true, user: session };

        } catch (err) {
            // ApiClient ya mostró Toast si fue 401/403/500/red.
            // Para credenciales inválidas el backend devuelve 400 o 401.
            const msg = err.data?.message || err.message || 'Error al iniciar sesión.';
            return { success: false, error: msg };
        }
    },

    /** Cierra la sesión activa eliminando el token del session storage */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.hash = '/login';
    },

    /** Obtiene los datos de sesión almacenados */
    getSession() {
        const data = sessionStorage.getItem(this.SESSION_KEY);
        return data ? JSON.parse(data) : null;
    },

    /** Verifica si existe una sesión activa */
    isAuthenticated() {
        return this.getSession() !== null;
    },

    /** Obtiene el rol del usuario de la sesión actual */
    getCurrentRole() {
        const session = this.getSession();
        return session ? session.rol : null;
    },

    /** Obtiene el nombre del usuario de la sesión actual */
    getCurrentUserName() {
        const session = this.getSession();
        return session ? session.nombre : '';
    },

    /** Obtiene las iniciales del usuario para el avatar */
    getCurrentUserInitials() {
        const session = this.getSession();
        if (!session) return '';
        const parts = session.nombre.replace('Dra. ', '').replace('Dr. ', '').split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
    }
};

window.Auth = Auth;
