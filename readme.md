# StudentScope MJ - Panel de Gestión Educativa

StudentScope MJ es una Single Page Application (SPA) para gestionar y monitorear estudiantes. Está construida sin frameworks (JavaScript y CSS puros) y guarda sus datos en el navegador.

Repositorios del proyecto:

* Frontend: `studentscope-mj-frontend` (este repositorio).
* Backend: `studentscope-mj-backend` (en preparación).

Hecho por María José Montepeque Zet.

---

## Características principales

* **SPA con enrutador ligero:** navegación entre Landing, Login, Registro y Dashboard sin recargar la página.
* **Cuentas y roles:** registro de usuarios, inicio de sesión real contra la API y panel de administración de cuentas (editar, eliminar, hacer o quitar administrador).
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
| `js/Catalogo.js` | Catálogo oficial de 30 cursos: única fuente para la interfaz y el validador. |
| `js/Validacion.js` | Motor de validación con 20 reglas de negocio, para un dataset completo o para un registro. |
| `js/Escapar.js` | Utilidades de seguridad: escape de HTML y conversión segura a número. |
| `js/Iconos.js` | Iconos SVG propios y función que los inserta en los elementos con `data-icono`. |
| `js/Api.js` | Cliente de la API: envía las cookies de sesión, traduce errores y avisa cuando la sesión expira. |
| `js/Cuentas.js` | Sección Cuentas del administrador: lista, búsqueda, edición, cambio de rol y eliminación. |
| `css/Cuentas.css` | Estilos de la gestión de cuentas. |
| `scripts/servir.mjs` | Servidor local de desarrollo: sirve el frontend y reenvía `/api` al backend. |
| `json/Datos.json` | Copia del dataset inicial de 35 estudiantes, igual al de `App.js`. |
| `test/` | Pruebas automáticas con Vitest: las 20 reglas del validador y las utilidades de escape. |
| `package.json` | Scripts y herramientas de desarrollo (solo para pruebas y calidad de código; la aplicación no las usa). |
| `eslint.config.mjs` | Reglas de ESLint para el código del navegador, las pruebas y el validador. |
| `vitest.config.mjs` | Configuración de Vitest. |
| `.prettierrc.json` | Estilo de formato para pruebas y archivos de configuración. |

---

## Instalación y uso

El frontend necesita el backend (`studentscope-mj-backend`) para iniciar sesión, porque las cuentas viven en su base de datos.

1. Clona los dos repositorios y levanta el backend siguiendo su README (PostgreSQL, variables de entorno y `npm start`).
2. En este repositorio:

```bash
npm install
npm run dev
```

3. Abre `http://localhost:5173`.

`npm run dev` sirve los archivos del frontend y reenvía las peticiones `/api` al backend en `http://127.0.0.1:3100`. Se pueden cambiar con las variables `PORT` y `API_URL`.

Con la cookie de sesión no se puede abrir `index.html` directamente ni servirlo con una extensión que no reenvíe `/api`: el navegador no podría llegar a la API.

Los nombres de archivos y carpetas distinguen mayúsculas y minúsculas en servidores Linux (por ejemplo, `css/Style.css`).

Los estudiantes, cursos y reportes todavía usan datos de ejemplo guardados en el `localStorage` del navegador. Se pueden restablecer desde la sección Configuración del Dashboard, que ve el administrador.

---

## Cuentas y roles

* **Registro:** cualquiera crea una cuenta desde la pantalla de registro. Las cuentas nuevas son siempre `usuario`.
* **Usuario:** ve el Dashboard, el catálogo de Cursos y su propio perfil (cambiar nombre y contraseña). No ve estudiantes, reportes, notificaciones ni cuentas.
* **Administrador:** además gestiona estudiantes, reportes y la sección **Cuentas**, donde puede editar nombre, correo y contraseña de cualquiera, hacer o quitar el rol de administrador y eliminar cuentas.
* Siempre queda al menos un administrador, y nadie puede eliminar su propia cuenta desde esa sección.
* El primer administrador lo crea el backend al iniciar, a partir de `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
* La sesión vive en una cookie `HttpOnly` que el navegador no deja leer desde JavaScript. Si la cuenta se elimina o la sesión caduca, la aplicación vuelve al inicio de sesión.

Aviso: los datos de los estudiantes todavía están en el navegador, así que el control de acceso a esa parte es solo visual. Los permisos de las cuentas sí los aplica el servidor. Cuando los estudiantes pasen a la API, los permisos cubrirán también esos datos.

---

## Pruebas y calidad del código

Las herramientas de desarrollo necesitan Node.js 22 o superior. La aplicación en sí no las necesita.

```bash
npm install
npm test
npm run lint
npm run format:check
```

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Ejecuta todas las pruebas con Vitest. |
| `npm run test:watch` | Ejecuta las pruebas y las repite al guardar cambios. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run format` | Da formato con Prettier a las pruebas y a los archivos de configuración. |

Las pruebas cargan `js/Validacion.js` y `js/Escapar.js` con `require`, porque esos archivos también funcionan en Node sin cambios. Cada regla V-01 a V-20 tiene al menos un caso que debe detectarse y otro que debe aceptarse.

---

## Arquitectura de JavaScript

Cada archivo usa una IIFE para no contaminar el objeto global. Solo se expone lo necesario en `window.EduTrack`. Ese nombre y la clave `edutrack_estudiantes` de `localStorage` se mantienen por compatibilidad con los datos ya guardados; se renombrarán al modularizar el código.

* **Estado centralizado:** `App.js` mantiene un objeto `state` con la vista actual, los estudiantes, los filtros y las instancias de las gráficas.
* **Renderizado:** los componentes se vuelven a pintar con plantillas de texto cuando cambia el estado.
* **Seguridad:** todo dato de estudiante que se inserta en una plantilla pasa por `escaparHTML()` (o `aNumero()` si es numérico), y los mensajes emergentes se crean con nodos de texto. Así un nombre como `<img src=x onerror=...>` se muestra como texto y no se ejecuta.
* **Sesión y roles:** `App.js` guarda el usuario actual en `state.usuario`. Los elementos marcados con `data-solo-admin` se ocultan para quien no es administrador y las secciones de administración vuelven al Dashboard si se intentan abrir sin permiso.
* **Iconos:** la interfaz no usa emojis. Los iconos son SVG definidos en `Iconos.js`; el HTML los pide con `data-icono="nombre"` y las plantillas de JavaScript con `EduTrack.icono('nombre')`.
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

const unico = EduTrack.validar.registro(nuevoEstudiante);
if (!unico.valido) console.log(unico.errores);
```

Uso en Node.js:

```bash
node js/Validacion.js
```

Reglas relevantes:

* **Cursos (V-07):** deben existir en `js/Catalogo.js`. Agregar un curso al catálogo lo habilita en el formulario y en el validador a la vez.
* **Fecha de inscripción (V-09):** desde el 2023-01-01 hasta el día de hoy, con la fecha local del equipo. No se aceptan fechas inexistentes como `2023-02-30`.
* **`dataset()`** acepta un segundo argumento `{ hoy: 'AAAA-MM-DD' }` para fijar el día de hoy en las pruebas. Si el arreglo contiene valores que no son objetos (`null`, números, textos), los marca como inválidos en lugar de fallar.
* **`registro()`** valida un solo registro con las reglas V-01 a V-13, V-19 y V-20, sin las que comparan varios registros (V-14 a V-18).

Dónde se usa en la aplicación:

* **Al cargar los datos guardados:** se validan antes de mostrarlos. Los registros con errores no se muestran ni se borran: se guardan aparte en la clave `edutrack_estudiantes_invalidos` de `localStorage` (hasta 200) y un aviso indica cuántos se apartaron. Si no queda ninguno válido, se cargan los 35 estudiantes de ejemplo.
* **Al guardar desde el formulario:** el registro completo pasa por `registro()`. Los errores se muestran junto al campo correspondiente y las advertencias no bloquean el guardado. El campo de fecha ya limita el rango permitido.

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
* Se eliminan los emojis de la interfaz y se reemplazan por iconos SVG (`js/Iconos.js`) donde el emoji era el único contenido de un botón o recuadro.
* Se corrige la superposición de la lupa con el texto del buscador de estudiantes.

### Día 3 - Pruebas y calidad del código
* Se agregan Vitest, ESLint y Prettier, con los scripts `test`, `lint` y `format`.
* Se escriben 68 pruebas: las reglas V-01 a V-20 del validador, los casos límite y las utilidades de escape.
* Se corrige el validador: aceptaba fechas imposibles como `2023-02-30`, porque JavaScript las convierte a una fecha del mes siguiente. Ahora se rechazan.
* Se corrigen cuatro avisos de lint: una variable sin usar en `App.js`, un parámetro sin usar y dos escapes innecesarios en la expresión regular del correo.

### Cuentas de usuario
* Registro e inicio de sesión reales contra la API, con restauración de la sesión al recargar y cierre de sesión.
* Roles `usuario` y `administrador`: el usuario ve un panel de solo lectura y su perfil; el administrador conserva todo y gana la sección Cuentas.
* Sección Cuentas: lista, búsqueda, edición, restablecer contraseña, hacer o quitar administrador y eliminar, con confirmación y protección de la propia cuenta.
* Perfil propio: cambio de nombre y de contraseña contra la API.
* Los diálogos de confirmación aceptan una etiqueta propia; el de restablecer datos ya no dice "Sí, eliminar".
* Se agrega `npm run dev`, un servidor local que sirve el frontend y reenvía `/api` al backend.
* Se agregan pruebas del cliente de API (77 pruebas en total).

### Día 4 - Reglas del validador alineadas con los datos
* El catálogo de 30 cursos pasa a `js/Catalogo.js` y es la única fuente: el selector del formulario y el validador salen de ahí. Antes el validador solo conocía 8.
* La fecha máxima de inscripción deja de estar fija en 2025 y pasa a ser el día de hoy. Un estudiante registrado hoy ya no se marca como inválido.
* El formulario proponía la fecha de hoy con la hora UTC, que podía ser el día siguiente; ahora usa la fecha local.
* Nueva función `EduTrack.validar.registro()` y soporte para valores que no son objetos dentro del dataset.
* El validador se conecta a la aplicación: se aplica al cargar `localStorage` (con cuarentena de lo inválido) y al guardar desde el formulario.
* La portada anunciaba 8 cursos oficiales; ahora indica 30.
* 92 pruebas en total.
