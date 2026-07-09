-- =============================================================
--  OdontoPlus — Script de Datos Iniciales (Semilla)
--  Ejecutar en MySQL Workbench / DBeaver
-- =============================================================

USE `odontoplus_db`;

-- Variables para IDs
SET @paciente1_id = UUID();
SET @paciente2_id = UUID();
SET @articulo1_id = UUID();
SET @articulo2_id = UUID();
SET @cita1_id = UUID();
SET @factura1_id = UUID();

-- =============================================================
--  1. PACIENTES
-- =============================================================
INSERT INTO `Pacientes` (`Id`, `Codigo`, `Nombre`, `Apellido`, `DNI`, `FechaNacimiento`, `Sexo`, `Telefono`, `Email`, `Direccion`, `TipoSangre`, `Alergias`, `Observaciones`, `Activo`, `FechaRegistro`, `UltimaVisita`)
VALUES 
(@paciente1_id, 'PAC-001', 'Carlos', 'Gómez', '72345678', '1990-05-15', 'M', '987654321', 'carlos@gmail.com', 'Av. Siempre Viva 123', 'O+', 'Ninguna', 'Paciente regular', 1, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
(@paciente2_id, 'PAC-002', 'María', 'López', '78654321', '1985-08-22', 'F', '912345678', 'maria@hotmail.com', 'Calle Los Pinos 456', 'A+', 'Penicilina', 'Requiere atención especial', 1, UTC_TIMESTAMP(), NULL);

-- =============================================================
--  2. INVENTARIO
-- =============================================================
INSERT INTO `ArticulosInventario` (`Id`, `Codigo`, `Categoria`, `Nombre`, `Descripcion`, `Unidad`, `StockActual`, `StockMinimo`, `PrecioUnitario`, `UltimaActualizacion`, `Estado`)
VALUES 
(@articulo1_id, 'INV-001', 'Material Clínico', 'Resina Compuesta A2', 'Resina para restauraciones', 'Jeringa', 5, 10, 45.00, UTC_TIMESTAMP(), 'bajo'),
(@articulo2_id, 'INV-002', 'Anestesia', 'Lidocaína 2%', 'Anestesia local con epinefrina', 'Caja x 50', 30, 15, 120.00, UTC_TIMESTAMP(), 'normal');

-- =============================================================
--  3. CITAS (Para HOY)
-- =============================================================
-- Nota: En C# usamos string para HoraInicio/HoraFin (Ej. "10:00")
INSERT INTO `Citas` (`Id`, `Codigo`, `PacienteId`, `OdontologoId`, `Fecha`, `HoraInicio`, `HoraFin`, `Tipo`, `Estado`, `Consultorio`, `Notas`, `FechaCreacion`)
VALUES 
(@cita1_id, 'CIT-001', @paciente1_id, 'dra.torres@odontoplus.pe', CURDATE(), '10:00', '11:00', 'consulta', 'programada', 'Consultorio 1', 'Primera consulta de revisión', UTC_TIMESTAMP());

-- =============================================================
--  4. FACTURAS (Para ver ganancias hoy)
-- =============================================================
INSERT INTO `Facturas` (`Id`, `Numero`, `PacienteId`, `FechaEmision`, `Subtotal`, `Descuento`, `Total`, `Estado`, `MetodoPago`, `Notas`)
VALUES 
(@factura1_id, 'FAC-0001', @paciente1_id, CURDATE(), 100.00, 0.00, 100.00, 'pagada', 'tarjeta', 'Pago por consulta general');

-- ¡Listo! Datos de prueba insertados con éxito.
