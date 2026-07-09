-- =============================================================
--  OdontoPlus — DATOS DE PRUEBA (Semilla + 1 Semana de Uso)
--  Cobertura completa según odontoplus_Tablas.sql:
--  Roles, Usuarios, Pacientes, Proveedores, Citas,
--  HistorialesClinicos, RecetasMedicas + Medicamentos,
--  Facturas + FacturaDetalles, ArticulosInventario
--  ⚠️ Ejecutar SOLO después de correr el Backend (Visual Studio)
--  por primera vez, para que existan las tablas Identity.
-- =============================================================

USE `odontoplus_db`;

-- =============================================================
--  0. ROLES DEL SISTEMA (Identity)
-- =============================================================
SET @rol_admin = UUID();
SET @rol_doc   = UUID();
SET @rol_rec   = UUID();
SET @rol_ast   = UUID();
SET @rol_war   = UUID();

INSERT IGNORE INTO `AspNetRoles` (`Id`, `Name`, `NormalizedName`) VALUES
(@rol_admin, 'admin', 'ADMIN'),
(@rol_doc,   'doctor', 'DOCTOR'),
(@rol_rec,   'receptionist', 'RECEPTIONIST'),
(@rol_ast,   'assistant', 'ASSISTANT'),
(@rol_war,   'warehouse', 'WAREHOUSE');

-- =============================================================
--  0.5. USUARIOS DEL SISTEMA (Identity)
--  Contraseñas: admin123, doctor123, doctor456, recepcion123,
--  asistente123, almacen123
-- =============================================================
SET @usr_admin = UUID();
SET @usr_doc1  = UUID();  -- Odontóloga principal (Dra. Torres)
SET @usr_doc2  = UUID();  -- Segundo odontólogo (Dr. Ramos)
SET @usr_rec   = UUID();
SET @usr_ast   = UUID();
SET @usr_war   = UUID();

INSERT IGNORE INTO `AspNetUsers`
  (`Id`, `Especialidad`, `Consultorio`, `UserName`, `NormalizedUserName`, `Email`, `NormalizedEmail`,
   `EmailConfirmed`, `PasswordHash`, `SecurityStamp`, `ConcurrencyStamp`,
   `PhoneNumberConfirmed`, `TwoFactorEnabled`, `LockoutEnabled`, `AccessFailedCount`, `Activo`)
VALUES
(@usr_admin, NULL, NULL, 'admin@odontoplus.pe', 'ADMIN@ODONTOPLUS.PE', 'admin@odontoplus.pe', 'ADMIN@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEOhGRFMRgrN80CRt2IYKjYcsC1/N5wGVKjzs/RbpqZ227QJ3FhvBvPO6FRQ3qwGJaw==', 'ZO3AKZDF4P72NJOV2TPXYRWG2PLVYDHO', UUID(), 0, 0, 0, 0, 1),
(@usr_doc1, 'Odontología General', 'Consultorio 1', 'dra.torres@odontoplus.pe', 'DRA.TORRES@ODONTOPLUS.PE', 'dra.torres@odontoplus.pe', 'DRA.TORRES@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEPrYB1iEK8K0lQzVbi9tv70IwzsGUKNWaIwObGSxK9bwxhk42wMNK9/6jAAyJORenw==', 'LRU6V3GW3BCA5QAECB5S4KZZ4MXICMIA', UUID(), 0, 0, 0, 0, 1),
(@usr_doc2, 'Ortodoncia', 'Consultorio 2', 'dr.ramos@odontoplus.pe', 'DR.RAMOS@ODONTOPLUS.PE', 'dr.ramos@odontoplus.pe', 'DR.RAMOS@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEPrYB1iEK8K0lQzVbi9tv70IwzsGUKNWaIwObGSxK9bwxhk42wMNK9/6jAAyJORenw==', 'LRU6V3GW3BCA5QAECB5S4KZZ4MXICMJB', UUID(), 0, 0, 0, 0, 1),
(@usr_rec, NULL, NULL, 'recepcion@odontoplus.pe', 'RECEPCION@ODONTOPLUS.PE', 'recepcion@odontoplus.pe', 'RECEPCION@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEPaE+QHBcqJbDK0Zyh+Het63h2kFSnZwukAcnUj0SH+c67wzDQ1+1CLZzFHSKZ1fCA==', 'FAWQJUK6QPY5MA3FHDV5KZZDKBAOIR6A', UUID(), 0, 0, 0, 0, 1),
(@usr_ast, NULL, NULL, 'lucia.paredes@odontoplus.pe', 'LUCIA.PAREDES@ODONTOPLUS.PE', 'lucia.paredes@odontoplus.pe', 'LUCIA.PAREDES@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEESWru4Ff3JbTef6dPghfesCJKFg9iVa4ogfp7YMfTb09SNunrNvc+yNwGttb/zYPQ==', 'R725WL6EIA2I7NJBYBCG53S3SDT7GBKR', UUID(), 0, 0, 0, 0, 1),
(@usr_war, NULL, NULL, 'almacen@odontoplus.pe', 'ALMACEN@ODONTOPLUS.PE', 'almacen@odontoplus.pe', 'ALMACEN@ODONTOPLUS.PE',
  1, 'AQAAAAIAAYagAAAAEESl7RpQqtpqTg6x2MZXXmpUh4mXwU7IG3rXVxVuVDt5tyM/h21bJmoMH1iCfhsg5g==', 'X2ZQPW6JXZS2YGCYITY6JOVACYPJ4L7Q', UUID(), 0, 0, 0, 0, 1);

-- ---------------------------------------------------------------
-- IMPORTANTE: si los usuarios/roles ya existían (email o
-- NormalizedName repetido), el INSERT IGNORE anterior los omitió
-- y las variables @usr_x / @rol_x quedaron con UUIDs "huérfanos".
-- Se resuelven aquí los IDs REALES ya guardados en la tabla.
-- ---------------------------------------------------------------
SELECT `Id` INTO @rol_admin FROM `AspNetRoles` WHERE `NormalizedName` = 'ADMIN' LIMIT 1;
SELECT `Id` INTO @rol_doc   FROM `AspNetRoles` WHERE `NormalizedName` = 'DOCTOR' LIMIT 1;
SELECT `Id` INTO @rol_rec   FROM `AspNetRoles` WHERE `NormalizedName` = 'RECEPTIONIST' LIMIT 1;
SELECT `Id` INTO @rol_ast   FROM `AspNetRoles` WHERE `NormalizedName` = 'ASSISTANT' LIMIT 1;
SELECT `Id` INTO @rol_war   FROM `AspNetRoles` WHERE `NormalizedName` = 'WAREHOUSE' LIMIT 1;

SELECT `Id` INTO @usr_admin FROM `AspNetUsers` WHERE `NormalizedEmail` = 'ADMIN@ODONTOPLUS.PE' LIMIT 1;
SELECT `Id` INTO @usr_doc1  FROM `AspNetUsers` WHERE `NormalizedEmail` = 'DRA.TORRES@ODONTOPLUS.PE' LIMIT 1;
SELECT `Id` INTO @usr_doc2  FROM `AspNetUsers` WHERE `NormalizedEmail` = 'DR.RAMOS@ODONTOPLUS.PE' LIMIT 1;
SELECT `Id` INTO @usr_rec   FROM `AspNetUsers` WHERE `NormalizedEmail` = 'RECEPCION@ODONTOPLUS.PE' LIMIT 1;
SELECT `Id` INTO @usr_ast   FROM `AspNetUsers` WHERE `NormalizedEmail` = 'LUCIA.PAREDES@ODONTOPLUS.PE' LIMIT 1;
SELECT `Id` INTO @usr_war   FROM `AspNetUsers` WHERE `NormalizedEmail` = 'ALMACEN@ODONTOPLUS.PE' LIMIT 1;

-- Asignar roles a usuarios (también con IGNORE por si ya existían)
INSERT IGNORE INTO `AspNetUserRoles` (`UserId`, `RoleId`) VALUES
(@usr_admin, @rol_admin),
(@usr_doc1, @rol_doc),
(@usr_doc2, @rol_doc),
(@usr_rec, @rol_rec),
(@usr_ast, @rol_ast),
(@usr_war, @rol_war);

-- =============================================================
--  1. PROVEEDORES
-- =============================================================
SET @prov_1 = UUID();
SET @prov_2 = UUID();

INSERT INTO `Proveedores` (`Id`, `Codigo`, `Nombre`, `Contacto`, `Telefono`, `Email`, `Ruc`, `Direccion`, `Activo`, `FechaRegistro`)
VALUES
(@prov_1, 'PROV-001', 'DentalSupply Perú SAC', 'Jorge Vidal', '014567890', 'ventas@dentalsupply.pe', '20456789123', 'Av. Industrial 890, Lima', 1, UTC_TIMESTAMP()),
(@prov_2, 'PROV-002', 'BioSafe Insumos Médicos', 'Karina Luna', '016543210', 'contacto@biosafe.pe', '20567891234', 'Jr. Amazonas 321, Lima', 1, UTC_TIMESTAMP());

-- =============================================================
--  2. PACIENTES
-- =============================================================
SET @pac_1 = UUID();
SET @pac_2 = UUID();
SET @pac_3 = UUID();
SET @pac_4 = UUID();
SET @pac_5 = UUID();

INSERT INTO `Pacientes` (`Id`, `Codigo`, `Nombre`, `Apellido`, `DNI`, `FechaNacimiento`, `Sexo`, `Telefono`, `Email`, `Direccion`, `TipoSangre`, `Alergias`, `Observaciones`, `Activo`, `FechaRegistro`, `UltimaVisita`)
VALUES
(@pac_1, 'PAC-001', 'Elena', 'Salazar', '72345671', '1988-03-12', 'F', '987654321', 'elena@gmail.com', 'Av. Larco 123', 'O+', 'Ninguna', 'Paciente regular', 1, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 6 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)),
(@pac_2, 'PAC-002', 'Roberto', 'Mendoza', '78654322', '1995-11-25', 'M', '912345678', 'roberto@hotmail.com', 'Calle Los Pinos 456', 'A+', 'Penicilina', 'Sensibilidad dental', 1, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 6 DAY), CURDATE()),
(@pac_3, 'PAC-003', 'Valeria', 'Castro', '74561233', '2001-07-08', 'F', '933445566', 'valeria@yahoo.com', 'Urb. El Bosque', 'B-', 'Ninguna', 'Ortodoncia en progreso', 1, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 6 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 DAY)),
(@pac_4, 'PAC-004', 'Diego', 'Huamán', '76321987', '1979-05-30', 'M', '944556677', 'diego.huaman@gmail.com', 'Jr. Tacna 210', 'AB+', 'Látex', 'Paciente hipertenso, control con anestesia', 1, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 DAY)),
(@pac_5, 'PAC-005', 'Camila', 'Rojas', '70123456', '2010-02-14', 'F', '955667788', 'camila.padres@gmail.com', 'Av. Brasil 550', 'O-', 'Ninguna', 'Paciente pediátrica, primera visita', 1, DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY), DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY));

-- =============================================================
--  3. CITAS (Últimos 7 días, incluye hoy y una futura)
-- =============================================================
INSERT INTO `Citas` (`Id`, `Codigo`, `PacienteId`, `OdontologoId`, `Fecha`, `HoraInicio`, `HoraFin`, `Tipo`, `Consultorio`, `Estado`, `Notas`, `FechaCreacion`)
VALUES
(UUID(), 'CIT-010', @pac_1, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), '09:00', '10:00', 'consulta',    'Consultorio 1', 'completada', 'Consulta inicial',              DATE_SUB(UTC_TIMESTAMP(), INTERVAL 6 DAY)),
(UUID(), 'CIT-011', @pac_2, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '11:00', '12:00', 'tratamiento', 'Consultorio 2', 'completada', 'Limpieza',                      DATE_SUB(UTC_TIMESTAMP(), INTERVAL 5 DAY)),
(UUID(), 'CIT-012', @pac_3, @usr_doc2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), '15:00', '16:00', 'ortodoncia',  'Consultorio 1', 'completada', 'Ajuste de brackets',            DATE_SUB(UTC_TIMESTAMP(), INTERVAL 4 DAY)),
(UUID(), 'CIT-013', @pac_4, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '08:30', '09:30', 'consulta',    'Consultorio 1', 'completada', 'Evaluación previa a extracción', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 DAY)),
(UUID(), 'CIT-014', @pac_1, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '10:00', '11:00', 'tratamiento', 'Consultorio 1', 'completada', 'Curación',                      DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 DAY)),
(UUID(), 'CIT-015', @pac_4, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '11:30', '12:30', 'cirugia',     'Consultorio 1', 'completada', 'Extracción pieza 38',           DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 DAY)),
(UUID(), 'CIT-016', @pac_5, @usr_doc2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '16:00', '16:45', 'consulta',    'Consultorio 2', 'completada', 'Primera visita odontopediatría', DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY)),
(UUID(), 'CIT-017', @pac_2, @usr_doc1, CURDATE(),                          '14:00', '15:00', 'consulta',    'Consultorio 2', 'programada', 'Control general',               UTC_TIMESTAMP()),
(UUID(), 'CIT-018', @pac_3, @usr_doc2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:30', '10:30', 'ortodoncia',  'Consultorio 1', 'programada', 'Control mensual de brackets',   UTC_TIMESTAMP());

-- =============================================================
--  4. HISTORIAL CLÍNICO
-- =============================================================
INSERT INTO `HistorialesClinicos` (`Id`, `PacienteId`, `OdontologoId`, `Fecha`, `Tipo`, `Descripcion`, `Diagnostico`, `Tratamiento`, `Notas`)
VALUES
(UUID(), @pac_1, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'consulta',    'Dolor en molar inferior derecho',      'Caries profunda en pieza 46',        'Curación con resina',            'Cita de seguimiento'),
(UUID(), @pac_2, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'tratamiento', 'Limpieza dental de rutina',             'Gingivitis leve',                     'Profilaxis y destartraje',       'Mejorar técnica de cepillado'),
(UUID(), @pac_3, @usr_doc2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'ortodoncia',  'Control mensual de brackets',           'Progreso normal del tratamiento',     'Ajuste de arco y ligaduras',     'Próximo control en 4 semanas'),
(UUID(), @pac_4, @usr_doc1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'cirugia',     'Dolor y semi-erupción de pieza 38',     'Tercer molar retenido',               'Extracción quirúrgica pieza 38', 'Reposo 48 horas, control en 1 semana'),
(UUID(), @pac_5, @usr_doc2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'consulta',    'Evaluación odontopediátrica inicial',   'Sin caries, erupción dental normal',  'Aplicación de flúor',            'Control preventivo cada 6 meses');

-- =============================================================
--  5. RECETAS MÉDICAS
-- =============================================================
SET @receta_1 = UUID();
SET @receta_2 = UUID();

INSERT INTO `RecetasMedicas` (`Id`, `Codigo`, `PacienteId`, `OdontologoId`, `Indicaciones`, `Fecha`, `Firmada`)
VALUES
(@receta_1, 'REC-001', @pac_1, @usr_doc1, 'Tomar después de las comidas',              DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1),
(@receta_2, 'REC-002', @pac_4, @usr_doc1, 'Reposo relativo, aplicar frío local 24h',   DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1);

INSERT INTO `RecetaMedicamentos` (`Id`, `RecetaId`, `Nombre`, `Dosis`, `Frecuencia`, `Duracion`, `Instrucciones`)
VALUES
(UUID(), @receta_1, 'Ibuprofeno',    '400mg', 'Cada 8 horas',  '3 días', 'Para el dolor de la curación'),
(UUID(), @receta_2, 'Amoxicilina',   '500mg', 'Cada 8 horas',  '7 días', 'Antibiótico post-extracción'),
(UUID(), @receta_2, 'Ibuprofeno',    '600mg', 'Cada 8 horas',  '4 días', 'Para el dolor y la inflamación');

-- =============================================================
--  6. FACTURAS + DETALLES (Generando ingresos durante la semana)
-- =============================================================
SET @fac_1 = UUID();
SET @fac_2 = UUID();
SET @fac_3 = UUID();
SET @fac_4 = UUID();
SET @fac_5 = UUID();
SET @fac_6 = UUID();

INSERT INTO `Facturas` (`Id`, `Numero`, `PacienteId`, `Subtotal`, `Descuento`, `Total`, `MetodoPago`, `Estado`, `Notas`, `FechaEmision`, `FechaPago`)
VALUES
(@fac_1, 'FAC-1001', @pac_1, 150.00, 0.00,  150.00, 'tarjeta',       'pagada',   'Consulta inicial',        DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(@fac_2, 'FAC-1002', @pac_2, 200.00, 20.00, 180.00, 'efectivo',      'pagada',   'Limpieza dental con dcto', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(@fac_3, 'FAC-1003', @pac_3, 300.00, 0.00,  300.00, 'transferencia', 'pagada',   'Cuota de Ortodoncia',     DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@fac_4, 'FAC-1004', @pac_4, 380.00, 0.00,  380.00, 'tarjeta',       'pagada',   'Evaluación + extracción', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@fac_5, 'FAC-1005', @pac_1, 250.00, 0.00,  250.00, 'tarjeta',       'pagada',   'Curación con resina',     DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@fac_6, 'FAC-1006', @pac_5, 120.00, 0.00,  120.00, 'efectivo',      'pendiente','Consulta odontopediátrica', DATE_SUB(CURDATE(), INTERVAL 1 DAY), NULL);

INSERT INTO `FacturaDetalles` (`Id`, `FacturaId`, `Descripcion`, `Cantidad`, `Precio`)
VALUES
(UUID(), @fac_1, 'Consulta odontológica inicial',    1, 150.00),
(UUID(), @fac_2, 'Profilaxis y destartraje',         1, 200.00),
(UUID(), @fac_3, 'Cuota mensual de ortodoncia',      1, 300.00),
(UUID(), @fac_4, 'Evaluación pre-quirúrgica',        1, 80.00),
(UUID(), @fac_4, 'Extracción quirúrgica pieza 38',   1, 300.00),
(UUID(), @fac_5, 'Curación con resina compuesta',    1, 250.00),
(UUID(), @fac_6, 'Consulta odontopediátrica + flúor',1, 120.00);

-- =============================================================
--  7. INVENTARIO (vinculado a proveedores)
-- =============================================================
INSERT INTO `ArticulosInventario` (`Id`, `SKU`, `Categoria`, `Nombre`, `Unidad`, `StockActual`, `StockMinimo`, `PrecioUnitario`, `ProveedorId`, `Ubicacion`, `Estado`, `UltimaActualizacion`)
VALUES
(UUID(), 'INV-001', 'Bioseguridad',    'Guantes de Nitrilo Talla M', 'Caja',        8, 15, 35.00, @prov_2, 'Almacén A - Estante 1', 'critico', UTC_TIMESTAMP()),
(UUID(), 'INV-002', 'Bioseguridad',    'Mascarillas N95',            'Caja',       40, 20, 25.00, @prov_2, 'Almacén A - Estante 1', 'normal',  UTC_TIMESTAMP()),
(UUID(), 'INV-003', 'Material Clínico','Alginato para impresiones',  'Bolsa 500g', 12, 10, 40.00, @prov_1, 'Almacén B - Estante 3', 'bajo',    UTC_TIMESTAMP()),
(UUID(), 'INV-004', 'Material Clínico','Resina compuesta A2',        'Jeringa 4g', 25, 10, 55.00, @prov_1, 'Almacén B - Estante 2', 'normal',  UTC_TIMESTAMP()),
(UUID(), 'INV-005', 'Ortodoncia',      'Brackets metálicos',         'Set',         6,  8, 90.00, @prov_1, 'Almacén B - Estante 4', 'bajo',    UTC_TIMESTAMP());

SELECT 'Datos de prueba (1 semana) insertados correctamente.' AS resultado;