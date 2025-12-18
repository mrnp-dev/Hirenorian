<?php
session_start();

// 1. Authorize Student
if (!isset($_SESSION['email'])) {
    header("Location: ../../../../Landing Page Tailwind/php/landing_page.php");
    exit();
}

$student_email = $_SESSION['email'];

// Fetch student information (for Sidebar/Top Bar)
$studentApiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php";
$ch = curl_init($studentApiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["student_email" => $student_email]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$studentResponse = curl_exec($ch);
curl_close($ch);

$first_name = "Student";
$last_name = "";
$profile_picture = "";

if ($studentResponse !== false) {
    $studentData = json_decode($studentResponse, true);
    if (isset($studentData['status']) && $studentData['status'] === "success") {
        $basic_info = $studentData['data']['basic_info'];
        $profile = $studentData['data']['profile'];
        $first_name = $basic_info['first_name'];
        $last_name = $basic_info['last_name'];
        $profile_picture_db = $profile['profile_picture'];
        if (!empty($profile_picture_db)) {
            $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
        }
    }
}

// 2. Fetch Company Information
if (!isset($_GET['id'])) {
    // Fallback or Error
    echo "No company specified.";
    exit();
}

$target_company_id = $_GET['id'];
$companyApiUrl = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_information.php";

$ch = curl_init($companyApiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "company_id" => $target_company_id
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$companyResponse = curl_exec($ch);
curl_close($ch);

$companyData = json_decode($companyResponse, true);
$error_message = "";

if ($companyData && isset($companyData['status']) && $companyData['status'] === "success") {
    // --- Base company info ---
    $company = $companyData['company'];
    $company_name = $company['company_name'];
    $company_email_contact = $company['email']; // Renamed to avoid collision with session email if any
    $phone_number = $company['phone_number'];
    $company_type = $company['company_type'];
    $address = $company['address'];
    $industry = $company['industry'];
    
    $verification_val = isset($company['verification']) ? $company['verification'] : false;
    $is_verified = ($verification_val === true || $verification_val === 'true' || $verification_val == 1);

    // --- Statistics ---
    // Note: The API response structure for 'statistics' is an array of objects
    // based on existing company_profile.php logic: $stat = $data['statistics'][0];
    $total_applicants = 0;
    $accepted = 0;
    $rejected = 0;
    if (!empty($companyData['statistics'])) {
        $stat = $companyData['statistics'][0];
        $total_applicants = $stat['total_applicants'] ?? $stat['employees'] ?? 0;
        $accepted = $stat['accepted'] ?? 0;
        $rejected = $stat['rejected'] ?? 0;
    }

    // --- Additional Info ---
    $about_us = "";
    $why_join_us = "";
    $website_link = "";
    $tagline = "";
    if (!empty($companyData['additional_info'])) {
        $info = $companyData['additional_info'][0];
        $about_us = $info['about_us'];
        $why_join_us = $info['why_join_us'];
        $website_link = $info['website_link'];
        $tagline = $info['tagline'];
    }

    // --- Locations ---
    $locations = $companyData['locations'];

    // --- Contacts ---
    $contacts = $companyData['contacts'];

    // --- Perks ---
    $perks = $companyData['perks'];

    // --- Images ---
    $company_icon_url = "";
    if (!empty($companyData['icons'])) {
        $company_icon_url = $companyData['icons'][0]['icon_url'];
        $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $company_icon_url);
    }
    
    $is_default_icon = false;
    if (empty($company_icon_url)) {
        $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
        $is_default_icon = true;
    }

    $company_banner_url = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80";
    if (!empty($companyData['banners'])) {
        $url = $companyData['banners'][0]['banner_url'];
        $company_banner_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
    }

} else {
    $error_message = $companyData['message'] ?? "Failed to load company information.";
    // Handle error gracefully?
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($company_name ?? 'Company Profile'); ?> - Hirenorian</title>
    
    <!-- Student Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    
    <!-- Company Profile CSS (Copied/Reused) -->
    <link rel="stylesheet" href="../css/style.css">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* Adjustments when embedding in student layout */
        .content-wrapper {
            padding: 0; /* Remove extra padding if any, allow main-content logic to handle */
        }
        .page-title {
            margin-bottom: 24px;
        }
        /* Hide edit buttons via CSS just in case */
        .edit-mode-trigger-container, .btn-account-action {
            display: none !important;
        }
        /* Hide account manager card entirely */
        .account-manager-card {
            display: none !important;
        }
        
        /* Override top-bar alignment to allow left content */
        .top-bar {
            justify-content: space-between !important;
        }
        
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Student Sidebar -->
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
                <a href="../../Student Internship Search Page New/php/internship_search.php" class="nav-item active">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Internship Search</span>
                </a>
                <a href="../../Help Page/php/help.php" class="nav-item">
                    <i class="fa-solid fa-circle-question"></i>
                    <span>Help</span>
                </a>
            </nav>
        </aside>

        <!-- Main Content (Student Layout) -->
        <div class="main-content">
             <!-- Top Bar -->
             <header class="top-bar">
                <div class="top-bar-left">
                     <!-- Back Button -->
                     <a href="../../Student Internship Search Page New/php/internship_search.php" class="btn-back" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:var(--text-dark); font-weight:500;">
                        <i class="fa-solid fa-arrow-left"></i> Back to Search
                     </a>
                </div>
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn">
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Student" class="user-img">
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </header>

            <main class="page-body" style="padding: 24px; max-width: 1400px; margin: 0 auto;">
                <?php if ($error_message): ?>
                    <div class="error-state">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <h3>Error Loading Profile</h3>
                        <p><?php echo htmlspecialchars($error_message); ?></p>
                        <a href="../../Student Internship Search Page New/php/internship_search.php" class="btn-primary-action">Return to Search</a>
                    </div>
                <?php else: ?>
                
                <!-- Company Profile Content (Read Only) -->
                <div id="view-profile-container">

                    <!-- Profile Hero Section -->
                    <div class="profile-hero">
                        <!-- Banner as Background -->
                        <div class="profile-banner-container">
                            <img src="<?php echo $company_banner_url; ?>" alt="Company Banner"
                                class="company-banner" id="viewCompanyBanner">
                        </div>

                        <!-- Hero Content -->
                        <div class="profile-hero-content">
                            <div class="company-icon-container" style="position: relative;">
                                <img src="<?php echo $company_icon_url; ?>" alt="Company Logo"
                                    class="company-icon <?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                    id="viewCompanyIcon">
                                <?php if ($is_verified): ?>
                                    <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=10b981"
                                        alt="Verified" class="header-verification-badge verified"
                                        title="Verified Account"
                                        style="width: 28px; height: 28px; bottom: 4px; right: 4px;">
                                <?php else: ?>
                                    <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=ef4444"
                                        alt="Unverified" class="header-verification-badge unverified"
                                        title="Unverified Account"
                                        style="width: 28px; height: 28px; bottom: 4px; right: 4px;">
                                <?php endif; ?>
                            </div>
                            <div class="company-hero-info">
                                <h1 class="company-name" id="viewCompanyName">
                                    <?php echo htmlspecialchars($company_name); ?>
                                </h1>
                                <p class="company-tagline" id="viewCompanyTagline">
                                    <?php echo $tagline ? htmlspecialchars($tagline) : "No tagline provided"; ?>
                                </p>
                                <div class="company-meta">
                                    <span class="company-industry" id="viewCompanyIndustry">
                                        <i class="fa-solid fa-briefcase"></i>
                                        <?php echo htmlspecialchars($industry); ?>
                                    </span>
                                    <span class="company-industry">
                                        <i class="fa-solid fa-building"></i>
                                        <?php echo htmlspecialchars($company_type); ?>
                                    </span>
                                    <?php if ($is_verified): ?>
                                        <span class="verification-badge-wrapper verified">
                                            <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=6ee7b7"
                                                alt="Verified" class="verification-icon">
                                            Verified
                                        </span>
                                    <?php else: ?>
                                        <span class="verification-badge-wrapper unverified">
                                            <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=fca5a5"
                                                alt="Unverified" class="verification-icon"
                                                title="Unverified Account">
                                            Unverified
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Compact 2-Column Layout -->
                    <div class="profile-content-grid">
                        <!-- Left Sidebar -->
                        <div class="profile-sidebar">
                            <!-- Contact Information -->
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fa-solid fa-address-book"></i> Contact Info</h3>
                                </div>
                                <div class="info-items" id="viewContactInfo">
                                    <div class="info-item">
                                        <i class="fa-solid fa-envelope"></i>
                                        <span id="viewContactEmail"><?php echo htmlspecialchars($company_email_contact); ?></span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fa-solid fa-location-dot"></i>
                                        <span id="viewContactLocation"><?php echo htmlspecialchars($address); ?></span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fa-solid fa-phone"></i>
                                        <span id="viewContactPhone"><?php echo $phone_number ? htmlspecialchars($phone_number) : "No phone number"; ?></span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fa-solid fa-globe"></i>
                                        <a href="<?php echo $website_link ? htmlspecialchars($website_link) : "#"; ?>" target="_blank"
                                            id="viewContactWebsite">
                                            <?php echo $website_link ? htmlspecialchars($website_link) : "No website link"; ?>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Company Statistics -->
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fa-solid fa-chart-pie"></i> Statistics</h3>
                                </div>
                                <div class="stat-items">
                                    <div class="stat-item">
                                        <div class="stat-left">
                                            <div class="stat-icon-wrapper">
                                                <i class="fa-solid fa-users"></i>
                                            </div>
                                            <span class="stat-label">Total Applicants</span>
                                        </div>
                                        <span id="viewTotalApplicants"
                                            class="stat-value"><?php echo $total_applicants ? $total_applicants : 0 ?></span>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-left">
                                            <div class="stat-icon-wrapper">
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                            <span class="stat-label">Accepted</span>
                                        </div>
                                        <span id="viewAccepted"
                                            class="stat-value"><?php echo $accepted ? $accepted : 0 ?></span>
                                    </div>
                                    <!-- Removed Rejected for public view? Maybe keep it. -->
                                </div>
                            </div>

                        </div>

                        <!-- Main Content Area -->
                        <div class="profile-main">
                            <!-- About Us -->
                            <div class="card">
                                <div class="card-header">
                                    <h2><i class="fa-solid fa-building"></i> About Us</h2>
                                </div>
                                <p class="section-text" id="viewAboutUsText">
                                    <?php echo $about_us ? nl2br(htmlspecialchars($about_us)) : "No about us provided" ?>
                                </p>
                            </div>

                            <!-- Why Join Us -->
                            <div class="card">
                                <div class="card-header">
                                    <h2><i class="fa-solid fa-lightbulb"></i> Why Join Us</h2>
                                </div>
                                <p class="section-text" id="viewWhyJoinText">
                                    <?php echo $why_join_us ? nl2br(htmlspecialchars($why_join_us)) : "No why join us provided" ?>
                                </p>
                            </div>

                            <!-- Perks & Benefits -->
                            <div class="card">
                                <div class="card-header">
                                    <h2><i class="fa-solid fa-gift"></i> Perks & Benefits</h2>
                                </div>
                                <ul class="benefits-list" id="viewPerksList">
                                    <?php if (!empty($perks)): ?>
                                        <?php foreach ($perks as $index => $perk): ?>
                                            <li class="benefit-item">
                                                <span><?php echo htmlspecialchars($perk['perk']); ?></span>
                                            </li>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <li class="benefit-item no-perks">
                                            <span>No perks listed</span>
                                        </li>
                                    <?php endif; ?>
                                </ul>
                            </div>

                            <!-- Office Locations -->
                            <div class="card">
                                <div class="card-header">
                                    <h2><i class="fa-solid fa-map-location-dot"></i> Office Locations</h2>
                                </div>
                                <div class="locations-list" id="viewLocationsList">
                                    <?php if (!empty($locations)): ?>
                                        <?php foreach ($locations as $index => $loc): ?>
                                            <div class="location-item">
                                                <div class="location-icon">
                                                    <i class="fa-solid fa-map-marker-alt"></i>
                                                </div>
                                                <div class="location-content">
                                                    <h4><?php echo htmlspecialchars($loc['location']); ?></h4>
                                                    <p class="location-description">
                                                        <?php echo htmlspecialchars($loc['description']); ?>
                                                    </p>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <div class="location-item no-locations">
                                            <div class="location-icon">
                                                <i class="fa-solid fa-map-marker-alt"></i>
                                            </div>
                                            <div class="location-content">
                                                <h4>No office locations listed</h4>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                            
                            <!-- Contact Persons - Maybe hide email/phone for public? -->
                            <!-- User said "just take the same company profile... remove editing". Assuming info is okay to show. -->
                            <div class="card">
                                <div class="card-header">
                                    <h2><i class="fa-solid fa-user-tie"></i> Contact Persons</h2>
                                </div>
                                <div class="contacts-list" id="viewContactsList">
                                    <?php if (!empty($contacts)): ?>
                                        <?php foreach ($contacts as $index => $contact): ?>
                                            <div class="contact-person-item">
                                                <div class="contact-info">
                                                    <h4><?php echo htmlspecialchars($contact['contact_name']); ?></h4>
                                                    <p class="contact-position">Position:
                                                        <?php echo htmlspecialchars($contact['position']); ?>
                                                    </p>
                                                    <p class="contact-email">Email:
                                                        <?php echo htmlspecialchars($contact['email']); ?>
                                                    </p>
                                                    <p class="contact-phone">Number:
                                                        <?php echo htmlspecialchars($contact['contact_number']); ?>
                                                    </p>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <div class="contact-person-item no-contacts">
                                            <div class="contact-info">
                                                <h4>No contact persons listed</h4>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <?php endif; ?>
            </main>
        </div>
    </div>
</body>
</html>
