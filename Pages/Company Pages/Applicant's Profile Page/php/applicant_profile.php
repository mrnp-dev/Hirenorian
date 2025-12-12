<?php
session_start();
// Company Session Check
if (!isset($_SESSION['company_email'])) {
    // Handling session check
}

// Data will be loaded dynamically via JavaScript
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applicant Profile - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Company Dashboard/css/variables.css">
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Reusing dashboard styles for Sidebar/TopBar -->

    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/profile.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
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

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfileBtn">
                    <div class="user-info">
                        <div class="user-avatar">
                            <!-- Placeholder -->
                        </div>
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <main class="dashboard-body">
                <!-- Back Navigation + Label -->
                <div class="profile-nav-header">
                    <a href="../../Job Listing Page/php/job_listing.php" class="btn-back">
                        <i class="fa-solid fa-arrow-left"></i> Back to Job Listings
                    </a>
                    <h2 class="page-label">Applicant Profile</h2>
                </div>

                <!-- Cover Banner -->
                <div class="profile-banner"></div>

                <div class="profile-container">
                    <!-- Profile Header Card -->
                    <div class="profile-header-card">
                        <div class="profile-header-content">
                            <div class="profile-avatar-wrapper">
                                <img src="../../../Landing Page/Images/gradpic2.png" alt="Profile Picture"
                                    class="profile-avatar">
                            </div>
                            <div class="profile-info">
                                <h1 class="profile-name">Loading...</h1>
                                <p class="profile-headline">Loading profile information...</p>
                                <p class="profile-location"><i class="fa-solid fa-location-dot"></i> Loading...</p>
                            </div>
                            <!-- No Edit Button for Company View -->
                        </div>
                    </div>

                    <div class="profile-grid-v2">
                        <!-- Left Sidebar (Sticky) -->
                        <div class="profile-sidebar">
                            <!-- Contact Info -->
                            <div class="card info-card">
                                <h3>Contact Information</h3>
                                <div class="info-item">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span>Loading...</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>Loading...</span>
                                </div>
                            </div>

                            <!-- Skills -->
                            <div class="card skills-card">
                                <h3>Skills</h3>
                                <div class="skill-category">
                                    <h4>Technical</h4>
                                    <div class="tags">
                                        <span>HTML/CSS</span>
                                        <span>JavaScript</span>
                                        <span>PHP</span>
                                        <span>MySQL</span>
                                        <span>React</span>
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h4>Soft Skills</h4>
                                    <div class="tags">
                                        <span>Communication</span>
                                        <span>Teamwork</span>
                                        <span>Problem Solving</span>
                                        <span>Time Management</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content -->
                        <div class="profile-main">
                            <!-- About Me -->
                            <div class="card section-card">
                                <h2>About Me</h2>
                                <p class="section-text">Loading...</p>
                            </div>

                            <!-- Experience -->
                            <div class="card section-card">
                                <h2>Experience</h2>
                                <div class="timeline-v2">
                                    <p style="color: #999; text-align: center;">Loading...</p>
                                </div>
                            </div>

                            <!-- Education -->
                            <div class="card section-card">
                                <h2>Education</h2>
                                <div class="timeline-v2">
                                    <p style="color: #999; text-align: center;">Loading...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Reusing dashboard.js for shared behavior if needed, or local profile.js -->
    <script src="../js/profile.js"></script>
</body>

</html>