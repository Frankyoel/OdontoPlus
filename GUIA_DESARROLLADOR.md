# 🚀 Guía Rápida para Desarrolladores: OdontoPlus

¡Hola! Si acabas de unirte al proyecto o necesitas entender cómo funciona todo por debajo del capó, esta guía es para ti. Aquí te explicamos cómo está estructurado **OdontoPlus**, qué tecnologías usamos y cómo levantar el proyecto en tu máquina.

---

## 🏗️ 1. Arquitectura General

OdontoPlus es una aplicación web basada en una arquitectura **Cliente-Servidor (API REST)** separada en dos carpetas principales. No usamos vistas acopladas (como Razor Pages de C# o PHP tradicional). En cambio, tenemos un backend puro que escupe JSON y un frontend puro que lo consume.

### Stack Tecnológico
*   **Backend:** C# con ASP.NET Core (API REST).
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5 y CSS3 (¡Cero frameworks como React o Angular! Todo a mano pero estructurado como una SPA).
*   **Base de Datos:** MySQL 8.0.
*   **ORM:** Entity Framework Core (Code First con Pomelo MySQL).
*   **Seguridad:** JSON Web Tokens (JWT) y ASP.NET Core Identity (Hashes).

---

## 📁 2. Estructura de Carpetas

Si abres la carpeta del proyecto, verás dos grandes mundos:

### `/backend` (El Servidor)
Contiene todo el código de C#.
*   **`Controllers/`**: Son los controladores de la API (`PatientsController`, `AppointmentsController`). Reciben las peticiones HTTP del frontend y devuelven respuestas HTTP.
*   **`Data/`**: Contiene el `ApplicationDbContext.cs`, que es el puente entre C# y la base de datos MySQL usando Entity Framework.
*   **`Models/`**: Aquí están las clases (Entidades) que representan las tablas de la BD (`Paciente`, `Cita`, `Factura`, `ApplicationUser`).
*   **`Repositories/`**: Implementamos el **Patrón Repositorio**. Aquí encapsulamos las consultas a la BD (`GetAllAsync`, `GetByIdAsync`) para que los controladores no dependan directamente del contexto de Entity Framework.
*   **`Services/`**: Lógica extra, como el `AuthService` para generar los JWT, y la implementación del **Patrón Unit Of Work** que asegura que se guarden los datos en una sola transacción segura.
*   **`Program.cs`**: El corazón del servidor. Configura los servicios, el CORS, JWT y arranca la API.

### `/frontend` (El Cliente)
Contiene la Single Page Application (SPA). Funciona simplemente abriendo el `index.html`.
*   **`assets/css/`**: Todo el diseño. Tienes un archivo `tokens.css` (variables de color) y `components.css`.
*   **`assets/js/core/`**: El motor del frontend.
    *   `router.js`: Simula un enrutador. Cambia el contenido de la pantalla sin recargar la página.
    *   `apiClient.js`: Una envoltura (wrapper) sobre `fetch`. Automáticamente le inyecta el Token JWT a todas las peticiones para que no tengas que hacerlo manualmente.
    *   `auth.js`: Guarda el token y maneja la sesión.
*   **`pages/`**: Contiene la lógica de cada "pantalla" (Ej. `patients.js`, `appointments.js`, `reports.js`). Cada una tiene un método `render()` que dibuja el HTML en el DOM.

---

## 🧠 3. Patrones de Diseño Aplicados

Para que el profesor nos ponga buena nota, hemos usado estándares profesionales:
1.  **MVC (Modelo-Vista-Controlador):** Usado conceptualmente. El backend tiene Modelos y Controladores, y el frontend actúa como las Vistas.
2.  **Patrón Unit of Work y Repositorio:** En la carpeta `backend/Repositories`. Oculta las consultas SQL y protege la integridad de los datos.
3.  **Patrón Strategy:** Lo usamos indirectamente para la gestión de permisos, permitiendo que la interfaz bloquee botones (como "Borrar Factura") dependiendo del Rol (`Auth.getCurrentRole()`).
4.  **Patrón Singleton:** Usado en C# al registrar los servicios de configuración globales.

---

## 🛠️ 4. Flujo de los Datos (Cómo se comunican)

Imagínate que un usuario quiere ver la lista de pacientes:
1.  **Frontend:** El archivo `patients.js` ejecuta `PatientService.getAll()`.
2.  **ApiClient:** Esa función usa `apiClient.js`, que toma el Token JWT del navegador y hace un `GET` a `http://localhost:5032/api/pacientes`.
3.  **Backend:** `PatientsController.cs` intercepta la petición. Verifica el Token. Si es válido, llama a `_unitOfWork.Pacientes.GetAllAsync()`.
4.  **Base de Datos:** EF Core traduce eso a SQL (`SELECT * FROM Pacientes`), obtiene los datos de MySQL y los devuelve al controlador.
5.  **Respuesta:** El controlador devuelve un Array JSON. El frontend lo recibe, lo convierte en una tabla HTML y lo muestra en pantalla sin recargar la página web.

---

## 🚀 5. Cómo levantar el proyecto de cero

Si vas a probarlo en tu máquina, sigue este estricto orden:

### Paso 1: Base de Datos
1.  Abre MySQL Workbench.
2.  Ejecuta el archivo **`odontoplus_Tablas.sql`**. (Esto creará la base de datos `odontoplus_db` y las tablas vacías).
3.  **IMPORTANTE:** Aún no ejecutes el script de datos.

### Paso 2: El Backend
1.  Abre Visual Studio (o VS Code) en la carpeta `/backend`.
2.  Revisa el archivo `appsettings.json` y asegúrate de que el usuario y contraseña del `MySqlConnection` coincidan con tu instalación local de MySQL.
3.  Ejecuta el proyecto (Botón **Play ▶️** o `dotnet run`). Debe abrirse una consola negra o el navegador mostrando "OdontoPlus API Running". Déjalo encendido.

### Paso 3: Datos de Prueba (Semilla)
1.  Con el backend encendido, vuelve a MySQL Workbench.
2.  Ejecuta el archivo **`odontoplus_Datos.sql`**. Esto insertará a los usuarios, pacientes, facturas y citas de prueba. (Las contraseñas de los usuarios son `admin123`, `doctor123`, `recepcion123`).

### Paso 4: El Frontend
1.  Abre la carpeta raíz en Visual Studio Code.
2.  Usa la extensión **Live Server** dando clic derecho en `index.html` > *Open with Live Server*.
3.  ¡Listo! Ya puedes iniciar sesión con `admin@odontoplus.pe` y contraseña `admin123`.

---
*¡Con esto ya tienes el 90% del sistema dominado! Échale un vistazo al código, está súper limpio.*
