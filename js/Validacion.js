(function () {
    'use strict';

    /**
     * StudentScope MJ — validacion.js
     * ─────────────────────────────────────────────────────────────
     * META-VALIDACIÓN del dataset de estudiantes.
     *
     * Propósito:
     * Detectar, clasificar y documentar todos los errores presentes
     * en el array de estudiantes ANTES de que lleguen a la interfaz.
     * Ningún dato corrupto, incoherente o malformado debe renderizarse.
     *
     * Función principal:
     * dataset(estudiantes) → ResultadoValidacion
     *
     * Niveles de error:
     * ERROR   → el registro no puede usarse (dato crítico inválido)
     * WARNING → el registro puede usarse pero tiene inconsistencias
     * INFO    → observación de negocio, no bloquea el uso
     *
     * Uso rápido:
     * var resultado = EduTrack.validar.dataset(estudiantes);
     * console.log(resultado.reporte);
     * renderizarTabla(resultado.registrosValidos);
     * ─────────────────────────────────────────────────────────────
     */

    /* ============================================================
       1. CONSTANTES DE NEGOCIO
       Fuente única de verdad para todas las reglas.
       Si cambian las reglas, solo se edita esta sección.
       ============================================================ */

    /** Planes válidos y su precio exacto en USD */
    var PLANES = {
        'Básico': 29.99,
        'Estándar': 59.99,
        'Premium': 99.99
    };

    /** Cursos oficiales del catálogo StudentScope MJ */
    var CURSOS_VALIDOS = [
        'Desarrollo Web',
        'Diseño UX/UI',
        'Marketing Digital',
        'Full Stack Web',
        'Python y Data Science',
        'DevOps y Cloud',
        'React Native',
        'SQL y Bases de Datos'
    ];

    /** Ciudades colombianas reconocidas por el sistema */
    var CIUDADES_VALIDAS = [
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla',
        'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales',
        'Santa Marta', 'Cúcuta', 'Villavicencio', 'Armenia'
    ];

    /** Rango de fechas de inscripción permitido (inclusivo) */
    var FECHA_MIN = new Date('2023-01-01');
    var FECHA_MAX = new Date('2025-05-01');

    /** Rango válido del campo progreso */
    var PROGRESO_MIN = 0;
    var PROGRESO_MAX = 100;

    /** Mínimo de estudiantes inactivos exigido por la regla de negocio */
    var MIN_INACTIVOS = 5;

    /** Porcentaje máximo que un solo curso puede concentrar del dataset */
    var MAX_CONCENTRACION_CURSO = 60;

    /** Campos que todo registro debe tener (schema del estudiante) */
    var CAMPOS_REQUERIDOS = [
        'id', 'nombre', 'apellido', 'email',
        'ciudad', 'curso', 'progreso',
        'fechaInscripcion', 'plan', 'montoUSD', 'activo'
    ];

    /** Tipos de dato esperados por campo */
    var TIPOS_ESPERADOS = {
        id: 'number',
        nombre: 'string',
        apellido: 'string',
        email: 'string',
        ciudad: 'string',
        curso: 'string',
        progreso: 'number',
        fechaInscripcion: 'string',
        plan: 'string',
        montoUSD: 'number',
        activo: 'boolean'
    };

    /** Expresión regular para validar formato de email */
    var REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    /** Expresión regular para validar formato de fecha ISO YYYY-MM-DD */
    var REGEX_FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;


    /* ============================================================
       2. UTILIDADES INTERNAS
       Funciones de apoyo reutilizadas por los validadores.
       ============================================================ */

    /**
     * Crea un objeto de error estandarizado con estructura consistente.
     *
     * @param {string}      nivel   'ERROR' | 'WARNING' | 'INFO'
     * @param {number|null} id      ID del registro afectado (null si es del dataset)
     * @param {string}      campo   Nombre del campo con el problema
     * @param {string}      regla   Código de la regla violada (ej: 'V-11')
     * @param {string}      mensaje Descripción legible del problema
     * @param {*}           valor   Valor problemático encontrado
     * @returns {object}
     */
    function crearError(nivel, id, campo, regla, mensaje, valor) {
        return {
            nivel: nivel,
            id: id,
            campo: campo,
            regla: regla,
            mensaje: mensaje,
            valor: valor !== undefined ? String(valor) : 'undefined'
        };
    }

    /**
     * Devuelve true si el valor es una cadena con al menos un carácter
     * no-espacio después de hacer trim().
     */
    function esStringValido(valor) {
        return typeof valor === 'string' && valor.trim().length > 0;
    }

    /**
     * Devuelve true si la cadena representa una fecha ISO real y válida.
     * Rechaza tanto formatos incorrectos ('2023/01/15') como fechas
     * sintácticamente válidas pero inexistentes ('2023-02-30').
     */
    function esFechaISOValida(cadena) {
        if (typeof cadena !== 'string') return false;
        if (!REGEX_FECHA_ISO.test(cadena)) return false;
        var partes = cadena.split('-').map(Number);
        var fecha = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));
        return fecha.getUTCFullYear() === partes[0] &&
            fecha.getUTCMonth() === partes[1] - 1 &&
            fecha.getUTCDate() === partes[2];
    }

    /**
     * Devuelve true si el valor numérico está dentro de [min, max] inclusive.
     */
    function enRango(valor, min, max) {
        return typeof valor === 'number' && valor >= min && valor <= max;
    }

    /**
     * Redondea a N decimales usando aritmética entera para evitar
     * errores de coma flotante (0.1 + 0.2 !== 0.3 en IEEE 754).
     */
    function redondear(valor, decimales) {
        var factor = Math.pow(10, decimales);
        return Math.round(valor * factor) / factor;
    }


    /* ============================================================
       3. VALIDADORES POR REGISTRO
       Cada función recibe UN registro y devuelve un array de errores.
       Array vacío = registro pasa esa validación sin problemas.
       ============================================================ */

    /**
     * V-01 | ERROR
     * Verifica que todos los campos del schema estén presentes y no sean null.
     * Un campo ausente o nulo impide cualquier otra validación sobre él.
     */
    function validarCamposRequeridos(registro) {
        var errores = [];

        CAMPOS_REQUERIDOS.forEach(function (campo) {
            if (registro[campo] === undefined || registro[campo] === null) {
                errores.push(crearError(
                    'ERROR',
                    registro.id,
                    campo,
                    'V-01',
                    'Campo obligatorio ausente o con valor null',
                    registro[campo]
                ));
            }
        });

        return errores;
    }

    /**
     * V-02 | ERROR
     * Verifica que cada campo tenga el tipo de dato JavaScript correcto.
     * Solo se ejecuta sobre campos que ya existen (no null/undefined),
     * para no duplicar errores con V-01.
     */
    function validarTipos(registro) {
        var errores = [];

        Object.keys(TIPOS_ESPERADOS).forEach(function (campo) {
            var tipoEsperado = TIPOS_ESPERADOS[campo];
            var valor = registro[campo];

            // Omitir si el campo ya está ausente (V-01 lo captura)
            if (valor === undefined || valor === null) return;

            var tipoReal = typeof valor;
            if (tipoReal !== tipoEsperado) {
                errores.push(crearError(
                    'ERROR',
                    registro.id,
                    campo,
                    'V-02',
                    'Tipo incorrecto en "' + campo + '". ' +
                    'Esperado: ' + tipoEsperado + ', recibido: ' + tipoReal,
                    valor
                ));
            }
        });

        return errores;
    }

    /**
     * V-03 | ERROR
     * El ID debe ser un número entero positivo.
     * La unicidad entre registros se valida en V-14 (nivel dataset).
     */
    function validarId(registro) {
        var errores = [];
        var id = registro.id;

        if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
            errores.push(crearError(
                'ERROR',
                id,
                'id',
                'V-03',
                'El ID debe ser un entero positivo mayor a 0',
                id
            ));
        }

        return errores;
    }

    /**
     * V-04 | ERROR
     * Valida el formato del email contra la expresión regular.
     * La unicidad entre registros se valida en V-15 (nivel dataset).
     */
    function validarEmail(registro) {
        var errores = [];
        var email = registro.email;

        if (typeof email !== 'string') return errores; // V-02 ya lo captura

        if (!REGEX_EMAIL.test(email.trim())) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'email',
                'V-04',
                'Formato de email inválido. Debe seguir el patrón usuario@dominio.ext',
                email
            ));
        }

        return errores;
    }

    /**
     * V-05 | ERROR
     * Nombre y apellido no pueden ser cadenas vacías o solo espacios.
     */
    function validarNombres(registro) {
        var errores = [];

        ['nombre', 'apellido'].forEach(function (campo) {
            var valor = registro[campo];
            if (typeof valor === 'string' && !esStringValido(valor)) {
                errores.push(crearError(
                    'ERROR',
                    registro.id,
                    campo,
                    'V-05',
                    'El campo "' + campo + '" no puede ser vacío ni contener solo espacios',
                    valor
                ));
            }
        });

        return errores;
    }

    /**
     * V-06 | WARNING
     * La ciudad debe pertenecer al listado oficial de ciudades colombianas.
     * Es WARNING porque no bloquea el uso del registro, pero debe revisarse.
     */
    function validarCiudad(registro) {
        var errores = [];
        var ciudad = registro.ciudad;

        if (typeof ciudad !== 'string') return errores;

        if (CIUDADES_VALIDAS.indexOf(ciudad.trim()) === -1) {
            errores.push(crearError(
                'WARNING',
                registro.id,
                'ciudad',
                'V-06',
                'Ciudad "' + ciudad + '" no está en el listado oficial de StudentScope MJ. ' +
                'Ciudades aceptadas: ' + CIUDADES_VALIDAS.join(', '),
                ciudad
            ));
        }

        return errores;
    }

    /**
     * V-07 | ERROR
     * El curso debe existir en el catálogo oficial de StudentScope MJ.
     */
    function validarCurso(registro) {
        var errores = [];
        var curso = registro.curso;

        if (typeof curso !== 'string') return errores;

        if (CURSOS_VALIDOS.indexOf(curso.trim()) === -1) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'curso',
                'V-07',
                'El curso "' + curso + '" no existe en el catálogo oficial. ' +
                'Cursos válidos: ' + CURSOS_VALIDOS.join(' | '),
                curso
            ));
        }

        return errores;
    }

    /**
     * V-08 | ERROR + WARNING
     * El progreso debe estar entre 0 y 100.
     * Adicionalmente emite WARNING si el valor tiene decimales,
     * ya que el modelo de datos espera enteros.
     */
    function validarProgreso(registro) {
        var errores = [];
        var progreso = registro.progreso;

        if (typeof progreso !== 'number') return errores;

        if (!enRango(progreso, PROGRESO_MIN, PROGRESO_MAX)) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'progreso',
                'V-08',
                'Progreso fuera de rango. Debe estar entre ' +
                PROGRESO_MIN + ' y ' + PROGRESO_MAX + '. Valor recibido: ' + progreso,
                progreso
            ));
        }

        if (enRango(progreso, PROGRESO_MIN, PROGRESO_MAX) && !Number.isInteger(progreso)) {
            errores.push(crearError(
                'WARNING',
                registro.id,
                'progreso',
                'V-08',
                'El progreso tiene decimales (' + progreso + '). ' +
                'El modelo espera un entero entre 0 y 100.',
                progreso
            ));
        }

        return errores;
    }

    /**
     * V-09 | ERROR
     * La fecha de inscripción debe:
     * a) Tener formato ISO estricto (YYYY-MM-DD)
     * b) Representar una fecha real (no 2023-02-30)
     * c) Estar dentro del rango [FECHA_MIN, FECHA_MAX]
     */
    function validarFechaInscripcion(registro) {
        var errores = [];
        var raw = registro.fechaInscripcion;

        if (typeof raw !== 'string') return errores;

        if (!esFechaISOValida(raw)) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'fechaInscripcion',
                'V-09',
                'Fecha inválida o con formato incorrecto. ' +
                'Se esperaba YYYY-MM-DD con una fecha real.',
                raw
            ));
            return errores; // Sin fecha válida, no tiene sentido verificar el rango
        }

        var fecha = new Date(raw);

        if (fecha < FECHA_MIN) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'fechaInscripcion',
                'V-09',
                'Fecha anterior al límite mínimo permitido (' +
                FECHA_MIN.toISOString().slice(0, 10) + ')',
                raw
            ));
        }

        if (fecha > FECHA_MAX) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'fechaInscripcion',
                'V-09',
                'Fecha posterior al límite máximo permitido (' +
                FECHA_MAX.toISOString().slice(0, 10) + ')',
                raw
            ));
        }

        return errores;
    }

    /**
     * V-10 | ERROR
     * El plan debe ser uno de los planes oficiales: Básico, Estándar o Premium.
     */
    function validarPlan(registro) {
        var errores = [];
        var plan = registro.plan;

        if (typeof plan !== 'string') return errores;

        if (PLANES[plan] === undefined) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'plan',
                'V-10',
                'Plan "' + plan + '" no reconocido. ' +
                'Valores válidos: ' + Object.keys(PLANES).join(', '),
                plan
            ));
        }

        return errores;
    }

    /**
     * V-11 | ERROR
     * El montoUSD debe coincidir EXACTAMENTE con el precio del plan declarado.
     * Se usa redondeo a 2 decimales para evitar errores de coma flotante.
     *
     * Regla de negocio:
     * Básico   → $29.99
     * Estándar → $59.99
     * Premium  → $99.99
     */
    function validarCoherenciaMontoConPlan(registro) {
        var errores = [];
        var precioEsperado = PLANES[registro.plan];

        if (precioEsperado === undefined) return errores; // V-10 ya captura el plan inválido
        if (typeof registro.montoUSD !== 'number') return errores; // V-02 ya lo captura

        var montoRecibido = redondear(registro.montoUSD, 2);

        if (montoRecibido !== precioEsperado) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'montoUSD',
                'V-11',
                'Monto incoherente con el plan "' + registro.plan + '". ' +
                'Esperado: $' + precioEsperado + ' USD, ' +
                'encontrado: $' + montoRecibido + ' USD',
                registro.montoUSD
            ));
        }

        return errores;
    }

    /**
     * V-12 | ERROR
     * El campo activo debe ser booleano ESTRICTO: true o false.
     * Rechaza truthy/falsy como 0, 1, "true", "false", null, undefined.
     */
    function validarActivoEstricto(registro) {
        var errores = [];
        var activo = registro.activo;

        if (activo !== true && activo !== false) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'activo',
                'V-12',
                'El campo activo debe ser booleano estricto (true o false). ' +
                'Tipo recibido: ' + typeof activo,
                activo
            ));
        }

        return errores;
    }

    /**
     * V-13 | INFO + WARNING
     * Detecta inconsistencias semánticas entre progreso y estado activo:
     *
     * INFO:    progreso = 100 y activo = true
     * → Estudiante completó el curso pero sigue activo. ¿Se renovó?
     *
     * WARNING: progreso < 50 y activo = false
     * → Abandonó con bajo avance. Candidato para campaña de reactivación.
     */
    function validarCoherenciaProgresoActivo(registro) {
        var errores = [];
        var progreso = registro.progreso;
        var activo = registro.activo;

        if (typeof progreso !== 'number' || typeof activo !== 'boolean') return errores;

        if (progreso === 100 && activo === true) {
            errores.push(crearError(
                'INFO',
                registro.id,
                'activo',
                'V-13',
                'Estudiante con progreso 100% marcado como activo. ' +
                'Verificar si completó el ciclo o se renovó en otro curso.',
                'progreso=' + progreso + ' | activo=' + activo
            ));
        }

        if (progreso < 50 && activo === false) {
            errores.push(crearError(
                'WARNING',
                registro.id,
                'activo',
                'V-13',
                'Estudiante inactivo con progreso bajo (' + progreso + '%). ' +
                'Posible abandono temprano. Candidato para campaña de reactivación.',
                'progreso=' + progreso + ' | activo=' + activo
            ));
        }

        return errores;
    }

    /**
     * V-19 | ERROR
     * El montoUSD no puede ser negativo ni cero.
     * Se ejecuta antes de V-11 para capturar el caso de monto = 0
     * que podría pasar desapercibido si el plan también fuera inválido.
     */
    function validarMontoPositivo(registro) {
        var errores = [];
        var monto = registro.montoUSD;

        if (typeof monto !== 'number') return errores;

        if (monto <= 0) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'montoUSD',
                'V-19',
                'El montoUSD debe ser un valor positivo mayor a 0. ' +
                'Valor recibido: ' + monto,
                monto
            ));
        }

        return errores;
    }

    /**
     * V-20 | ERROR
     * El campo activo no puede ser undefined (diferente a false).
     * Este validador se ejecuta antes de V-12 para dar un mensaje
     * más claro cuando el campo simplemente no viene en el objeto.
     */
    function validarActivoDefinido(registro) {
        var errores = [];

        if (registro.activo === undefined) {
            errores.push(crearError(
                'ERROR',
                registro.id,
                'activo',
                'V-20',
                'El campo activo está ausente (undefined). ' +
                'Debe declararse explícitamente como true o false.',
                'undefined'
            ));
        }

        return errores;
    }


    /* ============================================================
       4. VALIDADORES DE DATASET COMPLETO
       Se ejecutan sobre el array entero, no sobre registros individuales.
       Detectan problemas que solo son visibles al ver todos los datos juntos.
       ============================================================ */

    /**
     * V-14 | ERROR
     * Detecta IDs duplicados en todo el dataset.
     * Marca TODOS los registros con el ID duplicado, no solo el segundo.
     */
    function validarUnicidadIds(registros) {
        var errores = [];
        var vistoPorId = {};
        var duplicados = {};

        registros.forEach(function (r) {
            if (typeof r.id !== 'number') return;

            if (vistoPorId[r.id] !== undefined) {
                // Ya lo habíamos visto: registrar el duplicado
                if (!duplicados[r.id]) {
                    duplicados[r.id] = [vistoPorId[r.id]]; // incluir el primero
                }
                duplicados[r.id].push(r.id); // y el nuevo
            } else {
                vistoPorId[r.id] = r.id;
            }
        });

        Object.keys(duplicados).forEach(function (idDuplicado) {
            var id = Number(idDuplicado);
            // Contar cuántas veces aparece
            var cantidad = registros.filter(function (r) { return r.id === id; }).length;
            errores.push(crearError(
                'ERROR',
                id,
                'id',
                'V-14',
                'ID ' + id + ' aparece ' + cantidad + ' veces en el dataset. ' +
                'Todos los IDs deben ser únicos.',
                id
            ));
        });

        return errores;
    }

    /**
     * V-15 | ERROR
     * Detecta emails duplicados en todo el dataset.
     * Normaliza a minúsculas antes de comparar para detectar duplicados
     * con diferente capitalización (Juan@gmail.com vs juan@gmail.com).
     */
    function validarUnicidadEmails(registros) {
        var errores = [];
        var vistoPorEmail = {};  // email_normalizado → id del primer registro
        var duplicados = {};  // email_normalizado → [id1, id2, ...]

        registros.forEach(function (r) {
            if (typeof r.email !== 'string') return;
            var emailNorm = r.email.trim().toLowerCase();

            if (vistoPorEmail[emailNorm] !== undefined) {
                if (!duplicados[emailNorm]) {
                    duplicados[emailNorm] = [vistoPorEmail[emailNorm]];
                }
                duplicados[emailNorm].push(r.id);
            } else {
                vistoPorEmail[emailNorm] = r.id;
            }
        });

        Object.keys(duplicados).forEach(function (email) {
            var idsAfectados = duplicados[email];
            idsAfectados.forEach(function (id) {
                errores.push(crearError(
                    'ERROR',
                    id,
                    'email',
                    'V-15',
                    'Email "' + email + '" está duplicado. ' +
                    'Compartido por los IDs: ' + idsAfectados.join(', '),
                    email
                ));
            });
        });

        return errores;
    }

    /**
     * V-16 | INFO
     * Verifica que los IDs formen una secuencia consecutiva sin saltos.
     * Emite INFO (no bloquea datos), pero indica registros eliminados o
     * problemas de importación.
     */
    function validarConsecutividadIds(registros) {
        var errores = [];

        var ids = registros
            .map(function (r) { return r.id; })
            .filter(function (id) { return typeof id === 'number' && Number.isInteger(id); })
            .sort(function (a, b) { return a - b; });

        for (var i = 1; i < ids.length; i++) {
            var esperado = ids[i - 1] + 1;
            var actual = ids[i];
            if (actual !== esperado) {
                errores.push(crearError(
                    'INFO',
                    ids[i - 1],
                    'id',
                    'V-16',
                    'Salto en la secuencia: después del ID ' + ids[i - 1] +
                    ' se esperaba ' + esperado + ' pero se encontró ' + actual + '. ' +
                    'Puede indicar registros eliminados o problemas de importación.',
                    'esperado=' + esperado + ' | encontrado=' + actual
                ));
            }
        }

        return errores;
    }

    /**
     * V-17 | WARNING
     * El dataset debe contener al menos MIN_INACTIVOS estudiantes con activo=false.
     * Regla de negocio: sirve para garantizar que los datos de churn están presentes.
     */
    function validarMinimoEstudiantesInactivos(registros) {
        var errores = [];
        var inactivos = registros.filter(function (r) { return r.activo === false; });

        if (inactivos.length < MIN_INACTIVOS) {
            errores.push(crearError(
                'WARNING',
                null,
                'activo',
                'V-17',
                'Solo hay ' + inactivos.length + ' estudiante(s) inactivo(s) en el dataset. ' +
                'La regla de negocio exige mínimo ' + MIN_INACTIVOS + '. ' +
                'Los análisis de churn pueden no ser representativos.',
                inactivos.length + ' inactivos'
            ));
        }

        return errores;
    }

    /**
     * V-18 | WARNING
     * Ningún curso individual debe concentrar más del MAX_CONCENTRACION_CURSO%
     * del total de registros. Alta concentración indica un dataset poco diverso
     * que puede sesgar métricas y recomendaciones en la interfaz.
     */
    function validarDistribucionCursos(registros) {
        var errores = [];
        var total = registros.length;
        var conteo = {};

        registros.forEach(function (r) {
            if (typeof r.curso === 'string') {
                conteo[r.curso] = (conteo[r.curso] || 0) + 1;
            }
        });

        Object.keys(conteo).forEach(function (curso) {
            var porcentaje = (conteo[curso] / total) * 100;
            if (porcentaje > MAX_CONCENTRACION_CURSO) {
                errores.push(crearError(
                    'WARNING',
                    null,
                    'curso',
                    'V-18',
                    'El curso "' + curso + '" concentra el ' +
                    porcentaje.toFixed(1) + '% del dataset (' +
                    conteo[curso] + ' de ' + total + ' registros). ' +
                    'Se recomienda una distribución más equilibrada (máximo ' +
                    MAX_CONCENTRACION_CURSO + '% por curso).',
                    conteo[curso] + ' registros (' + porcentaje.toFixed(1) + '%)'
                ));
            }
        });

        return errores;
    }


    /* ============================================================
       5. FUNCIÓN PRINCIPAL: dataset()
       ============================================================ */

    /**
     * Valida el dataset completo de estudiantes StudentScope MJ antes
     * de que los datos lleguen a cualquier componente de la interfaz.
     *
     * Ejecuta en dos pasadas:
     * Pasada 1 — Por registro   : 15 validadores individuales
     * Pasada 2 — Dataset entero :  5 validadores de unicidad y distribución
     *
     * @param   {Array} estudiantes   Array de objetos estudiante
     * @returns {ResultadoValidacion} Objeto con el informe completo (ver JSDoc)
     *
     * ─── Estructura de ResultadoValidacion ──────────────────────
     * {
     * valido            {boolean} true solo si hay 0 errores de nivel ERROR
     * totalRegistros    {number}  cantidad de registros recibidos
     * errores           {Array}   todos los problemas detectados
     * resumen           {object}  { errores, advertencias, info }  (conteos)
     * registrosValidos  {Array}   registros sin ningún ERROR (seguros para UI)
     * registrosInvalidos{Array}   registros con al menos un ERROR (bloqueados)
     * porRegla          {object}  conteo de violaciones agrupadas por código
     * reporte           {string}  resumen visual para console.log
     * }
     */
    function dataset(estudiantes) {

        /* ── Guardia 1: el argumento debe ser un array ────────────── */
        if (!Array.isArray(estudiantes)) {
            var errorTipo = crearError(
                'ERROR', null, 'dataset', 'V-00',
                'dataset() esperaba un Array. Tipo recibido: ' + typeof estudiantes,
                typeof estudiantes
            );
            return {
                valido: false,
                totalRegistros: 0,
                errores: [errorTipo],
                resumen: { errores: 1, advertencias: 0, info: 0 },
                registrosValidos: [],
                registrosInvalidos: [],
                porRegla: { 'V-00': 1 },
                reporte: '[StudentScope MJ] ✗ Error: dataset() recibió ' +
                    typeof estudiantes + ' en lugar de Array.'
            };
        }

        /* ── Guardia 2: el array no debe estar vacío ──────────────── */
        if (estudiantes.length === 0) {
            var errorVacio = crearError(
                'ERROR', null, 'dataset', 'V-00',
                'El array de estudiantes está vacío.',
                0
            );
            return {
                valido: false,
                totalRegistros: 0,
                errores: [errorVacio],
                resumen: { errores: 1, advertencias: 0, info: 0 },
                registrosValidos: [],
                registrosInvalidos: [],
                porRegla: { 'V-00': 1 },
                reporte: '[StudentScope MJ] ✗ Error: El dataset está vacío.'
            };
        }


        /* ── Acumuladores de resultados ───────────────────────────── */
        var todosLosErrores = [];
        var idsConError = {};   // { id: true } → registro tiene al menos un ERROR


        /* ══════════════════════════════════════════════════════════
           PASADA 1: validar cada registro individualmente
           Orden de ejecución diseñado para dar mensajes claros:
           estructura → tipos → reglas de negocio → coherencia
           ══════════════════════════════════════════════════════════ */
        var validadoresPorRegistro = [
            validarCamposRequeridos,       // V-01 — campos presentes
            validarTipos,                  // V-02 — tipos de dato
            validarId,                     // V-03 — ID entero positivo
            validarEmail,                  // V-04 — formato email
            validarNombres,                // V-05 — nombre y apellido no vacíos
            validarCiudad,                 // V-06 — ciudad en listado oficial
            validarCurso,                  // V-07 — curso en catálogo oficial
            validarProgreso,               // V-08 — progreso 0–100
            validarFechaInscripcion,       // V-09 — fecha ISO válida y en rango
            validarPlan,                   // V-10 — plan reconocido
            validarMontoPositivo,          // V-19 — monto > 0 (antes de V-11)
            validarCoherenciaMontoConPlan, // V-11 — plan ↔ montoUSD coherente
            validarActivoDefinido,         // V-20 — activo no es undefined
            validarActivoEstricto,         // V-12 — activo es boolean estricto
            validarCoherenciaProgresoActivo// V-13 — progreso ↔ activo coherente
        ];

        estudiantes.forEach(function (registro) {
            validadoresPorRegistro.forEach(function (validador) {
                var resultado = validador(registro);
                resultado.forEach(function (err) {
                    todosLosErrores.push(err);
                    if (err.nivel === 'ERROR' && err.id !== null && err.id !== undefined) {
                        idsConError[err.id] = true;
                    }
                });
            });
        });


        /* ══════════════════════════════════════════════════════════
           PASADA 2: validar reglas que abarcan el dataset completo
           ══════════════════════════════════════════════════════════ */
        var validadoresDataset = [
            validarUnicidadIds,                  // V-14 — IDs únicos
            validarUnicidadEmails,               // V-15 — emails únicos
            validarConsecutividadIds,            // V-16 — secuencia sin saltos
            validarMinimoEstudiantesInactivos,   // V-17 — mínimo 5 inactivos
            validarDistribucionCursos            // V-18 — diversidad de cursos
        ];

        validadoresDataset.forEach(function (validador) {
            var resultado = validador(estudiantes);
            resultado.forEach(function (err) {
                todosLosErrores.push(err);
                if (err.nivel === 'ERROR' && err.id !== null && err.id !== undefined) {
                    idsConError[err.id] = true;
                }
            });
        });


        /* ── Calcular resumen por nivel ───────────────────────────── */
        var conteoNiveles = { ERROR: 0, WARNING: 0, INFO: 0 };
        var porRegla = {};

        todosLosErrores.forEach(function (err) {
            conteoNiveles[err.nivel] = (conteoNiveles[err.nivel] || 0) + 1;
            porRegla[err.regla] = (porRegla[err.regla] || 0) + 1;
        });


        /* ── Separar registros válidos e inválidos ────────────────── */
        var registrosValidos = estudiantes.filter(function (r) { return !idsConError[r.id]; });
        var registrosInvalidos = estudiantes.filter(function (r) { return idsConError[r.id]; });
        var esValido = conteoNiveles['ERROR'] === 0;
        var idsInvalidosLista = Object.keys(idsConError).sort(function (a, b) {
            return Number(a) - Number(b);
        });


        /* ── Construir reporte visual para console.log ────────────── */
        var sep = '═══════════════════════════════════════════════════════════';
        var sep2 = '───────────────────────────────────────────────────────────';
        var lineas = [
            sep,
            '  StudentScope MJ — Reporte de Meta-Validación (dataset)',
            sep,
            '',
            '  Estado general  : ' + (esValido ? '✓  VÁLIDO — todos los registros aptos' : '✗  CON ERRORES — ver detalle abajo'),
            '  Registros total : ' + estudiantes.length,
            '  Registros OK    : ' + registrosValidos.length + '  (aptos para la interfaz)',
            '  Registros KO    : ' + registrosInvalidos.length + '  (bloqueados por errores)',
            '',
            sep2,
            '  Problemas detectados',
            sep2,
            '  ERROR   : ' + conteoNiveles['ERROR'] + '  ← bloquean el registro, no se renderizan',
            '  WARNING : ' + conteoNiveles['WARNING'] + '  ← revisar, pero no bloquean',
            '  INFO    : ' + conteoNiveles['INFO'] + '  ← observaciones de negocio',
            ''
        ];

        if (Object.keys(porRegla).length > 0) {
            lineas.push(sep2);
            lineas.push('  Violaciones por regla');
            lineas.push(sep2);
            Object.keys(porRegla).sort().forEach(function (regla) {
                var descripcionRegla = {
                    'V-00': 'Argumento inválido o dataset vacío',
                    'V-01': 'Campos requeridos ausentes',
                    'V-02': 'Tipo de dato incorrecto',
                    'V-03': 'ID inválido (no entero positivo)',
                    'V-04': 'Formato de email inválido',
                    'V-05': 'Nombre o apellido vacío',
                    'V-06': 'Ciudad no reconocida',
                    'V-07': 'Curso fuera del catálogo',
                    'V-08': 'Progreso fuera de rango 0–100',
                    'V-09': 'Fecha inválida o fuera de rango',
                    'V-10': 'Plan no reconocido',
                    'V-11': 'Monto incoherente con el plan',
                    'V-12': 'Campo activo no es boolean estricto',
                    'V-13': 'Incoherencia progreso ↔ activo',
                    'V-14': 'ID duplicado en el dataset',
                    'V-15': 'Email duplicado en el dataset',
                    'V-16': 'Salto en la secuencia de IDs',
                    'V-17': 'Insuficientes estudiantes inactivos',
                    'V-18': 'Alta concentración en un curso',
                    'V-19': 'MontoUSD negativo o cero',
                    'V-20': 'Campo activo es undefined'
                };
                var desc = descripcionRegla[regla] || '(sin descripción)';
                var ocurrencias = porRegla[regla];
                lineas.push('  ' + regla + '  ' + ocurrencias + 'x  — ' + desc);
            });
            lineas.push('');
        }

        if (idsInvalidosLista.length > 0) {
            lineas.push(sep2);
            lineas.push('  IDs bloqueados por ERROR');
            lineas.push(sep2);
            lineas.push('  [' + idsInvalidosLista.join(', ') + ']');
            lineas.push('');
        }

        lineas.push(sep2);
        lineas.push('  Comandos útiles en consola');
        lineas.push(sep2);
        lineas.push('  console.table(resultado.errores)           → ver todos los problemas');
        lineas.push('  console.table(resultado.registrosInvalidos)→ ver registros bloqueados');
        lineas.push('  resultado.registrosValidos                 → usar en la interfaz');
        lineas.push('  resultado.errores.filter(e=>e.nivel==="WARNING") → solo advertencias');
        lineas.push(sep);


        /* ── Retornar el resultado estructurado ───────────────────── */
        return {
            valido: esValido,
            totalRegistros: estudiantes.length,
            errores: todosLosErrores,
            resumen: {
                errores: conteoNiveles['ERROR'],
                advertencias: conteoNiveles['WARNING'],
                info: conteoNiveles['INFO']
            },
            registrosValidos: registrosValidos,
            registrosInvalidos: registrosInvalidos,
            porRegla: porRegla,
            reporte: lineas.join('\n')
        };
    }


    /* ============================================================
       6. EXPORTACIÓN
       Compatible con Node.js (require/CommonJS) y con el browser
       (window global). En ambos entornos expone la misma API.
       ============================================================ */
    (function exportar() {
        var api = {
            /** Función principal de validación */
            dataset: dataset,

            /** Constantes de negocio exportadas para consulta externa */
            PLANES: PLANES,
            CURSOS_VALIDOS: CURSOS_VALIDOS,
            CIUDADES_VALIDAS: CIUDADES_VALIDAS,
            CAMPOS_REQUERIDOS: CAMPOS_REQUERIDOS
        };

        if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
            // Node.js / CommonJS
            module.exports = api;
        } else if (typeof window !== 'undefined') {
            // Browser — se integra al namespace global de EduTrack
            window.EduTrack = window.EduTrack || {};
            window.EduTrack.validar = api;
        }
    }());


    /* ============================================================
       7. AUTO-EJECUCIÓN CUANDO SE CORRE CON NODE DIRECTAMENTE
       Se activa solo con:  node js/validacion.js
       Cuando el archivo es requerido por otro módulo, este bloque
       NO se ejecuta (require.main !== module).
       ============================================================ */
    if (typeof require !== 'undefined' && require.main === module) {

        /* ── Dataset de prueba con errores intencionales ─────────── */
        var datosTest = [

            /* ── REGISTROS VÁLIDOS (IDs 1–5) ── */
            {
                id: 1, nombre: 'Juan', apellido: 'Pérez',
                email: 'pjuan5058@gmail.com', ciudad: 'Bogotá',
                curso: 'Desarrollo Web', progreso: 75,
                fechaInscripcion: '2023-01-15', plan: 'Premium',
                montoUSD: 99.99, activo: true
            },
            {
                id: 2, nombre: 'María', apellido: 'Gómez',
                email: 'mariagomez@gmail.com', ciudad: 'Medellín',
                curso: 'Diseño UX/UI', progreso: 60,
                fechaInscripcion: '2023-02-20', plan: 'Básico',
                montoUSD: 29.99, activo: true
            },
            {
                id: 3, nombre: 'Carlos', apellido: 'López',
                email: 'carloslopez@gmail.com', ciudad: 'Cali',
                curso: 'Marketing Digital', progreso: 85,
                fechaInscripcion: '2023-03-10', plan: 'Premium',
                montoUSD: 99.99, activo: true
            },
            {
                id: 4, nombre: 'Ana', apellido: 'Martínez',
                email: 'anamartinez@gmail.com', ciudad: 'Bogotá',
                curso: 'Desarrollo Web', progreso: 90,
                fechaInscripcion: '2023-04-05', plan: 'Básico',
                montoUSD: 29.99, activo: false
            },
            {
                id: 5, nombre: 'Luis', apellido: 'García',
                email: 'luisgarcia@gmail.com', ciudad: 'Medellín',
                curso: 'Diseño UX/UI', progreso: 70,
                fechaInscripcion: '2023-05-10', plan: 'Premium',
                montoUSD: 99.99, activo: false
            },

            /* ── REGISTROS CON ERRORES INTENCIONALES (IDs 6–12) ── */

            // CORREGIDO V-11: montoUSD ahora coincide con plan Premium
            {
                id: 6, nombre: 'Andrés', apellido: 'Rivas',
                email: 'andresrivas@gmail.com', ciudad: 'Bogotá',
                curso: 'Full Stack Web', progreso: 40,
                fechaInscripcion: '2023-06-01', plan: 'Premium',
                montoUSD: 99.99, activo: true
            },

            // CORREGIDO V-07: curso cambiado a uno del catálogo oficial
            {
                id: 7, nombre: 'Sofía', apellido: 'Torres',
                email: 'sofiatorres@gmail.com', ciudad: 'Cali',
                curso: 'Python y Data Science', progreso: 30,
                fechaInscripcion: '2023-07-15', plan: 'Estándar',
                montoUSD: 59.99, activo: true
            },

            // CORREGIDO V-04: email con formato válido
            {
                id: 8, nombre: 'Felipe', apellido: 'Mora',
                email: 'felipemora@gmail.com', ciudad: 'Medellín',
                curso: 'React Native', progreso: 55,
                fechaInscripcion: '2023-08-20', plan: 'Básico',
                montoUSD: 29.99, activo: true
            },

            // CORREGIDO V-09: fecha dentro del rango 2023-01-01 / 2025-05-01
            {
                id: 9, nombre: 'Daniela', apellido: 'Vega',
                email: 'danielavega@gmail.com', ciudad: 'Barranquilla',
                curso: 'DevOps y Cloud', progreso: 65,
                fechaInscripcion: '2023-11-10', plan: 'Estándar',
                montoUSD: 59.99, activo: false
            },

            // CORREGIDO V-08: progreso ajustado al rango válido 0–100
            {
                id: 10, nombre: 'Miguel', apellido: 'Castro',
                email: 'miguelcastro@gmail.com', ciudad: 'Bogotá',
                curso: 'SQL y Bases de Datos', progreso: 100,
                fechaInscripcion: '2024-01-08', plan: 'Premium',
                montoUSD: 99.99, activo: false
            },

            // CORREGIDO V-12: activo cambiado a booleano estricto false
            {
                id: 11, nombre: 'Camila', apellido: 'Ruiz',
                email: 'camilaruiz@gmail.com', ciudad: 'Medellín',
                curso: 'Python y Data Science', progreso: 20,
                fechaInscripcion: '2024-02-14', plan: 'Básico',
                montoUSD: 29.99, activo: false
            },

            // CORREGIDO V-10 + V-11: plan y monto corregidos a Estándar / $59.99
            {
                id: 12, nombre: 'Diego', apellido: 'Mendoza',
                email: 'diegomendoza@gmail.com', ciudad: 'Cali',
                curso: 'Diseño UX/UI', progreso: 45,
                fechaInscripcion: '2024-03-20', plan: 'Estándar',
                montoUSD: 59.99, activo: true
            },

            // CORREGIDO V-13: progreso 100% → activo cambiado a false
            {
                id: 13, nombre: 'Isabella', apellido: 'Suárez',
                email: 'isabellasuarez@gmail.com', ciudad: 'Bogotá',
                curso: 'DevOps y Cloud', progreso: 100,
                fechaInscripcion: '2024-04-10', plan: 'Premium',
                montoUSD: 99.99, activo: false
            },

            // CORREGIDO V-06: ciudad cambiada a una del listado oficial
            {
                id: 14, nombre: 'Nicolás', apellido: 'Reyes',
                email: 'nicolasreyes@gmail.com', ciudad: 'Cartagena',
                curso: 'Full Stack Web', progreso: 35,
                fechaInscripcion: '2024-05-05', plan: 'Estándar',
                montoUSD: 59.99, activo: false
            },

            // WARNING V-13: inactivo con progreso bajo (abandono temprano)
            {
                id: 15, nombre: 'Valentina', apellido: 'Molina',
                email: 'valentinamolina@gmail.com', ciudad: 'Medellín',
                curso: 'Marketing Digital', progreso: 10,
                fechaInscripcion: '2024-06-15', plan: 'Básico',
                montoUSD: 29.99, activo: false
            }
        ];

        /* ── Ejecutar la validación ───────────────────────────────── */
        var resultado = dataset(datosTest);

        /* ── Imprimir el reporte principal ───────────────────────── */
        console.log('\n' + resultado.reporte);

        /* ── Tabla detallada de todos los problemas ──────────────── */
        if (resultado.errores.length > 0) {
            console.log('\n  ── Detalle de todos los problemas ──\n');
            console.table(resultado.errores);
        }

        /* ── Mostrar qué registros quedaron bloqueados ───────────── */
        if (resultado.registrosInvalidos.length > 0) {
            console.log('\n  ── Registros BLOQUEADOS (no aptos para la interfaz) ──\n');
            resultado.registrosInvalidos.forEach(function (r) {
                console.log(
                    '  ID ' + String(r.id).padStart(3, ' ') +
                    ' | ' + (r.nombre + ' ' + r.apellido).padEnd(22, ' ') +
                    ' | ' + r.curso
                );
            });
        }

        /* ── Mostrar cuántos registros son seguros ───────────────── */
        console.log(
            '\n  ── Registros VÁLIDOS listos para la interfaz: ' +
            resultado.registrosValidos.length + ' de ' +
            resultado.totalRegistros + ' ──\n'
        );

        /* ── Código de salida: 0 = éxito, 1 = hay errores ────────── */
        process.exit(resultado.valido ? 0 : 1);
    }

})();