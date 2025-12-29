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
    function initializePostsChart(activePosts = 0, closedPosts = 0) {
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
                    <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
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

            // Handle potential key variations (snake_case vs camelCase)
            const appCount = post.applicant_count !== undefined ? post.applicant_count : (post.applicants || 0);
            const pendingCount = post.pending_count !== undefined ? post.pending_count : 0;
            const appLimit = post.applicant_limit !== undefined ? post.applicant_limit : (post.limit || 0); // Handle limit if legacy
            const datePosted = post.date_posted || post.datePosted || 'N/A';
            const displayApplicants = appLimit ? `${appCount}/${appLimit}` : appCount;

            row.innerHTML = `
                <td>${post.title}</td>
                <td>${displayApplicants}</td>
                <td>${pendingCount}</td>
                <td>${datePosted}</td>
                <td><span class="status-pill ${statusClass}">${post.status}</span></td>
            `;

            // Add click redirect
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                window.location.href = `../../Job Listing Page/php/job_listing.php?post_id=${post.id}&view=detail`;
            });

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

                // 1. Update Post Status Chart and Counts
                window.updatePostsChart(data.post_stats.active_count, data.post_stats.closed_count);

                // Update Total Center Count (if element exists)
                const totalPostsEl = document.getElementById('totalPostsCount');
                if (totalPostsEl) {
                    totalPostsEl.textContent = data.post_stats.total_posts;
                }

                // 2. Update Job Listings Table
                const tableData = data.recent_jobs.map(job => ({
                    id: job.id,
                    title: job.title,
                    applicants: `${job.applicant_count}/${job.applicant_limit}`,
                    datePosted: job.date_posted,
                    status: job.status,
                    pending_count: job.pending_count
                }));

                window.updateJobListings(tableData);

                // ========================================
                // 3. UPDATE HERO SECTION QUICK STATS
                // ========================================
                const heroOpenJobs = document.getElementById('heroOpenJobs');
                const heroPending = document.getElementById('heroPending');

                if (heroOpenJobs) {
                    animateNumber(heroOpenJobs, data.stats.open_slots || 0);
                }
                if (heroPending) {
                    animateNumber(heroPending, data.stats.pending || 0);
                }

                // ========================================
                // 4. UPDATE NEW METRICS GRID (Recruitment Stats)
                // ========================================
                const metricTotalApplicants = document.getElementById('metricTotalApplicants');
                const metricAccepted = document.getElementById('metricAccepted');
                const metricRejected = document.getElementById('metricRejected');

                if (metricTotalApplicants) {
                    animateNumber(metricTotalApplicants, data.stats.total_applicants);
                }
                if (metricAccepted) {
                    animateNumber(metricAccepted, data.stats.accepted);
                }
                if (metricRejected) {
                    animateNumber(metricRejected, data.stats.rejected);
                }

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
    // 6. ACTIVITY LOG
    // ========================================

    /**
     * Load activity logs from API
     * @param {Number} companyId - The company ID
     */
    async function loadActivityLogs(companyId) {
        const timeline = document.getElementById('activityLogTimeline');
        const logCount = document.getElementById('logCount');

        if (!timeline) return;

        try {
            const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_activity_log.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_id: companyId,
                    limit: 20
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                displayActivityLogs(result.activities);
                if (logCount) {
                    logCount.textContent = result.activities.length;
                }
            } else {
                timeline.innerHTML = `
                    <div class="error-state">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                        <p>${result.message || 'Failed to load activity logs'}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading activity logs:', error);
            timeline.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>Error loading activity logs</p>
                </div>
            `;
        }
    }

    /**
     * Format timestamp to relative time
     * @param {String} timestamp - Database timestamp
     * @returns {String} - Relative time string
     */
    /**
     * Format timestamp to relative time (Philippine Time - UTC+8)
     * Handles UTC timestamps from DB and converts to local relative time
     * @param {String} timestamp - Database timestamp (UTC)
     * @returns {String} - Relative time string
     */
    function formatTimestamp(timestamp) {
        // DB returns UTC time strings (e.g. "2023-12-12 14:00:00")
        // We need to parse this as UTC
        // Appending 'Z' tells Date.parse it's UTC
        let utcDate;
        if (typeof timestamp === 'string') {
            // Replace space with T to handle "YYYY-MM-DD HH:MM:SS" format
            let isoString = timestamp.replace(' ', 'T');
            // If it doesn't end in Z, append specific UTC offset or Z.
            // Assuming DB stores in UTC without timezone info:
            if (!isoString.endsWith('Z')) {
                isoString += 'Z';
            }
            utcDate = new Date(isoString);
        } else {
            utcDate = new Date(timestamp);
        }

        const now = new Date(); // Current local client time
        const diffMs = now - utcDate; // Difference in milliseconds

        // Debugging logs (optional, remove in prod)
        // console.log("DB Timestamp (UTC):", timestamp);
        // console.log("Parsed Date (Local):", utcDate.toString());
        // console.log("Current Time (Local):", now.toString());

        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMs < 0) return 'Just now'; // Handle slight clock skew
        if (diffMins < 1) return 'Just now';

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        }

        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }

        if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }

        // For older dates, show localized date string
        return utcDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Get icon class for action type
     * @param {String} actionType - CREATE, UPDATE, or DELETE
     * @returns {String} - Font Awesome icon class
     */
    function getIconForAction(actionType) {
        switch (actionType.toUpperCase()) {
            case 'CREATE':
                return 'fa-solid fa-plus-circle';
            case 'UPDATE':
                return 'fa-solid fa-edit';
            case 'DELETE':
                return 'fa-solid fa-trash';
            default:
                return 'fa-solid fa-circle';
        }
    }

    /**
     * Create HTML for a single log item
     * @param {Object} log - Log entry object
     * @returns {String} - HTML string
     */
    function createLogItemHTML(log) {
        const icon = getIconForAction(log.action_type);
        const actionClass = log.action_type.toLowerCase();

        // Use action_description if available, otherwise build from field changes
        let actionText = log.action_description;
        if (!actionText && log.field_name) {
            actionText = `Updated ${log.table_affected}`;
        } else if (!actionText) {
            actionText = `${log.action_type} ${log.table_affected}`;
        }

        // Build details section if field changes exist
        let detailsHTML = '';
        if (log.field_name && log.old_value && log.new_value) {
            detailsHTML = `
                <div class="log-details">
                    Changed <span class="log-field">${log.field_name}</span>
                    from <span class="log-value old">${log.old_value}</span>
                    to <span class="log-value new">${log.new_value}</span>
                </div>
            `;
        }

        return `
            <div class="audit-log-item">
                <div class="log-icon ${actionClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="log-content">
                    <div class="log-header">
                        <span class="log-action">${actionText}</span>
                        <span class="log-timestamp">${formatTimestamp(log.action_timestamp)}</span>
                    </div>
                    ${detailsHTML}
                </div>
            </div>
        `;
    }

    /**
     * Display activity logs in timeline
     * @param {Array} logs - Array of log objects
     */
    function displayActivityLogs(logs) {
        const timeline = document.getElementById('activityLogTimeline');
        if (!timeline) return;

        if (!logs || logs.length === 0) {
            timeline.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clipboard-list"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        timeline.innerHTML = logs.map(createLogItemHTML).join('');
    }

    // Load activity logs on dashboard load
    // Get company_id from hidden input or fetch from API
    const emailInput = document.getElementById('company_email');
    if (emailInput && emailInput.value) {
        // Fetch company_id and then load activity logs
        fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/get_company_id.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value })
        })
            .then(response => response.json())
            .then(result => {
                if (result.company_id) {
                    loadActivityLogs(result.company_id);
                }
            })
            .catch(error => console.error('Error fetching company ID:', error));
    }

    // ========================================
    // 7. SIGN OUT
    // ========================================

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/logout.php', {
                    method: 'POST',
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Redirect to landing page
                    window.location.href = '../../../Landing Page Tailwind/php/index.php';
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect even if API fails
                window.location.href = '../../../Landing Page Tailwind/php/index.php';
            }
        });
    }

    // ========================================
    // CONSOLE HELPERS (For Testing)
    // ========================================

    console.log('%c🎉 Dashboard Loaded Successfully!', 'color: #10b981; font-size: 14px; font-weight: bold;');
});
