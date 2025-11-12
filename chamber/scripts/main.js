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
const dataURL = 'data/members.json'; // Path to the JSON file

// Function to convert membership level number to string
const getMembershipLabel = (level) => {
    switch (level) {
        case 3:
            return 'Gold Member';
        case 2:
            return 'Silver Member';
        case 1:
            return 'Standard Member';
        default:
            return 'Associate';
    }
};

// Function to create and render the member cards/list items
const displayMembers = (members, viewType) => {
    memberContainer.innerHTML = ''; // Clear previous content
    memberContainer.className = ''; // Clear existing class
    memberContainer.classList.add(viewType); // Add the new view class

    members.forEach(member => {
        const card = document.createElement('section');
        card.classList.add('member-card');
        if (viewType === 'list') {
            card.classList.add('list-item');
        }

        const levelLabel = getMembershipLabel(member.membershiplevel);

        // HTML structure for both Card and List views
        // Card view relies on CSS to format the 'member-card' class
        // List view relies on CSS to format the 'list-item' class via grid
        card.innerHTML = `
            ${viewType === 'grid' ? `<img src="images/${member.imagefilename}" alt="${member.name} logo" loading="lazy">` : ''}
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank">${member.website.replace('https://', '')}</a></p>
            <p class="member-level">**${levelLabel}**</p>
            ${viewType === 'grid' ? `<p class="other-info">${member.otherinfo}</p>` : ''}
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
        memberContainer.innerHTML = '<p>Sorry, failed to load member data.</p>';
    }
}

// Start the process
getMemberData();