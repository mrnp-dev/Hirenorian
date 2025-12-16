<?php
session_start();

if (isset($_SESSION['email'])) {
    $company_email = $_SESSION['email'];

    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_information.php";

    // Send JSON with "company_email"
    $payload = json_encode([
        "company_email" => $company_email
    ]);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {
        die("Curl error: " . curl_error($ch));
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if ($data['status'] === "success") {
        // --- Base company info ---
        $company = $data['company'];
        $company_id = $company['company_id'];
        $company_name = $company['company_name'];
        $company_email = $company['email'];
        $phone_number = $company['phone_number'];
        $company_type = $company['company_type'];
        $address = $company['address'];
        $industry = $company['industry'];
        // Check for boolean true, string "true", or integer 1
        $verification_val = isset($company['verification']) ? $company['verification'] : false;
        $is_verified = ($verification_val === true || $verification_val === 'true' || $verification_val == 1);

        // --- Statistics (dynamic record) ---
        if (!empty($data['statistics'])) {
            $stat = $data['statistics'][0];
            $total_applicants = $stat['total_applicants'];
            $accepted = $stat['accepted'];
            $rejected = $stat['rejected'];
        }

        // --- Additional Info (single record expected) ---
        if (!empty($data['additional_info'])) {
            $info = $data['additional_info'][0];
            $company_add_id = $info['company_add_id'];
            $about_us = $info['about_us'];
            $why_join_us = $info['why_join_us'];
            $website_link = $info['website_link'];
            $tagline = $info['tagline'];
        }

        // --- Locations (multiple records) ---
        $locations = $data['locations'];

        // --- Contacts (multiple records) ---
        $contacts = $data['contacts'];

        // --- Perks (multiple records) ---
        $perks = $data['perks'];

        // --- Images (Icons & Banners) ---
        $company_icon_url = "";
        if (!empty($data['icons'])) {
            $company_icon_url = $data['icons'][0]['icon_url'];
            $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $company_icon_url);
        }

        // Default Icon Logic
        $is_default_icon = false;
        if (empty($company_icon_url)) {
            $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            $is_default_icon = true;
        }

        $company_banner_url = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"; // Default
        if (!empty($data['banners'])) {
            $url = $data['banners'][0]['banner_url'];
            $company_banner_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
        }
    } else {
        $error_message = $data['message'];
    }

} else {
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Profile - Hirenorian</title>
    <!-- Shared CSS from Dashboard -->
    <link rel="stylesheet" href="../../Company Dashboard/css/variables.css">
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/company_profile.css">
    <!-- Reset Password CSS -->
    <link rel="stylesheet"
        href="../../../Account Registration Pages/Company Registration Page/Reset Password UI/css/reset_password.css">
    <!-- Toast CSS -->
    <link rel="stylesheet" href="../../../Account Registration Pages/Company Registration Page/css/toast.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>
    <div class="dashboard-container">
        <!-- Hidden Inputs for JS -->
        <input type="hidden" id="company_id" value="<?php echo htmlspecialchars($company_id ?? ''); ?>">
        <input type="hidden" id="company_email" value="<?php echo htmlspecialchars($company_email ?? ''); ?>">

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
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span class="link-text">Company Profile</span>
                    </a>
                </li>
                <li class="nav-item">
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

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfile">
                    <div class="user-info">
                        <div class="user-avatar-wrapper" style="position: relative; display: inline-block;">
                            <img src="<?php echo $company_icon_url; ?>" alt="Profile"
                                class="user-avatar <?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                            <?php if ($is_verified): ?>
                                <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=10b981" alt="Verified"
                                    class="header-verification-badge verified" title="Verified Account">
                            <?php else: ?>
                                <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=ef4444"
                                    alt="Unverified" class="header-verification-badge unverified"
                                    title="Unverified Account">
                            <?php endif; ?>
                        </div>
                        <span class="user-name"><?php echo $company_name; ?></span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item" id="signOutBtn">Sign Out</a>
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <div class="page-title">
                    <h1>Company Profile</h1>
                </div>

                <!-- Company Profile Content -->
                <section class="content-section active">
                    <!-- ==================== VIEW MODE CONTAINER ==================== -->
                    <div id="view-profile-container">

                        <!-- Profile Hero Section -->
                        <div class="profile-hero">
                            <!-- Edit Button -->
                            <div class="edit-mode-trigger-container">
                                <button class="btn-primary-action" onclick="toggleEditMode(true)">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                                </button>
                            </div>

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
                                        <?php echo $tagline ? $tagline : "No tagline provided"; ?>
                                    </p>
                                    <div class="company-meta">
                                        <span class="company-industry" id="viewCompanyIndustry">
                                            <i class="fa-solid fa-briefcase"></i>
                                            <?php echo $industry ?>
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
                                                    title="Please head over to the Account Manager to verify your account.">
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
                                            <span id="viewContactEmail"><?php echo $company_email; ?></span>
                                        </div>
                                        <div class="info-item">
                                            <i class="fa-solid fa-location-dot"></i>
                                            <span id="viewContactLocation"><?php echo $address; ?></span>
                                        </div>
                                        <div class="info-item">
                                            <i class="fa-solid fa-phone"></i>
                                            <span
                                                id="viewContactPhone"><?php echo $phone_number ? $phone_number : "No phone number"; ?></span>
                                        </div>
                                        <div class="info-item">
                                            <i class="fa-solid fa-globe"></i>
                                            <a href="<?php echo $website_link ? $website_link : "#"; ?>" target="_blank"
                                                id="viewContactWebsite">
                                                <?php echo $website_link ? $website_link : "Set Website Link"; ?>
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
                                        <div class="stat-item">
                                            <div class="stat-left">
                                                <div class="stat-icon-wrapper">
                                                    <i class="fa-solid fa-xmark"></i>
                                                </div>
                                                <span class="stat-label">Rejected</span>
                                            </div>
                                            <span id="viewRejected"
                                                class="stat-value"><?php echo $rejected ? $rejected : 0 ?></span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Account Manager -->
                                <div class="card account-manager-card">
                                    <div class="card-header">
                                        <h3><i class="fa-solid fa-user-gear"></i> Account</h3>
                                    </div>
                                    <div class="account-actions">
                                        <button class="btn-account-action" onclick="openChangePasswordModal()">
                                            <i class="fa-solid fa-key"></i> Change Password
                                        </button>
                                        <?php if (!$is_verified): ?>
                                            <button class="btn-account-action" onclick="openVerifyAccountModal()">
                                                <i class="fa-solid fa-shield-halved"></i> Verify Account
                                            </button>
                                        <?php endif; ?>
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
                                        <?php echo $about_us ? $about_us : "No about us provided" ?>
                                    </p>
                                </div>

                                <!-- Why Join Us -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-lightbulb"></i> Why Join Us</h2>
                                    </div>
                                    <p class="section-text" id="viewWhyJoinText">
                                        <?php echo $why_join_us ? $why_join_us : "No why join us provided" ?>
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
                                                <li class="benefit-item" data-id="perk-<?php echo $index + 1; ?>">
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
                                                <div class="location-item" data-id="loc-<?php echo $index + 1; ?>">
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

                                <!-- Contact Persons -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-user-tie"></i> Contact Persons</h2>
                                    </div>
                                    <div class="contacts-list" id="viewContactsList">
                                        <?php if (!empty($contacts)): ?>
                                            <?php foreach ($contacts as $index => $contact): ?>
                                                <div class="contact-person-item" data-id="contact-<?php echo $index + 1; ?>">
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

                    <!-- ==================== EDIT MODE CONTAINER ==================== -->
                    <div id="edit-profile-container" style="display: none;">
                        <!-- Sticky Action Bar -->
                        <div class="action-bar-sticky">
                            <span class="edit-mode-label">Editing Company Profile</span>
                            <div class="action-buttons">
                                <button class="btn-cancel" onclick="toggleEditMode(false)">Cancel</button>
                                <button class="btn-save" onclick="saveProfileChanges()">Save Changes</button>
                            </div>
                        </div>

                        <!-- Profile Hero Edit -->
                        <div class="profile-hero">
                            <div class="profile-banner-container edit-mode">
                                <img src="<?php echo $company_banner_url; ?>" alt="Company Banner"
                                    class="company-banner" id="editCompanyBanner">
                            </div>
                            <button class="edit-banner-btn" onclick="openImageUploadModal('banner')"
                                title="Update Banner">
                                <i class="fa-solid fa-camera"></i> Change Banner
                            </button>
                            <div class="profile-hero-content">
                                <div class="company-icon-wrapper">
                                    <img src="<?php echo $company_icon_url; ?>" alt="Company Icon" class="company-icon"
                                        id="editCompanyIcon">
                                    <button class="edit-icon-btn" onclick="openImageUploadModal('icon')"
                                        title="Update Company Icon">
                                        <i class="fa-solid fa-camera"></i>
                                    </button>
                                </div>
                                <div class="company-main-info edit-fields">
                                    <div class="form-group compact">
                                        <label>Company Name</label>
                                        <input type="text" id="editCompanyName" value="<?php echo $company_name; ?>">
                                    </div>
                                    <div class="form-group compact">
                                        <label>Tagline</label>
                                        <input type="text" id="editCompanyTagline"
                                            value="<?php echo $tagline ? $tagline : ""; ?>">
                                    </div>
                                    <div class="form-group compact">
                                        <label>Industry</label>
                                        <input type="text" id="editCompanyIndustry" class="readonly-input"
                                            value="<?php echo $industry; ?>" readonly>
                                    </div>
                                    <div class="form-group compact">
                                        <label>Company Type</label>
                                        <input type="text" class="readonly-input"
                                            value="<?php echo htmlspecialchars($company_type); ?>" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Compact 2-Column Edit Layout -->
                        <div class="profile-content-grid">
                            <!-- Left Sidebar (Edit) -->
                            <div class="profile-sidebar">
                                <!-- Contact Info Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h3><i class="fa-solid fa-address-book"></i> Contact Info</h3>
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-envelope"></i> Email</label>
                                        <input type="email" id="editContactEmail" value="<?php echo $company_email; ?>"
                                            readonly style="background-color: #e9ecef; cursor: not-allowed;">
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-location-dot"></i> Location</label>
                                        <input type="text" id="editContactLocation" value="<?php echo $address; ?>">
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-phone"></i> Phone Number</label>
                                        <input type="text" id="editContactPhone"
                                            value="<?php echo $phone_number ? $phone_number : ""; ?>"
                                            placeholder="09... or +63...">
                                    </div>
                                    <div class="form-group">
                                        <label><i class="fa-solid fa-globe"></i> Website</label>
                                        <input type="url" id="editContactWebsite"
                                            value="<?php echo $website_link ? $website_link : ""; ?>">
                                    </div>
                                </div>

                                <!-- Statistics (Read Only) -->
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
                                            <span
                                                class="stat-value"><?php echo $total_applicants ? $total_applicants : 0 ?></span>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-left">
                                                <div class="stat-icon-wrapper">
                                                    <i class="fa-solid fa-check"></i>
                                                </div>
                                                <span class="stat-label">Accepted</span>
                                            </div>
                                            <span class="stat-value"><?php echo $accepted ? $accepted : 0 ?></span>
                                        </div>
                                        <div class="stat-item">
                                            <div class="stat-left">
                                                <div class="stat-icon-wrapper">
                                                    <i class="fa-solid fa-xmark"></i>
                                                </div>
                                                <span class="stat-label">Rejected</span>
                                            </div>
                                            <span class="stat-value"><?php echo $rejected ? $rejected : 0 ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Main Content Area (Edit) -->
                            <div class="profile-main">
                                <!-- About Us Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-building"></i> About Us</h2>
                                    </div>
                                    <div class="form-group no-margin">
                                        <textarea id="editAboutUsText"
                                            rows="6"><?php echo $about_us ? $about_us : "No about us provided"; ?></textarea>
                                    </div>
                                </div>

                                <!-- Perks Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-gift"></i> Manage Perks</h2>
                                        <button class="add-btn" onclick="openAddModal('perks')" title="Add Perk">
                                            <i class="fa-solid fa-plus"></i> Add
                                        </button>
                                    </div>
                                    <ul class="benefits-list" id="editPerksList">
                                        <?php if (!empty($perks)): ?>
                                            <?php foreach ($perks as $index => $perk): ?>
                                                <?php $perkId = "perk-" . ($index + 1); ?>
                                                <li class="benefit-item" data-id="<?php echo $perkId; ?>">
                                                    <span><?php echo htmlspecialchars($perk['perk']); ?></span>
                                                    <div class="item-actions">
                                                        <button class="action-btn edit"
                                                            onclick="editListItem('<?php echo $perkId; ?>', 'perks')">
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button class="action-btn delete"
                                                            onclick="deleteListItem('<?php echo $perkId; ?>', 'perks')">
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </li>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </ul>
                                </div>

                                <!-- Why Join Us Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-lightbulb"></i> Why Join Us</h2>
                                    </div>
                                    <div class="form-group no-margin">
                                        <textarea id="editWhyJoinText"
                                            rows="6"><?php echo $why_join_us ? $why_join_us : "No why join us provided"; ?></textarea>
                                    </div>
                                </div>

                                <!-- Locations Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-map-location-dot"></i> Manage Locations</h2>
                                        <button class="add-btn" onclick="openAddModal('locations')"
                                            title="Add Location">
                                            <i class="fa-solid fa-plus"></i> Add
                                        </button>
                                    </div>
                                    <div class="locations-list" id="editLocationsList">
                                        <?php if (!empty($locations)): ?>
                                            <?php foreach ($locations as $index => $loc): ?>
                                                <?php $locId = "loc-" . ($index + 1); ?>
                                                <div class="location-item" data-id="<?php echo $locId; ?>">
                                                    <div class="location-icon"><i class="fa-solid fa-map-marker-alt"></i></div>
                                                    <div class="location-content">
                                                        <h4><?php echo htmlspecialchars($loc['location']); ?></h4>
                                                        <p class="location-description">
                                                            <?php echo htmlspecialchars($loc['description']); ?>
                                                        </p>
                                                    </div>
                                                    <div class="item-actions">
                                                        <button class="action-btn edit"
                                                            onclick="editListItem('<?php echo $locId; ?>', 'locations')">
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button class="action-btn delete"
                                                            onclick="deleteListItem('<?php echo $locId; ?>', 'locations')">
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <!-- Contacts Edit -->
                                <div class="card">
                                    <div class="card-header">
                                        <h2><i class="fa-solid fa-user-tie"></i> Manage Contacts</h2>
                                        <button class="add-btn" onclick="openAddModal('contacts')" title="Add Contact">
                                            <i class="fa-solid fa-plus"></i> Add
                                        </button>
                                    </div>
                                    <div class="contacts-list" id="editContactsList">
                                        <?php if (!empty($contacts)): ?>
                                            <?php foreach ($contacts as $index => $contact): ?>
                                                <?php $contId = "contact-" . ($index + 1); ?>
                                                <div class="contact-person-item" data-id="<?php echo $contId; ?>">
                                                    <div class="contact-info">
                                                        <h4><?php echo htmlspecialchars($contact['contact_name'] ?? ''); ?></h4>
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
                                                    <div class="item-actions">
                                                        <button class="action-btn edit"
                                                            onclick="editListItem('<?php echo $contId; ?>', 'contacts')">
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button class="action-btn delete"
                                                            onclick="deleteListItem('<?php echo $contId; ?>', 'contacts')">
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- Image Upload Modal -->
    <div id="imageUploadModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="imageModalTitle">Update Company Profile</h3>
                <button class="close-modal" onclick="closeImageUploadModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="image-preview-container" id="imagePreviewContainer">
                    <img id="imagePreview" src="" alt="Preview" style="display: none;">
                    <div class="upload-placeholder" id="uploadPlaceholder">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <p>Choose an image file</p>
                    </div>
                </div>
                <input type="file" id="imageFileInput" accept="image/*" style="display: none;">
                <button class="btn-upload" onclick="document.getElementById('imageFileInput').click()">
                    <i class="fa-solid fa-folder-open"></i> Choose File
                </button>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeImageUploadModal()">Cancel</button>
                <button class="btn-save" onclick="saveImageChanges()">Save Changes</button>
            </div>
        </div>
    </div>

    <!-- Add/Edit Perk Modal -->
    <div id="perkModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="perkModalTitle">Add Perk</h3>
                <button class="close-modal" onclick="closePerkModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="perkText">Perk Description</label>
                    <input type="text" id="perkText" placeholder="Enter perk description">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closePerkModal()">Cancel</button>
                <button class="btn-save" onclick="savePerk()">Save</button>
            </div>
        </div>
    </div>

    <!-- Add/Edit Location Modal -->
    <div id="locationModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="locationModalTitle">Add Office Location</h3>
                <button class="close-modal" onclick="closeLocationModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="locationName">Location Name</label>
                    <input type="text" id="locationName" placeholder="e.g., Manila, Philippines">
                </div>
                <div class="form-group">
                    <label for="locationDescription">Description</label>
                    <textarea id="locationDescription" rows="3" placeholder="Enter location description"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeLocationModal()">Cancel</button>
                <button class="btn-save" onclick="saveLocation()">Save</button>
            </div>
        </div>
    </div>

    <!-- Add/Edit Contact Person Modal -->
    <div id="contactPersonModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="contactPersonModalTitle">Add Contact Person</h3>
                <button class="close-modal" onclick="closeContactPersonModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="personName">Name</label>
                    <input type="text" id="personName" placeholder="Enter name">
                </div>
                <div class="form-group">
                    <label for="personPosition">Position</label>
                    <input type="text" id="personPosition" placeholder="Enter position">
                </div>
                <div class="form-group">
                    <label for="personEmail">Email</label>
                    <input type="email" id="personEmail" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label for="personPhone">Phone Number</label>
                    <input type="tel" id="personPhone" placeholder="Enter phone number">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeContactPersonModal()">Cancel</button>
                <button class="btn-save" onclick="saveContactPerson()">Save</button>
            </div>
        </div>
    </div>

    <script src="../../Company Dashboard/js/toast.js"></script>
    <script src="../../Company Dashboard/js/dashboard.js"></script>

    <!-- Verify Account Modal -->
    <div id="verifyAccountModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Verify Account</h3>
                <button class="close-modal" onclick="closeVerifyAccountModal()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="section-text" style="margin-bottom: 20px;">Please attach the following documents to verify
                    your account.</p>
                <div class="form-group">
                    <label for="docPhilJobNet">PhilJobNet Registration</label>
                    <input type="file" id="docPhilJobNet" class="file-input-control">
                </div>
                <div class="form-group">
                    <label for="docDole">DOLE Permit / Registration</label>
                    <input type="file" id="docDole" class="file-input-control">
                </div>
                <div class="form-group">
                    <label for="docBir">BIR Form 2303</label>
                    <input type="file" id="docBir" class="file-input-control">
                </div>
                <div class="form-group">
                    <label for="docMayor">Mayor's Permit</label>
                    <input type="file" id="docMayor" class="file-input-control">
                </div>
                <!-- Dynamic Business Type Document -->
                <div class="form-group" id="dynamicDocGroup" style="display: none;">
                    <label id="labelDynamicDoc">Business Registration</label>
                    <input type="file" id="docDynamic" class="file-input-control">
                    <input type="hidden" id="company_type" value="<?php echo htmlspecialchars($company_type); ?>">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeVerifyAccountModal()">Cancel</button>
                <button class="btn-save" onclick="submitVerifyDocuments()">Submit Documents</button>
            </div>
        </div>
    </div>

    <!-- Reset Password UI -->
    <?php include '../../../Account Registration Pages/Company Registration Page/Reset Password UI/php/reset_password.php'; ?>

    <!-- Custom Confirmation Modal -->
    <div class="confirmation-modal-overlay" id="confirmationModalOverlay" style="display: none;">
        <div class="confirmation-modal">
            <div class="confirmation-icon-wrapper" id="confirmationIconWrapper">
                <i class="fa-solid fa-triangle-exclamation" id="confirmationIcon"></i>
            </div>
            <h3 class="confirmation-title" id="confirmationTitle">Confirmation</h3>
            <p class="confirmation-message" id="confirmationMessage">Are you sure you want to proceed?</p>
            <div class="confirmation-actions">
                <button class="btn-confirm-cancel" id="btnConfirmCancel">Cancel</button>
                <button class="btn-confirm-proceed" id="btnConfirmProceed">Confirm</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../../../Account Registration Pages/Company Registration Page/js/toast.js"></script>
    <script
        src="../../../Account Registration Pages/Company Registration Page/Reset Password UI/js/reset_password.js"></script>
    <script src="../js/company_profile.js"></script>
</body>

</html>