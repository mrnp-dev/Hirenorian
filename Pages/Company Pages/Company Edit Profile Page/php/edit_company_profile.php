<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Company Profile - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Company Dashboard/css/variables.css">
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/edit_company_profile.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
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
                <a href="../../Company Dashboard/php/company_dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../Company Profile Page/php/company_profile.php" class="nav-item active">
                    <i class="fa-solid fa-building"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-briefcase"></i>
                    <span>Job Listing</span>
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
                        <img src="https://logo.clearbit.com/riotgames.com" alt="Company" class="user-img">
                        <span class="user-name">Company Name</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Edit Profile Content -->
            <main class="dashboard-body">
                <div class="page-header">
                    <h1 class="page-title">Edit Company Profile</h1>
                    <div class="header-actions">
                        <a href="../../Company Profile Page/php/company_profile.php" class="btn-secondary">
                            <i class="fa-solid fa-xmark"></i> Cancel
                        </a>
                        <button class="btn-primary" onclick="saveAllChanges()">
                            <i class="fa-solid fa-check"></i> Save All Changes
                        </button>
                    </div>
                </div>

                <div class="edit-grid">
                    <!-- Company Information Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fa-solid fa-building"></i> Company Information</h2>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="companyName">Company Name</label>
                                <input type="text" id="companyName" value="Company Name"
                                    placeholder="Enter company name">
                            </div>
                            <div class="form-group">
                                <label for="companyTagline">Tagline</label>
                                <input type="text" id="companyTagline"
                                    value="Private, global video game developer and publisher"
                                    placeholder="Enter company tagline">
                            </div>
                            <div class="form-group">
                                <label for="companyIndustry">Industry</label>
                                <input type="text" id="companyIndustry" value="Video game industry"
                                    placeholder="Enter industry">
                            </div>
                        </div>
                    </div>

                    <!-- About Us Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fa-solid fa-info-circle"></i> About Us</h2>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="aboutUs">Company Description</label>
                                <textarea id="aboutUs" rows="6"
                                    placeholder="Enter company description">Riot Games is an American video game developer, publisher, and esports tournament organizer based in Los Angeles, California. The company was founded in 2006 by Brandon Beck and Marc Merrill with a "player-first" philosophy, aiming to continuously improve and support games long-term rather than focusing on new releases.</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Why Join Us Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fa-solid fa-lightbulb"></i> Why Join Us</h2>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="whyJoinUs">Why Join Us Description</label>
                                <textarea id="whyJoinUs" rows="6"
                                    placeholder="Enter why join us description">Offers a chance to build iconic player-focused experiences in a passionate, inclusive culture with strong autonomy, great benefits (health, family, generous PTO, retirement match, play fund), and a focus on continuous learning, all while working on globally beloved titles like League of Legends and Valorant.</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information Card -->
                    <div class="card">
                        <div class="card-header">
                            <h2><i class="fa-solid fa-address-card"></i> Contact Information</h2>
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="contactEmail">Email</label>
                                <input type="email" id="contactEmail" value="careers@riotgames.com"
                                    placeholder="Enter contact email">
                            </div>
                            <div class="form-group">
                                <label for="contactLocation">Location</label>
                                <input type="text" id="contactLocation" value="Los Angeles, USA"
                                    placeholder="Enter location">
                            </div>
                            <div class="form-group">
                                <label for="contactWebsite">Website</label>
                                <input type="url" id="contactWebsite" value="https://www.riotgames.com"
                                    placeholder="Enter website URL">
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="../../Company Dashboard/js/dashboard.js"></script>
    <script src="../js/edit_company_profile.js"></script>
</body>

</html>