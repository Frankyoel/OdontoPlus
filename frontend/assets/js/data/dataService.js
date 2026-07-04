/* ============================================================
   OdontoPlus — Servicio de Datos (dataService.js)
   CRUD sobre localStorage, preparado para migrar a API REST
   ============================================================ */

const DataService = {
    /** Obtiene todos los registros de una colección */
    getAll(collection) {
        const data = localStorage.getItem(`odontoplus_${collection}`);
        return data ? JSON.parse(data) : [];
    },

    /** Obtiene un registro por ID */
    getById(collection, id) {
        const items = this.getAll(collection);
        return items.find(item => item.id === id) || null;
    },

    /** Busca registros que coincidan con un filtro */
    find(collection, filterFn) {
        const items = this.getAll(collection);
        return items.filter(filterFn);
    },

    /** Busca el primer registro que coincida con un filtro */
    findOne(collection, filterFn) {
        const items = this.getAll(collection);
        return items.find(filterFn) || null;
    },

    /** Crea un nuevo registro */
    create(collection, item) {
        const items = this.getAll(collection);
        items.push(item);
        this._save(collection, items);
        return item;
    },

    /** Actualiza un registro existente */
    update(collection, id, updates) {
        const items = this.getAll(collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;
        items[index] = { ...items[index], ...updates };
        this._save(collection, items);
        return items[index];
    },

    /** Elimina un registro */
    delete(collection, id) {
        const items = this.getAll(collection);
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length === items.length) return false;
        this._save(collection, filtered);
        return true;
    },

    /** Cuenta los registros de una colección */
    count(collection, filterFn = null) {
        const items = this.getAll(collection);
        return filterFn ? items.filter(filterFn).length : items.length;
    },

    /** Guarda en localStorage */
    _save(collection, items) {
        localStorage.setItem(`odontoplus_${collection}`, JSON.stringify(items));
    },

    /* ── Métodos de conveniencia para cada entidad ── */

    // Pacientes
    getPacientes() { return this.getAll('pacientes'); },
    getPaciente(id) { return this.getById('pacientes', id); },
    createPaciente(data) { return this.create('pacientes', Models.createPatient(data)); },
    updatePaciente(id, data) { return this.update('pacientes', id, data); },
    deletePaciente(id) { return this.delete('pacientes', id); },

    // Citas
    getCitas() { return this.getAll('citas'); },
    getCita(id) { return this.getById('citas', id); },
    getCitasHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        return this.find('citas', c => c.fecha === hoy);
    },
    getCitasPorFecha(fecha) {
        return this.find('citas', c => c.fecha === fecha);
    },
    createCita(data) { return this.create('citas', Models.createAppointment(data)); },
    updateCita(id, data) { return this.update('citas', id, data); },
    deleteCita(id) { return this.delete('citas', id); },

    // Inventario
    getInventario() { return this.getAll('inventario'); },
    getItemInventario(id) { return this.getById('inventario', id); },
    getItemsCriticos() { return this.find('inventario', i => i.estado === 'critico' || i.estado === 'bajo'); },
    createItemInventario(data) { return this.create('inventario', Models.createInventoryItem(data)); },
    updateItemInventario(id, data) { return this.update('inventario', id, data); },

    // Proveedores
    getProveedores() { return this.getAll('proveedores'); },
    getProveedor(id) { return this.getById('proveedores', id); },
    createProveedor(data) { return this.create('proveedores', Models.createSupplier(data)); },

    // Facturas
    getFacturas() { return this.getAll('facturas'); },
    getFactura(id) { return this.getById('facturas', id); },
    getFacturasPendientes() { return this.find('facturas', f => f.estado === 'pendiente'); },
    createFactura(data) { return this.create('facturas', Models.createInvoice(data)); },
    updateFactura(id, data) { return this.update('facturas', id, data); },

    // Recetas
    getRecetas() { return this.getAll('recetas'); },
    getRecetasPaciente(pacienteId) { return this.find('recetas', r => r.pacienteId === pacienteId); },
    createReceta(data) { return this.create('recetas', Models.createPrescription(data)); },

    // Usuarios
    getUsuarios() { return this.getAll('usuarios'); },
    getUsuario(id) { return this.getById('usuarios', id); },

    /* ── Estadísticas para Dashboard ── */
    getEstadisticas() {
        const citas = this.getCitas();
        const citasHoy = this.getCitasHoy();
        const facturas = this.getFacturas();
        const inventario = this.getInventario();
        const pacientes = this.getPacientes();

        const ingresosHoy = facturas
            .filter(f => {
                const hoy = new Date().toISOString().split('T')[0];
                return f.fechaPago && f.fechaPago.startsWith(hoy) && f.estado === 'pagado';
            })
            .reduce((sum, f) => sum + f.total, 0);

        const ingresosMes = facturas
            .filter(f => {
                const ahora = new Date();
                const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
                return f.fechaPago && f.fechaPago.startsWith(mesActual) && f.estado === 'pagado';
            })
            .reduce((sum, f) => sum + f.total, 0);

        return {
            totalPacientes: pacientes.length,
            pacientesActivos: pacientes.filter(p => p.activo).length,
            citasHoy: citasHoy.length,
            citasCompletadasHoy: citasHoy.filter(c => c.estado === 'completada').length,
            citasProgramadasHoy: citasHoy.filter(c => c.estado === 'programada' || c.estado === 'confirmada').length,
            totalCitasMes: citas.length,
            ingresosHoy,
            ingresosMes,
            facturasPendientes: facturas.filter(f => f.estado === 'pendiente').length,
            totalPendiente: facturas.filter(f => f.estado === 'pendiente').reduce((sum, f) => sum + f.total, 0),
            itemsCriticos: inventario.filter(i => i.estado === 'critico').length,
            itemsBajos: inventario.filter(i => i.estado === 'bajo').length,
            totalArticulos: inventario.length,
            valorInventario: inventario.reduce((sum, i) => sum + (i.stockActual * i.precioUnitario), 0)
        };
    }
};

window.DataService = DataService;
