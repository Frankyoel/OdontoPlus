/* ============================================================
   OdontoPlus — Módulo Inventario (inventory.js)
   ============================================================ */

window.Modules = window.Modules || {};

window.Modules.Inventory = {
    currentCategoryFilter: '',
    currentStateFilter: '',

    render() {
        const container = document.getElementById('app-content');
        let inventario = DataService.getInventario();
        
        // Aplicar filtros
        if (this.currentCategoryFilter) {
            inventario = inventario.filter(i => i.categoria === this.currentCategoryFilter);
        }
        if (this.currentStateFilter) {
            inventario = inventario.filter(i => i.estado === this.currentStateFilter);
        }

        const proveedores = DataService.getProveedores();
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
                                <div class="input-field--search" style="display: flex; align-items: center; background: white; padding: 8px 16px; border-radius: 20px; border: 1px solid var(--color-outline-variant);">
                                    <span class="material-symbols-outlined" style="margin-right: 8px; color: var(--color-outline);">search</span>
                                    <input type="text" id="search-inventory" placeholder="Buscar por SKU o nombre..." style="border: none; outline: none; background: transparent; width: 250px;" onkeyup="window.Modules.Inventory.filterTable()">
                                </div>
                                ${canEdit ? `
                                <button class="btn btn--primary" onclick="window.Modules.Inventory.showNewItemModal()">
                                    <span class="material-symbols-outlined">add_box</span>
                                    Nuevo Artículo
                                </button>
                                ` : ''}
                            </div>
                        </div>

                        <!-- KPIs de Inventario -->
                        <div class="grid grid-cols-3 gap-lg mb-lg">
                            <div class="kpi-card glass-card--flat">
                                <div class="flex justify-between items-center mb-md">
                                    <span class="text-label-md text-muted uppercase">Total Artículos</span>
                                    <div class="kpi-card__icon kpi-card__icon--primary" style="width: 32px; height: 32px;"><span class="material-symbols-outlined" style="font-size: 18px;">category</span></div>
                                </div>
                                <h3 class="text-headline-lg">${inventario.length}</h3>
                            </div>
                            <div class="kpi-card glass-card--flat">
                                <div class="flex justify-between items-center mb-md">
                                    <span class="text-label-md text-muted uppercase">Valor Estimado</span>
                                    <div class="kpi-card__icon kpi-card__icon--secondary" style="width: 32px; height: 32px;"><span class="material-symbols-outlined" style="font-size: 18px;">monetization_on</span></div>
                                </div>
                                <h3 class="text-headline-lg">${Models.formatMoney(inventario.reduce((sum, i) => sum + (i.stockActual * i.precioUnitario), 0))}</h3>
                            </div>
                            <div class="kpi-card glass-card--flat" style="border-left: 4px solid var(--color-error);">
                                <div class="flex justify-between items-center mb-md">
                                    <span class="text-label-md text-muted uppercase">Stock Crítico</span>
                                    <div class="kpi-card__icon kpi-card__icon--error" style="width: 32px; height: 32px;"><span class="material-symbols-outlined" style="font-size: 18px;">warning</span></div>
                                </div>
                                <h3 class="text-headline-lg text-error">${inventario.filter(i => i.estado === 'critico').length}</h3>
                            </div>
                        </div>

                        <div class="glass-card p-lg mb-xl">
                            <div class="flex justify-between items-center mb-md">
                                <div class="tabs" style="border-bottom: none; gap: var(--space-sm);">
                                    <button class="chip ${(!this.currentCategoryFilter && !this.currentStateFilter) ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('')">Todos</button>
                                    <button class="chip ${this.currentCategoryFilter === 'insumos_clinicos' ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('insumos_clinicos')">Insumos Clínicos</button>
                                    <button class="chip ${this.currentCategoryFilter === 'odontologia' ? 'chip--primary' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByCategory('odontologia')">Odontología</button>
                                    <button class="chip ${this.currentStateFilter === 'critico' ? 'chip--error' : 'chip--outline'}" onclick="window.Modules.Inventory.filterByState('critico')">Críticos</button>
                                </div>
                            </div>
                            
                            ${TableComponent.render({
                                id: 'inventory-table',
                                columns: [
                                    { label: 'SKU', field: 'sku', render: v => `<span class="text-muted font-mono">${v}</span>` },
                                    { label: 'Artículo', field: 'nombre', render: (v, item) => `
                                        <div class="font-semibold truncate" style="max-width: 250px;" title="${v}">${v}</div>
                                        <div class="text-body-sm text-muted">${Models.CATEGORIAS_INVENTARIO[item.categoria] || item.categoria}</div>
                                    ` },
                                    { label: 'Stock', field: 'stockActual', render: (v, item) => `
                                        <div class="font-semibold text-lg" style="color: ${item.estado === 'critico' ? 'var(--color-error)' : 'inherit'};">
                                            ${v} <span class="text-body-sm text-muted font-normal">${item.unidad}</span>
                                        </div>
                                    ` },
                                    { label: 'Estado', field: 'estado', render: v => TableComponent.renderStatus(v) },
                                    { label: 'Ubicación', field: 'ubicacion' },
                                    { label: 'Acciones', field: 'id', render: (id) => `
                                        ${canEdit ? `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="window.Modules.Inventory.showAddStockModal('${id}')" title="Añadir Stock">
                                            <span class="material-symbols-outlined">add_circle</span>
                                        </button>
                                        <button class="btn--icon-sm" style="color: var(--color-tertiary);" onclick="window.Modules.Inventory.showRemoveStockModal('${id}')" title="Descontar Stock">
                                            <span class="material-symbols-outlined">remove_circle</span>
                                        </button>
                                        <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" onclick="window.Modules.Inventory.showEditItemModal('${id}')" title="Editar">
                                            <span class="material-symbols-outlined">edit</span>
                                        </button>
                                        <button class="btn--icon-sm" style="color: var(--color-error);" onclick="window.Modules.Inventory.deleteItem('${id}')" title="Eliminar Artículo">
                                            <span class="material-symbols-outlined">delete</span>
                                        </button>
                                        ` : `
                                        <button class="btn--icon-sm" style="color: var(--color-primary);" onclick="Toast.success('Solicitud de reposición enviada al almacén')" title="Solicitar">
                                            <span class="material-symbols-outlined">pan_tool</span>
                                        </button>
                                        `}
                                    ` }
                                ],
                                data: inventario
                            })}
                        </div>
                        
                        <!-- Proveedores (Solo Almacenero/Admin) -->
                        ${canEdit ? `
                        <div class="glass-card p-lg">
                            <h3 class="text-headline-sm mb-md">Directorio de Proveedores</h3>
                            ${TableComponent.render({
                                id: 'suppliers-table',
                                columns: [
                                    { label: 'Proveedor', field: 'nombre', render: (v, item) => `<div class="font-semibold">${v}</div><div class="text-body-sm text-muted">RUC: ${item.ruc}</div>` },
                                    { label: 'Contacto', field: 'contacto' },
                                    { label: 'Teléfono', field: 'telefono' },
                                    { label: 'Email', field: 'email' },
                                    { label: 'Acciones', field: 'id', render: () => `
                                        <button class="btn--icon-sm" style="color: var(--color-on-surface-variant);" onclick="Toast.info('Ver detalles')"><span class="material-symbols-outlined">visibility</span></button>
                                    ` }
                                ],
                                data: proveedores
                            })}
                        </div>
                        ` : ''}

                    </div>
                </main>
            </div>
        `;
    },

    filterTable() {
        const query = document.getElementById('search-inventory').value.toLowerCase();
        const rows = document.querySelectorAll('#inventory-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    },

    filterByCategory(cat) {
        this.currentCategoryFilter = cat;
        this.currentStateFilter = '';
        this.render();
    },

    filterByState(state) {
        this.currentStateFilter = state;
        this.currentCategoryFilter = '';
        this.render();
    },

    showNewItemModal() {
        const proveedores = DataService.getProveedores();
        
        Modal.form({
            title: 'Nuevo Artículo de Inventario',
            fields: [
                { name: 'nombre', label: 'Nombre del Artículo', required: true },
                { name: 'categoria', label: 'Categoría', type: 'select', options: Object.keys(Models.CATEGORIAS_INVENTARIO).map(k => ({ value: k, label: Models.CATEGORIAS_INVENTARIO[k] })), required: true },
                { name: 'unidad', label: 'Unidad de Medida', type: 'select', options: [
                    {value:'unidad', label:'Unidad'}, {value:'caja', label:'Caja'}, {value:'paquete', label:'Paquete'}, {value:'litro', label:'Litro'}, {value:'kg', label:'Kilogramo'}
                ], required: true },
                { name: 'stockActual', label: 'Stock Inicial', type: 'number', required: true },
                { name: 'stockMinimo', label: 'Stock Mínimo (Alerta)', type: 'number', required: true },
                { name: 'precioUnitario', label: 'Costo Unitario (S/)', type: 'number', required: true },
                { name: 'proveedor', label: 'Proveedor Principal', type: 'select', options: proveedores.map(p => ({ value: p.nombre, label: p.nombre })) },
                { name: 'ubicacion', label: 'Ubicación en Almacén' }
            ],
            onSubmit: (data) => {
                data.stockActual = parseInt(data.stockActual, 10);
                data.stockMinimo = parseInt(data.stockMinimo, 10);
                data.precioUnitario = parseFloat(data.precioUnitario);
                
                const item = DataService.createItemInventario(data);
                Toast.success(`Artículo ${item.nombre} registrado con éxito`);
                this.render();
            }
        });
    },

    showEditItemModal(id) {
        const item = DataService.getItemInventario(id);
        if (!item) return;

        const proveedores = DataService.getProveedores();

        Modal.form({
            title: 'Editar Artículo de Inventario',
            fields: [
                { name: 'sku', label: 'SKU', value: item.sku, required: true, readOnly: true },
                { name: 'nombre', label: 'Nombre del Artículo', value: item.nombre, required: true },
                { name: 'categoria', label: 'Categoría', type: 'select', options: Object.keys(Models.CATEGORIAS_INVENTARIO).map(k => ({ value: k, label: Models.CATEGORIAS_INVENTARIO[k] })), value: item.categoria, required: true },
                { name: 'unidad', label: 'Unidad de Medida', type: 'select', options: [
                    {value:'unidad', label:'Unidad'}, {value:'caja', label:'Caja'}, {value:'paquete', label:'Paquete'}, {value:'litro', label:'Litro'}, {value:'kg', label:'Kilogramo'}
                ], value: item.unidad, required: true },
                { name: 'stockMinimo', label: 'Stock Mínimo (Alerta)', type: 'number', value: item.stockMinimo, required: true },
                { name: 'precioUnitario', label: 'Costo Unitario (S/)', type: 'number', value: item.precioUnitario, required: true },
                { name: 'proveedor', label: 'Proveedor Principal', type: 'select', options: proveedores.map(p => ({ value: p.nombre, label: p.nombre })), value: item.proveedor },
                { name: 'ubicacion', label: 'Ubicación en Almacén', value: item.ubicacion }
            ],
            onSubmit: (data) => {
                data.stockMinimo = parseInt(data.stockMinimo, 10);
                data.precioUnitario = parseFloat(data.precioUnitario);
                
                const updates = {
                    ...data,
                    estado: Models.calcularEstadoStock(item.stockActual, data.stockMinimo)
                };
                DataService.updateItemInventario(id, updates);
                Toast.success(`Artículo ${item.nombre} actualizado con éxito`);
                this.render();
            }
        });
    },

    deleteItem(id) {
        const item = DataService.getItemInventario(id);
        if (!item) return;

        Modal.confirm({
            title: 'Eliminar Artículo',
            message: `¿Estás seguro de que deseas eliminar el artículo ${item.nombre}? Esta acción no se puede deshacer.`,
            confirmText: 'Sí, eliminar',
            variant: 'danger',
            onConfirm: () => {
                DataService.delete('inventario', id);
                Toast.success(`Artículo ${item.nombre} eliminado correctamente`);
                this.render();
            }
        });
    },

    showRemoveStockModal(id) {
        const item = DataService.getItemInventario(id);
        if (!item) return;

        Modal.form({
            title: `Descontar Stock: ${item.nombre}`,
            submitText: 'Registrar Salida',
            fields: [
                { name: 'cantidad', label: `Cantidad a retirar (${item.unidad})`, type: 'number', required: true },
                { name: 'motivo', label: 'Motivo de Salida', type: 'select', options: [
                    { value: 'consumo', label: 'Consumo en clínica' },
                    { value: 'merma', label: 'Merma / Dañado' },
                    { value: 'vencido', label: 'Vencimiento' },
                    { value: 'ajuste', label: 'Ajuste de inventario' }
                ], required: true }
            ],
            onSubmit: (data) => {
                const cantidad = parseInt(data.cantidad, 10);
                if (cantidad > item.stockActual) {
                    Toast.error('La cantidad a retirar no puede ser mayor al stock actual');
                    return;
                }
                const nuevoStock = item.stockActual - cantidad;
                
                DataService.updateItemInventario(id, { 
                    stockActual: nuevoStock,
                    estado: Models.calcularEstadoStock(nuevoStock, item.stockMinimo)
                });
                
                Toast.success(`Se retiraron ${cantidad} unidades. Nuevo stock: ${nuevoStock}`);
                this.render();
            }
        });
    },

    showAddStockModal(id) {
        const item = DataService.getItemInventario(id);
        if (!item) return;

        Modal.form({
            title: `Añadir Stock: ${item.nombre}`,
            submitText: 'Registrar Ingreso',
            fields: [
                { name: 'cantidad', label: `Cantidad a ingresar (${item.unidad})`, type: 'number', required: true },
                { name: 'lote', label: 'Número de Lote / Guía' },
                { name: 'fechaVencimiento', label: 'Fecha de Vencimiento', type: 'date' }
            ],
            onSubmit: (data) => {
                const cantidad = parseInt(data.cantidad, 10);
                const nuevoStock = item.stockActual + cantidad;
                
                DataService.updateItemInventario(id, { 
                    stockActual: nuevoStock,
                    estado: Models.calcularEstadoStock(nuevoStock, item.stockMinimo)
                });
                
                Toast.success(`Se añadieron ${cantidad} unidades. Nuevo stock: ${nuevoStock}`);
                this.render();
            }
        });
    }
};
