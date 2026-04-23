"use strict";
// Smooth Scrolling für Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
// Einfache Animation beim Laden
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 1s, transform 1s';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});
