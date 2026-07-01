---
name: Vital Gradient
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464554'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#8127cf'
  on-secondary: '#ffffff'
  secondary-container: '#9c48ea'
  on-secondary-container: '#fffbff'
  tertiary: '#006577'
  on-tertiary: '#ffffff'
  tertiary-container: '#008096'
  on-tertiary-container: '#f9fdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 40px
  gutter: 24px
---

## Personalidad y Estilo

El sistema de diseño se aleja de la estética clínica tradicional, fría y plana, para adoptar una identidad **vibrante, moderna y optimista**. Está diseñado para aplicaciones médicas de próxima generación y dashboards de salud que requieren claridad informativa combinada con una experiencia de usuario energética y fluida.

La estética principal es el **Glassmorphism / Soft UI**. El sistema utiliza capas translúcidas, desenfoques de fondo (backdrop blurs) y gradientes dinámicos de azul a púrpura para guiar la atención hacia las acciones principales. El objetivo es transmitir una sensación de innovación tecnológica y cuidado humano, inspirando confianza a través de una interfaz limpia pero profundamente visual y táctil.

**Atributos de Marca:**
- **Vibrante:** Uso de gradientes de alto impacto.
- **Transparente:** Capas de vidrio que sugieren profundidad y claridad.
- **Humano:** Bordes generosamente redondeados que eliminan la rigidez institucional.
- **Preciso:** Tipografía sans-serif nítida para datos médicos críticos.

## Colores

La paleta se centra en una base neutra de alta claridad para garantizar la legibilidad, complementada con gradientes eléctricos que inyectan vitalidad en el entorno médico.

- **Fondo y Base:** Se utiliza un blanco puro o gris muy claro (`#F8FAFC`) para el lienzo principal, permitiendo que las tarjetas y los elementos de "cristal" resalten.
- **Primario y Secundario:** El núcleo visual es una transición entre azul cobalto y púrpura amatista. Este gradiente se reserva para botones de acción principal, estados activos y elementos destacados de datos.
- **Acentos:** Se utiliza un gradiente de cian a turquesa para elementos secundarios o métricas positivas, manteniendo la coherencia con el estilo de "energía tecnológica".
- **Semántica:**
    - **Éxito:** Esmeralda suave.
    - **Aviso:** Ámbar vibrante.
    - **Error:** Coral suave (evitando el rojo sangre tradicional para reducir la ansiedad del paciente).

## Tipografía

El sistema utiliza **Inter** como única familia tipográfica para garantizar una legibilidad técnica impecable y un aire contemporáneo.

La jerarquía es estricta para facilitar el escaneo rápido de información médica. Los encabezados utilizan pesos semi-bold o bold con un tracking ligeramente negativo para una apariencia más compacta y premium. Los cuerpos de texto mantienen un interlineado generoso para reducir la fatiga visual en sesiones prolongadas de análisis de datos. Los labels (etiquetas) se presentan en tamaños pequeños y ocasionalmente en mayúsculas para diferenciar metadatos de los valores principales.

## Diseño y Espaciado

El sistema se basa en una **retícula fluida de 12 columnas** para escritorio, que se adapta a 8 en tabletas y 4 en dispositivos móviles. El espaciado sigue una escala basada en 4px, priorizando la amplitud para reforzar la sensación de limpieza y orden.

- **Márgenes de Contenedor:** Se utilizan márgenes exteriores generosos (40px+) para enmarcar el contenido y enfatizar la estética de "tablero" o dashboard.
- **Espaciado Interno (Padding):** Las tarjetas y contenedores de cristal deben tener un padding mínimo de 24px para evitar el hacinamiento visual.
- **Densidad:** El diseño es de densidad baja-media, permitiendo que el aire entre los elementos actúe como un separador natural, reduciendo la dependencia de líneas divisorias pesadas.

## Elevación y Profundidad

La jerarquía visual se construye mediante el uso de **capas de cristal y sombras ambientales difusas**.

1.  **Nivel de Fondo:** Un color sólido o gradiente muy suave de fondo.
2.  **Capa de Cristal (Cards):** Superficies blancas con una opacidad del 70-90% y un `backdrop-filter: blur(12px)`. Estas capas deben tener un borde sutil de 1px en color blanco semitransparente para simular el borde de un vidrio.
3.  **Sombras:** No se utilizan sombras negras. Se emplean sombras de gran radio de desenfoque (blur) con una opacidad muy baja (5-10%) y teñidas ligeramente con el color primario de la marca para mantener la cohesión cromática.
4.  **Flotabilidad:** Los elementos interactivos como botones primarios utilizan una elevación mayor cuando están en estado hover, intensificando el brillo del gradiente subyacente.

## Formas

El lenguaje de formas es suave y orgánico. Se abandonan las esquinas afiladas para promover una interfaz más amigable y menos intimidante.

- **Componentes Estándar:** (Inputs, Chips, Botones pequeños) utilizan un radio de 12px a 16px.
- **Contenedores y Tarjetas:** Utilizan un radio generoso de **24px** (`rounded-xl`), lo que confiere a la interfaz un aspecto de objeto físico suave y moderno.
- **Avatares y Notificaciones:** Se permiten formas circulares puras para romper la ortogonalidad del grid.

## Componentes

### Botones (Acciones)
Los botones primarios deben usar el gradiente de azul a púrpura con texto en blanco. Poseen un radio de curvatura de 16px. Los botones secundarios son "ghost" con el borde de cristal y texto en el color primario.

### Tarjetas (Cards)
Son el componente fundamental. Deben aplicar el efecto de cristal (blur + transparencia) y una sombra suave. El contenido interno debe estar alineado con un padding de 24px. Las cabeceras de las tarjetas pueden incluir iconos con fondos de gradiente suave para categorización.

### Campos de Entrada (Inputs)
Fondos sólidos muy claros (`#F1F5F9`) o ligeramente traslúcidos. El foco se indica mediante un borde con el gradiente de la marca o una sombra sutil de color.

### Chips y Etiquetas
Pequeños contenedores con radios de tipo píldora. Utilizan colores pasteles derivados de la paleta principal para indicar estados sin sobrecargar la vista.

### Gráficos y Visualización de Datos
Las líneas de gráficos deben ser suaves (curvas de Bézier) y pueden llevar rellenos degradados que se desvanecen hacia la base, imitando la estética de profundidad del resto del sistema.