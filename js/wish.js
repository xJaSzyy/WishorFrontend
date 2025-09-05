const wishBaseUrl = 'http://localhost:5000/wish';

let page = 1;
let pageSize = 8;
let search = null;
let status = null;

let lastEditWish = null;

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
            if (response.status === 401) {
                window.location.href = 'auth.html';  
                return; 
            }
            
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

document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
});