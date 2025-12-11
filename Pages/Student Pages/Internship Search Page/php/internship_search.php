<?php
session_start();
if(!isset($_SESSION['email'])) {
    header("Location: ../../../Landing Page/php/landing_page.php");
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
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
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
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img">
                        <span class="user-name">Student</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
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
                        <input type="text" placeholder="Job Title, Keywords...">
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

                        <div class="job-list">
                            <!-- Job Card 1 (Active) -->
                            <div class="job-card active" data-id="1">
                                <div class="job-card-header">
                                    <img src="../../../Landing Page/Images/Companies/cloudstaff_logo.jpg" alt="Logo" class="company-logo">
                                    <div class="job-info">
                                        <h3>Junior UI/UX Designer</h3>
                                        <p class="company-name">Cloudstaff</p>
                                    </div>
                                </div>
                                <p class="job-snippet">We are looking for a young talented designer to help us create stunning websites and apps.</p>
                                <div class="job-tags">
                                    <span class="tag">Full Time</span>
                                    <span class="tag">Design</span>
                                    <span class="tag">Remote</span>
                                </div>
                            </div>

                            <!-- Job Card 2 -->
                            <div class="job-card" data-id="2">
                                <div class="job-card-header">
                                    <img src="../../../Landing Page/Images/google.jpg" alt="Logo" class="company-logo">
                                    <div class="job-info">
                                        <h3>Software Engineer Intern</h3>
                                        <p class="company-name">Google</p>
                                    </div>
                                </div>
                                <p class="job-snippet">Join our engineering team to build scalable software solutions and learn from the best.</p>
                                <div class="job-tags">
                                    <span class="tag">Internship</span>
                                    <span class="tag">Engineering</span>
                                    <span class="tag">Hybrid</span>
                                </div>
                            </div>

                            <!-- Job Card 3 -->
                            <div class="job-card" data-id="3">
                                <div class="job-card-header">
                                    <img src="../../../Landing Page/Images/samsung.jpg" alt="Logo" class="company-logo">
                                    <div class="job-info">
                                        <h3>Data Analyst</h3>
                                        <p class="company-name">Samsung</p>
                                    </div>
                                </div>
                                <p class="job-snippet">Analyze complex datasets to drive business decisions and improve product performance.</p>
                                <div class="job-tags">
                                    <span class="tag">Full Time</span>
                                    <span class="tag">Data</span>
                                    <span class="tag">On-site</span>
                                </div>
                            </div>

                             <!-- Job Card 4 -->
                             <div class="job-card" data-id="4">
                                <div class="job-card-header">
                                    <img src="../../../Landing Page/Images/hyundai.jpg" alt="Logo" class="company-logo">
                                    <div class="job-info">
                                        <h3>Mechanical Engineering Intern</h3>
                                        <p class="company-name">Hyundai</p>
                                    </div>
                                </div>
                                <p class="job-snippet">Assist in the design and testing of automotive components in a state-of-the-art facility.</p>
                                <div class="job-tags">
                                    <span class="tag">Internship</span>
                                    <span class="tag">Engineering</span>
                                    <span class="tag">On-site</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Job Details Panel -->
                    <div class="job-details-section">
                        <div class="job-details-card">
                            <div class="details-header">
                                <div class="header-main">
                                    <img src="../../../Landing Page/Images/Companies/cloudstaff_logo.jpg" alt="Logo" class="details-logo" id="detail-logo">
                                    <div class="header-info">
                                        <h2 id="detail-title">Junior UI/UX Designer</h2>
                                        <p id="detail-company">Cloudstaff, Pampanga</p>
                                    </div>
                                </div>
                                <div class="header-actions">
                                    <button class="btn-apply-now">Apply Now</button>
                                    <button class="btn-save"><i class="fa-regular fa-bookmark"></i> Save</button>
                                </div>
                            </div>

                            <div class="details-body">
                                <div class="details-section">
                                    <h3>Job Description</h3>
                                    <p id="detail-desc">
                                        We are looking for a talented fresher UI/UX Designer who is passionate about designing custom websites with proficiency in Photoshop. 
                                        The candidate will work closely with our development and design teams to create visually appealing and user-friendly custom website designs for our clients.
                                    </p>
                                </div>

                                <div class="details-section">
                                    <h3>Roles & Responsibilities</h3>
                                    <ul id="detail-roles">
                                        <li>Gather and evaluate user requirements in collaboration with product managers and engineers</li>
                                        <li>Illustrate design ideas using storyboards, process flows and sitemaps</li>
                                        <li>Design graphic user interface elements, like menus, tabs and widgets</li>
                                        <li>Build page navigation buttons and search fields</li>
                                        <li>Develop UI mockups and prototypes that clearly illustrate how sites function and look like</li>
                                        <li>Create original graphic designs (e.g. images, sketches and tables)</li>
                                        <li>Prepare and present rough drafts to internal teams and key stakeholders</li>
                                        <li>Identify and troubleshoot UX problems (e.g. responsiveness)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    </div>

    <script src="../js/internship_search.js"></script>
</body>
</html>
