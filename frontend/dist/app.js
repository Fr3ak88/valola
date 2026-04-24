"use strict";
// API Service für Backend-Kommunikation
class ApiService {
    static setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }
    static getToken() {
        return this.token || localStorage.getItem('authToken');
    }
    static clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }
    static async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (this.getToken()) {
            headers.Authorization = `Bearer ${this.getToken()}`;
        }
        const response = await fetch(url, {
            ...options,
            headers
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Netzwerkfehler' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }
        return response.json();
    }
    static async login(email, password) {
        const response = await this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(response.token);
        return response;
    }
    static async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    static async getCurrentUser() {
        return this.request('/users/me');
    }
    static logout() {
        this.clearToken();
        window.location.reload();
    }
}
ApiService.baseUrl = 'http://localhost:3001/api';
ApiService.token = null;
function createElement(tag, options) {
    const element = document.createElement(tag);
    if (options === null || options === void 0 ? void 0 : options.classes) {
        element.classList.add(...options.classes);
    }
    if (options === null || options === void 0 ? void 0 : options.text) {
        element.textContent = options.text;
    }
    if (options === null || options === void 0 ? void 0 : options.attrs) {
        Object.entries(options.attrs).forEach(([name, value]) => {
            element.setAttribute(name, value);
        });
    }
    return element;
}
function getNavItems() {
    return [
        { text: 'Start', href: 'index.html#home', page: 'home' },
        { text: 'Features', href: 'index.html#features', page: 'home' },
        { text: 'Über uns', href: 'index.html#about', page: 'home' },
        { text: 'Kontakt', href: 'index.html#contact', page: 'home' },
        { text: 'Login', href: 'login.html', page: 'login' }
    ];
}
function renderHeader(activePage) {
    const header = createElement('header');
    const nav = createElement('nav');
    const logo = createElement('div', { classes: ['logo'], text: 'Valola' });
    const list = createElement('ul');
    getNavItems().forEach(item => {
        const listItem = createElement('li');
        const link = createElement('a', { text: item.text, attrs: { href: item.href } });
        if (item.page === activePage) {
            link.classList.add('active');
        }
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
    nav.appendChild(logo);
    nav.appendChild(list);
    header.appendChild(nav);
    return header;
}
function renderFooter() {
    const footer = createElement('footer');
    footer.innerHTML = '<p>&copy; 2026 Valola. Alle Rechte vorbehalten.</p>';
    return footer;
}
function renderHero() {
    const section = createElement('section', { classes: ['hero'], attrs: { id: 'home' } });
    const content = createElement('div', { classes: ['hero-content'] });
    const title = createElement('h1', { text: 'Willkommen bei Valola' });
    const description = createElement('p', { text: 'Die Software, die sich deinem Arbeitsalltag anpasst — nicht umgekehrt.' });
    const actions = createElement('div', { classes: ['hero-actions'] });
    const learnMore = createElement('a', { text: 'Mehr erfahren', classes: ['btn'], attrs: { href: '#features' } });
    const login = createElement('a', { text: 'Login', classes: ['btn', 'btn-secondary'], attrs: { href: 'login.html' } });
    actions.appendChild(learnMore);
    actions.appendChild(login);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(actions);
    section.appendChild(content);
    return section;
}
function renderFeatures() {
    const section = createElement('section', { classes: ['features'], attrs: { id: 'features' } });
    const title = createElement('h2', { text: 'Unsere Features' });
    const grid = createElement('div', { classes: ['feature-grid'] });
    const items = [
        { heading: 'CRM-Modul', text: 'Alle Kundendaten, Kontakte und Kommunikation an einem Ort.' },
        { heading: 'Buchhaltung', text: 'Rechnungen, Kosten und Finanzen übersichtlich an einem Ort.' },
        { heading: 'Integration', text: 'Nahtlose Verbindung zwischen ERP und IT-Systemen.' },
        { heading: 'Analyse & Berichte', text: 'Echtzeit-Analysen und detaillierte Berichte für bessere Entscheidungen.' }
    ];
    items.forEach(item => {
        const feature = createElement('div', { classes: ['feature'] });
        feature.appendChild(createElement('h3', { text: item.heading }));
        feature.appendChild(createElement('p', { text: item.text }));
        grid.appendChild(feature);
    });
    section.appendChild(title);
    section.appendChild(grid);
    return section;
}
function renderAbout() {
    const section = createElement('section', { classes: ['about'], attrs: { id: 'about' } });
    section.appendChild(createElement('h2', { text: 'Über Valola' }));
    section.appendChild(createElement('p', { text: 'Valola kombiniert bewährte ERP-Prinzipien mit modernen ITflow-Technologien, um Unternehmen zu helfen, ihre Prozesse zu optimieren und Wachstum zu fördern.' }));
    return section;
}
function renderContact() {
    const section = createElement('section', { classes: ['contact'], attrs: { id: 'contact' } });
    section.appendChild(createElement('h2', { text: 'Kontakt' }));
    section.appendChild(createElement('p', { text: 'Interessiert? Kontaktieren Sie uns für eine Demo oder weitere Informationen.' }));
    const button = createElement('a', { text: 'E-Mail senden', classes: ['btn'], attrs: { href: 'mailto:info@valola.com' } });
    section.appendChild(button);
    return section;
}
function renderLoginPage() {
    const main = createElement('main', { classes: ['login-page'] });
    const container = createElement('div', { classes: ['login-container'] });
    container.appendChild(createElement('h1', { text: 'Anmeldung' }));
    container.appendChild(createElement('p', { text: 'Bitte melden Sie sich an, um auf Ihr Valola-Konto zuzugreifen.' }));
    const form = createElement('form');
    const emailInput = createElement('input', { attrs: { type: 'email', id: 'email', name: 'email', placeholder: 'name@beispiel.de', required: 'true' } });
    const passwordInput = createElement('input', { attrs: { type: 'password', id: 'password', name: 'password', placeholder: 'Passwort', required: 'true' } });
    const submitButton = createElement('button', { text: 'Einloggen', classes: ['btn'], attrs: { type: 'submit' } });
    form.appendChild(createElement('label', { text: 'E-Mail', attrs: { for: 'email' } }));
    form.appendChild(emailInput);
    form.appendChild(createElement('label', { text: 'Passwort', attrs: { for: 'password' } }));
    form.appendChild(passwordInput);
    form.appendChild(submitButton);
    container.appendChild(form);
    const helperText = createElement('p', { classes: ['helper-text'] });
    helperText.innerHTML = 'Noch keinen Zugang? <a href="index.html#contact">Kontaktieren Sie uns</a>.';
    container.appendChild(helperText);
    main.appendChild(container);
    // Login-Handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        submitButton.textContent = 'Lädt...';
        submitButton.disabled = true;
        try {
            const response = await ApiService.login(email, password);
            alert(`Willkommen, ${response.user.first_name || response.user.email}!`);
            // Nach erfolgreichem Login zur Hauptseite weiterleiten
            window.location.href = 'index.html';
        }
        catch (error) {
            alert(`Login fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
        }
        finally {
            submitButton.textContent = 'Einloggen';
            submitButton.disabled = false;
        }
    });
    return main;
}
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            event.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (!targetId) {
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
function renderHomePage() {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(renderHeader('home'));
    fragment.appendChild(renderHero());
    fragment.appendChild(renderFeatures());
    fragment.appendChild(renderAbout());
    fragment.appendChild(renderContact());
    fragment.appendChild(renderFooter());
    return fragment;
}
function renderApp(page) {
    const app = document.querySelector('#app');
    if (!app) {
        return;
    }
    app.innerHTML = '';
    if (page === 'home') {
        app.appendChild(renderHomePage());
    }
    else {
        app.appendChild(renderHeader('login'));
        app.appendChild(renderLoginPage());
        app.appendChild(renderFooter());
    }
    setupSmoothScroll();
}
function detectPage() {
    const body = document.body;
    const page = body.getAttribute('data-page');
    if (page === 'login') {
        return 'login';
    }
    return 'home';
}
document.addEventListener('DOMContentLoaded', () => {
    renderApp(detectPage());
});
