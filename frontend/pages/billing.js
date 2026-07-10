/* ============================================================
   OdontoPlus — Módulo Facturación (billing.js)
   Usa BillingService (API real)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Billing = {

    _fmt: {
        date: (v) => v ? new Date(v).toLocaleDateString('es-PE') : '-',
        datetime: (v) => v ? new Date(v).toLocaleString('es-PE') : '-',
        money: (v) => `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        status: (v) => {
            const colors = { 'pagado': 'success', 'pendiente': 'warning', 'anulado': 'error' };
            const labels = { 'pagado': 'Pagado', 'pendiente': 'Pendiente', 'anulado': 'Anulado' };
            return `<span class="chip chip--${colors[v] || 'outline'}">${labels[v] || v}</span>`;
        },
        metodos: { 'efectivo': 'Efectivo', 'tarjeta': 'Tarjeta', 'transferencia': 'Transferencia', 'yape_plin': 'Yape / Plin' }
    },

    async render() {
        const container = document.getElementById('app-content');
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
                                <div class="input-field--search" style="display:flex;align-items:center;background:white;padding:8px 16px;border-radius:20px;border:1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right:8px;color:var(--color-outline);">search</span>
                                    <input type="text" id="search-billing" placeholder="Buscar comprobante..." style="border:none;outline:none;background:transparent;width:250px;" onkeyup="window.Modules.Billing.filterTable()">
                                </div>
                                ${canCreate ? `<button class="btn btn--primary" onclick="window.Modules.Billing.showNewInvoiceModal()">
                                    <span class="material-symbols-outlined">receipt_long</span> Nuevo Cobro
                                </button>` : ''}
                            </div>
                        </div>
                        <div class="glass-card p-lg mb-xl" id="billing-content-wrapper">
                            <div class="flex items-center justify-center" style="height:300px;">
                                <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>`;

        try {
            const facturas = await BillingService.getAll();
            const wrapper = document.getElementById('billing-content-wrapper');
            if (wrapper) {
                // sort by date desc
                facturas.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
                wrapper.innerHTML = TableComponent.render({
                    id: 'billing-table',
                    columns: [
                        { label: 'Nº Boleta', field: 'numero', render: v => `<span class="font-mono font-semibold">${v}</span>` },
                        { label: 'Paciente', field: 'pacienteNombre', render: (v, item) => item.paciente ? `${item.paciente.nombre} ${item.paciente.apellido}` : (v || 'Sin Asignar') },
                        { label: 'Emisión', field: 'fechaEmision', render: v => this._fmt.date(v) },
                        { label: 'Monto Total', field: 'total', render: v => `<span class="font-semibold">${this._fmt.money(v)}</span>` },
                        { label: 'Método', field: 'metodoPago', render: v => this._fmt.metodos[v] || v },
                        { label: 'Estado', field: 'estado', render: v => this._fmt.status(v) },
                        {
                            label: 'Acciones', field: 'id', render: (id, item) => `
                            <button class="btn--icon-sm" style="color:var(--color-primary);" onclick="window.Modules.Billing.printInvoice('${id}')" title="Imprimir Boleta"><span class="material-symbols-outlined">print</span></button>
                            ${item.estado === 'pendiente' && Permissions.canEdit('facturacion') ? `
                            <button class="btn--icon-sm" style="color:var(--color-success);" onclick="window.Modules.Billing.markAsPaid('${id}')" title="Marcar Pagado"><span class="material-symbols-outlined">check_circle</span></button>
                            ` : ''}
                            ${item.estado !== 'anulado' && Permissions.canEdit('facturacion') ? `
                            <button class="btn--icon-sm" style="color:var(--color-error);" onclick="window.Modules.Billing.voidInvoice('${id}')" title="Anular Boleta"><span class="material-symbols-outlined">do_not_disturb_on</span></button>
                            ` : ''}
                        `}
                    ],
                    data: facturas
                });
            }
        } catch (_) { }
    },

    filterTable() {
        const query = document.getElementById('search-billing').value.toLowerCase();
        document.querySelectorAll('#billing-table tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    },

    async showNewInvoiceModal() {
        let pacientes = [];
        try {
            pacientes = await PatientService.getAll();
        } catch (_) { return; }

        Modal.form({
            title: 'Registrar Nuevo Cobro (Boleta)', submitText: 'Generar Boleta',
            fields: [
                { name: 'pacienteId', label: 'Paciente', type: 'select', options: pacientes.map(p => ({ value: p.id, label: `${p.nombre} ${p.apellido}` })), required: true },
                { name: 'descripcion', label: 'Descripción del Servicio', required: true },
                { name: 'precio', label: 'Monto Total (S/)', type: 'number', required: true },
                { name: 'metodoPago', label: 'Método de Pago', type: 'select', options: Object.keys(this._fmt.metodos).map(k => ({ value: k, label: this._fmt.metodos[k] })), required: true },
                { name: 'estado', label: 'Estado del Pago', type: 'select', options: [{ value: 'pagado', label: 'Pagado Completamente' }, { value: 'pendiente', label: 'Pendiente de Pago' }], required: true }
            ],
            onSubmit: async (data) => {
                const precio = parseFloat(data.precio);
                const paciente = pacientes.find(p => p.id == data.pacienteId);
                try {
                    let factura = await BillingService.create({
                        pacienteId: paciente.id,
                        pacienteNombre: `${paciente.nombre} ${paciente.apellido}`,
                        detalles: [{ descripcion: data.descripcion, cantidad: 1, precio: precio }],
                        items: [{ descripcion: data.descripcion, cantidad: 1, precio: precio }],
                        descuento: 0,
                        metodoPago: data.metodoPago
                    });

                    if (data.estado === 'pagado') {
                        await BillingService.marcarPagada(factura.id, data.metodoPago);
                    }

                    Toast.success('Boleta generada con éxito');
                    this.render();
                } catch (_) { }
            }
        });
    },

    markAsPaid(id) {
        Modal.confirm({
            title: 'Confirmar Pago', message: '¿El paciente ha cancelado el monto total?', confirmText: 'Sí, marcar como pagado',
            onConfirm: async () => {
                try {
                    await BillingService.marcarPagada(id, 'efectivo'); // Default if not specified
                    Toast.success('Pago registrado correctamente');
                    this.render();
                } catch (_) { }
            }
        });
    },

    async printInvoice(id) {
        let factura;
        try { 
            factura = await BillingService.getById(id); 
        } catch (err) { 
            console.error("Error cargando factura:", err);
            Toast.error("Error al cargar detalles de la boleta");
            return; 
        }

        const contentHtml = `
            <div style="padding:var(--space-md);background:white;color:black;font-family:monospace;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);max-height:400px;overflow-y:auto;">
                <div style="text-align:center;margin-bottom:var(--space-md);">
                    <h3 style="margin:0;font-size:18px;font-weight:bold;color:var(--color-primary);">OdontoPlus</h3>
                    <p style="margin:0;font-size:11px;">RUC: 20123456789</p>
                    <p style="margin:0;font-size:11px;">Av. Javier Prado Este 1234, Lima</p>
                </div>
                <div style="margin-bottom:var(--space-sm);font-size:12px;border-bottom:1px dashed black;padding-bottom:var(--space-xs);">
                    <div><b>BOLETA DE VENTA:</b> ${factura.numero}</div>
                    <div><b>Fecha Emisión:</b> ${this._fmt.datetime(factura.fechaEmision)}</div>
                    <div><b>Estado:</b> <span style="text-transform:uppercase;font-weight:bold;">${factura.estado}</span></div>
                </div>
                <div style="margin-bottom:var(--space-sm);font-size:12px;border-bottom:1px dashed black;padding-bottom:var(--space-xs);">
                    <div><b>Paciente:</b> ${factura.paciente ? `${factura.paciente.nombre} ${factura.paciente.apellido}` : (factura.pacienteNombre || 'Sin Asignar')}</div>
                    <div><b>Pago:</b> ${this._fmt.metodos[factura.metodoPago] || factura.metodoPago}</div>
                </div>
                <table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:var(--space-sm);">
                    <tr style="border-bottom:1px solid black;font-weight:bold;">
                        <th style="text-align:left;">Desc</th><th style="text-align:center;">Cant</th><th style="text-align:right;">Total</th>
                    </tr>
                    ${(factura.detalles || factura.items || []).map(item => `
                    <tr style="border-bottom:1px solid var(--color-outline-variant);">
                        <td>${item.descripcion}</td><td style="text-align:center;">${item.cantidad}</td><td style="text-align:right;">${this._fmt.money(item.precio * item.cantidad)}</td>
                    </tr>`).join('')}
                </table>
                <div style="text-align:right;font-size:11px;">
                    <div style="font-size:13px;font-weight:bold;margin-top:2px;border-top:1px solid black;padding-top:2px;">TOTAL: ${this._fmt.money(factura.total)}</div>
                </div>
            </div>`;

        Modal.open({
            title: `Boleta ${factura.numero}`, content: contentHtml, size: 'md',
            footer: `<button class="btn btn--secondary" onclick="Modal.close()">Cerrar</button><button class="btn btn--primary" onclick="window.print()">Imprimir</button>`
        });
    },

    voidInvoice(id) {
        Modal.confirm({
            title: 'Anular Boleta', message: '¿Anular boleta de venta?', confirmText: 'Sí, anular', variant: 'danger',
            onConfirm: async () => {
                try {
                    await BillingService.update(id, { estado: 'anulado' });
                    Toast.success('Boleta anulada');
                    this.render();
                } catch (_) { }
            }
        });
    }
};
