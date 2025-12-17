<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
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
        die("Curl error: " . curl_error($ch));
    }
    curl_close($ch);


    $data = json_decode($response, true);

    if (isset($data['status']) && $data['status'] === "success") {
        
        $basic_info = $data['data']['basic_info'];
        $profile = $data['data']['profile'];
        $skills_list = $data['data']['skills'];
        $experience_list = $data['data']['experience'];
        $education_history = $data['data']['education_history'];
        $education_current = $data['data']['education']; // Current university info

        // Basic Info
        $student_id     = $basic_info['student_id'];
        $first_name     = $basic_info['first_name'];
        $last_name      = $basic_info['last_name'];
        $middle_initial = $basic_info['middle_initial'];
        $suffix         = $basic_info['suffix'];
        $personal_email = $basic_info['personal_email'] ?? "Not Provided";
        $phone_number   = $basic_info['phone_number'];
        $student_email  = $basic_info['student_email'];
        $verified_status = $basic_info['verified_status'] ?? 'unverified';


        // Profile Info
        $location       = $profile['location'];
        $about_me       = $profile['about_me'];
        $profile_picture_db = $profile['profile_picture']; // Database path
        
        // Convert VPS absolute path to HTTP URL
        if (!empty($profile_picture_db)) {
            // Path is stored as: /var/www/html/Hirenorian/API/studentDB_APIs/Student%20Accounts/...
            // Convert to: http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Student%20Accounts/...
            $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
        } else {
            $profile_picture = "";
        }

        // Current Education (Assuming one active record for now, or taking the first one)
        $university     = !empty($education_current) ? $education_current[0]['university'] : '';
        $course         = !empty($education_current) ? $education_current[0]['course'] : '';
        $department     = !empty($education_current) ? $education_current[0]['department'] : '';
    } else {
        $error_msg = isset($data['message']) ? $data['message'] : 'Unknown error';
        echo "<script>console.log('Err: " . $error_msg . "');</script>";
        // Initialize variables to empty strings to prevent PHP warnings
        $first_name = $last_name = $middle_initial = $suffix = $location = $about_me = $student_email = $phone_number = $course = $university = "";
        $skills_list = $experience_list = $education_history = $education_current = [];
        $verified_status = 'unverified';
    }
} else {
    header("Location: ../../../Landing Page/php/landing_page.php");
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
</head>

<body>
    <div class="dashboard-container">
        <!-- Left Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page Tailwind/php/landing_page.php"
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
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Student" class="user-img">
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="../../logout.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="../../../Account Registration Pages/Account Selection Page/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <main class="dashboard-body">
                <!-- Hero Section for Profile -->
                <div class="profile-hero">
                    <div class="profile-hero-content">
                        <div class="profile-avatar-wrapper">
                             <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile Picture" class="profile-avatar">
                        </div>
                        <div class="profile-info-main">
                             <h1 class="profile-name">
                                <?php echo htmlspecialchars($first_name . " " . ($middle_initial ? $middle_initial . " " : "") . $last_name . " " . $suffix); ?>
                                <?php if ($verified_status === 'verified'): ?>
                                    <span class="verified-badge" title="Verified Student"><i class="fa-solid fa-circle-check"></i> Verified</span>
                                <?php endif; ?>
                             </h1>
                             <p class="profile-headline"><?php echo htmlspecialchars($course); ?></p>
                             <p class="profile-institution"><i class="fa-solid fa-building-columns"></i> <?php echo htmlspecialchars($university); ?></p>
                             <p class="profile-location"><i class="fa-solid fa-location-dot"></i> <?php echo !empty($location) ? htmlspecialchars($location) : '<em style="color: rgba(255,255,255,0.7);">Not Specified</em>'; ?></p>
                        </div>
                        <div class="profile-hero-actions">
                            <a href="../../Student Edit Profile Page/php/edit_profile.php" class="btn-profile-edit">
                                <i class="fa-solid fa-pen-to-square"></i> Edit Profile
                            </a>
                        </div>
                    </div>
                </div>

                <div class="content-grid profile-grid-layout">
                    <!-- Left Sidebar (Sticky) -->
                    <div class="profile-sidebar">
                        <!-- Contact Info -->
                        <div class="widget info-card">
                            <h3 class="widget-title"><i class="fa-solid fa-address-book"></i> Contact Information</h3>
                            <div class="info-item">
                                <i class="fa-solid fa-envelope"></i>
                                <div>
                                    <div class="info-label">Personal Email</div>
                                    <div class="info-value"><?php echo !empty($personal_email) ? htmlspecialchars($personal_email) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-envelope-open-text"></i>
                                <div>
                                    <div class="info-label">Student Email</div>
                                    <div class="info-value"><?php echo !empty($student_email) ? htmlspecialchars($student_email) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-phone"></i>
                                <div>
                                    <div class="info-label">Phone Number</div>
                                    <div class="info-value"><?php echo !empty($phone_number) ? htmlspecialchars($phone_number) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                        </div>

                        <!-- Skills -->
                        <div class="widget skills-card">
                            <h3 class="widget-title"><i class="fa-solid fa-layer-group"></i> Skills</h3>
                            <?php
                            // Group skills by category
                            $technical_skills = [];
                            $soft_skills = [];

                            if (!empty($skills_list)) {
                                foreach ($skills_list as $skill) {
                                    if ($skill['skill_category'] === 'Technical') {
                                        $technical_skills[] = $skill['skill_name'];
                                    } elseif (stripos($skill['skill_category'], 'Soft') !== false) {
                                        $soft_skills[] = $skill['skill_name'];
                                    }
                                }
                            }
                            ?>

                            <div class="skill-category">
                                <h4>Technical</h4>
                                <div class="tags">
                                    <?php if (!empty($technical_skills)): ?>
                                        <?php foreach ($technical_skills as $skill): ?>
                                            <span><?php echo htmlspecialchars($skill); ?></span>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <span class="empty-skill">No technical skills added</span>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="skill-category">
                                <h4>Soft Skills</h4>
                                <div class="tags">
                                    <?php if (!empty($soft_skills)): ?>
                                        <?php foreach ($soft_skills as $skill): ?>
                                            <span><?php echo htmlspecialchars($skill); ?></span>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <span class="empty-skill">No soft skills added</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="profile-main">
                        <!-- About Me -->
                        <div class="widget section-card">
                            <h2 class="section-title"><i class="fa-solid fa-user-circle"></i> About Me</h2>
                            <p class="section-text">
                                <?php echo !empty($about_me) ? nl2br(htmlspecialchars($about_me)) : "Write something about yourself..."; ?>
                            </p>
                        </div>

                        <!-- Experience -->
                        <div class="widget section-card">
                            <h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Experience</h2>
                            <div class="timeline-v2">
                                <?php if (!empty($experience_list)): ?>
                                    <?php foreach ($experience_list as $exp): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                                            <div class="timeline-content">
                                                <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($exp['company_name']); ?></p>
                                                <p class="date"><?php echo htmlspecialchars($exp['start_date']) . " - " . htmlspecialchars($exp['end_date']); ?></p>
                                                <p class="description"><?php echo htmlspecialchars($exp['description']); ?></p>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="empty-state">No experience listed.</div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <!-- Education -->
                        <div class="widget section-card">
                            <h2 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h2>
                            <div class="timeline-v2">
                                <!-- Current Education -->
                                <?php if (!empty($education_current)): ?>
                                    <?php foreach ($education_current as $edu): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                                            <div class="timeline-content">
                                                <h3><?php echo htmlspecialchars($edu['course']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($edu['university']); ?></p>
                                                <p class="date">Present</p>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endif; ?>

                                <!-- Past Education History -->
                                <?php if (!empty($education_history)): ?>
                                    <?php foreach ($education_history as $hist): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-icon"><i class="fa-solid fa-school"></i></div>
                                            <div class="timeline-content">
                                                <h3><?php echo htmlspecialchars($hist['degree']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($hist['institution']); ?></p>
                                                <p class="date"><?php echo htmlspecialchars($hist['start_year']) . " - " . htmlspecialchars($hist['end_year']); ?></p>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endif; ?>

                                <?php if (empty($education_current) && empty($education_history)): ?>
                                    <div class="empty-state">No education history available.</div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="../js/profile.js"></script>
</body>

</html>