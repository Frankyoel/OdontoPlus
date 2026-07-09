/* ============================================================
   OdontoPlus — Módulo Reportes (reports.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Reports = {
    render() {
        const container = document.getElementById('app-content');
        const reportType = Permissions.getReportType(); // 'todos', 'clinicos', 'atenciones', 'inventario'

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Reportes y Analíticas', 'Métricas de la clínica')}
                    <div class="page-content">
                        
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Centro de Reportes</h1>
                                <p class="text-body-md text-muted">Visualización de datos e indicadores de rendimiento</p>
                            </div>
                            <div class="page-header__actions">
                                <button class="btn btn--secondary">
                                    <span class="material-symbols-outlined">download</span>
                                    Exportar a Excel
                                </button>
                                <button class="btn btn--primary">
                                    <span class="material-symbols-outlined">picture_as_pdf</span>
                                    Generar PDF
                                </button>
                            </div>
                        </div>

                        <!-- Filtros Globales -->
                        <div class="glass-card p-md mb-lg flex items-center gap-md" style="flex-wrap: wrap;">
                            <span class="text-label-md text-muted ml-sm">FILTROS:</span>
                            <select class="select-field" style="width: 200px;">
                                <option>Este Mes (Actual)</option>
                                <option>Mes Anterior</option>
                                <option>Últimos 3 Meses</option>
                                <option>Este Año</option>
                                <option>Personalizado...</option>
                            </select>
                            
                            ${reportType === 'todos' ? `
                            <select class="select-field" style="width: 200px;">
                                <option>Todos los Odontólogos</option>
                                <option>Dra. María Elena Torres</option>
                            </select>
                            ` : ''}
                        </div>

                        ${this._renderReportContent(reportType)}

                    </div>
                </main>
            </div>
        `;

        // Inicializar gráficos después de renderizar el DOM
        if (reportType === 'todos' || reportType === 'clinicos' || reportType === 'atenciones') {
            setTimeout(() => {
                const chartAtenciones = document.getElementById('chart-atenciones');
                if (chartAtenciones) {
                    chartAtenciones.innerHTML = Charts.barChart({
                        id: 'bar-atenciones',
                        height: 250,
                        color: 'var(--color-tertiary)',
                        data: [
                            { label: 'Ene', value: 120 },
                            { label: 'Feb', value: 145 },
                            { label: 'Mar', value: 130 },
                            { label: 'Abr', value: 160 },
                            { label: 'May', value: 185 },
                            { label: 'Jun', value: 110, active: true } // Mes actual simulado
                        ]
                    });
                }

                if (reportType === 'todos') {
                    const chartIngresos = document.getElementById('chart-ingresos-mensual');
                    if (chartIngresos) {
                        chartIngresos.innerHTML = Charts.barChart({
                            id: 'bar-ingresos',
                            height: 250,
                            color: 'var(--color-primary)',
                            data: [
                                { label: 'Ene', value: 15400, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                                { label: 'Feb', value: 18200, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                                { label: 'Mar', value: 16500, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                                { label: 'Abr', value: 21000, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                                { label: 'May', value: 24500, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                                { label: 'Jun', value: 14200, format: v => `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, active: true }
                            ]
                        });
                    }
                }
            }, 100);
        }
    },

    _renderReportContent(reportType) {
        let content = '';

        // Reportes Financieros (Solo Admin)
        if (reportType === 'todos') {
            content += `
                <h3 class="text-headline-md mb-md mt-xl">Rendimiento Financiero</h3>
                <div class="grid grid-cols-12 gap-lg mb-xl">
                    <div class="col-span-8">
                        <div class="glass-card p-lg h-full">
                            <h3 class="text-headline-sm mb-lg">Ingresos Mensuales</h3>
                            <div id="chart-ingresos-mensual" style="width: 100%;"></div>
                        </div>
                    </div>
                    <div class="col-span-4 flex-col gap-sm">
                        <div class="glass-card p-md" style="border-left: 4px solid var(--color-success);">
                            <p class="text-label-md text-muted mb-xs">Ingresos Proyectados (Mes)</p>
                            <h3 class="text-headline-md text-success">${`S/ ${Number(28000).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}</h3>
                        </div>
                        <div class="glass-card p-md" style="border-left: 4px solid var(--color-warning);">
                            <p class="text-label-md text-muted mb-xs">Cuentas por Cobrar</p>
                            <h3 class="text-headline-md">${`S/ ${Number(3200).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}</h3>
                        </div>
                        <div class="glass-card p-md flex-1">
                            <h4 class="text-label-md text-muted mb-sm">Servicios Más Rentables</h4>
                            <div class="flex justify-between items-center mb-xs border-b pb-xs border-outline-variant">
                                <span class="text-body-sm">Ortodoncia</span>
                                <span class="text-label-md font-semibold">45%</span>
                            </div>
                            <div class="flex justify-between items-center mb-xs border-b pb-xs border-outline-variant">
                                <span class="text-body-sm">Implantes</span>
                                <span class="text-label-md font-semibold">25%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-body-sm">Endodoncia</span>
                                <span class="text-label-md font-semibold">15%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Reportes Clínicos/Atenciones (Admin, Odontólogo, Recepción)
        if (['todos', 'clinicos', 'atenciones'].includes(reportType)) {
            content += `
                <h3 class="text-headline-md mb-md mt-xl">Estadísticas Clínicas</h3>
                <div class="grid grid-cols-12 gap-lg mb-xl">
                    <div class="col-span-8">
                        <div class="glass-card p-lg h-full">
                            <h3 class="text-headline-sm mb-lg">Atenciones por Mes</h3>
                            <div id="chart-atenciones" style="width: 100%;"></div>
                        </div>
                    </div>
                    <div class="col-span-4 flex-col gap-sm">
                        <div class="glass-card p-md">
                            <h4 class="text-label-md text-muted mb-sm">Tasa de Asistencia</h4>
                            <div class="flex items-center gap-md">
                                <div style="position: relative; width: 64px; height: 64px; border-radius: 50%; border: 8px solid var(--color-success); border-right-color: var(--color-surface-container);">
                                    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">85%</div>
                                </div>
                                <div>
                                    <p class="text-body-sm text-success font-semibold">85% Asistieron</p>
                                    <p class="text-body-sm text-error">15% Cancelaron/Faltaron</p>
                                </div>
                            </div>
                        </div>
                        <div class="glass-card p-md flex-1">
                            <h4 class="text-label-md text-muted mb-sm">Tratamientos Frecuentes</h4>
                            <ul class="text-body-sm flex-col gap-xs">
                                <li>1. Limpieza Dental (30%)</li>
                                <li>2. Restauración de Resina (25%)</li>
                                <li>3. Consultas Generales (20%)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }

        // Reportes Inventario (Admin, Almacenero)
        if (['todos', 'inventario'].includes(reportType)) {
            content += `
                <h3 class="text-headline-md mb-md mt-xl">Métricas de Almacén</h3>
                <div class="grid grid-cols-12 gap-lg">
                    <div class="col-span-6">
                        <div class="glass-card p-lg h-full">
                            <h3 class="text-headline-sm mb-md">Consumo de Insumos (Top 5)</h3>
                            ${TableComponent.render({
                id: 'table-consumo',
                columns: [
                    { label: 'Artículo', field: 'nombre' },
                    { label: 'Unidades Usadas (Mes)', field: 'uso', render: v => `<b>${v}</b>` }
                ],
                data: [
                    { nombre: 'Anestesia Local (Cajas)', uso: 12 },
                    { nombre: 'Guantes de Nitrilo (Cajas)', uso: 8 },
                    { nombre: 'Mascarillas N95 (Cajas)', uso: 5 },
                    { nombre: 'Resina Compuesta (Unid)', uso: 4 },
                    { nombre: 'Alginato (Kg)', uso: 2 }
                ]
            })}
                        </div>
                    </div>
                    <div class="col-span-6">
                        <div class="glass-card p-lg h-full" style="border-left: 4px solid var(--color-error);">
                            <h3 class="text-headline-sm mb-md text-error">Alertas de Reposición Urgente</h3>
                            <p class="text-body-sm mb-md">Artículos que han superado el umbral crítico y requieren orden de compra inmediata.</p>
                            <button class="btn btn--primary" onclick="Router.navigate('#/inventario')">Ir a Inventario</button>
                        </div>
                    </div>
                </div>
            `;
        }

        return content;
    }
};
