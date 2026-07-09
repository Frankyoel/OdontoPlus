-- =============================================================
--  OdontoPlus — Schema MySQL
--  Generado manualmente a partir de las migraciones EF Core
--  Ejecutar en MySQL Workbench / DBeaver / mysql CLI
-- =============================================================

-- 1. Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS `odontoplus_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `odontoplus_db`;

-- =============================================================
--  TABLA: Historial de migraciones EF Core
-- =============================================================
CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId`    varchar(150) NOT NULL,
    `ProductVersion` varchar(32)  NOT NULL,
    PRIMARY KEY (`MigrationId`)
) CHARACTER SET utf8mb4;

-- =============================================================
--  TABLAS DE IDENTIDAD (ASP.NET Core Identity)
-- =============================================================

CREATE TABLE IF NOT EXISTS `AspNetRoles` (
    `Id`               varchar(255) NOT NULL,
    `Name`             varchar(256) NULL,
    `NormalizedName`   varchar(256) NULL,
    `ConcurrencyStamp` longtext     NULL,
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `RoleNameIndex` (`NormalizedName`)
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetUsers` (
    `Id`                   varchar(255) NOT NULL,
    `Especialidad`         longtext     NULL,
    `Consultorio`          longtext     NULL,
    `Avatar`               longtext     NULL,
    `Activo`               tinyint(1)   NOT NULL DEFAULT 1,
    `UserName`             varchar(256) NULL,
    `NormalizedUserName`   varchar(256) NULL,
    `Email`                varchar(256) NULL,
    `NormalizedEmail`      varchar(256) NULL,
    `EmailConfirmed`       tinyint(1)   NOT NULL DEFAULT 0,
    `PasswordHash`         longtext     NULL,
    `SecurityStamp`        longtext     NULL,
    `ConcurrencyStamp`     longtext     NULL,
    `PhoneNumber`          longtext     NULL,
    `PhoneNumberConfirmed` tinyint(1)   NOT NULL DEFAULT 0,
    `TwoFactorEnabled`     tinyint(1)   NOT NULL DEFAULT 0,
    `LockoutEnd`           datetime(6)  NULL,
    `LockoutEnabled`       tinyint(1)   NOT NULL DEFAULT 0,
    `AccessFailedCount`    int          NOT NULL DEFAULT 0,
    PRIMARY KEY (`Id`),
    INDEX `EmailIndex` (`NormalizedEmail`),
    UNIQUE INDEX `UserNameIndex` (`NormalizedUserName`)
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetRoleClaims` (
    `Id`         int          NOT NULL AUTO_INCREMENT,
    `RoleId`     varchar(255) NOT NULL,
    `ClaimType`  longtext     NULL,
    `ClaimValue` longtext     NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_AspNetRoleClaims_RoleId` (`RoleId`),
    CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId`
        FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetUserClaims` (
    `Id`         int          NOT NULL AUTO_INCREMENT,
    `UserId`     varchar(255) NOT NULL,
    `ClaimType`  longtext     NULL,
    `ClaimValue` longtext     NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_AspNetUserClaims_UserId` (`UserId`),
    CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId`
        FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetUserLogins` (
    `LoginProvider`       varchar(255) NOT NULL,
    `ProviderKey`         varchar(255) NOT NULL,
    `ProviderDisplayName` longtext     NULL,
    `UserId`              varchar(255) NOT NULL,
    PRIMARY KEY (`LoginProvider`, `ProviderKey`),
    INDEX `IX_AspNetUserLogins_UserId` (`UserId`),
    CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId`
        FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetUserRoles` (
    `UserId` varchar(255) NOT NULL,
    `RoleId` varchar(255) NOT NULL,
    PRIMARY KEY (`UserId`, `RoleId`),
    INDEX `IX_AspNetUserRoles_RoleId` (`RoleId`),
    CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId`
        FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId`
        FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `AspNetUserTokens` (
    `UserId`        varchar(255) NOT NULL,
    `LoginProvider` varchar(255) NOT NULL,
    `Name`          varchar(255) NOT NULL,
    `Value`         longtext     NULL,
    PRIMARY KEY (`UserId`, `LoginProvider`, `Name`),
    CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId`
        FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

-- =============================================================
--  TABLAS DE NEGOCIO
-- =============================================================

CREATE TABLE IF NOT EXISTS `Pacientes` (
    `Id`              char(36)     NOT NULL,
    `Codigo`          varchar(20)  NOT NULL,
    `Nombre`          varchar(100) NOT NULL,
    `Apellido`        varchar(100) NOT NULL,
    `DNI`             varchar(20)  NOT NULL,
    `FechaNacimiento` datetime(6)  NOT NULL,
    `Sexo`            varchar(1)   NULL,
    `Telefono`        varchar(20)  NULL,
    `Email`           varchar(150) NULL,
    `Direccion`       longtext     NULL,
    `TipoSangre`      varchar(5)   NULL,
    `Alergias`        longtext     NULL,
    `Observaciones`   longtext     NULL,
    `Activo`          tinyint(1)   NOT NULL DEFAULT 1,
    `FechaRegistro`   datetime(6)  NOT NULL DEFAULT NOW(6),
    `UltimaVisita`    datetime(6)  NULL,
    PRIMARY KEY (`Id`)
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `Proveedores` (
    `Id`            char(36)     NOT NULL,
    `Codigo`        varchar(20)  NOT NULL,
    `Nombre`        varchar(150) NOT NULL,
    `Contacto`      varchar(150) NULL,
    `Telefono`      varchar(20)  NULL,
    `Email`         varchar(150) NULL,
    `Ruc`           varchar(20)  NOT NULL,
    `Direccion`     longtext     NULL,
    `Activo`        tinyint(1)   NOT NULL DEFAULT 1,
    `FechaRegistro` datetime(6)  NOT NULL DEFAULT NOW(6),
    PRIMARY KEY (`Id`)
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `Citas` (
    `Id`            char(36)    NOT NULL,
    `Codigo`        varchar(20) NOT NULL,
    `PacienteId`    char(36)    NOT NULL,
    `OdontologoId`  varchar(255) NOT NULL,
    `Fecha`         datetime(6) NOT NULL,
    `HoraInicio`    time(6)     NOT NULL,
    `HoraFin`       time(6)     NOT NULL,
    `Tipo`          varchar(50) NOT NULL,
    `Consultorio`   varchar(50) NULL,
    `Estado`        varchar(50) NOT NULL DEFAULT 'programada',
    `Notas`         longtext    NULL,
    `FechaCreacion` datetime(6) NOT NULL DEFAULT NOW(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_Citas_PacienteId`   (`PacienteId`),
    INDEX `IX_Citas_OdontologoId` (`OdontologoId`),
    CONSTRAINT `FK_Citas_Pacientes_PacienteId`
        FOREIGN KEY (`PacienteId`) REFERENCES `Pacientes` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Citas_AspNetUsers_OdontologoId`
        FOREIGN KEY (`OdontologoId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `ArticulosInventario` (
    `Id`                  char(36)     NOT NULL,
    `SKU`                 varchar(50)  NULL,
    `Nombre`              varchar(150) NOT NULL,
    `Categoria`           varchar(50)  NOT NULL,
    `Unidad`              varchar(20)  NOT NULL,
    `StockActual`         int          NOT NULL DEFAULT 0,
    `StockMinimo`         int          NOT NULL DEFAULT 0,
    `PrecioUnitario`      decimal(18,2) NOT NULL DEFAULT 0.00,
    `ProveedorId`         char(36)     NULL,
    `Ubicacion`           varchar(100) NULL,
    `Estado`              varchar(20)  NULL,
    `UltimaActualizacion` datetime(6)  NOT NULL DEFAULT NOW(6),
    PRIMARY KEY (`Id`),
    INDEX `IX_ArticulosInventario_ProveedorId` (`ProveedorId`),
    CONSTRAINT `FK_ArticulosInventario_Proveedores_ProveedorId`
        FOREIGN KEY (`ProveedorId`) REFERENCES `Proveedores` (`Id`) ON DELETE SET NULL
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `Facturas` (
    `Id`          char(36)     NOT NULL,
    `Numero`      varchar(20)  NOT NULL,
    `PacienteId`  char(36)     NOT NULL,
    `Subtotal`    decimal(18,2) NOT NULL DEFAULT 0.00,
    `Descuento`   decimal(18,2) NOT NULL DEFAULT 0.00,
    `Total`       decimal(18,2) NOT NULL DEFAULT 0.00,
    `MetodoPago`  varchar(50)  NOT NULL,
    `Estado`      varchar(20)  NOT NULL DEFAULT 'pendiente',
    `Notas`       longtext     NULL,
    `FechaEmision` datetime(6) NOT NULL DEFAULT NOW(6),
    `FechaPago`   datetime(6)  NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_Facturas_PacienteId` (`PacienteId`),
    CONSTRAINT `FK_Facturas_Pacientes_PacienteId`
        FOREIGN KEY (`PacienteId`) REFERENCES `Pacientes` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `FacturaDetalles` (
    `Id`          char(36)     NOT NULL,
    `FacturaId`   char(36)     NOT NULL,
    `Descripcion` varchar(255) NOT NULL,
    `Cantidad`    int          NOT NULL DEFAULT 1,
    `Precio`      decimal(18,2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (`Id`),
    INDEX `IX_FacturaDetalles_FacturaId` (`FacturaId`),
    CONSTRAINT `FK_FacturaDetalles_Facturas_FacturaId`
        FOREIGN KEY (`FacturaId`) REFERENCES `Facturas` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `HistorialesClinicos` (
    `Id`           char(36)     NOT NULL,
    `PacienteId`   char(36)     NOT NULL,
    `OdontologoId` varchar(255) NOT NULL,
    `Fecha`        datetime(6)  NOT NULL,
    `Tipo`         varchar(50)  NOT NULL,
    `Descripcion`  longtext     NOT NULL,
    `Diagnostico`  longtext     NULL,
    `Tratamiento`  longtext     NULL,
    `Notas`        longtext     NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_HistorialesClinicos_PacienteId`   (`PacienteId`),
    INDEX `IX_HistorialesClinicos_OdontologoId` (`OdontologoId`),
    CONSTRAINT `FK_HistorialesClinicos_Pacientes_PacienteId`
        FOREIGN KEY (`PacienteId`) REFERENCES `Pacientes` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_HistorialesClinicos_AspNetUsers_OdontologoId`
        FOREIGN KEY (`OdontologoId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `RecetasMedicas` (
    `Id`           char(36)    NOT NULL,
    `Codigo`       varchar(20) NOT NULL,
    `PacienteId`   char(36)    NOT NULL,
    `OdontologoId` varchar(255) NOT NULL,
    `Indicaciones` longtext    NULL,
    `Fecha`        datetime(6) NOT NULL,
    `Firmada`      tinyint(1)  NOT NULL DEFAULT 0,
    PRIMARY KEY (`Id`),
    INDEX `IX_RecetasMedicas_PacienteId`   (`PacienteId`),
    INDEX `IX_RecetasMedicas_OdontologoId` (`OdontologoId`),
    CONSTRAINT `FK_RecetasMedicas_Pacientes_PacienteId`
        FOREIGN KEY (`PacienteId`) REFERENCES `Pacientes` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RecetasMedicas_AspNetUsers_OdontologoId`
        FOREIGN KEY (`OdontologoId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS `RecetaMedicamentos` (
    `Id`            char(36)     NOT NULL,
    `RecetaId`      char(36)     NOT NULL,
    `Nombre`        varchar(150) NOT NULL,
    `Dosis`         varchar(100) NULL,
    `Frecuencia`    varchar(100) NULL,
    `Duracion`      varchar(100) NULL,
    `Instrucciones` longtext     NULL,
    PRIMARY KEY (`Id`),
    INDEX `IX_RecetaMedicamentos_RecetaId` (`RecetaId`),
    CONSTRAINT `FK_RecetaMedicamentos_RecetasMedicas_RecetaId`
        FOREIGN KEY (`RecetaId`) REFERENCES `RecetasMedicas` (`Id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;

-- =============================================================
--  Registro en historial EF Core (para que dotnet ef lo reconozca)
-- =============================================================
INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260708231329_InitialMySQL', '9.0.0');

SELECT 'Schema odontoplus_db creado exitosamente.' AS resultado;
