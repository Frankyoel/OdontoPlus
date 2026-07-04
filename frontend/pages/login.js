/* ============================================================
   OdontoPlus — Módulo Login (login.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Login = {
    render() {
        const container = document.getElementById('app-content');
        
        container.innerHTML = `
            <div class="login-layout">
                <!-- Lado Izquierdo: Formulario -->
                <div class="login-layout__left">
                    <div style="max-width: 420px; width: 100%; margin: 0 auto; z-index: 1;">
                        
                        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-2xl);">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--gradient-brand); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px -2px rgba(70, 72, 212, 0.3);">
                                <span class="material-symbols-outlined" style="font-size: 28px; font-variation-settings: 'FILL' 1;">dentistry</span>
                            </div>
                            <div>
                                <h1 class="text-headline-lg text-primary" style="font-weight: 800; line-height: 1.1;">OdontoPlus</h1>
                                <p class="text-body-sm text-muted">Gestión Clínica Integral</p>
                            </div>
                        </div>

                        <div class="login-card">
                            <div class="login-card__bar"></div>
                            <h2 class="text-headline-md mb-xs">Bienvenido de nuevo</h2>
                            <p class="text-body-sm text-muted mb-xl">Ingresa tus credenciales para acceder al sistema.</p>

                            <form id="login-form" onsubmit="window.Modules.Login.handleLogin(event)">
                                <div class="input-group mb-md">
                                    <label class="input-label" for="email">Correo Electrónico</label>
                                    <div class="input-icon-wrapper">
                                        <span class="material-symbols-outlined">mail</span>
                                        <input type="email" id="email" class="input-field" placeholder="ejemplo@odontoplus.pe" required value="admin@odontoplus.pe">
                                    </div>
                                </div>

                                <div class="input-group mb-xl">
                                    <label class="input-label" for="password">Contraseña</label>
                                    <div class="input-icon-wrapper">
                                        <span class="material-symbols-outlined">lock</span>
                                        <input type="password" id="password" class="input-field" placeholder="••••••••" required value="admin123">
                                    </div>
                                    <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                                        <a href="#" class="text-label-md text-primary" style="text-decoration: underline;" onclick="Toast.info('Contacta al administrador del sistema para recuperar tu contraseña.')">¿Olvidaste tu contraseña?</a>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn--primary btn--full mb-lg" style="height: 48px; font-size: 16px;">
                                    Ingresar al Sistema
                                    <span class="material-symbols-outlined">arrow_forward</span>
                                </button>
                                
                                <div id="login-error" class="text-body-sm text-error text-center hidden"></div>
                            </form>
                            
                            <!-- Demo Accounts Quick Login -->
                            <div style="margin-top: var(--space-xl); border-top: 1px solid var(--color-surface-variant); padding-top: var(--space-md);">
                                <p class="text-label-md text-muted text-center mb-sm">Cuentas de demostración:</p>
                                <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); justify-content: center;">
                                    <button class="chip chip--outline" onclick="window.Modules.Login.fillDemo('admin@odontoplus.pe', 'admin123')">Administrador</button>
                                    <button class="chip chip--outline" onclick="window.Modules.Login.fillDemo('dra.torres@odontoplus.pe', 'doctor123')">Odontólogo</button>
                                    <button class="chip chip--outline" onclick="window.Modules.Login.fillDemo('lucia.paredes@odontoplus.pe', 'asistente123')">Asist. Dental</button>
                                    <button class="chip chip--outline" onclick="window.Modules.Login.fillDemo('recepcion@odontoplus.pe', 'recepcion123')">Recepcionista</button>
                                    <button class="chip chip--outline" onclick="window.Modules.Login.fillDemo('almacen@odontoplus.pe', 'almacen123')">Almacén</button>
                                </div>
                            </div>
                        </div>
                        
                        <p class="text-label-md text-muted text-center mt-xl">
                            &copy; ${new Date().getFullYear()} Centro Odontológico OdontoPlus
                        </p>
                    </div>
                </div>

                <!-- Lado Derecho: Imagen/Branding -->
                <div class="login-layout__right">
                    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Clínica Moderna" style="max-width: 80%; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); border: 4px solid white;">
                    
                    <div class="glass-card" style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); padding: var(--space-lg); width: 80%; max-width: 400px; text-align: center;">
                        <h3 class="text-headline-sm mb-xs" style="color: var(--color-on-surface);">Instalaciones de Última Generación</h3>
                        <p class="text-body-sm" style="color: var(--color-on-surface-variant);">Distrito Médico del Centro</p>
                    </div>
                </div>
            </div>
        `;
    },

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        const btn = e.target.querySelector('button[type="submit"]');

        btn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">autorenew</span> Procesando...`;
        btn.disabled = true;

        const result = await Auth.login(email, password);
        
        if (result.success) {
            Toast.success(`¡Bienvenido/a, ${result.user.nombre}!`);
            Router.navigate('#/dashboard');
        } else {
            errorDiv.textContent = result.error;
            errorDiv.classList.remove('hidden');
            btn.innerHTML = `Ingresar al Sistema <span class="material-symbols-outlined">arrow_forward</span>`;
            btn.disabled = false;
            
            // Shake animation for error
            const card = document.querySelector('.login-card');
            card.style.transform = 'translateX(-10px)';
            setTimeout(() => card.style.transform = 'translateX(10px)', 100);
            setTimeout(() => card.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => card.style.transform = 'translateX(0)', 300);
        }
    },

    fillDemo(email, pass) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = pass;
        document.getElementById('login-error').classList.add('hidden');
    }
};
