// ===== Language System =====
const langFlags = { en: '🇬🇧', fr: '🇫🇷', ar: '🇸🇦', ru: '🇷🇺', it: '🇮🇹', es: '🇪🇸', de: '🇩🇪' };
const langCodes = { en: 'EN', fr: 'FR', ar: 'AR', ru: 'RU', it: 'IT', es: 'ES', de: 'DE' };

function toggleLangDropdown() {
    document.getElementById('langDropdown').classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.lang-current') && !event.target.closest('.lang-current')) {
        const dropdowns = document.getElementsByClassName("lang-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function setLang(lang) {
    sessionStorage.setItem('rsds-lang', lang);
    
    // Update Dropdown UI if exists
    const flagEl = document.querySelector('.lang-flag');
    const codeEl = document.querySelector('.lang-code');
    if (flagEl && codeEl) {
        flagEl.textContent = langFlags[lang] || '🇬🇧';
        codeEl.textContent = langCodes[lang] || 'EN';
    }

    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }

    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) el.textContent = text;
    });

    // Update inner HTML for elements with data-*-html attributes
    document.querySelectorAll('[data-' + lang + '-html]').forEach(el => {
        const html = el.getAttribute('data-' + lang + '-html');
        if (html) el.innerHTML = html;
    });
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = sessionStorage.getItem('rsds-lang') || 'en';
    setLang(savedLang);
});

// ===== Choice Button Logic =====
function setupChoices() {
    document.querySelectorAll('.choices-row').forEach(row => {
        row.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                row.querySelectorAll('.choice-btn').forEach(b => {
                    b.classList.remove('selected-yes', 'selected-no');
                });
                const type = btn.dataset.choice;
                btn.classList.add(type === 'yes' ? 'selected-yes' : 'selected-no');

                // Trigger conditional logic
                const questionCard = btn.closest('.question-card') || btn.closest('.case-question');
                if (questionCard) {
                    const condId = questionCard.dataset.condition;
                    if (condId) {
                        const condSection = document.getElementById(condId);
                        if (condSection) {
                            if (type === 'yes') {
                                condSection.classList.add('visible');
                            } else {
                                condSection.classList.remove('visible');
                            }
                        }
                    }
                }

                updateProgress();
            });
        });
    });
}

// ===== Progress Bar =====
function updateProgress() {
    const allRows = document.querySelectorAll('.question-card .choices-row, .case-question .choices-row');
    const answeredRows = document.querySelectorAll('.question-card .choices-row .selected-yes, .question-card .choices-row .selected-no, .case-question .choices-row .selected-yes, .case-question .choices-row .selected-no');
    const total = allRows.length;
    const answered = new Set();
    answeredRows.forEach(btn => {
        const row = btn.closest('.choices-row');
        answered.add(row);
    });
    const pct = total > 0 ? (answered.size / total) * 100 : 0;
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = pct + '%';
}

// ===== Case Section Toggle =====
function toggleCase(header) {
    const section = header.closest('.case-section');
    section.classList.toggle('collapsed');
}

// ===== Acknowledgment =====
function acknowledge(btn) {
    btn.classList.add('acknowledged');
    const lang = sessionStorage.getItem('rsds-lang') || 'en';
    const texts = { 
        en: '✓ Acknowledged', 
        fr: '✓ Confirmé', 
        ar: '✓ تم الإقرار',
        ru: '✓ Подтверждено',
        it: '✓ Confermato',
        es: '✓ Confirmado',
        de: '✓ Bestätigt'
    };
    btn.textContent = texts[lang] || texts.en;

    const result = document.getElementById('result-section');
    if (result) {
        result.classList.add('visible');
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Dynamic Form Switching
    setTimeout(() => {
        const path = window.location.pathname;
        if (path.includes('medical-questionnaire.html')) {
            const hasYes = document.querySelector('.selected-yes');
            if (hasYes) {
                window.location.href = 'medical-examination.html';
            } else {
                window.location.href = 'liability-release.html';
            }
        } else if (path.includes('medical-examination.html')) {
            window.location.href = 'liability-release.html';
        } else if (path.includes('liability-release.html')) {
            window.location.href = 'cancellation-policy.html';
        }
    }, 2000);
}

// ===== Info Choice Toggle =====
function setupInfoChoices() {
    document.querySelectorAll('.info-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const parent = choice.closest('.info-choices');
            parent.querySelectorAll('.info-choice').forEach(c => c.classList.remove('selected'));
            choice.classList.add('selected');
        });
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupChoices();
    setupInfoChoices();
});
