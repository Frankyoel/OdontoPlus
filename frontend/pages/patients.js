/* ============================================================
   OdontoPlus — Pacientes (patients.js)
   Usa PatientService para todas las operaciones (API real)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Patients = {

    _fmt: {
        date: (v) => v ? new Date(v).toLocaleDateString('es-PE') : '-'
    },

    async render() {
        const container = document.getElementById('app-content');
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
                                <div class="input-field--search" style="display:flex;align-items:center;background:white;padding:8px 16px;border-radius:20px;border:1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right:8px;color:var(--color-outline);">search</span>
                                    <input type="text" id="search-patient" placeholder="Buscar por DNI o nombre..." style="border:none;outline:none;background:transparent;width:250px;" onkeyup="window.Modules.Patients.filterTable()">
                                </div>
                                ${canCreate ? `<button class="btn btn--primary" onclick="window.Modules.Patients.showNewModal()">
                                    <span class="material-symbols-outlined">person_add</span> Nuevo Paciente
                                </button>` : ''}
                            </div>
                        </div>
                        <div class="glass-card p-lg" id="patients-table-wrapper">
                            <div class="flex items-center justify-center" style="height:200px;">
                                <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>`;

        try {
            const pacientes = await PatientService.getAll();
            const wrapper = document.getElementById('patients-table-wrapper');
            if (wrapper) wrapper.innerHTML = TableComponent.render({
                id: 'patients-table',
                columns: [
                    { label: 'Código', field: 'codigo' },
                    {
                        label: 'Paciente', field: 'nombre', render: (v, item) => {
                            const nombre = `${item.nombre || ''} ${item.apellido || ''}`.trim() || 'Paciente';
                            const initials = ((item.nombre || '')[0] || '').toUpperCase() + ((item.apellido || '')[0] || '').toUpperCase() || 'PA';
                            return `<div class="flex items-center gap-sm">
                            <div class="avatar avatar--sm avatar--initials">${initials}</div>
                            <div><div class="font-semibold">${nombre}</div>
                            <div class="text-body-sm text-muted">DNI: ${item.dni || 'S/D'}</div></div>
                        </div>`;
                        }
                    },
                    { label: 'Contacto', field: 'telefono', render: (v, item) => `<div>${v || '-'}</div><div class="text-body-sm text-muted">${item.email || '-'}</div>` },
                    { label: 'Última Visita', field: 'ultimaVisita', render: v => v ? this._fmt.date(v) : '<span class="text-muted">Sin visitas</span>' },
                    { label: 'Estado', field: 'activo', render: v => v ? '<span class="chip chip--success">Activo</span>' : '<span class="chip chip--outline">Inactivo</span>' },
                    {
                        label: 'Acciones', field: 'id', render: (id, item) => `
                        <button class="btn--icon-sm" style="color:var(--color-primary);" onclick="window.Modules.Patients.viewDetail('${id}')" title="Ver Perfil">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        ${Permissions.canEdit('pacientes') ? `
                        <button class="btn--icon-sm" style="color:var(--color-on-surface-variant);" onclick="window.Modules.Patients.showEditModal('${id}')" title="Editar">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn--icon-sm" style="color:${item.activo ? 'var(--color-error)' : 'var(--color-success)'};" onclick="window.Modules.Patients.toggleActive('${id}', ${!item.activo})" title="${item.activo ? 'Desactivar' : 'Activar'}">
                            <span class="material-symbols-outlined">${item.activo ? 'block' : 'check_circle'}</span>
                        </button>` : ''}
                    `}
                ],
                data: pacientes
            });
        } catch (_) { /* ApiClient ya manejó el error */ }
    },

    filterTable() {
        const query = document.getElementById('search-patient').value.toLowerCase();
        document.querySelectorAll('#patients-table tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
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
                { name: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], required: true },
                { name: 'telefono', label: 'Teléfono', required: true },
                { name: 'email', label: 'Correo Electrónico', type: 'email' },
                { name: 'direccion', label: 'Dirección' },
                { name: 'tipoSangre', label: 'Tipo de Sangre' },
                { name: 'alergias', label: 'Alergias' },
                { name: 'observaciones', label: 'Observaciones', type: 'textarea' }
            ],
            onSubmit: async (data) => {
                try {
                    await PatientService.create(data);
                    Toast.success('Paciente registrado con éxito');
                    this.render();
                } catch (_) { }
            }
        });
    },

    showEditModal(id) {
        PatientService.getById(id).then(p => {
            if (!p) return;
            Modal.form({
                title: 'Editar Paciente',
                fields: [
                    { name: 'dni', label: 'DNI', value: p.dni, required: true, readOnly: true },
                    { name: 'nombre', label: 'Nombres', value: p.nombre, required: true },
                    { name: 'apellido', label: 'Apellidos', value: p.apellido, required: true },
                    { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', value: p.fechaNacimiento?.split('T')[0], required: true },
                    { name: 'sexo', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }], value: p.sexo, required: true },
                    { name: 'telefono', label: 'Teléfono', value: p.telefono, required: true },
                    { name: 'email', label: 'Correo Electrónico', type: 'email', value: p.email },
                    { name: 'direccion', label: 'Dirección', value: p.direccion },
                    { name: 'tipoSangre', label: 'Tipo de Sangre', value: p.tipoSangre },
                    { name: 'alergias', label: 'Alergias', value: p.alergias },
                    { name: 'observaciones', label: 'Observaciones', type: 'textarea', value: p.observaciones }
                ],
                onSubmit: async (data) => {
                    try {
                        await PatientService.update(id, data);
                        Toast.success('Paciente actualizado con éxito');
                        this.render();
                    } catch (_) { }
                }
            });
        });
    },

    toggleActive(id, nuevoEstado) {
        Modal.confirm({
            title: nuevoEstado ? 'Activar Paciente' : 'Desactivar Paciente',
            message: `¿Confirmas ${nuevoEstado ? 'activar' : 'desactivar'} este paciente?`,
            confirmText: nuevoEstado ? 'Sí, activar' : 'Sí, desactivar',
            variant: nuevoEstado ? 'primary' : 'danger',
            onConfirm: async () => {
                try {
                    await PatientService.toggleActive(id, nuevoEstado);
                    Toast.success(`Paciente ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`);
                    this.render();
                } catch (_) { }
            }
        });
    },

    async viewDetail(id) {
        const container = document.getElementById('app-content');
        let paciente;
        try { paciente = await PatientService.getById(id); } catch (_) { return; }
        if (!paciente) return;

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Perfil del Paciente')}
                    <div class="page-content">
                        <div class="mb-lg">
                            <button class="btn btn--ghost" onclick="window.Modules.Patients.render()" style="padding-left:0;">
                                <span class="material-symbols-outlined">arrow_back</span> Volver al directorio
                            </button>
                        </div>
                        <div class="grid grid-cols-12 gap-lg">
                            <div class="col-span-4"><div class="glass-card p-lg h-full">
                                <div class="text-center mb-lg">
                                    <div class="avatar avatar--xl avatar--initials mb-md" style="margin:0 auto;font-size:24px;">
                                        ${((paciente.nombre || 'P')[0] + (paciente.apellido || 'A')[0]).toUpperCase()}
                                    </div >
                                    <h2 class="text-headline-md">${paciente.nombre} ${paciente.apellido}</h2>
                                    <p class="text-body-sm text-muted">${paciente.codigo || ''} • DNI ${paciente.dni || ''}</p>
                                </div >
                                <div class="divider mb-md"></div>
                                <div class="flex flex-col gap-sm">
                                    <div class="flex justify-between"><span class="text-muted text-body-sm">Teléfono</span><span class="font-semibold">${paciente.telefono || '-'}</span></div>
                                    <div class="flex justify-between"><span class="text-muted text-body-sm">Sexo</span><span class="font-semibold">${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</span></div>
                                    <div class="flex justify-between"><span class="text-muted text-body-sm">Tipo de Sangre</span><span class="font-semibold text-error">${paciente.tipoSangre || 'No reg.'}</span></div>
                                </div>
                                ${paciente.alergias ? `<div class="mt-md p-sm" style="background:var(--color-error-container);border-radius:var(--radius-sm);">
                                    <p class="text-label-md text-error mb-xs">ALERGIAS</p>
                                    <p class="text-body-sm text-error font-semibold">${paciente.alergias}</p>
                                </div>` : ''
            }
                            </div></div>
    <div class="col-span-8">
        <div class="glass-card h-full flex-col" style="min-height:500px;">
            <div class="tabs">
                <button class="tab active" onclick="window.Modules.Patients.switchDetailTab('evolucion','${paciente.id}',this)">Evolución Médica</button>
                <button class="tab" onclick="window.Modules.Patients.switchDetailTab('recetas','${paciente.id}',this)">Recetas</button>
            </div>
            <div class="p-lg flex-1 overflow-y-auto" id="detail-tabs-content">
                <div class="flex items-center justify-center" style="height:150px;">
                    <span class="material-symbols-outlined" style="font-size:36px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                </div>
            </div>
        </div>
    </div>
                        </div>
                    </div>
                </main>
            </div>`;

        setTimeout(() => {
            const firstTab = document.querySelector('.tab');
            if (firstTab) this.switchDetailTab('evolucion', paciente.id, firstTab);
        }, 50);
    },

    async switchDetailTab(tab, pacienteId, clickedBtn) {
        if (clickedBtn) {
            clickedBtn.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            clickedBtn.classList.add('active');
        }
        const content = document.getElementById('detail-tabs-content');
        if (!content) return;

        if (tab === 'evolucion') {
            const canEdit = Permissions.canEdit('historial');
            content.innerHTML = `<div class="flex justify-between items-center mb-lg">
    <h3 class="text-headline-sm">Historial de Tratamientos</h3>
                ${canEdit ? `<button class="btn btn--secondary btn--sm" onclick="window.Modules.Patients.showAddHistorialModal('${pacienteId}')">
                    <span class="material-symbols-outlined" style="font-size:16px;">add</span> Agregar Registro
                </button>` : ''
                }
            </div><div class="timeline" id="historial-list"><span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">autorenew</span></div>`;
            try {
                const historial = await PatientService.getHistorial(pacienteId);
                const list = document.getElementById('historial-list');
                if (!list) return;
                if (!historial || historial.length === 0) {
                    list.innerHTML = '<p class="text-body-sm text-muted">No hay registros en el historial clínico.</p>';
                } else {
                    list.innerHTML = historial.map(h => `
    <div class="timeline-item">
                            <div class="timeline-item__dot"></div>
                            <div class="mb-xs"><span class="text-label-md text-primary">${this._fmt.date(h.fecha)}</span></div>
                            <h4 class="text-headline-sm mb-xs">${h.descripcion}</h4>
                            ${h.diagnostico ? `<p class="text-body-sm mb-xs"><b>Dx:</b> ${h.diagnostico}</p>` : ''}
                            ${h.tratamiento ? `<p class="text-body-sm mb-sm">${h.tratamiento}</p>` : ''}
                            ${h.notas ? `<p class="text-body-sm text-muted"><i>Nota: ${h.notas}</i></p>` : ''}
                        </div>`).join('');
                }
            } catch (_) { }

        } else if (tab === 'recetas') {
            const canCreate = Permissions.canCreate('recetas');
            content.innerHTML = `<div class="flex justify-between items-center mb-lg">
    <h3 class="text-headline-sm">Recetas Médicas</h3>
                ${canCreate ? `<button class="btn btn--secondary btn--sm" onclick="window.Modules.Patients.showNewPrescriptionModal('${pacienteId}')">
                    <span class="material-symbols-outlined" style="font-size:16px;">receipt</span> Emitir Receta
                </button>` : ''
                }
            </div><div class="flex-col gap-md" id="recetas-list"><span class="material-symbols-outlined" style="animation:spin 1s linear infinite;">autorenew</span></div>`;
            try {
                const recetas = await PatientService.getRecetas(pacienteId);
                const list = document.getElementById('recetas-list');
                if (!list) return;
                if (!recetas || recetas.length === 0) {
                    list.innerHTML = '<p class="text-body-sm text-muted">No se han emitido recetas para este paciente.</p>';
                } else {
                    list.innerHTML = recetas.map(r => `
    <div class="glass-card p-md">
                            <div class="flex justify-between items-start mb-sm">
                                <span class="font-mono text-primary font-semibold">${r.codigo}</span>
                                <span class="chip chip--success">${r.firmada ? 'Firmada' : 'Pendiente'}</span>
                            </div>
                            <div class="text-body-sm mb-xs"><b>Fecha:</b> ${this._fmt.date(r.fecha)}</div>
                            ${r.indicaciones ? `<div class="text-body-sm text-muted"><b>Indicaciones:</b> ${r.indicaciones}</div>` : ''}
                        </div>`).join('');
                }
            } catch (_) { }
        }
    },

    showAddHistorialModal(pacienteId) {
        const user = Auth.getSession();
        Modal.form({
            title: 'Agregar Registro Clínico',
            fields: [
                {
                    name: 'tipo', label: 'Tipo de Registro', type: 'select', options: [
                        { value: 'consulta', label: 'Consulta General' }, { value: 'tratamiento', label: 'Tratamiento Realizado' },
                        { value: 'control', label: 'Control / Seguimiento' }, { value: 'emergencia', label: 'Atención de Emergencia' }
                    ], required: true
                },
                { name: 'descripcion', label: 'Motivo de Consulta / Descripción', required: true },
                { name: 'diagnostico', label: 'Diagnóstico (Dx)' },
                { name: 'tratamiento', label: 'Tratamiento Indicado / Ejecutado', required: true },
                { name: 'notas', label: 'Notas Médicas Adicionales', type: 'textarea' }
            ],
            onSubmit: async (data) => {
                try {
                    await PatientService.addHistorial(pacienteId, { ...data, odontologoId: user?.userId });
                    Toast.success('Registro clínico agregado correctamente');
                    this.switchDetailTab('evolucion', pacienteId);
                } catch (_) { }
            }
        });
    },

    showNewPrescriptionModal(pacienteId) {
        const user = Auth.getSession();
        Modal.form({
            title: 'Emitir Receta Médica',
            fields: [
                { name: 'medicamento', label: 'Medicamento (Ej. Amoxicilina 500mg)', required: true },
                { name: 'dosis', label: 'Dosis (Ej. 1 cápsula)', required: true },
                { name: 'frecuencia', label: 'Frecuencia (Ej. Cada 8 horas)', required: true },
                { name: 'duracion', label: 'Duración (Ej. 7 días)', required: true },
                { name: 'instrucciones', label: 'Instrucciones adicionales' },
                { name: 'indicaciones', label: 'Indicaciones Generales', type: 'textarea' }
            ],
            onSubmit: async (data) => {
                try {
                    await PatientService.createReceta({
                        pacienteId,
                        odontologoId: user?.userId,
                        indicaciones: data.indicaciones,
                        medicamentos: [{
                            nombre: data.medicamento, dosis: data.dosis,
                            frecuencia: data.frecuencia, duracion: data.duracion,
                            instrucciones: data.instrucciones
                        }]
                    });
                    Toast.success('Receta emitida correctamente');
                    this.switchDetailTab('recetas', pacienteId);
                } catch (_) { }
            }
        });
    }
};
