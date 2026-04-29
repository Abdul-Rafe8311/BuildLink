'use strict';

const BL3D = (() => {

    // ================================================================
    // Three.js 3D Building Scene
    // ================================================================

    function initBuildingScene() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        if (!window.THREE) {
            const fb = document.getElementById('canvas-fallback');
            if (fb) fb.classList.add('visible');
            return;
        }

        // Destroy previous instance if navigating back to home
        if (canvas._threeDestroy) { canvas._threeDestroy(); }

        const THREE = window.THREE;
        const parent = canvas.parentElement;
        const W = parent.clientWidth  || 520;
        const H = Math.max(parent.clientHeight || 0, 460);

        // ---- Renderer ----
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // ---- Scene & Camera ----
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
        camera.position.set(0, 1.5, 11);
        camera.lookAt(0, 0, 0);

        // ---- Lights ----
        scene.add(new THREE.AmbientLight(0xffffff, 0.35));

        const gLight = new THREE.PointLight(0x10b981, 3.5, 14);
        gLight.position.set(3, 4, 5);
        scene.add(gLight);

        const cLight = new THREE.PointLight(0x06b6d4, 2, 10);
        cLight.position.set(-4, 0, 3);
        scene.add(cLight);

        const pLight = new THREE.PointLight(0xf59e0b, 1.8, 9);
        pLight.position.set(0, -3, 5);
        scene.add(pLight);

        // ================================================================
        // MAIN BUILDING
        // ================================================================
        const BG = new THREE.Group();
        const BW = 2.8, BH = 6.4, BD = 1.8;

        // Solid body
        const bodyGeo = new THREE.BoxGeometry(BW, BH, BD);
        BG.add(new THREE.Mesh(bodyGeo, new THREE.MeshPhongMaterial({
            color: 0x051a0e, transparent: true, opacity: 0.78,
        })));

        // Wireframe edges
        BG.add(new THREE.LineSegments(
            new THREE.EdgesGeometry(bodyGeo),
            new THREE.LineBasicMaterial({ color: 0x10b981 })
        ));

        // Floor plates
        for (let i = -2; i <= 2; i++) {
            const fm = new THREE.Mesh(
                new THREE.BoxGeometry(BW + 0.06, 0.06, BD + 0.06),
                new THREE.MeshBasicMaterial({ color: 0x059669, transparent: true, opacity: 0.4 })
            );
            fm.position.y = i * 1.28;
            BG.add(fm);
        }

        // Corner columns
        const colMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.65 });
        for (const [cx, cz] of [[-BW/2, -BD/2], [BW/2, -BD/2], [-BW/2, BD/2], [BW/2, BD/2]]) {
            const col = new THREE.Mesh(new THREE.BoxGeometry(0.11, BH, 0.11), colMat);
            col.position.set(cx, 0, cz);
            BG.add(col);
        }

        // Windows on front face – track lit ones for flickering
        const windowData = [];
        const COLS = 5, ROWS = 7;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const lit = Math.random() > 0.38;
                const wMat = new THREE.MeshBasicMaterial({
                    color: lit ? 0xfbbf24 : 0x0a2a14,
                    transparent: true, opacity: lit ? 0.88 : 0.15,
                });
                const win = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.42), wMat);
                win.position.set((c - (COLS-1)/2) * 0.52, (r - (ROWS-1)/2) * 0.82, BD/2 + 0.01);
                BG.add(win);
                windowData.push({ mat: wMat, lit });
            }
        }

        // Construction crane (amber)
        const craneMat = new THREE.LineBasicMaterial({ color: 0xfbbf24 });
        const craneGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0,   0,   0),
            new THREE.Vector3(0,   2,   0),
            new THREE.Vector3(3,   2,   0),
            new THREE.Vector3(3,   1.7, 0),
            new THREE.Vector3(2.4, 2,   0),
            new THREE.Vector3(-0.7,2,   0),
            new THREE.Vector3(-0.7,0.9, 0),
        ]);
        const crane = new THREE.Line(craneGeo, craneMat);
        crane.position.y = BH / 2;
        BG.add(crane);

        // Hanging cable from crane tip
        BG.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(3, 1.7, 0), new THREE.Vector3(3, 0, 0)]),
            new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55 })
        ));

        BG.position.y = -0.6;
        scene.add(BG);

        // ================================================================
        // BACKGROUND SKYLINE
        // ================================================================
        function addBuilding(x, w, h, d, z, op) {
            const geo = new THREE.BoxGeometry(w, h, d);
            const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
                color: 0x030d06, transparent: true, opacity: op,
            }));
            mesh.position.set(x, -BH/2 + h/2 - 0.6, z);
            scene.add(mesh);

            const eLine = new THREE.LineSegments(
                new THREE.EdgesGeometry(geo),
                new THREE.LineBasicMaterial({ color: 0x047857, transparent: true, opacity: op * 1.9 })
            );
            eLine.position.copy(mesh.position);
            scene.add(eLine);
        }

        addBuilding(-6.5, 2.2, 3.8,  1.2, -3.5, 0.28);
        addBuilding(-10,  1.6, 2.4,  1.0, -4.5, 0.18);
        addBuilding( 5.5, 2.8, 4.8,  1.5, -3.5, 0.24);
        addBuilding( 9.5, 1.8, 3.2,  1.2, -4.5, 0.17);
        addBuilding(-3.5, 1.2, 2.0,  1.0, -5.5, 0.12);
        addBuilding( 7.5, 1.5, 2.7,  1.0, -5.5, 0.12);

        // ================================================================
        // GRID FLOOR + GLOW PLANE
        // ================================================================
        const grid = new THREE.GridHelper(24, 32, 0x10b981, 0x064e3b);
        grid.position.y = -3.8;
        grid.material.transparent = true;
        grid.material.opacity = 0.32;
        scene.add(grid);

        const glowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 24),
            new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.04, side: THREE.DoubleSide })
        );
        glowPlane.rotation.x = -Math.PI / 2;
        glowPlane.position.y = -3.79;
        scene.add(glowPlane);

        // ================================================================
        // FLOATING PARTICLES
        // ================================================================
        const PC = 220;
        const pPos = new Float32Array(PC * 3);
        const pVel = new Float32Array(PC);
        for (let i = 0; i < PC; i++) {
            pPos[i*3]   = (Math.random() - 0.5) * 26;
            pPos[i*3+1] = (Math.random() - 0.5) * 18;
            pPos[i*3+2] = (Math.random() - 0.5) * 14;
            pVel[i]     = 0.006 + Math.random() * 0.014;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
            color: 0x10b981, size: 0.065, transparent: true, opacity: 0.55,
        })));

        // ================================================================
        // SCAN LINE
        // ================================================================
        const scanMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
        const scanLine = new THREE.Mesh(new THREE.PlaneGeometry(BW + 0.4, 0.05), scanMat);
        scanLine.position.set(0, -0.6, BD/2 + 0.02);
        scene.add(scanLine);

        // ================================================================
        // MOUSE INTERACTION
        // ================================================================
        let tRotX = 0, cRotX = 0, tRotY = 0, cRotY = 0;
        let isHover = false;

        canvas.addEventListener('mousemove', e => {
            const r = canvas.getBoundingClientRect();
            tRotX  = -((e.clientY - r.top)  / r.height - 0.5) * 0.7;
            tRotY +=  ((e.clientX - r.left) / r.width  - 0.5) * 0.06;
            isHover = true;
        });
        canvas.addEventListener('mouseleave', () => { isHover = false; tRotX = 0; });

        // ================================================================
        // RESIZE
        // ================================================================
        function onResize() {
            const nw = parent.clientWidth;
            const nh = Math.max(parent.clientHeight || 0, 460);
            renderer.setSize(nw, nh);
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', onResize);

        // ================================================================
        // ANIMATE LOOP
        // ================================================================
        let frame = 0, animId;

        function animate() {
            // Stop gracefully when canvas leaves DOM (page navigation)
            if (!document.getElementById('hero-canvas')) { cleanup(); return; }
            animId = requestAnimationFrame(animate);
            frame++;

            // Rotation
            if (!isHover) tRotY += 0.004;
            cRotX += (tRotX - cRotX) * 0.055;
            cRotY += (tRotY - cRotY) * 0.04;
            BG.rotation.x = cRotX;
            BG.rotation.y = cRotY;

            // Rising particles
            for (let i = 0; i < PC; i++) {
                pPos[i*3+1] += pVel[i];
                if (pPos[i*3+1] > 10) pPos[i*3+1] = -10;
            }
            pGeo.attributes.position.needsUpdate = true;

            // Scan line sweep
            scanLine.position.y = -0.6 + BH/2 * Math.sin(frame * 0.018);
            scanMat.opacity = 0.25 + 0.4 * Math.abs(Math.sin(frame * 0.018));

            // Window flicker
            if (frame % 80 === 0) {
                const w = windowData[Math.floor(Math.random() * windowData.length)];
                if (w) {
                    w.lit = !w.lit;
                    w.mat.color.setHex(w.lit ? 0xfbbf24 : 0x0a2a14);
                    w.mat.opacity = w.lit ? 0.88 : 0.15;
                }
            }

            // Light pulse
            gLight.intensity = 3.5 + Math.sin(frame * 0.03) * 0.9;
            cLight.intensity = 2.0 + Math.cos(frame * 0.025) * 0.7;

            renderer.render(scene, camera);
        }

        function cleanup() {
            cancelAnimationFrame(animId);
            renderer.dispose();
            window.removeEventListener('resize', onResize);
        }

        canvas._threeDestroy = cleanup;
        animate();
    }

    // ================================================================
    // Card 3D Tilt
    // ================================================================

    function initCardTilt() {
        function applyTilt(card) {
            if (card.dataset.tiltInit) return;
            card.dataset.tiltInit = 'true';
            card.style.willChange = 'transform';

            // Inject sheen layer
            const sheen = document.createElement('div');
            sheen.className = 'card-sheen';
            card.appendChild(sheen);

            let tX = 0, tY = 0, cX = 0, cY = 0;
            let rafId = null, active = false;

            function tick() {
                cX += (tX - cX) * 0.12;
                cY += (tY - cY) * 0.12;
                card.style.transform = `perspective(900px) rotateX(${cX}deg) rotateY(${cY}deg)`;
                if (active || Math.abs(tX - cX) > 0.03 || Math.abs(tY - cY) > 0.03) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    cX = 0; cY = 0;
                    card.style.transform = '';
                    rafId = null;
                }
            }

            card.addEventListener('mouseenter', () => {
                active = true;
                if (!rafId) rafId = requestAnimationFrame(tick);
            });

            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                tX = -((e.clientY - r.top)  / r.height - 0.5) * 17;
                tY =  ((e.clientX - r.left) / r.width  - 0.5) * 17;
                const px = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
                const py = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
                sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.07) 0%, transparent 65%)`;
            });

            card.addEventListener('mouseleave', () => {
                active = false;
                tX = 0; tY = 0;
                sheen.style.background = 'none';
                if (!rafId) rafId = requestAnimationFrame(tick);
            });
        }

        function applyAll() {
            document.querySelectorAll('.card:not([data-tilt-init])').forEach(applyTilt);
        }

        applyAll();
        new MutationObserver(applyAll).observe(
            document.getElementById('main-content') || document.body,
            { childList: true, subtree: true }
        );
    }

    // ================================================================
    // Magnetic Buttons
    // ================================================================

    function initMagneticButtons() {
        function applyMagnetic(btn) {
            if (btn.dataset.magInit) return;
            btn.dataset.magInit = 'true';

            let tX = 0, tY = 0, cX = 0, cY = 0;
            let rafId = null, active = false;

            function tick() {
                cX += (tX - cX) * 0.2;
                cY += (tY - cY) * 0.2;
                btn.style.transform = `translate(${cX}px, ${cY}px)`;
                if (active || Math.abs(cX) > 0.08 || Math.abs(cY) > 0.08) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    cX = 0; cY = 0;
                    btn.style.transform = '';
                    rafId = null;
                }
            }

            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                tX = (e.clientX - (r.left + r.width/2))  * 0.26;
                tY = (e.clientY - (r.top  + r.height/2)) * 0.26;
                if (!rafId) { active = true; rafId = requestAnimationFrame(tick); }
            });

            btn.addEventListener('mouseleave', () => {
                active = false;
                tX = 0; tY = 0;
                if (!rafId) rafId = requestAnimationFrame(tick);
            });
        }

        function applyAll() {
            document.querySelectorAll(
                '.btn-primary:not([data-mag-init]), .btn-glow:not([data-mag-init])'
            ).forEach(applyMagnetic);
        }

        applyAll();
        new MutationObserver(applyAll).observe(
            document.getElementById('main-content') || document.body,
            { childList: true, subtree: true }
        );
    }

    // ================================================================
    // Custom Cursor
    // ================================================================

    function initCustomCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        document.body.classList.add('custom-cursor-active');

        const cursor = document.createElement('div');
        cursor.id = 'bl-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const dot  = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        let mX = -200, mY = -200, rX = -200, rY = -200;

        document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

        (function loop() {
            rX += (mX - rX) * 0.13;
            rY += (mY - rY) * 0.13;
            dot.style.left  = mX + 'px';
            dot.style.top   = mY + 'px';
            ring.style.left = rX + 'px';
            ring.style.top  = rY + 'px';
            requestAnimationFrame(loop);
        })();

        document.addEventListener('mouseover', e => {
            cursor.classList.toggle(
                'cursor-hover',
                !!e.target.closest('button, a, input, select, textarea, .card, [onclick]')
            );
        });

        document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
        document.addEventListener('mouseup',   () => cursor.classList.remove('cursor-click'));
    }

    // ================================================================
    // Button Ripple
    // ================================================================

    function initRipple() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('button, .btn');
            if (!btn) return;
            const r   = btn.getBoundingClientRect();
            const sz  = Math.max(r.width, r.height) * 2;
            const el  = document.createElement('span');
            el.className = 'btn-ripple';
            el.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz/2}px;top:${e.clientY - r.top - sz/2}px;`;
            btn.appendChild(el);
            setTimeout(() => el.remove(), 760);
        });
    }

    // ================================================================
    // 3D Scroll Reveal
    // ================================================================

    function initScrollReveal3D() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });

        function applyReveal() {
            document.querySelectorAll('.features-grid .card:not([data-rev])').forEach((card, i) => {
                card.setAttribute('data-rev', '');
                card.setAttribute('data-rev-idx', String((i % 6) + 1));
                card.classList.add(i % 2 === 0 ? 'reveal-3d-left' : 'reveal-3d-right');
                obs.observe(card);
            });

            document.querySelectorAll('.benefits-grid .card:not([data-rev])').forEach((card, i) => {
                card.setAttribute('data-rev', '');
                card.setAttribute('data-rev-idx', String((i % 6) + 1));
                const cls = ['reveal-3d-left', 'reveal-3d-up', 'reveal-3d-right'];
                card.classList.add(cls[i % 3]);
                obs.observe(card);
            });

            document.querySelectorAll('.testimonial-card:not([data-rev])').forEach(card => {
                card.setAttribute('data-rev', '');
                card.classList.add('reveal-3d-scale');
                obs.observe(card);
            });
        }

        applyReveal();
        new MutationObserver(applyReveal).observe(
            document.getElementById('main-content') || document.body,
            { childList: true, subtree: true }
        );
    }

    // ================================================================
    // Navbar scroll effect
    // ================================================================

    function initNavbarScroll() {
        const nav = document.getElementById('navbar');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // ================================================================
    // Public API
    // ================================================================

    function init() {
        initCardTilt();
        initMagneticButtons();
        initCustomCursor();
        initRipple();
        initScrollReveal3D();
        initNavbarScroll();
    }

    return { init, initBuildingScene };
})();

window.BL3D = BL3D;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BL3D.init);
} else {
    BL3D.init();
}
