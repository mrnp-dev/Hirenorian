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
                    <!-- Top Section: Analytics & Pie Chart -->
                    <div class="dashboard-top-section">
                        <!-- Recruitment Analytics -->
                        <div class="analytics-container">
                            <h2>Recruitment Analytics</h2>
                            <div class="analytics-cards">
                                <div class="analytics-card total">
                                    <div class="card-header">
                                        <i class="fa-solid fa-briefcase"></i>
                                        <span>TOTAL</span>
                                    </div>
                                    <div class="card-body">
                                        <span class="card-number">2,450</span>
                                        <span class="card-label">Applications Received</span>
                                    </div>
                                </div>
                                <div class="analytics-card accepted">
                                    <div class="card-header">
                                        <i class="fa-solid fa-circle-check"></i>
                                        <span>ACCEPTED</span>
                                    </div>
                                    <div class="card-body">
                                        <span class="card-number">890</span>
                                        <span class="card-label">Hired Candidates</span>
                                    </div>
                                </div>
                                <div class="analytics-card rejected">
                                    <div class="card-header">
                                        <i class="fa-solid fa-circle-xmark"></i>
                                        <span>REJECTED</span>
                                    </div>
                                    <div class="card-body">
                                        <span class="card-number">1,560</span>
                                        <span class="card-label">Candidates Not Selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Posts Status Pie Chart -->
                        <div class="pie-chart-container">
                            <h3>Posts Status</h3>
                            <div class="chart-wrapper">
                                <canvas id="postsChart"></canvas>
                            </div>
                            <div class="chart-legend">
                                <div class="legend-item">
                                    <span class="legend-dot active"></span>
                                    <div class="legend-text">
                                        <span class="legend-label">Active</span>
                                        <span class="legend-value" id="activePostCount">1</span>
                                    </div>
                                </div>
                                <div class="legend-item">
                                    <span class="legend-dot closed"></span>
                                    <div class="legend-text">
                                        <span class="legend-label">Closed</span>
                                        <span class="legend-value" id="closedPostCount">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Section: Job Listing Summary -->
                    <div class="dashboard-bottom-section">
                        <div class="section-header">
                            <h2>Job Listing Summary</h2>
                            <button class="btn-view-all" id="viewAllBtn">View All Applicants</button>
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