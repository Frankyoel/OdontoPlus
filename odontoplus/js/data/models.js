/* ============================================================
   OdontoPlus — Modelos de Datos (models.js)
   Estructuras de datos para todo el sistema
   ============================================================ */

const Models = {
    /** Genera un ID único */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    /** Genera un código con prefijo */
    generateCode(prefix) {
        const num = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${num}`;
    },

    /** Crea un nuevo usuario del sistema */
    createUser({ nombre, apellido, email, rol, telefono = '', especialidad = '', consultorio = '' }) {
        return {
            id: this.generateId(),
            codigo: this.generateCode('USR'),
            nombre,
            apellido,
            nombreCompleto: `${nombre} ${apellido}`,
            email,
            contrasena: 'odontoplus123', // Contraseña por defecto
            rol, // 'administrador' | 'odontologo' | 'asistente_dental' | 'recepcionista' | 'almacenero'
            telefono,
            especialidad,
            consultorio,
            avatar: '',
            activo: true,
            fechaCreacion: new Date().toISOString(),
            ultimoAcceso: null
        };
    },

    /** Crea un nuevo paciente */
    createPatient({ nombre, apellido, dni, fechaNacimiento, sexo, telefono, email = '', direccion = '', tipoSangre = '', alergias = '', observaciones = '' }) {
        return {
            id: this.generateId(),
            codigo: this.generateCode('PAC'),
            nombre,
            apellido,
            nombreCompleto: `${nombre} ${apellido}`,
            dni,
            fechaNacimiento,
            sexo, // 'M' | 'F'
            edad: this.calcularEdad(fechaNacimiento),
            telefono,
            email,
            direccion,
            tipoSangre,
            alergias,
            observaciones,
            activo: true,
            fechaRegistro: new Date().toISOString(),
            ultimaVisita: null,
            tratamientos: [],
            historial: []
        };
    },

    /** Crea una cita */
    createAppointment({ pacienteId, pacienteNombre, odontologoId, odontologoNombre, fecha, horaInicio, horaFin, tipo, consultorio = 'Consultorio 1', notas = '' }) {
        return {
            id: this.generateId(),
            codigo: this.generateCode('CIT'),
            pacienteId,
            pacienteNombre,
            odontologoId,
            odontologoNombre,
            fecha, // 'YYYY-MM-DD'
            horaInicio, // 'HH:MM'
            horaFin, // 'HH:MM'
            tipo, // 'consulta' | 'limpieza' | 'extraccion' | 'endodoncia' | 'ortodoncia' | 'otro'
            consultorio,
            estado: 'programada', // 'programada' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada' | 'no_asistio'
            notas,
            fechaCreacion: new Date().toISOString()
        };
    },

    /** Crea un artículo de inventario */
    createInventoryItem({ nombre, sku, categoria, unidad, stockActual, stockMinimo, precioUnitario, proveedor = '', ubicacion = '' }) {
        return {
            id: this.generateId(),
            sku: sku || this.generateCode('INV'),
            nombre,
            categoria, // 'insumos_clinicos' | 'proteccion_personal' | 'limpieza' | 'odontologia' | 'equipamiento' | 'medicamentos'
            unidad, // 'unidad' | 'caja' | 'paquete' | 'litro' | 'kg'
            stockActual,
            stockMinimo,
            precioUnitario,
            proveedor,
            ubicacion,
            estado: this.calcularEstadoStock(stockActual, stockMinimo),
            ultimaActualizacion: new Date().toISOString(),
            movimientos: []
        };
    },

    /** Crea un proveedor */
    createSupplier({ nombre, contacto, telefono, email, ruc, direccion = '', categorias = [] }) {
        return {
            id: this.generateId(),
            codigo: this.generateCode('PRV'),
            nombre,
            contacto,
            telefono,
            email,
            ruc,
            direccion,
            categorias,
            activo: true,
            fechaRegistro: new Date().toISOString()
        };
    },

    /** Crea una factura/boleta */
    createInvoice({ pacienteId, pacienteNombre, items, descuento = 0, metodoPago = 'efectivo', notas = '' }) {
        const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const total = subtotal - descuento;
        return {
            id: this.generateId(),
            numero: this.generateCode('BOL'),
            pacienteId,
            pacienteNombre,
            items, // [{ descripcion, cantidad, precio }]
            subtotal,
            descuento,
            total,
            metodoPago, // 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin'
            estado: 'pendiente', // 'pendiente' | 'pagado' | 'vencido' | 'anulado'
            notas,
            fechaEmision: new Date().toISOString(),
            fechaPago: null
        };
    },

    /** Crea un registro en historial clínico */
    createHistorialEntry({ pacienteId, odontologoNombre, tipo, descripcion, diagnostico = '', tratamiento = '', notas = '' }) {
        return {
            id: this.generateId(),
            pacienteId,
            fecha: new Date().toISOString(),
            odontologoNombre,
            tipo, // 'consulta' | 'tratamiento' | 'control' | 'emergencia'
            descripcion,
            diagnostico,
            tratamiento,
            notas
        };
    },

    /** Crea una receta médica */
    createPrescription({ pacienteId, pacienteNombre, odontologoId, odontologoNombre, medicamentos, indicaciones = '' }) {
        return {
            id: this.generateId(),
            codigo: this.generateCode('REC'),
            pacienteId,
            pacienteNombre,
            odontologoId,
            odontologoNombre,
            medicamentos, // [{ nombre, dosis, frecuencia, duracion, instrucciones }]
            indicaciones,
            fecha: new Date().toISOString(),
            firmada: true
        };
    },

    /** Calcula la edad a partir de fecha de nacimiento */
    calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    },

    /** Calcula estado de stock */
    calcularEstadoStock(actual, minimo) {
        if (actual <= minimo * 0.25) return 'critico';
        if (actual <= minimo) return 'bajo';
        return 'adecuado';
    },

    /** Formatea moneda (Soles peruanos) */
    formatMoney(amount) {
        return `S/ ${Number(amount).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    /** Formatea fecha */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    /** Formatea fecha y hora */
    formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    /** Nombres de roles en español */
    ROLES: {
        administrador: 'Administrador',
        odontologo: 'Odontólogo',
        asistente_dental: 'Asistente Dental',
        recepcionista: 'Recepcionista',
        almacenero: 'Almacenero'
    },

    /** Tipos de cita */
    TIPOS_CITA: {
        consulta: 'Consulta',
        limpieza: 'Limpieza',
        extraccion: 'Extracción',
        endodoncia: 'Endodoncia',
        ortodoncia: 'Ortodoncia',
        restauracion: 'Restauración',
        blanqueamiento: 'Blanqueamiento',
        control: 'Control',
        emergencia: 'Emergencia',
        otro: 'Otro'
    },

    /** Categorías de inventario */
    CATEGORIAS_INVENTARIO: {
        insumos_clinicos: 'Insumos Clínicos',
        proteccion_personal: 'Protección Personal',
        limpieza: 'Limpieza y Esterilización',
        odontologia: 'Material Odontológico',
        equipamiento: 'Equipamiento',
        medicamentos: 'Medicamentos'
    },

    /** Métodos de pago */
    METODOS_PAGO: {
        efectivo: 'Efectivo',
        tarjeta: 'Tarjeta',
        transferencia: 'Transferencia',
        yape: 'Yape',
        plin: 'Plin'
    }
};

// Exportar para uso en otros módulos
window.Models = Models;
