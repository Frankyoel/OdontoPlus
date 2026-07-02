/* ============================================================
   OdontoPlus — Módulo Configuración (settings.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Settings = {
    render() {
        const container = document.getElementById('app-content');
        const usuarios = DataService.getUsuarios();

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
                            ${this._renderUsuariosTab(usuarios)}
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    switchTab(tab, clickedBtn) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if (clickedBtn) clickedBtn.classList.add('active');
        
        const content = document.getElementById('settings-content');
        if (tab === 'usuarios') {
            content.innerHTML = this._renderUsuariosTab(DataService.getUsuarios());
        } else if (tab === 'clinica') {
            content.innerHTML = this._renderClinicaTab();
        } else {
            content.innerHTML = this._renderSistemaTab();
        }
    },

    _renderUsuariosTab(usuarios) {
        return `
             <div class="glass-card p-lg mb-lg">
                <div class="flex justify-between items-center mb-md">
                    <h3 class="text-headline-sm">Personal Registrado</h3>
                    <button class="btn btn--primary btn--sm" onclick="window.Modules.Settings.showAddUserModal()">
                        <span class="material-symbols-outlined" style="font-size: 16px;">person_add</span> Añadir
                    </button>
                </div>
                
                ${TableComponent.render({
                    id: 'users-table',
                    columns: [
                        { label: 'Nombre', field: 'nombreCompleto', render: (v, item) => `
                            <div class="flex items-center gap-sm">
                                <div class="avatar avatar--sm avatar--initials">${item.nombre[0]}${item.apellido[0]}</div>
                                <div>
                                    <div class="font-semibold">${v}</div>
                                    <div class="text-body-sm text-muted">${item.email}</div>
                                </div>
                            </div>
                        ` },
                        { label: 'Rol / Puesto', field: 'rol', render: v => `
                            <span class="chip chip--${v === 'administrador' ? 'primary' : 'outline'}">${Models.ROLES[v] || v}</span>
                        ` },
                        { label: 'Especialidad', field: 'especialidad', render: v => v || '-' },
                        { label: 'Estado', field: 'activo', render: v => v ? '<span class="status-dot status-dot--online"></span> Activo' : '<span class="status-dot status-dot--offline"></span> Inactivo' },
                        { label: 'Acciones', field: 'id', render: (id, item) => `
                            <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" onclick="window.Modules.Settings.showEditUserModal('${id}')" title="Editar"><span class="material-symbols-outlined">edit</span></button>
                            <button class="btn--icon-sm" style="color: ${item.activo ? 'var(--color-error)' : 'var(--color-success)'};" onclick="window.Modules.Settings.toggleUserActive('${id}')" title="${item.activo ? 'Desactivar' : 'Activar'}">
                                <span class="material-symbols-outlined">${item.activo ? 'block' : 'check_circle'}</span>
                            </button>
                        ` }
                    ],
                    data: usuarios
                })}
            </div>

            <div class="glass-card p-lg">
                <h3 class="text-headline-sm mb-md">Matriz de Permisos</h3>
                <p class="text-body-sm text-muted mb-md">La configuración de permisos por defecto de OdontoPlus (solo lectura en esta vista).</p>
                
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Módulo</th>
                                <th>Admin</th>
                                <th>Odontólogo</th>
                                <th>Asistente</th>
                                <th>Recepción</th>
                                <th>Almacén</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pacientes</td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                            </tr>
                            <tr>
                                <td>Historias Clínicas</td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span> (Editar)</td>
                                <td><span class="material-symbols-outlined text-success">check</span> (Ver)</td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                            </tr>
                            <tr>
                                <td>Inventario</td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span> (Ver)</td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                            </tr>
                            <tr>
                                <td>Facturación</td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                                <td><span class="material-symbols-outlined text-success">check</span></td>
                                <td><span class="material-symbols-outlined text-error">close</span></td>
                            </tr>
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
                        <select class="select-field">
                            <option value="PEN" selected>Soles (S/)</option>
                            <option value="USD">Dólares ($)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Zona Horaria</label>
                        <select class="select-field">
                            <option value="America/Lima" selected>America/Lima (GMT-5)</option>
                        </select>
                    </div>
                </div>

                <div class="divider mb-lg"></div>

                <h3 class="text-headline-sm mb-md text-error">Zona de Peligro</h3>
                <div class="flex items-center justify-between p-md" style="border: 1px solid var(--color-error-container); border-radius: var(--radius-md);">
                    <div>
                        <h4 class="font-semibold text-error">Restablecer Datos de Demostración</h4>
                        <p class="text-body-sm text-muted">Esto borrará todos los cambios actuales y recargará los datos semilla.</p>
                    </div>
                    <button class="btn btn--danger" onclick="window.Modules.Settings.resetData()">Restablecer Datos</button>
                </div>
            </div>
        `;
    },

    showAddUserModal() {
        Modal.form({
            title: 'Añadir Usuario / Personal',
            fields: [
                { name: 'nombre', label: 'Nombre', required: true },
                { name: 'apellido', label: 'Apellido', required: true },
                { name: 'email', label: 'Correo Electrónico', type: 'email', required: true },
                { name: 'rol', label: 'Rol / Puesto', type: 'select', options: Object.keys(Models.ROLES).map(k => ({ value: k, label: Models.ROLES[k] })), required: true },
                { name: 'telefono', label: 'Teléfono' },
                { name: 'especialidad', label: 'Especialidad (Si es odontólogo)' },
                { name: 'consultorio', label: 'Consultorio Asignado' }
            ],
            onSubmit: (data) => {
                const user = Models.createUser(data);
                // La contraseña por defecto será 'odontoplus123'
                DataService.create('usuarios', user);
                Toast.success(`Usuario ${user.nombreCompleto} creado correctamente`);
                this.render();
            }
        });
    },

    showEditUserModal(id) {
        const user = DataService.getUsuario(id);
        if (!user) return;

        Modal.form({
            title: 'Editar Usuario',
            fields: [
                { name: 'codigo', label: 'Código', value: user.codigo, required: true, readOnly: true },
                { name: 'nombre', label: 'Nombre', value: user.nombre, required: true },
                { name: 'apellido', label: 'Apellido', value: user.apellido, required: true },
                { name: 'email', label: 'Correo Electrónico', type: 'email', value: user.email, required: true },
                { name: 'rol', label: 'Rol / Puesto', type: 'select', options: Object.keys(Models.ROLES).map(k => ({ value: k, label: Models.ROLES[k] })), value: user.rol, required: true },
                { name: 'telefono', label: 'Teléfono', value: user.telefono },
                { name: 'especialidad', label: 'Especialidad', value: user.especialidad },
                { name: 'consultorio', label: 'Consultorio Asignado', value: user.consultorio }
            ],
            onSubmit: (data) => {
                const updates = {
                    ...data,
                    nombreCompleto: `${data.nombre} ${data.apellido}`
                };
                DataService.update('usuarios', id, updates);
                Toast.success(`Usuario ${updates.nombreCompleto} actualizado`);
                this.render();
            }
        });
    },

    toggleUserActive(id) {
        const user = DataService.getUsuario(id);
        if (!user) return;

        // Evitar que el administrador se desactive a sí mismo
        const session = Auth.getSession();
        if (session && session.userId === id) {
            Toast.error('No puedes desactivar tu propia cuenta activa');
            return;
        }

        const nuevoEstado = !user.activo;
        const accionStr = nuevoEstado ? 'Activar' : 'Desactivar';

        Modal.confirm({
            title: `${accionStr} Usuario`,
            message: `¿Estás seguro de que deseas ${accionStr.toLowerCase()} la cuenta de ${user.nombreCompleto}?`,
            confirmText: `Sí, ${accionStr.toLowerCase()}`,
            variant: nuevoEstado ? 'primary' : 'danger',
            onConfirm: () => {
                DataService.update('usuarios', id, { activo: nuevoEstado });
                Toast.success(`Usuario ${user.nombreCompleto} ${nuevoEstado ? 'activado' : 'desactivado'}`);
                this.render();
            }
        });
    },

    getClinicaInfo() {
        const info = localStorage.getItem('odontoplus_clinica_info');
        if (info) return JSON.parse(info);
        const defaultInfo = {
            nombre: 'Centro Odontológico OdontoPlus',
            ruc: '20123456789',
            telefono: '(01) 444-5555',
            direccion: 'Av. Javier Prado Este 1234, San Isidro, Lima',
            consultorios: ['Consultorio 1']
        };
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(defaultInfo));
        return defaultInfo;
    },

    saveClinicaInfo(event) {
        event.preventDefault();
        const form = event.target;
        const info = this.getClinicaInfo();
        const newInfo = {
            nombre: form.querySelector('[name="nombre"]').value,
            ruc: form.querySelector('[name="ruc"]').value,
            telefono: form.querySelector('[name="telefono"]').value,
            direccion: form.querySelector('[name="direccion"]').value,
            consultorios: info.consultorios
        };
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(newInfo));
        Toast.success('Información de la clínica actualizada correctamente');
        this.switchTab('clinica');
    },

    addConsultorio() {
        const info = this.getClinicaInfo();
        const nuevoNumero = info.consultorios.length + 1;
        info.consultorios.push(`Consultorio ${nuevoNumero}`);
        localStorage.setItem('odontoplus_clinica_info', JSON.stringify(info));
        Toast.success(`Consultorio ${nuevoNumero} añadido con éxito`);
        this.switchTab('clinica');
    },

    resetData() {
        Modal.confirm({
            title: 'Restablecer Base de Datos',
            message: '¿Estás completamente seguro de que quieres restablecer los datos? Perderás todos los pacientes, citas y configuraciones agregadas recientemente.',
            confirmText: 'Sí, borrar y restablecer',
            variant: 'danger',
            onConfirm: () => {
                SeedData.reset();
                Toast.success('Datos restablecidos correctamente. Recargando...', 2000);
                setTimeout(() => window.location.reload(), 2000);
            }
        });
    }
};
