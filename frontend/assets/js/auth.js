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
            const user = DataService.findOne('usuarios', u => u.email === email && u.contrasena === contrasena);
            if (!user) {
                return { success: false, error: 'Usuario o contraseña incorrectos.' };
            }

            // Mapeo inverso de roles para generar matriz de permisos
            const roleMapRev = {
                'administrador': 'admin',
                'odontologo': 'doctor',
                'recepcionista': 'receptionist',
                'asistente_dental': 'assistant',
                'almacenero': 'warehouse'
            };
            const backendRole = roleMapRev[user.rol] || user.rol;

            const isEscapedAdmin = backendRole === 'admin';
            const isEscapedDoctor = backendRole === 'doctor';
            const isEscapedRecep = backendRole === 'receptionist';
            const isEscapedAsist = backendRole === 'assistant';
            const isEscapedWarehouse = backendRole === 'warehouse';

            // Matriz de permisos local equivalente al backend
            const permissions = {
                dashboard: { ver: true },
                pacientes: {
                    ver: isEscapedAdmin || isEscapedDoctor || isEscapedRecep || isEscapedAsist,
                    crear: isEscapedAdmin || isEscapedRecep,
                    editar: isEscapedAdmin || isEscapedDoctor,
                    eliminar: isEscapedAdmin
                },
                agenda: { ver: isEscapedAdmin || isEscapedDoctor || isEscapedRecep || isEscapedAsist },
                inventario: { ver: isEscapedAdmin || isEscapedWarehouse },
                facturacion: { ver: isEscapedAdmin || isEscapedRecep },
                reportes: { ver: !isEscapedWarehouse && !isEscapedAsist },
                configuracion: { ver: isEscapedAdmin }
            };

            const session = {
                userId: user.id,
                nombre: user.nombreCompleto || `${user.nombre} ${user.apellido}`,
                email: user.email,
                rol: user.rol,
                avatar: user.avatar || '',
                token: 'mock-jwt-token-12345',
                permissions: permissions,
                loginTime: new Date().toISOString()
            };

            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

            return { success: true, user: session };
        } catch (error) {
            return { success: false, error: 'Error al iniciar sesión local.' };
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
