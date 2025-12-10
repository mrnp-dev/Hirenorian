<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    echo "<script>console.log('Student Email: " . $student_email . "');</script>";
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
    } else {
        echo "<script>console.log('Response: " . addslashes($response) . "');</script>";

    }
    curl_close($ch);


    $data = json_decode($response, true);

    if (isset($data['status']) && $data['status'] === "success") {
        echo "<script>console.log('Student ID: " . $data['student_id'] . "');</script>";
        
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

        // Profile Info
        $location       = $profile['location'];
        $about_me       = $profile['about_me'];
        $profile_picture = $profile['profile_picture']; // Not currently used in HTML but available

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
    }
}
else
{
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
                <a href="../../Internship Search Page/php/internship_search.php" class="nav-item">
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
                        <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Student" class="user-img">
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
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
                                <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile Picture" class="profile-avatar">
                            </div>
                            <div class="profile-info">
                                <h1 class="profile-name"><?php echo htmlspecialchars($first_name . " " . ($middle_initial ? $middle_initial . " " : "") . $last_name . " " . $suffix); ?></h1>
                                <p class="profile-headline"><?php echo htmlspecialchars($course); ?> Student at <?php echo htmlspecialchars($university); ?></p>
                                <p class="profile-location"><i class="fa-solid fa-location-dot"></i> <?php echo !empty($location) ? htmlspecialchars($location) : '<em style="color: #999;">Not Specified</em>'; ?></p>
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
                                    <span><?php echo !empty($personal_email) ? htmlspecialchars($personal_email) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    <span><?php echo !empty($student_email) ? htmlspecialchars($student_email) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span><?php echo !empty($phone_number) ? htmlspecialchars($phone_number) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                            </div>

                            <!-- Skills -->
                            <div class="card skills-card">
                                <h3>Skills</h3>
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
                                            <span style="color: #999; font-style: italic;">No technical skills added</span>
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
                                            <span style="color: #999; font-style: italic;">No soft skills added</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content -->
                        <div class="profile-main">
                            <!-- About Me -->
                            <div class="card section-card">
                                <h2>About Me</h2>
                                <p class="section-text">
                                    <?php echo !empty($about_me) ? nl2br(htmlspecialchars($about_me)) : "Write something about yourself..."; ?>
                                </p>
                            </div>

                            <!-- Experience -->
                            <div class="card section-card">
                                <h2>Experience</h2>
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
                                        <p>No experience listed.</p>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <!-- Education -->
                            <div class="card section-card">
                                <h2>Education</h2>
                                <div class="timeline-v2">
                                    <!-- Current Education -->
                                    <?php if (!empty($education_current)): ?>
                                        <?php foreach ($education_current as $edu): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                                            <div class="timeline-content">
                                                <h3><?php echo htmlspecialchars($edu['course']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($edu['university']); ?></p>
                                                <p class="date">Present</p> <!-- Assuming current means present, or add dates if available in table -->
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
                                        <p>No education history available.</p>
                                    <?php endif; ?>
                                </div>
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