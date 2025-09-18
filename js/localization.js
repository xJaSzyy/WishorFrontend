const buttonRu = document.getElementById('btn-ru');
const buttonEn = document.getElementById('btn-en');

let translations = null;

buttonRu.onclick = async () => {
    if (currentLang === 'ru') {
        return;
    }
    
    await switchLanguage('ru');
    buttonEn.classList.remove('active');
    buttonRu.classList.add('active');
    if (document.getElementById('wish-list')) {
        loadWishes();
    }
};

buttonEn.onclick = async () => {
    if (currentLang === 'en') {
        return;
    }
    
    await switchLanguage('en')
    buttonRu.classList.remove('active');
    buttonEn.classList.add('active');
    if (document.getElementById('wish-list')) {
        loadWishes();
    }
};

function applyLocalization(translations) {
    document.querySelectorAll('[translate-id]').forEach(el => {
        const key = el.getAttribute('translate-id');
        if (translations[key]) el.textContent = translations[key];
    });

    document.querySelectorAll('[translate-id-placeholder]').forEach(el => {
        const key = el.getAttribute('translate-id-placeholder');
        if (translations[key]) el.placeholder = translations[key];
    });
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`../locales/${lang}.json`);
        if (!response.ok) throw new Error('Ошибка загрузки переводов');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function switchLanguage(lang) {
    translations = await loadTranslations(lang);
    if (translations) {
        applyLocalization(translations);
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const lang = localStorage.getItem('lang');
    if (lang != null) {
        buttonEn.classList.remove('active');
        buttonRu.classList.remove('active');
        
        const button = lang === 'en' ? buttonEn : buttonRu;
        button.classList.add('active');
        await switchLanguage(lang);
    }
});