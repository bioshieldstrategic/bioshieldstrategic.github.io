const ADMIN_PASSWORD = 'bio2026';
const SITE_CONTENT_KEY = 'BioShieldSiteContent';
const JSON_FILE = '/assets/data/site-content.json';

const loginCard = document.getElementById('login-card');
const editorCard = document.getElementById('editor-card');
const loginButton = document.getElementById('admin-login');
const passwordInput = document.getElementById('admin-password');
const form = document.getElementById('admin-form');
const exportButton = document.getElementById('admin-export');
const importInput = document.getElementById('admin-import-file');

async function initAdmin() {
    loginButton.addEventListener('click', handleLogin);
    exportButton.addEventListener('click', handleExport);
    importInput.addEventListener('change', handleImport);
    loadEditorData();
}

function handleLogin() {
    const value = passwordInput.value.trim();
    if (value === ADMIN_PASSWORD) {
        loginCard.classList.add('hidden');
        editorCard.classList.remove('hidden');
    } else {
        alert('Senha incorreta. Por favor tente novamente.');
    }
}

async function loadEditorData() {
    const saved = localStorage.getItem(SITE_CONTENT_KEY);
    if (saved) {
        populateForm(JSON.parse(saved));
        return;
    }

    try {
        const response = await fetch(JSON_FILE);
        if (!response.ok) return;
        const data = await response.json();
        populateForm(data);
    } catch (error) {
        console.warn('Erro ao carregar dados do site:', error);
    }
}

function populateForm(data) {
    document.getElementById('hero-title').value = data.hero?.title || '';
    document.getElementById('hero-text').value = data.hero?.text || '';
    document.getElementById('about-heading').value = data.about?.heading || '';
    document.getElementById('about-text-1').value = data.about?.paragraphs?.[0] || '';
    document.getElementById('about-text-2').value = data.about?.paragraphs?.[1] || '';
    data.services?.forEach((item, index) => {
        document.getElementById(`service-${index+1}-title`).value = item.title || '';
        document.getElementById(`service-${index+1}-text`).value = item.text || '';
    });
    document.getElementById('contact-text').value = data.contact?.text || '';
    document.getElementById('contact-phone').value = data.contact?.phone || '';
    document.getElementById('contact-email').value = data.contact?.email || '';
}

function getFormData() {
    return {
        hero: {
            title: document.getElementById('hero-title').value,
            text: document.getElementById('hero-text').value
        },
        about: {
            heading: document.getElementById('about-heading').value,
            paragraphs: [
                document.getElementById('about-text-1').value,
                document.getElementById('about-text-2').value
            ]
        },
        services: [1, 2, 3].map(index => ({
            title: document.getElementById(`service-${index}-title`).value,
            text: document.getElementById(`service-${index}-text`).value
        })),
        contact: {
            text: document.getElementById('contact-text').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value
        }
    };
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const data = getFormData();
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(data));
    alert('Conteúdo salvo localmente no navegador.');
});

function handleExport() {
    const data = getFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    a.click();
    URL.revokeObjectURL(url);
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        try {
            const data = JSON.parse(reader.result);
            populateForm(data);
            alert('Arquivo importado. Clique em salvar para armazenar localmente.');
        } catch (error) {
            alert('Não foi possível ler o arquivo JSON. Verifique o formato.');
        }
    };
    reader.readAsText(file);
}

window.addEventListener('DOMContentLoaded', initAdmin);
