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
            else if (tipo === 'clinico') contentHtml = this.renderClinico(stats, citas);
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
                <div class="col-span-8"><div class="glass-card p-lg h-full">
                    <h3 class="text-headline-sm mb-lg">Flujo de Ingresos</h3>
                    <div id="ingresos-chart" style="width:100%;"></div>
                </div></div>
                <div class="col-span-4"><div class="glass-card p-lg h-full flex-col">
                    <div class="flex justify-between items-center mb-lg">
                        <h3 class="text-headline-sm">Próximas Citas</h3>
                        <button class="btn--icon-sm" style="background:var(--color-primary);color:white;" onclick="Router.navigate('#/agenda')">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <div class="timeline flex-1">${this._renderTimeline(citas)}</div>
                    <button class="btn btn--secondary btn--full mt-md" onclick="Router.navigate('#/agenda')">Ver Agenda Completa</button>
                </div></div>
            </div>`;
    },

    renderClinico(s, citas) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-8">
                    <div class="page-header mb-lg">
                        <h2 class="text-headline-lg">Mis Citas de Hoy</h2>
                        <p class="text-body-md text-muted">Tienes ${s.citasProgramadasHoy || 0} citas programadas.</p>
                    </div>
                    <div class="glass-card p-lg"><div class="timeline">${this._renderTimeline(citas, true)}</div></div>
                </div>
                <div class="col-span-4 flex-col gap-lg">
                    <div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md">Acciones Rápidas</h3>
                        <div class="grid grid-cols-2 gap-sm">
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
                <div class="col-span-8"><div class="glass-card p-lg">
                    <h3 class="text-headline-sm mb-md">Agenda del Día</h3>
                    <div class="timeline">${this._renderTimeline(citas)}</div>
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
        const tipos = this._fmt.tipoCita;
        return citas
            .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''))
            .map((cita, i) => {
                const isNext = cita.estado === 'programada' && i === 0;
                return `
                <div class="timeline-item">
                    <div class="${isNext ? 'timeline-item__dot timeline-item__dot--active' : 'timeline-item__dot'}"></div>
                    <div style="position:absolute;left:-72px;top:4px;font:var(--font-label-md);color:var(--color-${isNext ? 'primary' : 'on-surface-variant'});width:40px;text-align:right;">${cita.horaInicio || ''}</div>
                    <div class="glass-card ${isNext ? '' : 'glass-card--flat'} p-md ml-sm">
                        <div class="flex justify-between items-start mb-xs">
                            <h4 class="text-headline-sm">${cita.pacienteNombre || cita.paciente?.nombre || 'Paciente'}</h4>
                            <span class="chip chip--${isNext ? 'primary' : 'outline'}">${tipos[cita.tipo] || cita.tipo || ''}</span>
                        </div>
                        <div class="flex items-center gap-xs text-body-sm text-muted">
                            <span class="material-symbols-outlined" style="font-size:16px;">dentistry</span>
                            <span>${cita.odontologoNombre || cita.odontologo?.nombre || ''}</span>
                        </div>
                        ${detailed && cita.notas ? `<div class="mt-sm p-sm" style="background:var(--color-surface-container-lowest);border-radius:var(--radius-sm);font-size:13px;color:var(--color-on-surface-variant);"><b>Notas:</b> ${cita.notas}</div>` : ''}
                    </div>
                </div>`;
            }).join('');
    }
};
