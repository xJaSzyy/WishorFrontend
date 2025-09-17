const buttonRu = document.getElementById('btn-ru');
const buttonEn = document.getElementById('btn-en');

buttonRu.onclick = async () => {
    await switchLanguage('ru');
    buttonEn.classList.remove('active');
    buttonRu.classList.add('active');
    
};
buttonEn.onclick = async () => {
    await switchLanguage('en')
    buttonRu.classList.remove('active');
    buttonEn.classList.add('active');
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
    console.log(lang);
    const translations = await loadTranslations(lang);
    if (translations) {
        applyLocalization(translations);
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }
}