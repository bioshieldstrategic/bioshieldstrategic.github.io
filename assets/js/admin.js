const ADMIN_PASSWORD = 'bio2026';
const SITE_CONTENT_KEY = 'BioShieldSiteContent';
const JSON_FILE = '/data/content.json';
const GITHUB_API = 'https://api.github.com';

const loginCard = document.getElementById('login-card');
const editorCard = document.getElementById('editor-card');
const githubCard = document.getElementById('github-card');
const loginButton = document.getElementById('admin-login');
const passwordInput = document.getElementById('admin-password');
const form = document.getElementById('admin-form');
const exportButton = document.getElementById('admin-export');
const githubButton = document.getElementById('admin-github');
const githubCommitBtn = document.getElementById('github-commit');
const githubCancelBtn = document.getElementById('github-cancel');

passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleLogin();
    }
});

function handleLogin() {
    const value = passwordInput.value.trim();
    if (value === ADMIN_PASSWORD) {
        loginCard.classList.add('hidden');
        editorCard.classList.remove('hidden');
        loadEditorData();
    } else {
        alert('Senha incorreta. Por favor tente novamente.');
    }
}

async function loadEditorData() {
    try {
        const response = await fetch(JSON_FILE);
        if (!response.ok) return;
        const data = await response.json();
        populateForm(data);
    } catch (error) {
        console.warn('Erro ao carregar dados:', error);
    }
}

function populateForm(data) {
    const pt = data.pt;
    const en = data.en;

    document.getElementById('hero-pt-title').value = pt.site.hero.title || '';
    document.getElementById('hero-pt-subtitle').value = pt.site.hero.subtitle || '';
    document.getElementById('hero-pt-btn').value = pt.site.hero.buttonText || '';
    document.getElementById('hero-en-title').value = en.site.hero.title || '';
    document.getElementById('hero-en-subtitle').value = en.site.hero.subtitle || '';
    document.getElementById('hero-en-btn').value = en.site.hero.buttonText || '';

    document.getElementById('about-pt-title').value = pt.site.about.title || '';
    document.getElementById('about-pt-content1').value = pt.site.about.content1 || '';
    document.getElementById('about-pt-content2').value = pt.site.about.content2 || '';
    document.getElementById('about-en-title').value = en.site.about.title || '';
    document.getElementById('about-en-content1').value = en.site.about.content1 || '';
    document.getElementById('about-en-content2').value = en.site.about.content2 || '';

    document.getElementById('contact-pt-title').value = pt.site.contact.title || '';
    document.getElementById('contact-pt-text').value = pt.site.contact.text || '';
    document.getElementById('contact-pt-phone').value = pt.site.contact.phone || '';
    document.getElementById('contact-pt-email').value = pt.site.contact.email || '';
    document.getElementById('contact-en-title').value = en.site.contact.title || '';
    document.getElementById('contact-en-text').value = en.site.contact.text || '';
    document.getElementById('contact-en-phone').value = en.site.contact.phone || '';
    document.getElementById('contact-en-email').value = en.site.contact.email || '';

    renderArticlesEditor(pt.articles, en.articles);
}

function renderArticlesEditor(ptArticles, enArticles) {
    const container = document.getElementById('articles-editor');
    container.innerHTML = '';

    ptArticles.forEach((ptArticle, index) => {
        const enArticle = enArticles[index] || {};
        const id = ptArticle.id;

        const card = document.createElement('div');
        card.className = 'article-edit-card';
        card.innerHTML = `
            <h4 style="margin-bottom: 15px; color: var(--deep-navy);">Artigo ${id}: ${ptArticle.title}</h4>
            <p style="font-size: 13px; color: var(--slate-grey); margin-bottom: 15px;">PT Version</p>
            <div class="form-group">
                <label>Título (PT)</label>
                <input class="admin-input" data-pt="title" data-id="${id}" value="${ptArticle.title}" type="text">
            </div>
            <div class="form-group">
                <label>Resumo (PT)</label>
                <input class="admin-input" data-pt="summary" data-id="${id}" value="${ptArticle.summary}" type="text">
            </div>
            <div class="form-group">
                <label>Conteúdo (PT) - supports HTML</label>
                <textarea class="admin-textarea" data-pt="content" data-id="${id}" rows="6">${ptArticle.content}</textarea>
            </div>
            <p style="font-size: 13px; color: var(--slate-grey); margin: 20px 0 15px 0;">EN Version</p>
            <div class="form-group">
                <label>Title (EN)</label>
                <input class="admin-input" data-en="title" data-id="${id}" value="${enArticle.title || ''}" type="text">
            </div>
            <div class="form-group">
                <label>Summary (EN)</label>
                <input class="admin-input" data-en="summary" data-id="${id}" value="${enArticle.summary || ''}" type="text">
            </div>
            <div class="form-group">
                <label>Content (EN) - supports HTML</label>
                <textarea class="admin-textarea" data-en="content" data-id="${id}" rows="6">${enArticle.content || ''}</textarea>
            </div>
        `;
        container.appendChild(card);
    });
}

function getFormData() {
    const data = {
        pt: {
            site: {
                hero: {
                    title: document.getElementById('hero-pt-title').value,
                    subtitle: document.getElementById('hero-pt-subtitle').value,
                    buttonText: document.getElementById('hero-pt-btn').value
                },
                about: {
                    title: document.getElementById('about-pt-title').value,
                    content1: document.getElementById('about-pt-content1').value,
                    content2: document.getElementById('about-pt-content2').value
                },
                contact: {
                    title: document.getElementById('contact-pt-title').value,
                    text: document.getElementById('contact-pt-text').value,
                    phone: document.getElementById('contact-pt-phone').value,
                    email: document.getElementById('contact-pt-email').value
                }
            },
            nav: { home: 'Home', about: 'Sobre', articles: 'Artigos', contact: 'Contato', admin: 'Admin' }
        },
        en: {
            site: {
                hero: {
                    title: document.getElementById('hero-en-title').value,
                    subtitle: document.getElementById('hero-en-subtitle').value,
                    buttonText: document.getElementById('hero-en-btn').value
                },
                about: {
                    title: document.getElementById('about-en-title').value,
                    content1: document.getElementById('about-en-content1').value,
                    content2: document.getElementById('about-en-content2').value
                },
                contact: {
                    title: document.getElementById('contact-en-title').value,
                    text: document.getElementById('contact-en-text').value,
                    phone: document.getElementById('contact-en-phone').value,
                    email: document.getElementById('contact-en-email').value
                }
            },
            nav: { home: 'Home', about: 'About', articles: 'Articles', contact: 'Contact', admin: 'Admin' }
        },
        articles: []
    };

    const ptArticles = [];
    const enArticles = [];
    const articleIds = document.querySelectorAll('[data-pt="title"]');
    
    articleIds.forEach(input => {
        const id = input.getAttribute('data-id');
        ptArticles.push({
            id: id,
            title: document.querySelector(`[data-pt="title"][data-id="${id}"]`).value,
            summary: document.querySelector(`[data-pt="summary"][data-id="${id}"]`).value,
            content: document.querySelector(`[data-pt="content"][data-id="${id}"]`).value
        });
        enArticles.push({
            id: id,
            title: document.querySelector(`[data-en="title"][data-id="${id}"]`).value,
            summary: document.querySelector(`[data-en="summary"][data-id="${id}"]`).value,
            content: document.querySelector(`[data-en="content"][data-id="${id}"]`).value
        });
    });

    data.pt.articles = ptArticles;
    data.en.articles = enArticles;

    return data;
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
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
    });
});

async function showGithubPanel() {
    editorCard.classList.add('hidden');
    githubCard.classList.remove('hidden');
    await fetchFileSha();
}

function hideGithubPanel() {
    githubCard.classList.add('hidden');
    editorCard.classList.remove('hidden');
}

async function fetchFileSha() {
    try {
        const repoInfo = getRepoInfo();
        const response = await fetch(`${GITHUB_API}/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${repoInfo.path}`, {
            headers: { 'Authorization': 'token ' + localStorage.getItem('github_pat') }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('github-sha').value = data.sha;
        }
    } catch (err) {
        console.warn('Erro ao obter SHA:', err);
    }
}

function getRepoInfo() {
    const path = window.location.pathname;
    let owner = 'anomalyco';
    let repo = 'bioshieldstrategic';
    let contentPath = 'data/content.json';
    
    const match = path.match(/\/repos\/([^/]+)\/([^/]+)/);
    if (match) {
        owner = match[1];
        repo = match[2];
    }
    
    return { owner, repo, path: contentPath };
}

async function commitToGithub() {
    const pat = document.getElementById('github-pat').value.trim();
    const sha = document.getElementById('github-sha').value.trim();
    const statusDiv = document.getElementById('github-status');
    
    if (!pat) {
        statusDiv.innerHTML = '<p style="color: var(--security-red);">Por favor, insira o GitHub PAT.</p>';
        return;
    }

    statusDiv.innerHTML = '<p style="color: var(--slate-grey);">Enviando para o GitHub...</p>';

    if (pat) {
        localStorage.setItem('github_pat', pat);
    }

    const repoInfo = getRepoInfo();
    const content = getFormData();
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

    const commitData = {
        message: 'Update content.json via admin panel - ' + new Date().toISOString(),
        content: contentBase64
    };

    if (sha) {
        commitData.sha = sha;
    }

    try {
        const response = await fetch(`${GITHUB_API}/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${repoInfo.path}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'token ' + pat,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commitData)
        });

        if (response.ok) {
            statusDiv.innerHTML = '<p style="color: #22c55e; font-weight: bold;">Sucesso! O conteúdo foi publicado no GitHub.</p>';
            setTimeout(() => {
                hideGithubPanel();
                statusDiv.innerHTML = '';
            }, 2000);
        } else {
            const error = await response.json();
            statusDiv.innerHTML = `<p style="color: var(--security-red);">Erro: ${error.message || 'Falha ao fazer commit'}</p>`;
        }
    } catch (err) {
        statusDiv.innerHTML = `<p style="color: var(--security-red);">Erro de conexão: ${err.message}</p>`;
    }
}

loginButton.addEventListener('click', handleLogin);
exportButton.addEventListener('click', handleExport);
githubButton.addEventListener('click', showGithubPanel);
githubCommitBtn.addEventListener('click', commitToGithub);
githubCancelBtn.addEventListener('click', hideGithubPanel);