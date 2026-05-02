const scheduleTask = (task) => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(task, { timeout: 1000 });
    } else {
        setTimeout(task, 1);
    }
};

function enhanceContactProtection() {
    const protectedElements = document.querySelectorAll('.contact-protected');
    protectedElements.forEach(element => {
        element.addEventListener('contextmenu', (e) => e.preventDefault());
        element.addEventListener('copy', (e) => {
            e.preventDefault();
            return false;
        });
        element.addEventListener('click', function () {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
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
let slides, dots;

function showSlide(n) {
    if (!slides || !dots) return;
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - n) * 100}%)`;
    });
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[n]) dots[n].classList.add('active');
    currentSlide = n;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0) return;

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
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

let ticking = false;
function updateHeader() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(254, 251, 248, 0.97)';
        header.style.boxShadow = '0 2px 12px rgba(45, 55, 72, 0.1)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.boxShadow = '0 2px 8px rgba(45, 55, 72, 0.08)';
    }
    ticking = false;
}

function initHeader() {
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);

            if (isActive) {
                navLinks.style.display = 'flex';
                navLinks.style.position = 'fixed';
                navLinks.style.top = '76px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#fff';
                navLinks.style.zIndex = '1000';
                navLinks.style.padding = '1.5rem 0';
                navLinks.style.flexDirection = 'column';
                navLinks.style.alignItems = 'center';
                navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                navLinks.style.margin = '0';
                navLinks.style.listStyle = 'none';
                document.body.style.overflow = 'hidden';
            } else {
                navLinks.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

function initScrollAnimations(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

function initServiceCardAnimations() {
    initScrollAnimations('.service-card');
}

function initTestimonialAnimations() {
    initScrollAnimations('.testimonial-card');
}

function initBlogTeaserAnimations() {
    initScrollAnimations('.blog-teaser-card');
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
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
    enhanceContactProtection();

    scheduleTask(() => {
        initCarousel();
        initServiceCardAnimations();
        initTestimonialAnimations();
        initBlogTeaserAnimations();
        initActiveNavOnScroll();
    });

    initSmoothScroll();
    initHeader();
    initMobileMenu();
});
