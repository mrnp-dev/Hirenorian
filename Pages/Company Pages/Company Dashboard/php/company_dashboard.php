<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Company Dashboard</title>
    <link rel="stylesheet" href="../css/dashboard.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <img src="https://dhvsu.edu.ph/images/about_pampanga_state_u/pampanga-state-u-logo-small.png"
                    alt="Pampanga State University" class="logo-icon">
                <!-- Placeholder path -->
                <span class="logo-text">Hirenorian</span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item active" data-section="dashboard-section">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-table-columns"></i>
                        <span class="link-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item" data-section="company-deets-section">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span class="link-text">Company Deets</span>
                    </a>
                </li>
                <li class="nav-item" data-section="applicants-manager-section">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="link-text">Applicants Manager</span>
                    </a>
                </li>
                <li class="nav-item" data-section="company-info-section">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Company Info</span>
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfile">
                    <div class="user-info">
                        <div class="user-avatar">
                            <!-- Placeholder for user image -->
                        </div>
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item">Sign Out</a>
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <div class="page-title">
                    <h1>Dashboard</h1>
                </div>

                <!-- Dashboard Section -->
                <section id="dashboard-section" class="content-section active">
                    <!-- Modern 2-Column Dashboard Layout -->
                    <div class="dashboard-main-container">
                        <!-- Left Column: Job Listings (75% width) -->
                        <div class="job-listings-panel">
                            <div class="section-header">
                                <h2>Job Listing Summary</h2>
                                <button class="btn-view-all" id="viewAllBtn">
                                    <i class="fa-solid fa-list"></i>
                                    View All Applicants
                                </button>
                            </div>
                            <div class="job-listing-container">
                                <table class="job-listing-table">
                                    <thead>
                                        <tr>
                                            <th>JOB TITLE</th>
                                            <th>APPLICANT'S NAME</th>
                                            <th>DATE APPLIED</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody id="jobListingBody">
                                        <!-- Populated by JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Right Column: Analytics Panel (25% width) -->
                        <div class="analytics-panel">
                            <!-- Top Section: Pie Chart (35% height) -->
                            <div class="pie-chart-section">
                                <h3>Posts Status</h3>
                                <div class="chart-content-wrapper">
                                    <!-- Left: Stats Cards -->
                                    <div class="chart-stats">
                                        <div class="stat-card active-card">
                                            <div class="stat-indicator active-indicator"></div>
                                            <div class="stat-details">
                                                <span class="stat-label">Active Posts</span>
                                                <span class="stat-number" id="activePostCount">1</span>
                                            </div>
                                        </div>
                                        <div class="stat-card closed-card">
                                            <div class="stat-indicator closed-indicator"></div>
                                            <div class="stat-details">
                                                <span class="stat-label">Closed Posts</span>
                                                <span class="stat-number" id="closedPostCount">1</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Right: Donut Chart with Center Total -->
                                    <div class="chart-display">
                                        <div class="chart-container">
                                            <canvas id="postsChart"></canvas>
                                            <div class="chart-center-label">
                                                <span class="center-number" id="totalPostsCount">2</span>
                                                <span class="center-text">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Section: Recruitment Analytics (65% height) -->
                            <div class="recruitment-metrics-section">
                                <h3>Recruitment Analytics</h3>
                                <div class="metrics-cards-vertical">
                                    <div class="metric-card total">
                                        <div class="metric-icon">
                                            <i class="fa-solid fa-briefcase"></i>
                                        </div>
                                        <div class="metric-content">
                                            <span class="metric-label">Total Applications</span>
                                            <span class="metric-number" id="totalApplications">2,450</span>
                                        </div>
                                    </div>
                                    <div class="metric-card accepted">
                                        <div class="metric-icon">
                                            <i class="fa-solid fa-circle-check"></i>
                                        </div>
                                        <div class="metric-content">
                                            <span class="metric-label">Accepted</span>
                                            <span class="metric-number" id="acceptedApplications">890</span>
                                        </div>
                                    </div>
                                    <div class="metric-card rejected">
                                        <div class="metric-icon">
                                            <i class="fa-solid fa-circle-xmark"></i>
                                        </div>
                                        <div class="metric-content">
                                            <span class="metric-label">Rejected</span>
                                            <span class="metric-number" id="rejectedApplications">1,560</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Company Deets Section -->
                <section id="company-deets-section" class="content-section">
                    <div class="placeholder-content">
                        <i class="fa-solid fa-users placeholder-icon"></i>
                        <h2>Company Deets</h2>
                        <p>Manage your company details and team members here.</p>
                    </div>
                </section>

                <!-- Applicants Manager Section -->
                <section id="applicants-manager-section" class="content-section">
                    <div class="placeholder-content">
                        <i class="fa-solid fa-magnifying-glass placeholder-icon"></i>
                        <h2>Applicants Manager</h2>
                        <p>Review and manage job applications.</p>
                    </div>
                </section>

                <!-- Company Info Section -->
                <section id="company-info-section" class="content-section">
                    <div class="placeholder-content">
                        <i class="fa-solid fa-circle-info placeholder-icon"></i>
                        <h2>Company Info</h2>
                        <p>Update your company profile and information.</p>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- View All Applicants Modal -->
    <div id="applicantsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>All Applicants</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <table class="job-listing-table full-width">
                    <thead>
                        <tr>
                            <th>JOB TITLE</th>
                            <th>APPLICANT'S NAME</th>
                            <th>DATE APPLIED</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody id="modalJobListingBody">
                        <!-- Populated by JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script src="../js/dashboard.js"></script>
</body>

</html>