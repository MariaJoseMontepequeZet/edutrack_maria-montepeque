/**
 * StudentScope MJ — sidebar.js
 * Controla el sidebar colapsable del dashboard.
 * Correcciones v2:
 * - Añade .is-active al botón hamburger (animación de hamburguesa a X en CSS)
 * - BREAKPOINT_LG alineado con el CSS (768px)
 * - Cierra el sidebar al navegar en mobile
 */

(function () {
    'use strict';

    var sidebar = null;
    var overlay = null;
    var hamburger = null;
    var closeBtn = null;
    var isOpen = false;
    var resizeTimer = null;
    var BREAKPOINT_LG = 768; /* DEBE coincidir con @media en dashboard.css */

    /* ── Focusables dentro del sidebar ── */
    function getFocusables() {
        return Array.from(
            sidebar.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );
    }

    /* ── Focus trap ── */
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        var focusables = getFocusables();
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    /* ── Abrir sidebar ── */
    function openSidebar() {
        if (isOpen) return;
        isOpen = true;

        sidebar.classList.add('is-open');

        /* BUG FIX: añadir is-active al botón para la animación de hamburguesa a X */
        if (hamburger) {
            hamburger.classList.add('is-active');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Cerrar menú');
        }

        /* Overlay con transición */
        overlay.style.display = 'block';
        requestAnimationFrame(function () {
            overlay.classList.add('is-visible');
        });

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', trapFocus);

        var first = getFocusables()[0];
        if (first) setTimeout(function () { first.focus(); }, 50);
    }

    /* ── Cerrar sidebar ── */
    function closeSidebar() {
        if (!isOpen) return;
        isOpen = false;

        sidebar.classList.remove('is-open');

        /* BUG FIX: quitar is-active del botón */
        if (hamburger) {
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Abrir menú');
        }

        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', trapFocus);

        setTimeout(function () {
            if (!isOpen) overlay.style.display = 'none';
        }, 300);

        hamburger && hamburger.focus();
    }

    /* ── Toggle ── */
    function toggleSidebar() {
        isOpen ? closeSidebar() : openSidebar();
    }

    /* ── Limpiar estado en desktop ── */
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth >= BREAKPOINT_LG && isOpen) {
                closeSidebar();
            }
        }, 150);
    }

    /* ── Init ── */
    function init() {
        sidebar = document.getElementById('sidebar');
        overlay = document.getElementById('sidebarOverlay');
        hamburger = document.getElementById('btnHamburger');
        closeBtn = document.getElementById('btnCloseSidebar');

        if (!sidebar || !overlay) return;

        overlay.style.display = 'none';

        hamburger && hamburger.addEventListener('click', toggleSidebar);
        closeBtn && closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
        window.addEventListener('resize', handleResize);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) closeSidebar();
        });

        /* Cerrar al hacer click en link de sidebar (mobile) */
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < BREAKPOINT_LG) closeSidebar();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.EduTrack = window.EduTrack || {};
    window.EduTrack.toggleSidebar = toggleSidebar;
    window.EduTrack.closeSidebar = closeSidebar;
    window.EduTrack.openSidebar = openSidebar;

})();