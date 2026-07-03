/* ============================================================
   OdontoPlus — Autenticación (auth.js)
   Login, logout, gestión de sesión
   ============================================================ */

const Auth = {
    SESSION_KEY: 'odontoplus_session',

    /** 
     * Intenta iniciar sesión con email y contraseña mediante la API REST.
     * Almacena el JWT devuelto por el servidor y la matriz de permisos.
     */
    async login(email, contrasena) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: contrasena })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Error de autenticación' };
            }

            const data = await response.json();

            // Guardar sesión y JWT
            const session = {
                userId: data.user.userId,
                nombre: data.user.nombre,
                email: data.user.email,
                rol: data.user.rol,
                avatar: data.user.avatar || '',
                token: data.token,
                permissions: data.permissions,
                loginTime: new Date().toISOString()
            };

            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

            return { success: true, user: session };
        } catch (error) {
            return { success: false, error: 'Error al conectar con el servidor.' };
        }
    },

    /** Cierra la sesión activa eliminando el token y redirigiendo al login */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.hash = '/login';
    },

    /** Obtiene los datos de sesión almacenados en sessionStorage */
    getSession() {
        const data = sessionStorage.getItem(this.SESSION_KEY);
        return data ? JSON.parse(data) : null;
    },

    /** Verifica si existe una sesión activa */
    isAuthenticated() {
        return this.getSession() !== null;
    },

    /** Obtiene el usuario de la sesión actual */
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        return DataService.getById('usuarios', session.userId);
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

    /** Obtiene las iniciales del usuario para mostrarlas en el avatar */
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
