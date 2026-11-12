(function () {
    'use strict';

    const ENTIDADES = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    function escaparHTML(valor) {
        const texto = valor === null || valor === undefined ? '' : String(valor);
        return texto.replace(/[&<>"']/g, function (caracter) {
            return ENTIDADES[caracter];
        });
    }

    function aNumero(valor) {
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero : 0;
    }

    const api = { escaparHTML: escaparHTML, aNumero: aNumero };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        window.EduTrack = window.EduTrack || {};
        window.EduTrack.escaparHTML = escaparHTML;
        window.EduTrack.aNumero = aNumero;
    }
})();
