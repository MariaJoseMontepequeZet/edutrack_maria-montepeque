(function () {
    'use strict';

    /* Catálogo oficial de cursos: única fuente para la interfaz y el validador. */
    const CURSOS = [
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

    const api = {
        cursos: CURSOS,
        nombres: CURSOS.map(function (curso) { return curso.nombre; })
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        window.EduTrack = window.EduTrack || {};
        window.EduTrack.catalogo = api;
    }
})();
