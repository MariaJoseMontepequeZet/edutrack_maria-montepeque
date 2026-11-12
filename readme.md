# StudentScope MJ - Panel de Gestión Educativa

StudentScope MJ es una Single Page Application (SPA) para gestionar y monitorear estudiantes. Está construida sin frameworks (JavaScript y CSS puros) y guarda sus datos en el navegador.

Repositorios del proyecto:

* Frontend: `studentscope-mj-frontend` (este repositorio).
* Backend: `studentscope-mj-backend` (en preparación).

Hecho por María José Montepeque Zet.

---

## Características principales

* **SPA con enrutador ligero:** navegación entre Landing, Login y Dashboard sin recargar la página.
* **Dashboard analítico:** indicadores clave y gráficas con Chart.js.
* **Gestión de estudiantes (CRUD):**
  * Vista en tarjetas.
  * Búsqueda y filtros por nombre, ciudad, plan y estado.
  * Paginación.
  * Formularios modales para agregar, editar y eliminar, con persistencia en `localStorage`.
* **Catálogo de cursos:** 30 cursos filtrables por categoría.
* **Reportes:** ingresos, retención, progreso promedio, gráficas por plan y por rango de progreso, y Top 10 de estudiantes.
* **Configuración:** exportación a JSON y CSV, y restablecimiento de los datos iniciales.
* **Notificaciones:** panel que genera alertas a partir de los datos (abandono, cursos completados).
* **Sidebar accesible:** menú colapsable con control de foco, cierre con Escape y adaptación a móvil.
* **Motor de validación:** módulo independiente con 20 reglas de negocio sobre el dataset.

---

## Tecnologías utilizadas

* **Estructura y estilos:** HTML5 semántico y CSS puro (variables, Flexbox, Grid).
* **Lógica:** JavaScript vanilla con patrón de módulos (IIFE).
* **Gráficas:** Chart.js 4.4.0, cargado desde CDN.
* **Fuentes:** Google Fonts (Syne, DM Sans).

---

## Estructura del proyecto

| Archivo | Descripción |
| :--- | :--- |
| `index.html` | Estructura de todas las vistas (Landing, Login, Dashboard y modales). |
| `css/Style.css` | Estilos globales: variables, tipografía, botones, insignias, toasts y Landing. |
| `css/Dashboard.css` | Estilos del panel: Sidebar, Topbar, indicadores y tablas. |
| `css/Estudiantes.css` | Estilos de la gestión de estudiantes: tarjetas, filtros, paginación y modales. |
| `js/App.js` | Lógica principal: enrutador, CRUD, gráficas, cursos, reportes, configuración y notificaciones. |
| `js/Sidebar.js` | Control del menú lateral: eventos, accesibilidad y cambio de tamaño. |
| `js/Validacion.js` | Motor de validación del dataset con 20 reglas de negocio. |
| `js/Escapar.js` | Utilidades de seguridad: escape de HTML y conversión segura a número. |
| `json/Datos.json` | Copia del dataset inicial de 35 estudiantes, igual al de `App.js`. |

---

## Instalación y uso

No requiere compilación ni dependencias.

1. Clona el repositorio o descarga los archivos.
2. Abre `index.html` en un navegador moderno, o sírvelo con una extensión como Live Server de VS Code.

Los nombres de archivos y carpetas distinguen mayúsculas y minúsculas en servidores Linux (por ejemplo, `css/Style.css`).

La primera vez que se carga, la aplicación guarda un dataset de prueba en el `localStorage` del navegador. Se puede restablecer desde la sección Configuración del Dashboard.

---

## Arquitectura de JavaScript

Cada archivo usa una IIFE para no contaminar el objeto global. Solo se expone lo necesario en `window.EduTrack`. Ese nombre y la clave `edutrack_estudiantes` de `localStorage` se mantienen por compatibilidad con los datos ya guardados; se renombrarán al modularizar el código.

* **Estado centralizado:** `App.js` mantiene un objeto `state` con la vista actual, los estudiantes, los filtros y las instancias de las gráficas.
* **Renderizado:** los componentes se vuelven a pintar con plantillas de texto cuando cambia el estado.
* **Seguridad:** todo dato de estudiante que se inserta en una plantilla pasa por `escaparHTML()` (o `aNumero()` si es numérico), y los mensajes emergentes se crean con nodos de texto. Así un nombre como `<img src=x onerror=...>` se muestra como texto y no se ejecuta.
* **Eventos:** no hay manejadores en línea (`onclick`). Los botones declaran `data-action` (y `data-id` o `data-page` cuando hace falta) y un único oyente de clic en `App.js` ejecuta la acción correspondiente. Esto permite una política de seguridad de contenido sin `unsafe-inline` en los scripts.

---

## Motor de validación (`js/Validacion.js`)

Clasifica los problemas en tres niveles:

1. **ERROR:** el registro no es utilizable (por ejemplo, ID duplicado, fecha inválida o monto que no coincide con el plan).
2. **WARNING:** incoherencia de negocio que requiere revisión (por ejemplo, inactivo con bajo progreso).
3. **INFO:** observación general (por ejemplo, saltos en la secuencia de IDs).

Uso en el navegador:

```javascript
const resultado = EduTrack.validar.dataset(estudiantes);
console.log(resultado.reporte);
const registrosSeguros = resultado.registrosValidos;
```

Uso en Node.js:

```bash
node js/Validacion.js
```

Estado actual: el validador funciona de forma independiente, pero la interfaz todavía no lo invoca. Su integración con el formulario y la carga de datos está en el plan de trabajo.

---

## Despliegue

Cada push a `main` despliega el frontend en el servidor mediante GitHub Actions (`.github/workflows/desplegar.yml`) y un runner propio con la etiqueta `studentscope-mj-frontend`.

El flujo de trabajo es: una rama por tarea, pull request hacia `dev` y, al cerrar cada entrega, de `dev` a `main`. Solo el merge a `main` despliega.

El workflow copia únicamente `index.html`, `css/`, `js/` y `json/` al servidor y ejecuta `desplegar.sh web`, que espera a que el servicio responda sano. Si se agrega una carpeta nueva de recursos, hay que incluirla en el paso de copia del workflow.

La configuración del servidor (Docker Compose, Caddy y secretos) vive fuera del repositorio.

---

## Registro de cambios

### Día 1 - Orden del repositorio
* Se agregan `.gitignore` y `.editorconfig`.
* Se corrige este README: nombres reales de archivos, descripción del estado del validador y eliminación de emojis.
* Se unifica `json/Datos.json` con el dataset de `App.js` (correos de los registros 1 a 5 y estado de los registros 21 y 33).

### Renombre del proyecto a StudentScope MJ
* Se actualizan el título, el logotipo, los textos visibles y los encabezados de los archivos.
* Los repositorios pasan a llamarse `studentscope-mj-frontend` y `studentscope-mj-backend`.
* Se conservan `window.EduTrack` y la clave `edutrack_estudiantes` de `localStorage` para no perder los datos guardados.

### Despliegue automatico
* Se agrega el workflow `desplegar.yml`, que despliega en el servidor con cada push a `main`.
* Se documenta el flujo de ramas y qué archivos se publican.

### Día 2 - Seguridad contra XSS
* Se agrega `js/Escapar.js` y se escapan los datos de estudiantes en tarjetas, tabla Top 10, notificaciones, confirmaciones y reportes.
* Los mensajes emergentes se construyen con nodos de texto en lugar de `innerHTML`.
* Se eliminan los `onclick` en línea de `index.html` y `App.js`; se reemplazan por `data-action` con un único oyente de clic.
* `formatFecha` ya no falla cuando la fecha no es una cadena.
