const authBaseUrl = 'http://localhost:5000/auth';

function login(username, password) {
    const data = {
        username: username,
        password: password
    };

    const url = authBaseUrl + '/login';
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    loginErrorMessage.textContent = err.errorMessage || 'Ошибка авторизации';
                    throw new Error(err.errorMessage || 'Ошибка авторизации');
                });
            }
            return response.json();
        })
        .then(result => {
            localStorage.setItem('token', result.content.token);
            window.location.href = 'wish.html';
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function register(username, password) {
    const data = {
        username: username,
        password: password
    };

    const url = authBaseUrl + '/register';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    registerErrorMessage.textContent = err.errorMessage || 'Ошибка авторизации';
                    throw new Error(err.errorMessage || 'Ошибка авторизации');
                });
            }
            return response.json();
        })
        .then(result => {
            login(username, password);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

document.getElementById('login-form').onsubmit = function(event) {
    event.preventDefault(); 
    const username = this.username.value;
    const password = this.password.value;

    login(username, password);
};

document.getElementById('register-form').onsubmit = function(event) {
    event.preventDefault();
    const username = this.username.value;
    const password = this.password.value;

    register(username, password);
};

const loginErrorMessage = document.getElementById('login-error-message')
const registerErrorMessage = document.getElementById('register-error-message')
const loginDialog = document.getElementById('login-tab');
const registerDialog = document.getElementById('register-tab');
const loginTabButton = document.querySelector('.login-tab-button');
const registerTabButton = document.querySelector('.register-tab-button');

function setActiveTab(buttonToActivate) {
    loginTabButton.classList.remove('active');
    registerTabButton.classList.remove('active');
    buttonToActivate.classList.add('active');
}

loginTabButton.addEventListener('click', () => {
    registerDialog.close();
    loginDialog.show();
    setActiveTab(loginTabButton);
});

registerTabButton.addEventListener('click', () => {
    loginDialog.close();
    registerDialog.show();
    setActiveTab(registerTabButton);
});

// Изначально активна вкладка Login
setActiveTab(loginTabButton);

