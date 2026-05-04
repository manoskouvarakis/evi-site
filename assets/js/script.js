function enhanceContactProtection() {
    const protectedElements = document.querySelectorAll('.contact-protected');
    protectedElements.forEach(element => {
        element.addEventListener('contextmenu', (e) => e.preventDefault());
        element.addEventListener('copy', (e) => {
            e.preventDefault();
            return false;
        });
    });
}

function openEmail() {
    window.location.href = 'mailto:paidiatros.kosti@gmail.com';
}

function openPhone() {
    window.location.href = 'tel:6974554167';
}

let currentSlide = 0;
let slides, dots, track;

function showSlide(n) {
    if (!track || !dots) return;
    currentSlide = n;
    track.style.transform = `translateX(-${n * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === n));
}

function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function initCarousel() {
    track = document.querySelector('.carousel-track');
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    showSlide(0);

    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        let startX = 0;
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        carouselContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextSlide();
            else if (endX - startX > 50) prevSlide();
        });
    }

    let autoplayTimer = setInterval(nextSlide, 5000);
    carouselContainer?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselContainer?.addEventListener('mouseleave', () => {
        autoplayTimer = setInterval(nextSlide, 5000);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

function initHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    if (elements.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('[data-section]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = document.querySelector(`[data-section="${id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-30% 0px -65% 0px' });

    sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initCarousel();
    initScrollAnimations();
    initActiveNavOnScroll();
    initSmoothScroll();
    enhanceContactProtection();
});
