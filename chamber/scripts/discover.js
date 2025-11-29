// Import the places array from the data module
import { places } from '../data/places.mjs';

// --- 1. Places Card Generation ---
const placesGrid = document.getElementById('places-grid');

function displayPlaces(placesList) {
    if (!placesGrid) return;

    placesGrid.innerHTML = '';  

    placesList.forEach(place => {
        // Create card container
        const card = document.createElement('section');
        card.classList.add('place-card');

        // Construct HTML content
        card.innerHTML = `
            <h2>${place.title}</h2>
            <figure>
                <img src="${place.image}" alt="${place.title}" width="300" height="200" loading="lazy">
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button onclick="alert('Thank you for your interest in ${place.title}!')">Learn More</button>
        `;

        placesGrid.appendChild(card);
    });
}

// Initialize Display
displayPlaces(places);


//  2. Visitor Message Logic (localStorage)
const messageElement = document.getElementById('visitor-message');
const lastVisitKey = 'last-visit-timestamp';

function handleVisitorMessage() {
    if (!messageElement) return;

    const now = Date.now();
    const storedValue = localStorage.getItem(lastVisitKey);

    if (!storedValue) {
        // Case 1: First visit
        messageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisit = parseInt(storedValue, 10);
        const diffMs = now - lastVisit;
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (diffMs < oneDayMs) {
            // Case 2: Less than a day
            messageElement.textContent = "Back so soon! Awesome!";
        } else {
            // Case 3: More than a day
            const daysAgo = Math.floor(diffMs / oneDayMs);
            const dayString = daysAgo === 1 ? "day" : "days";
            messageElement.textContent = `You last visited ${daysAgo} ${dayString} ago.`;
        }
    }

    // Store the current timestamp for the next visit
    localStorage.setItem(lastVisitKey, now.toString());
}

// Run visitor logic
handleVisitorMessage();