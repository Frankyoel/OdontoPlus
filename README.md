# OdontoPlus — Sistema de Gestión Clínica Integral

## Descripción General
**OdontoPlus** es una aplicación diseñada para optimizar y centralizar la administración de centros odontológicos modernos. Resuelve la fragmentación de la información facilitando la gestión de la agenda de citas, el control detallado de historiales clínicos, la facturación integrada de tratamientos y el monitoreo de stocks en el almacén de insumos, todo adaptado a roles específicos con diferentes niveles de acceso.

---

## Requisitos Previos
* **.NET 8.0 SDK** (instalado en el equipo local).
* **Navegador Web Moderno** (Chrome, Firefox, Edge, etc.).
* **Live Server** (extensión de VS Code) o cualquier servidor HTTP local simple para servir el frontend de manera estática.

---

## Instrucciones de Lanzamiento

### 1. Iniciar el Backend (API REST)
Abre una terminal en la raíz del proyecto y ejecuta los siguientes comandos:
```bash
# Navegar al directorio del backend
cd backend

# Restaurar paquetes NuGet
dotnet restore

# (Opcional - la base ya viene creada) Actualizar o regenerar la base de datos SQLite
dotnet ef database update

# Ejecutar el servidor backend
dotnet run
```
*El backend quedará escuchando por defecto en la dirección: **`http://localhost:5000`**.*

### 1.1 Configurar el motor de Base de Datos (SQLite / SQL Server)
El sistema soporta de manera híbrida **SQLite** y **SQL Server**. Para cambiar de motor:
1. Abre [appsettings.json](file:///home/frankyoel/Documentos/OtrosProyectos/Pagina%20web-OdontoPlus/backend/appsettings.json).
2. Modifica la propiedad `"DatabaseProvider"` a `"Sqlite"` o `"SqlServer"`.
3. Ajusta la cadena de conexión correspondiente en `"ConnectionStrings"`.
4. Si cambiaste a SQL Server, aplica la estructura ejecutando en la consola `/backend`:
   ```bash
   dotnet ef database update
   ```

### 2. Iniciar el Frontend (SPA)
1. Abre la raíz del proyecto en tu editor de código preferido (como Visual Studio Code).
2. Haz clic derecho sobre el archivo `index.html` y selecciona **Open with Live Server**.
3. El frontend se abrirá automáticamente en tu navegador (usualmente en `http://127.0.0.1:5500` o similar).

---

## Cuentas de Demostración (Seed Data)
El backend inicializa automáticamente las siguientes 5 cuentas con roles distintos al primer arranque del servidor:

| Rol | Correo Electrónico | Contraseña | Nivel de Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** (admin) | `admin@odontoplus.pe` | `admin123` | Control total del sistema |
| **Odontólogo** (doctor) | `dra.torres@odontoplus.pe` | `doctor123` | Pacientes, citas e historiales médicos |
| **Recepcionista** (receptionist) | `recepcion@odontoplus.pe` | `recepcion123` | Agenda de citas, registro de pacientes y pagos |
| **Asistente Dental** (assistant) | `lucia.paredes@odontoplus.pe` | `asistente123` | Visualización de agenda e historial clínico |
| **Jefe de Almacén** (warehouse) | `almacen@odontoplus.pe` | `almacen123` | Exclusivo para gestión de inventarios |
