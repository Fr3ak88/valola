// Smooth Scrolling für Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Einfache Animation beim Laden
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-content');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    setTimeout(() => {
        hero.style.transition = 'opacity 1s, transform 1s';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
});