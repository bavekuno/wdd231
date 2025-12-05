const spotlightContainer = document.getElementById('spotlight-container');
const weatherURL = 'https://api.openweathermap.org/data/2.5/';
const apiKey = 'de4b10b0d8683dca4c1d4824615e85d2'; 
const lat = 0.44; const lon = 33.20;  
const dataURL = 'data/classes.json';

// Weather Logic
async function getWeather() {
    try {
        const [curRes, forRes] = await Promise.all([
            fetch(`${weatherURL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
            fetch(`${weatherURL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        ]);
        if (curRes.ok) displayCurrentWeather(await curRes.json());
        if (forRes.ok) displayThreeDayForecast(await forRes.json());
    } catch (e) { console.error('Weather Error', e); }
}

function displayCurrentWeather(data) {
    const div = document.getElementById('current-weather');
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    div.innerHTML = `
        <div class="weather-details-container">
            <img src="${icon}" alt="${data.weather[0].description}">
            <div><p class="temp">${Math.round(data.main.temp)}°C</p><p>${data.weather[0].description}</p></div>
        </div>`;
}

function displayThreeDayForecast(data) {
    const div = document.getElementById('forecast-container');
    const list = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
    div.innerHTML = `<div class="forecast-grid">${list.map(day => `
        <div class="forecast-day">
            <p>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p>${Math.round(day.main.temp)}°C</p>
        </div>`).join('')}</div>`;
}

// Spotlight Logic
async function loadSpotlights() {
    if (!spotlightContainer) return;
    const response = await fetch(dataURL);
    const data = await response.json();
    // Filter for Level 3 (AP/Gold) and Level 2 (Silver)
    const featured = data.filter(i => i.membershiplevel >= 2).sort(() => 0.5 - Math.random()).slice(0, 3);

    spotlightContainer.innerHTML = featured.map(item => `
        <section class="member-card">
            <h3>${item.name}</h3>
            <p>${item.phone}</p>
            <p class="member-level ${item.membershiplevel === 3 ? 'gold-member' : 'silver-member'}">
                ${item.membershiplevel === 3 ? 'Elite Program' : 'Standard Course'}
            </p>
            <a href="${item.website}">View Syllabus</a>
        </section>
    `).join('');
}

getWeather();
loadSpotlights();