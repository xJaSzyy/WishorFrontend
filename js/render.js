const errorBox = document.getElementById('errorBox');
const errorText = errorBox.querySelector('.error-text');

let currentLang = localStorage.getItem('lang') || 'en';

function createWishCard(wish) {
    const rootStyles = getComputedStyle(document.documentElement);
    let statusColorCssVar = '';
    switch (wish.status) {
        case 0: statusColorCssVar = '--color-new'; break;
        case 1: statusColorCssVar = '--color-favorite'; break;
        case 2: statusColorCssVar = '--color-done'; break;
    }

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.style.border = `2px solid ${rootStyles.getPropertyValue(statusColorCssVar).trim()}`;

    const title = document.createElement('label');
    title.className = 'wish-title';
    title.textContent = wish.title;

    const description = document.createElement('label');
    description.className = 'wish-description';
    description.textContent = (wish.description === null || wish.description.trim() === "") ? translations['card_description'] : wish.description;
    
    const image = document.createElement('img');
    image.className = 'wish-image';
    image.src = wish.image
    image.alt = wish.title;

    const status = document.createElement('label');
    status.className = 'wish-status';
    status.textContent = wish.status === 0 ? translations['new'] : wish.status === 1 ? translations['favorite'] : translations['done'];
    status.style.color = rootStyles.getPropertyValue(statusColorCssVar).trim();

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(image);
    card.appendChild(status);

    card.addEventListener('click', () => {
        loadEditPanel(wish);
    });

    return card;
}

function loadEditPanel(wish) {
    const form = document.querySelector('.edit-form');

    form.querySelector('input[translate-id-placeholder="title"]').value = wish.title;
    form.querySelector('input[translate-id-placeholder="description"]').value = wish.description;
    form.querySelector('input[translate-id-placeholder="image"]').value = wish.image;
    form.querySelector('select').value = wish.status;

    lastEditWish = wish;

    editPanel.showModal();
}

function renderPagination(maxPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= maxPage; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-button');

        if (i === page) {
            btn.classList.add('active');
        }

        btn.textContent = i.toString();
        btn.onclick = () => {
            page = i;
            loadWishes();
        };
        pagination.appendChild(btn);
    }
}

function showError(message) {
    errorText.textContent = message;
    errorBox.classList.remove('hidden');
}