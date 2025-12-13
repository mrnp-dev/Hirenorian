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
    curl_close($ch);

    $data = json_decode($response, true);

    // Extract company information
    if (isset($data['company'])) {
        $company = $data['company'];
        $company_name = $company['company_name'];

        $company_icon_url = "https://via.placeholder.com/40"; // Default
        if (!empty($data['icons'])) {
            $url = $data['icons'][0]['icon_url'];
            $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
        }

        // Default Icon Logic
        $is_default_icon = false;
        if (empty($company_icon_url)) {
            $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            $is_default_icon = true;
        }
    } else {
        $company_name = "Company User";
        $company_icon_url = "https://via.placeholder.com/40";
    }
} else {
    header("Location: ../../../Landing Page/php/landing_page.php");
    exit();
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

            </ul>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfileBtn">
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="<?php echo $company_icon_url; ?>" alt="Profile"
                                class="<?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        </div>
                        <span class="user-name"><?php echo htmlspecialchars($company_name); ?></span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item" id="signOutBtn">Sign Out</a>
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
                                    <span id="contactPersonalEmail">Loading...</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                    <span id="contactStudentEmail">Loading...</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span id="contactPhone">Loading...</span>
                                </div>
                            </div>

                            <!-- Skills -->
                            <div class="card skills-card">
                                <h3>Skills</h3>
                                <div class="skill-category">
                                    <h4>Technical</h4>
                                    <div class="tags" id="technicalSkillsTags">
                                        <span style="color: #999;">Loading...</span>
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h4>Soft Skills</h4>
                                    <div class="tags" id="softSkillsTags">
                                        <span style="color: #999;">Loading...</span>
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