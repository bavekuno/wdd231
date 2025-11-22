// Function to set the current timestamp on form load
function setTimestamp() {
    const timestampField = document.getElementById('timestamp');
    // Get the current date and time 
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
}

document.getElementById('menu-toggle').addEventListener('click', function () {
    const navigation = document.querySelector('.navigation');
    navigation.classList.toggle('open'); 
});

// Close the navigation when a link is clicked
document.querySelectorAll('.navigation a').forEach(link => {
    link.addEventListener('click', function () {
        const navigation = document.querySelector('.navigation');
        navigation.classList.remove('open'); 
    });
});

// Close modal functionality (if needed)
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function () {
        const modal = button.closest('.modal');
        modal.style.display = 'none'; 
    });
});

// Function to handle modal functionality
function setupModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    // Open Modal
    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });

    // Close Modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Close Modal when user clicks outside the modal
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Initial page load functions
document.addEventListener('DOMContentLoaded', () => {
    setTimestamp();
    setupModals();
});