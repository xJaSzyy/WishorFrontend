const filterButtons = document.querySelectorAll('.filter-status');
const addButton = document.querySelector('.add-button');
const logoutButton = document.querySelector('.logout-button');
const retryBtn = document.getElementById('retryBtn');

let debounceTimer;

filterButtons.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButton.classList.add('active');

        status = filterButton.dataset.status === 'all' ? null : filterButton.dataset.status;

        page = 1;
        loadWishes();
    });
});

document.querySelector('.search-input').addEventListener('input', function() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        search = this.value;
        page = 1;
        loadWishes();
    }, 400);
});

addButton.addEventListener('click', () => {
    const form = document.querySelector('.add-form');
    
    form.querySelector('input[translate-id-placeholder="title"]').value = '';
    form.querySelector('input[translate-id-placeholder="description"]').value = '';
    form.querySelector('input[translate-id-placeholder="image"]').value = '';
    form.querySelector('select').value = '0';
    
    addPanel.showModal();
});

logoutButton.onclick = function(event) {
    event.preventDefault();

    localStorage.removeItem('token');

    window.location.href = 'auth.html';
}

retryBtn.onclick = () => {
    errorBox.classList.add('hidden');
    loadWishes();
};