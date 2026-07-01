/* ============================================================
   OdontoPlus — Datos Semilla (seedData.js)
   Datos de ejemplo precargados para demo
   ============================================================ */

const SeedData = {
    usuarios: [
        {
            id: 'usr_admin_01',
            codigo: 'USR-0001',
            nombre: 'Carlos',
            apellido: 'Mendoza Ríos',
            nombreCompleto: 'Carlos Mendoza Ríos',
            email: 'admin@odontoplus.pe',
            contrasena: 'admin123',
            rol: 'administrador',
            telefono: '987654321',
            especialidad: '',
            consultorio: '',
            avatar: '',
            activo: true,
            fechaCreacion: '2025-01-15T10:00:00Z',
            ultimoAcceso: null
        },
        {
            id: 'usr_odont_01',
            codigo: 'USR-0002',
            nombre: 'María Elena',
            apellido: 'Torres Guzmán',
            nombreCompleto: 'Dra. María Elena Torres Guzmán',
            email: 'dra.torres@odontoplus.pe',
            contrasena: 'doctor123',
            rol: 'odontologo',
            telefono: '976543210',
            especialidad: 'Endodoncia y Rehabilitación Oral',
            consultorio: 'Consultorio 1',
            avatar: '',
            activo: true,
            fechaCreacion: '2025-02-01T10:00:00Z',
            ultimoAcceso: null
        },
        {
            id: 'usr_asist_01',
            codigo: 'USR-0005',
            nombre: 'Lucía',
            apellido: 'Paredes Soto',
            nombreCompleto: 'Lucía Paredes Soto',
            email: 'lucia.paredes@odontoplus.pe',
            contrasena: 'asistente123',
            rol: 'asistente_dental',
            telefono: '934567890',
            especialidad: '',
            consultorio: 'Consultorio 1',
            avatar: '',
            activo: true,
            fechaCreacion: '2025-03-10T10:00:00Z',
            ultimoAcceso: null
        },
        {
            id: 'usr_recep_01',
            codigo: 'USR-0003',
            nombre: 'Ana Rosa',
            apellido: 'López Huamán',
            nombreCompleto: 'Ana Rosa López Huamán',
            email: 'recepcion@odontoplus.pe',
            contrasena: 'recepcion123',
            rol: 'recepcionista',
            telefono: '965432109',
            especialidad: '',
            consultorio: '',
            avatar: '',
            activo: true,
            fechaCreacion: '2025-02-15T10:00:00Z',
            ultimoAcceso: null
        },
        {
            id: 'usr_almac_01',
            codigo: 'USR-0004',
            nombre: 'Roberto',
            apellido: 'Sánchez Vega',
            nombreCompleto: 'Roberto Sánchez Vega',
            email: 'almacen@odontoplus.pe',
            contrasena: 'almacen123',
            rol: 'almacenero',
            telefono: '954321098',
            especialidad: '',
            consultorio: '',
            avatar: '',
            activo: true,
            fechaCreacion: '2025-03-01T10:00:00Z',
            ultimoAcceso: null
        }
    ],

    pacientes: [
        {
            id: 'pac_01',
            codigo: 'PAC-8472',
            nombre: 'Elena',
            apellido: 'Rodríguez Castillo',
            nombreCompleto: 'Elena Rodríguez Castillo',
            dni: '45678912',
            fechaNacimiento: '1981-05-14',
            sexo: 'F',
            edad: 44,
            telefono: '912345678',
            email: 'elena.rodriguez@gmail.com',
            direccion: 'Av. Arequipa 1520, Lince, Lima',
            tipoSangre: 'O+',
            alergias: 'Penicilina',
            observaciones: 'Paciente con hipertensión controlada',
            activo: true,
            fechaRegistro: '2024-03-10T10:00:00Z',
            ultimaVisita: '2025-10-12T10:00:00Z',
            tratamientos: [
                { nombre: 'Endodoncia (Diente 46)', estado: 'en_progreso', progreso: 50, fase: 'Fase 2/4', siguiente: 'Prep. Corona' },
                { nombre: 'Ajuste Ortodóntico', estado: 'rutina', progreso: 15, fase: 'Mes 3 de 18', siguiente: '' }
            ],
            historial: [
                {
                    id: 'hist_01',
                    fecha: '2025-10-12T10:00:00Z',
                    odontologoNombre: 'Dra. María Elena Torres',
                    tipo: 'consulta',
                    descripcion: 'Consulta Endodóntica Inicial',
                    diagnostico: 'Pulpitis irreversible en #46',
                    tratamiento: 'Se tomaron radiografías. Se programa endodoncia.',
                    notas: 'Paciente reporta sensibilidad en el cuadrante inferior derecho.'
                },
                {
                    id: 'hist_02',
                    fecha: '2025-08-05T10:00:00Z',
                    odontologoNombre: 'Dra. María Elena Torres',
                    tipo: 'control',
                    descripcion: 'Profilaxis Semestral',
                    diagnostico: '',
                    tratamiento: 'Limpieza y revisión de rutina. Se eliminó acumulación leve de cálculo.',
                    notas: 'No se detectaron nuevas caries.'
                },
                {
                    id: 'hist_03',
                    fecha: '2024-01-18T10:00:00Z',
                    odontologoNombre: 'Dra. María Elena Torres',
                    tipo: 'tratamiento',
                    descripcion: 'Restauración de Resina #14',
                    diagnostico: 'Caries clase II en molar superior izquierdo',
                    tratamiento: 'Empaste de resina colocado. Paciente toleró bien el procedimiento.',
                    notas: ''
                }
            ]
        },
        {
            id: 'pac_02',
            codigo: 'PAC-9102',
            nombre: 'Marco',
            apellido: 'Jiménez Flores',
            nombreCompleto: 'Marco Jiménez Flores',
            dni: '78901234',
            fechaNacimiento: '1990-11-22',
            sexo: 'M',
            edad: 35,
            telefono: '923456789',
            email: 'marco.jimenez@gmail.com',
            direccion: 'Jr. Cusco 450, Cercado de Lima',
            tipoSangre: 'A+',
            alergias: '',
            observaciones: '',
            activo: true,
            fechaRegistro: '2024-06-15T10:00:00Z',
            ultimaVisita: '2025-09-28T10:00:00Z',
            tratamientos: [],
            historial: [
                {
                    id: 'hist_04',
                    fecha: '2025-09-28T10:00:00Z',
                    odontologoNombre: 'Dra. María Elena Torres',
                    tipo: 'control',
                    descripcion: 'Control de Rutina',
                    diagnostico: 'Sin hallazgos significativos',
                    tratamiento: 'Limpieza dental preventiva realizada.',
                    notas: ''
                }
            ]
        },
        {
            id: 'pac_03',
            codigo: 'PAC-3319',
            nombre: 'David',
            apellido: 'Chen Yamamoto',
            nombreCompleto: 'David Chen Yamamoto',
            dni: '34567890',
            fechaNacimiento: '1995-03-08',
            sexo: 'M',
            edad: 31,
            telefono: '934567891',
            email: 'david.chen@gmail.com',
            direccion: 'Av. Javier Prado 2200, San Isidro, Lima',
            tipoSangre: 'B+',
            alergias: 'Látex',
            observaciones: '',
            activo: true,
            fechaRegistro: '2025-01-20T10:00:00Z',
            ultimaVisita: null,
            tratamientos: [],
            historial: []
        },
        {
            id: 'pac_04',
            codigo: 'PAC-5541',
            nombre: 'Carmen',
            apellido: 'Quispe Mamani',
            nombreCompleto: 'Carmen Quispe Mamani',
            dni: '56789012',
            fechaNacimiento: '1975-08-30',
            sexo: 'F',
            edad: 50,
            telefono: '945678901',
            email: '',
            direccion: 'Calle Los Olivos 320, SJL, Lima',
            tipoSangre: 'O-',
            alergias: '',
            observaciones: 'Paciente diabética tipo 2',
            activo: true,
            fechaRegistro: '2024-11-05T10:00:00Z',
            ultimaVisita: '2025-06-20T10:00:00Z',
            tratamientos: [
                { nombre: 'Prótesis Parcial Superior', estado: 'en_progreso', progreso: 70, fase: 'Fase 3/4', siguiente: 'Instalación' }
            ],
            historial: []
        },
        {
            id: 'pac_05',
            codigo: 'PAC-7723',
            nombre: 'Juan Pablo',
            apellido: 'Pérez Huanca',
            nombreCompleto: 'Juan Pablo Pérez Huanca',
            dni: '23456789',
            fechaNacimiento: '1988-12-15',
            sexo: 'M',
            edad: 37,
            telefono: '956789012',
            email: 'juanpablo.perez@outlook.com',
            direccion: 'Av. Universitaria 1800, Los Olivos, Lima',
            tipoSangre: 'AB+',
            alergias: 'Ibuprofeno',
            observaciones: '',
            activo: true,
            fechaRegistro: '2025-04-12T10:00:00Z',
            ultimaVisita: '2025-06-15T10:00:00Z',
            tratamientos: [],
            historial: []
        }
    ],

    citas: (() => {
        const hoy = new Date();
        const fechaHoy = hoy.toISOString().split('T')[0];
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        const fechaManana = manana.toISOString().split('T')[0];
        const pasado = new Date(hoy);
        pasado.setDate(pasado.getDate() + 2);
        const fechaPasado = pasado.toISOString().split('T')[0];

        return [
            {
                id: 'cit_01', codigo: 'CIT-1001',
                pacienteId: 'pac_01', pacienteNombre: 'Elena Rodríguez Castillo',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaHoy, horaInicio: '09:00', horaFin: '10:00',
                tipo: 'endodoncia', consultorio: 'Consultorio 1',
                estado: 'confirmada', notas: 'Segunda sesión de endodoncia',
                fechaCreacion: '2025-06-28T10:00:00Z'
            },
            {
                id: 'cit_02', codigo: 'CIT-1002',
                pacienteId: 'pac_02', pacienteNombre: 'Marco Jiménez Flores',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaHoy, horaInicio: '10:30', horaFin: '11:00',
                tipo: 'limpieza', consultorio: 'Consultorio 1',
                estado: 'programada', notas: 'Limpieza semestral',
                fechaCreacion: '2025-06-29T10:00:00Z'
            },
            {
                id: 'cit_03', codigo: 'CIT-1003',
                pacienteId: 'pac_05', pacienteNombre: 'Juan Pablo Pérez Huanca',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaHoy, horaInicio: '11:30', horaFin: '12:00',
                tipo: 'consulta', consultorio: 'Consultorio 1',
                estado: 'programada', notas: '',
                fechaCreacion: '2025-06-30T10:00:00Z'
            },
            {
                id: 'cit_04', codigo: 'CIT-1004',
                pacienteId: 'pac_03', pacienteNombre: 'David Chen Yamamoto',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaHoy, horaInicio: '15:00', horaFin: '15:30',
                tipo: 'control', consultorio: 'Consultorio 1',
                estado: 'programada', notas: 'Primera consulta',
                fechaCreacion: '2025-06-30T10:00:00Z'
            },
            {
                id: 'cit_05', codigo: 'CIT-1005',
                pacienteId: 'pac_04', pacienteNombre: 'Carmen Quispe Mamani',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaManana, horaInicio: '09:30', horaFin: '10:30',
                tipo: 'otro', consultorio: 'Consultorio 1',
                estado: 'programada', notas: 'Instalación de prótesis',
                fechaCreacion: '2025-06-28T10:00:00Z'
            },
            {
                id: 'cit_06', codigo: 'CIT-1006',
                pacienteId: 'pac_01', pacienteNombre: 'Elena Rodríguez Castillo',
                odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
                fecha: fechaPasado, horaInicio: '10:00', horaFin: '11:00',
                tipo: 'endodoncia', consultorio: 'Consultorio 1',
                estado: 'programada', notas: 'Tercera sesión endodoncia',
                fechaCreacion: '2025-06-28T10:00:00Z'
            }
        ];
    })(),

    inventario: [
        {
            id: 'inv_01', sku: 'ANE-001', nombre: 'Anestesia Local (Lidocaína 2%)', categoria: 'insumos_clinicos',
            unidad: 'caja', stockActual: 5, stockMinimo: 20, precioUnitario: 85.00,
            proveedor: 'MedDenta S.A.C.', ubicacion: 'Estante A-1', estado: 'critico',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_02', sku: 'GUA-010', nombre: 'Guantes de Nitrilo (Talla M)', categoria: 'proteccion_personal',
            unidad: 'caja', stockActual: 8, stockMinimo: 15, precioUnitario: 42.00,
            proveedor: 'EquiposDent', ubicacion: 'Estante B-2', estado: 'bajo',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_03', sku: 'MAS-042', nombre: 'Mascarillas N95', categoria: 'proteccion_personal',
            unidad: 'caja', stockActual: 120, stockMinimo: 50, precioUnitario: 35.00,
            proveedor: 'MedDenta S.A.C.', ubicacion: 'Estante B-1', estado: 'adecuado',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_04', sku: 'RES-055', nombre: 'Resina Compuesta A2 (Jeringa)', categoria: 'odontologia',
            unidad: 'unidad', stockActual: 3, stockMinimo: 10, precioUnitario: 120.00,
            proveedor: 'DentalPro Perú', ubicacion: 'Estante C-3', estado: 'critico',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_05', sku: 'DES-991', nombre: 'Desinfectante de Superficies', categoria: 'limpieza',
            unidad: 'litro', stockActual: 45, stockMinimo: 10, precioUnitario: 28.00,
            proveedor: 'QuimLab', ubicacion: 'Estante D-1', estado: 'adecuado',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_06', sku: 'FRE-022', nombre: 'Fresas Diamantadas (Kit)', categoria: 'odontologia',
            unidad: 'paquete', stockActual: 12, stockMinimo: 5, precioUnitario: 65.00,
            proveedor: 'DentalPro Perú', ubicacion: 'Estante C-1', estado: 'adecuado',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_07', sku: 'ALG-033', nombre: 'Alginato para Impresiones', categoria: 'odontologia',
            unidad: 'kg', stockActual: 2, stockMinimo: 5, precioUnitario: 55.00,
            proveedor: 'MedDenta S.A.C.', ubicacion: 'Estante C-2', estado: 'critico',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        },
        {
            id: 'inv_08', sku: 'CEM-044', nombre: 'Cemento de Ionómero de Vidrio', categoria: 'odontologia',
            unidad: 'unidad', stockActual: 15, stockMinimo: 8, precioUnitario: 95.00,
            proveedor: 'DentalPro Perú', ubicacion: 'Estante C-4', estado: 'adecuado',
            ultimaActualizacion: new Date().toISOString(), movimientos: []
        }
    ],

    proveedores: [
        {
            id: 'prv_01', codigo: 'PRV-0001', nombre: 'MedDenta S.A.C.', contacto: 'Jorge Vargas',
            telefono: '01-4567890', email: 'ventas@meddenta.pe', ruc: '20456789012',
            direccion: 'Av. Industrial 890, Ate, Lima', categorias: ['insumos_clinicos', 'proteccion_personal', 'odontologia'],
            activo: true, fechaRegistro: '2024-01-15T10:00:00Z'
        },
        {
            id: 'prv_02', codigo: 'PRV-0002', nombre: 'EquiposDent', contacto: 'Patricia Luna',
            telefono: '01-3456789', email: 'contacto@equiposdent.pe', ruc: '20567890123',
            direccion: 'Jr. Comercio 456, SJL, Lima', categorias: ['equipamiento', 'proteccion_personal'],
            activo: true, fechaRegistro: '2024-03-20T10:00:00Z'
        },
        {
            id: 'prv_03', codigo: 'PRV-0003', nombre: 'DentalPro Perú', contacto: 'Miguel Ángel Ramos',
            telefono: '01-5678901', email: 'info@dentalpro.pe', ruc: '20678901234',
            direccion: 'Av. La Marina 2100, San Miguel, Lima', categorias: ['odontologia', 'medicamentos'],
            activo: true, fechaRegistro: '2024-06-10T10:00:00Z'
        }
    ],

    facturas: [
        {
            id: 'fac_01', numero: 'BOL-0001',
            pacienteId: 'pac_02', pacienteNombre: 'Marco Jiménez Flores',
            items: [{ descripcion: 'Limpieza Dental Profunda', cantidad: 1, precio: 150.00 }],
            subtotal: 150.00, descuento: 0, total: 150.00,
            metodoPago: 'yape', estado: 'pagado', notas: '',
            fechaEmision: '2025-06-28T10:30:00Z', fechaPago: '2025-06-28T10:35:00Z'
        },
        {
            id: 'fac_02', numero: 'BOL-0002',
            pacienteId: 'pac_01', pacienteNombre: 'Elena Rodríguez Castillo',
            items: [
                { descripcion: 'Endodoncia - Sesión 1', cantidad: 1, precio: 350.00 },
                { descripcion: 'Radiografía Periapical', cantidad: 2, precio: 30.00 }
            ],
            subtotal: 410.00, descuento: 10.00, total: 400.00,
            metodoPago: 'tarjeta', estado: 'pagado', notas: 'Descuento por paciente frecuente',
            fechaEmision: '2025-06-25T14:00:00Z', fechaPago: '2025-06-25T14:10:00Z'
        },
        {
            id: 'fac_03', numero: 'BOL-0003',
            pacienteId: 'pac_04', pacienteNombre: 'Carmen Quispe Mamani',
            items: [{ descripcion: 'Prótesis Parcial Superior (Adelanto 50%)', cantidad: 1, precio: 600.00 }],
            subtotal: 600.00, descuento: 0, total: 600.00,
            metodoPago: 'efectivo', estado: 'pendiente', notas: 'Saldo restante: S/ 600.00',
            fechaEmision: '2025-06-20T11:00:00Z', fechaPago: null
        },
        {
            id: 'fac_04', numero: 'BOL-0004',
            pacienteId: 'pac_05', pacienteNombre: 'Juan Pablo Pérez Huanca',
            items: [
                { descripcion: 'Consulta General', cantidad: 1, precio: 80.00 },
                { descripcion: 'Restauración de Resina', cantidad: 1, precio: 120.00 }
            ],
            subtotal: 200.00, descuento: 0, total: 200.00,
            metodoPago: 'plin', estado: 'pendiente', notas: '',
            fechaEmision: '2025-06-15T16:00:00Z', fechaPago: null
        }
    ],

    recetas: [
        {
            id: 'rec_01', codigo: 'REC-0001',
            pacienteId: 'pac_01', pacienteNombre: 'Elena Rodríguez Castillo',
            odontologoId: 'usr_odont_01', odontologoNombre: 'Dra. María Elena Torres',
            medicamentos: [
                { nombre: 'Amoxicilina 500mg', dosis: '1 cápsula', frecuencia: 'Cada 8 horas', duracion: '7 días', instrucciones: 'Tomar con alimentos' },
                { nombre: 'Ibuprofeno 400mg', dosis: '1 tableta', frecuencia: 'Cada 8 horas (si hay dolor)', duracion: '5 días', instrucciones: 'No tomar en ayunas' }
            ],
            indicaciones: 'Evitar alimentos muy calientes o fríos por 48 horas. No masticar del lado tratado.',
            fecha: '2025-10-12T10:00:00Z',
            firmada: true
        }
    ],

    /** Inicializa los datos en localStorage si no existen */
    init() {
        const collections = ['usuarios', 'pacientes', 'citas', 'inventario', 'proveedores', 'facturas', 'recetas'];
        let initialized = false;

        collections.forEach(collection => {
            if (!localStorage.getItem(`odontoplus_${collection}`)) {
                localStorage.setItem(`odontoplus_${collection}`, JSON.stringify(this[collection]));
                initialized = true;
            }
        });

        if (initialized) {
            console.log('✅ OdontoPlus: Datos semilla cargados correctamente');
        }
    },

    /** Reinicia todos los datos a los valores iniciales */
    reset() {
        const collections = ['usuarios', 'pacientes', 'citas', 'inventario', 'proveedores', 'facturas', 'recetas'];
        collections.forEach(collection => {
            localStorage.setItem(`odontoplus_${collection}`, JSON.stringify(this[collection]));
        });
        console.log('🔄 OdontoPlus: Datos reiniciados a valores iniciales');
    }
};

window.SeedData = SeedData;
