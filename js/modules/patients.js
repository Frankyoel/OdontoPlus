/* ============================================================
   OdontoPlus — Módulo Pacientes (patients.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Patients = {
    render() {
        const container = document.getElementById('app-content');
        const pacientes = DataService.getPacientes();
        const canCreate = Permissions.canCreate('pacientes');

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Pacientes', 'Directorio clínico')}
                    <div class="page-content">
                        
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Directorio de Pacientes</h1>
                                <p class="text-body-md text-muted">Gestión de perfiles e historias clínicas</p>
                            </div>
                            <div class="page-header__actions">
                                <div class="input-field--search" style="display: flex; align-items: center; background: white; padding: 8px 16px; border-radius: 20px; border: 1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right: 8px; color: var(--color-outline);">search</span>
                                    <input type="text" id="search-patient" placeholder="Buscar por DNI o nombre..." style="border: none; outline: none; background: transparent; width: 250px;" onkeyup="window.Modules.Patients.filterTable()">
                                </div>
                                ${canCreate ? `
                                <button class="btn btn--primary" onclick="window.Modules.Patients.showNewModal()">
                                    <span class="material-symbols-outlined">person_add</span>
                                    Nuevo Paciente
                                </button>
                                ` : ''}
                            </div>
                        </div>

                        <div class="glass-card p-lg">
                            ${TableComponent.render({
                                id: 'patients-table',
                                columns: [
                                    { label: 'Código', field: 'codigo' },
                                    { label: 'Paciente', field: 'nombreCompleto', render: (v, item) => `
                                        <div class="flex items-center gap-sm">
                                            <div class="avatar avatar--sm avatar--initials">${v.substring(0, 2).toUpperCase()}</div>
                                            <div>
                                                <div class="font-semibold">${v}</div>
                                                <div class="text-body-sm text-muted">DNI: ${item.dni}</div>
                                            </div>
                                        </div>
                                    ` },
                                    { label: 'Contacto', field: 'telefono', render: (v, item) => `
                                        <div>${v}</div>
                                        <div class="text-body-sm text-muted">${item.email || '-'}</div>
                                    ` },
                                    { label: 'Última Visita', field: 'ultimaVisita', render: v => v ? Models.formatDate(v) : '<span class="text-muted">Sin visitas</span>' },
                                    { label: 'Estado', field: 'activo', render: v => v ? '<span class="chip chip--success">Activo</span>' : '<span class="chip chip--outline">Inactivo</span>' },
                                    { label: 'Acciones', field: 'id', render: (id) => `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="window.Modules.Patients.viewDetail('${id}')" title="Ver Perfil">
                                            <span class="material-symbols-outlined">visibility</span>
                                        </button>
                                        ${Permissions.canEdit('pacientes') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" onclick="Toast.info('Función de edición en desarrollo')" title="Editar">
                                            <span class="material-symbols-outlined">edit</span>
                                        </button>
                                        ` : ''}
                                    ` }
                                ],
                                data: pacientes
                            })}
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    filterTable() {
        const query = document.getElementById('search-patient').value.toLowerCase();
        const rows = document.querySelectorAll('#patients-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    },

    showNewModal() {
        Modal.form({
            title: 'Nuevo Paciente',
            fields: [
                { name: 'dni', label: 'DNI', required: true },
                { name: 'nombre', label: 'Nombres', required: true },
                { name: 'apellido', label: 'Apellidos', required: true },
                { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true },
                { name: 'sexo', label: 'Sexo', type: 'select', options: [{value:'M', label:'Masculino'}, {value:'F', label:'Femenino'}], required: true },
                { name: 'telefono', label: 'Teléfono', required: true },
                { name: 'email', label: 'Correo Electrónico', type: 'email' },
                { name: 'direccion', label: 'Dirección' }
            ],
            onSubmit: (data) => {
                const paciente = DataService.createPaciente(data);
                Toast.success(`Paciente ${paciente.nombreCompleto} registrado con éxito`);
                this.render();
            }
        });
    },

    viewDetail(id) {
        const paciente = DataService.getPaciente(id);
        if (!paciente) return;
        
        const container = document.getElementById('app-content');
        const canEditHistorial = Permissions.canEdit('historial');
        
        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Perfil del Paciente')}
                    <div class="page-content">
                        
                        <div class="mb-lg">
                            <button class="btn btn--ghost" onclick="window.Modules.Patients.render()" style="padding-left: 0;">
                                <span class="material-symbols-outlined">arrow_back</span>
                                Volver al directorio
                            </button>
                        </div>

                        <div class="grid grid-cols-12 gap-lg">
                            <!-- Info Básica -->
                            <div class="col-span-4">
                                <div class="glass-card p-lg h-full">
                                    <div class="text-center mb-lg">
                                        <div class="avatar avatar--xl avatar--initials mb-md" style="margin: 0 auto; font-size: 24px;">
                                            ${paciente.nombre[0]}${paciente.apellido[0]}
                                        </div>
                                        <h2 class="text-headline-md">${paciente.nombreCompleto}</h2>
                                        <p class="text-body-sm text-muted">${paciente.codigo} • DNI ${paciente.dni}</p>
                                    </div>
                                    
                                    <div class="divider mb-md"></div>
                                    
                                    <div class="flex flex-col gap-sm">
                                        <div class="flex justify-between">
                                            <span class="text-muted text-body-sm">Edad</span>
                                            <span class="font-semibold">${paciente.edad} años</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted text-body-sm">Sexo</span>
                                            <span class="font-semibold">${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted text-body-sm">Teléfono</span>
                                            <span class="font-semibold">${paciente.telefono}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-muted text-body-sm">Tipo de Sangre</span>
                                            <span class="font-semibold text-error">${paciente.tipoSangre || 'No reg.'}</span>
                                        </div>
                                    </div>
                                    
                                    ${paciente.alergias ? `
                                        <div class="mt-md p-sm" style="background: var(--color-error-container); border-radius: var(--radius-sm);">
                                            <p class="text-label-md text-error mb-xs">ALERGIAS</p>
                                            <p class="text-body-sm text-error font-semibold">${paciente.alergias}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Historial Clínico -->
                            <div class="col-span-8">
                                <div class="glass-card h-full flex-col">
                                    <div class="tabs">
                                        <button class="tab active" onclick="Toast.info('Pestaña activa')">Evolución Médica</button>
                                        <button class="tab" onclick="Toast.info('Odontograma en desarrollo')">Odontograma</button>
                                        <button class="tab" onclick="Toast.info('Recetas médicas')">Recetas</button>
                                    </div>
                                    
                                    <div class="p-lg flex-1 overflow-y-auto">
                                        <div class="flex justify-between items-center mb-lg">
                                            <h3 class="text-headline-sm">Historial de Tratamientos</h3>
                                            ${canEditHistorial ? `
                                            <button class="btn btn--secondary btn--sm" onclick="Toast.info('Nuevo registro en desarrollo')">
                                                <span class="material-symbols-outlined" style="font-size: 16px;">add</span> Agregar Registro
                                            </button>
                                            ` : ''}
                                        </div>
                                        
                                        <div class="timeline">
                                            ${paciente.historial.length > 0 ? paciente.historial.map(h => `
                                                <div class="timeline-item">
                                                    <div class="timeline-item__dot"></div>
                                                    <div class="mb-xs">
                                                        <span class="text-label-md text-primary">${Models.formatDate(h.fecha)}</span>
                                                        <span class="text-muted text-body-sm ml-sm">• Dr(a). ${h.odontologoNombre}</span>
                                                    </div>
                                                    <h4 class="text-headline-sm mb-xs">${h.descripcion}</h4>
                                                    ${h.diagnostico ? `<p class="text-body-sm mb-xs"><b>Dx:</b> ${h.diagnostico}</p>` : ''}
                                                    <p class="text-body-sm mb-sm">${h.tratamiento}</p>
                                                </div>
                                            `).join('') : '<p class="text-body-sm text-muted">No hay registros en el historial clínico.</p>'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }
};
