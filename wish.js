const wishBaseUrl = 'http://localhost:5000/wish';

let page = 1;
let pageSize = 4;
let search = null;
let status = null;

let lastEditWish = null;

/* api */

function loadWishes() {
    const container = document.getElementById('wish-list');
    container.textContent = 'Загрузка...';

    const url = new URL(wishBaseUrl);
    const params = new URLSearchParams({
        Page: page,
        PageSize: pageSize
    });

    if (search !== null) {
        params.append('Search', search);
    }
    if (status !== null) {
        params.append('Status', status);
    }

    url.search = params.toString();

    const token = localStorage.getItem('token');

    fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки данных');
            }
            return response.json();
        })
        .then(data => {
            container.textContent = '';
            
            renderPagination(data.content.maxPage);
            
            data.content.wishes.forEach(wish => {
                const wishCard = createWishCard(wish);
                container.appendChild(wishCard);
            });
        })
        .catch(error => {
            container.textContent = 'Ошибка при загрузке желаний: ' + error.message;
        });
}

function addWish(title, description, image, status) {
    const body = {
        title: title,
        description: description === "" ? null : description,
        image: image === "" ? null : image,
        status: Number(status)
    };

    Object.keys(body).forEach(key => body[key] === null && delete body[key]);

    const token = localStorage.getItem('token');

    return fetch(wishBaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.statusText}`);
            }
            loadWishes();
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка при отправке POST запроса:', error);
            throw error;
        });
}

function editWish(title, description, image, status) {
    const body = {
        id: lastEditWish.id,
        title: title,
        description: description,
        image: image,
        status: Number(status)
    };

    const token = localStorage.getItem('token');

    return fetch(wishBaseUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.statusText}`);
            }
            loadWishes();
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка при отправке PUT запроса:', error);
            throw error;
        });
}

function deleteWish() {
    const url = wishBaseUrl + `/${lastEditWish.id}`;

    const token = localStorage.getItem('token');
    
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.statusText}`);
            }
            loadWishes();
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка при отправке DELETE запроса:', error);
            throw error;
        });
}

/* functions */

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

let debounceTimer;
document.querySelector('.search-input').addEventListener('input', function() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        search = this.value;
        loadWishes();
    }, 400);
});

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

/* filter */

const buttons = document.querySelectorAll('.filter-status');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        status = button.dataset.status === 'all' ? null : button.dataset.status;

        loadWishes();
    });
});

/* panels */

const addButton = document.querySelector('.add-button');
const addPanel = document.getElementById('add-panel');
const editPanel = document.getElementById('edit-panel');

addButton.addEventListener('click', () => {
    addPanel.showModal();
});

/* form buttons */

const addFormButton = document.querySelector('.add-form-button');
const editFormButton = document.querySelector('.edit-form-button');
const deleteFormButton = document.querySelector('.delete-form-button');

addFormButton.onclick = function(event) {
    event.preventDefault();

    const form = document.querySelector('.add-form');

    const title = form.querySelector('input[placeholder="Title"]').value;
    const description = form.querySelector('input[placeholder="Description"]').value;
    const image = form.querySelector('input[placeholder="Image URL"]').value;
    const status = form.querySelector('select').value;

    addWish(title, description, image, status);
    
    addPanel.close();
}

editFormButton.onclick = function(event) {
    event.preventDefault();

    const form = document.querySelector('.edit-form');

    const title = form.querySelector('input[placeholder="Title"]').value;
    const description = form.querySelector('input[placeholder="Description"]').value;
    const image = form.querySelector('input[placeholder="Image URL"]').value;
    const status = form.querySelector('select').value;

    editWish(title, description, image, status);
    
    editPanel.close();
};

deleteFormButton.onclick = function(event) {
    event.preventDefault();
    
    deleteWish();
    
    editPanel.close();
};

document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
});