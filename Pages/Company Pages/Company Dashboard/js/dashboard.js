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

    // ========================================
    // 3. JOB LISTINGS & MODAL
    // ========================================

    const jobListingBody = document.getElementById('jobListingBody');
    const modalJobListingBody = document.getElementById('modalJobListingBody');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const modal = document.getElementById('applicantsModal');
    const closeModal = document.querySelector('.close-modal');

    // Store fetched data globally for modal use
    let jobPostsData = [];

    // Sorting Logic: Active first, then Closed
    const statusOrder = {
        'Active': 1,
        'Closed': 2
    };

    function sortJobPosts(data) {
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
                        No job posts found
                    </td>
                </tr>
            `;
            return;
        }

        data.forEach(post => {
            const row = document.createElement('tr');
            // Determine status class for styling
            const statusClass = post.status.toLowerCase(); // 'active' or 'closed'

            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.applicants}</td>
                <td>${post.datePosted}</td>
                <td><span class="status-pill ${statusClass}">${post.status}</span></td>
            `;
            container.appendChild(row);
        });
    }



    // Modal Logic
    if (viewAllBtn && modal) {
        viewAllBtn.addEventListener('click', () => {
            // Sor the global data before rendering
            const sortedPosts = sortJobPosts([...jobPostsData]);
            renderTable(sortedPosts, modalJobListingBody);
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
     * @param {Array} posts - Array of job post objects
     * Example: updateJobListings([{ title: 'Developer', applicants: '3/10', datePosted: '2025-11-01', status: 'Active' }])
     */
    window.updateJobListings = function (posts) {
        jobPostsData = posts;
        const sorted = sortJobPosts([...posts]);
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
    // 5. BACKEND INTEGRATION
    // ========================================

    async function fetchDashboardData() {
        try {
            setLoadingState(true);

            const emailInput = document.getElementById('company_email');
            if (!emailInput || !emailInput.value) {
                console.warn('Company email not found');
                setLoadingState(false);
                return;
            }

            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_dashboard_data.php", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_email: emailInput.value })
            });

            const result = await response.json();

            if (result.status === "success") {
                const data = result.data;

                // 1. Update Recruitment Analytics
                window.updateRecruitmentAnalytics({
                    total: data.stats.total_applicants,
                    accepted: data.stats.accepted,
                    rejected: data.stats.rejected
                });

                // 2. Update Post Status Chart
                window.updatePostsChart(data.post_stats.active_count, data.post_stats.closed_count);

                // Update Total Center Count
                const totalPostsEl = document.getElementById('totalPostsCount');
                if (totalPostsEl) {
                    totalPostsEl.textContent = data.post_stats.total_posts;
                }

                // 3. Update Job Listings
                // Map backend fields to frontend expected format
                const tableData = data.recent_jobs.map(job => ({
                    title: job.title,
                    applicants: `${job.applicant_count}/${job.applicant_limit}`,
                    datePosted: job.date_posted,
                    status: job.status
                }));

                window.updateJobListings(tableData);

            } else {
                console.error('API Error:', result.message);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoadingState(false);
        }
    }

    // Initial Load
    fetchDashboardData();

    // ========================================
    // CONSOLE HELPERS (For Testing)
    // ========================================

    console.log('%c🎉 Dashboard Loaded Successfully!', 'color: #10b981; font-size: 14px; font-weight: bold;');
});
