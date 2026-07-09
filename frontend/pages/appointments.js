/* ============================================================
   OdontoPlus — Módulo Agenda (appointments.js)
   Usa AppointmentService (API real)
   ============================================================ */

window.Modules.Appointments = {
    currentFilter: 'hoy',

    _fmt: {
        date: (v) => v ? new Date(v).toLocaleDateString('es-PE') : '-',
        status: (v) => {
            const styles = {
                'programada': 'primary', 'confirmada': 'secondary', 'en_curso': 'tertiary',
                'completada': 'success', 'cancelada': 'error', 'no_asistio': 'outline'
            };
            const labels = {
                'programada': 'Programada', 'confirmada': 'Confirmada', 'en_curso': 'En Curso',
                'completada': 'Completada', 'cancelada': 'Cancelada', 'no_asistio': 'No Asistió'
            };
            return `<span class="chip chip--${styles[v] || 'outline'}">${labels[v] || v}</span>`;
        }
    },

    async render() {
        const container = document.getElementById('app-content');
        const canCreate = Permissions.canCreate('agenda');

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
                                <div class="tabs" style="border-bottom:none;background:white;padding:4px;border-radius:var(--radius-lg);border:1px solid var(--color-outline-variant);">
                                    <button class="tab ${this.currentFilter === 'hoy' ? 'active' : ''}" style="padding:4px 16px;border-radius:var(--radius-md);border:none;" onclick="window.Modules.Appointments.changeFilter('hoy',this)">Hoy</button>
                                    <button class="tab ${this.currentFilter === 'semana' ? 'active' : ''}" style="padding:4px 16px;border-radius:var(--radius-md);border:none;" onclick="window.Modules.Appointments.changeFilter('semana',this)">Semana</button>
                                    <button class="tab ${this.currentFilter === 'todos' ? 'active' : ''}" style="padding:4px 16px;border-radius:var(--radius-md);border:none;" onclick="window.Modules.Appointments.changeFilter('todos',this)">Todos</button>
                                </div>
                                ${canCreate ? `<button class="btn btn--primary" onclick="window.Modules.Appointments.showNewModal()">
                                    <span class="material-symbols-outlined">add</span> Nueva Cita
                                </button>` : ''}
                            </div>
                        </div>
                        <div class="glass-card p-lg" id="appointments-table-wrapper">
                            <div class="flex items-center justify-center" style="height:200px;">
                                <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>`;

        try {
            let displayCitas = [];
            if (this.currentFilter === 'hoy') displayCitas = await AppointmentService.getToday();
            else displayCitas = await AppointmentService.getAll();

            if (this.currentFilter === 'semana') {
                const hoyStr = new Date().toISOString().split('T')[0];
                const hoyDate = new Date(hoyStr + 'T00:00:00');
                displayCitas = displayCitas.filter(c => {
                    const citaDate = new Date(c.fecha.split('T')[0] + 'T00:00:00');
                    const diffDays = (citaDate - hoyDate) / (1000 * 60 * 60 * 24);
                    return diffDays >= 0 && diffDays < 7;
                });
            }

            const rol = Auth.getCurrentRole();
            const userId = Auth.getSession().userId;
            if (rol === 'doctor' || rol === 'odontologo') {
                displayCitas = displayCitas.filter(c => c.odontologoId === userId);
            }

            const wrapper = document.getElementById('appointments-table-wrapper');
            if (wrapper) {
                displayCitas = displayCitas.map(c => {
                    const pac = c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : 'Sin Asignar';
                    const doc = c.odontologo ? c.odontologo.userName.split('@')[0] : 'Sin Asignar';
                    return { ...c, pacienteNombre: pac, odontologoNombre: doc };
                });
                // sort by date asc, time asc
                displayCitas.sort((a, b) => (a.fecha.split('T')[0] + a.horaInicio).localeCompare(b.fecha.split('T')[0] + b.horaInicio));
                wrapper.innerHTML = TableComponent.render({
                    id: 'appointments-table',
                    columns: [
                        { label: 'Fecha/Hora', field: 'fecha', render: (v, item) => `<div class="font-semibold text-primary">${item.horaInicio.substring(0, 5)} - ${item.horaFin.substring(0, 5)}</div><div class="text-body-sm text-muted">${this._fmt.date(v)}</div>` },
                        { label: 'Paciente', field: 'pacienteNombre', render: v => `<div class="font-semibold">${v || ''}</div>` },
                        { label: 'Odontólogo', field: 'odontologoNombre' },
                        { label: 'Estado', field: 'estado', render: v => this._fmt.status(v) },
                        { label: 'Consultorio', field: 'consultorio' },
                        {
                            label: 'Acciones', field: 'id', render: id => `
                            ${Permissions.canEdit('agenda') ? `<button class="btn--icon-sm" style="color:var(--color-primary);" onclick="window.Modules.Appointments.showChangeStatusModal(${id})" title="Cambiar Estado"><span class="material-symbols-outlined">edit_calendar</span></button>` : ''}
                            ${Permissions.canDelete('agenda') ? `<button class="btn--icon-sm" style="color:var(--color-error);" onclick="window.Modules.Appointments.cancelAppointment(${id})" title="Cancelar Cita"><span class="material-symbols-outlined">cancel</span></button>` : ''}
                        `}
                    ],
                    data: displayCitas
                });
            }
        } catch (_) { }
    },

    async showNewModal() {
        let pacientes = [], odontologos = [];
        try {
            [pacientes, odontologos] = await Promise.all([
                PatientService.getAll(), UsuarioService.getOdontologos()
            ]);
        } catch (_) {
            return Toast.error('Error al cargar datos para el formulario');
        }

        Modal.form({
            title: 'Programar Nueva Cita',
            fields: [
                { name: 'pacienteId', label: 'Paciente', type: 'select', options: pacientes.map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` })), required: true },
                { name: 'odontologoId', label: 'Odontólogo', type: 'select', options: odontologos.map(o => ({ value: o.id, label: o.nombreCompleto })), required: true },
                { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                { name: 'horaInicio', label: 'Hora', type: 'time', required: true },
                { name: 'tipo', label: 'Tipo de Atención (Ej. consulta)', required: true },
                { name: 'notas', label: 'Notas Adicionales', type: 'textarea' }
            ],
            onSubmit: async (data) => {
                data.horaInicio = data.horaInicio.length === 5 ? data.horaInicio + ":00" : data.horaInicio;
                data.horaFin = this._calculateEndTime(data.horaInicio, 30);
                data.consultorio = 'Consultorio ' + Math.floor(Math.random() * 5 + 1); // Mocked consultorio

                try {
                    await AppointmentService.create(data);
                    Toast.success('Cita programada con éxito');
                    this.render();
                } catch (_) { }
            }
        });
    },

    showChangeStatusModal(id) {
        Modal.form({
            title: 'Cambiar Estado de la Cita', submitText: 'Actualizar',
            fields: [{
                name: 'estado', label: 'Nuevo Estado', type: 'select', options: [
                    { value: 'programada', label: 'Programada' }, { value: 'confirmada', label: 'Confirmada' }, { value: 'en_curso', label: 'En Curso' },
                    { value: 'completada', label: 'Completada' }, { value: 'cancelada', label: 'Cancelada' }, { value: 'no_asistio', label: 'No Asistió' }
                ], required: true
            }],
            onSubmit: async (data) => {
                try {
                    await AppointmentService.updateEstado(id, data.estado);
                    Toast.success('Estado actualizado');
                    this.render();
                } catch (_) { }
            }
        });
    },

    cancelAppointment(id) {
        Modal.confirm({
            title: 'Cancelar Cita', message: '¿Confirmas la cancelación?', confirmText: 'Sí, cancelar', variant: 'danger',
            onConfirm: async () => {
                try {
                    await AppointmentService.updateEstado(id, 'cancelada');
                    Toast.success('Cita cancelada');
                    this.render();
                } catch (_) { }
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

    _calculateEndTime(start, durMins) {
        const [h, m] = start.split(':').map(Number);
        const d = new Date(); d.setHours(h, m + durMins);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
    }
};
