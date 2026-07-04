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
                                    { label: 'Paciente', field: 'nombreCompleto', render: (v, item) => {
                                        const nombreComp = v || item.nombreCompleto || `${item.nombre || ''} ${item.apellido || ''}`.trim() || 'Paciente';
                                        const initials = ((item.nombre || '')[0] || '' + (item.apellido || '')[0] || '').toUpperCase() || 'PA';
                                        return `
                                        <div class="flex items-center gap-sm">
                                            <div class="avatar avatar--sm avatar--initials">${initials}</div>
                                            <div>
                                                <div class="font-semibold">${nombreComp}</div>
                                                <div class="text-body-sm text-muted">DNI: ${item.dni || 'S/D'}</div>
                                            </div>
                                        </div>
                                        `;
                                    } },
                                    { label: 'Contacto', field: 'telefono', render: (v, item) => `
                                        <div>${v || '-'}</div>
                                        <div class="text-body-sm text-muted">${item.email || '-'}</div>
                                    ` },
                                    { label: 'Última Visita', field: 'ultimaVisita', render: v => v ? Models.formatDate(v) : '<span class="text-muted">Sin visitas</span>' },
                                    { label: 'Estado', field: 'activo', render: v => v ? '<span class="chip chip--success">Activo</span>' : '<span class="chip chip--outline">Inactivo</span>' },
                                    { label: 'Acciones', field: 'id', render: (id, item) => `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="window.Modules.Patients.viewDetail('${id}')" title="Ver Perfil">
                                            <span class="material-symbols-outlined">visibility</span>
                                        </button>
                                        ${Permissions.canEdit('pacientes') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" onclick="window.Modules.Patients.showEditModal('${id}')" title="Editar">
                                            <span class="material-symbols-outlined">edit</span>
                                        </button>
                                        <button class="btn--icon-sm" style="color: ${item.activo ? 'var(--color-error)' : 'var(--color-success)'};" onclick="window.Modules.Patients.toggleActive('${id}')" title="${item.activo ? 'Desactivar' : 'Activar'}">
                                            <span class="material-symbols-outlined">${item.activo ? 'block' : 'check_circle'}</span>
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
                { name: 'direccion', label: 'Dirección' },
                { name: 'tipoSangre', label: 'Tipo de Sangre' },
                { name: 'alergias', label: 'Alergias' },
                { name: 'observaciones', label: 'Observaciones', type: 'textarea' }
            ],
            onSubmit: (data) => {
                const paciente = DataService.createPaciente(data);
                Toast.success(`Paciente ${paciente.nombreCompleto} registrado con éxito`);
                this.render();
            }
        });
    },

    showEditModal(id) {
        const paciente = DataService.getPaciente(id);
        if (!paciente) return;

        Modal.form({
            title: 'Editar Paciente',
            fields: [
                { name: 'dni', label: 'DNI', value: paciente.dni, required: true, readOnly: true },
                { name: 'nombre', label: 'Nombres', value: paciente.nombre, required: true },
                { name: 'apellido', label: 'Apellidos', value: paciente.apellido, required: true },
                { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', value: paciente.fechaNacimiento, required: true },
                { name: 'sexo', label: 'Sexo', type: 'select', options: [{value:'M', label:'Masculino'}, {value:'F', label:'Femenino'}], value: paciente.sexo, required: true },
                { name: 'telefono', label: 'Teléfono', value: paciente.telefono, required: true },
                { name: 'email', label: 'Correo Electrónico', type: 'email', value: paciente.email },
                { name: 'direccion', label: 'Dirección', value: paciente.direccion },
                { name: 'tipoSangre', label: 'Tipo de Sangre', value: paciente.tipoSangre },
                { name: 'alergias', label: 'Alergias', value: paciente.alergias },
                { name: 'observaciones', label: 'Observaciones', type: 'textarea', value: paciente.observaciones }
            ],
            onSubmit: (data) => {
                // Calcular edad de nuevo en caso de haber cambiado fechaNacimiento
                const edad = Models.calcularEdad(data.fechaNacimiento);
                const updates = {
                    ...data,
                    edad,
                    nombreCompleto: `${data.nombre} ${data.apellido}`
                };
                DataService.updatePaciente(id, updates);
                Toast.success(`Paciente ${updates.nombreCompleto} actualizado con éxito`);
                this.render();
            }
        });
    },

    toggleActive(id) {
        const paciente = DataService.getPaciente(id);
        if (!paciente) return;

        const nuevoEstado = !paciente.activo;
        const accionStr = nuevoEstado ? 'Activar' : 'Desactivar';
        
        Modal.confirm({
            title: `${accionStr} Paciente`,
            message: `¿Estás seguro de que deseas ${accionStr.toLowerCase()} al paciente ${paciente.nombreCompleto}?`,
            confirmText: `Sí, ${accionStr.toLowerCase()}`,
            variant: nuevoEstado ? 'primary' : 'danger',
            onConfirm: () => {
                DataService.updatePaciente(id, { activo: nuevoEstado });
                Toast.success(`Paciente ${paciente.nombreCompleto} ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`);
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
                                            ${(paciente.nombre || 'P')[0]}${(paciente.apellido || 'A')[0]}
                                        </div>
                                        <h2 class="text-headline-md">${paciente.nombreCompleto || ''}</h2>
                                        <p class="text-body-sm text-muted">${paciente.codigo || ''} • DNI ${paciente.dni || ''}</p>
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
                            
                            <!-- Historial Clínico con Tabs Dinámicos -->
                            <div class="col-span-8">
                                <div class="glass-card h-full flex-col" style="min-height: 500px;">
                                    <div class="tabs">
                                        <button class="tab active" onclick="window.Modules.Patients.switchDetailTab('evolucion', '${paciente.id}', this)">Evolución Médica</button>
                                        <button class="tab" onclick="window.Modules.Patients.switchDetailTab('odontograma', '${paciente.id}', this)">Odontograma</button>
                                        <button class="tab" onclick="window.Modules.Patients.switchDetailTab('recetas', '${paciente.id}', this)">Recetas</button>
                                    </div>
                                    
                                    <div class="p-lg flex-1 overflow-y-auto" id="detail-tabs-content">
                                        <!-- Contenido dinámico inyectado por switchDetailTab -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        // Cargar por defecto la pestaña de evolución médica
        setTimeout(() => {
            const firstTab = document.querySelector('.tab');
            if (firstTab) this.switchDetailTab('evolucion', paciente.id, firstTab);
        }, 50);
    },

    switchDetailTab(tab, pacienteId, clickedBtn) {
        if (clickedBtn) {
            clickedBtn.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            clickedBtn.classList.add('active');
        }

        const content = document.getElementById('detail-tabs-content');
        if (!content) return;

        const paciente = DataService.getPaciente(pacienteId);
        if (!paciente) return;

        if (tab === 'evolucion') {
            const canEditHistorial = Permissions.canEdit('historial');
            content.innerHTML = `
                <div class="flex justify-between items-center mb-lg">
                    <h3 class="text-headline-sm">Historial de Tratamientos</h3>
                    ${canEditHistorial ? `
                    <button class="btn btn--secondary btn--sm" onclick="window.Modules.Patients.showAddHistorialModal('${pacienteId}')">
                        <span class="material-symbols-outlined" style="font-size: 16px;">add</span> Agregar Registro
                    </button>
                    ` : ''}
                </div>
                
                <div class="timeline">
                    ${paciente.historial && paciente.historial.length > 0 ? paciente.historial.map(h => `
                        <div class="timeline-item">
                            <div class="timeline-item__dot"></div>
                            <div class="mb-xs">
                                <span class="text-label-md text-primary">${Models.formatDate(h.fecha)}</span>
                                <span class="text-muted text-body-sm ml-sm">• Dr(a). ${h.odontologoNombre}</span>
                            </div>
                            <h4 class="text-headline-sm mb-xs">${h.descripcion}</h4>
                            ${h.diagnostico ? `<p class="text-body-sm mb-xs"><b>Dx:</b> ${h.diagnostico}</p>` : ''}
                            <p class="text-body-sm mb-sm">${h.tratamiento}</p>
                            ${h.notas ? `<p class="text-body-sm text-muted"><i>Nota: ${h.notes || h.notas}</i></p>` : ''}
                        </div>
                    `).join('') : '<p class="text-body-sm text-muted">No hay registros en el historial clínico.</p>'}
                </div>
            `;
        } else if (tab === 'odontograma') {
            // Inicializar tratamientos / odontograma si no existe
            if (!paciente.odontograma) {
                paciente.odontograma = {};
                // Por defecto, dientes del 11 al 18, 21 al 28, 31 al 38, 41 al 48
                const dientes = [
                    18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28,
                    48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38
                ];
                dientes.forEach(d => {
                    paciente.odontograma[d] = { estado: 'sano', notas: '' };
                });
                DataService.updatePaciente(pacienteId, { odontograma: paciente.odontograma });
            }

            const renderDiente = (num) => {
                const d = paciente.odontograma[num] || { estado: 'sano', notas: '' };
                const colors = {
                    sano: 'var(--color-success)',
                    caries: 'var(--color-error)',
                    ausente: 'var(--color-outline)',
                    corona: 'var(--color-primary)',
                    tratado: 'var(--color-tertiary)'
                };
                const color = colors[d.estado] || 'gray';
                return `
                    <div class="flex-col items-center gap-xs p-xs text-center cursor-pointer" 
                         style="border: 1px solid var(--color-outline-variant); border-radius: var(--radius-sm); min-width: 50px; background: var(--color-surface-container-lowest);"
                         onclick="window.Modules.Patients.showToothModal('${pacienteId}', ${num})">
                        <span class="text-label-md font-semibold">${num}</span>
                        <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2px solid white; box-shadow: var(--shadow-sm); margin: 0 auto;"></div>
                        <span class="text-body-sm capitalize" style="font-size: 9px; color: ${color}; font-weight: bold;">${d.estado}</span>
                    </div>
                `;
            };

            const supDientes = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
            const infDientes = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];

            content.innerHTML = `
                <div class="mb-md">
                    <h3 class="text-headline-sm">Odontograma Interactivo</h3>
                    <p class="text-body-sm text-muted">Selecciona un diente para registrar diagnóstico, caries, ausencias o tratamientos.</p>
                </div>
                
                <div class="flex-col gap-lg overflow-x-auto pb-md">
                    <div class="flex-col gap-sm">
                        <span class="text-label-md text-muted">Arcada Superior (Maxilar)</span>
                        <div class="flex gap-xs" style="min-width: 800px;">
                            ${supDientes.map(num => renderDiente(num)).join('')}
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="flex-col gap-sm">
                        <span class="text-label-md text-muted">Arcada Inferior (Mandibular)</span>
                        <div class="flex gap-xs" style="min-width: 800px;">
                            ${infDientes.map(num => renderDiente(num)).join('')}
                        </div>
                    </div>
                </div>

                <div class="flex gap-md items-center mt-lg p-sm glass-card--flat" style="flex-wrap: wrap;">
                    <span class="text-label-md text-muted">LEYENDA:</span>
                    <span class="flex items-center gap-xs text-body-sm"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-success);"></span> Sano</span>
                    <span class="flex items-center gap-xs text-body-sm"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-error);"></span> Caries</span>
                    <span class="flex items-center gap-xs text-body-sm"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-outline);"></span> Ausente</span>
                    <span class="flex items-center gap-xs text-body-sm"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-primary);"></span> Corona</span>
                    <span class="flex items-center gap-xs text-body-sm"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--color-tertiary);"></span> Tratado</span>
                </div>
            `;
        } else if (tab === 'recetas') {
            const recetas = DataService.getRecetasPaciente(pacienteId);
            const canCreateRecetas = Permissions.canCreate('recetas');

            content.innerHTML = `
                <div class="flex justify-between items-center mb-lg">
                    <h3 class="text-headline-sm">Recetas Médicas</h3>
                    ${canCreateRecetas ? `
                    <button class="btn btn--secondary btn--sm" onclick="window.Modules.Patients.showNewPrescriptionModal('${pacienteId}')">
                        <span class="material-symbols-outlined" style="font-size: 16px;">receipt</span> Emitir Receta
                    </button>
                    ` : ''}
                </div>

                <div class="flex-col gap-md">
                    ${recetas && recetas.length > 0 ? recetas.map(r => `
                        <div class="glass-card p-md">
                            <div class="flex justify-between items-start mb-sm">
                                <div>
                                    <span class="font-mono text-primary font-semibold">${r.codigo}</span>
                                    <span class="text-muted text-body-sm ml-sm">• Emitido el ${Models.formatDate(r.fecha)}</span>
                                </div>
                                <span class="chip chip--success">Firmada</span>
                            </div>
                            <div class="text-body-sm mb-xs"><b>Dr(a):</b> ${r.odontologoNombre}</div>
                            <div class="divider mb-xs"></div>
                            <div class="text-body-sm mb-xs"><b>Medicamentos:</b></div>
                            <ul class="text-body-sm flex-col gap-xs mb-sm ml-md" style="list-style-type: disc;">
                                ${r.medicamentos.map(m => `
                                    <li><b>${m.nombre}</b> - ${m.dosis} c/ ${m.frecuencia} por ${m.duracion} (${m.instrucciones || 'Sin instrucciones adicionales'})</li>
                                `).join('')}
                            </ul>
                            ${r.indicaciones ? `<div class="text-body-sm text-muted"><b>Indicaciones:</b> ${r.indicaciones}</div>` : ''}
                        </div>
                    `).join('') : '<p class="text-body-sm text-muted">No se han emitido recetas para este paciente.</p>'}
                </div>
            `;
        }
    },

    showAddHistorialModal(pacienteId) {
        const paciente = DataService.getPaciente(pacienteId);
        if (!paciente) return;

        const user = Auth.getSession();

        Modal.form({
            title: 'Agregar Registro Clínico',
            fields: [
                { name: 'odontologoNombre', label: 'Odontólogo', value: user?.nombre || 'Dra. María Elena Torres', required: true, readOnly: true },
                { name: 'tipo', label: 'Tipo de Registro', type: 'select', options: [
                    { value: 'consulta', label: 'Consulta General' },
                    { value: 'tratamiento', label: 'Tratamiento Realizado' },
                    { value: 'control', label: 'Control / Seguimiento' },
                    { value: 'emergencia', label: 'Atención de Emergencia' }
                ], required: true },
                { name: 'descripcion', label: 'Motivo de Consulta / Descripción', required: true },
                { name: 'diagnostico', label: 'Diagnóstico (Dx)' },
                { name: 'tratamiento', label: 'Tratamiento Indicado / Ejecutado', required: true },
                { name: 'notas', label: 'Notas Médicas Adicionales', type: 'textarea' }
            ],
            onSubmit: (data) => {
                const entry = Models.createHistorialEntry({
                    pacienteId,
                    odontologoNombre: data.odontologoNombre,
                    tipo: data.tipo,
                    descripcion: data.descripcion,
                    diagnostico: data.diagnostico,
                    tratamiento: data.tratamiento,
                    notas: data.notas
                });
                
                paciente.historial = paciente.historial || [];
                paciente.historial.unshift(entry); // Agregar al principio (más reciente primero)
                
                // Actualizar fecha de última visita
                DataService.updatePaciente(pacienteId, { 
                    historial: paciente.historial,
                    ultimaVisita: new Date().toISOString()
                });

                Toast.success('Registro clínico agregado correctamente');
                this.switchDetailTab('evolucion', pacienteId);
            }
        });
    },

    showToothModal(pacienteId, toothNum) {
        const paciente = DataService.getPaciente(pacienteId);
        if (!paciente) return;

        const tooth = (paciente.odontograma && paciente.odontograma[toothNum]) || { estado: 'sano', notas: '' };

        Modal.form({
            title: `Diagnóstico Diente ${toothNum}`,
            fields: [
                { name: 'estado', label: 'Estado del Diente', type: 'select', options: [
                    { value: 'sano', label: 'Sano' },
                    { value: 'caries', label: 'Caries Detectada' },
                    { value: 'ausente', label: 'Ausente (Extracción/Pérdida)' },
                    { value: 'corona', label: 'Corona / Prótesis Fija' },
                    { value: 'tratado', label: 'Tratado / Restaurado con Resina' }
                ], value: tooth.estado, required: true },
                { name: 'notas', label: 'Notas / Observaciones del Diente', type: 'textarea', value: tooth.notas }
            ],
            onSubmit: (data) => {
                paciente.odontograma = paciente.odontograma || {};
                paciente.odontograma[toothNum] = {
                    estado: data.estado,
                    notas: data.notas
                };

                // Si se detectó caries o se trató, opcionalmente agregamos al historial
                DataService.updatePaciente(pacienteId, { odontograma: paciente.odontograma });
                Toast.success(`Diente ${toothNum} actualizado a ${data.estado}`);
                this.switchDetailTab('odontograma', pacienteId);
            }
        });
    },

    showNewPrescriptionModal(pacienteId) {
        const paciente = DataService.getPaciente(pacienteId);
        if (!paciente) return;

        const user = Auth.getSession();

        Modal.form({
            title: 'Emitir Receta Médica',
            fields: [
                { name: 'medicamento', label: 'Medicamento (Ej. Amoxicilina 500mg)', required: true },
                { name: 'dosis', label: 'Dosis (Ej. 1 cápsula)', required: true },
                { name: 'frecuencia', label: 'Frecuencia (Ej. Cada 8 horas)', required: true },
                { name: 'duracion', label: 'Duración (Ej. 7 días)', required: true },
                { name: 'instrucciones', label: 'Instrucciones adicionales (Ej. Tomar con alimentos)' },
                { name: 'indicaciones', label: 'Indicaciones Generales de la Receta', type: 'textarea' }
            ],
            onSubmit: (data) => {
                const receta = DataService.createReceta({
                    pacienteId,
                    pacienteNombre: paciente.nombreCompleto,
                    odontologoId: user?.userId || 'usr_odont_01',
                    odontologoNombre: user?.nombre || 'Dra. María Elena Torres',
                    medicamentos: [
                        {
                            nombre: data.medicamento,
                            dosis: data.dosis,
                            frecuencia: data.frecuencia,
                            duracion: data.duracion,
                            instrucciones: data.instrucciones
                        }
                    ],
                    indicaciones: data.indicaciones
                });

                Toast.success(`Receta ${receta.codigo} emitida correctamente`);
                this.switchDetailTab('recetas', pacienteId);
            }
        });
    }
};
