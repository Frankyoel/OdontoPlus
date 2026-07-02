/* ============================================================
   OdontoPlus — Módulo Agenda (appointments.js)
   ============================================================ */

window.Modules.Appointments = {
    currentFilter: 'hoy',

    render() {
        const container = document.getElementById('app-content');
        const citas = DataService.getCitas();
        const canCreate = Permissions.canCreate('agenda');
        
        // Filtrar citas si es odontólogo
        const rol = Auth.getCurrentRole();
        const user = Auth.getCurrentUser();
        let displayCitas = (rol === 'odontologo') 
            ? citas.filter(c => c.odontologoId === user.id) 
            : citas;

        // Filtrar por fecha según el filtro activo
        const hoyStr = new Date().toISOString().split('T')[0];
        const hoyDate = new Date(hoyStr + 'T00:00:00');
        
        if (this.currentFilter === 'hoy') {
            displayCitas = displayCitas.filter(c => c.fecha === hoyStr);
        } else if (this.currentFilter === 'semana') {
            displayCitas = displayCitas.filter(c => {
                const citaDate = new Date(c.fecha + 'T00:00:00');
                const diffTime = citaDate - hoyDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                return diffDays >= 0 && diffDays < 7;
            });
        }

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Agenda y Citas', 'Control de consultorios')}
                    <div class="page-content">
                        
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Agenda Clínica</h1>
                                <p class="text-body-md text-muted">Gestión de citas y disponibilidad</p>
                            </div>
                            <div class="page-header__actions">
                                <div class="tabs" style="border-bottom: none; background: white; padding: 4px; border-radius: var(--radius-lg); border: 1px solid var(--color-outline-variant);">
                                    <button class="tab ${this.currentFilter === 'hoy' ? 'active' : ''}" style="padding: 4px 16px; border-radius: var(--radius-md); border: none;" onclick="window.Modules.Appointments.changeFilter('hoy', this)">Hoy</button>
                                    <button class="tab ${this.currentFilter === 'semana' ? 'active' : ''}" style="padding: 4px 16px; border-radius: var(--radius-md); border: none;" onclick="window.Modules.Appointments.changeFilter('semana', this)">Semana</button>
                                    <button class="tab ${this.currentFilter === 'todos' ? 'active' : ''}" style="padding: 4px 16px; border-radius: var(--radius-md); border: none;" onclick="window.Modules.Appointments.changeFilter('todos', this)">Todos</button>
                                </div>
                                ${canCreate ? `
                                <button class="btn btn--primary" onclick="window.Modules.Appointments.showNewModal()">
                                    <span class="material-symbols-outlined">add</span>
                                    Nueva Cita
                                </button>
                                ` : ''}
                            </div>
                        </div>

                        <div class="glass-card p-lg">
                            ${TableComponent.render({
                                id: 'appointments-table',
                                columns: [
                                    { label: 'Fecha/Hora', field: 'fecha', render: (v, item) => `
                                        <div class="font-semibold text-primary">${item.horaInicio} - ${item.horaFin}</div>
                                        <div class="text-body-sm text-muted">${Models.formatDate(v)}</div>
                                    ` },
                                    { label: 'Paciente', field: 'pacienteNombre', render: (v) => `<div class="font-semibold">${v}</div>` },
                                    { label: 'Odontólogo', field: 'odontologoNombre' },
                                    { label: 'Tratamiento', field: 'tipo', render: v => Models.TIPOS_CITA[v] || v },
                                    { label: 'Estado', field: 'estado', render: v => TableComponent.renderStatus(v) },
                                    { label: 'Consultorio', field: 'consultorio' },
                                    { label: 'Acciones', field: 'id', render: (id) => `
                                        ${Permissions.canEdit('agenda') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="window.Modules.Appointments.showChangeStatusModal('${id}')" title="Cambiar Estado">
                                            <span class="material-symbols-outlined">edit_calendar</span>
                                        </button>
                                        ` : ''}
                                        ${Permissions.canDelete('agenda') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-error);" onclick="window.Modules.Appointments.cancelAppointment('${id}')" title="Cancelar Cita">
                                            <span class="material-symbols-outlined">cancel</span>
                                        </button>
                                        ` : ''}
                                    ` }
                                ],
                                data: displayCitas.sort((a, b) => {
                                    const dateA = new Date(a.fecha + 'T' + a.horaInicio);
                                    const dateB = new Date(b.fecha + 'T' + b.horaInicio);
                                    return dateA - dateB;
                                })
                            })}
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    showNewModal() {
        const pacientes = DataService.getPacientes().filter(p => p.activo);
        const odontologos = DataService.getUsuarios().filter(u => u.rol === 'odontologo' && u.activo);
        
        Modal.form({
            title: 'Programar Nueva Cita',
            fields: [
                { name: 'pacienteId', label: 'Paciente', type: 'select', options: pacientes.map(p => ({ value: p.id, label: p.nombreCompleto })), required: true },
                { name: 'odontologoId', label: 'Odontólogo', type: 'select', options: odontologos.map(o => ({ value: o.id, label: o.nombreCompleto })), required: true },
                { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                { name: 'horaInicio', label: 'Hora', type: 'time', required: true },
                { name: 'tipo', label: 'Tipo de Atención', type: 'select', options: Object.keys(Models.TIPOS_CITA).map(k => ({ value: k, label: Models.TIPOS_CITA[k] })), required: true },
                { name: 'notas', label: 'Notas Adicionales', type: 'textarea' }
            ],
            onSubmit: (data) => {
                const paciente = pacientes.find(p => p.id === data.pacienteId);
                const odontologo = odontologos.find(o => o.id === data.odontologoId);
                
                const cita = DataService.createCita({
                    ...data,
                    pacienteNombre: paciente.nombreCompleto,
                    odontologoNombre: odontologo.nombreCompleto,
                    horaFin: this._calculateEndTime(data.horaInicio, 30) // 30 min default
                });
                
                Toast.success('Cita programada con éxito');
                this.render();
            }
        });
    },

    showChangeStatusModal(id) {
        const cita = DataService.getCita(id);
        if (!cita) return;

        Modal.form({
            title: 'Cambiar Estado de la Cita',
            submitText: 'Actualizar Estado',
            fields: [
                { name: 'estado', label: 'Nuevo Estado', type: 'select', options: [
                    { value: 'programada', label: 'Programada' },
                    { value: 'confirmada', label: 'Confirmada' },
                    { value: 'en_curso', label: 'En Curso' },
                    { value: 'completada', label: 'Completada' },
                    { value: 'cancelada', label: 'Cancelada' },
                    { value: 'no_asistio', label: 'No Asistió' }
                ], value: cita.estado, required: true }
            ],
            onSubmit: (data) => {
                DataService.updateCita(id, { estado: data.estado });
                Toast.success('Estado de la cita actualizado');
                this.render();
            }
        });
    },

    cancelAppointment(id) {
        Modal.confirm({
            title: 'Cancelar Cita',
            message: '¿Estás seguro de que deseas cancelar esta cita? Esta acción notificará al paciente.',
            confirmText: 'Sí, cancelar cita',
            variant: 'danger',
            onConfirm: () => {
                DataService.updateCita(id, { estado: 'cancelada' });
                Toast.success('Cita cancelada correctamente');
                this.render();
            }
        });
    },

    changeFilter(filter, btn) {
        this.currentFilter = filter;
        if (btn) {
            btn.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        }
        this.render();
    },

    _calculateEndTime(startTime, durationMinutes) {
        if (!startTime) return '';
        const [hours, minutes] = startTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes + durationMinutes);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
};
