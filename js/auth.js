/* ============================================================
   OdontoPlus — Autenticación (auth.js)
   Login, logout, gestión de sesión
   ============================================================ */

const Auth = {
    SESSION_KEY: 'odontoplus_session',

    /** Intenta iniciar sesión con email y contraseña */
    login(email, contrasena) {
        const usuarios = DataService.getUsuarios();
        const usuario = usuarios.find(u => u.email === email && u.contrasena === contrasena && u.activo);

        if (!usuario) {
            return { success: false, error: 'Credenciales inválidas o usuario inactivo' };
        }

        // Guardar sesión
        const session = {
            userId: usuario.id,
            nombre: usuario.nombreCompleto,
            email: usuario.email,
            rol: usuario.rol,
            avatar: usuario.avatar,
            loginTime: new Date().toISOString()
        };

        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

        // Actualizar último acceso
        DataService.update('usuarios', usuario.id, { ultimoAcceso: new Date().toISOString() });

        return { success: true, user: session };
    },

    /** Cierra la sesión */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.hash = '/login';
    },

    /** Obtiene la sesión actual */
    getSession() {
        const data = sessionStorage.getItem(this.SESSION_KEY);
        return data ? JSON.parse(data) : null;
    },

    /** Verifica si hay una sesión activa */
    isAuthenticated() {
        return this.getSession() !== null;
    },

    /** Obtiene el usuario completo de la sesión actual */
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        return DataService.getById('usuarios', session.userId);
    },

    /** Obtiene el rol del usuario actual */
    getCurrentRole() {
        const session = this.getSession();
        return session ? session.rol : null;
    },

    /** Obtiene el nombre del usuario actual */
    getCurrentUserName() {
        const session = this.getSession();
        return session ? session.nombre : '';
    },

    /** Obtiene las iniciales del usuario */
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
