# OdontoPlus — Sistema de Gestión Clínica Integral (Frontend Autónomo)

## Descripción General
**OdontoPlus** es una aplicación diseñada para optimizar y centralizar la administración de centros odontológicos modernos. Esta rama (`frontend_limpio`) contiene una versión puramente de frontend que funciona de forma autónoma (sin depender de un servidor backend activo). Toda la persistencia de datos y control de accesos se realiza en el cliente utilizando almacenamiento local (`localStorage` / `sessionStorage`) y datos semilla cargados inicialmente.

---

## Estructura del Proyecto

```text
/
├── frontend/
│   ├── index.html          # Punto de entrada principal de la SPA
│   ├── pages/              # Módulos/vistas (login.js, dashboard.js, patients.js, etc.)
│   ├── components/         # Componentes gráficos reutilizables (modal, sidebar, etc.)
│   └── assets/
│       ├── css/            # Hojas de estilo de la aplicación (variables, base, layout, etc.)
│       ├── js/             # Scripts núcleo (router, auth, permissions, theme, app)
│       │   └── data/       # Capa de datos simulada (dataService, seedData, models)
│       └── img/            # Recursos gráficos e imágenes
│
├── backend/                # Carpeta preparada para futura integración con la API REST
└── README.md               # Este archivo de documentación
```

---

## Requisitos Previos
* **Navegador Web Moderno** (Chrome, Firefox, Edge, Safari, etc.).
* **Live Server** (extensión de VS Code) o cualquier servidor web estático simple (como `http-server` de npm o `python -m http.server`) para servir la SPA.

---

## Instrucciones de Lanzamiento

1. Abre el directorio del proyecto en tu editor de código de preferencia (ej. VS Code).
2. Haz clic derecho sobre el archivo [frontend/index.html](file:///home/frankyoel/Documentos/OtrosProyectos/Pagina%20web-OdontoPlus/frontend/index.html) y selecciona **Open with Live Server**.
3. La aplicación se abrirá en tu navegador web por defecto en la dirección `http://127.0.0.1:5500/frontend/` (o el puerto configurado).

---

## Cuentas de Demostración (Seed Data)
El frontend inicializa automáticamente los datos de prueba y las siguientes cuentas de demostración al cargar por primera vez la aplicación en el navegador:

| Rol | Correo Electrónico | Contraseña | Nivel de Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** (admin) | `admin@odontoplus.pe` | `admin123` | Control total del sistema |
| **Odontólogo** (doctor) | `dra.torres@odontoplus.pe` | `doctor123` | Pacientes, citas e historiales médicos |
| **Recepcionista** (receptionist) | `recepcion@odontoplus.pe` | `recepcion123` | Agenda de citas, registro de pacientes y pagos |
| **Asistente Dental** (assistant) | `lucia.paredes@odontoplus.pe` | `asistente123` | Visualización de agenda e historial clínico |
| **Jefe de Almacén** (warehouse) | `almacen@odontoplus.pe` | `almacen123` | Exclusivo para gestión de inventarios |
