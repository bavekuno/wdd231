// A. Responsive Navigation Toggle
const menuToggle = document.getElementById('menu-toggle');
const navigation = document.querySelector('.navigation');

menuToggle.addEventListener('click', () => {
    navigation.classList.toggle('open');
    menuToggle.textContent = navigation.classList.contains('open') ? '✕ Close' : '☰ Menu';
});

// B. Dynamic Footer Content
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// C. Directory Functionality
const memberContainer = document.getElementById('member-container');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');
const dataURL = 'data/clubs.json'; // Path to the JSON file is now 'clubs.json'

// Function to convert club category number to string
const getClubCategoryLabel = (category) => {
    switch (category) {
        case 3:
            return 'STEM Club';
        case 2:
            return 'Arts Club';
        case 1:
            return 'Service Club';
        default:
            return 'General Interest';
    }
};

// Function to create and render the club cards/list items
const displayMembers = (clubs, viewType) => {
    memberContainer.innerHTML = '';
    memberContainer.className = '';
    memberContainer.classList.add(viewType);


    clubs.forEach(club => {
        const card = document.createElement('section');
        card.classList.add('member-card');
        if (viewType === 'list') {
            card.classList.add('list-item');
        }

        // Use new function and data field
        const categoryLabel = getClubCategoryLabel(club.categorylevel);

        // HTML structure for both Card and List views
        card.innerHTML = `
            ${viewType === 'grid' ? `<img src="images/${club.imagefilename}" alt="${club.clubname} logo" loading="lazy">` : ''}
            <h3>${club.clubname}</h3>
            <p>Advisor: ${club.advisor}</p>
            <p>Meeting Time: ${club.meetingtime}</p>
            <p>Contact: <a href="mailto:${club.contactemail}" target="_blank">${club.contactemail}</a></p>
            <p class="member-level ${categoryLabel.split(' ')[0].toLowerCase()}-member">**${categoryLabel}**</p>
            ${viewType === 'grid' ? `<p class="other-info">${club.mission}</p>` : ''}
        `;

        memberContainer.appendChild(card);
    });
};

// Function to fetch data and initiate display
async function getMemberData() {
    try {
        const response = await fetch(dataURL);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const data = await response.json();

        // Initialize with default view (grid)
        displayMembers(data, 'grid');

        // Add event listeners for view toggling after data is loaded
        gridViewButton.addEventListener('click', () => {
            displayMembers(data, 'grid');
            gridViewButton.classList.add('active-view');
            listViewButton.classList.remove('active-view');
        });

        listViewButton.addEventListener('click', () => {
            displayMembers(data, 'list');
            listViewButton.classList.add('active-view');
            gridViewButton.classList.remove('active-view');
        });

    } catch (error) {
        console.error('Error fetching or processing JSON data:', error);
        memberContainer.innerHTML = '<p>Sorry, failed to load club data.</p>';
    }
}

// Start the process
getMemberData();