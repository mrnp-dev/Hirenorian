session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    $student_id = $_SESSION['student_id'] ?? null;
    
    // NOTE: Removed blocking cURL call. Student info will be fetched via JS.
}
else
{
    // Optional: Redirect if strict login is required
    // header("Location: ../../../Landing Page/php/landing_page.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Hirenorian</title>
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/topbar.css">
    <link rel="stylesheet" href="../css/dashboard-pro.css">
    <link rel="stylesheet" href="../css/audit-log.css">
    <link rel="stylesheet" href="../css/recommendations.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <style>
        /* Skeleton Loading Styles */
        .skeleton {
            background: #e0e0e0;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            color: transparent !important;
            border-radius: 4px;
            display: inline-block;
        }

        .skeleton-text {
            height: 1em;
            width: 100%;
            border-radius: 4px;
        }
        
        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Left Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 12px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <span class="logo-text">Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../Student Profile Page/php/student_profile.php" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Student Internship Search Page New/php/internship_search.php" class="nav-item">
                    <i class="fa-solid fa-briefcase"></i>
                    <span>Internships</span>
                </a>

            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img skeleton" id="headerProfileImg">
                        <span class="user-name skeleton skeleton-text" id="headerProfileName" style="width: 120px;">Student Name</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <main class="dashboard-body">
                
                <!-- Hero Section -->
                <div class="hero-section">
                    <div class="hero-content">
                        <div class="hero-main">
                            <h1 class="greeting">Good afternoon, <span class="greeting-highlight skeleton skeleton-text" id="heroGreetingName" style="width: 150px; display: inline-block;">Student</span>!</h1>
                            <p class="hero-subtitle">Here's your internship journey at a glance</p>
                            <div class="hero-actions">
                                <a href="../../Student Internship Search Page New/php/internship_search.php" class="btn-hero primary">
                                    <i class="fa-solid fa-magnifying-glass"></i> Find Internships
                                </a>
                                <a href="../../Student Edit Profile Page/php/edit_profile.php" class="btn-hero secondary">
                                    <i class="fa-solid fa-user-pen"></i>
                                    Edit Profile
                                </a>
                            </div>
                        </div>
                        <div class="profile-completion">
                            <div class="completion-header">
                                <span class="completion-label">Profile Strength</span>
                                <span class="completion-percentage">75%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Metrics Grid -->
                <div class="metrics-grid">
                    <div class="metric-card total">
                        <div class="metric-header">
                            <div class="metric-icon">
                                <i class="fa-solid fa-file-lines"></i>
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px;"></i></div>
                            <div class="metric-label">Total Applications</div>
                        </div>
                    </div>

                    <div class="metric-card active">
                        <div class="metric-header">
                            <div class="metric-icon">
                                <i class="fa-solid fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px;"></i></div>
                            <div class="metric-label">Accepted Applications</div>
                        </div>
                    </div>

                    <div class="metric-card review">
                        <div class="metric-header">
                            <div class="metric-icon">
                                <i class="fa-solid fa-hourglass-half"></i>
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px;"></i></div>
                            <div class="metric-label">Under Review</div>
                        </div>
                    </div>

                    <div class="metric-card offers">
                        <div class="metric-header">
                            <div class="metric-icon">
                                <i class="fa-solid fa-times-circle"></i>
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px;"></i></div>
                            <div class="metric-label">Rejected Applications</div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="content-grid">
                    <!-- Application Pipeline -->
                    <div class="pipeline-section">
                        <div class="section-header">
                            <h2 class="section-title">
                                <i class="fa-solid fa-list-check"></i>
                                Application Pipeline
                            </h2>
                            <div class="status-filters">
                                <button class="filter-btn active" data-filter="all">All</button>
                                <button class="filter-btn" data-filter="accepted">Accepted</button>
                                <button class="filter-btn" data-filter="pending">Pending</button>
                                <button class="filter-btn" data-filter="rejected">Rejected</button>
                            </div>
                        </div>

                        <div class="applications-list">
                            <div class="loading-state">
                                <i class="fa-solid fa-spinner fa-spin"></i>
                                <p>Loading applications...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar Widgets -->
                    <div class="sidebar-widgets">
                        <!-- Activity Timeline Widget -->
                        <div class="widget">
                            <h3 class="widget-title">
                                <i class="fa-solid fa-history"></i>
                                Recent Activity
                            </h3>
                            <div class="audit-log-container" id="auditLogContainer" style="max-height: 300px;">
                                <div class="loading-state">
                                    <i class="fa-solid fa-spinner fa-spin"></i>
                                    <p>Loading...</p>
                                </div>
                            </div>
                        </div>

                        <!-- Profile Strength Widget -->
                        <div class="widget">
                            <h3 class="widget-title">
                                <i class="fa-solid fa-chart-line"></i>
                                Profile Strength
                            </h3>
                            <div class="strength-meter">
                                <div class="strength-score">
                                    <span>Your Score</span>
                                    <span class="strength-value">75%</span>
                                </div>
                                <div class="strength-bar">
                                    <div class="strength-fill" style="width: 75%"></div>
                                </div>
                            </div>
                            <ul class="strength-suggestions">
                                <li><i class="fa-solid fa-lightbulb"></i> Add work experience</li>
                                <li><i class="fa-solid fa-lightbulb"></i> Complete skills section</li>
                                <li><i class="fa-solid fa-lightbulb"></i> Upload profile picture</li>
                            </ul>
                        </div>

                        </div>
                    </div>
                </div>

                <!-- Recommendations Section -->
                <div class="recommendations-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i class="fa-solid fa-star"></i>
                            Recommended for You
                        </h2>
                    </div>
                    <div class="recommendations-grid">
                        <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                            <i class="fa-solid fa-spinner fa-spin"></i>
                            <p>Finding best matches...</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    </div>


    <script>
        // Pass student_id from PHP to JavaScript
        window.STUDENT_ID = <?php echo json_encode($student_id ?? null); ?>;
        window.STUDENT_EMAIL = <?php echo json_encode($student_email ?? null); ?>;
        console.log('DEBUG: window.STUDENT_ID value:', window.STUDENT_ID);
    </script>
    <script type="module" src="../js/modules/main.js"></script>
</body>
</html>
