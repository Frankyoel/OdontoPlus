/* ============================================================
   OdontoPlus — Módulo Configuración (settings.js)
   Usa UsuarioService (API real)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Settings = {
    _usuariosCache: [],

    async render() {
        const container = document.getElementById('app-content');

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Configuración', 'Administración del sistema')}
                    <div class="page-content">
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Ajustes del Sistema</h1>
                                <p class="text-body-md text-muted">Gestión de clínica, usuarios y permisos</p>
                            </div>
                        </div>

                        <div class="tabs mb-lg">
                            <button class="tab active" onclick="window.Modules.Settings.switchTab('usuarios', this)">Usuarios y Roles</button>
                            <button class="tab" onclick="window.Modules.Settings.switchTab('clinica', this)">Datos de Clínica</button>
                            <button class="tab" onclick="window.Modules.Settings.switchTab('sistema', this)">Preferencias</button>
                        </div>

                        <div id="settings-content">
                            <div class="flex items-center justify-center p-xl">
                                <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        try {
            this._usuariosCache = await UsuarioService.getAll();
            const content = document.getElementById('settings-content');
            if (content) {
                content.innerHTML = this._renderUsuariosTab(this._usuariosCache);
            }
        } catch (_) { }
    },

    switchTab(tab, clickedBtn) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if (clickedBtn) clickedBtn.classList.add('active');

        const content = document.getElementById('settings-content');
        if (tab === 'usuarios') {
            content.innerHTML = this._renderUsuariosTab(this._usuariosCache);
        } else if (tab === 'clinica') {
            content.innerHTML = this._renderClinicaTab();
        } else {
            content.innerHTML = this._renderSistemaTab();
        }
    },

    _renderUsuariosTab(usuarios) {
        const roles = {
            'admin': 'Administrador', 'doctor': 'Odontólogo', 'receptionist': 'Recepción',
            'assistant': 'Asistente', 'warehouse': 'Almacén'
        };

        return `
            <div class="glass-card p-lg mb-lg">
                <div class="flex justify-between items-center mb-md">
                    <h3 class="text-headline-sm">Personal Registrado</h3>
                    <button class="btn btn--primary btn--sm" onclick="Toast.info('Función no disponible en modo demostración API')">
                        <span class="material-symbols-outlined" style="font-size:16px;">person_add</span> Añadir
                    </button>
                </div>
                
                ${TableComponent.render({
            id: 'users-table',
            columns: [
                {
                    label: 'Nombre', field: 'nombreCompleto', render: (v, item) => `
                            <div class="flex items-center gap-sm">
                                <div class="avatar avatar--sm avatar--initials" style="background:var(--color-primary);color:white;">${v.substring(0, 2).toUpperCase()}</div>
                                <div>
                                    <div class="font-semibold">${v}</div>
                                    <div class="text-body-sm text-muted">${item.email}</div>
                                </div>
                            </div>
                        ` },
                { label: 'Rol / Puesto', field: 'rol', render: v => `<span class="chip chip--${v === 'admin' ? 'primary' : 'outline'}">${roles[v] || v}</span>` },
                { label: 'Estado', field: 'activo', render: v => v ? '<span class="status-dot status-dot--online"></span> Activo' : '<span class="status-dot status-dot--offline"></span> Inactivo' },
                {
                    label: 'Acciones', field: 'id', render: (id, item) => `
                            <button class="btn--icon-sm" style="color:var(--color-on-surface-variant);" onclick="Toast.info('Solo lectura en esta demo')" title="Editar"><span class="material-symbols-outlined">edit</span></button>
                        ` }
            ],
            data: usuarios
        })}
            </div>

            <div class="glass-card p-lg">
                <h3 class="text-headline-sm mb-md">Matriz de Permisos (API)</h3>
                <p class="text-body-sm text-muted mb-md">La configuración de permisos está gestionada directamente por el patrón Strategy en el Backend (.NET).</p>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr><th>Módulo</th><th>Admin</th><th>Doctor</th><th>Asistente</th><th>Recepción</th><th>Almacén</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Pacientes</td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-error">&times;</span></td></tr>
                            <tr><td>Agenda</td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-error">&times;</span></td></tr>
                            <tr><td>Inventario</td><td><span class="text-success">&check;</span></td><td><span class="text-success">&check;</span> (Ver)</td><td><span class="text-error">&times;</span></td><td><span class="text-error">&times;</span></td><td><span class="text-success">&check;</span></td></tr>
                            <tr><td>Facturación</td><td><span class="text-success">&check;</span></td><td><span class="text-error">&times;</span></td><td><span class="text-error">&times;</span></td><td><span class="text-success">&check;</span></td><td><span class="text-error">&times;</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    _renderClinicaTab() {
        const info = this.getClinicaInfo();
        return `
            <div class="glass-card p-lg">
                <h3 class="text-headline-sm mb-md">Información de la Clínica</h3>
                <form class="grid grid-cols-2 gap-lg" onsubmit="window.Modules.Settings.saveClinicaInfo(event)">
                    <div class="input-group col-span-2">
                        <label class="input-label">Nombre Comercial</label>
                        <input type="text" name="nombre" class="input-field" value="${info.nombre || ''}" required>
                    </div>
                    <div class="input-group">
                        <label class="input-label">RUC</label>
                        <input type="text" name="ruc" class="input-field" value="${info.ruc || ''}" required>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Teléfono Principal</label>
                        <input type="text" name="telefono" class="input-field" value="${info.telefono || ''}" required>
                    </div>
                    <div class="input-group col-span-2">
                        <label class="input-label">Dirección</label>
                        <input type="text" name="direccion" class="input-field" value="${info.direccion || ''}" required>
                    </div>
                    <div class="col-span-2 mt-md">
                        <h4 class="text-label-md text-muted mb-sm">Consultorios Configurados</h4>
                        <div class="flex gap-sm">
                            ${info.consultorios.map(c => `<span class="chip chip--primary">${c}</span>`).join('')}
                            <button type="button" class="chip chip--outline" onclick="window.Modules.Settings.addConsultorio()">+ Añadir Consultorio</button>
                        </div>
                    </div>
                    <div class="col-span-2 mt-lg flex justify-end">
                        <button type="submit" class="btn btn--primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;
    },

    _renderSistemaTab() {
        return `
            <div class="glass-card p-lg">
                <h3 class="text-headline-sm mb-md">Preferencias Regionales</h3>
                <div class="grid grid-cols-2 gap-lg mb-xl">
                    <div class="input-group">
                        <label class="input-label">Moneda por defecto</label>
                        <select class="select-field"><option value="PEN" selected>Soles (S/)</option></select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Zona Horaria</label>
                        <select class="select-field"><option value="America/Lima" selected>America/Lima (GMT-5)</option></select>
                    </div>
                </div>
                <div class="divider mb-lg"></div>
                <h3 class="text-headline-sm mb-md text-warning">Modo API Activo</h3>
                <div class="flex items-center justify-between p-md" style="border:1px solid var(--color-warning);border-radius:var(--radius-md);">
                    <div>
                        <h4 class="font-semibold text-warning">Restablecimiento Desactivado</h4>
                        <p class="text-body-sm text-muted">El sistema ahora es 100% dependiente de la base de datos MySQL (Backend), la semilla de datos local ya no está disponible.</p>
                    </div>
                </div>
            </div>
        `;
    },

    getClinicaInfo() {
        const info = localStorage.getItem('odontoplus_clinica_info');
        if (info) return JSON.parse(info);
        const defaultInfo = {
            nombre: 'Centro Odontológico OdontoPlus', ruc: '20123456789', telefono: '(01) 444-5555',
            direccion: 'Av. Javier Prado Este 1234, Lima', consultorios: ['Consultorio 1']
        };
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(defaultInfo));
        return defaultInfo;
    },

    saveClinicaInfo(event) {
        event.preventDefault();
        const form = event.target;
        const info = this.getClinicaInfo();
        const newInfo = {
            nombre: form.querySelector('[name="nombre"]').value, ruc: form.querySelector('[name="ruc"]').value,
            telefono: form.querySelector('[name="telefono"]').value, direccion: form.querySelector('[name="direccion"]').value,
            consultorios: info.consultorios
        };
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(newInfo));
        Toast.success('Información actualizada');
        this.switchTab('clinica');
    },

    addConsultorio() {
        const info = this.getClinicaInfo();
        const nuevo = info.consultorios.length + 1;
        info.consultorios.push(`Consultorio ${nuevo}`);
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(info));
        Toast.success(`Consultorio ${nuevo} añadido`);
        this.switchTab('clinica');
    }
};
