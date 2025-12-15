<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    $student_id = $_SESSION['student_id'] ?? null;
    
    // Fetch student information from API
    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php";
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "student_email" => $student_email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    if ($response === false) {
        echo "<script>console.error('DEBUG: Curl error: " . curl_error($ch) . "');</script>";
    }
    curl_close($ch);
    
    // Initialize default values
    $first_name = "Student";
    $last_name = "";
    $profile_picture = "";
    $profile_score = 0;
    $suggestions = ["Complete your profile"];
    
    if ($response !== false) {
        $data = json_decode($response, true);
        echo "<script>console.log('DEBUG: Student API Response Status:', '" . ($data['status'] ?? 'unknown') . "');</script>";
        
        if (isset($data['status']) && $data['status'] === "success") {
            $basic_info = $data['data']['basic_info'];
            $profile = $data['data']['profile'];
            
            $first_name = $basic_info['first_name'];
            $last_name = $basic_info['last_name'];
            $profile_picture_db = $profile['profile_picture'];
            
            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }

            // AUTO-RECOVER STUDENT ID
            if (empty($student_id) && isset($basic_info['student_id'])) {
                $student_id = $basic_info['student_id'];
                $_SESSION['student_id'] = $student_id; // persist to session
                echo "<script>console.log('DEBUG: recovered student_id from API: " . $student_id . "');</script>";
            }

            // --- PROFILE STRENGTH CALCULATION ---
            $profile_score = 0;
            $suggestions = [];

            // 1. Account Verification (15%)
            if (isset($basic_info['verified_status']) && $basic_info['verified_status'] === 'verified') {
                $profile_score += 15;
            } else {
                $suggestions[] = "Verify your account";
            }

            // 2. Contact Info (15%)
            // Phone (7.5%) - Using 7 for int, will round/sum carefully or just use 7 and 8? 
            // Let's use 7 and 8 to make 15, or just float logic. 
            // Let's use integers: Phone (7) + Location (8) = 15.
            if (!empty($basic_info['phone_number'])) {
                $profile_score += 7;
            } else {
                $suggestions[] = "Add your phone number";
            }
            // Location (8%)
            if (!empty($profile['location'])) {
                $profile_score += 8;
            } else {
                $suggestions[] = "Add your location";
            }

            // 3. Profile Picture (10%)
            if (!empty($profile['profile_picture'])) {
                $profile_score += 10;
            } else {
                $suggestions[] = "Upload a profile picture";
            }

            // 4. About Me (10%)
            if (!empty($profile['about_me'])) {
                $profile_score += 10;
            } else {
                $suggestions[] = "Write a short bio (About Me)";
            }

            // 5. Skills (20%)
            $tech_found = false;
            $soft_found = false;
            $skills_data = $data['data']['skills'] ?? [];
            if (is_array($skills_data)) {
                foreach ($skills_data as $s) {
                    if (isset($s['skill_category'])) {
                        if ($s['skill_category'] === 'Technical') $tech_found = true;
                        if (stripos($s['skill_category'], 'Soft') !== false) $soft_found = true;
                    }
                }
            }
            
            if ($tech_found) {
                $profile_score += 10;
            } else {
                $suggestions[] = "Add at least one technical skill";
            }
            
            if ($soft_found) {
                $profile_score += 10;
            } else {
                $suggestions[] = "Add at least one soft skill";
            }

            // 6. Education (15%)
            $edu_hist = $data['data']['education_history'] ?? [];
            if (!empty($edu_hist) && count($edu_hist) > 0) {
                $profile_score += 15;
            } else {
                $suggestions[] = "Add your educational background";
            }

            // 7. Experience (15%)
            $exp_list = $data['data']['experience'] ?? [];
            if (!empty($exp_list) && count($exp_list) > 0) {
                $profile_score += 15;
            } else {
                $suggestions[] = "Add work experience or achievements";
            }

            // Clamp score to 100 just in case
            if ($profile_score > 100) $profile_score = 100;
        }
    }
}
else
{
    echo "<script>console.warn('DEBUG: Session email not set. Session ID: " . session_id() . "');</script>";
    // Optional: Redirect if strict login is required
    // header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
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
                <a href="../../../Landing Page Tailwind/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 12px; color: inherit;">
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
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Student" class="user-img">
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="../../logout.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
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
                            <h1 class="greeting">Good afternoon, <span class="greeting-highlight"><?php echo htmlspecialchars($first_name); ?></span>!</h1>
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
                                <span class="completion-percentage"><?php echo $profile_score; ?>%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: <?php echo $profile_score; ?>%"></div>
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
                                    <span class="strength-value"><?php echo $profile_score; ?>%</span>
                                </div>
                                <div class="strength-bar">
                                    <div class="strength-fill" style="width: <?php echo $profile_score; ?>%"></div>
                                </div>
                            </div>
                            <ul class="strength-suggestions">
                                <?php if (!empty($suggestions)): ?>
                                    <?php foreach (array_slice($suggestions, 0, 3) as $suggestion): ?>
                                        <li><i class="fa-solid fa-lightbulb"></i> <?php echo htmlspecialchars($suggestion); ?></li>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <li><i class="fa-solid fa-check-circle"></i> Profile complete! Great job!</li>
                                <?php endif; ?>
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

    <!-- Job Details Modal -->
    <div class="job-modal-overlay" id="jobDetailsModal">
        <div class="job-modal-content">
            <button class="job-modal-close" id="closeJobModal">&times;</button>
            <div class="job-details-panel-modal">
                <div class="details-hero">
                    <div class="details-hero-content">
                        <img src="" alt="Logo" class="details-logo-large" id="modal-detail-logo">
                        <div class="details-title-box">
                            <h2 id="modal-detail-title">Job Title</h2>
                            <a href="#" class="details-company-link" id="modal-detail-company">Company Name</a>
                            <p class="details-location">
                                <i class="fa-solid fa-location-dot"></i> <span id="modal-detail-city">City</span>, <span id="modal-detail-province">Province</span>
                            </p>
                        </div>
                    </div>
                    <div class="job-meta-mini">
                         <span id="modal-detail-work-type">Full Time</span> &bull; 
                         <span id="modal-detail-category">Design</span> &bull; 
                         <span id="modal-detail-posted-date">2 days ago</span>
                    </div>
                    <div class="details-actions">
                        <button class="btn-apply-primary" id="modal-btn-apply">Apply Now</button>
                        <button class="btn-save-secondary" id="modal-btn-save">Save Job</button>
                    </div>
                </div>
                
                <div class="details-scroll-content">
                    <div class="detail-section">
                        <h3>Job Description</h3>
                        <p id="modal-detail-description"></p>
                    </div>

                    <div class="detail-section">
                        <h3>Tags</h3>
                        <div class="job-tags-detail" id="modal-detail-tags"></div>
                    </div>

                    <div class="detail-section">
                        <h3>Responsibilities</h3>
                        <ul id="modal-detail-responsibilities"></ul>
                    </div>

                    <div class="detail-section">
                        <h3>Qualifications</h3>
                        <ul id="modal-detail-qualifications"></ul>
                    </div>

                    <div class="detail-section">
                        <h3>Required Skills</h3>
                        <ul id="modal-detail-skills"></ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Required Documents</h3>
                        <ul id="modal-detail-documents"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="../js/modules/main.js"></script>
</body>
</html>
