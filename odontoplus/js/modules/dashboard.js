/* ============================================================
   OdontoPlus — Módulo Dashboard (dashboard.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Dashboard = {
    render() {
        const container = document.getElementById('app-content');
        const stats = DataService.getEstadisticas();
        const tipo = Permissions.getDashboardType();

        // Determinar qué contenido mostrar según el rol
        let contentHtml = '';
        if (tipo === 'completo') {
            contentHtml = window.Modules.Dashboard.renderAdmin(stats);
        } else if (tipo === 'clinico' || tipo === 'clinico_limitado') {
            contentHtml = window.Modules.Dashboard.renderClinico(stats);
        } else if (tipo === 'inventario') {
            contentHtml = window.Modules.Dashboard.renderInventario(stats);
        } else {
            contentHtml = window.Modules.Dashboard.renderRecepcion(stats);
        }

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Resumen de hoy')}
                    <div class="page-content">
                        ${contentHtml}
                    </div>
                    <nav class="bottom-nav">
                        <!-- Navigation injected by Router -->
                    </nav>
                </main>
            </div>
        `;

        // Si es admin, renderizar gráficos
        if (tipo === 'completo') {
            setTimeout(() => {
                const chartContainer = document.getElementById('ingresos-chart');
                if (chartContainer) {
                    chartContainer.innerHTML = Charts.barChart({
                        id: 'chart-ingresos',
                        height: 200,
                        color: 'var(--color-primary)',
                        data: [
                            { label: 'Lunes', shortLabel: 'Lun', value: 850, format: v => Models.formatMoney(v) },
                            { label: 'Martes', shortLabel: 'Mar', value: 1200, format: v => Models.formatMoney(v) },
                            { label: 'Miércoles', shortLabel: 'Mié', value: 950, format: v => Models.formatMoney(v) },
                            { label: 'Jueves', shortLabel: 'Jue', value: 1240, format: v => Models.formatMoney(v), active: true },
                            { label: 'Viernes', shortLabel: 'Vie', value: 1100, format: v => Models.formatMoney(v) },
                            { label: 'Sábado', shortLabel: 'Sáb', value: 1800, format: v => Models.formatMoney(v) }
                        ]
                    });
                }
            }, 100);
        }
    },

    /** Vista Administrador (KPIs completos) */
    renderAdmin(stats) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <!-- Top KPIs -->
                <div class="col-span-3">
                    <div class="kpi-card">
                        <div class="flex justify-between items-start">
                            <div class="kpi-card__icon kpi-card__icon--primary">
                                <span class="material-symbols-outlined">payments</span>
                            </div>
                            <span class="chip chip--success">+12%</span>
                        </div>
                        <div>
                            <p class="text-label-md text-muted mb-xs">Ingresos (Hoy)</p>
                            <h3 class="text-headline-md">${Models.formatMoney(stats.ingresosHoy)}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="kpi-card">
                        <div class="flex justify-between items-start">
                            <div class="kpi-card__icon kpi-card__icon--secondary">
                                <span class="material-symbols-outlined">calendar_month</span>
                            </div>
                            <span class="text-label-md text-primary">${stats.totalCitasMes} Total</span>
                        </div>
                        <div>
                            <p class="text-label-md text-muted mb-xs">Citas Programadas</p>
                            <h3 class="text-headline-md">${stats.citasProgramadasHoy} / ${stats.citasHoy}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="kpi-card">
                        <div class="flex justify-between items-start">
                            <div class="kpi-card__icon kpi-card__icon--tertiary">
                                <span class="material-symbols-outlined">person_add</span>
                            </div>
                            <span class="chip chip--success">+5%</span>
                        </div>
                        <div>
                            <p class="text-label-md text-muted mb-xs">Pacientes Totales</p>
                            <h3 class="text-headline-md">${stats.totalPacientes}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="kpi-card">
                        <div class="flex justify-between items-start">
                            <div class="kpi-card__icon ${stats.itemsCriticos > 0 ? 'kpi-card__icon--error' : 'kpi-card__icon--primary'}">
                                <span class="material-symbols-outlined">warning</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-label-md text-muted mb-xs">Alertas de Inventario</p>
                            <h3 class="text-headline-md ${stats.itemsCriticos > 0 ? 'text-error' : ''}">${stats.itemsCriticos}</h3>
                        </div>
                    </div>
                </div>

                <!-- Chart Area -->
                <div class="col-span-8">
                    <div class="glass-card p-lg h-full">
                        <div class="flex justify-between items-center mb-lg">
                            <h3 class="text-headline-sm">Flujo de Ingresos</h3>
                            <select class="select-field" style="width: auto;">
                                <option>Últimos 7 días</option>
                                <option>Este mes</option>
                                <option>Mes anterior</option>
                            </select>
                        </div>
                        <div id="ingresos-chart" style="width: 100%;"></div>
                    </div>
                </div>

                <!-- Próximas Citas -->
                <div class="col-span-4">
                    <div class="glass-card p-lg h-full flex-col">
                        <div class="flex justify-between items-center mb-lg">
                            <h3 class="text-headline-sm">Próximas Citas</h3>
                            <button class="btn--icon-sm" style="background: var(--color-primary); color: white;" onclick="Router.navigate('#/agenda')">
                                <span class="material-symbols-outlined">add</span>
                            </button>
                        </div>
                        
                        <div class="timeline flex-1">
                            ${this._renderCitasTimeline()}
                        </div>
                        
                        <button class="btn btn--secondary btn--full mt-md" onclick="Router.navigate('#/agenda')">Ver Agenda Completa</button>
                    </div>
                </div>
            </div>
        `;
    },

    /** Vista Clínico (Odontólogo / Asistente) */
    renderClinico(stats) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-8">
                    <div class="page-header mb-lg">
                        <h2 class="text-headline-lg">Mis Citas de Hoy</h2>
                        <p class="text-body-md text-muted">Tienes ${stats.citasProgramadasHoy} citas programadas.</p>
                    </div>
                    
                    <div class="glass-card p-lg">
                        <div class="timeline">
                            ${this._renderCitasTimeline(true)}
                        </div>
                    </div>
                </div>
                
                <div class="col-span-4 flex-col gap-lg">
                    <div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md">Acciones Rápidas</h3>
                        <div class="grid grid-cols-2 gap-sm">
                            <button class="kpi-card" style="min-height: 100px;" onclick="Router.navigate('#/pacientes')">
                                <div class="kpi-card__icon kpi-card__icon--primary mb-xs" style="margin: 0 auto;">
                                    <span class="material-symbols-outlined">person_add</span>
                                </div>
                                <div class="text-label-md text-center">Nuevo Paciente</div>
                            </button>
                            <button class="kpi-card" style="min-height: 100px;" onclick="Router.navigate('#/agenda')">
                                <div class="kpi-card__icon kpi-card__icon--secondary mb-xs" style="margin: 0 auto;">
                                    <span class="material-symbols-outlined">event</span>
                                </div>
                                <div class="text-label-md text-center">Ver Agenda</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /** Vista Recepción */
    renderRecepcion(stats) {
        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--secondary mb-sm">
                            <span class="material-symbols-outlined">calendar_today</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Citas de Hoy</p>
                        <h3 class="text-headline-md">${stats.citasHoy}</h3>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--primary mb-sm">
                            <span class="material-symbols-outlined">groups</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Pacientes Totales</p>
                        <h3 class="text-headline-md">${stats.totalPacientes}</h3>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--warning mb-sm">
                            <span class="material-symbols-outlined">receipt_long</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Cobros Pendientes</p>
                        <h3 class="text-headline-md">${stats.facturasPendientes}</h3>
                    </div>
                </div>

                <div class="col-span-8">
                    <div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md">Agenda del Día</h3>
                        <div class="timeline">
                            ${this._renderCitasTimeline()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /** Vista Inventario (Almacenero) */
    renderInventario(stats) {
        const inventario = DataService.getInventario();
        const criticos = inventario.filter(i => i.estado === 'critico');

        return `
            <div class="grid grid-cols-12 gap-lg">
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--primary mb-sm">
                            <span class="material-symbols-outlined">inventory_2</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Total Artículos</p>
                        <h3 class="text-headline-md">${stats.totalArticulos}</h3>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--error mb-sm">
                            <span class="material-symbols-outlined">warning</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Stock Crítico</p>
                        <h3 class="text-headline-md text-error">${stats.itemsCriticos}</h3>
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="kpi-card">
                        <div class="kpi-card__icon kpi-card__icon--warning mb-sm">
                            <span class="material-symbols-outlined">arrow_downward</span>
                        </div>
                        <p class="text-label-md text-muted mb-xs">Stock Bajo</p>
                        <h3 class="text-headline-md">${stats.itemsBajos}</h3>
                    </div>
                </div>

                <div class="col-span-12">
                    <div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md text-error">Atención Requerida (Stock Crítico)</h3>
                        ${TableComponent.render({
            id: 'criticos-table',
            columns: [
                { label: 'SKU', field: 'sku' },
                { label: 'Artículo', field: 'nombre' },
                { label: 'Stock Actual', field: 'stockActual', render: (v, item) => `<b class="text-error">${v} ${item.unidad}</b>` },
                { label: 'Mínimo', field: 'stockMinimo', render: (v, item) => `${v} ${item.unidad}` },
                { label: 'Proveedor', field: 'proveedor' }
            ],
            data: criticos
        })}
                    </div>
                </div>
            </div>
        `;
    },

    /** Helper para renderizar citas en timeline */
    _renderCitasTimeline(detailed = false) {
        const citas = DataService.getCitasHoy().sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
        if (citas.length === 0) {
            return `<p class="text-body-sm text-muted">No hay citas para hoy.</p>`;
        }

        return citas.map((cita, index) => {
            const isNext = cita.estado === 'programada' && index === 0;
            const dotClass = isNext ? 'timeline-item__dot timeline-item__dot--active' : 'timeline-item__dot';
            const colorType = isNext ? 'primary' : 'outline';

            return `
                <div class="timeline-item">
                    <div class="${dotClass}"></div>
                    <div style="position: absolute; left: -72px; top: 4px; font: var(--font-label-md); color: var(--color-${isNext ? 'primary' : 'on-surface-variant'}); width: 40px; text-align: right;">
                        ${cita.horaInicio}
                    </div>
                    <div class="glass-card ${isNext ? '' : 'glass-card--flat'} p-md ml-sm" style="background: ${isNext ? 'var(--glass-surface-opaque)' : 'var(--glass-surface)'};">
                        <div class="flex justify-between items-start mb-xs">
                            <h4 class="text-headline-sm">${cita.pacienteNombre}</h4>
                            <span class="chip chip--${colorType}">${Models.TIPOS_CITA[cita.tipo] || cita.tipo}</span>
                        </div>
                        <div class="flex items-center gap-xs text-body-sm text-muted">
                            <span class="material-symbols-outlined" style="font-size: 16px;">dentistry</span>
                            <span>${cita.odontologoNombre}</span>
                        </div>
                        ${detailed && cita.notas ? `
                            <div class="mt-sm p-sm" style="background: var(--color-surface-container-lowest); border-radius: var(--radius-sm); font-size: 13px; color: var(--color-on-surface-variant);">
                                <b>Notas:</b> ${cita.notas}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
};
