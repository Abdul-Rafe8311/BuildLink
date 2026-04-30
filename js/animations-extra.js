'use strict';

/**
 * Animations Extra
 * Companion to css/animations-extra.css.
 * Adds: page transitions, scroll progress, split-text reveal, parallax,
 * scroll-reveal observer, count-up, confetti, sparkles, navbar shift.
 *
 * Designed to layer on top of BL3D (animations3d.js) without conflict.
 */

const BLFX = (() => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =================================================================
       1. Top Scroll Progress Bar
       ================================================================= */

    function initScrollProgress() {
        let bar = document.getElementById('scroll-progress');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'scroll-progress';
            document.body.appendChild(bar);
        }

        let raf = null, idleTimer = null;

        function update() {
            const h = document.documentElement;
            const scrollTop = h.scrollTop || document.body.scrollTop;
            const max = (h.scrollHeight - h.clientHeight) || 1;
            const pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
            bar.style.width = pct + '%';
            bar.classList.remove('idle');
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => bar.classList.add('idle'), 800);
            raf = null;
        }

        window.addEventListener('scroll', () => {
            if (!raf) raf = requestAnimationFrame(update);
        }, { passive: true });

        update();
    }

    /* =================================================================
       2. Page Transitions — wraps window.navigateTo
       ================================================================= */

    function wrapNavigateTo() {
        const main = document.getElementById('main-content');
        if (!main || typeof window.navigateTo !== 'function') return;
        if (window.navigateTo._wrapped) return;

        const original = window.navigateTo;

        window.navigateTo = function (page, params = null) {
            if (reduceMotion) {
                original(page, params);
                return;
            }

            // Don't transition if already mid-flight
            if (main.classList.contains('page-leaving')) return;

            main.classList.add('page-leaving');

            setTimeout(() => {
                main.classList.remove('page-leaving');
                main.classList.add('page-entering');

                // Run the actual navigation (this rerenders #main-content)
                original(page, params);

                // Force reflow then animate in
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        main.classList.remove('page-entering');
                        main.classList.add('page-entered');
                        setTimeout(() => main.classList.remove('page-entered'), 500);

                        // Re-run effects on new content
                        rescanForEffects();
                    });
                });
            }, 220);
        };

        window.navigateTo._wrapped = true;
    }

    /* =================================================================
       3. Split-Text Reveal
       Apply data attribute data-split="true" or class .split-reveal
       ================================================================= */

    function splitText(el) {
        if (el.dataset.splitDone) return;
        el.dataset.splitDone = '1';

        // Walk only direct text nodes / inline children.
        const childNodes = Array.from(el.childNodes);
        el.innerHTML = '';

        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                words.forEach(w => {
                    if (/^\s+$/.test(w)) {
                        el.appendChild(Object.assign(document.createElement('span'), {
                            className: 'split-space',
                        }));
                    } else if (w.length) {
                        const span = document.createElement('span');
                        span.className = 'split-word';
                        span.textContent = w;
                        el.appendChild(span);
                    }
                });
            } else {
                // keep inline elements (e.g. .text-gradient) but mark them as words too
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.classList.add('split-word');
                }
                el.appendChild(node);
            }
        });
    }

    function revealSplit(el) {
        const words = el.querySelectorAll('.split-word');
        words.forEach((w, i) => {
            setTimeout(() => w.classList.add('in'), i * 60);
        });
    }

    function initSplitText() {
        const targets = document.querySelectorAll(
            '.hero-title:not([data-split-done]), .section-header h2:not([data-split-done])'
        );

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealSplit(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        targets.forEach(el => {
            splitText(el);
            obs.observe(el);
        });
    }

    /* =================================================================
       4. Generic Reveal-On-Scroll (.reveal, .reveal-left, etc.)
       ================================================================= */

    function initReveals() {
        const els = document.querySelectorAll(
            '.reveal:not([data-rev-done]), .reveal-left:not([data-rev-done]), .reveal-right:not([data-rev-done]), .reveal-zoom:not([data-rev-done]), .reveal-rot:not([data-rev-done])'
        );

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        els.forEach((el, i) => {
            el.dataset.revDone = '1';
            // auto-stagger if parent is .stagger
            if (el.parentElement && el.parentElement.classList.contains('stagger')) {
                el.style.setProperty('--i', String(i));
            }
            obs.observe(el);
        });
    }

    /* =================================================================
       5. Benefit / Feature card "in-view" class for staggered list items
       ================================================================= */

    function initInViewMarkers() {
        const targets = document.querySelectorAll(
            '.benefit-card:not([data-iv-done]), .feature-card:not([data-iv-done])'
        );

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        targets.forEach(el => {
            el.dataset.ivDone = '1';
            obs.observe(el);
        });
    }

    /* =================================================================
       6. Parallax on .parallax elements (light, transform-only)
       ================================================================= */

    function initParallax() {
        const els = Array.from(document.querySelectorAll('.parallax, .hero-visual'));
        if (!els.length) return;

        let raf = null;

        function tick() {
            const sy = window.scrollY;
            els.forEach(el => {
                const speed = parseFloat(el.dataset.speed || '0.08');
                el.style.transform = `translate3d(0, ${(-sy * speed).toFixed(1)}px, 0)`;
            });
            raf = null;
        }

        window.addEventListener('scroll', () => {
            if (!raf) raf = requestAnimationFrame(tick);
        }, { passive: true });
    }

    /* =================================================================
       7. Count-Up — auto-detects numeric content of .count-up
          Also reuses existing pattern of [data-target] on .counter (no clash)
       ================================================================= */

    function initCountUp() {
        const els = document.querySelectorAll('.count-up:not([data-cu-done])');

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.dataset.cuDone = '1';
                obs.unobserve(el);

                const raw = (el.dataset.value || el.textContent || '').replace(/[^\d.]/g, '');
                const target = parseFloat(raw);
                if (!isFinite(target)) return;

                const prefix = el.dataset.prefix || '';
                const suffix = el.dataset.suffix || '';
                const isFloat = !Number.isInteger(target);
                const dur = parseInt(el.dataset.duration || '1600', 10);
                const start = performance.now();

                function tick(now) {
                    const t = Math.min(1, (now - start) / dur);
                    // ease-out-cubic
                    const e = 1 - Math.pow(1 - t, 3);
                    const v = target * e;
                    el.textContent = prefix + (isFloat ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
                    if (t < 1) requestAnimationFrame(tick);
                    else el.textContent = prefix + (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.4 });

        els.forEach(el => obs.observe(el));
    }

    /* =================================================================
       8. Confetti emitter — call BLFX.confetti()
       ================================================================= */

    function confetti(options = {}) {
        if (reduceMotion) return;
        const count   = options.count   || 80;
        const colors  = options.colors  || ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#34d399'];
        const originX = options.x       != null ? options.x : window.innerWidth / 2;
        const originY = options.y       != null ? options.y : 0;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            const dx  = (Math.random() - 0.5) * window.innerWidth * 0.9;
            const rot = (Math.random() - 0.5) * 1080;
            const dur = 2.2 + Math.random() * 1.6;
            piece.style.left = originX + 'px';
            piece.style.top  = originY + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.setProperty('--dx',  dx  + 'px');
            piece.style.setProperty('--rot', rot + 'deg');
            piece.style.setProperty('--dur', dur + 's');
            piece.style.transform = `translate(-50%, 0) scale(${0.7 + Math.random() * 0.7})`;
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), dur * 1000 + 200);
        }
    }

    /* =================================================================
       9. Sparkles — small twinkles around special elements
       ================================================================= */

    function spawnSparkle(parent) {
        if (reduceMotion) return;
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top  = Math.random() * 100 + '%';
        parent.appendChild(s);
        setTimeout(() => s.remove(), 1400);
    }

    function initSparkleHosts() {
        document.querySelectorAll('.sparkle-host:not([data-sp-done])').forEach(host => {
            host.dataset.spDone = '1';
            host.style.position = host.style.position || 'relative';
            setInterval(() => spawnSparkle(host), 600);
        });

        // Opt-in: any element with .confetti-trigger fires confetti from its position.
        document.querySelectorAll('.confetti-trigger:not([data-cfx-init])').forEach(btn => {
            btn.dataset.cfxInit = '1';
            btn.addEventListener('click', () => {
                const r = btn.getBoundingClientRect();
                confetti({
                    count: 60,
                    x: r.left + r.width / 2,
                    y: r.top  + r.height / 2,
                });
            });
        });
    }

    /* =================================================================
       10. Auto-tag .reveal on common content for delight without code edits
       ================================================================= */

    function autoTagReveal() {
        // Only apply once per element
        const taggables = [
            '.benefits-list .benefit-item',
            '.feature-list li',
            '.choice-features li',
            '.cta-features span',
        ];
        taggables.forEach(sel => {
            document.querySelectorAll(sel + ':not([data-rev-done])').forEach((el, i) => {
                el.classList.add('reveal');
                el.style.transitionDelay = (i * 70) + 'ms';
            });
        });
    }

    /* =================================================================
       11. Header subtle float — make navbar bob gently while idle
          (kept very minimal so it doesn't fight the existing scroll state)
       ================================================================= */

    function initNavbarFloat() {
        const nav = document.getElementById('navbar');
        if (!nav) return;
        let last = 0, dir = 0;

        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            const delta = y - last;
            if (Math.abs(delta) > 4) {
                const newDir = delta > 0 ? 1 : -1;
                if (newDir !== dir) {
                    dir = newDir;
                    nav.style.transform = dir > 0 ? 'translateY(-2px)' : 'translateY(0)';
                }
            }
            last = y;
        }, { passive: true });
    }

    /* =================================================================
       Re-scan everything for new content (after page nav / new render)
       ================================================================= */

    function rescanForEffects() {
        try {
            autoTagReveal();
            initReveals();
            initSplitText();
            initInViewMarkers();
            initCountUp();
            initSparkleHosts();
        } catch (err) {
            console.warn('BLFX rescan error:', err);
        }
    }

    /* =================================================================
       Bootstrap
       ================================================================= */

    function init() {
        initScrollProgress();
        initNavbarFloat();
        initParallax();
        wrapNavigateTo();
        rescanForEffects();

        // Re-scan whenever main content changes (covers in-page renders).
        const main = document.getElementById('main-content');
        if (main && 'MutationObserver' in window) {
            let queued = false;
            const mo = new MutationObserver(() => {
                if (queued) return;
                queued = true;
                requestAnimationFrame(() => {
                    rescanForEffects();
                    queued = false;
                });
            });
            mo.observe(main, { childList: true, subtree: false });
        }
    }

    return { init, confetti, rescanForEffects };
})();

window.BLFX = BLFX;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BLFX.init);
} else {
    BLFX.init();
}
