<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    // Logic removed. ID/Data will be fetched via JS.
} else {
    header("Location: ../../../Landing Page/php/landing_page.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/profile.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
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

        .skeleton-block {
            width: 100%;
            height: 100px;
            border-radius: 8px;
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
                <a href="../../../Landing Page/php/landing_page.php"
                    style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <span class="logo-text">Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="../../Student Dashboard Page/php/student_dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="nav-item active">
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
                        <span class="user-name skeleton skeleton-text" id="headerProfileName" style="width: 100px;">Student</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <main class="dashboard-body">
                <!-- Cover Banner -->
                <div class="profile-banner"></div>

                <div class="profile-container">
                    <!-- Profile Header Card -->
                    <div class="profile-header-card">
                        <div class="profile-header-content">
                            <div class="profile-avatar-wrapper">
                                <img src="../../../Landing Page/Images/gradpic2.png" alt="Profile Picture" class="profile-avatar skeleton" id="mainProfileAvatar">
                            </div>
                            <div class="profile-info">
                                <h1 class="profile-name skeleton skeleton-text" id="mainProfileName" style="width: 250px;">Student Name</h1>
                                <p class="profile-headline skeleton skeleton-text" id="mainProfileHeadline" style="width: 300px; margin-top: 10px;">Student Description</p>
                                <p class="profile-location" id="mainProfileLocation">
                                    <i class="fa-solid fa-location-dot"></i> <span class="skeleton skeleton-text" style="width: 100px;">Location</span>
                                </p>
                            </div>
                            <div class="profile-actions">
                                <a href="../../Student Edit Profile Page/php/edit_profile.php" class="btn-primary">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                                </a>
                            </div>
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
                                    <span id="contactPersonalEmail" class="skeleton skeleton-text" style="width: 150px;">email@example.com</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    <span id="contactStudentEmail" class="skeleton skeleton-text" style="width: 150px;">student@school.edu</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span id="contactPhone" class="skeleton skeleton-text" style="width: 100px;">09123456789</span>
                                </div>
                            </div>

                            <!-- Skills -->
                            <div class="card skills-card">
                                <h3>Skills</h3>
                                
                                <div class="skill-category">
                                    <h4>Technical</h4>
                                    <div class="tags" id="techSkillsContainer">
                                        <span class="skeleton skeleton-text" style="width: 60px;"></span>
                                        <span class="skeleton skeleton-text" style="width: 80px;"></span>
                                        <span class="skeleton skeleton-text" style="width: 50px;"></span>
                                    </div>
                                </div>
                                
                                <div class="skill-category">
                                    <h4>Soft Skills</h4>
                                    <div class="tags" id="softSkillsContainer">
                                        <span class="skeleton skeleton-text" style="width: 70px;"></span>
                                        <span class="skeleton skeleton-text" style="width: 60px;"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content -->
                        <div class="profile-main">
                            <!-- About Me -->
                            <div class="card section-card">
                                <h2>About Me</h2>
                                <p class="section-text skeleton skeleton-block" id="aboutMeContent">
                                    <!-- Content will be injected -->
                                </p>
                            </div>

                            <!-- Experience -->
                            <div class="card section-card">
                                <h2>Experience</h2>
                                <div class="timeline-v2" id="experienceTimeline">
                                    <!-- Skeleton Item -->
                                    <div class="timeline-item">
                                        <div class="timeline-icon skeleton"></div>
                                        <div class="timeline-content">
                                            <h3 class="skeleton skeleton-text" style="width: 200px;">Job Title</h3>
                                            <p class="skeleton skeleton-text" style="width: 150px; margin-top:5px;"></p>
                                            <p class="skeleton skeleton-block" style="height: 60px; margin-top:10px;"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Education -->
                            <div class="card section-card">
                                <h2>Education</h2>
                                <div class="timeline-v2" id="educationTimeline">
                                     <!-- Skeleton Item -->
                                     <div class="timeline-item">
                                        <div class="timeline-icon skeleton"></div>
                                        <div class="timeline-content">
                                            <h3 class="skeleton skeleton-text" style="width: 200px;">Degree</h3>
                                            <p class="skeleton skeleton-text" style="width: 150px; margin-top:5px;"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script>
        window.STUDENT_EMAIL = "<?php echo $student_email; ?>";
    </script>
    <script type="module" src="../js/profile.js"></script>
</body>

</html>