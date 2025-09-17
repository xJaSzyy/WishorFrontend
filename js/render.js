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
    description.textContent = (wish.description === null || wish.description.trim() === "") ? "No description" : wish.description;

    const image = document.createElement('img');
    image.className = 'wish-image';
    image.src = wish.image
    image.alt = wish.title;

    const status = document.createElement('label');
    status.className = 'wish-status';
    status.textContent = wish.status === 0 ? 'New' : wish.status === 1 ? 'Favorite' : 'Done';
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

    form.querySelector('input[placeholder="Title"]').value = wish.title;
    form.querySelector('input[placeholder="Description"]').value = wish.description;
    form.querySelector('input[placeholder="Image URL"]').value = wish.image;
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

function showError(container, message) {
    container.innerHTML = ''; 

    const errorBox = document.createElement('div');
    errorBox.style.border = '2px solid #e74c3c';
    errorBox.style.backgroundColor = '#fdecea';
    errorBox.style.color = '#c0392b';
    errorBox.style.padding = '1rem 1.2rem';
    errorBox.style.borderRadius = '12px';
    errorBox.style.display = 'flex';
    errorBox.style.flexDirection = 'column';
    errorBox.style.alignItems = 'center';
    errorBox.style.gap = '1rem';
    errorBox.style.fontWeight = '600';
    errorBox.style.userSelect = 'none';

    errorBox.style.margin = 'auto';  

    const icon = document.createElement('span');
    icon.textContent = '⚠️';
    icon.style.fontSize = '2rem';

    const text = document.createElement('div');
    text.textContent = message;
    text.style.textAlign = 'center';

    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry';
    retryBtn.style.backgroundColor = '#e74c3c';
    retryBtn.style.color = '#fff';
    retryBtn.style.border = 'none';
    retryBtn.style.borderRadius = '8px';
    retryBtn.style.padding = '0.4rem 1.2rem';
    retryBtn.style.cursor = 'pointer';
    retryBtn.style.fontWeight = '700';
    retryBtn.style.transition = 'background-color 0.3s ease';

    retryBtn.addEventListener('mouseenter', () => {
        retryBtn.style.backgroundColor = '#c0392b';
    });
    retryBtn.addEventListener('mouseleave', () => {
        retryBtn.style.backgroundColor = '#e74c3c';
    });
    retryBtn.onclick = () => {
        loadWishes();
    };

    errorBox.appendChild(icon);
    errorBox.appendChild(text);
    errorBox.appendChild(retryBtn);

    container.appendChild(errorBox);
}