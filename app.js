/* ============================================================
   MEDHOME MEDICALS — Shared JavaScript
   Premium Modern UI/UX | 2025
   ============================================================ */

(function () {
    'use strict';

    // ========== ECG LOADER ==========
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('done'), 1800);
        });
        // Safety fallback
        setTimeout(() => loader.classList.add('done'), 4000);
    }

    // ========== GLASSMORPHIC NAV SCROLL ==========
    const nav = document.querySelector('.nav');
    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ========== MOBILE MENU ==========
    const burger = document.querySelector('.nav-burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (burger && mobileMenu) {
        const toggleMenu = () => {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        };
        burger.addEventListener('click', toggleMenu);
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (mobileMenu.classList.contains('open')) toggleMenu();
            });
        });
    }

    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.12, rootMargin: '-40px' });
        revealElements.forEach(el => revealObs.observe(el));
    }

    // ========== TEXT SPLIT ANIMATION (Hero headlines) ==========
    const splitElements = document.querySelectorAll('[data-text-split]');
    splitElements.forEach(el => {
        const text = el.innerHTML;
        // Split by words, preserving HTML tags
        const words = text.split(/(\s+)/);
        el.innerHTML = words.map(word => {
            if (word.trim() === '') return word;
            // Check if it contains HTML tags
            if (word.includes('<')) return word.replace(/>([^<]+)</g, (match, content) => {
                return '>' + content.split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ') + '<';
            });
            return `<span class="word">${word}</span>`;
        }).join('');

        // Trigger animation on intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const wordSpans = entry.target.querySelectorAll('.word');
                    wordSpans.forEach((span, i) => {
                        setTimeout(() => span.classList.add('visible'), i * 80);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(el);
    });

    // ========== COUNTER ANIMATION ==========
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counterElements = document.querySelectorAll('[data-counter]');
    if (counterElements.length) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = '1';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterElements.forEach(el => counterObs.observe(el));
    }

    // ========== MAGNETIC BUTTONS ==========
    const magneticBtns = document.querySelectorAll('[data-magnetic]');
    if (window.matchMedia('(hover: hover)').matches) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========== 3D CARD TILT ==========
    const tiltCards = document.querySelectorAll('[data-tilt]');
    if (window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
                card.style.transition = 'transform 0.5s ease';
                setTimeout(() => card.style.transition = '', 500);
            });
        });
    }

    // ========== CUSTOM CURSOR ==========
    const cursor = document.querySelector('.cursor-dot');
    if (cursor && window.matchMedia('(hover: hover)').matches) {
        let cx = 0, cy = 0, tx = 0, ty = 0;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
        });

        function updateCursor() {
            cx += (tx - cx) * 0.15;
            cy += (ty - cy) * 0.15;
            cursor.style.left = cx + 'px';
            cursor.style.top = cy + 'px';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .bento-card, .srv-card, .testi-card, .mvv-card, .info-card, .trust-card, .step-card, .fab');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ========== BACK TO TOP ==========
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== CONTACT FORM HANDLER ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fname').value;
            const phone = document.getElementById('fphone').value;
            const subject = document.getElementById('fsubject').value;
            const message = document.getElementById('fmessage').value;
            const text = `Hi Medhome Medicals,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0ASubject: ${encodeURIComponent(subject)}%0AMessage: ${encodeURIComponent(message)}`;
            window.open(`https://wa.me/919645004442?text=${text}`, '_blank');
        });
    }

})();
