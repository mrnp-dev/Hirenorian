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
    <link rel="stylesheet" href="../css/internship_search.css">
    
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
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="../../../Account Registration Pages/Account Selection Modern/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Search Page Content -->
            <main class="dashboard-body search-page-body">
                
                <!-- Search Banner -->
                <div class="search-banner">
                    <div class="banner-content">
                        <h1>Looking for new opportunities?</h1>
                        <p>Browse our latest internship openings</p>
                    </div>
                    <div class="banner-decoration">
                        <!-- Abstract shapes could go here -->
                        <div class="circle c1"></div>
                        <div class="circle c2"></div>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <div class="filter-group search-input">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="searchInput" placeholder="Search for job title, company...">
                    </div>
                    <div class="filter-group location-filter-wrapper">
                        <i class="fa-solid fa-location-dot"></i>
                        <div class="location-filter">
                            <button type="button" class="location-trigger" id="locationTrigger">
                                <span>Location: All</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="location-dropdown" id="locationDropdown">
                                <div class="location-option all-option" data-value="">Location: All</div>
                                <!-- Provinces will be populated by JavaScript -->
                            </div>
                        </div>
                        <input type="hidden" name="location" id="locationValue" value="">
                    </div>
                    <div class="filter-group type-filter-wrapper">
                        <i class="fa-solid fa-briefcase"></i>
                        <div class="type-filter">
                            <button type="button" class="type-trigger" id="typeTrigger">
                                <span>Type: All</span>
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <div class="type-dropdown" id="typeDropdown">
                                <div class="type-option" data-value="">Type: All</div>
                                <div class="type-option" data-value="full-time">Full Time</div>
                                <div class="type-option" data-value="part-time">Part Time</div>
                                <div class="type-option" data-value="internship">Internship</div>
                            </div>
                        </div>
                        <input type="hidden" name="type" id="typeValue" value="">
                    </div>
                    <button class="btn-apply-filter">Apply Filter</button>
                </div>

                <!-- Main Grid Layout -->
                <div class="search-grid">
                    
                    <!-- Left Column: Related Jobs List -->
                    <div class="job-list-section">
                        <div class="section-header">
                            <h2>Related Jobs</h2>
                            <button class="btn-more-filters">More Filters</button>
                        </div>

                        <!-- Active Filters Display -->
                        <div class="active-filters-display" id="activeFiltersDisplay" style="display: none;">
                            <div class="active-filters-header">
                                <span class="active-filters-title">
                                    <i class="fa-solid fa-filter"></i> Active Filters
                                </span>
                                <button class="btn-clear-all-filters" id="btnClearAllFilters">
                                    <i class="fa-solid fa-xmark"></i> Clear All
                                </button>
                            </div>
                            <div class="active-filters-tags" id="activeFiltersTags">
                                <!-- Active filter tags will be inserted here -->
                            </div>
                        </div>

                        <div class="job-list">
                            <!-- Jobs will be loaded dynamically here -->
                        </div>
                    </div>

                    <!-- Right Column: Job Details Panel -->
                    <div class="job-details-section">
                        <!-- Placeholder State (Shown when no job is selected) -->
                        <div class="job-details-placeholder" id="jobDetailsPlaceholder">
                            <i class="fa-regular fa-folder-open"></i>
                            <h3>Select a Job</h3>
                            <p>Click on a job card to view full details</p>
                        </div>

                        <!-- Job Details Card (Hidden by default) -->
                        <div class="job-details-card" id="jobDetailsCard" style="display: none;">
                            <div class="details-header">
                                <div class="header-main">
                                    <img src="" alt="Logo" class="details-logo" id="detail-logo">
                                    <div class="header-info">
                                        <h2 id="detail-title"></h2>
                                        <p id="detail-company"></p>
                                        <p class="detail-location">
                                            <i class="fa-solid fa-location-dot"></i>
                                            <span id="detail-city"></span>, <span id="detail-province"></span>
                                        </p>
                                    </div>
                                </div>
                                <div class="header-actions">
                                    <button class="btn-apply-now">Apply Now</button>
                                    <button class="btn-save"><i class="fa-regular fa-bookmark"></i> Save</button>
                                </div>
                            </div>

                            <div class="job-meta">
                                <div class="meta-item">
                                    <i class="fa-solid fa-briefcase"></i>
                                    <span id="detail-work-type"></span>
                                </div>
                                <div class="meta-item">
                                    <i class="fa-solid fa-tag"></i>
                                    <span id="detail-category"></span>
                                </div>
                                <div class="meta-item">
                                    <i class="fa-regular fa-clock"></i>
                                    <span id="detail-posted-date"></span>
                                </div>
                            </div>

                            <div class="details-section">
                                <h3>From the job post</h3>
                                <p id="detail-description"></p>
                            </div>

                            <div class="details-section">
                                <h3>Tags</h3>
                                <div class="job-tags" id="detail-tags">
                                    <!-- Tags will be populated here -->
                                </div>
                            </div>

                            <div class="details-section">
                                <h3>Responsibilities</h3>
                                <ul id="detail-responsibilities"></ul>
                            </div>

                            <div class="details-section">
                                <h3>Qualifications</h3>
                                <ul id="detail-qualifications"></ul>
                            </div>

                            <div class="details-section">
                                <h3>Required Skills</h3>
                                <ul id="detail-skills"></ul>
                            </div>

                            <div class="details-section">
                                <h3>Required Documents</h3>
                                <ul id="detail-documents"></ul>
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

    <!-- Pass PHP session data to JavaScript -->
    <script>
        // Store session email in sessionStorage for JavaScript modules
        <?php if(isset($_SESSION['email'])): ?>
        sessionStorage.setItem('email', '<?php echo addslashes($_SESSION['email']); ?>');
        console.log('[Session] Email stored in sessionStorage:', sessionStorage.getItem('email'));
        <?php endif; ?>
    </script>
    
    <script type="module" src="../js/main.js"></script>
</body>
</html>
