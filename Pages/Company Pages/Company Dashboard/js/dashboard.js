document.addEventListener('DOMContentLoaded', () => {
    // --- EXISTING LOGIC (Sidebar, Navigation, Profile) ---

    // User Profile Dropdown Logic
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling to document
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });

        // Prevent closing when clicking inside the dropdown itself
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Sidebar Hover Logic (Optional enhancement)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            sidebar.classList.add('expanded');
        });
        sidebar.addEventListener('mouseleave', () => {
            sidebar.classList.remove('expanded');
        });
    }

    // Section Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.querySelector('.page-title h1');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const targetSectionId = item.getAttribute('data-section');
            const sectionName = item.querySelector('.link-text').textContent;

            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));

            // Add active class to clicked nav item
            item.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show target section
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update page title
            pageTitle.textContent = sectionName;
        });
    });

    // --- NEW DASHBOARD LOGIC ---

    // 1. Posts Status Pie Chart
    const ctx = document.getElementById('postsChart');
    if (ctx) {
        // Mock Data - Change these values to test "No Posts" state
        const activePosts = 1;
        const closedPosts = 1;
        const totalPosts = activePosts + closedPosts;

        // Update Legend Counts
        document.getElementById('activePostCount').textContent = activePosts;
        document.getElementById('closedPostCount').textContent = closedPosts;

        let chartData, chartColors;

        if (totalPosts === 0) {
            // No posts state: Gray chart
            chartData = [1]; // Dummy value to show full circle
            chartColors = ['#e0e0e0']; // Gray
        } else {
            chartData = [activePosts, closedPosts];
            chartColors = ['#10b981', '#ef4444']; // Green, Red
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: totalPosts === 0 ? ['No Posts'] : ['Active', 'Closed'],
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%', // Thickness of the ring
                plugins: {
                    legend: {
                        display: false // Custom legend used
                    },
                    tooltip: {
                        enabled: totalPosts !== 0 // Disable tooltip for "No Posts"
                    }
                }
            }
        });
    }

    // 2. Job Listing Summary Logic
    const jobListingBody = document.getElementById('jobListingBody');
    const modalJobListingBody = document.getElementById('modalJobListingBody');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const modal = document.getElementById('applicantsModal');
    const closeModal = document.querySelector('.close-modal');

    // Mock Data for Applicants
    const applicants = [
        { title: 'Senior UX Designer', name: 'Alice Johnson', date: '2025-10-28', status: 'Accepted' },
        { title: 'Full Stack Developer', name: 'Bob Smith', date: '2025-10-30', status: 'Rejected' },
        { title: 'Data Scientist', name: 'Charlie Brown', date: '2025-11-01', status: 'Pending' },
        { title: 'Frontend Developer', name: 'David Lee', date: '2025-11-02', status: 'Pending' },
        { title: 'Backend Engineer', name: 'Eva Green', date: '2025-10-25', status: 'Rejected' },
        { title: 'Product Manager', name: 'Frank White', date: '2025-11-03', status: 'Accepted' },
        { title: 'QA Engineer', name: 'Grace Hall', date: '2025-11-04', status: 'Pending' }
    ];

    // Sorting Logic: Pending/New top, Rejected bottom
    const statusOrder = {
        'Pending': 1,
        'Accepted': 2,
        'Rejected': 3
    };

    const sortedApplicants = applicants.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
    });

    // Function to render table rows
    function renderTable(data, container) {
        container.innerHTML = '';
        data.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.title}</td>
                <td>${app.name}</td>
                <td>${app.date}</td>
                <td><span class="status-pill ${app.status.toLowerCase()}">${app.status}</span></td>
            `;
            container.appendChild(row);
        });
    }

    // Render initial list (limit to first 5 for the dashboard view if needed, or show all scrollable)
    // The design implies a scrollable list, so we can render all sorted applicants.
    if (jobListingBody) {
        renderTable(sortedApplicants, jobListingBody);
    }

    // Modal Logic
    if (viewAllBtn && modal) {
        viewAllBtn.addEventListener('click', () => {
            renderTable(sortedApplicants, modalJobListingBody); // Render in modal
            modal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
