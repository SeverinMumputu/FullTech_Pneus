/* Carrousel FullTech Congo - JavaScript autonome */
    (() => {
        const carousel = document.getElementById('ft-brand-carousel');
        const pagination = document.getElementById('ft-brand-pagination');
        const currentCounter = document.getElementById('ft-brand-current');
        const totalCounter = document.getElementById('ft-brand-total');

        if (!carousel || !pagination || !currentCounter || !totalCounter) return;

        const slides = Array.from(carousel.querySelectorAll('.ft-brand-carousel-slide'));
        const previousButton = carousel.querySelector('.ft-brand-carousel-arrow.prev');
        const nextButton = carousel.querySelector('.ft-brand-carousel-arrow.next');

        if (!slides.length) return;

        let currentIndex = 0;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchStartY = 0;
        let isPointerDown = false;

        totalCounter.textContent = String(slides.length).padStart(2, '0');

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'ft-brand-carousel-dot' + (index === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Afficher l'image ${index + 1}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

            dot.addEventListener('click', () => {
                goToSlide(index);
                restartAutoplay();
            });

            pagination.appendChild(dot);
        });

        const dots = Array.from(pagination.children);

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                const active = i === currentIndex;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', active ? 'false' : 'true');
            });

            dots.forEach((dot, i) => {
                const active = i === currentIndex;
                dot.classList.toggle('is-active', active);
                dot.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function previousSlide() {
            goToSlide(currentIndex - 1);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function startAutoplay() {
            stopAutoplay();

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            autoplayTimer = setInterval(nextSlide, 5000);
        }

        function restartAutoplay() {
            startAutoplay();
        }

        previousButton?.addEventListener('click', () => {
            previousSlide();
            restartAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            nextSlide();
            restartAutoplay();
        });

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', (event) => {
            if (!carousel.contains(event.relatedTarget)) startAutoplay();
        });

        carousel.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                previousSlide();
                restartAutoplay();
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextSlide();
                restartAutoplay();
            }
        });

        carousel.addEventListener('touchstart', (event) => {
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isPointerDown = true;
            stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', (event) => {
            if (!isPointerDown) return;

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            isPointerDown = false;

            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    previousSlide();
                } else {
                    nextSlide();
                }
            }

            startAutoplay();
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        goToSlide(0);
        startAutoplay();
    })();