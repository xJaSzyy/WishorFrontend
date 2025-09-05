const buttons = document.querySelectorAll('.filter-status');
const addButton = document.querySelector('.add-button');
const logoutButton = document.querySelector('.logout-button');

let debounceTimer;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        status = button.dataset.status === 'all' ? null : button.dataset.status;

        loadWishes();
    });
});

document.querySelector('.search-input').addEventListener('input', function() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        search = this.value;
        loadWishes();
    }, 400);
});

addButton.addEventListener('click', () => {
    addPanel.showModal();
});

logoutButton.onclick = function(event) {
    event.preventDefault();

    localStorage.removeItem('token');

    window.location.href = 'auth.html';
}