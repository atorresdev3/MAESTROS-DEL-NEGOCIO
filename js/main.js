    /* ======================================================
    BLOQUE 1 — CARRUSEL DE TESTIMONIOS
    ====================================================== */
function setupTestimonialsCarousel(carousel, track, speed) {
    if (!carousel || !track) return;

    const pRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let posX = 0,
        setWidth = 0,
        isDragging = false;
    let startX = 0,
        startY = 0,
        dragStartPos = 0,
        directionLock = null;
    const autoSpeed = pRM ? 0 : speed;
    const THRESHOLD = 6;

    const getSetWidth = () => track.scrollWidth / 2;
    const wrap = (v) => (setWidth <= 0 ? v : ((v % setWidth) + setWidth) % setWidth);
    const update = () => {
        track.style.transform = `translateX(${-posX}px)`;
    };

    function tick() {
        if (!isDragging) {
            posX = wrap(posX + autoSpeed);
            update();
        }
        requestAnimationFrame(tick);
    }

    carousel.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse") return;
        isDragging = true;
        startX = e.clientX;
        dragStartPos = posX;
    });
    carousel.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || !isDragging) return;
        posX = wrap(dragStartPos + (startX - e.clientX));
        update();
    });
    carousel.addEventListener("pointerup", (e) => {
        if (e.pointerType === "mouse") isDragging = false;
    });
    carousel.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") isDragging = false;
    });
    carousel.addEventListener("pointercancel", (e) => {
        if (e.pointerType === "mouse") isDragging = false;
    });

    carousel.addEventListener(
        "touchstart",
        (e) => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
            dragStartPos = posX;
            directionLock = null;
            isDragging = false;
        },
        { passive: true },
    );

    carousel.addEventListener(
        "touchmove",
        (e) => {
            const t = e.touches[0];
            const dx = startX - t.clientX,
                dy = startY - t.clientY;
            if (!directionLock) {
                if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
                directionLock = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
                if (directionLock === "h") isDragging = true;
            }
            if (directionLock === "h") {
                e.preventDefault();
                posX = wrap(dragStartPos + dx);
                update();
            }
        },
        { passive: false },
    );

    carousel.addEventListener("touchend", () => {
        isDragging = false;
        directionLock = null;
    });
    carousel.addEventListener("touchcancel", () => {
        isDragging = false;
        directionLock = null;
    });

    window.addEventListener("resize", () => {
        setWidth = getSetWidth();
    });

    const images = Array.from(track.querySelectorAll("img"));
    let loaded = 0;
    function reveal() {
        loaded++;
        if (loaded === images.length) {
            setWidth = getSetWidth();
            posX = 0;
            update();
            requestAnimationFrame(tick);
        }
    }
    if (!images.length) {
        requestAnimationFrame(tick);
    } else {
        images.forEach((img) => {
            if (img.complete && img.naturalWidth > 0) reveal();
            else {
                img.addEventListener("load", reveal);
                img.addEventListener("error", reveal);
            }
        });
    }
}

    /* ======================================================
    BLOQUE 2b — CONTADORES 
   ====================================================== */
function initAuthorityCounters() {
    const cards = document.querySelectorAll("#autoridad .stat-feature");
    if (!cards.length) return;

    const pRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function format(v, fmt) {
        const r = Math.round(v);
        return fmt === "comma" ? r.toLocaleString("en-US") : r.toString();
    }

    function animateCount(el) {
        const target = parseFloat(el.dataset.target);
        const start = el.dataset.start !== undefined ? parseFloat(el.dataset.start) : 0;
        const suffix = el.dataset.suffix || "";
        const fmt = el.dataset.format || "";
        const dur = el.dataset.duration ? parseInt(el.dataset.duration, 10) : 1600;

        if (pRM) {
            el.textContent = format(target, fmt) + suffix;
            return;
        }

        const t0 = performance.now();
        function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            const val = start + (target - start) * e;
            el.textContent = format(val, fmt) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(
        (entries, o) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const num = entry.target.querySelector(".stat-feature__num");
                    if (num) animateCount(num);
                    o.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.35 },
    );

    cards.forEach((c) => obs.observe(c));
}

/* ======================================================
    BLOQUE 2 — CONTADORES 
   ====================================================== */
function initCounters() {
    const cards = document.querySelectorAll("#testimonios .stat-card");
    if (!cards.length) return;

    const pRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function format(v, fmt) {
        const r = Math.round(v);
        return fmt === "comma" ? r.toLocaleString("en-US") : r.toString();
    }

    function animateCount(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const fmt = el.dataset.format || "";
        if (pRM) {
            el.textContent = format(target, fmt) + suffix;
            return;
        }

        const dur = 1800,
            t0 = performance.now();
        function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = format(target * e, fmt) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const obs = new IntersectionObserver(
        (entries, o) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add("is-visible");
                    const num = card.querySelector(".stat-card__numero");
                    if (num) animateCount(num);
                    o.unobserve(card);
                }
            });
        },
        { threshold: 0.4 },
    );

    cards.forEach((c) => obs.observe(c));
}

    /* ======================================================
    BLOQUE 3 — ANIMACIONES DE ENTRADA
    ====================================================== */
function initRevealCards() {
    const cards = document.querySelectorAll(".reveal-card");
    if (!cards.length) return;

    const pRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const STEP = 70; 
    const MAX_DELAY = 280; 
    const GROUP_GAP = 220;

    let chainIndex = 0;
    let lastTime = 0;

    const obs = new IntersectionObserver(
        (entries, o) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                o.unobserve(el);

                if (pRM) {
                    el.style.transitionDelay = "0s";
                    el.classList.add("is-visible");
                    return;
                }

                const now = performance.now();
                if (now - lastTime > GROUP_GAP) chainIndex = 0;
                lastTime = now;

                const delay = Math.min(chainIndex * STEP, MAX_DELAY);
                chainIndex++;

                el.style.transitionDelay = delay + "ms";
                el.classList.add("is-visible");
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    cards.forEach((c) => obs.observe(c));
}

    /* ======================================================
    BLOQUE 4 — ACORDEÓN FAQ
    ====================================================== */
function initFaq() {
    const items = document.querySelectorAll(".faq__item");
    if (!items.length) return;

    function close(item) {
        item.querySelector(".faq__question").setAttribute("aria-expanded", "false");
        item.querySelector(".faq__answer-wrapper").style.maxHeight = "0px";
    }

    function open(item) {
        item.querySelector(".faq__question").setAttribute("aria-expanded", "true");
        const w = item.querySelector(".faq__answer-wrapper");
        w.style.maxHeight = w.scrollHeight + "px";
    }

    items.forEach((item) => {
        item.querySelector(".faq__question").addEventListener("click", () => {
            const isOpen = item.querySelector(".faq__question").getAttribute("aria-expanded") === "true";
            items.forEach(close);
            if (!isOpen) open(item);
        });
    });

    window.addEventListener("resize", () => {
        items.forEach((item) => {
            const w = item.querySelector(".faq__answer-wrapper");
            if (item.querySelector(".faq__question").getAttribute("aria-expanded") === "true") {
                w.style.maxHeight = w.scrollHeight + "px";
            }
        });
    });
}

    /* ======================================================
    BLOQUE 5 
    ====================================================== */
function initPriceAnimation() {
    const priceEl = document.querySelector(".offer-card__price-amount");
    const priceUsd = document.querySelector(".offer-card__price-usd");
    const priceWrapper = document.querySelector(".offer-card__price");
    if (!priceEl || !priceWrapper) return;

    const pRM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = parseFloat(priceEl.dataset.start);
    const end = parseFloat(priceEl.dataset.end);
    let animated = false;

    function setValue(v) {
        priceEl.textContent = "$" + v.toFixed(2);
    }

    function countdown() {
        const dur = 3500,
            t0 = performance.now();
        function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setValue(start - (start - end) * e);
            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                setValue(end);
                priceEl.classList.add("is-urgent");
                if (priceUsd) priceUsd.classList.add("is-urgent");
            }
        }
        requestAnimationFrame(step);
    }

    function trigger() {
        if (animated) return;
        animated = true;
        if (pRM) {
            setValue(end);
            return;
        }
        priceEl.classList.add("is-shaking");
        setTimeout(() => {
            priceEl.classList.remove("is-shaking");
            countdown();
        }, 1000);
    }

    const obs = new IntersectionObserver(
        (entries, o) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    trigger();
                    o.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 },
    );

    obs.observe(priceWrapper);
}

    /* ======================================================
    BLOQUE 6 — INICIALIZACIÓN
    ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
    setupTestimonialsCarousel(document.querySelector(".testimonials__carousel"), document.querySelector(".testimonials__track"), 0.6);
    initCounters();
    initAuthorityCounters();
    initRevealCards();
    initFaq();
    initPriceAnimation();
});
