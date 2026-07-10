/* ============================================================
   OdontoPlus — Dashboard (dashboard.js)
   Usa DashboardService y AppointmentService (API real)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Dashboard = {

    /** Helpers de formato (sin Models) */
    _fmt: {
        money: (v) => `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        tipoCita: { consulta: 'Consulta', tratamiento: 'Tratamiento', control: 'Control', emergencia: 'Emergencia', limpieza: 'Limpieza' }
    },

    async render() {
        const container = document.getElementById('app-content');
        const tipo = Permissions.getDashboardType();

        // Esqueleto mientras carga
        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Resumen de hoy')}
                    <div class="page-content">
                        <div class="flex items-center justify-center" style="height:300px;">
                            <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                        </div>
                    </div>
                </main>
            </div>`;

        try {
            const [stats, citas] = await Promise.all([
                DashboardService.getStats(),
                AppointmentService.getToday()
            ]);

            let contentHtml = '';
            if (tipo === 'completo') contentHtml = this.renderAdmin(stats, citas);
            else if (tipo === 'clinico') {
                const userId = Auth.getSession()?.userId;
                if (userId) {
                    citas = citas.filter(c => (c.odontologoId || '').toLowerCase() === userId.toLowerCase());
                }
                contentHtml = this.renderClinico(stats, citas);
            }
            else if (tipo === 'inventario') contentHtml = this.renderInventario(stats);
            else contentHtml = this.renderRecepcion(stats, citas);

            const mainContent = container.querySelector('.page-content');
            if (mainContent) mainContent.innerHTML = contentHtml;

            if (tipo === 'completo') {
                setTimeout(() => {
                    const chartContainer = document.getElementById('ingresos-chart');
                    if (chartContainer && typeof Charts !== 'undefined') {
                        const fmt = this._fmt.money;
                        chartContainer.innerHTML = Charts.barChart({
                            id: 'chart-ingresos',
                            height: 200,
                            color: 'var(--color-primary)',
                            data: (stats.ingresosSemana || []).map(d => ({
                                label: d.dia, shortLabel: d.dia.substring(0, 3), value: d.total, format: fmt
                            }))
                        });
                    }
                }, 100);
            }
        } catch (_) {
            // ApiClient ya mostró Toast de error, no hacer nada más
        }
    },

    renderAdmin(s, citas) {
        const fmt = this._fmt.money;
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-3"><div class="kpi-card">
                    <div class="flex justify-between items-start">
                        <div class="kpi-card__icon kpi-card__icon--primary"><span class="material-symbols-outlined">payments</span></div>
                    </div>
                    <p class="text-label-md text-muted mb-xs">Ingresos (Hoy)</p>
                    <h3 class="text-headline-md">${fmt(s.ingresosHoy)}</h3>
                </div></div>
                <div class="col-span-3"><div class="kpi-card">
                    <div class="flex justify-between items-start">
                        <div class="kpi-card__icon kpi-card__icon--secondary"><span class="material-symbols-outlined">calendar_month</span></div>
                        <span class="text-label-md text-primary">${s.totalCitasMes || 0} Total</span>
                    </div>
                    <p class="text-label-md text-muted mb-xs">Citas Programadas</p>
                    <h3 class="text-headline-md">${s.citasProgramadasHoy || 0} / ${s.citasHoy || 0}</h3>
                </div></div>
                <div class="col-span-3"><div class="kpi-card">
                    <div class="flex justify-between items-start">
                        <div class="kpi-card__icon kpi-card__icon--tertiary"><span class="material-symbols-outlined">person_add</span></div>
                    </div>
                    <p class="text-label-md text-muted mb-xs">Pacientes Totales</p>
                    <h3 class="text-headline-md">${s.totalPacientes || 0}</h3>
                </div></div>
                <div class="col-span-3"><div class="kpi-card">
                    <div class="flex justify-between items-start">
                        <div class="kpi-card__icon ${(s.itemsCriticos || 0) > 0 ? 'kpi-card__icon--error' : 'kpi-card__icon--primary'}"><span class="material-symbols-outlined">warning</span></div>
                    </div>
                    <p class="text-label-md text-muted mb-xs">Alertas Inventario</p>
                    <h3 class="text-headline-md ${(s.itemsCriticos || 0) > 0 ? 'text-error' : ''}">${s.itemsCriticos || 0}</h3>
                </div></div>
                <div class="col-span-12"><div class="glass-card p-lg">
                    <h3 class="text-headline-sm mb-lg">Flujo de Ingresos</h3>
                    <div id="ingresos-chart" style="width:100%;"></div>
                </div></div>
                <div class="col-span-12"><div class="glass-card p-lg flex-col">
                    <div class="flex justify-between items-center mb-lg">
                        <h3 class="text-headline-sm">Próximas Citas</h3>
                        <button class="btn--icon-sm" style="background:var(--color-primary);color:white;" onclick="Router.navigate('#/agenda')">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <div class="flex-1" style="overflow: hidden;">${this._renderTimeline(citas)}</div>
                    <button class="btn btn--secondary btn--full mt-md" onclick="Router.navigate('#/agenda')">Ver Agenda Completa</button>
                </div></div>
            </div>`;
    },

    renderClinico(s, citas) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-12">
                    <div class="page-header mb-lg">
                        <h2 class="text-headline-lg">Mis Citas de Hoy</h2>
                        <p class="text-body-md text-muted">Tienes ${s.citasProgramadasHoy || 0} citas programadas.</p>
                    </div>
                    <div class="glass-card p-lg"><div style="overflow: hidden;">${this._renderTimeline(citas, true)}</div></div>
                </div>
                <div class="col-span-12">
                    <div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md">Acciones Rápidas</h3>
                        <div class="grid grid-cols-4 gap-sm">
                            <button class="kpi-card" style="min-height:100px;" onclick="Router.navigate('#/pacientes')">
                                <div class="kpi-card__icon kpi-card__icon--primary mb-xs" style="margin:0 auto;"><span class="material-symbols-outlined">person_add</span></div>
                                <div class="text-label-md text-center">Nuevo Paciente</div>
                            </button>
                            <button class="kpi-card" style="min-height:100px;" onclick="Router.navigate('#/agenda')">
                                <div class="kpi-card__icon kpi-card__icon--secondary mb-xs" style="margin:0 auto;"><span class="material-symbols-outlined">event</span></div>
                                <div class="text-label-md text-center">Ver Agenda</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    },

    renderRecepcion(s, citas) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--secondary mb-sm"><span class="material-symbols-outlined">calendar_today</span></div>
                    <p class="text-label-md text-muted mb-xs">Citas de Hoy</p>
                    <h3 class="text-headline-md">${s.citasHoy || 0}</h3>
                </div></div>
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--primary mb-sm"><span class="material-symbols-outlined">groups</span></div>
                    <p class="text-label-md text-muted mb-xs">Pacientes Totales</p>
                    <h3 class="text-headline-md">${s.totalPacientes || 0}</h3>
                </div></div>
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--warning mb-sm"><span class="material-symbols-outlined">receipt_long</span></div>
                    <p class="text-label-md text-muted mb-xs">Cobros Pendientes</p>
                    <h3 class="text-headline-md">${s.facturasPendientes || 0}</h3>
                </div></div>
                <div class="col-span-12"><div class="glass-card p-lg">
                    <h3 class="text-headline-sm mb-md">Agenda del Día</h3>
                    <div style="overflow: hidden;">${this._renderTimeline(citas)}</div>
                </div></div>
            </div>`;
    },

    renderInventario(s) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--primary mb-sm"><span class="material-symbols-outlined">inventory_2</span></div>
                    <p class="text-label-md text-muted mb-xs">Total Artículos</p>
                    <h3 class="text-headline-md">${s.totalArticulos || 0}</h3>
                </div></div>
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--error mb-sm"><span class="material-symbols-outlined">warning</span></div>
                    <p class="text-label-md text-muted mb-xs">Stock Crítico</p>
                    <h3 class="text-headline-md text-error">${s.itemsCriticos || 0}</h3>
                </div></div>
                <div class="col-span-4"><div class="kpi-card">
                    <div class="kpi-card__icon kpi-card__icon--warning mb-sm"><span class="material-symbols-outlined">arrow_downward</span></div>
                    <p class="text-label-md text-muted mb-xs">Stock Bajo</p>
                    <h3 class="text-headline-md">${s.itemsBajos || 0}</h3>
                </div></div>
            </div>`;
    },

    _renderTimeline(citas, detailed = false) {
        if (!citas || citas.length === 0)
            return `<p class="text-body-sm text-muted">No hay citas para hoy.</p>`;
        
        const statusColors = {
            'programada': 'primary', 'confirmada': 'secondary', 'en_curso': 'tertiary',
            'completada': 'success', 'cancelada': 'error', 'no_asistio': 'outline'
        };
        const statusLabels = {
            'programada': 'Programada', 'confirmada': 'Confirmada', 'en_curso': 'En Curso',
            'completada': 'Completada', 'cancelada': 'Cancelada', 'no_asistio': 'No Asistió'
        };
        const tipos = this._fmt.tipoCita;

        return `
        <div class="horizontal-scroll-container" style="display: flex; gap: var(--space-md); overflow-x: auto; padding: 4px; padding-bottom: var(--space-md); width: 100%;">
            ${citas
                .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''))
                .map((cita) => {
                    const pac = cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}` : (cita.pacienteNombre || 'Sin Asignar');
                    const doc = cita.odontologo ? (cita.odontologo.nombreCompleto || cita.odontologo.userName.split('@')[0]) : 'Sin Asignar';
                    const statusClass = statusColors[cita.estado] || 'outline';
                    const statusLabel = statusLabels[cita.estado] || cita.estado;

                    return `
                    <div class="glass-card p-md" style="min-width: 290px; max-width: 320px; flex-shrink: 0; border-left: 4px solid var(--color-primary); display: flex; flex-direction: column; gap: var(--space-xs); box-shadow: var(--shadow-sm); background: white;">
                        <div class="flex justify-between items-start" style="gap: 8px;">
                            <div>
                                <h4 class="text-headline-sm font-semibold truncate" style="max-width: 160px; margin: 0;">${pac}</h4>
                                <div class="text-body-sm text-muted mt-xs flex items-center gap-xs">
                                    <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>
                                    <span class="font-mono text-primary font-semibold">${(cita.horaInicio || '').substring(0, 5)} - ${(cita.horaFin || '').substring(0, 5)}</span>
                                </div>
                            </div>
                            <span class="chip chip--${statusClass}" style="font-size: 10px; padding: 2px 8px; white-space: nowrap;">${statusLabel}</span>
                        </div>
                        
                        <div class="flex flex-col gap-xs mt-xs text-body-sm" style="border-top: 1px solid var(--color-surface-variant); padding-top: var(--space-xs);">
                            <div class="flex items-center gap-sm text-muted"><span class="material-symbols-outlined" style="font-size: 16px;">dentistry</span> <span class="truncate">Dr(a). ${doc}</span></div>
                            <div class="flex items-center gap-sm text-muted"><span class="material-symbols-outlined" style="font-size: 16px;">meeting_room</span> <span>${cita.consultorio || 'Consultorio 1'}</span></div>
                            <div class="flex items-center gap-sm text-muted"><span class="material-symbols-outlined" style="font-size: 16px;">medical_services</span> <span style="text-transform: capitalize;">${tipos[cita.tipo] || cita.tipo || 'Consulta'}</span></div>
                        </div>
                        
                        ${cita.notas ? `<div class="mt-xs p-xs" style="background: var(--color-surface-variant); border-radius: var(--radius-sm); font-size: 11px;"><p class="truncate" style="margin: 0;" title="${cita.notas}"><b>Notas:</b> ${cita.notas}</p></div>` : ''}
                    </div>`;
                }).join('')}
        </div>`;
    }
};
