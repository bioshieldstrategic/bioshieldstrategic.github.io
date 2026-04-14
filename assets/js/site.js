const SITE_CONTENT_KEY = 'BioShieldSiteContent';
const SITE_CONTENT_FILE = '/assets/data/site-content.json';

async function loadSiteContent() {
    try {
        const savedContent = localStorage.getItem(SITE_CONTENT_KEY);
        let content = savedContent ? JSON.parse(savedContent) : null;

        if (!content) {
            const response = await fetch(SITE_CONTENT_FILE);
            if (!response.ok) return;
            content = await response.json();
        }

        applySiteContent(content);
    } catch (error) {
        console.warn('Erro ao carregar conteúdo do site:', error);
    }
}

function applySiteContent(content) {
    if (!content) return;

    setText('#hero-title', content.hero?.title);
    setText('#hero-text', content.hero?.text);

    setText('#about-heading', content.about?.heading);
    setText('#about-text-1', content.about?.paragraphs?.[0]);
    setText('#about-text-2', content.about?.paragraphs?.[1]);

    setText('#service-1-title', content.services?.[0]?.title);
    setText('#service-1-text', content.services?.[0]?.text);
    setText('#service-2-title', content.services?.[1]?.title);
    setText('#service-2-text', content.services?.[1]?.text);
    setText('#service-3-title', content.services?.[2]?.title);
    setText('#service-3-text', content.services?.[2]?.text);

    setText('#contact-heading', content.contact?.heading);
    setText('#contact-text', content.contact?.text);
    setText('#contact-phone-link', formatPhone(content.contact?.phone));
    setAttribute('#contact-phone-link', 'href', `tel:${content.contact?.phone}`);
    setText('#contact-email', content.contact?.email);
    setAttribute('#contact-email', 'href', `mailto:${content.contact?.email}`);
}

function setText(selector, value) {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
}

function setAttribute(selector, name, value) {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute(name, value);
}

function formatPhone(phone) {
    if (!phone) return '';
    return phone.replace(/^(\+\d{2})(\d{2})(\d{5})(\d{4})$/, '$1 $2 $3-$4');
}

window.addEventListener('DOMContentLoaded', loadSiteContent);
