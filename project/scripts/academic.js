const container = document.getElementById('classes-container');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');
const url = 'data/classes.json';

async function getClasses() {
    const res = await fetch(url);
    const data = await res.json();
    displayClasses(data, 'grid');

    gridBtn.addEventListener('click', () => {
        displayClasses(data, 'grid');
        gridBtn.classList.add('active-view');
        listBtn.classList.remove('active-view');
    });

    listBtn.addEventListener('click', () => {
        displayClasses(data, 'list');
        listBtn.classList.add('active-view');
        gridBtn.classList.remove('active-view');
    });
}

// Fetch and display classes from classes.json
async function loadClasses() {
    const data = await res.json();

    displayClasses(data, 'grid');

}

// Keep only the complete two-argument display function
function displayClasses(classes, view) {
    container.className = view;
    container.innerHTML = classes.map
}

// Use the complete function for initial page load
document.addEventListener('DOMContentLoaded', loadClasses);

function displayClasses(classes, view) {
    container.className = view;
    container.innerHTML = classes.map(c => {
        const level = c.membershiplevel === 3 ? 'Advanced/Varsity' : c.membershiplevel === 2 ? 'Elective' : 'Core';
        const levelClass = c.membershiplevel === 3 ? 'gold-member' : c.membershiplevel === 2 ? 'silver-member' : 'standard-member';

        return `
        <section class="member-card ${view === 'list' ? 'list-item' : ''}">
            ${view === 'grid' ? `<img src="images/${c.imagefilename}" alt="${c.name}" loading="lazy">` : ''}
            <h3>${c.name}</h3>
            <p>Loc: ${c.address}</p>
            <p>Lead: ${c.phone}</p>
            <p><a href="${c.website}">Syllabus</a></p>
            <p class="member-level ${levelClass}">${level}</p>
            ${view === 'grid' ? `<p>${c.otherinfo}</p>` : ''}
        </section>`;
    }).join('');
}

getClasses();