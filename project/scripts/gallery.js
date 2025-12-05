import { galleryItems } from '../data/gallery.mjs';

const galleryGrid = document.getElementById('gallery-grid');
const messageElement = document.getElementById('visitor-message');
const lastVisitKey = 'vhs-last-visit';

// 1. Render Gallery
if (galleryGrid) {
    galleryGrid.innerHTML = galleryItems.map(item => `
        <section class="place-card">
            <h2>${item.title}</h2>
            <figure><img src="${item.image}" alt="${item.title}" loading="lazy"></figure>
            <p>${item.description}</p>
            <button onclick="alert('Located at: ${item.address}')">Locate</button>
        </section>
    `).join('');
}

// 2. Visitor Logic
if (messageElement) {
    const now = Date.now();
    const lastVisit = localStorage.getItem(lastVisitKey);

    if (!lastVisit) {
        messageElement.textContent = "Welcome to Volcano High! Enjoy the tour.";
    } else {
        const diffDays = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
        if (diffDays < 1) messageElement.textContent = "Back so soon? Great to see you!";
        else messageElement.textContent = `You last visited ${diffDays} day${diffDays > 1 ? 's' : ''} ago.`;
    }
    localStorage.setItem(lastVisitKey, now);
}