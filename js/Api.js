(function () {
    'use strict';

    const RUTAS_SIN_AVISO_DE_SESION = ['/api/auth/login', '/api/auth/registro', '/api/auth/logout'];

    function avisaSesionExpirada(metodo, ruta) {
        if (RUTAS_SIN_AVISO_DE_SESION.includes(ruta)) return false;
        return !(metodo === 'GET' && ruta === '/api/auth/yo');
    }

    class ErrorApi extends Error {
        constructor(estado, codigo, mensaje, campos) {
            super(mensaje);
            this.estado = estado;
            this.codigo = codigo || null;
            this.campos = campos || null;
        }
    }

    function mensajePorEstado(estado) {
        if (estado >= 500) return 'El servicio no está disponible. Inténtalo de nuevo más tarde';
        return 'Ocurrió un error inesperado';
    }

    async function pedir(metodo, ruta, cuerpo) {
        const opciones = { method: metodo, credentials: 'same-origin', headers: {} };
        if (cuerpo !== undefined) {
            opciones.headers['Content-Type'] = 'application/json';
            opciones.body = JSON.stringify(cuerpo);
        }

        let respuesta;
        try {
            respuesta = await fetch(ruta, opciones);
        } catch {
            throw new ErrorApi(0, 'SIN_CONEXION', 'No se pudo conectar con el servidor');
        }

        let datos = null;
        if (respuesta.status !== 204) {
            try {
                datos = await respuesta.json();
            } catch {
                datos = null;
            }
        }

        if (!respuesta.ok) {
            const mensaje = (datos && datos.error) || mensajePorEstado(respuesta.status);
            if (respuesta.status === 401 && avisaSesionExpirada(metodo, ruta)) {
                document.dispatchEvent(new CustomEvent('studentscope:sesion-expirada'));
            }
            throw new ErrorApi(respuesta.status, datos && datos.codigo, mensaje, datos && datos.campos);
        }
        return datos;
    }

    window.EduTrack = window.EduTrack || {};
    window.EduTrack.api = {
        ErrorApi: ErrorApi,
        get: function (ruta) { return pedir('GET', ruta); },
        post: function (ruta, cuerpo) { return pedir('POST', ruta, cuerpo); },
        patch: function (ruta, cuerpo) { return pedir('PATCH', ruta, cuerpo); },
        delete: function (ruta) { return pedir('DELETE', ruta); }
    };
})();
