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
    $course = "N/A";
    $university = "N/A";
    $location = "N/A";
    $contact = "N/A";
    $about_me = "No description available.";
    
    $skills_list = [];
    $experience_list = [];
    $education_history = [];
    $education_current = [];

    if ($response !== false) {
        $data = json_decode($response, true);
        
        if (isset($data['status']) && $data['status'] === "success") {
            $basic_info = $data['data']['basic_info'];
            $profile = $data['data']['profile']; // Contains about_me, location, etc.
            $skills_list = $data['data']['skills'];
            $experience_list = $data['data']['experience'];
            $education_history = $data['data']['education_history'];
            $education_current = $data['data']['education']; 
            
            $first_name = $basic_info['first_name'];
            $last_name = $basic_info['last_name'];
            $verified_status = $basic_info['verified_status'] ?? 'unverified';
            $contact = $basic_info['contact_number'];
            $email = $basic_info['email'];
            
            $student_id = isset($basic_info['student_id']) ? $basic_info['student_id'] : 'N/A';
            
            $course = isset($education_current[0]['course']) ? $education_current[0]['course'] : 'Student';
            $university = isset($education_current[0]['university']) ? $education_current[0]['university'] : 'Don Honorio Ventura State University';
            
            if (isset($profile['city']) && isset($profile['province'])) {
                $location = $profile['city'] . ", " . $profile['province'];
            }
            
            if (!empty($profile['about_me'])) {
                $about_me = $profile['about_me'];
            }

            $profile_picture_db = $profile['profile_picture'];

            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }
        }
    }
} else {
    // Redirect to Landing Page if not logged in
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
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
    <link rel="stylesheet" href="../css/profile-pro.css">
    
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
                <a href="#" class="nav-item active">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Student Internship Search Page New/php/internship_search.php" class="nav-item">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <span>Internship Search</span>
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
                         <a href="../../Student Edit Profile Page/php/edit_profile.php" class="dropdown-item"><i class="fa-solid fa-pen-to-square"></i> Edit Profile</a>
                         <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                    </div>
                </div>
            </header>

            <!-- Profile Page Content -->
            <main class="profile-page-body">
                
                <!-- Hero Section -->
                <div class="profile-hero">
                    <!-- Background graphic or color -->
                </div>

                <!-- Profile Grid -->
                <div class="profile-container">
                    
                    <!-- Left Sidebar Card -->
                    <div class="profile-sidebar-card">
                        <div class="profile-avatar-container">
                            <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile Picture">
                        </div>
                        <h2 class="student-name">
                            <?php echo htmlspecialchars($first_name . " " . $last_name); ?>
                            <?php if($verified_status === 'verified'): ?>
                                <i class="fa-solid fa-circle-check" style="color: #2ecc71; font-size: 0.8em; margin-left: 5px;" title="Verified Account"></i>
                            <?php endif; ?>
                        </h2>
                        <p class="student-headline"><?php echo htmlspecialchars($course); ?></p>
                        
                        <div class="profile-stats">
                             <div class="stat-item">
                                 <h4><?php echo count($skills_list); ?></h4>
                                 <span>Skills</span>
                             </div>
                             <div class="stat-item">
                                 <h4><?php echo count($experience_list); ?></h4>
                                 <span>Exp</span>
                             </div>
                        </div>

                        <ul class="contact-info-list">
                            <li>
                                <i class="fa-solid fa-envelope"></i>
                                <span><?php echo htmlspecialchars($email); ?></span>
                            </li>
                            <li>
                                <i class="fa-solid fa-phone"></i>
                                <span><?php echo htmlspecialchars($contact); ?></span>
                            </li>
                            <li>
                                <i class="fa-solid fa-location-dot"></i>
                                <span><?php echo htmlspecialchars($location); ?></span>
                            </li>
                             <li>
                                <i class="fa-solid fa-id-card"></i>
                                <span><?php echo htmlspecialchars($student_id); ?></span>
                            </li>
                        </ul>

                        <a href="../../Student Edit Profile Page/php/edit_profile.php" class="btn-edit-profile">Edit Profile</a>
                    </div>

                    <!-- Right Main Content -->
                    <div class="profile-main-col">
                        
                        <!-- About Me -->
                        <div class="content-card">
                            <div class="card-header">
                                <h2><i class="fa-solid fa-user-tag"></i> About Me</h2>
                            </div>
                            <p style="color: #555; line-height: 1.6;">
                                <?php echo nl2br(htmlspecialchars($about_me)); ?>
                            </p>
                        </div>

                        <!-- Skills -->
                        <div class="content-card">
                            <div class="card-header">
                                <h2><i class="fa-solid fa-lightbulb"></i> Skills</h2>
                            </div>
                            <?php if (!empty($skills_list)): ?>
                            <div class="skills-container">
                                <?php foreach($skills_list as $skill): ?>
                                    <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                                <?php endforeach; ?>
                            </div>
                            <?php else: ?>
                                <p class="text-muted">No skills added yet.</p>
                            <?php endif; ?>
                        </div>

                        <!-- Experience -->
                        <div class="content-card">
                            <div class="card-header">
                                <h2><i class="fa-solid fa-briefcase"></i> Experience</h2>
                            </div>
                            <?php if (!empty($experience_list)): ?>
                                <div class="timeline">
                                    <?php foreach($experience_list as $exp): ?>
                                    <div class="timeline-item">
                                        <div class="timeline-header">
                                            <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                            <span class="timeline-date">
                                                <?php 
                                                    $start = date("M Y", strtotime($exp['start_date']));
                                                    $end = $exp['end_date'] ? date("M Y", strtotime($exp['end_date'])) : "Present";
                                                    echo "$start - $end";
                                                ?>
                                            </span>
                                        </div>
                                        <h4 class="timeline-subtitle"><?php echo htmlspecialchars($exp['company_name']); ?></h4>
                                        <div class="timeline-body">
                                            <p><?php echo nl2br(htmlspecialchars($exp['description'])); ?></p>
                                        </div>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php else: ?>
                                <p class="text-muted">No experience added yet.</p>
                            <?php endif; ?>
                        </div>

                        <!-- Education -->
                        <div class="content-card">
                            <div class="card-header">
                                <h2><i class="fa-solid fa-graduation-cap"></i> Education</h2>
                            </div>
                            
                            <!-- Current Education (from Basic Info logic usually or Education table) -->
                             <?php if (!empty($education_current)): ?>
                                <div class="timeline">
                                    <?php foreach($education_current as $edu): ?>
                                    <div class="timeline-item">
                                        <div class="timeline-header">
                                            <h3><?php echo htmlspecialchars($edu['course']); ?></h3>
                                            <span class="timeline-date">
                                                <?php echo htmlspecialchars($edu['year_level']); ?> Year
                                            </span>
                                        </div>
                                        <h4 class="timeline-subtitle"><?php echo htmlspecialchars($edu['university']); ?></h4>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>

                            <!-- Past Education -->
                            <?php if (!empty($education_history)): ?>
                                <div class="timeline">
                                    <?php foreach($education_history as $edu): ?>
                                    <div class="timeline-item">
                                        <div class="timeline-header">
                                            <h3><?php echo htmlspecialchars($edu['degree'] ?? $edu['level']); ?></h3>
                                            <span class="timeline-date">
                                                <?php echo htmlspecialchars($edu['start_year'] . " - " . $edu['end_year']); ?>
                                            </span>
                                        </div>
                                        <h4 class="timeline-subtitle"><?php echo htmlspecialchars($edu['school_name']); ?></h4>
                                         <?php if(!empty($edu['honors'])): ?>
                                            <p style="margin: 5px 0 0; color: var(--primary-maroon); font-size: 0.9rem;">
                                                <i class="fa-solid fa-medal"></i> <?php echo htmlspecialchars($edu['honors']); ?>
                                            </p>
                                        <?php endif; ?>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                            
                             <?php if (empty($education_current) && empty($education_history)): ?>
                                <p class="text-muted">No education history added yet.</p>
                            <?php endif; ?>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script src="../js/profile.js"></script>
</body>
</html>
