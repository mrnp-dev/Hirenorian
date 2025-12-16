<?php
session_start();
if (isset($_SESSION['email'])) {
    $company_email = $_SESSION['email'];
    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_information.php";

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "company_email" => $company_email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {
        die("Curl error: " . curl_error($ch));
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Updated to match new API structure
    if (isset($data['company'])) {
        $company = $data['company'];
        $company_id = $company['company_id'];
        $company_name = $company['company_name'];
        // Assume API returns 'verification' or similar due to our previous finding
        // Checking API: fetch_company_information.php
        // It returns all company columns including 'verification'
        // Check for boolean true, string "true", or integer 1
        $verification_val = isset($company['verification']) ? $company['verification'] : false;
        $is_verified = ($verification_val === true || $verification_val === 'true' || $verification_val == 1);

        $company_icon_url = "https://via.placeholder.com/40"; // Default
        if (!empty($data['icons'])) {
            $url = $data['icons'][0]['icon_url'];
            $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
        }

        // Default Icon Logic (adapted from user's request to fit existing data structure)
        $is_default_icon = false;
        if (empty($company_icon_url) || $company_icon_url == "https://via.placeholder.com/40") {
            $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            $is_default_icon = true;
        }

    } else {
        $company_name = "Unknown";
        $company_id = 0;
        $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000"; // Default icon for unknown company
        $is_verified = false;
    }

} else {
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Company Dashboard</title>
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/activity-log.css">
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
                <li class="nav-item active">
                    <a href="#" class="nav-link">
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
                <li class="nav-item">
                    <a href="../../Job Listing Page/php/job_listing.php" class="nav-link">
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
                        <div class="user-avatar-wrapper" style="position: relative; display: inline-block;">
                            <img src="<?php echo $company_icon_url; ?>" alt="Profile"
                                class="user-avatar <?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                            <?php if ($is_verified): ?>
                                <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=10b981" alt="Verified"
                                    class="header-verification-badge verified" title="Verified Account">
                            <?php else: ?>
                                <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=ef4444"
                                    alt="Unverified" class="header-verification-badge unverified"
                                    title="Unverified Account">
                            <?php endif; ?>
                        </div>
                        <span class="user-name"
                            id="headerCompanyName"><?php echo htmlspecialchars($company_name); ?></span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item" id="signOutBtn">Sign Out</a>
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <!-- Hidden Input for JS -->
                <input type="hidden" id="company_email" value="<?php echo htmlspecialchars($company_email); ?>">
                <input type="hidden" id="company_id" value="<?php echo htmlspecialchars($company_id); ?>">

                <!-- Dashboard Section -->
                <section id="dashboard-section" class="content-section active">

                    <!-- Hero Section - Student Dashboard Inspired -->
                    <div class="hero-section">
                        <div class="hero-content">
                            <div class="hero-main">
                                <h1 class="greeting">Welcome back, <span
                                        class="greeting-highlight"><?php echo htmlspecialchars($company_name); ?></span>!
                                </h1>
                                <p class="hero-subtitle">Manage your job postings and find your next great team members
                                </p>
                                <div class="hero-actions">
                                    <a href="../../Job Listing Page/php/job_listing.php" class="btn-hero primary">
                                        <i class="fa-solid fa-plus"></i>
                                        <span>Add New Job</span>
                                    </a>
                                    <a href="../../Company Profile Page/php/company_profile.php"
                                        class="btn-hero secondary">
                                        <i class="fa-solid fa-building"></i>
                                        <span>Company Profile</span>
                                    </a>
                                </div>
                            </div>
                            <div class="quick-stats-widget">
                                <div class="widget-title">
                                    <i class="fa-solid fa-chart-simple"></i>
                                    Quick Overview
                                </div>
                                <div class="stats-row">
                                    <div class="stat-item">
                                        <span class="stat-value" id="heroOpenJobs">-</span>
                                        <span class="stat-label">Open Jobs</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value" id="heroPending">-</span>
                                        <span class="stat-label">Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Metrics Grid - Recruitment Stats -->
                    <div class="metrics-grid">
                        <div class="metric-card-new total-apps">
                            <div class="metric-header">
                                <div class="metric-icon">
                                    <i class="fa-solid fa-users"></i>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value" id="metricTotalApplicants">0</div>
                                <div class="metric-label">Total Applicants</div>
                            </div>
                        </div>
                        <div class="metric-card-new accepted">
                            <div class="metric-header">
                                <div class="metric-icon">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value" id="metricAccepted">0</div>
                                <div class="metric-label">Accepted</div>
                            </div>
                        </div>
                        <div class="metric-card-new rejected">
                            <div class="metric-header">
                                <div class="metric-icon">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </div>
                            </div>
                            <div class="metric-body">
                                <div class="metric-value" id="metricRejected">0</div>
                                <div class="metric-label">Rejected</div>
                            </div>
                        </div>
                        <!-- Post Status Card with Mini Chart -->
                        <div class="metric-card-new post-status">
                            <div class="metric-header">
                                <div class="metric-icon">
                                    <i class="fa-solid fa-chart-pie"></i>
                                </div>
                                <h4 class="post-status-title">Posts Statistics</h4>
                            </div>
                            <div class="metric-body post-status-body">

                                <div class="post-status-wrapper">
                                    <div class="mini-chart-container">
                                        <canvas id="postsChart"></canvas>
                                    </div>
                                    <div class="post-status-info">
                                        <div class="status-row">
                                            <div class="label-group">
                                                <span class="dot active"></span>
                                                <span>Active</span>
                                            </div>
                                            <span class="count" id="activePostCount">0</span>
                                        </div>
                                        <div class="status-row">
                                            <div class="label-group">
                                                <span class="dot closed"></span>
                                                <span>Closed</span>
                                            </div>
                                            <span class="count" id="closedPostCount">0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modern 2-Column Dashboard Layout -->
                    <div class="dashboard-main-container">
                        <!-- Left Column: Job Listings (75% width) -->
                        <div class="job-listings-panel">
                            <div class="section-header">
                                <h2>Job Listing Summary</h2>
                                <button class="btn-view-all" id="viewAllBtn">
                                    <i class="fa-solid fa-list"></i>
                                    View All Posts
                                </button>
                            </div>
                            <div class="job-listing-container">
                                <table class="job-listing-table">
                                    <thead>
                                        <tr>
                                            <th>JOB TITLE</th>
                                            <th>APPLICANTS</th>
                                            <th>PENDING</th>
                                            <th>DATE POSTED</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody id="jobListingBody">
                                        <!-- Populated by JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Right Column: Recent Activity Widget -->
                        <div class="activity-widget-panel">
                            <div class="widget-header">
                                <h3>
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                    Recent Activity
                                </h3>
                                <span class="log-count" id="logCount">0</span>
                            </div>
                            <div class="audit-log-container">
                                <div class="audit-log-timeline" id="activityLogTimeline">
                                    <!-- Loading state -->
                                    <div class="loading-state">
                                        <i class="fa-solid fa-spinner fa-spin"></i>
                                        <p>Loading activity...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- View All Applicants Modal -->
    <div id="applicantsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>All Job Posts</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <table class="job-listing-table full-width">
                    <thead>
                        <tr>
                            <th>JOB TITLE</th>
                            <th>APPLICANTS</th>
                            <th>DATE POSTED</th>
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