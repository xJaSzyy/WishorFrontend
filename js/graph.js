const wishesButton = document.querySelector('.wishes-button');

wishesButton.onclick = function(event) {
    event.preventDefault();

    window.location.href = 'wish.html';
}
