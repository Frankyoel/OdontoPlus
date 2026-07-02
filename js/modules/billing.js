/* ============================================================
   OdontoPlus — Módulo Facturación (billing.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Billing = {
    render() {
        const container = document.getElementById('app-content');
        const facturas = DataService.getFacturas();
        const canCreate = Permissions.canCreate('facturacion');

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Facturación y Cobros', 'Gestión financiera')}
                    <div class="page-content">
                        
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Registro de Pagos</h1>
                                <p class="text-body-md text-muted">Comprobantes y estado de cuenta</p>
                            </div>
                            <div class="page-header__actions">
                                <div class="input-field--search" style="display: flex; align-items: center; background: white; padding: 8px 16px; border-radius: 20px; border: 1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right: 8px; color: var(--color-outline);">search</span>
                                    <input type="text" id="search-billing" placeholder="Buscar comprobante..." style="border: none; outline: none; background: transparent; width: 250px;" onkeyup="window.Modules.Billing.filterTable()">
                                </div>
                                ${canCreate ? `
                                <button class="btn btn--primary" onclick="window.Modules.Billing.showNewInvoiceModal()">
                                    <span class="material-symbols-outlined">receipt_long</span>
                                    Nuevo Cobro
                                </button>
                                ` : ''}
                            </div>
                        </div>

                        <div class="glass-card p-lg mb-xl">
                            ${TableComponent.render({
                                id: 'billing-table',
                                columns: [
                                    { label: 'Nº Boleta', field: 'numero', render: v => `<span class="font-mono font-semibold">${v}</span>` },
                                    { label: 'Paciente', field: 'pacienteNombre' },
                                    { label: 'Emisión', field: 'fechaEmision', render: v => Models.formatDate(v) },
                                    { label: 'Monto Total', field: 'total', render: v => `<span class="font-semibold">${Models.formatMoney(v)}</span>` },
                                    { label: 'Método', field: 'metodoPago', render: v => Models.METODOS_PAGO[v] || v },
                                    { label: 'Estado', field: 'estado', render: v => TableComponent.renderStatus(v) },
                                    { label: 'Acciones', field: 'id', render: (id, item) => `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="window.Modules.Billing.printInvoice('${id}')" title="Imprimir Boleta">
                                            <span class="material-symbols-outlined">print</span>
                                        </button>
                                        ${item.estado === 'pendiente' && Permissions.canEdit('facturacion') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-success);" onclick="window.Modules.Billing.markAsPaid('${id}')" title="Marcar Pagado">
                                            <span class="material-symbols-outlined">check_circle</span>
                                        </button>
                                        ` : ''}
                                        ${item.estado !== 'anulado' && Permissions.canEdit('facturacion') ? `
                                        <button class="btn--icon-sm" style="color: var(--color-error);" onclick="window.Modules.Billing.voidInvoice('${id}')" title="Anular Boleta">
                                            <span class="material-symbols-outlined">do_not_disturb_on</span>
                                        </button>
                                        ` : ''}
                                    ` }
                                ],
                                data: facturas.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision))
                            })}
                        </div>
                        
                    </div>
                </main>
            </div>
        `;
    },

    filterTable() {
        const query = document.getElementById('search-billing').value.toLowerCase();
        const rows = document.querySelectorAll('#billing-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    },

    showNewInvoiceModal() {
        const pacientes = DataService.getPacientes().filter(p => p.activo);
        
        Modal.form({
            title: 'Registrar Nuevo Cobro (Boleta)',
            submitText: 'Generar Boleta',
            fields: [
                { name: 'pacienteId', label: 'Paciente', type: 'select', options: pacientes.map(p => ({ value: p.id, label: p.nombreCompleto })), required: true },
                { name: 'descripcion', label: 'Descripción del Servicio', required: true },
                { name: 'precio', label: 'Monto Total (S/)', type: 'number', required: true },
                { name: 'metodoPago', label: 'Método de Pago', type: 'select', options: Object.keys(Models.METODOS_PAGO).map(k => ({ value: k, label: Models.METODOS_PAGO[k] })), required: true },
                { name: 'estado', label: 'Estado del Pago', type: 'select', options: [
                    {value: 'pagado', label: 'Pagado Completamente'},
                    {value: 'pendiente', label: 'Pendiente de Pago'}
                ], required: true }
            ],
            onSubmit: (data) => {
                const paciente = pacientes.find(p => p.id === data.pacienteId);
                const precio = parseFloat(data.precio);
                
                const factura = DataService.createFactura({
                    pacienteId: paciente.id,
                    pacienteNombre: paciente.nombreCompleto,
                    items: [{ descripcion: data.descripcion, cantidad: 1, precio: precio }],
                    descuento: 0,
                    metodoPago: data.metodoPago
                });
                
                // Si lo marcó como pagado, actualizar estado
                if (data.estado === 'pagado') {
                    DataService.updateFactura(factura.id, { 
                        estado: 'pagado', 
                        fechaPago: new Date().toISOString() 
                    });
                }
                
                Toast.success(`Boleta ${factura.numero} generada con éxito`);
                this.render();
            }
        });
    },

    markAsPaid(id) {
        Modal.confirm({
            title: 'Confirmar Pago',
            message: '¿Confirmas que el paciente ha cancelado el monto total de esta boleta?',
            confirmText: 'Sí, marcar como pagado',
            onConfirm: () => {
                DataService.updateFactura(id, { 
                    estado: 'pagado',
                    fechaPago: new Date().toISOString()
                });
                Toast.success('Pago registrado correctamente');
                this.render();
            }
        });
    },

    printInvoice(id) {
        const factura = DataService.getFactura(id);
        if (!factura) return;

        const itemsHtml = factura.items.map(item => `
            <tr style="border-bottom: 1px solid var(--color-outline-variant);">
                <td style="padding: var(--space-xs) 0;">${item.descripcion}</td>
                <td style="padding: var(--space-xs) 0; text-align: center;">${item.cantidad}</td>
                <td style="padding: var(--space-xs) 0; text-align: right;">${Models.formatMoney(item.precio)}</td>
                <td style="padding: var(--space-xs) 0; text-align: right;">${Models.formatMoney(item.precio * item.cantidad)}</td>
            </tr>
        `).join('');

        const contentHtml = `
            <div id="invoice-print-area" style="padding: var(--space-md); background: white; color: black; font-family: monospace; border: 1px solid var(--color-outline-variant); border-radius: var(--radius-md); max-height: 400px; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: var(--space-md);">
                    <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: var(--color-primary);">OdontoPlus</h3>
                    <p style="margin: 0; font-size: 11px;">RUC: 20123456789</p>
                    <p style="margin: 0; font-size: 11px;">Av. Javier Prado Este 1234, San Isidro, Lima</p>
                    <p style="margin: 0; font-size: 11px;">Telf: (01) 444-5555</p>
                </div>
                <div style="margin-bottom: var(--space-sm); font-size: 12px; border-bottom: 1px dashed black; padding-bottom: var(--space-xs);">
                    <div><b>BOLETA DE VENTA ELECTRÓNICA:</b> ${factura.numero}</div>
                    <div><b>Fecha de Emisión:</b> ${Models.formatDateTime(factura.fechaEmision)}</div>
                    ${factura.fechaPago ? `<div><b>Fecha de Pago:</b> ${Models.formatDateTime(factura.fechaPago)}</div>` : ''}
                    <div><b>Estado:</b> <span style="text-transform: uppercase; font-weight: bold; color: ${factura.estado === 'pagado' ? 'var(--color-success)' : (factura.estado === 'anulado' ? 'var(--color-error)' : 'var(--color-warning)')}">${factura.estado}</span></div>
                </div>
                <div style="margin-bottom: var(--space-sm); font-size: 12px; border-bottom: 1px dashed black; padding-bottom: var(--space-xs);">
                    <div><b>Paciente:</b> ${factura.pacienteNombre}</div>
                    <div><b>Método de Pago:</b> ${Models.METODOS_PAGO[factura.metodoPago] || factura.metodoPago}</div>
                </div>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: var(--space-sm);">
                    <thead>
                        <tr style="border-bottom: 1px solid black; font-weight: bold;">
                            <th style="text-align: left; padding-bottom: 4px;">Descripción</th>
                            <th style="text-align: center; padding-bottom: 4px;">Cant</th>
                            <th style="text-align: right; padding-bottom: 4px;">P. Unit</th>
                            <th style="text-align: right; padding-bottom: 4px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div style="border-top: 1px dashed black; padding-top: var(--space-xs); font-size: 11px; text-align: right; display: flex; flex-direction: column; gap: 2px;">
                    <div>Subtotal: ${Models.formatMoney(factura.subtotal)}</div>
                    <div>Descuento: ${Models.formatMoney(factura.descuento)}</div>
                    <div style="font-size: 13px; font-weight: bold; margin-top: 2px; border-top: 1px solid black; padding-top: 2px;">TOTAL: ${Models.formatMoney(factura.total)}</div>
                </div>
            </div>
        `;

        Modal.open({
            title: `Visualizar Boleta ${factura.numero}`,
            content: contentHtml,
            footer: `
                <button class="btn btn--secondary" onclick="Modal.close()">Cerrar</button>
                <button class="btn btn--primary" onclick="window.print()">
                    <span class="material-symbols-outlined" style="font-size: 16px; margin-right: 4px;">print</span>
                    Imprimir / PDF
                </button>
            `,
            size: 'md'
        });
    },

    voidInvoice(id) {
        const factura = DataService.getFactura(id);
        if (!factura) return;

        Modal.confirm({
            title: 'Anular Boleta de Venta',
            message: `¿Estás seguro de que deseas anular la boleta ${factura.numero}? Esta acción cancelará el ingreso financiero y no se puede deshacer.`,
            confirmText: 'Sí, anular boleta',
            variant: 'danger',
            onConfirm: () => {
                DataService.updateFactura(id, { estado: 'anulado' });
                Toast.success(`Boleta ${factura.numero} anulada correctamente`);
                this.render();
            }
        });
    }
};
