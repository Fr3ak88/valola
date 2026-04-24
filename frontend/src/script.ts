// Smooth Scrolling für Navigation
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor: HTMLAnchorElement) => {
    anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href: string | null = anchor.getAttribute('href');
        if (href) {
            const target: Element | null = document.querySelector(href);
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
window.addEventListener('load', (): void => {
    const hero: HTMLElement | null = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        setTimeout((): void => {
            hero.style.transition = 'opacity 1s, transform 1s';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});