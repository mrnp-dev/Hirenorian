<?php
session_start();
if(isset($_SESSION['email']))
{
    $student_email = $_SESSION['email'];
    $apiUrl = "http://158.69.205.176:8080/fetch_student_information.php";

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

    if ($data['status'] === "success") {
        echo "Student ID: " . $data['student_id'] . "\n";
        echo "<script>console.log('Student ID: " . $data['student_id'] . "');</script>";
        print_r($data['data']);
    } else {
        echo "Error: " . $data['message'];
        echo "<script>console.log('Error: " . $data['message'] . "');</script>";
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
                <a href="#" class="nav-item">
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
                        <span class="user-name">Juan Dela Cruz</span>
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
                                <h1 class="profile-name">Juan Dela Cruz</h1>
                                <p class="profile-headline">BS Information Technology Student at DHVSU</p>
                                <p class="profile-location"><i class="fa-solid fa-location-dot"></i> San Fernando, Pampanga</p>
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
                                    <span>juan.delacruz@email.com</span>
                                </div>
                                <div class="info-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>+63 912 345 6789</span>
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
                                <p class="section-text">
                                    I am a motivated 3rd-year Information Technology student with a passion for web development and software engineering. 
                                    I am currently looking for an internship opportunity where I can apply my skills in building user-friendly applications 
                                    and learn from experienced professionals in the industry. I am a quick learner and eager to contribute to real-world projects.
                                </p>
                            </div>

                            <!-- Experience -->
                            <div class="card section-card">
                                <h2>Experience</h2>
                                <div class="timeline-v2">
                                    <div class="timeline-item">
                                        <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                                        <div class="timeline-content">
                                            <h3>Web Development Lead</h3>
                                            <p class="institution">DHVSU Computer Society</p>
                                            <p class="date">2023 - Present</p>
                                            <p class="description">Led a team of 5 students in developing the organization's official website. Organized coding workshops for freshmen.</p>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-icon"><i class="fa-solid fa-hand-holding-heart"></i></div>
                                        <div class="timeline-content">
                                            <h3>Volunteer</h3>
                                            <p class="institution">Community Tech Outreach</p>
                                            <p class="date">2022</p>
                                            <p class="description">Assisted in teaching basic computer literacy to senior citizens in the local community.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Education -->
                            <div class="card section-card">
                                <h2>Education</h2>
                                <div class="timeline-v2">
                                    <div class="timeline-item">
                                        <div class="timeline-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                                        <div class="timeline-content">
                                            <h3>Bachelor of Science in Information Technology</h3>
                                            <p class="institution">Don Honorio Ventura State University</p>
                                            <p class="date">2021 - Present</p>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-icon"><i class="fa-solid fa-school"></i></div>
                                        <div class="timeline-content">
                                            <h3>Senior High School (STEM Strand)</h3>
                                            <p class="institution">Pampanga High School</p>
                                            <p class="date">2019 - 2021</p>
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

    <script src="../js/profile.js"></script>
</body>
</html>
