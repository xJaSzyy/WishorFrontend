const addPanel = document.getElementById('add-panel');
const editPanel = document.getElementById('edit-panel');

const addFormButton = document.querySelector('.add-form-button');
const editFormButton = document.querySelector('.edit-form-button');
const deleteFormButton = document.querySelector('.delete-form-button');


addFormButton.onclick = function(event) {
    event.preventDefault();

    const form = document.querySelector('.add-form');

    const title = form.querySelector('input[translate-id-placeholder="title"]').value;
    const description = form.querySelector('input[translate-id-placeholder="description"]').value;
    const image = form.querySelector('input[translate-id-placeholder="image"]').value;
    const status = form.querySelector('select').value;

    addWish(title, description, image, status);

    addPanel.close();
}

editFormButton.onclick = function(event) {
    event.preventDefault();

    const form = document.querySelector('.edit-form');

    const title = form.querySelector('input[translate-id-placeholder="title"]').value;
    const description = form.querySelector('input[translate-id-placeholder="description"]').value;
    const image = form.querySelector('input[translate-id-placeholder="image URL"]').value;
    const status = form.querySelector('select').value;

    editWish(title, description, image, status);

    editPanel.close();
};

deleteFormButton.onclick = function(event) {
    event.preventDefault();

    deleteWish();

    editPanel.close();
};