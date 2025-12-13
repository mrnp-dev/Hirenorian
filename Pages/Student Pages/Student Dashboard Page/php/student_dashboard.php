<?php
session_start();
$student_id = null; // Initialize student_id

if(isset($_SESSION['email']))
{
    echo "<script>console.log('email in session');</script>";
    
    // Fetch student information to get student_id
    $student_email = $_SESSION['email'];
    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php";
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "student_email" => $student_email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if (isset($data['status']) && $data['status'] === "success") {
        $student_id = $data['data']['basic_info']['student_id'] ?? null;
    }
}
else
{
    echo "<script>console.log('email not in session');</script>";
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
                <a href="../../Internship Search Page/php/internship_search.php" class="nav-item">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Internship Search</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-circle-question"></i>
                    <span>Help</span>
                </a>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img"> <!-- Placeholder image -->
                        <span class="user-name">Juan Dela Cruz</span>
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
                            <h1 class="greeting">Good afternoon, <span class="greeting-highlight">Juan</span>!</h1>
                            <p class="hero-subtitle">Here's your internship journey at a glance</p>
                            <div class="hero-actions">
                                <a href="../../Internship Search Page/php/internship_search.php" class="btn-hero primary">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    Browse Internships
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
                            <div class="metric-trend up">
                                <i class="fa-solid fa-arrow-up"></i>
                                +12%
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value">0</div>
                            <div class="metric-label">Total Applications</div>
                        </div>
                    </div>

                    <div class="metric-card active">
                        <div class="metric-header">
                            <div class="metric-icon">
                                <i class="fa-solid fa-check-circle"></i>
                            </div>
                            <div class="metric-trend up">
                                <i class="fa-solid fa-arrow-up"></i>
                                +1
                            </div>
                        </div>
                        <div class="metric-body">
                            <div class="metric-value">0</div>
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
                            <div class="metric-value">0</div>
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
                            <div class="metric-value">0</div>
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
                                <button class="filter-btn active">All</button>
                                <button class="filter-btn">Pending</button>
                                <button class="filter-btn">Interview</button>
                                <button class="filter-btn">Offer</button>
                            </div>
                        </div>

                        <div class="applications-list">
                            <!-- Application Card 1 -->
                            <div class="application-card pending">
                                <div class="app-header">
                                    <div class="app-company">
                                        <img src="../../../Landing Page/Images/Companies/cloudstaff_logo.jpg" alt="Company" class="company-logo-small">
                                        <div class="app-info">
                                            <h4>Web Developer Intern</h4>
                                            <p>Tech Solutions Inc.</p>
                                        </div>
                                    </div>
                                    <span class="app-status-badge pending">Pending</span>
                                </div>
                                <div class="app-meta">
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-calendar"></i>
                                        Applied Oct 24, 2023
                                    </div>
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-location-dot"></i>
                                        Remote
                                    </div>
                                </div>
                            </div>

                            <!-- Application Card 2 -->
                            <div class="application-card interview">
                                <div class="app-header">
                                    <div class="app-company">
                                        <img src="../../../Landing Page/Images/google.jpg" alt="Company" class="company-logo-small">
                                        <div class="app-info">
                                            <h4>Graphic Designer</h4>
                                            <p>Creative Studio</p>
                                        </div>
                                    </div>
                                    <span class="app-status-badge interview">Interview</span>
                                </div>
                                <div class="app-meta">
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-calendar"></i>
                                        Applied Oct 20, 2023
                                    </div>
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-location-dot"></i>
                                        Pampanga
                                    </div>
                                </div>
                            </div>

                            <!-- Application Card 3 -->
                            <div class="application-card offer">
                                <div class="app-header">
                                    <div class="app-company">
                                        <img src="../../../Landing Page/Images/samsung.jpg" alt="Company" class="company-logo-small">
                                        <div class="app-info">
                                            <h4>IT Support</h4>
                                            <p>Global Systems</p>
                                        </div>
                                    </div>
                                    <span class="app-status-badge offer">Offer</span>
                                </div>
                                <div class="app-meta">
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-calendar"></i>
                                        Applied Oct 15, 2023
                                    </div>
                                    <div class="app-meta-item">
                                        <i class="fa-solid fa-location-dot"></i>
                                        Manila
                                    </div>
                                </div>
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
                        <!-- Recommendation Card 1 -->
                        <div class="recommendation-card">
                            <img src="../../../Landing Page/Images/dhvsu-bg-image.jpg" alt="Job" class="recommendation-image">
                            <div class="recommendation-content">
                                <h3>UI/UX Designer Intern</h3>
                                <p>DHVSU Innovation Hub</p>
                                <div class="recommendation-tags">
                                    <span class="rec-tag">Design</span>
                                    <span class="rec-tag">Part-time</span>
                                    <span class="rec-tag">Remote</span>
                                </div>
                                <div class="recommendation-footer">
                                    <button class="btn-quick-apply">Apply Now</button>
                                </div>
                            </div>
                        </div>

                        <!-- Recommendation Card 2 -->
                        <div class="recommendation-card">
                            <img src="../../../Landing Page/Images/google.jpg" alt="Job" class="recommendation-image">
                            <div class="recommendation-content">
                                <h3>Software Engineering Intern</h3>
                                <p>Tech Innovators Inc.</p>
                                <div class="recommendation-tags">
                                    <span class="rec-tag">Engineering</span>
                                    <span class="rec-tag">Full-time</span>
                                    <span class="rec-tag">Hybrid</span>
                                </div>
                                <div class="recommendation-footer">
                                    <button class="btn-quick-apply">Apply Now</button>
                                </div>
                            </div>
                        </div>

                        <!-- Recommendation Card 3 -->
                        <div class="recommendation-card">
                            <img src="../../../Landing Page/Images/samsung.jpg" alt="Job" class="recommendation-image">
                            <div class="recommendation-content">
                                <h3>Data Analyst Intern</h3>
                                <p>Analytics Pro</p>
                                <div class="recommendation-tags">
                                    <span class="rec-tag">Data</span>
                                    <span class="rec-tag">Full-time</span>
                                    <span class="rec-tag">On-site</span>
                                </div>
                                <div class="recommendation-footer">
                                    <button class="btn-quick-apply">Apply Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    </div>


    <script>
        // Pass student_id from PHP to JavaScript
        const STUDENT_ID = <?php echo json_encode($student_id); ?>;
    </script>
    <script src="../js/dashboard.js"></script>
</body>
</html>
