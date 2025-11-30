// ========================================
// COMPANY DASHBOARD - MODERN IMPLEMENTATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. SIDEBAR & NAVIGATION
    // ========================================

    // User Profile Dropdown Logic
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });

        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Sidebar Hover Logic
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

    // ========================================
    // 2. CHART.JS - PIE CHART
    // ========================================

    let postsChartInstance = null;
    const ctx = document.getElementById('postsChart');

    // Initialize chart with default data
    function initializePostsChart(activePosts = 1, closedPosts = 1) {
        if (!ctx) return;

        const totalPosts = activePosts + closedPosts;

        // Update legend counts
        document.getElementById('activePostCount').textContent = activePosts;
        document.getElementById('closedPostCount').textContent = closedPosts;

        let chartData, chartColors;

        if (totalPosts === 0) {
            // No posts state: Gray chart
            chartData = [1];
            chartColors = ['#e0e0e0'];
        } else {
            chartData = [activePosts, closedPosts];
            chartColors = ['#10b981', '#ef4444']; // Green, Red
        }

        // Destroy existing chart if it exists
        if (postsChartInstance) {
            postsChartInstance.destroy();
        }

        postsChartInstance = new Chart(ctx, {
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
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: totalPosts !== 0
                    }
                }
            }
        });
    }

    // Initialize chart on page load
    initializePostsChart();

    // ========================================
    // 3. JOB LISTINGS & MODAL
    // ========================================

    const jobListingBody = document.getElementById('jobListingBody');
    const modalJobListingBody = document.getElementById('modalJobListingBody');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const modal = document.getElementById('applicantsModal');
    const closeModal = document.querySelector('.close-modal');

    // Mock Data for Applicants (Replace this with your backend data)
    let applicantsData = [
        { title: 'Senior UX Designer', name: 'Alice Johnson', date: '2025-10-28', status: 'Accepted' },
        { title: 'Full Stack Developer', name: 'Bob Smith', date: '2025-10-30', status: 'Rejected' },
        { title: 'Data Scientist', name: 'Charlie Brown', date: '2025-11-01', status: 'Pending' },
        { title: 'Frontend Developer', name: 'David Lee', date: '2025-11-02', status: 'Pending' },
        { title: 'Backend Engineer', name: 'Eva Green', date: '2025-10-25', status: 'Rejected' },
        { title: 'Product Manager', name: 'Frank White', date: '2025-11-03', status: 'Accepted' },
        { title: 'QA Engineer', name: 'Grace Hall', date: '2025-11-04', status: 'Pending' },
        { title: 'DevOps Engineer', name: 'Henry Wilson', date: '2025-11-05', status: 'Pending' },
        { title: 'UI Designer', name: 'Isabel Martinez', date: '2025-11-06', status: 'Accepted' }
    ];

    // Sorting Logic: Pending first, then Accepted, then Rejected
    const statusOrder = {
        'Pending': 1,
        'Accepted': 2,
        'Rejected': 3
    };

    function sortApplicants(data) {
        return data.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    // Render table rows
    function renderTable(data, container) {
        if (!container) return;

        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 30px; color: #999;">
                        No applicants found
                    </td>
                </tr>
            `;
            return;
        }

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

    // Initial render
    const sortedApplicants = sortApplicants(applicantsData);
    renderTable(sortedApplicants, jobListingBody);

    // Modal Logic
    if (viewAllBtn && modal) {
        viewAllBtn.addEventListener('click', () => {
            renderTable(sortedApplicants, modalJobListingBody);
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

    // ========================================
    // 4. DYNAMIC UPDATE FUNCTIONS
    // (For Backend Integration)
    // ========================================

    /**
     * Update Recruitment Analytics Cards
     * @param {Object} data - Object with total, accepted, rejected counts
     * Example: updateRecruitmentAnalytics({ total: 3500, accepted: 1200, rejected: 2300 })
     */
    window.updateRecruitmentAnalytics = function (data) {
        const totalEl = document.getElementById('totalApplications');
        const acceptedEl = document.getElementById('acceptedApplications');
        const rejectedEl = document.getElementById('rejectedApplications');

        if (totalEl) animateNumber(totalEl, data.total);
        if (acceptedEl) animateNumber(acceptedEl, data.accepted);
        if (rejectedEl) animateNumber(rejectedEl, data.rejected);
    };

    /**
     * Update Posts Pie Chart
     * @param {Number} activePosts - Number of active posts
     * @param {Number} closedPosts - Number of closed posts
     * Example: updatePostsChart(5, 3)
     */
    window.updatePostsChart = function (activePosts, closedPosts) {
        initializePostsChart(activePosts, closedPosts);
    };

    /**
     * Update Job Listings Table
     * @param {Array} applicants - Array of applicant objects
     * Example: updateJobListings([{ title: 'Developer', name: 'John', date: '2025-11-01', status: 'Pending' }])
     */
    window.updateJobListings = function (applicants) {
        applicantsData = applicants;
        const sorted = sortApplicants([...applicants]);
        renderTable(sorted, jobListingBody);
    };

    /**
     * Animate number count-up effect
     * @param {HTMLElement} element - Element to animate
     * @param {Number} targetValue - Target number to count to
     */
    function animateNumber(element, targetValue) {
        const duration = 1000; // 1 second
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const difference = targetValue - startValue;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuart)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (difference * easeOut));

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Display loading state
     * @param {Boolean} isLoading - Whether to show loading state
     */
    window.setLoadingState = function (isLoading) {
        const containers = [
            document.querySelector('.job-listings-panel'),
            document.querySelector('.pie-chart-section'),
            document.querySelector('.recruitment-metrics-section')
        ];

        containers.forEach(container => {
            if (container) {
                if (isLoading) {
                    container.style.opacity = '0.5';
                    container.style.pointerEvents = 'none';
                } else {
                    container.style.opacity = '1';
                    container.style.pointerEvents = 'auto';
                }
            }
        });
    };

    // ========================================
    // 5. EXAMPLE: BACKEND INTEGRATION USAGE
    // ========================================

    /*
    // Example: Fetch data from your PHP backend
    async function loadDashboardData() {
        try {
            setLoadingState(true);
            
            const response = await fetch('path/to/your/backend.php');
            const data = await response.json();
            
            // Update all dashboard components
            updateRecruitmentAnalytics({
                total: data.totalApplications,
                accepted: data.acceptedApplications,
                rejected: data.rejectedApplications
            });
            
            updatePostsChart(data.activePosts, data.closedPosts);
            updateJobListings(data.applicants);
            
            setLoadingState(false);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setLoadingState(false);
        }
    }
    
    // Call on page load
    // loadDashboardData();
    
    // Refresh every 30 seconds
    // setInterval(loadDashboardData, 30000);
    */

    // ========================================
    // CONSOLE HELPERS (For Testing)
    // ========================================

    console.log('%c🎉 Dashboard Loaded Successfully!', 'color: #10b981; font-size: 14px; font-weight: bold;');
    console.log('%cAvailable Functions:', 'color: #3b82f6; font-size: 12px; font-weight: bold;');
    console.log('• updateRecruitmentAnalytics({ total, accepted, rejected })');
    console.log('• updatePostsChart(activePosts, closedPosts)');
    console.log('• updateJobListings(applicantsArray)');
    console.log('• setLoadingState(true/false)');
    console.log('%cExample:', 'color: #f59e0b; font-size: 12px; font-weight: bold;');
    console.log("updateRecruitmentAnalytics({ total: 5000, accepted: 2000, rejected: 3000 })");
});
