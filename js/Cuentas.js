(function () {
    'use strict';

    const esc = window.EduTrack.escaparHTML;
    const num = window.EduTrack.aNumero;
    const api = () => window.EduTrack.api;

    const CAMPOS_FORMULARIO = {
        nombre: 'cNombre',
        email: 'cEmail',
        rol: 'cRol',
        password: 'cPassword'
    };

    let cuentas = [];
    let filtro = '';
    let estado = 'inicial';
    let mensajeError = '';
    let editando = null;
    let guardando = false;

    const seccion = () => document.getElementById('secCuentas');
    const yo = () => window.EduTrack.usuarioActual();
    const aviso = (mensaje, tipo) => window.EduTrack.toast(mensaje, tipo);

    function formatearFecha(valor) {
        const fecha = new Date(valor);
        if (Number.isNaN(fecha.getTime())) return '—';
        const dos = (n) => String(n).padStart(2, '0');
        return dos(fecha.getDate()) + '/' + dos(fecha.getMonth() + 1) + '/' + fecha.getFullYear();
    }

    function filtradas() {
        const texto = filtro.trim().toLowerCase();
        if (!texto) return cuentas;
        return cuentas.filter(function (c) {
            return c.nombre.toLowerCase().includes(texto) || c.email.toLowerCase().includes(texto);
        });
    }

    function filaHTML(cuenta) {
        const esYo = yo() && cuenta.id === yo().id;
        const esAdmin = cuenta.rol === 'administrador';
        const id = num(cuenta.id);
        const nombre = esc(cuenta.nombre);

        const botonRol = esYo
            ? ''
            : '<button class="btn btn-secondary btn--sm" data-action="cuenta-rol" data-id="' + id + '">' +
              (esAdmin ? 'Quitar administrador' : 'Hacer administrador') + '</button>';
        const botonEliminar = esYo
            ? '<button class="btn btn-danger btn--sm" disabled title="No puedes eliminar tu propia cuenta">Eliminar</button>'
            : '<button class="btn btn-danger btn--sm" data-action="cuenta-eliminar" data-id="' + id + '" aria-label="Eliminar la cuenta de ' + nombre + '">Eliminar</button>';

        return '<tr class="db-table__row">' +
            '<td class="db-table__td"><strong>' + nombre + '</strong>' + (esYo ? ' <span class="cuenta-yo">Tú</span>' : '') + '</td>' +
            '<td class="db-table__td">' + esc(cuenta.email) + '</td>' +
            '<td class="db-table__td"><span class="rol-badge' + (esAdmin ? ' rol-badge--admin' : '') + '">' +
            (esAdmin ? 'Administrador' : 'Usuario') + '</span></td>' +
            '<td class="db-table__td">' + esc(formatearFecha(cuenta.creadoEn)) + '</td>' +
            '<td class="db-table__td"><div class="cuenta-acciones">' +
            '<button class="btn btn-secondary btn--sm" data-action="cuenta-editar" data-id="' + id + '" aria-label="Editar la cuenta de ' + nombre + '">Editar</button>' +
            botonRol + botonEliminar +
            '</div></td></tr>';
    }

    function tablaHTML() {
        if (estado === 'cargando') return '<p class="cuentas-estado">Cargando cuentas…</p>';
        if (estado === 'error') {
            return '<div class="cuentas-estado"><p>' + esc(mensajeError) + '</p>' +
                '<button class="btn btn-secondary btn--sm" data-action="cuentas-recargar">Reintentar</button></div>';
        }
        const lista = filtradas();
        if (lista.length === 0) return '<p class="cuentas-estado">No hay cuentas que coincidan con la búsqueda.</p>';

        return '<table class="db-table cuentas-tabla"><thead class="db-table__head"><tr>' +
            '<th class="db-table__th" scope="col">Nombre</th>' +
            '<th class="db-table__th" scope="col">Correo</th>' +
            '<th class="db-table__th" scope="col">Rol</th>' +
            '<th class="db-table__th" scope="col">Alta</th>' +
            '<th class="db-table__th" scope="col">Acciones</th>' +
            '</tr></thead><tbody>' + lista.map(filaHTML).join('') + '</tbody></table>';
    }

    function resumen() {
        const administradores = cuentas.filter(function (c) { return c.rol === 'administrador'; }).length;
        return cuentas.length + ' cuentas · ' + administradores + ' administrador' + (administradores === 1 ? '' : 'es');
    }

    function pintarTabla() {
        const contenedor = document.getElementById('cuentasTabla');
        if (contenedor) contenedor.innerHTML = tablaHTML();
        const meta = document.getElementById('cuentasMeta');
        if (meta) meta.textContent = estado === 'listo' ? resumen() : 'Administración de cuentas';
    }

    function pintarSeccion() {
        const sec = seccion();
        if (!sec) return;
        sec.innerHTML =
            '<header class="page-header"><div>' +
            '<h2 class="page-header__title">Gestión de <span>Cuentas</span></h2>' +
            '<p class="page-header__meta" id="cuentasMeta"></p></div></header>' +
            '<div class="toolbar" role="search" aria-label="Buscar cuentas">' +
            '<div class="toolbar__search-wrap">' +
            '<span class="toolbar__search-icon" aria-hidden="true" data-icono="buscar"></span>' +
            '<input type="text" id="cuentasBuscar" placeholder="Buscar por nombre o correo…" autocomplete="off" aria-label="Buscar cuenta" value="' + esc(filtro) + '" />' +
            '</div></div>' +
            '<div class="db-table-wrapper" id="cuentasTabla" aria-live="polite"></div>';
        window.EduTrack.pintarIconos(sec);
        pintarTabla();
    }

    async function cargar() {
        estado = 'cargando';
        pintarTabla();
        try {
            const respuesta = await api().get('/api/usuarios');
            cuentas = respuesta.usuarios;
            estado = 'listo';
        } catch (error) {
            estado = 'error';
            mensajeError = error.message;
        }
        pintarTabla();
    }

    function mostrar() {
        pintarSeccion();
        return cargar();
    }

    function reiniciar() {
        cuentas = [];
        filtro = '';
        estado = 'inicial';
        cerrarModal();
    }

    function buscar(id) {
        return cuentas.find(function (c) { return c.id === id; });
    }

    function reemplazar(actualizada) {
        cuentas = cuentas.map(function (c) { return c.id === actualizada.id ? actualizada : c; });
        if (yo() && actualizada.id === yo().id) window.EduTrack.actualizarUsuarioActual(actualizada);
        pintarTabla();
    }

    /* ── Edición ── */
    function limpiarErroresFormulario() {
        Object.keys(CAMPOS_FORMULARIO).forEach(function (campo) {
            window.EduTrack.marcarError(CAMPOS_FORMULARIO[campo], '');
        });
        const general = document.getElementById('cuentaError');
        if (general) { general.textContent = ''; general.classList.remove('visible'); }
    }

    function abrirModal(id) {
        const cuenta = buscar(id);
        if (!cuenta) return;
        editando = cuenta;
        limpiarErroresFormulario();

        document.getElementById('cuentaTitulo').textContent = 'Editar cuenta';
        document.getElementById('cNombre').value = cuenta.nombre;
        document.getElementById('cEmail').value = cuenta.email;
        document.getElementById('cRol').value = cuenta.rol;
        document.getElementById('cPassword').value = '';
        document.getElementById('cRol').disabled = !!(yo() && cuenta.id === yo().id);

        document.getElementById('cuentaOverlay').classList.add('is-open');
        document.getElementById('cNombre').focus();
    }

    function cerrarModal() {
        const overlay = document.getElementById('cuentaOverlay');
        if (overlay) overlay.classList.remove('is-open');
        editando = null;
    }

    function cambiosDelFormulario() {
        const cambios = {};
        const nombre = document.getElementById('cNombre').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        const rol = document.getElementById('cRol').value;
        const password = document.getElementById('cPassword').value;

        if (nombre !== editando.nombre) cambios.nombre = nombre;
        if (email.toLowerCase() !== editando.email.toLowerCase()) cambios.email = email;
        if (rol !== editando.rol) cambios.rol = rol;
        if (password) cambios.password = password;
        return cambios;
    }

    function mostrarErrorGeneral(mensaje) {
        const general = document.getElementById('cuentaError');
        general.textContent = mensaje;
        general.classList.add('visible');
    }

    async function guardar() {
        if (!editando || guardando) return;
        limpiarErroresFormulario();

        const nombre = document.getElementById('cNombre').value.trim();
        const email = document.getElementById('cEmail').value.trim();
        if (!nombre) window.EduTrack.marcarError('cNombre', 'El nombre es obligatorio');
        if (!email) window.EduTrack.marcarError('cEmail', 'El correo es obligatorio');
        if (!nombre || !email) return;

        const cambios = cambiosDelFormulario();
        if (Object.keys(cambios).length === 0) {
            cerrarModal();
            aviso('No hay cambios que guardar', 'info');
            return;
        }

        const boton = document.getElementById('btnGuardarCuenta');
        guardando = true;
        boton.disabled = true;
        try {
            const respuesta = await api().patch('/api/usuarios/' + editando.id, cambios);
            reemplazar(respuesta.usuario);
            cerrarModal();
            aviso('Cuenta actualizada', 'success');
        } catch (error) {
            let mostrado = false;
            Object.keys(error.campos || {}).forEach(function (campo) {
                if (CAMPOS_FORMULARIO[campo]) {
                    window.EduTrack.marcarError(CAMPOS_FORMULARIO[campo], error.campos[campo]);
                    mostrado = true;
                }
            });
            if (error.codigo === 'EMAIL_DUPLICADO') {
                window.EduTrack.marcarError('cEmail', error.message);
            } else if (!mostrado) {
                mostrarErrorGeneral(error.message);
            }
        } finally {
            guardando = false;
            boton.disabled = false;
        }
    }

    /* ── Cambio de rol y eliminación ── */
    function confirmarRol(id) {
        const cuenta = buscar(id);
        if (!cuenta) return;
        const aAdministrador = cuenta.rol !== 'administrador';
        const nombre = esc(cuenta.nombre);

        window.EduTrack.confirmar(
            aAdministrador ? '¿Hacer administrador?' : '¿Quitar administrador?',
            aAdministrador
                ? '<strong>' + nombre + '</strong> podrá ver, editar y eliminar todas las cuentas.'
                : '<strong>' + nombre + '</strong> dejará de poder gestionar cuentas y volverá a ser usuario.',
            async function () {
                try {
                    const respuesta = await api().patch('/api/usuarios/' + cuenta.id, {
                        rol: aAdministrador ? 'administrador' : 'usuario'
                    });
                    reemplazar(respuesta.usuario);
                    aviso(aAdministrador ? 'Ahora es administrador' : 'Ahora es usuario', 'success');
                } catch (error) {
                    aviso(error.message, 'error');
                }
            },
            'Sí, confirmar'
        );
    }

    function confirmarEliminar(id) {
        const cuenta = buscar(id);
        if (!cuenta) return;

        window.EduTrack.confirmar(
            '¿Eliminar cuenta?',
            'Vas a eliminar la cuenta de <strong>' + esc(cuenta.nombre) + '</strong> (' + esc(cuenta.email) + '). Esta acción no se puede deshacer.',
            async function () {
                try {
                    await api().delete('/api/usuarios/' + cuenta.id);
                    cuentas = cuentas.filter(function (c) { return c.id !== cuenta.id; });
                    pintarTabla();
                    aviso('Cuenta eliminada', 'info');
                } catch (error) {
                    aviso(error.message, 'error');
                }
            },
            'Sí, eliminar'
        );
    }

    function idDe(elemento) {
        return num(elemento.getAttribute('data-id'));
    }

    function iniciar() {
        window.EduTrack.registrarAcciones({
            'cuenta-editar': function (el) { abrirModal(idDe(el)); },
            'cuenta-rol': function (el) { confirmarRol(idDe(el)); },
            'cuenta-eliminar': function (el) { confirmarEliminar(idDe(el)); },
            'cuenta-cerrar': function () { cerrarModal(); },
            'cuentas-recargar': function () { cargar(); }
        });

        const formulario = document.getElementById('formCuenta');
        if (formulario) {
            formulario.addEventListener('submit', function (e) {
                e.preventDefault();
                guardar();
            });
        }

        const overlay = document.getElementById('cuentaOverlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) cerrarModal();
            });
        }

        document.addEventListener('input', function (e) {
            if (e.target && e.target.id === 'cuentasBuscar') {
                filtro = e.target.value;
                pintarTabla();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') cerrarModal();
        });
    }

    window.EduTrack = window.EduTrack || {};
    window.EduTrack.cuentas = { iniciar: iniciar, mostrar: mostrar, reiniciar: reiniciar };
})();
