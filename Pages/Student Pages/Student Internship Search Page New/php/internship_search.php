<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    
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
    curl_close($ch);
    
    // Initialize default values
    $first_name = "Student";
    $last_name = "";
    $profile_picture = "";
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if (isset($data['status']) && $data['status'] === "success") {
            $basic_info = $data['data']['basic_info'];
            $profile = $data['data']['profile'];
            
            $first_name = $basic_info['first_name'];
            $last_name = $basic_info['last_name'];
            $profile_picture_db = $profile['profile_picture'];
            
            // Extract Tags for Auto-Search
            $student_tags = [];
            if (!empty($basic_info['tag1'])) $student_tags[] = $basic_info['tag1'];
            if (!empty($basic_info['tag2'])) $student_tags[] = $basic_info['tag2'];
            if (!empty($basic_info['tag3'])) $student_tags[] = $basic_info['tag3'];

            // Verified Status
            $verified_status = $basic_info['verified_status'] ?? 'unverified';

            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }
        }
    }
} else {
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Search - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/search-pro.css">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <!-- Left Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page Tailwind/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <span class="logo-text">Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="../../Student Dashboard Page/php/student_dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../Student Profile Page/php/student_profile.php" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="nav-item active">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Internship Search</span>
                </a>
                <a href="../../Help Page/php/help.php" class="nav-item">
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
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Student" class="user-img">
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="../../logout.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="../../../Account Registration Pages/Account Selection Modern/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Search Page Content -->
            <main class="search-page-body">
                
                <!-- Hero Section -->
                <div class="search-hero">
                    <h1>Find Your Ideal Internship</h1>
                    <p>Connect with top companies and kickstart your career today.</p>
                </div>

                <!-- Search Bar Container -->
                <div class="search-bar-container">
                    <!-- Keyword Search -->
                    <div class="search-input-group">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="searchInput" placeholder="Search job title, company, or keywords...">
                    </div>
                    
                    <!-- Location Filter -->
                    <div class="search-input-group location-filter-wrapper">
                        <i class="fa-solid fa-location-dot"></i>
                        <button type="button" class="location-trigger" id="locationTrigger">
                            <span>Any Location</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="location-dropdown" id="locationDropdown">
                            <div class="location-option all-option" data-value="">Any Location</div>
                            <!-- Provinces populated by JS -->
                        </div>
                        <input type="hidden" name="location" id="locationValue" value="">
                    </div>

                    <!-- Type Filter -->
                     <div class="search-input-group type-filter-wrapper">
                        <i class="fa-solid fa-briefcase"></i>
                        <button type="button" class="type-trigger" id="typeTrigger">
                            <span>Any Type</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="type-dropdown" id="typeDropdown">
                            <div class="type-option" data-value="">Any Type</div>
                            <div class="type-option" data-value="full-time">Full Time</div>
                            <div class="type-option" data-value="part-time">Part Time</div>
                            <div class="type-option" data-value="internship">Internship</div>
                        </div>
                        <input type="hidden" name="type" id="typeValue" value="">
                    </div>

                    <!-- Search Button -->
                    <button class="btn-search btn-apply-filter">Search</button>
                </div>

                <!-- Main Content Grid -->
                <div class="search-content-grid">
                    
                    <!-- Left: Job List -->
                    <div class="job-list-col">
                        <div class="results-header">
                            <span>Showing recommended jobs</span>
                             <!-- More Filters Button -->
                             <button class="btn-more-filters" style="background:none; border:1px solid #ddd; padding: 6px 12px; border-radius: 6px; color:var(--primary-maroon); cursor:pointer;">More Filters</button>
                        </div>
                        
                        <!-- Active Filters Display (Hidden by default) -->
                        <div class="active-filters-display" id="activeFiltersDisplay" style="display: none; padding-bottom: 15px;">
                            <div class="active-filters-tags" id="activeFiltersTags" style="display:flex; gap:8px; flex-wrap:wrap;"></div>
                        </div>

                        <div class="job-list">
                            <!-- Jobs injected via JS -->
                        </div>

                        <!-- Pagination Container -->
                        <div class="pagination-container" id="paginationContainer"></div>
                    </div>

                    <!-- Right: Job Details -->
                    <div class="job-details-col">
                        <!-- Placeholder State -->
                        <div class="empty-state-panel" id="jobDetailsPlaceholder">
                            <i class="fa-regular fa-folder-open"></i>
                            <h3>Select a job to view details</h3>
                        </div>

                        <!-- Job Details Panel -->
                        <div class="job-details-panel" id="jobDetailsCard" style="display: none;">
                            <div class="details-hero">
                                <div class="details-hero-content">
                                    <img src="" alt="Logo" class="details-logo-large" id="detail-logo">
                                    <div class="details-title-box">
                                        <h2 id="detail-title">Job Title</h2>
                                        <a href="#" class="details-company-link" id="detail-company">Company Name</a>
                                        <p class="details-location">
                                            <i class="fa-solid fa-location-dot"></i> <span id="detail-city">City</span>, <span id="detail-province">Province</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="job-meta-mini" style="margin-top:15px; font-size:0.9rem;">
                                     <span id="detail-work-type">Full Time</span> &bull; 
                                     <span id="detail-category">Design</span> &bull; 
                                     <span id="detail-posted-date">2 days ago</span>
                                </div>
                                <div class="details-actions">
                                    <button class="btn-apply-primary btn-apply-now">Apply Now</button>
                                </div>
                            </div>
                            
                            <div class="details-scroll-content">
                                <div class="detail-section">
                                    <h3>Job Description</h3>
                                    <p id="detail-description"></p>
                                </div>

                                <div class="detail-section">
                                    <h3>Tags</h3>
                                    <div class="job-tags-mini" id="detail-tags"></div>
                                </div>

                                <div class="detail-section">
                                    <h3>Responsibilities</h3>
                                    <ul id="detail-responsibilities"></ul>
                                </div>

                                <div class="detail-section">
                                    <h3>Qualifications</h3>
                                    <ul id="detail-qualifications"></ul>
                                </div>

                                <div class="detail-section">
                                    <h3>Required Skills</h3>
                                    <ul id="detail-skills"></ul>
                                </div>
                                
                                <div class="detail-section">
                                    <h3>Required Documents</h3>
                                    <ul id="detail-documents"></ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    </div>
    
    <!-- More Filters Modal -->
    <div class="filters-modal-overlay" id="filtersModalOverlay">
        <div class="filters-modal" id="filtersModal">
            <div class="filters-modal-header">
                <h2>Advanced Filters</h2>
                <div class="header-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="filterSearch" placeholder="Search filters...">
                </div>
                <button class="close-modal-btn" id="closeFiltersModal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Selected Filters Display -->
            <div class="selected-filters-bar" id="selectedFiltersBar">
                <div class="selected-filters-header">
                    <span class="selected-count">0 filters selected</span>
                    <button class="btn-clear-selected" id="clearSelectedBtn" style="display: none;">Clear All</button>
                </div>
                <div class="selected-filters-tags" id="selectedFiltersTags">
                    <!-- Selected tags will be displayed here -->
                </div>
            </div>

            <!-- Loading Overlay -->
            <div class="filters-loading-overlay" id="filtersLoadingOverlay">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading your preferences...</p>
                </div>
            </div>
            
            <div class="filters-modal-main">
                <!-- Sidebar Navigation -->
                <div class="filters-sidebar">
                    <div class="sidebar-item active" data-section="student-courses">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>Student Courses</span>
                    </div>
                    <div class="sidebar-item" data-section="career-tags">
                        <i class="fa-solid fa-briefcase"></i>
                        <span>Career Tags</span>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="filters-content">
                    <!-- Student Courses View -->
                    <div class="filter-view active" id="student-courses-view">
                        <h3>Student Courses</h3>
                        <div class="filter-categories" id="studentCoursesContainer">
                            <!-- Populated by JS -->
                        </div>
                    </div>

                    <!-- Career Tags View -->
                    <div class="filter-view" id="career-tags-view">
                        <h3>Career Tags / Industry</h3>
                        <div class="filter-categories" id="careerTagsContainer">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="filters-modal-footer">
                <button class="btn-clear-filters" id="clearAllFilters">Clear All</button>
                <div class="footer-actions">
                    <button class="btn-cancel-filters" id="cancelFilters">Cancel</button>
                    <button class="btn-apply-filters" id="applyFilters">Apply Filters</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Custom Confirmation Dialog -->
    <div class="confirm-dialog-overlay" id="confirmDialogOverlay">
        <div class="confirm-dialog">
            <div class="confirm-dialog-icon">
                <i class="fa-solid fa-circle-question"></i>
            </div>
            <h3>Apply Filters?</h3>
            <p id="confirmDialogMessage">You have filters selected. Do you want to apply them before closing?</p>
            <div class="confirm-dialog-actions">
                <button class="btn-confirm-apply" id="btnConfirmApply">
                    <i class="fa-solid fa-check"></i> Apply Filters
                </button>
                <button class="btn-confirm-discard" id="btnConfirmDiscard">
                    <i class="fa-solid fa-xmark"></i> Discard Changes
                </button>
            </div>
        </div>
    </div>
    
    
    <!-- Info Modal -->
    <div class="confirm-dialog-overlay" id="infoModalOverlay">
        <div class="confirm-dialog">
            <div class="confirm-dialog-icon" id="infoModalIcon">
                <i class="fa-solid fa-circle-info"></i>
            </div>
            <h3 id="infoModalTitle">Notification</h3>
            <p id="infoModalMessage">Message goes here...</p>
            <div class="confirm-dialog-actions">
                <button class="btn-confirm-apply" id="btnInfoOk" style="width: 100%;">
                    OK
                </button>
            </div>
        </div>
    </div>
    
    <!-- Pass PHP session data to JavaScript -->
    <script>
        <?php if(isset($_SESSION['email'])): ?>
        sessionStorage.setItem('email', '<?php echo addslashes($_SESSION['email']); ?>');
        sessionStorage.setItem('verifiedStatus', '<?php echo addslashes($verified_status); ?>');
        <?php if (!empty($student_tags)): ?>
        sessionStorage.setItem('studentTags', JSON.stringify(<?php echo json_encode($student_tags); ?>));
        <?php endif; ?>
        <?php endif; ?>
    </script>
    
    <script type="module" src="../js/main.js"></script>
</body>
</html>
