<?php
session_start();
if(isset($_SESSION['email']))
{
    $student_email = $_SESSION['email'];
    echo "<script>console.log('Student Email: ' + " . json_encode($student_email) . ");</script>";
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
    else
    {
        echo "<script>console.log('Response: ' + " . json_encode($response) . ");</script>";

    }
    curl_close($ch);

    $data = json_decode($response, true);

    if ($data['status'] === "success") {
        echo "<script>console.log('Student ID: ' + " . json_encode($data['student_id']) . ");</script>";
        
    } else {
        echo "<script>console.log('Err: ' + " . json_encode($data['message']) . ");</script>";
    }

    $full_data = $data['data'];
    $basic_info = $full_data['basic_info'];
    $profile = $full_data['profile'];
    $skills = $full_data['skills'];
    $experience = $full_data['experience'];
    $education_list = $full_data['education'];

    // Basic Info
    $student_id     = $basic_info['student_id'];
    $first_name     = $basic_info['first_name'];
    $last_name      = $basic_info['last_name'];
    $middle_initial = $basic_info['middle_initial'];
    $suffix         = $basic_info['suffix'];
    $phone_number   = $basic_info['phone_number'];
    $student_email  = $basic_info['student_email'];

    // Profile Info
    $location       = isset($profile['location']) ? $profile['location'] : 'Location not set';
    $about_me       = isset($profile['about_me']) ? $profile['about_me'] : 'No bio available.';
    $profile_picture = isset($profile['profile_picture']) ? $profile['profile_picture'] : null;

    // We need to determine the "Main" course/university from education list if valid
    // For now, let's take the first one or default
    $university = "University not set";
    $course = "Course not set";
    if (!empty($education_list)) {
        $latest_education = $education_list[0]; // Assuming first is latest or primary
        $university = $latest_education['institution'];
        $course = $latest_education['degree'];
    }

    // Process Skills for display
    $tech_skills = [];
    $soft_skills = [];
    foreach ($skills as $skill) {
        if ($skill['skill_category'] === 'Technical') {
            $tech_skills[] = $skill['skill_name'];
        } else {
            $soft_skills[] = $skill['skill_name'];
        }
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
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img">
                        <span class="user-name"><?php echo $first_name . " " . $last_name; ?></span>
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
                                <img src="../../../Landing Page/Images/gradpic2.png" alt="Profile Picture" class="profile-avatar">
                            </div>
                            <div class="profile-info">
                                <h1 class="profile-name"><?php echo $first_name . " " . ($middle_initial ? $middle_initial . ". " : "") . $last_name . " " . $suffix; ?></h1>
                                <p class="profile-headline"><?php echo $course; ?> Student at <?php echo $university; ?></p>
                                <p class="profile-location"><i class="fa-solid fa-location-dot"></i> <?php echo htmlspecialchars($location); ?></p>
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
                                    <span><?php echo $student_email; // Using student email as primary for now ?></span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span><?php echo $phone_number; ?></span>
                                </div>
                            </div>

                            <!-- Skills -->
                            <div class="card skills-card">
                                <h3>Skills</h3>
                                <div class="skill-category">
                                    <h4>Technical</h4>
                                    <div class="tags">
                                        <?php if(empty($tech_skills)): ?>
                                            <span>No technical skills listed</span>
                                        <?php else: ?>
                                            <?php foreach($tech_skills as $s): ?>
                                                <span><?php echo htmlspecialchars($s); ?></span>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="skill-category">
                                    <h4>Soft Skills</h4>
                                    <div class="tags">
                                        <?php if(empty($soft_skills)): ?>
                                            <span>No soft skills listed</span>
                                        <?php else: ?>
                                            <?php foreach($soft_skills as $s): ?>
                                                <span><?php echo htmlspecialchars($s); ?></span>
                                            <?php endforeach; ?>
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
                                    <?php echo nl2br(htmlspecialchars($about_me)); ?>
                                </p>
                            </div>

                            <!-- Experience -->
                            <div class="card section-card">
                                <h2>Experience</h2>
                                <div class="timeline-v2">
                                    <?php if(empty($experience)): ?>
                                        <p>No experience listed yet.</p>
                                    <?php else: ?>
                                        <?php foreach($experience as $exp): ?>
                                            <div class="timeline-item">
                                                <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                                                <div class="timeline-content">
                                                    <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                                    <p class="institution"><?php echo htmlspecialchars($exp['company_name']); ?></p>
                                                    <p class="date"><?php echo htmlspecialchars($exp['start_date']); ?> - <?php echo htmlspecialchars($exp['end_date']); ?></p>
                                                    <p class="description"><?php echo nl2br(htmlspecialchars($exp['description'])); ?></p>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <!-- Education -->
                            <div class="card section-card">
                                <h2>Education</h2>
                                <div class="timeline-v2">
                                    <?php if(empty($education_list)): ?>
                                        <p>No education history listed yet.</p>
                                    <?php else: ?>
                                        <?php foreach($education_list as $edu): ?>
                                            <div class="timeline-item">
                                                <div class="timeline-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                                                <div class="timeline-content">
                                                    <h3><?php echo htmlspecialchars($edu['degree']); ?></h3>
                                                    <p class="institution"><?php echo htmlspecialchars($edu['institution']); ?></p>
                                                    <p class="date"><?php echo htmlspecialchars($edu['start_year']); ?> - <?php echo htmlspecialchars($edu['end_year']); ?></p>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
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
