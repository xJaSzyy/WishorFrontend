function createWishCard(wish) {
    const card = document.createElement('div');
    card.className = 'wish-card';

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