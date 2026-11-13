/**
 * StudentScope MJ — app.js v2.3
 * Cambios v2.3:
 * - Logout ahora va a 'landing' en vez de 'login'
 * - initNavSidebar incorpora cursos, reportes y configuracion
 * - renderizarCursos(), renderizarReportes(), renderizarConfiguracion()
 */
(function () {
    'use strict';

    const esc = window.EduTrack.escaparHTML;
    const num = window.EduTrack.aNumero;
    const ico = window.EduTrack.icono;

    var DATASET_INICIAL = [
        { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'pjuan5058@gmail.com', ciudad: 'Bogotá', curso: 'Desarrollo Web', progreso: 75, fechaInscripcion: '2023-01-15', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 2, nombre: 'María', apellido: 'Gómez', email: 'maria.gomez91@gmail.com', ciudad: 'Medellín', curso: 'Diseño UX/UI', progreso: 60, fechaInscripcion: '2023-02-20', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 3, nombre: 'Carlos', apellido: 'López', email: 'carlos.lopezdev@gmail.com', ciudad: 'Cali', curso: 'Marketing Digital', progreso: 85, fechaInscripcion: '2023-03-10', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 4, nombre: 'Ana', apellido: 'Martínez', email: 'anamartinez14@gmail.com', ciudad: 'Bogotá', curso: 'Desarrollo Web', progreso: 90, fechaInscripcion: '2023-04-05', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 5, nombre: 'Luis', apellido: 'García', email: 'luisgarcia.tech@gmail.com', ciudad: 'Medellín', curso: 'Diseño UX/UI', progreso: 70, fechaInscripcion: '2023-05-10', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 6, nombre: 'Andrés', apellido: 'Rodríguez', email: 'andresrodriguez92@gmail.com', ciudad: 'Bogotá', curso: 'Python y Data Science', progreso: 45, fechaInscripcion: '2023-06-15', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 7, nombre: 'Valentina', apellido: 'Torres', email: 'valetorres.dev@gmail.com', ciudad: 'Medellín', curso: 'Full Stack Web', progreso: 80, fechaInscripcion: '2023-07-20', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 8, nombre: 'Felipe', apellido: 'González', email: 'felipegonzalez.co@gmail.com', ciudad: 'Bogotá', curso: 'Python y Data Science', progreso: 30, fechaInscripcion: '2023-08-10', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 9, nombre: 'Daniela', apellido: 'Vargas', email: 'danielavargas14@gmail.com', ciudad: 'Cali', curso: 'DevOps y Cloud', progreso: 100, fechaInscripcion: '2023-09-05', plan: 'Premium', montoUSD: 99.99, activo: false },
        { id: 10, nombre: 'Santiago', apellido: 'Herrera', email: 'santiagoherrera.med@gmail.com', ciudad: 'Medellín', curso: 'Desarrollo Web', progreso: 55, fechaInscripcion: '2023-10-12', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 11, nombre: 'Sofía', apellido: 'Jiménez', email: 'sofiajimenez.bog@gmail.com', ciudad: 'Bogotá', curso: 'Diseño UX/UI', progreso: 70, fechaInscripcion: '2023-11-18', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 12, nombre: 'Miguel', apellido: 'Castro', email: 'miguelcastro.bar@gmail.com', ciudad: 'Barranquilla', curso: 'SQL y Bases de Datos', progreso: 90, fechaInscripcion: '2024-01-08', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 13, nombre: 'Camila', apellido: 'Ruiz', email: 'camilaruiz2024@gmail.com', ciudad: 'Bogotá', curso: 'Marketing Digital', progreso: 40, fechaInscripcion: '2024-02-14', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 14, nombre: 'Diego', apellido: 'Mendoza', email: 'diegomendoza.tech@gmail.com', ciudad: 'Medellín', curso: 'React Native', progreso: 65, fechaInscripcion: '2024-03-20', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 15, nombre: 'Isabella', apellido: 'Suárez', email: 'isabellasuarez.col@gmail.com', ciudad: 'Bogotá', curso: 'Python y Data Science', progreso: 100, fechaInscripcion: '2024-04-10', plan: 'Premium', montoUSD: 99.99, activo: false },
        { id: 16, nombre: 'Nicolás', apellido: 'Reyes', email: 'nicolasreyes.crt@gmail.com', ciudad: 'Cartagena', curso: 'Desarrollo Web', progreso: 20, fechaInscripcion: '2024-05-05', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 17, nombre: 'Adriana', apellido: 'Molina', email: 'adrianamolina.dev@gmail.com', ciudad: 'Medellín', curso: 'Python y Data Science', progreso: 75, fechaInscripcion: '2024-06-15', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 18, nombre: 'Alejandro', apellido: 'Ortega', email: 'alejandroortega88@gmail.com', ciudad: 'Bogotá', curso: 'Full Stack Web', progreso: 85, fechaInscripcion: '2024-07-22', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 19, nombre: 'Paola', apellido: 'Silva', email: 'paolasilva.cali@gmail.com', ciudad: 'Cali', curso: 'Diseño UX/UI', progreso: 50, fechaInscripcion: '2024-08-18', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 20, nombre: 'Sebastián', apellido: 'Rojas', email: 'sebastianrojas.buc@gmail.com', ciudad: 'Bucaramanga', curso: 'DevOps y Cloud', progreso: 15, fechaInscripcion: '2024-09-10', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 21, nombre: 'Natalia', apellido: 'Vega', email: 'nataliavega.bog@gmail.com', ciudad: 'Bogotá', curso: 'SQL y Bases de Datos', progreso: 100, fechaInscripcion: '2024-10-05', plan: 'Premium', montoUSD: 99.99, activo: false },
        { id: 22, nombre: 'David', apellido: 'Navarro', email: 'davidnavarro.med@gmail.com', ciudad: 'Medellín', curso: 'React Native', progreso: 45, fechaInscripcion: '2024-11-12', plan: 'Básico', montoUSD: 29.99, activo: false },
        { id: 23, nombre: 'Camilo', apellido: 'Ramírez', email: 'camiloramirez.col@gmail.com', ciudad: 'Bogotá', curso: 'Marketing Digital', progreso: 60, fechaInscripcion: '2024-12-08', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 24, nombre: 'Laura', apellido: 'Moreno', email: 'lauramoreno.bar@gmail.com', ciudad: 'Barranquilla', curso: 'Full Stack Web', progreso: 80, fechaInscripcion: '2025-01-15', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 25, nombre: 'Roberto', apellido: 'Castillo', email: 'robertocastillo.dev@gmail.com', ciudad: 'Cali', curso: 'Desarrollo Web', progreso: 35, fechaInscripcion: '2025-02-10', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 26, nombre: 'Claudia', apellido: 'Patiño', email: 'claudiapatino.bog@gmail.com', ciudad: 'Bogotá', curso: 'DevOps y Cloud', progreso: 90, fechaInscripcion: '2025-03-05', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 27, nombre: 'Fernando', apellido: 'Ospina', email: 'fernandoospina.per@gmail.com', ciudad: 'Pereira', curso: 'Python y Data Science', progreso: 25, fechaInscripcion: '2025-04-01', plan: 'Básico', montoUSD: 29.99, activo: false },
        { id: 28, nombre: 'Marcela', apellido: 'Acosta', email: 'marcelaacosta.med@gmail.com', ciudad: 'Medellín', curso: 'Diseño UX/UI', progreso: 70, fechaInscripcion: '2025-04-15', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 29, nombre: 'Iván', apellido: 'Bermúdez', email: 'ivanbermudez.tech@gmail.com', ciudad: 'Bogotá', curso: 'React Native', progreso: 55, fechaInscripcion: '2025-04-20', plan: 'Premium', montoUSD: 99.99, activo: true },
        { id: 30, nombre: 'Sandra', apellido: 'Quintero', email: 'sandraquintero.bar@gmail.com', ciudad: 'Barranquilla', curso: 'SQL y Bases de Datos', progreso: 100, fechaInscripcion: '2024-01-20', plan: 'Premium', montoUSD: 99.99, activo: false },
        { id: 31, nombre: 'Gustavo', apellido: 'Londoño', email: 'gustavolondono.col@gmail.com', ciudad: 'Medellín', curso: 'Marketing Digital', progreso: 40, fechaInscripcion: '2024-02-28', plan: 'Básico', montoUSD: 29.99, activo: true },
        { id: 32, nombre: 'Juliana', apellido: 'Franco', email: 'julianafranco.bog@gmail.com', ciudad: 'Bogotá', curso: 'Full Stack Web', progreso: 65, fechaInscripcion: '2024-03-15', plan: 'Estándar', montoUSD: 59.99, activo: true },
        { id: 33, nombre: 'Mateo', apellido: 'Salcedo', email: 'mateosalcedo.crt@gmail.com', ciudad: 'Cartagena', curso: 'DevOps y Cloud', progreso: 100, fechaInscripcion: '2023-12-10', plan: 'Premium', montoUSD: 99.99, activo: false },
        { id: 34, nombre: 'Andrea', apellido: 'Prada', email: 'andreaprada.bog@gmail.com', ciudad: 'Bogotá', curso: 'Desarrollo Web', progreso: 50, fechaInscripcion: '2024-04-25', plan: 'Básico', montoUSD: 29.99, activo: false },
        { id: 35, nombre: 'Hernán', apellido: 'Zapata', email: 'hernanzapata.col@gmail.com', ciudad: 'Cali', curso: 'React Native', progreso: 75, fechaInscripcion: '2024-05-30', plan: 'Estándar', montoUSD: 59.99, activo: true }
    ];

    /* ── Catálogo completo de 30 cursos ── */
    var CATALOGO_CURSOS = [
        { id: 1, nombre: 'Desarrollo Web', categoria: 'web', nivel: 'Básico', semanas: 12, precio: 'Básico', inscritos: 6, instructor: 'Carlos López', descripcion: 'HTML, CSS y JavaScript desde cero. Crea tu primer sitio web responsivo.' },
        { id: 2, nombre: 'Full Stack Web', categoria: 'web', nivel: 'Avanzado', semanas: 16, precio: 'Premium', inscritos: 4, instructor: 'Valentina Torres', descripcion: 'React + Node.js + PostgreSQL. Arquitectura cliente-servidor completa.' },
        { id: 3, nombre: 'Diseño UX/UI', categoria: 'design', nivel: 'Intermedio', semanas: 10, precio: 'Básico', inscritos: 5, instructor: 'Sofía Jiménez', descripcion: 'Figma, prototipos y principios de experiencia de usuario.' },
        { id: 4, nombre: 'Python y Data Science', categoria: 'data', nivel: 'Intermedio', semanas: 14, precio: 'Estándar', inscritos: 5, instructor: 'Felipe González', descripcion: 'Pandas, NumPy, visualización y machine learning con scikit-learn.' },
        { id: 5, nombre: 'DevOps y Cloud', categoria: 'devops', nivel: 'Avanzado', semanas: 14, precio: 'Premium', inscritos: 4, instructor: 'Daniela Vargas', descripcion: 'Docker, Kubernetes, CI/CD y despliegue en AWS.' },
        { id: 6, nombre: 'React Native', categoria: 'mobile', nivel: 'Intermedio', semanas: 10, precio: 'Estándar', inscritos: 4, instructor: 'Diego Mendoza', descripcion: 'Aplicaciones móviles iOS y Android con un solo codebase.' },
        { id: 7, nombre: 'SQL y Bases de Datos', categoria: 'data', nivel: 'Básico', semanas: 8, precio: 'Básico', inscritos: 3, instructor: 'Miguel Castro', descripcion: 'PostgreSQL, consultas avanzadas, índices y optimización.' },
        { id: 8, nombre: 'Marketing Digital', categoria: 'marketing', nivel: 'Básico', semanas: 8, precio: 'Básico', inscritos: 4, instructor: 'Camila Ruiz', descripcion: 'SEO, SEM, redes sociales y analítica web con Google Analytics.' },
        { id: 9, nombre: 'TypeScript Avanzado', categoria: 'web', nivel: 'Avanzado', semanas: 8, precio: 'Estándar', inscritos: 18, instructor: 'Alejandro Ortega', 'descripcion': 'Tipos, generics, decoradores y patrones de diseño en TS.' },
        { id: 10, nombre: 'Vue.js desde Cero', categoria: 'web', nivel: 'Intermedio', semanas: 10, precio: 'Estándar', inscritos: 22, instructor: 'Laura Moreno', descripcion: 'Composition API, Vuex/Pinia y despliegue de SPAs.' },
        { id: 11, nombre: 'Machine Learning con Python', categoria: 'data', nivel: 'Avanzado', semanas: 16, precio: 'Premium', inscritos: 15, instructor: 'Adriana Molina', descripcion: 'Regresión, clasificación, redes neuronales y MLOps.' },
        { id: 12, nombre: 'AWS Solutions Architect', categoria: 'devops', nivel: 'Avanzado', semanas: 12, precio: 'Premium', inscritos: 11, instructor: 'Claudia Patiño', descripcion: 'Certificación SAA-C03: EC2, S3, Lambda y arquitecturas serverless.' },
        { id: 13, nombre: 'Flutter & Dart', categoria: 'mobile', nivel: 'Intermedio', semanas: 12, precio: 'Estándar', inscritos: 19, instructor: 'Iván Bermúdez', descripcion: 'Apps multiplataforma con Material 3 y Riverpod.' },
        { id: 14, nombre: 'Ciberseguridad Básica', categoria: 'seguridad', nivel: 'Básico', semanas: 8, precio: 'Básico', inscritos: 27, instructor: 'Hernán Zapata', descripcion: 'OWASP Top 10, pentesting ético y protección de APIs.' },
        { id: 15, nombre: 'Node.js & APIs REST', categoria: 'web', nivel: 'Intermedio', semanas: 10, precio: 'Estándar', inscritos: 31, instructor: 'Gustavo Londoño', descripcion: 'Express, autenticación JWT, documentación con Swagger.' },
        { id: 16, nombre: 'Docker & Kubernetes', categoria: 'devops', nivel: 'Intermedio', semanas: 10, precio: 'Estándar', inscritos: 14, instructor: 'Mateo Salcedo', descripcion: 'Contenedores, orquestación y pipelines de despliegue.' },
        { id: 17, nombre: 'Power BI & Tableau', categoria: 'data', nivel: 'Básico', semanas: 6, precio: 'Básico', inscritos: 35, instructor: 'Juliana Franco', descripcion: 'Dashboards interactivos y visualización de datos de negocio.' },
        { id: 18, nombre: 'Angular 17', categoria: 'web', nivel: 'Avanzado', semanas: 14, precio: 'Premium', inscritos: 12, instructor: 'Roberto Castillo', 'descripcion': 'Signals, standalone components, SSR y arquitectura empresarial.' },
        { id: 19, nombre: 'Kotlin para Android', categoria: 'mobile', nivel: 'Intermedio', semanas: 12, precio: 'Estándar', inscritos: 9, instructor: 'Sandra Quintero', descripcion: 'Jetpack Compose, Coroutines y MVVM con Clean Architecture.' },
        { id: 20, nombre: 'Swift & iOS Development', categoria: 'mobile', nivel: 'Avanzado', semanas: 14, precio: 'Premium', inscritos: 7, instructor: 'David Navarro', descripcion: 'SwiftUI, Combine, Core Data y publicación en App Store.' },
        { id: 21, nombre: 'Inteligencia Artificial', categoria: 'data', nivel: 'Avanzado', semanas: 18, precio: 'Premium', inscritos: 20, instructor: 'Isabella Suárez', descripcion: 'LLMs, prompt engineering, RAG y despliegue de modelos de IA.' },
        { id: 22, nombre: 'GraphQL & Apollo', categoria: 'web', nivel: 'Intermedio', semanas: 8, precio: 'Estándar', inscritos: 13, instructor: 'Camilo Ramírez', descripcion: 'Schemas, resolvers, subscriptions y Apollo Server.' },
        { id: 23, nombre: 'Terraform & IaC', categoria: 'devops', nivel: 'Avanzado', semanas: 10, precio: 'Premium', inscritos: 8, instructor: 'Sebastián Rojas', descripcion: 'Infraestructura como código con Terraform y Ansible en AWS/GCP.' },
        { id: 24, nombre: 'Diseño de Producto Digital', categoria: 'design', nivel: 'Intermedio', semanas: 10, precio: 'Estándar', inscritos: 16, instructor: 'Paola Silva', descripcion: 'Design thinking, sistemas de diseño y handoff con Figma.' },
        { id: 25, nombre: 'MongoDB & NoSQL', categoria: 'data', nivel: 'Básico', semanas: 6, precio: 'Básico', inscritos: 24, instructor: 'Natalia Vega', descripcion: 'Documentos, agregaciones, índices y Atlas en la nube.' },
        { id: 26, nombre: 'Next.js & SSR', categoria: 'web', nivel: 'Avanzado', semanas: 10, precio: 'Premium', inscritos: 17, instructor: 'Marcela Acosta', descripcion: 'App Router, Server Components, Edge Runtime y deployment.' },
        { id: 27, nombre: 'Ethical Hacking', categoria: 'seguridad', nivel: 'Avanzado', semanas: 14, precio: 'Premium', inscritos: 10, instructor: 'Fernando Ospina', descripcion: 'Recon, explotación, post-explotación y reporte de vulnerabilidades.' },
        { id: 28, nombre: 'Excel & Google Sheets Pro', categoria: 'marketing', nivel: 'Básico', semanas: 4, precio: 'Básico', inscritos: 42, instructor: 'Ana Martínez', descripcion: 'Tablas dinámicas, macros VBA, fórmulas avanzadas y automatización.' },
        { id: 29, nombre: 'Git & GitHub Avanzado', categoria: 'web', nivel: 'Básico', semanas: 4, precio: 'Básico', inscritos: 38, instructor: 'Santiago Herrera', descripcion: 'Branching, rebase, hooks, GitHub Actions y code review.' },
        { id: 30, nombre: 'Scrum & Gestión Ágil', categoria: 'marketing', nivel: 'Básico', semanas: 4, precio: 'Básico', inscritos: 29, instructor: 'Nicolás Reyes', descripcion: 'Ceremonias Scrum, Kanban, OKRs y herramientas como Jira y Notion.' }
    ];

    var STORAGE_KEY = 'edutrack_estudiantes';
    var PLANES_MONTO = { 'Básico': 29.99, 'Estándar': 59.99, 'Premium': 99.99 };

    var state = {
        estudiantes: [],
        listaFiltrada: [],
        editandoId: null,
        grafico: null,
        graficoPlan: null,
        graficoProgreso: null,
        confirmCb: null,
        vistaActual: 'landing',
        paginaActual: 1,
        itemsPorPagina: 12,
        filtroCategoria: 'todos',
        usuario: null
    };

    /* ════════════════════════════════════════════
       ROUTER
    ════════════════════════════════════════════ */
    function mostrarVista(nombre, datos) {
        var saliente = document.getElementById('view-' + state.vistaActual);
        var entrante = document.getElementById('view-' + nombre);
        if (!entrante || nombre === state.vistaActual) return;

        if (saliente) {
            saliente.classList.add('view--leaving');
            setTimeout(function () {
                saliente.classList.remove('view--active', 'view--leaving');
            }, 350);
        }

        setTimeout(function () {
            entrante.classList.add('view--active');
            state.vistaActual = nombre;
            window.scrollTo(0, 0);

            if (nombre === 'dashboard') {
                actualizarUsuarioDashboard(datos || {});
                reiniciarVistasDinamicas();
                aplicarRol();
                activarSeccion('dashboard');
                actualizarFechaTopbar();
                cargarDatos();
                poblarSelectCiudades();
                filtrar();
                actualizarKPIs();
                actualizarGrafico();
            }
            if (nombre === 'landing') {
                window.EduTrack && window.EduTrack.closeSidebar && window.EduTrack.closeSidebar();
            }
        }, nombre === 'dashboard' ? 350 : 0);
    }

    function actualizarUsuarioDashboard(d) {
        var nombreCompleto = (d && d.nombre) ? d.nombre.trim() : 'Usuario';
        var primerNombre = nombreCompleto.split(' ')[0] || nombreCompleto;
        var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
        set('greetingNombre', primerNombre);
        set('sidebarNombre', nombreCompleto);
        set('sidebarRol', d && d.rol === 'administrador' ? 'Administrador' : 'Usuario');
        var av = document.getElementById('sidebarAvatar');
        if (av) av.textContent = nombreCompleto.charAt(0).toUpperCase();
    }

    function esAdministrador() {
        return !!(state.usuario && state.usuario.rol === 'administrador');
    }

    function aplicarRol() {
        var admin = esAdministrador();
        document.querySelectorAll('[data-solo-admin]').forEach(function (el) { el.hidden = !admin; });
        var textoConfig = document.querySelector('.db-sidebar__nav-link[data-section="configuracion"] .db-sidebar__nav-text');
        if (textoConfig) textoConfig.textContent = admin ? 'Configuración' : 'Mi perfil';
        if (!admin) cerrarPanelNotificaciones();
    }

    function reiniciarVistasDinamicas() {
        ['secReportes', 'secConfiguracion', 'secCuentas'].forEach(function (id) {
            var sec = document.getElementById(id);
            if (!sec) return;
            sec._rendered = false;
            sec.innerHTML = '';
        });
        if (state.graficoPlan) { state.graficoPlan.destroy(); state.graficoPlan = null; }
        if (state.graficoProgreso) { state.graficoProgreso.destroy(); state.graficoProgreso = null; }
    }

    function actualizarFechaTopbar() {
        var el = document.getElementById('topbarFecha');
        if (!el) return;
        var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        var hoy = new Date();
        el.textContent = dias[hoy.getDay()] + ', ' + hoy.getDate() + ' de ' + meses[hoy.getMonth()] + ' de ' + hoy.getFullYear();
    }

    /* ════════════════════════════════════════════
       NAVEGACIÓN DEL SIDEBAR
    ════════════════════════════════════════════ */
    var SECCIONES = {
        'dashboard': 'secDashboard',
        'estudiantes': 'secEstudiantes',
        'cursos': 'secCursos',
        'reportes': 'secReportes',
        'cuentas': 'secCuentas',
        'configuracion': 'secConfiguracion'
    };
    var SECCIONES_ADMIN = ['estudiantes', 'reportes', 'cuentas'];

    function activarSeccion(seccion) {
        if (!SECCIONES[seccion]) return;
        if (SECCIONES_ADMIN.indexOf(seccion) !== -1 && !esAdministrador()) seccion = 'dashboard';

        document.querySelectorAll('.db-sidebar__nav-link').forEach(function (l) {
            l.classList.toggle('db-sidebar__nav-link--active', l.getAttribute('data-section') === seccion);
        });

        Object.keys(SECCIONES).forEach(function (k) {
            var sec = document.getElementById(SECCIONES[k]);
            if (!sec) return;
            if (k === seccion) {
                sec.classList.remove('db-section--hidden');
                sec.style.display = 'block';
            } else {
                sec.classList.add('db-section--hidden');
                sec.style.display = 'none';
            }
        });

        if (seccion === 'cursos') renderizarCursos();
        if (seccion === 'reportes') renderizarReportes();
        if (seccion === 'cuentas') window.EduTrack.cuentas.mostrar();
        if (seccion === 'configuracion') renderizarConfiguracion();
    }

    function initNavSidebar() {
        document.querySelectorAll('.db-sidebar__nav-link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var seccion = this.getAttribute('data-section');
                if (!seccion) return;
                activarSeccion(seccion);

                if (window.innerWidth < 768) {
                    window.EduTrack && window.EduTrack.closeSidebar && window.EduTrack.closeSidebar();
                }
            });
        });
    }

    /* ════════════════════════════════════════════
       DATOS
    ════════════════════════════════════════════ */
    function cargarDatos() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var p = JSON.parse(raw);
                if (Array.isArray(p) && p.length) { state.estudiantes = p; return; }
            }
        } catch (e) { console.warn('localStorage error', e); }
        state.estudiantes = DATASET_INICIAL.slice();
        guardarDatos();
    }

    function guardarDatos() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.estudiantes)); }
        catch { showToast('Error al guardar', 'error'); }
    }

    /* ════════════════════════════════════════════
       KPIs
    ════════════════════════════════════════════ */
    function actualizarKPIs() {
        var activos = state.estudiantes.filter(function (e) { return e.activo; }).length;
        var total = state.estudiantes.length;
        var avg = total
            ? Math.round(state.estudiantes.reduce(function (s, e) { return s + e.progreso; }, 0) / total)
            : 0;
        var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
        set('kpiCursos', activos);
        set('kpiProgreso', avg + '%');
        set('kpiTotal', total);
        var bar = document.getElementById('kpiProgresoBar');
        if (bar) bar.style.setProperty('--progress-value', avg + '%');
    }

    /* ════════════════════════════════════════════
       CARDS & PAGINACIÓN (estudiantes)
    ════════════════════════════════════════════ */
    function planSlug(p) {
        return (p || '').toLowerCase()
            .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
            .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/\s+/g, '');
    }
    function iniciales(n, a) { return ((n[0] || '') + (a[0] || '')).toUpperCase(); }
    function progresoClass(p) { return p >= 100 ? 'progress-fill--complete' : p < 40 ? 'progress-fill--low' : ''; }
    function formatFecha(d) {
        if (typeof d !== 'string') return '—';
        var p = d.split('-');
        return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '—';
    }

    function renderizarCards(lista) {
        var grid = document.getElementById('studentsGrid');
        if (!grid) return;
        if (!lista || !lista.length) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-state__icon">' + ico('buscar') + '</div>' +
                '<p class="empty-state__title">Sin resultados</p>' +
                '<p>Ajusta los filtros o agrega un estudiante.</p></div>';
            actualizarContador(0);
            renderizarPaginacion(0);
            return;
        }
        var inicio = (state.paginaActual - 1) * state.itemsPorPagina;
        var fin = inicio + state.itemsPorPagina;
        var paginaDatos = lista.slice(inicio, fin);
        grid.innerHTML = paginaDatos.map(function (e, i) {
            return '<article class="student-card' + (e.activo ? '' : ' student-card--inactive') + '" ' +
                'style="animation-delay:' + Math.min(i * 30, 300) + 'ms" data-id="' + num(e.id) + '">' +
                '<div class="card-header">' +
                '<div class="card-avatar">' + esc(iniciales(e.nombre, e.apellido)) + '</div>' +
                '<div class="card-info">' +
                '<p class="card-name">' + esc(e.nombre + ' ' + e.apellido) + '</p>' +
                '<p class="card-email">' + esc(e.email) + '</p>' +
                '</div>' +
                '<span class="plan-badge plan-badge--' + esc(planSlug(e.plan)) + '">' + esc(e.plan) + '</span>' +
                '</div>' +
                '<div class="card-body">' +
                '<div class="card-detail"><span class="card-detail__icon">' + ico('ubicacion') + '</span><span>' + esc(e.ciudad) + '</span></div>' +
                '<div class="card-detail"><span class="card-detail__icon">' + ico('monitor') + '</span><span>' + esc(e.curso) + '</span></div>' +
                '<div class="card-detail"><span class="card-detail__icon">' + ico('calendario') + '</span><span>' + esc(formatFecha(e.fechaInscripcion)) + '</span></div>' +
                '</div>' +
                '<div class="progress-wrap">' +
                '<div class="progress-label"><span>Progreso</span><strong>' + num(e.progreso) + '%</strong></div>' +
                '<div class="progress-track"><div class="progress-fill ' + progresoClass(num(e.progreso)) + '" style="width:' + num(e.progreso) + '%"></div></div>' +
                '</div>' +
                '<div class="card-actions">' +
                '<button class="btn btn-secondary btn--sm" data-action="editar" data-id="' + num(e.id) + '">Editar</button>' +
                '<button class="btn btn-danger btn--sm" data-action="eliminar" data-id="' + num(e.id) + '">Eliminar</button>' +
                '</div>' +
                '</article>';
        }).join('');
        actualizarContador(lista.length);
        renderizarPaginacion(lista.length);
    }

    function renderizarPaginacion(totalItems) {
        var container = document.getElementById('paginationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'paginationContainer';
            container.className = 'pagination';
            var grid = document.getElementById('studentsGrid');
            if (grid) grid.parentNode.insertBefore(container, grid.nextSibling);
        }
        var totalPaginas = Math.ceil(totalItems / state.itemsPorPagina);
        if (totalPaginas <= 1) { container.innerHTML = ''; return; }
        var bA = state.paginaActual === 1 ? 'disabled' : '';
        var bS = state.paginaActual === totalPaginas ? 'disabled' : '';
        container.innerHTML =
            '<button class="btn btn-secondary btn--sm" data-action="pagina" data-page="' + (state.paginaActual - 1) + '" ' + bA + '>← Anterior</button>' +
            '<span class="pagination__info">Página ' + state.paginaActual + ' de ' + totalPaginas + '</span>' +
            '<button class="btn btn-secondary btn--sm" data-action="pagina" data-page="' + (state.paginaActual + 1) + '" ' + bS + '>Siguiente →</button>';
    }

    function cambiarPagina(p) {
        var totalPaginas = Math.ceil(state.listaFiltrada.length / state.itemsPorPagina);
        if (p >= 1 && p <= totalPaginas) {
            state.paginaActual = p;
            renderizarCards(state.listaFiltrada);
            var sec = document.getElementById('secEstudiantes');
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function actualizarContador(n) {
        var el = document.getElementById('resultsCount');
        if (el) el.innerHTML = 'Mostrando <strong>' + n + '</strong> estudiantes en total';
    }

    /* ════════════════════════════════════════════
       FILTRAR (estudiantes)
    ════════════════════════════════════════════ */
    function filtrar() {
        var q = ((document.getElementById('searchInput') || {}).value || '').toLowerCase().trim();
        var ciudad = ((document.getElementById('filterCiudad') || {}).value || '');
        var plan = ((document.getElementById('filterPlan') || {}).value || '');
        var estado = ((document.getElementById('filterEstado') || {}).value || '');
        var hay = q || ciudad || plan || estado;
        var btn = document.getElementById('btnResetFiltros');
        if (btn) btn.classList.toggle('visible', !!hay);
        state.listaFiltrada = state.estudiantes.filter(function (e) {
            return (!q || (e.nombre + ' ' + e.apellido).toLowerCase().includes(q) || e.email.toLowerCase().includes(q))
                && (!ciudad || e.ciudad === ciudad)
                && (!plan || e.plan === plan)
                && (!estado || (estado === 'activo' ? e.activo : !e.activo));
        });
        state.paginaActual = 1;
        renderizarCards(state.listaFiltrada);
    }

    /* ════════════════════════════════════════════
       MODAL ESTUDIANTE
    ════════════════════════════════════════════ */
    function abrirModal(id) {
        if (!esAdministrador()) return;
        state.editandoId = id || null;
        limpiarFormulario();
        if (id) {
            var e = state.estudiantes.find(function (x) { return x.id === id; });
            if (!e) return;
            document.getElementById('modalTitulo').textContent = 'Editar Estudiante';
            document.getElementById('fNombre').value = e.nombre;
            document.getElementById('fApellido').value = e.apellido;
            document.getElementById('fEmail').value = e.email;
            document.getElementById('fCiudad').value = e.ciudad;
            document.getElementById('fCurso').value = e.curso;
            document.getElementById('fPlan').value = e.plan;
            document.getElementById('fProgreso').value = e.progreso;
            document.getElementById('fProgresoVal').textContent = e.progreso + '%';
            document.getElementById('fFecha').value = e.fechaInscripcion;
            document.getElementById('fActivo').checked = e.activo;
            sincronizarMonto(e.plan);
        } else {
            document.getElementById('modalTitulo').textContent = 'Agregar Estudiante';
            document.getElementById('fProgreso').value = 0;
            document.getElementById('fProgresoVal').textContent = '0%';
            document.getElementById('fActivo').checked = true;
            document.getElementById('fFecha').value = new Date().toISOString().split('T')[0];
            sincronizarMonto('Básico');
        }
        document.getElementById('modalOverlay').classList.add('is-open');
        document.getElementById('fNombre').focus();
    }

    function cerrarModal() {
        document.getElementById('modalOverlay').classList.remove('is-open');
        state.editandoId = null;
    }

    function limpiarFormulario() {
        var f = document.getElementById('formEstudiante'); if (!f) return;
        f.reset();
        f.querySelectorAll('.is-error').forEach(function (el) { el.classList.remove('is-error'); });
        f.querySelectorAll('.form-group__error').forEach(function (el) { el.classList.remove('visible'); el.textContent = ''; });
    }

    function guardarEstudiante() {
        if (!esAdministrador()) return;
        var g = function (id) { return document.getElementById(id); };
        var d = {
            nombre: g('fNombre').value.trim(),
            apellido: g('fApellido').value.trim(),
            email: g('fEmail').value.trim(),
            ciudad: g('fCiudad').value,
            curso: g('fCurso').value,
            plan: g('fPlan').value,
            progreso: parseInt(g('fProgreso').value, 10),
            fecha: g('fFecha').value,
            activo: g('fActivo').checked
        };
        if (validarCampos(d).length) return;
        var monto = PLANES_MONTO[d.plan] || 29.99;
        if (state.editandoId) {
            var idx = state.estudiantes.findIndex(function (e) { return e.id === state.editandoId; });
            if (idx > -1) Object.assign(state.estudiantes[idx], {
                nombre: d.nombre, apellido: d.apellido, email: d.email,
                ciudad: d.ciudad, curso: d.curso, plan: d.plan,
                progreso: d.progreso, fechaInscripcion: d.fecha, montoUSD: monto, activo: d.activo
            });
            showToast('Estudiante actualizado', 'success');
        } else {
            var nid = state.estudiantes.length
                ? Math.max.apply(null, state.estudiantes.map(function (e) { return e.id; })) + 1
                : 1;
            state.estudiantes.push({
                id: nid, nombre: d.nombre, apellido: d.apellido, email: d.email,
                ciudad: d.ciudad, curso: d.curso, plan: d.plan,
                progreso: d.progreso, fechaInscripcion: d.fecha, montoUSD: monto, activo: d.activo
            });
            showToast('Estudiante agregado', 'success');
        }
        guardarDatos(); cerrarModal(); poblarSelectCiudades(); filtrar(); actualizarKPIs(); actualizarGrafico();
    }

    function validarCampos(d) {
        var err = [];
        [['fNombre', d.nombre, 'Nombre requerido'], ['fApellido', d.apellido, 'Apellido requerido'],
        ['fCiudad', d.ciudad, 'Selecciona ciudad'], ['fCurso', d.curso, 'Selecciona curso'],
        ['fPlan', d.plan, 'Selecciona plan'], ['fFecha', d.fecha, 'Fecha requerida']
        ].forEach(function (r) {
            setFieldError(r[0], !r[1] ? r[2] : '');
            if (!r[1]) err.push(r[0]);
        });
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!d.email || !re.test(d.email)) {
            setFieldError('fEmail', 'Email inválido'); err.push('fEmail');
        } else if (state.estudiantes.find(function (e) {
            return e.email.toLowerCase() === d.email.toLowerCase() && e.id !== state.editandoId;
        })) {
            setFieldError('fEmail', 'Email ya registrado'); err.push('fEmail');
        } else { setFieldError('fEmail', ''); }
        if (isNaN(d.progreso) || d.progreso < 0 || d.progreso > 100) {
            setFieldError('fProgreso', 'Entre 0 y 100'); err.push('fProgreso');
        } else { setFieldError('fProgreso', ''); }
        return err;
    }

    function setFieldError(id, msg) {
        var inp = document.getElementById(id); if (!inp) return;
        var errEl = inp.parentNode && inp.parentNode.querySelector('.form-group__error');
        if (msg) {
            inp.classList.add('is-error');
            if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
        } else {
            inp.classList.remove('is-error');
            if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
        }
    }

    function eliminarEstudiante(id) {
        if (!esAdministrador()) return;
        var e = state.estudiantes.find(function (x) { return x.id === id; }); if (!e) return;
        abrirConfirm(
            '¿Eliminar estudiante?',
            'Vas a eliminar a <strong>' + esc(e.nombre + ' ' + e.apellido) + '</strong>. Esta acción no se puede deshacer.',
            function () {
                state.estudiantes = state.estudiantes.filter(function (x) { return x.id !== id; });
                guardarDatos(); poblarSelectCiudades(); filtrar(); actualizarKPIs(); actualizarGrafico();
                showToast('Estudiante eliminado', 'info');
            }
        );
    }

    function abrirConfirm(t, m, cb, etiqueta) {
        document.getElementById('confirmTitulo').textContent = t;
        document.getElementById('confirmMsg').innerHTML = m;
        document.getElementById('confirmAceptar').textContent = etiqueta || 'Sí, eliminar';
        state.confirmCb = cb;
        document.getElementById('confirmOverlay').classList.add('is-open');
    }
    function cerrarConfirm() { document.getElementById('confirmOverlay').classList.remove('is-open'); state.confirmCb = null; }
    function ejecutarConfirm() { if (typeof state.confirmCb === 'function') state.confirmCb(); cerrarConfirm(); }

    /* ════════════════════════════════════════════
       GRÁFICO DASHBOARD
    ════════════════════════════════════════════ */
    function actualizarGrafico() {
        var cnt = {};
        state.estudiantes.forEach(function (e) { cnt[e.ciudad] = (cnt[e.ciudad] || 0) + 1; });
        var cities = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; });
        var vals = cities.map(function (c) { return cnt[c]; });
        var clrs = ['rgba(245,166,35,.85)', 'rgba(59,130,246,.85)', 'rgba(34,197,94,.85)',
            'rgba(139,92,246,.85)', 'rgba(249,115,22,.85)', 'rgba(236,72,153,.85)', 'rgba(20,184,166,.85)'];
        var bgColors = cities.map(function (_, i) { return clrs[i % clrs.length]; });
        if (state.grafico) {
            state.grafico.data.labels = cities;
            state.grafico.data.datasets[0].data = vals;
            state.grafico.data.datasets[0].backgroundColor = bgColors;
            state.grafico.update(); return;
        }
        var ctx = document.getElementById('ciudadesChart');
        if (!ctx || typeof Chart === 'undefined') return;
        state.grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cities, datasets: [{
                    label: 'Estudiantes', data: vals,
                    backgroundColor: bgColors, borderRadius: 6, borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#161B22', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
                        titleColor: '#F0F6FC', bodyColor: '#8B949E',
                        callbacks: { label: function (c) { return ' ' + c.parsed.y + ' estudiante' + (c.parsed.y !== 1 ? 's' : ''); } }
                    }
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8B949E', font: { family: "'DM Sans'", size: 11 } } },
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8B949E', stepSize: 1, font: { family: "'DM Sans'", size: 11 } } }
                }
            }
        });
    }

    /* ════════════════════════════════════════════
       SECCIÓN CURSOS
    ════════════════════════════════════════════ */
    var CATEGORIAS_INFO = {
        'todos': { label: 'Todos' },
        'web': { label: 'Desarrollo Web' },
        'data': { label: 'Data & IA' },
        'devops': { label: 'DevOps & Cloud' },
        'mobile': { label: 'Mobile' },
        'design': { label: 'Diseño' },
        'seguridad': { label: 'Seguridad' },
        'marketing': { label: 'Marketing' }
    };

    function renderizarCursos() {
        var sec = document.getElementById('secCursos');
        if (!sec) return;

        var filtro = state.filtroCategoria || 'todos';
        var lista = filtro === 'todos'
            ? CATALOGO_CURSOS
            : CATALOGO_CURSOS.filter(function (c) { return c.categoria === filtro; });

        /* Contar inscritos reales del dataset */
        var inscritosPorCurso = {};
        state.estudiantes.forEach(function (e) {
            inscritosPorCurso[e.curso] = (inscritosPorCurso[e.curso] || 0) + 1;
        });

        var coloresCat = {
            'web': '#3B82F6', 'data': '#F5A623', 'devops': '#8B5CF6',
            'mobile': '#F97316', 'design': '#EC4899', 'seguridad': '#EF4444',
            'marketing': '#22C55E'
        };

        /* Tabs de filtro */
        var tabsHTML = Object.keys(CATEGORIAS_INFO).map(function (k) {
            var info = CATEGORIAS_INFO[k];
            var activo = (k === filtro) ? ' cat-tab--active' : '';
            return '<button class="cat-tab' + activo + '" data-cat="' + k + '">' +
                info.label + '</button>';
        }).join('');

        /* Cards de cursos */
        var cardsHTML = lista.map(function (c) {
            var real = inscritosPorCurso[c.nombre] || c.inscritos;
            var color = coloresCat[c.categoria] || '#F5A623';
            var nivelClass = c.nivel === 'Avanzado' ? 'nivel--avanzado' : c.nivel === 'Intermedio' ? 'nivel--intermedio' : 'nivel--basico';
            return '<article class="curso-card">' +
                '<div class="curso-card__top" style="--cat-color:' + color + '">' +
                '<span class="curso-cat-badge" style="background:' + color + '20;color:' + color + ';border-color:' + color + '40">' +
                CATEGORIAS_INFO[c.categoria].label + '</span>' +
                '<span class="curso-nivel ' + nivelClass + '">' + c.nivel + '</span>' +
                '</div>' +
                '<h3 class="curso-card__title">' + c.nombre + '</h3>' +
                '<p class="curso-card__desc">' + c.descripcion + '</p>' +
                '<div class="curso-card__meta">' +
                '<span>' + c.instructor + '</span>' +
                '<span>' + c.semanas + ' sem</span>' +
                '<span>' + real + ' inscritos</span>' +
                '</div>' +
                '<div class="curso-card__footer">' +
                '<span class="plan-badge plan-badge--' + planSlug(c.precio) + '">' + c.precio + '</span>' +
                '<span class="curso-card__precio">' +
                (c.precio === 'Premium' ? '$99.99' : c.precio === 'Estándar' ? '$59.99' : '$29.99') +
                ' USD</span>' +
                '</div>' +
                '</article>';
        }).join('');

        sec.innerHTML =
            '<header class="page-header">' +
            '<div><h2 class="page-header__title">Catálogo de <span>Cursos</span></h2>' +
            '<p class="page-header__meta">' + CATALOGO_CURSOS.length + ' cursos disponibles · StudentScope MJ</p></div>' +
            '</header>' +
            '<div class="cat-tabs" role="tablist" aria-label="Filtrar por categoría">' + tabsHTML + '</div>' +
            '<p class="cursos-count">Mostrando <strong>' + lista.length + '</strong> curso' + (lista.length !== 1 ? 's' : '') + '</p>' +
            '<div class="cursos-grid">' + cardsHTML + '</div>';

        /* Eventos de los tabs */
        sec.querySelectorAll('.cat-tab').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.filtroCategoria = this.getAttribute('data-cat');
                renderizarCursos();
            });
        });
    }

    /* ════════════════════════════════════════════
       SECCIÓN REPORTES
    ════════════════════════════════════════════ */
    function renderizarReportes() {
        var sec = document.getElementById('secReportes');
        if (!sec || sec._rendered) return;

        var total = state.estudiantes.length;
        var activos = state.estudiantes.filter(function (e) { return e.activo; }).length;
        var avg = total ? Math.round(state.estudiantes.reduce(function (s, e) { return s + e.progreso; }, 0) / total) : 0;
        var ingresos = state.estudiantes.reduce(function (s, e) { return s + e.montoUSD; }, 0).toFixed(2);
        var completos = state.estudiantes.filter(function (e) { return e.progreso === 100; }).length;

        sec.innerHTML =
            '<header class="page-header">' +
            '<div><h2 class="page-header__title">Reportes <span>Analíticos</span></h2>' +
            '<p class="page-header__meta">Datos en tiempo real · ' + total + ' estudiantes</p></div>' +
            '</header>' +

            /* KPI resumen */
            '<div class="rep-kpi-grid">' +
            kpiBox('dinero', 'Ingresos totales', '$' + ingresos, 'USD acumulado', '--kpi-blue-bg', '--kpi-blue-border', '--kpi-blue-icon') +
            kpiBox('graduacion', 'Completaron curso', completos, 'con progreso 100%', '--kpi-yellow-bg', '--kpi-yellow-border', '--kpi-yellow-icon') +
            kpiBox('verificado', 'Tasa de retención', Math.round(activos / total * 100) + '%', activos + ' activos de ' + total, '--kpi-blue-bg', '--kpi-blue-border', '--kpi-blue-icon') +
            kpiBox('barras', 'Progreso promedio', avg + '%', 'promedio general', '--kpi-purple-bg', '--kpi-purple-border', '--kpi-purple-icon') +
            '</div>' +

            /* Gráficos */
            '<div class="rep-charts-row">' +
            '<section class="rep-chart-box" aria-label="Distribución por plan">' +
            '<h3 class="rep-chart-title">Estudiantes por plan</h3>' +
            '<div class="rep-canvas-wrap"><canvas id="repChartPlan"></canvas></div>' +
            '</section>' +
            '<section class="rep-chart-box" aria-label="Distribución de progreso">' +
            '<h3 class="rep-chart-title">Distribución de progreso</h3>' +
            '<div class="rep-canvas-wrap"><canvas id="repChartProgreso"></canvas></div>' +
            '</section>' +
            '</div>' +

            /* Tabla top 10 */
            '<section class="rep-table-section" aria-label="Top estudiantes por progreso">' +
            '<h3 class="rep-chart-title">Top 10 estudiantes por progreso</h3>' +
            '<div class="db-table-wrapper">' +
            renderizarTablaTop10() +
            '</div>' +
            '</section>';

        /* Esperar un tick para que el DOM esté pintado */
        setTimeout(function () { crearGraficosReportes(); }, 50);
        sec._rendered = true;
    }

    function kpiBox(icon, label, value, sub, bgVar, borderVar, colorVar) {
        return '<article class="rep-kpi-box" style="background:var(' + bgVar + ');border-color:var(' + borderVar + ')">' +
            '<div class="rep-kpi-icon" style="color:var(' + colorVar + ')">' + ico(icon) + '</div>' +
            '<div class="rep-kpi-body">' +
            '<p class="rep-kpi-label">' + esc(label) + '</p>' +
            '<p class="rep-kpi-value" style="color:var(' + colorVar + ')">' + esc(value) + '</p>' +
            '<p class="rep-kpi-sub">' + esc(sub) + '</p>' +
            '</div></article>';
    }

    function renderizarTablaTop10() {
        var top = state.estudiantes.slice().sort(function (a, b) { return b.progreso - a.progreso; }).slice(0, 10);
        var rows = top.map(function (e, i) {
            return '<tr class="db-table__row">' +
                '<td class="db-table__td"><strong>' + (i + 1) + '</strong></td>' +
                '<td class="db-table__td">' + esc(e.nombre + ' ' + e.apellido) + '</td>' +
                '<td class="db-table__td">' + esc(e.curso) + '</td>' +
                '<td class="db-table__td">' +
                '<div style="display:flex;align-items:center;gap:.5rem">' +
                '<div style="flex:1;height:6px;background:var(--color-bg-elevated);border-radius:999px;overflow:hidden">' +
                '<div style="width:' + num(e.progreso) + '%;height:100%;background:var(--color-accent-primary);border-radius:999px"></div>' +
                '</div><strong>' + num(e.progreso) + '%</strong></div></td>' +
                '<td class="db-table__td"><span class="plan-badge plan-badge--' + esc(planSlug(e.plan)) + '">' + esc(e.plan) + '</span></td>' +
                '</tr>';
        }).join('');
        return '<table class="db-table" style="min-width:520px">' +
            '<thead class="db-table__head"><tr>' +
            '<th class="db-table__th">#</th><th class="db-table__th">Estudiante</th>' +
            '<th class="db-table__th">Curso</th><th class="db-table__th">Progreso</th>' +
            '<th class="db-table__th">Plan</th>' +
            '</tr></thead><tbody>' + rows + '</tbody></table>';
    }

    function crearGraficosReportes() {
        if (typeof Chart === 'undefined') return;

        /* Gráfico 1: por plan (doughnut) */
        var cnt = { 'Básico': 0, 'Estándar': 0, 'Premium': 0 };
        state.estudiantes.forEach(function (e) { if (cnt[e.plan] !== undefined) cnt[e.plan]++; });
        var ctxPlan = document.getElementById('repChartPlan');
        if (ctxPlan && !state.graficoPlan) {
            state.graficoPlan = new Chart(ctxPlan, {
                type: 'doughnut',
                data: {
                    labels: ['Básico', 'Estándar', 'Premium'],
                    datasets: [{
                        data: [cnt['Básico'], cnt['Estándar'], cnt['Premium']],
                        backgroundColor: ['rgba(34,197,94,.8)', 'rgba(59,130,246,.8)', 'rgba(245,166,35,.8)'],
                        borderWidth: 0, hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: '65%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#8B949E', padding: 16, font: { family: "'DM Sans'", size: 12 } } },
                        tooltip: {
                            backgroundColor: '#161B22', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
                            titleColor: '#F0F6FC', bodyColor: '#8B949E'
                        }
                    }
                }
            });
        }

        /* Gráfico 2: progreso por rangos (bar horizontal) */
        var rangos = { '0-24%': 0, '25-49%': 0, '50-74%': 0, '75-99%': 0, '100%': 0 };
        state.estudiantes.forEach(function (e) {
            var p = e.progreso;
            if (p < 25) rangos['0-24%']++;
            else if (p < 50) rangos['25-49%']++;
            else if (p < 75) rangos['50-74%']++;
            else if (p < 100) rangos['75-99%']++;
            else rangos['100%']++;
        });
        var ctxProg = document.getElementById('repChartProgreso');
        if (ctxProg && !state.graficoProgreso) {
            state.graficoProgreso = new Chart(ctxProg, {
                type: 'bar',
                data: {
                    labels: Object.keys(rangos),
                    datasets: [{
                        label: 'Estudiantes', data: Object.values(rangos),
                        backgroundColor: ['rgba(239,68,68,.75)', 'rgba(249,115,22,.75)', 'rgba(245,166,35,.75)',
                            'rgba(59,130,246,.75)', 'rgba(34,197,94,.75)'],
                        borderRadius: 6, borderSkipped: false
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#161B22', borderColor: 'rgba(255,255,255,.1)', borderWidth: 1,
                            titleColor: '#F0F6FC', bodyColor: '#8B949E'
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' },
                            ticks: { color: '#8B949E', stepSize: 1, font: { family: "'DM Sans'", size: 11 } }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#8B949E', font: { family: "'DM Sans'", size: 11 } }
                        }
                    }
                }
            });
        }
    }

    /* ════════════════════════════════════════════
       SECCIÓN CONFIGURACIÓN
    ════════════════════════════════════════════ */
    function renderizarConfiguracion() {
        var sec = document.getElementById('secConfiguracion');
        if (!sec || sec._rendered) return;

        var admin = esAdministrador();
        var u = state.usuario || {};

        sec.innerHTML =
            '<header class="page-header">' +
            '<div><h2 class="page-header__title">' +
            (admin ? 'Configuración <span>del Sistema</span>' : 'Mi <span>perfil</span>') + '</h2>' +
            '<p class="page-header__meta">' +
            (admin ? 'Ajustes generales · StudentScope MJ v2.3' : 'Tus datos y tu contraseña') + '</p></div>' +
            '</header>' +

            '<div class="config-grid">' +

            /* Tarjeta: Perfil */
            '<section class="config-card" aria-labelledby="cfg-perfil">' +
            '<h3 class="config-card__title" id="cfg-perfil">Mi cuenta</h3>' +
            '<div class="config-form">' +
            '<div class="form-group"><label class="config-label" for="cfgNombre">Nombre completo</label>' +
            '<input type="text" class="form-input config-input" id="cfgNombre" maxlength="100" value="' + esc(u.nombre) + '" />' +
            '<span class="form-group__error" aria-live="polite"></span></div>' +
            '<div class="form-group"><label class="config-label" for="cfgEmail">Correo electrónico</label>' +
            '<input type="email" class="form-input config-input" id="cfgEmail" value="' + esc(u.email) + '" readonly /></div>' +
            '<div class="form-group"><label class="config-label" for="cfgRol">Rol</label>' +
            '<input type="text" class="form-input config-input" id="cfgRol" value="' + (admin ? 'Administrador' : 'Usuario') + '" readonly /></div>' +
            '<button class="btn btn-primary" id="btnGuardarPerfil" data-action="guardar-perfil">Guardar perfil</button>' +
            '</div></section>' +

            /* Tarjeta: Seguridad */
            '<section class="config-card" aria-labelledby="cfg-seg">' +
            '<h3 class="config-card__title" id="cfg-seg">Seguridad</h3>' +
            '<div class="config-form">' +
            '<div class="form-group"><label class="config-label" for="cfgPassActual">Contraseña actual</label>' +
            '<input type="password" class="form-input config-input" id="cfgPassActual" autocomplete="current-password" />' +
            '<span class="form-group__error" aria-live="polite"></span></div>' +
            '<div class="form-group"><label class="config-label" for="cfgPassNueva">Nueva contraseña</label>' +
            '<input type="password" class="form-input config-input" id="cfgPassNueva" autocomplete="new-password" />' +
            '<span class="form-group__error" aria-live="polite"></span></div>' +
            '<div class="form-group"><label class="config-label" for="cfgPassConfirm">Confirmar contraseña</label>' +
            '<input type="password" class="form-input config-input" id="cfgPassConfirm" autocomplete="new-password" />' +
            '<span class="form-group__error" aria-live="polite"></span></div>' +
            '<button class="btn btn-primary" id="btnCambiarPassword" data-action="cambiar-password">Cambiar contraseña</button>' +
            '</div></section>' +

            (admin ? (
            /* Tarjetas solo para administradores: Notificaciones y Sistema */
            '<section class="config-card" aria-labelledby="cfg-notif">' +
            '<h3 class="config-card__title" id="cfg-notif">Notificaciones</h3>' +
            '<div class="config-toggles">' +
            toggleRow('notifEmail', 'Notificaciones por email', true) +
            toggleRow('notifProgreso', 'Alertas de progreso bajo (<40%)', true) +
            toggleRow('notifNuevos', 'Nuevos registros de estudiantes', true) +
            toggleRow('notifInactivos', 'Recordatorio de inactivos', false) +
            toggleRow('notifReportes', 'Reportes semanales automáticos', false) +
            '</div>' +
            '<button class="btn btn-primary" style="margin-top:1.25rem" data-action="guardar-notificaciones">Guardar preferencias</button>' +
            '</section>' +

            /* Tarjeta: Sistema */
            '<section class="config-card" aria-labelledby="cfg-sys">' +
            '<h3 class="config-card__title" id="cfg-sys">Sistema y datos</h3>' +
            '<div class="config-actions-list">' +
            '<div class="config-action-row">' +
            '<div><p class="config-action-title">Exportar estudiantes (JSON)</p>' +
            '<p class="config-action-sub">Descarga todos los registros en formato JSON</p></div>' +
            '<button class="btn btn-secondary" data-action="exportar-json">Exportar</button>' +
            '</div>' +
            '<div class="config-action-row">' +
            '<div><p class="config-action-title">Exportar estudiantes (CSV)</p>' +
            '<p class="config-action-sub">Compatible con Excel y Google Sheets</p></div>' +
            '<button class="btn btn-secondary" data-action="exportar-csv">Exportar CSV</button>' +
            '</div>' +
            '<div class="config-action-row config-action-row--danger">' +
            '<div><p class="config-action-title">Restablecer datos</p>' +
            '<p class="config-action-sub">Elimina todos los cambios y restaura los 35 registros originales</p></div>' +
            '<button class="btn btn-danger" data-action="restablecer-datos">Restablecer</button>' +
            '</div>' +
            '</div>' +
            '<p class="config-version">StudentScope MJ v2.3 · Vanilla JS · CSS Puro · Sin frameworks</p>' +
            '</section>') : '') +

            '</div>';

        sec._rendered = true;
    }

    function toggleRow(id, label, checked) {
        return '<div class="toggle-row">' +
            '<label class="toggle-label" for="' + id + '">' + label + '</label>' +
            '<label class="toggle-switch" aria-label="' + label + '">' +
            '<input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + ' />' +
            '<span class="toggle-track"><span class="toggle-thumb"></span></span>' +
            '</label></div>';
    }

    /* Acciones de configuración */
    async function guardarPerfil() {
        var campo = document.getElementById('cfgNombre');
        var boton = document.getElementById('btnGuardarPerfil');
        var nombre = campo ? campo.value.trim() : '';

        setFieldError('cfgNombre', nombre ? '' : 'El nombre es obligatorio');
        if (!nombre) return;

        if (boton) boton.disabled = true;
        try {
            var r = await window.EduTrack.api.patch('/api/auth/yo', { nombre: nombre });
            actualizarUsuarioActual(r.usuario);
            showToast('Perfil guardado correctamente', 'success');
        } catch (error) {
            setFieldError('cfgNombre', (error.campos && error.campos.nombre) || error.message);
        } finally {
            if (boton) boton.disabled = false;
        }
    }

    async function cambiarPassword() {
        var valor = function (id) { return (document.getElementById(id) || {}).value || ''; };
        var actual = valor('cfgPassActual');
        var nueva = valor('cfgPassNueva');
        var confirmacion = valor('cfgPassConfirm');
        var boton = document.getElementById('btnCambiarPassword');

        setFieldError('cfgPassActual', actual ? '' : 'Ingresa tu contraseña actual');
        setFieldError('cfgPassNueva', nueva ? '' : 'Ingresa la nueva contraseña');
        setFieldError('cfgPassConfirm', nueva === confirmacion ? '' : 'Las contraseñas no coinciden');
        if (!actual || !nueva || nueva !== confirmacion) return;

        if (boton) boton.disabled = true;
        try {
            await window.EduTrack.api.patch('/api/auth/yo', { passwordActual: actual, passwordNueva: nueva });
            ['cfgPassActual', 'cfgPassNueva', 'cfgPassConfirm'].forEach(function (id) {
                var el = document.getElementById(id); if (el) el.value = '';
            });
            showToast('Contraseña actualizada correctamente', 'success');
        } catch (error) {
            var campos = error.campos || {};
            setFieldError('cfgPassActual', campos.passwordActual || '');
            setFieldError('cfgPassNueva', campos.passwordNueva || (campos.passwordActual ? '' : error.message));
        } finally {
            if (boton) boton.disabled = false;
        }
    }

    function guardarNotificaciones() {
        showToast('Preferencias de notificaciones guardadas', 'success');
    }

    function exportarJSON() {
        var blob = new Blob([JSON.stringify(state.estudiantes, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'edutrack_estudiantes.json'; a.click();
        URL.revokeObjectURL(url);
        showToast('JSON exportado correctamente', 'success');
    }

    function exportarCSV() {
        var headers = ['id', 'nombre', 'apellido', 'email', 'ciudad', 'curso', 'progreso', 'fechaInscripcion', 'plan', 'montoUSD', 'activo'];
        var rows = [headers.join(',')];
        state.estudiantes.forEach(function (e) {
            rows.push(headers.map(function (h) {
                var v = e[h];
                if (typeof v === 'string' && v.indexOf(',') > -1) v = '"' + v + '"';
                return v;
            }).join(','));
        });
        var blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'edutrack_estudiantes.csv'; a.click();
        URL.revokeObjectURL(url);
        showToast('CSV exportado correctamente', 'success');
    }

    function restablecerDatos() {
        abrirConfirm(
            '¿Restablecer datos?',
            'Se borrarán <strong>todos los cambios</strong> y se cargarán los 35 registros originales. Esta acción no se puede deshacer.',
            function () {
                state.estudiantes = DATASET_INICIAL.slice();
                guardarDatos();
                poblarSelectCiudades();
                filtrar();
                actualizarKPIs();
                actualizarGrafico();
                /* Forzar re-render de reportes al volver */
                var secRep = document.getElementById('secReportes');
                if (secRep) secRep._rendered = false;
                state.graficoPlan = null;
                state.graficoProgreso = null;
                showToast('Datos restablecidos a los 35 originales', 'info');
            },
            'Sí, restablecer'
        );
    }

    /* ════════════════════════════════════════════
       HELPERS
    ════════════════════════════════════════════ */
    function sincronizarMonto(plan) {
        var el = document.getElementById('fMontoDisplay');
        if (el && PLANES_MONTO[plan]) el.textContent = 'USD $' + PLANES_MONTO[plan];
    }

    function poblarSelectCiudades() {
        var arr = [];
        state.estudiantes.forEach(function (e) { if (arr.indexOf(e.ciudad) === -1) arr.push(e.ciudad); });
        arr.sort();
        var sel = document.getElementById('filterCiudad'); if (!sel) return;
        var cur = sel.value;
        while (sel.options.length > 1) sel.remove(1);
        arr.forEach(function (c) {
            var o = document.createElement('option'); o.value = c; o.textContent = c;
            if (c === cur) o.selected = true;
            sel.appendChild(o);
        });
    }

    var _toastTimer;
    function showToast(msg, tipo) {
        var icons = { success: '✓', error: '×', info: 'i' };
        var t = document.getElementById('toast'); if (!t) return;
        t.className = 'toast toast--' + (tipo || 'success');
        const icono = document.createElement('span');
        icono.className = 'toast__icon';
        icono.textContent = icons[tipo] || '✓';
        t.replaceChildren(icono, document.createTextNode(' ' + msg));
        t.classList.add('is-visible');
        clearTimeout(_toastTimer);
        _toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 3000);
    }


    /* ════════════════════════════════════════════
       PANEL DE NOTIFICACIONES
    ════════════════════════════════════════════ */
    var notifPanelAbierto = false;

    function generarNotificaciones() {
        var notifs = [];
        var ahora = new Date();

        /* 1. Estudiantes inactivos con bajo progreso (abandono) */
        state.estudiantes
            .filter(function (e) { return !e.activo && e.progreso < 50; })
            .forEach(function (e) {
                notifs.push({
                    tipo: 'warning',
                    icono: 'alerta',
                    titulo: 'Posible abandono',
                    texto: e.nombre + ' ' + e.apellido + ' está inactivo con solo ' + e.progreso + '% de progreso.',
                    tiempo: 'Hoy'
                });
            });

        /* 2. Estudiantes con progreso 100% aún activos */
        state.estudiantes
            .filter(function (e) { return e.activo && e.progreso === 100; })
            .forEach(function (e) {
                notifs.push({
                    tipo: 'success',
                    icono: 'graduacion',
                    titulo: '¡Curso completado!',
                    texto: e.nombre + ' ' + e.apellido + ' completó "' + e.curso + '" al 100%.',
                    tiempo: 'Hoy'
                });
            });

        /* 3. Estudiantes con progreso bajo (< 30%) y activos */
        state.estudiantes
            .filter(function (e) { return e.activo && e.progreso < 30; })
            .forEach(function (e) {
                notifs.push({
                    tipo: 'info',
                    icono: 'tendenciaBaja',
                    titulo: 'Progreso bajo',
                    texto: e.nombre + ' ' + e.apellido + ' lleva solo ' + e.progreso + '% en "' + e.curso + '".',
                    tiempo: 'Reciente'
                });
            });

        /* 4. Resumen general */
        var activos = state.estudiantes.filter(function (e) { return e.activo; }).length;
        var inactivos = state.estudiantes.length - activos;
        var avg = state.estudiantes.length
            ? Math.round(state.estudiantes.reduce(function (s, e) { return s + e.progreso; }, 0) / state.estudiantes.length)
            : 0;

        notifs.unshift({
            tipo: 'stat',
            icono: 'barras',
            titulo: 'Resumen del sistema',
            texto: state.estudiantes.length + ' estudiantes · ' + activos + ' activos · ' + inactivos + ' inactivos · Promedio ' + avg + '%',
            tiempo: 'Ahora'
        });

        /* 5. Ingresos del mes actual */
        var mesActual = ahora.getMonth();
        var anioActual = ahora.getFullYear();
        var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        var ingresosMes = state.estudiantes
            .filter(function (e) {
                var d = new Date(e.fechaInscripcion);
                return d.getMonth() === mesActual && d.getFullYear() === anioActual;
            })
            .reduce(function (s, e) { return s + e.montoUSD; }, 0);

        if (ingresosMes > 0) {
            notifs.push({
                tipo: 'success',
                icono: 'dinero',
                titulo: 'Ingresos ' + meses[mesActual],
                texto: '$' + ingresosMes.toFixed(2) + ' USD generados este mes.',
                tiempo: 'Este mes'
            });
        }

        return notifs.slice(0, 12); /* máximo 12 notificaciones */
    }

    function abrirPanelNotificaciones() {
        var panel = document.getElementById('notifPanel');
        if (!panel || !esAdministrador()) return;

        var notifs = generarNotificaciones();
        var colores = {
            warning: { bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.25)', dot: '#F5A623' },
            success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', dot: '#22C55E' },
            info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', dot: '#3B82F6' },
            stat: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', dot: '#8B5CF6' }
        };

        var itemsHTML = notifs.map(function (n) {
            var c = colores[n.tipo] || colores.info;
            return '<div class="notif-item" style="background:' + c.bg + ';border-color:' + c.border + '">' +
                '<div class="notif-item__left">' +
                '<span class="notif-dot" style="background:' + c.dot + '"></span>' +
                '<span class="notif-icono">' + ico(n.icono) + '</span>' +
                '</div>' +
                '<div class="notif-item__body">' +
                '<p class="notif-titulo">' + esc(n.titulo) + '</p>' +
                '<p class="notif-texto">' + esc(n.texto) + '</p>' +
                '</div>' +
                '<span class="notif-tiempo">' + esc(n.tiempo) + '</span>' +
                '</div>';
        }).join('');

        var panelContent = document.getElementById('notifPanelContent');
        if (panelContent) {
            panelContent.innerHTML = itemsHTML ||
                '<p class="notif-empty">No hay notificaciones pendientes.</p>';
        }

        var badge = document.getElementById('notifBadge');
        var warnings = notifs.filter(function (n) { return n.tipo === 'warning'; }).length;
        if (badge) {
            badge.textContent = warnings || '';
            badge.style.display = warnings ? 'flex' : 'none';
        }

        notifPanelAbierto = !notifPanelAbierto;
        panel.classList.toggle('is-open', notifPanelAbierto);
    }

    function cerrarPanelNotificaciones() {
        var panel = document.getElementById('notifPanel');
        if (panel) panel.classList.remove('is-open');
        notifPanelAbierto = false;
    }

    /* ════════════════════════════════════════════
       SESIÓN Y CUENTAS
    ════════════════════════════════════════════ */
    function mostrarErrorCampo(idError, mensaje) {
        var el = document.getElementById(idError);
        if (!el) return;
        el.textContent = mensaje || '';
        el.classList.toggle('visible', !!mensaje);
    }

    function limpiarErrores(ids) {
        ids.forEach(function (id) { mostrarErrorCampo(id, ''); });
    }

    function mostrarErroresServidor(error, mapa, idGeneral) {
        var usado = false;
        Object.keys(error.campos || {}).forEach(function (campo) {
            if (mapa[campo]) {
                mostrarErrorCampo(mapa[campo], error.campos[campo]);
                usado = true;
            }
        });
        if (!usado) mostrarErrorCampo(idGeneral, error.message);
    }

    function ocupado(boton, estaOcupado, texto) {
        if (!boton) return;
        if (estaOcupado) {
            boton.dataset.texto = boton.textContent;
            boton.textContent = texto;
        } else if (boton.dataset.texto) {
            boton.textContent = boton.dataset.texto;
        }
        boton.disabled = estaOcupado;
    }

    function entrar(usuario) {
        state.usuario = usuario;
        mostrarVista('dashboard', usuario);
    }

    function actualizarUsuarioActual(usuario) {
        state.usuario = usuario;
        actualizarUsuarioDashboard(usuario);
        var campoNombre = document.getElementById('cfgNombre');
        if (campoNombre) campoNombre.value = usuario.nombre;
    }

    function limpiarSesionLocal() {
        state.usuario = null;
        cerrarPanelNotificaciones();
        window.EduTrack.cuentas.reiniciar();
    }

    async function iniciarSesion(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value;
        var boton = document.getElementById('btnLogin');

        limpiarErrores(['loginEmailError', 'loginPasswordError']);
        if (!email) mostrarErrorCampo('loginEmailError', 'Ingresa tu correo');
        if (!password) mostrarErrorCampo('loginPasswordError', 'Ingresa tu contraseña');
        if (!email || !password) return;

        ocupado(boton, true, 'Ingresando…');
        try {
            var r = await window.EduTrack.api.post('/api/auth/login', { email: email, password: password });
            document.getElementById('loginPassword').value = '';
            entrar(r.usuario);
        } catch (error) {
            mostrarErroresServidor(error, { email: 'loginEmailError', password: 'loginPasswordError' }, 'loginPasswordError');
        } finally {
            ocupado(boton, false);
        }
    }

    function errorPasswordLocal(password) {
        if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (password.length > 72) return 'La contraseña no puede superar 72 caracteres';
        if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'La contraseña debe incluir letras y números';
        return '';
    }

    async function registrarCuenta(e) {
        e.preventDefault();
        var valor = function (id) { return document.getElementById(id).value; };
        var nombre = valor('regNombre').trim();
        var email = valor('regEmail').trim();
        var password = valor('regPassword');
        var repetida = valor('regPassword2');
        var boton = document.getElementById('btnRegistro');

        limpiarErrores(['regNombreError', 'regEmailError', 'regPasswordError', 'regPassword2Error']);
        var errores = {
            regNombreError: nombre ? '' : 'Ingresa tu nombre',
            regEmailError: email ? '' : 'Ingresa tu correo',
            regPasswordError: errorPasswordLocal(password),
            regPassword2Error: password === repetida ? '' : 'Las contraseñas no coinciden'
        };
        var hayErrores = false;
        Object.keys(errores).forEach(function (id) {
            mostrarErrorCampo(id, errores[id]);
            if (errores[id]) hayErrores = true;
        });
        if (hayErrores) return;

        ocupado(boton, true, 'Creando cuenta…');
        try {
            var r = await window.EduTrack.api.post('/api/auth/registro', { nombre: nombre, email: email, password: password });
            ['regNombre', 'regEmail', 'regPassword', 'regPassword2'].forEach(function (id) {
                document.getElementById(id).value = '';
            });
            entrar(r.usuario);
            showToast('Cuenta creada. Te damos la bienvenida', 'success');
        } catch (error) {
            if (error.codigo === 'EMAIL_DUPLICADO') {
                mostrarErrorCampo('regEmailError', error.message);
            } else {
                mostrarErroresServidor(error, {
                    nombre: 'regNombreError', email: 'regEmailError', password: 'regPasswordError'
                }, 'regPassword2Error');
            }
        } finally {
            ocupado(boton, false);
        }
    }

    async function cerrarSesion() {
        try {
            await window.EduTrack.api.post('/api/auth/logout');
        } catch {
            /* la sesión local se cierra de todos modos */
        }
        limpiarSesionLocal();
        mostrarVista('landing');
    }

    function sesionExpirada() {
        if (!state.usuario) return;
        limpiarSesionLocal();
        mostrarVista('login');
        showToast('Tu sesión expiró. Inicia sesión de nuevo', 'info');
    }

    async function restaurarSesion() {
        try {
            var r = await window.EduTrack.api.get('/api/auth/yo');
            entrar(r.usuario);
        } catch {
            /* sin sesión activa: se queda la página de inicio */
        }
    }

    /* ════════════════════════════════════════════
       INIT
    ════════════════════════════════════════════ */
    function init() {
        window.EduTrack.pintarIconos();

        var vLanding = document.getElementById('view-landing');
        if (vLanding) vLanding.classList.add('view--active');

        var fLogin = document.getElementById('formLogin');
        if (fLogin) fLogin.addEventListener('submit', iniciarSesion);

        var fRegistro = document.getElementById('formRegistro');
        if (fRegistro) fRegistro.addEventListener('submit', registrarCuenta);

        document.addEventListener('studentscope:sesion-expirada', sesionExpirada);

        var btnNotif = document.getElementById('btnNotificaciones');
        if (btnNotif) {
            btnNotif.addEventListener('click', function (e) {
                e.stopPropagation();
                abrirPanelNotificaciones();
            });
        }

        /* Cerrar panel al hacer click fuera */
        document.addEventListener('click', function (e) {
            var panel = document.getElementById('notifPanel');
            var btn = document.getElementById('btnNotificaciones');
            if (panel && notifPanelAbierto &&
                !panel.contains(e.target) &&
                e.target !== btn && !btn.contains(e.target)) {
                cerrarPanelNotificaciones();
            }
        });

        /* ── FIX: Logout → landing (no login) ── */
        var btnLogout = document.getElementById('btnLogout');
        if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);

        initNavSidebar();

        var si = document.getElementById('searchInput');
        if (si) si.addEventListener('input', filtrar);
        ['filterCiudad', 'filterPlan', 'filterEstado'].forEach(function (id) {
            var el = document.getElementById(id); if (el) el.addEventListener('change', filtrar);
        });

        var bReset = document.getElementById('btnResetFiltros');
        if (bReset) bReset.addEventListener('click', function () {
            ['searchInput', 'filterCiudad', 'filterPlan', 'filterEstado'].forEach(function (id) {
                var el = document.getElementById(id); if (el) el.value = '';
            });
            filtrar();
        });

        var sl = document.getElementById('fProgreso');
        var sv = document.getElementById('fProgresoVal');
        if (sl && sv) sl.addEventListener('input', function () { sv.textContent = this.value + '%'; });

        var fp = document.getElementById('fPlan');
        if (fp) fp.addEventListener('change', function () { sincronizarMonto(this.value); });

        var ba = document.getElementById('btnAgregarEstudiante');
        if (ba) ba.addEventListener('click', function () { abrirModal(); });

        var mo = document.getElementById('modalOverlay');
        if (mo) mo.addEventListener('click', function (e) { if (e.target === mo) cerrarModal(); });

        var co = document.getElementById('confirmOverlay');
        if (co) co.addEventListener('click', function (e) { if (e.target === co) cerrarConfirm(); });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { cerrarModal(); cerrarConfirm(); }
        });

        document.addEventListener('click', function (e) {
            const elemento = e.target.closest('[data-action]');
            if (!elemento || elemento.disabled) return;
            const accion = ACCIONES[elemento.getAttribute('data-action')];
            if (accion) accion(elemento);
        });

        window.EduTrack.cuentas.iniciar();
        restaurarSesion();
    }

    const ACCIONES = {
        'ir-login': function () { mostrarVista('login'); },
        'ir-registro': function () { mostrarVista('registro'); },
        'ir-landing': function () { mostrarVista('landing'); },
        'editar': function (el) { abrirModal(num(el.getAttribute('data-id'))); },
        'eliminar': function (el) { eliminarEstudiante(num(el.getAttribute('data-id'))); },
        'pagina': function (el) { cambiarPagina(num(el.getAttribute('data-page'))); },
        'cerrar-modal': function () { cerrarModal(); },
        'guardar-estudiante': function () { guardarEstudiante(); },
        'cerrar-confirm': function () { cerrarConfirm(); },
        'ejecutar-confirm': function () { ejecutarConfirm(); },
        'cerrar-notificaciones': function () { cerrarPanelNotificaciones(); },
        'guardar-perfil': function () { guardarPerfil(); },
        'cambiar-password': function () { cambiarPassword(); },
        'guardar-notificaciones': function () { guardarNotificaciones(); },
        'exportar-json': function () { exportarJSON(); },
        'exportar-csv': function () { exportarCSV(); },
        'restablecer-datos': function () { restablecerDatos(); }
    };

    /* API pública */
    window.EduTrack = window.EduTrack || {};
    window.EduTrack.abrirModal = abrirModal;
    window.EduTrack.cerrarModal = cerrarModal;
    window.EduTrack.guardarEstudiante = guardarEstudiante;
    window.EduTrack.eliminarEstudiante = eliminarEstudiante;
    window.EduTrack.cerrarConfirm = cerrarConfirm;
    window.EduTrack.ejecutarConfirm = ejecutarConfirm;
    window.EduTrack.mostrarVista = mostrarVista;
    window.EduTrack.cambiarPagina = cambiarPagina;
    window.EduTrack.guardarPerfil = guardarPerfil;
    window.EduTrack.cambiarPassword = cambiarPassword;
    window.EduTrack.guardarNotificaciones = guardarNotificaciones;
    window.EduTrack.exportarJSON = exportarJSON;
    window.EduTrack.exportarCSV = exportarCSV;
    window.EduTrack.restablecerDatos = restablecerDatos;
    window.EduTrack.cerrarPanelNotificaciones = cerrarPanelNotificaciones;
    window.EduTrack.toast = showToast;
    window.EduTrack.confirmar = abrirConfirm;
    window.EduTrack.marcarError = setFieldError;
    window.EduTrack.usuarioActual = function () { return state.usuario; };
    window.EduTrack.actualizarUsuarioActual = actualizarUsuarioActual;
    window.EduTrack.registrarAcciones = function (acciones) { Object.assign(ACCIONES, acciones); };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();