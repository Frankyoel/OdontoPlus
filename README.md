# 🦷 OdontoPlus — Sistema de Gestión de Clínica Odontológica

Sistema web para la gestión integral de una clínica dental. Incluye módulos de agenda de citas, pacientes, inventario, facturación, reportes y configuración, con control de acceso basado en roles.

---

## 📐 Arquitectura General

El proyecto está dividido en dos capas independientes:

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| **Frontend** | HTML + CSS + JavaScript (SPA) | Servidor estático (`Live Server`) |
| **Backend** | ASP.NET Core 10 + Entity Framework Core | `http://localhost:5000` |
| **Base de Datos** | MySQL 8+ | `localhost:3306` |

```
OdontoPlus/
├── frontend/          # SPA en HTML/JS/CSS puro
│   ├── index.html
│   ├── assets/
│   │   ├── css/       # Hojas de estilo (variables, base, componentes, layout)
│   │   └── js/        # Infraestructura (app, auth, router, apiClient, services/)
│   ├── components/    # Componentes reutilizables (modal, toast, sidebar, topbar, table, charts)
│   └── pages/         # Módulos de negocio (login, dashboard, patients, appointments, inventory, billing, reports, settings)
└── backend/           # API REST en C#
    ├── Controllers/   # Controladores HTTP
    ├── Models/        # Entidades de la base de datos
    ├── Data/          # DbContext (EF Core)
    ├── Repositories/  # Patrón Repositorio + Unidad de Trabajo
    ├── Services/      # Servicios singleton
    ├── Strategies/    # Patrón Strategy (permisos por rol)
    └── Migrations/    # Historial de migraciones de EF Core
```

---

## 🚀 Ejecución del Proyecto

### Prerrequisitos
- .NET 8 SDK
- Un navegador moderno (Chrome, Edge, Firefox)

### Backend

```bash
cd backend
dotnet run
```

> Al iniciar, el backend conectará automáticamente a MySQL (`odontoplus_db`) utilizando las credenciales de `appsettings.json`.
>
> **💡 Datos de Prueba:** Si es la primera vez que ejecutas el sistema, puedes usar el script `seed_datos.sql` provisto en la carpeta principal. Ábrelo y ejecútalo en MySQL Workbench para llenar la base de datos con algunos pacientes, citas, artículos y facturas de demostración.

### Frontend

Abrir `frontend/index.html` directamente en el navegador, o servirlo con cualquier servidor estático (ej. extensión **Live Server** de VS Code).

---

## 🔑 Usuarios de Prueba (Semilla)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin@odontoplus.pe` | `admin123` |
| Odontólogo | `dra.torres@odontoplus.pe` | `doctor123` |
| Recepcionista | `recepcion@odontoplus.pe` | `recepcion123` |
| Asistente Dental | `lucia.paredes@odontoplus.pe` | `asistente123` |
| Almacenero | `almacen@odontoplus.pe` | `almacen123` |

---

## 🧩 Módulos del Sistema

### Frontend — Páginas (`frontend/pages/`)

| Archivo | Módulo | Descripción |
|---------|--------|-------------|
| `login.js` | Login | Formulario de autenticación. Consume `POST /api/auth/login` y guarda el JWT en `sessionStorage`. |
| `dashboard.js` | Dashboard | Panel de estadísticas generales: citas del día, métricas de ingresos, gráficas resumen. |
| `patients.js` | Pacientes | CRUD completo de pacientes (búsqueda, registro, edición, historial clínico, recetas). |
| `appointments.js` | Agenda | Gestión de citas: vista calendario/lista, creación y modificación de turnos. |
| `inventory.js` | Inventario | Administración de artículos: stock, SKU, categorías, alertas de stock mínimo, proveedores. |
| `billing.js` | Facturación | Emisión y consulta de facturas, detalle de servicios, métodos de pago. |
| `reports.js` | Reportes | Generación de reportes estadísticos por módulo (citas, ingresos, inventario). |
| `settings.js` | Configuración | Ajustes del sistema: datos de la clínica, tasa de IGV, gestión de usuarios/roles. |

### Frontend — Componentes Reutilizables (`frontend/components/`)

| Archivo | Descripción |
|---------|-------------|
| `sidebar.js` | Barra lateral de navegación. Renderiza las opciones según los permisos del usuario activo. |
| `topbar.js` | Barra superior con nombre de usuario y botón de cierre de sesión. |
| `modal.js` | Sistema de modales genérico usado por todos los módulos. |
| `toast.js` | Notificaciones emergentes (éxito, error, advertencia). |
| `table.js` | Componente de tabla configurable con búsqueda y paginación. |
| `charts.js` | Utilidad para renderizar gráficas en el dashboard (envuelve/extiende Chart.js). |

### Frontend — Utilidades (`frontend/assets/js/`)

| Archivo | Descripción |
|---------|-------------|
| `app.js` | Punto de entrada. Inicializa la aplicación y verifica autenticación. |
| `router.js` | Enrutador SPA. Mapea rutas hash a páginas y gestiona la carga dinámica de módulos. |
| `auth.js` | Gestión de sesión: login y autenticación real con JWT guardado en `sessionStorage`. |
| `apiClient.js` | Cliente HTTP centralizado que inyecta automáticamente el JWT y maneja errores (401, 403, 500). |
| `config.js` | Configuración general del cliente (URL base de la API). |
| `services/` | Wrappers asíncronos para cada módulo de la API (`patientService`, `appointmentService`, etc.). |
| `permissions.js` | Verifica los permisos del usuario activo para controlar visibilidad de rutas y acciones. |
| `theme.js` | Gestión del tema claro/oscuro (persiste preferencia en `localStorage`). |

---

## ⚙️ Backend — API REST

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Autentica al usuario y retorna un JWT + objeto de permisos. |

**Respuesta de login:**
```json
{
  "token": "<JWT>",
  "user": { "userId": "...", "nombre": "...", "email": "...", "rol": "admin" },
  "permissions": {
    "dashboard": { "ver": true },
    "pacientes": { "ver": true, "crear": true, "editar": true, "eliminar": true },
    "agenda":    { "ver": true },
    "inventario":{ "ver": true },
    "facturacion":{ "ver": true },
    "reportes":  { "ver": true },
    "configuracion": { "ver": true }
  }
}
```

### Controladores y Endpoints

| Controlador | Ruta base | Roles permitidos | Operaciones |
|---|---|---|---|
| `AuthController` | `/api/auth` | — (público) | Login |
| `UsuariosController` | `/api/usuarios` | autenticados | Obtener usuarios y odontólogos |
| `DashboardController` | `/api/dashboard` | autenticados | Métricas del KPI y estadísticas |
| `PatientsController` | `/api/pacientes` | admin, doctor, receptionist, assistant | GET, POST (admin/recep), PUT (admin/recep), DELETE (admin) |
| `AppointmentsController` | `/api/citas` | admin, doctor, receptionist, assistant | GET, POST, PUT, DELETE (admin/recep) |
| `InventoryController` | `/api/inventario` | admin, warehouse | GET, POST, PUT, DELETE (admin) |
| `ProveedoresController` | `/api/proveedores` | admin, warehouse | GET, POST, PUT, DELETE (admin) |
| `BillingController` | `/api/facturas` | admin, receptionist | GET, POST, PUT, DELETE (admin) |
| `ClinicalHistoryController` | `/api/clinicalhistory` | admin, doctor | GET, POST, PUT, DELETE (admin) |
| `PrescriptionsController` | `/api/recetas` | admin, doctor | GET, POST, PUT, DELETE (admin) |

---

## 🗄️ Modelos de Base de Datos

| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| `ApplicationUser` | `AspNetUsers` | Usuario del sistema (extiende Identity). Campo extra: `Activo`. |
| `Paciente` | `Pacientes` | Datos del paciente: DNI, nombre, contacto, tipo de sangre, alergias. |
| `Cita` | `Citas` | Turno médico: fecha, hora inicio/fin, tipo, consultorio, estado, odontólogo asignado. |
| `ArticuloInventario` | `ArticulosInventario` | Insumo/material: SKU, categoría, stock actual/mínimo, precio, proveedor. |
| `Proveedor` | `Proveedores` | Datos del proveedor de insumos. |
| `HistorialClinico` | `HistorialesClinicos` | Registro clínico por paciente. |
| `Factura` | `Facturas` | Comprobante de pago: subtotal, descuento, total, método de pago, estado. |
| `FacturaDetalle` | `FacturaDetalles` | Ítem de factura (detalle de servicio). Relación N:1 con Factura (cascade delete). |
| `RecetaMedica` | `RecetasMedicas` | Receta emitida por un odontólogo. |
| `RecetaMedicamento` | `RecetaMedicamentos` | Medicamento de una receta (cascade delete). |

### Diagrama de relaciones simplificado

```
Paciente ─┬─── Citas (N)          → FK: PacienteId  (Delete: Restrict)
          ├─── Historial (N)       → FK: PacienteId
          ├─── Facturas (N)        → FK: PacienteId
          └─── RecetasMedicas (N)  → FK: PacienteId

Factura ──── FacturaDetalle (N)   → FK: FacturaId    (Delete: Cascade)
RecetaMedica── RecetaMedicamento (N) → FK: RecetaId  (Delete: Cascade)
ArticuloInventario ── Proveedor   → FK: ProveedorId
Cita ──────── ApplicationUser     → FK: OdontologoId
```

---

## 🔐 Control de Acceso por Roles (Patrón Strategy)

El sistema usa el **Patrón Strategy** para determinar los permisos de cada rol. Cada rol implementa la interfaz `IRolePermissionStrategy`:

| Rol | Pacientes | Agenda | Inventario | Facturación | Reportes | Config |
|-----|:---------:|:------:|:----------:|:-----------:|:--------:|:------:|
| `admin` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `doctor` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `receptionist` | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| `assistant` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `warehouse` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

Las clases del patrón se encuentran en `backend/Strategies/RolePermissionStrategy.cs`:
- `IRolePermissionStrategy` — interfaz base
- `AdminPermissionStrategy`, `DoctorPermissionStrategy`, `ReceptionistPermissionStrategy`, `AssistantPermissionStrategy`, `WarehousePermissionStrategy` — estrategias concretas
- `RolePermissionContext` — contexto que selecciona y ejecuta la estrategia correcta

---

## 🧱 Patrones de Diseño Aplicados

| Patrón | Ubicación | Descripción |
|--------|-----------|-------------|
| **Strategy** | `backend/Strategies/` | Permisos por rol, seleccionados dinámicamente en el login |
| **Repository** | `backend/Repositories/IRepository.cs` + `Repository.cs` | Abstracción genérica del acceso a datos con EF Core |
| **Unit of Work** | `backend/Repositories/IUnitOfWork.cs` + `UnitOfWork.cs` | Agrupa los repositorios y controla el `SaveChanges` |
| **Singleton** | `backend/Services/GlobalSettingsService.cs` | Configuración global de la clínica (nombre, IGV, moneda) |
| **SPA / Router** | `frontend/assets/js/router.js` | Enrutamiento hash-based en el frontend sin recarga de página |

---

## ⚙️ Configuración (`backend/appsettings.json`)

```json
{
  "Jwt": {
    "Key": "OdontoPlusSecretKey1234567890!_MuySegura_123",
    "Issuer": "OdontoPlusAPI",
    "Audience": "OdontoPlusSPA",
    "ExpireDays": 7
  },
  "ConnectionStrings": {
    "MySqlConnection": "Server=localhost;Port=3306;Database=odontoplus_db;User=root;Password=UPENINOS;"
  }
}
```

La aplicación utiliza **MySQL**. Para que el sistema inicie sin problemas, el servidor MySQL local debe estar activo con un entorno que coincida con los parámetros de la cadena de conexión.

---

## 📌 Tecnologías Utilizadas

### Backend
- ASP.NET Core 10
- Entity Framework Core 9 (MySQL - Pomelo)
- ASP.NET Core Identity (gestión de usuarios y roles)
- JWT Bearer Authentication
- C# 12

### Frontend
- HTML5 + CSS3 (Vanilla)
- JavaScript ES6+ (sin frameworks)
- Google Fonts: **Inter**
- Material Symbols (iconografía)
- Chart.js (gráficas del dashboard)
