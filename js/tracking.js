(function () {
    "use strict";

    if (typeof window.__MM_track !== "function") {
        console.warn("[MM Tracking] Pixel core no encontrado. Abortando.");
        return;
    }

    // ── ViewContent — se dispara al cargar la página ──
    window.__MM_track("ViewContent", {
        content_name: "Maestros del Negocio",
        content_category: "Curso Digital",
        content_ids: ["maestros-del-negocio"],
        content_type: "product",
        currency: "USD",
        value: 19.99,
    });

    // ── InitiateCheckout — se dispara al hacer clic en el botón de compra ──
    document.addEventListener("DOMContentLoaded", function () {
        const buyButtons = document.querySelectorAll('a[href*="pay.hotmart.com"], .btn--gold');

        buyButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                window.__MM_track("InitiateCheckout", {
                    content_name: "Maestros del Negocio",
                    content_ids: ["maestros-del-negocio"],
                    content_type: "product",
                    currency: "USD",
                    value: 19.99,
                    num_items: 1,
                });
            });
        });
    });

    if (window.MM_CONFIG && window.MM_CONFIG.debug) {
        console.log("%c[MM Tracking] ✅ Tracking ligero Maestros del Negocio iniciado", "color: #00ff88; font-weight: bold;");
        console.log("[MM Tracking] Eventos activos: ViewContent, InitiateCheckout");
        console.log("[MM Tracking] Pixel ID: 1213559877562939");
        console.log("[MM Tracking] Worker:", "https://maestros-capi-worker.mentesmaestrasdigital.workers.dev");
    }
})();
