/* ============================================================
   OdontoPlus — Módulo Inventario (inventory.js)
   Usa InventoryService (API real)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Inventory = {
    currentCategoryFilter: '',
    currentStateFilter: '',

    _fmt: {
        money: (v) => `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        status: (v) => {
            const colors = { 'optimo': 'success', 'bajo': 'warning', 'critico': 'error' };
            const labels = { 'optimo': 'Óptimo', 'bajo': 'Stock Bajo', 'critico': 'Crítico' };
            return `<span class="chip chip--${colors[v] || 'outline'}">${labels[v] || v}</span>`;
        },
        calcularEstado: (actual, minimo) => {
            if (actual <= minimo) return 'critico';
            if (actual <= minimo * 2) return 'bajo';
            return 'optimo';
        }
    },

    async render() {
        const container = document.getElementById('app-content');
        const canEdit = Permissions.canEdit('inventario');

        container.innerHTML = `
            <div class="app">
                ${Sidebar.render()}
                <main class="main-content">
                    ${Topbar.render('Inventario y Almacén', 'Control de stock y proveedores')}
                    <div class="page-content">
                        <div class="page-header--row">
                            <div>
                                <h1 class="text-headline-lg">Control de Inventario</h1>
                                <p class="text-body-md text-muted">Gestión de insumos médicos y materiales</p>
                            </div>
                            <div class="page-header__actions">
                                <div class="input-field--search" style="display:flex;align-items:center;background:white;padding:8px 16px;border-radius:20px;border:1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right:8px;color:var(--color-outline);">search</span>
                                    <input type="text" id="search-inventory" placeholder="Buscar por SKU o nombre..." style="border:none;outline:none;background:transparent;width:250px;" onkeyup="window.Modules.Inventory.filterTable()">
                                </div>
                                ${canEdit ? `<button class="btn btn--primary" onclick="window.Modules.Inventory.showNewItemModal()">
                                    <span class="material-symbols-outlined">add_box</span> Nuevo Artículo
                                </button>` : ''}
                            </div>
                        </div>
                        
                        <div id="inventory-content-wrapper">
                            <div class="flex items-center justify-center" style="height:300px;">
                                <span class="material-symbols-outlined" style="font-size:48px;animation:spin 1s linear infinite;color:var(--color-primary);">autorenew</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>`;

        try {
            let [inventario, proveedores] = await Promise.all([
                InventoryService.getAll(),
                InventoryService.getProveedores()
            ]);

            const stats = {
                total: inventario.length,
                valor: inventario.reduce((sum, i) => sum + (i.stockActual * i.precioUnitario), 0),
                critico: inventario.filter(i => i.estado === 'critico').length
            };

            if (this.currentCategoryFilter) inventario = inventario.filter(i => i.categoria === this.currentCategoryFilter);
            if (this.currentStateFilter) inventario = inventario.filter(i => i.estado === this.currentStateFilter);

            const wrapper = document.getElementById('inventory-content-wrapper');
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="grid grid-cols-3 gap-lg mb-lg">
                        <div class="kpi-card glass-card--flat">
                            <div class="flex justify-between items-center mb-md">
                                <span class="text-label-md text-muted uppercase">Total Artículos</span>
                                <div class="kpi-card__icon kpi-card__icon--primary" style="width:32px;height:32px;"><span class="material-symbols-outlined" style="font-size:18px;">category</span></div>
                            </div>
                            <h3 class="text-headline-lg">${stats.total}</h3>
                        </div>
                        <div class="kpi-card glass-card--flat">
                            <div class="flex justify-between items-center mb-md">
                                <span class="text-label-md text-muted uppercase">Valor Estimado</span>
                                <div class="kpi-card__icon kpi-card__icon--secondary" style="width:32px;height:32px;"><span class="material-symbols-outlined" style="font-size:18px;">monetization_on</span></div>
                            </div>
                            <h3 class="text-headline-lg">${this._fmt.money(stats.valor)}</h3>
                        </div>
                        <div class="kpi-card glass-card--flat" style="border-left: 4px solid var(--color-error);">
                            <div class="flex justify-between items-center mb-md">
                                <span class="text-label-md text-muted uppercase">Stock Crítico</span>
                                <div class="kpi-card__icon kpi-card__icon--error" style="width:32px;height:32px;"><span class="material-symbols-outlined" style="font-size:18px;">warning</span></div>
                            </div>
                            <h3 class="text-headline-lg text-error">${stats.critico}</h3>
                        </div>
                    </div>

                    <div class="glass-card p-lg mb-xl">
                        <div class="flex justify-between items-center mb-md">
                            <div class="tabs" style="border-bottom:none;gap:var(--space-sm);">
                                <button class="chip ${(!this.currentCategoryFilter && !this.currentStateFilter) ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('')">Todos</button>
                                <button class="chip ${this.currentCategoryFilter === 'insumos_clinicos' ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('insumos_clinicos')">Insumos Clínicos</button>
                                <button class="chip ${this.currentCategoryFilter === 'odontologia' ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('odontologia')">Odontología</button>
                                <button class="chip ${this.currentStateFilter === 'critico' ? 'chip--error' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByState('critico')">Críticos</button>
                            </div>
                        </div>
                        
                        ${TableComponent.render({
                    id: 'inventory-table',
                    columns: [
                        { label: 'SKU', field: 'sku', render: v => `<span class="text-muted font-mono">${v || ''}</span>` },
                        { label: 'Artículo', field: 'nombre', render: (v, item) => `<div class="font-semibold truncate" style="max-width:250px;" title="${v}">${v}</div><div class="text-body-sm text-muted">${item.categoria}</div>` },
                        { label: 'Stock', field: 'stockActual', render: (v, item) => `<div class="font-semibold text-lg" style="color:${item.estado === 'critico' ? 'var(--color-error)' : 'inherit'};">${v} <span class="text-body-sm text-muted font-normal">${item.unidad}</span></div>` },
                        { label: 'Estado', field: 'estado', render: v => this._fmt.status(v) },
                        { label: 'Ubicación', field: 'ubicacion' },
                        {
                            label: 'Acciones', field: 'id', render: id => canEdit ? `
                                    <button class="btn--icon-sm" style="color:var(--color-primary);" onclick="window.Modules.Inventory.showAddStockModal('${id}')" title="Añadir Stock"><span class="material-symbols-outlined">add_circle</span></button>
                                    <button class="btn--icon-sm" style="color:var(--color-tertiary);" onclick="window.Modules.Inventory.showRemoveStockModal('${id}')" title="Descontar Stock"><span class="material-symbols-outlined">remove_circle</span></button>
                                    <button class="btn--icon-sm" style="color:var(--color-on-surface-variant);" onclick="window.Modules.Inventory.showEditItemModal('${id}')" title="Editar"><span class="material-symbols-outlined">edit</span></button>
                                    <button class="btn--icon-sm" style="color:var(--color-error);" onclick="window.Modules.Inventory.deleteItem('${id}')" title="Eliminar"><span class="material-symbols-outlined">delete</span></button>
                                ` : `
                                    <button class="btn--icon-sm" style="color:var(--color-primary);" onclick="Toast.success('Solicitud enviada')" title="Solicitar"><span class="material-symbols-outlined">pan_tool</span></button>
                                `}
                    ],
                    data: inventario
                })}
                    </div>
                    
                    ${canEdit ? `<div class="glass-card p-lg">
                        <h3 class="text-headline-sm mb-md">Directorio de Proveedores</h3>
                        ${TableComponent.render({
                    id: 'suppliers-table',
                    columns: [
                        { label: 'Proveedor', field: 'nombre', render: (v, item) => `<div class="font-semibold">${v}</div><div class="text-body-sm text-muted">RUC: ${item.ruc || '-'}</div>` },
                        { label: 'Contacto', field: 'contacto' },
                        { label: 'Teléfono', field: 'telefono' },
                        { label: 'Email', field: 'email' },
                        { label: 'Acciones', field: 'id', render: () => `<button class="btn--icon-sm" style="color:var(--color-on-surface-variant);"><span class="material-symbols-outlined">visibility</span></button>` }
                    ],
                    data: proveedores
                })}
                    </div>` : ''}
                `;
            }
        } catch (_) { }
    },

    filterTable() {
        const query = document.getElementById('search-inventory').value.toLowerCase();
        document.querySelectorAll('#inventory-table tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    },

    filterByCategory(cat) {
        this.currentCategoryFilter = cat; this.currentStateFilter = ''; this.render();
    },

    filterByState(state) {
        this.currentStateFilter = state; this.currentCategoryFilter = ''; this.render();
    },

    async showNewItemModal() {
        let proveedores = [];
        try { proveedores = await InventoryService.getProveedores(); } catch (_) { }

        Modal.form({
            title: 'Nuevo Artículo',
            fields: [
                { name: 'nombre', label: 'Nombre', required: true },
                { name: 'categoria', label: 'Categoría', type: 'select', options: [{ value: 'insumos_clinicos', label: 'Insumos' }, { value: 'odontologia', label: 'Odontología' }, { value: 'oficina', label: 'Oficina' }], required: true },
                { name: 'unidad', label: 'Unidad', type: 'select', options: [{ value: 'unidad', label: 'Unidad' }, { value: 'caja', label: 'Caja' }, { value: 'litro', label: 'Litro' }], required: true },
                { name: 'stockActual', label: 'Stock Inicial', type: 'number', required: true },
                { name: 'stockMinimo', label: 'Stock Mínimo', type: 'number', required: true },
                { name: 'precioUnitario', label: 'Costo(S/)', type: 'number', required: true },
                { name: 'proveedor', label: 'Proveedor', type: 'select', options: proveedores.map(p => ({ value: p.nombre, label: p.nombre })) },
                { name: 'ubicacion', label: 'Ubicación' }
            ],
            onSubmit: async (data) => {
                data.stockActual = parseInt(data.stockActual, 10);
                data.stockMinimo = parseInt(data.stockMinimo, 10);
                data.precioUnitario = parseFloat(data.precioUnitario);

                try {
                    await InventoryService.create(data);
                    Toast.success('Artículo creado');
                    this.render();
                } catch (_) { }
            }
        });
    },

    async showEditItemModal(id) {
        let item, proveedores = [];
        try {
            [item, proveedores] = await Promise.all([InventoryService.getById(id), InventoryService.getProveedores()]);
        } catch (_) { return; }

        Modal.form({
            title: 'Editar Artículo',
            fields: [
                { name: 'sku', label: 'SKU', value: item.sku, readOnly: true },
                { name: 'nombre', label: 'Nombre', value: item.nombre, required: true },
                { name: 'categoria', label: 'Categoría', type: 'select', options: [{ value: 'insumos_clinicos', label: 'Insumos' }, { value: 'odontologia', label: 'Odontología' }, { value: 'oficina', label: 'Oficina' }], value: item.categoria, required: true },
                { name: 'unidad', label: 'Unidad', type: 'select', options: [{ value: 'unidad', label: 'Unidad' }, { value: 'caja', label: 'Caja' }, { value: 'litro', label: 'Litro' }], value: item.unidad, required: true },
                { name: 'stockMinimo', label: 'Stock Mínimo', type: 'number', value: item.stockMinimo, required: true },
                { name: 'precioUnitario', label: 'Costo(S/)', type: 'number', value: item.precioUnitario, required: true },
                { name: 'proveedor', label: 'Proveedor', type: 'select', options: proveedores.map(p => ({ value: p.nombre, label: p.nombre })), value: item.proveedor },
                { name: 'ubicacion', label: 'Ubicación', value: item.ubicacion }
            ],
            onSubmit: async (data) => {
                data.stockMinimo = parseInt(data.stockMinimo, 10);
                data.precioUnitario = parseFloat(data.precioUnitario);
                data.estado = this._fmt.calcularEstado(item.stockActual, data.stockMinimo);

                try {
                    await InventoryService.update(id, data);
                    Toast.success('Artículo actualizado');
                    this.render();
                } catch (_) { }
            }
        });
    },

    deleteItem(id) {
        Modal.confirm({
            title: 'Eliminar', message: '¿Eliminar artículo?', confirmText: 'Sí', variant: 'danger',
            onConfirm: async () => {
                try {
                    await InventoryService.delete(id);
                    Toast.success('Artículo eliminado');
                    this.render();
                } catch (_) { }
            }
        });
    },

    showRemoveStockModal(id) {
        InventoryService.getById(id).then(item => {
            if (!item) return;
            Modal.form({
                title: `Descontar Stock: ${item.nombre}`, submitText: 'Registrar',
                fields: [
                    { name: 'cantidad', label: `Cantidad a retirar`, type: 'number', required: true },
                    { name: 'motivo', label: 'Motivo', type: 'select', options: [{ value: 'consumo', label: 'Consumo' }, { value: 'merma', label: 'Merma' }, { value: 'vencido', label: 'Vencimiento' }] }
                ],
                onSubmit: async (data) => {
                    const cant = parseInt(data.cantidad, 10);
                    if (cant > item.stockActual) return Toast.error('Error: Retiro mayor al stock actual');
                    const nuevo = item.stockActual - cant;
                    try {
                        await InventoryService.update(id, { stockActual: nuevo, estado: this._fmt.calcularEstado(nuevo, item.stockMinimo) });
                        Toast.success(`Stock actualizado. Quedan ${nuevo}`);
                        this.render();
                    } catch (_) { }
                }
            });
        });
    },

    showAddStockModal(id) {
        InventoryService.getById(id).then(item => {
            if (!item) return;
            Modal.form({
                title: `Añadir Stock: ${item.nombre}`, submitText: 'Registrar',
                fields: [
                    { name: 'cantidad', label: `Cantidad a ingresar`, type: 'number', required: true },
                    { name: 'lote', label: 'Lote / Guía' }
                ],
                onSubmit: async (data) => {
                    const cant = parseInt(data.cantidad, 10);
                    const nuevo = item.stockActual + cant;
                    try {
                        await InventoryService.update(id, { stockActual: nuevo, estado: this._fmt.calcularEstado(nuevo, item.stockMinimo) });
                        Toast.success(`Stock actualizado. Total: ${nuevo}`);
                        this.render();
                    } catch (_) { }
                }
            });
        });
    }
};
