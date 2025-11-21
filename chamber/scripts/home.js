// A. Navigation Toggle (Assuming this exists from prior file content)
document.getElementById('menu-toggle').addEventListener('click', function () {
    document.querySelector('.navigation').classList.toggle('open');
});

// B. Footer Dates (Assuming this exists from prior file content)
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;


// D. Dynamic Home Page Functionality (New section)
const spotlightContainer = document.getElementById('spotlight-container');
const weatherURL = 'https://api.openweathermap.org/data/2.5/';
const apiKey = 'de4b10b0d8683dca4c1d4824615e85d2';
const cityID = '233216';

//   the dataURL for the member data JSON file
const dataURL = 'data/members.json';


// --- D1. Random Member Spotlights ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to display member spotlight cards
const displaySpotlights = (members) => {
    if (!spotlightContainer) return;

    // Filter for Gold (3) and Silver (2) members
    const qualifiedMembers = members.filter(member => member.membershiplevel >= 2);

    // Shuffle and select the first 3
    const selectedMembers = shuffleArray(qualifiedMembers).slice(0, 3);

    spotlightContainer.innerHTML = '';

    selectedMembers.forEach(member => {
        const card = document.createElement('section');
        card.classList.add('member-card');
        card.innerHTML = `
            <img src="images/${member.imagefilename}" alt="${member.name} logo" loading="lazy">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank">${member.website.replace('https://', '')}</a></p>
            <p class="member-level ${member.membershiplevel === 3 ? 'gold-member' : 'silver-member'}">
                **${member.membershiplevel === 3 ? 'Gold Member' : 'Silver Member'}**
            </p>
        `;
        spotlightContainer.appendChild(card);
    });
};


// --- D2. OpenWeatherMap API Fetch (Current and 3-Day Forecast) ---
const lat = 0.44;
const lon = 33.20;

async function getWeather() {
    const currentDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast-container');

    if (!currentDiv && !forecastDiv) return;

    try {
        // Fetch current weather (by coordinates)
        const currentResponse = await fetch(`${weatherURL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        if (!currentResponse.ok) throw new Error(`Current weather fetch failed: ${currentResponse.status} ${currentResponse.statusText}`);
        const currentData = await currentResponse.json();

        // Fetch 5-day / 3-hour forecast (by coordinates)
        const forecastResponse = await fetch(`${weatherURL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        if (!forecastResponse.ok) throw new Error(`Forecast fetch failed: ${forecastResponse.status} ${forecastResponse.statusText}`);
        const forecastData = await forecastResponse.json();

        // Render
        if (currentDiv) displayCurrentWeather(currentData);
        if (forecastDiv) displayThreeDayForecast(forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (document.getElementById('current-weather')) {
            document.getElementById('current-weather').innerHTML = '<p>Weather data failed to load.</p>';
        }
        if (document.getElementById('forecast-container')) {
            document.getElementById('forecast-container').innerHTML = '<p>Forecast data failed to load.</p>';
        }
    }
}

function displayCurrentWeather(data) {
    const currentDiv = document.getElementById('current-weather');
    if (!currentDiv || !data || !data.main || !data.weather) return;

    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const humidity = data.main.humidity ?? 'N/A';

    //  timezone offset from API (seconds)
    const tz = data.timezone ?? 0;
    const sunrise = data.sys && data.sys.sunrise ? new Date((data.sys.sunrise + tz) * 1000) : null;
    const sunset = data.sys && data.sys.sunset ? new Date((data.sys.sunset + tz) * 1000) : null;
    const sunriseStr = sunrise ? sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : 'N/A';
    const sunsetStr = sunset ? sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) : 'N/A';

    currentDiv.innerHTML = `
        <div class="weather-details-container">
            <img src="${icon}" alt="${description} icon">
            <div class="weather-text">
                <p class="temp">${temp}°C</p>
                <p>${description}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Sunrise: ${sunriseStr}</p>
                <p>Sunset: ${sunsetStr}</p>
            </div>
        </div>
    `;
}

// Improved 3-day forecast selection: group by local day (uses forecast.city.timezone) and pick entry closest to noon
function displayThreeDayForecast(forecastData) {
    const forecastDiv = document.getElementById('forecast-container');
    if (!forecastDiv || !forecastData || !forecastData.list) return;

    const tz = forecastData.city && forecastData.city.timezone ? forecastData.city.timezone : 0;
    const groups = {};

    const nowLocalDayKey = new Date((Math.floor(Date.now() / 1000) + tz) * 1000).toISOString().split('T')[0];

    for (const item of forecastData.list) {
        const local = new Date((item.dt + tz) * 1000);
        const dayKey = local.toISOString().split('T')[0];
        if (dayKey === nowLocalDayKey) continue;
        if (!groups[dayKey]) groups[dayKey] = [];
        groups[dayKey].push({ item, hour: new Date((item.dt + tz) * 1000).getUTCHours() });
    }

    // Sort dayKeys ascending and pick first 3 days
    const dayKeys = Object.keys(groups).sort();
    const selectedKeys = dayKeys.slice(0, 3);

    if (selectedKeys.length === 0) {
        forecastDiv.innerHTML = '<p>Forecast data failed to load or is unavailable.</p>';
        return;
    }

    let htmlContent = '<div class="forecast-grid">';

    selectedKeys.forEach(dayKey => {
        const entries = groups[dayKey];
        let best = entries.reduce((acc, cur) => {
            const dist = Math.abs(cur.hour - 12);
            if (!acc || dist < acc.dist) return { item: cur.item, dist };
            return acc;
        }, null);

        const item = best.item;
        const date = new Date((item.dt + tz) * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(item.main.temp);

        htmlContent += `
            <div class="forecast-day">
                <p class="day-name">${dayName}</p>
                <p class="temp">${temp}°C</p>
            </div>
        `;
    });

    htmlContent += '</div>';
    forecastDiv.innerHTML = htmlContent;
}


// --- E. Combined Execution for Directory and Home Pages ---
async function initializePage() {
    try {
        const response = await fetch(dataURL); // Fetching JSON data for spotlights/directory
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const data = await response.json();

        // DIRECTORY PAGE LOGIC (Only runs if elements exist)
        const memberContainer = document.getElementById('member-container');
        if (memberContainer) {
            displayMembers(data, 'grid');
        }

        // HOME PAGE LOGIC (Only runs if elements exist)
        if (spotlightContainer) {
            displaySpotlights(data);
            getWeather();
        }

    } catch (error) {
        console.error('Error fetching or processing JSON data:', error);
        // Display error message on the respective page if the container exists
        const memberContainer = document.getElementById('member-container');
        if (memberContainer) {
            memberContainer.innerHTML = '<p>Sorry, failed to load member directory data.</p>';
        }
        if (spotlightContainer) {
            spotlightContainer.innerHTML = '<p>Sorry, failed to load member spotlights.</p>';
        }
        // If member data fails, we still want to attempt to load weather independently
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            getWeather();
        }
    }
}

// Start the process for the correct page
initializePage();

