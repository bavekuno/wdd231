// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';

            nav.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', !expanded);
        });
    }

    // Current year
    document.getElementById('currentyear').textContent = new Date().getFullYear();
});

// Get document last modified date and set it in the footer
const lastModifiedP = document.getElementById('lastModified');
if (lastModifiedP) {
    lastModifiedP.textContent = `Last modified: ${document.lastModified}`;
}

// Course data
const courses = [
    { code: "WDD 130", title: "Web Fundamentals", credits: 2, completed: true, type: "WDD" },
    { code: "CSE 110", title: "Programming Building Blocks", credits: 2, completed: true, type: "CSE" },
    { code: "WDD 131", title: "Dynamic Web Fundamentals", credits: 2, completed: true, type: "WDD" },
    { code: "CSE 111", title: "Programming with Functions", credits: 2, completed: true, type: "CSE" },
    { code: "WDD 231", title: "Frontend Web Development I", credits: 2, completed: false, type: "WDD" },
];

const grid = document.getElementById('courseGrid');
const totalEl = document.getElementById('totalCredits');

function renderCourses(list) {
    grid.innerHTML = '';
    list.forEach(c => {
        const card = document.createElement('div');
        card.className = `course-card ${c.completed ? 'completed' : 'in-progress'}`;

        // Status label with color
        const status = c.completed
            ? '<span class="status status-completed">Completed</span>'
            : '<span class="status status-inprogress">In Progress</span>';

        card.innerHTML = `
            <strong>${c.code}</strong><br>
            ${c.title}<br>
            Credits: ${c.credits}<br>
            ${status}
        `;
        grid.appendChild(card);
    });

    const total = list.reduce((sum, c) => sum + c.credits, 0);
    totalEl.textContent = total;
}

function filterCourses(type) {
    let filtered = courses;
    if (type !== 'all') {
        filtered = courses.filter(c => c.type === type);
    }
    renderCourses(filtered);
}

// Initial render
renderCourses(courses);

// Button listeners
document.querySelectorAll('.filter-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-buttons button.active')?.classList.remove('active');
        btn.classList.add('active');
        filterCourses(btn.dataset.filter);
    });
});