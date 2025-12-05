// Timestamp
document.getElementById('timestamp').value = new Date().toISOString();

// Modals
document.querySelectorAll('.modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.modal).style.display = 'block';
    });
});
document.querySelectorAll('.close-button').forEach(span => {
    span.addEventListener('click', () => {
        span.closest('.modal').style.display = 'none';
    });
});
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
};