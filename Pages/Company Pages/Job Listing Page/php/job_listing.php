<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Listing - Hirenorian</title>
    <!-- Shared CSS from Dashboard -->
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/job_listing.css">
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
                <span class="logo-text">Hirenorian</span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="../../Company Dashboard/php/company_dashboard.php" class="nav-link">
                        <i class="fa-solid fa-table-columns"></i>
                        <span class="link-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../../Company Profile Page/php/company_profile.php" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span class="link-text">Company Profile</span>
                    </a>
                </li>
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="link-text">Job Listing</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../../Help Page/php/help.php" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Help</span>
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
                        <div class="user-avatar"></div>
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
                    <h1>Job Listing</h1>
                </div>

                <!-- Job Listing Content -->
                <section class="content-section active">
                    <!-- Toolbar -->
                    <div class="job-listing-toolbar">
                        <div class="action-buttons">
                            <button class="btn-action btn-add" id="btnAdd">
                                <i class="fa-solid fa-plus"></i>
                                Add
                            </button>
                            <button class="btn-action btn-close" id="btnClose">
                                <i class="fa-solid fa-times"></i>
                                Close
                            </button>
                            <button class="btn-action btn-edit" id="btnEdit">
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </button>
                        </div>
                        <div class="search-filter-group">
                            <div class="search-box">
                                <i class="fa-solid fa-search"></i>
                                <input type="text" id="searchInput" placeholder="Search job title...">
                            </div>
                            <div class="filter-dropdown">
                                <button class="filter-btn" id="filterBtn">
                                    <span id="filterLabel">Filter Applications</span>
                                    <i class="fa-solid fa-chevron-down"></i>
                                </button>
                                <div class="filter-menu" id="filterMenu">
                                    <div class="filter-option active" data-filter="all">
                                        <i class="fa-solid fa-check"></i>
                                        All
                                    </div>
                                    <div class="filter-option" data-filter="pending">
                                        <i class="fa-solid fa-check"></i>
                                        Pending
                                    </div>
                                    <div class="filter-option" data-filter="accepted">
                                        <i class="fa-solid fa-check"></i>
                                        Accepted
                                    </div>
                                    <div class="filter-option" data-filter="rejected">
                                        <i class="fa-solid fa-check"></i>
                                        Rejected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content Area -->
                    <div class="job-listing-main">
                        <!-- Statistics Sidebar -->
                        <div class="statistics-sidebar">
                            <div class="stats-card">
                                <h3>Post Statistics</h3>
                                <div class="stats-chart-container">
                                    <div class="chart-wrapper">
                                        <canvas id="statsChart"></canvas>
                                        <div class="chart-center-label">
                                            <span class="center-number" id="totalCount">0</span>
                                            <span class="center-text">APPLICANTS</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="stats-summary">
                                    <div class="stat-item accepted">
                                        <div class="stat-indicator"></div>
                                        <div class="stat-details">
                                            <span class="stat-label">Accepted</span>
                                            <span class="stat-value" id="acceptedCount">0</span>
                                        </div>
                                    </div>
                                    <div class="stat-item rejected">
                                        <div class="stat-indicator"></div>
                                        <div class="stat-details">
                                            <span class="stat-label">Rejected</span>
                                            <span class="stat-value" id="rejectedCount">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Applicants List -->
                        <div class="applicants-container">
                            <!-- Table Header -->
                            <div class="applicants-header">
                                <div class="header-cell checkbox-cell">
                                    <input type="checkbox" id="selectAll" class="checkbox-master">
                                </div>
                                <div class="header-cell name-cell">Name</div>
                                <div class="header-cell course-cell">Course</div>
                                <div class="header-cell document-cell">Document Type</div>
                                <div class="header-cell date-cell">Date Applied</div>
                                <div class="header-cell actions-cell">Actions</div>
                            </div>

                            <!-- Applicants List (Dynamically Populated) -->
                            <div id="applicantsList" class="applicants-list">
                                <!-- Items will be populated by JavaScript -->
                            </div>

                            <!-- Empty State -->
                            <div id="emptyState" class="empty-state" style="display: none;">
                                <i class="fa-solid fa-inbox"></i>
                                <h3>No Applicants Found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <script src="../../Company Dashboard/js/dashboard.js"></script>
    <script src="../js/job_listing.js"></script>
</body>

</html>