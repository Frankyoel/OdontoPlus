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
                            <button class="tab active" onclick="window.Modules.Settings.switchTab('usuarios')">Usuarios y Roles</button>
                            <button class="tab" onclick="window.Modules.Settings.switchTab('clinica')">Datos de Clínica</button>
                            <button class="tab" onclick="window.Modules.Settings.switchTab('sistema')">Preferencias</button>
                        </div>

                        <div id="settings-content">
                            ${this._renderUsuariosTab(usuarios)}
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    switchTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
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
                    <button class="btn btn--primary btn--sm" onclick="Toast.info('Añadir usuario en desarrollo')">
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
                        { label: 'Acciones', field: 'id', render: () => `
                            <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" title="Editar"><span class="material-symbols-outlined">edit</span></button>
                            <button class="btn--icon-sm" style="color: var(--color-error);" title="Desactivar"><span class="material-symbols-outlined">block</span></button>
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
        return `
            <div class="glass-card p-lg">
                <h3 class="text-headline-sm mb-md">Información de la Clínica</h3>
                
                <form class="grid grid-cols-2 gap-lg" onsubmit="event.preventDefault(); Toast.success('Datos actualizados')">
                    <div class="input-group col-span-2">
                        <label class="input-label">Nombre Comercial</label>
                        <input type="text" class="input-field" value="Centro Odontológico OdontoPlus">
                    </div>
                    <div class="input-group">
                        <label class="input-label">RUC</label>
                        <input type="text" class="input-field" value="20123456789">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Teléfono Principal</label>
                        <input type="text" class="input-field" value="(01) 444-5555">
                    </div>
                    <div class="input-group col-span-2">
                        <label class="input-label">Dirección</label>
                        <input type="text" class="input-field" value="Av. Javier Prado Este 1234, San Isidro, Lima">
                    </div>
                    
                    <div class="col-span-2 mt-md">
                        <h4 class="text-label-md text-muted mb-sm">Consultorios Configurados</h4>
                        <div class="flex gap-sm">
                            <span class="chip chip--primary">Consultorio 1</span>
                            <button type="button" class="chip chip--outline" onclick="Toast.info('Añadir consultorio')">+ Añadir Consultorio</button>
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
