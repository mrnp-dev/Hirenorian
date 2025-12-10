<?php
session_start();
// Company Session Check
if (!isset($_SESSION['company_email'])) {
    // Handling session check
}

// Mock Data (Mirrors job_listing.js)
$applicants = [
    1 => [
        "name" => "Jose E. Batumbakal",
        "course" => "Bachelor of Science in Computer Science",
        "email" => "jose@email.com",
        "phone" => "09123456789",
        "university" => "Don Honorio Ventura State University"
    ],
    2 => [
        "name" => "Pedro Dee Z. Nuts",
        "course" => "Bachelor of Science in Information and Communications Technology",
        "email" => "pedro@email.com",
        "phone" => "09234567890",
        "university" => "Don Honorio Ventura State University"
    ],
    3 => [
        "name" => "Jebron G. Lames",
        "course" => "Bachelor of Science in Accounting Technology",
        "email" => "jebron@email.com",
        "phone" => "09345678901",
        "university" => "Don Honorio Ventura State University"
    ],
    4 => [
        "name" => "Tobay D. Brown",
        "course" => "Bachelor of Science in Information Technology",
        "email" => "tobay@email.com",
        "phone" => "09456789012",
        "university" => "Don Honorio Ventura State University"
    ],
    5 => [
        "name" => "Sakha M. Adibix",
        "course" => "Bachelor of Science in Information Systems",
        "email" => "sakha@email.com",
        "phone" => "09567890123",
        "university" => "Don Honorio Ventura State University"
    ],
    6 => [
        "name" => "Seyda Z. Elven",
        "course" => "Bachelor of Science in Computer Engineering",
        "email" => "seyda@email.com",
        "phone" => "09678901234",
        "university" => "Don Honorio Ventura State University"
    ],
    7 => [
        "name" => "DayMo N. Taim",
        "course" => "Bachelor of Science in Data Science",
        "email" => "daymo@email.com",
        "phone" => "09789012345",
        "university" => "Don Honorio Ventura State University"
    ],
    8 => [
        "name" => "Koby L. Jay",
        "course" => "Bachelor of Science in Software Engineering",
        "email" => "koby@email.com",
        "phone" => "09890123456",
        "university" => "Don Honorio Ventura State University"
    ],
    9 => [
        "name" => "Jaydos D. Crist",
        "course" => "Bachelor of Science in Cybersecurity",
        "email" => "jaydos@email.com",
        "phone" => "09901234567",
        "university" => "Don Honorio Ventura State University"
    ],
    10 => [
        "name" => "Rayd Ohm M. Dih",
        "course" => "Bachelor of Science in Game Development",
        "email" => "rayd@email.com",
        "phone" => "09012345678",
        "university" => "Don Honorio Ventura State University"
    ]
];

// Get ID from URL
$id = isset($_GET['id']) ? (int) $_GET['id'] : 1;
$data = isset($applicants[$id]) ? $applicants[$id] : $applicants[1];

// Populate variables
$full_name = $data['name'];
$course = $data['course'];
$university = $data['university'];
$personal_email = $data['email'];
$phone_number = $data['phone'];

// Default values for others
$department = "College of Computing Studies";
$organization = "Student Organization";
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
                <li class="nav-item">
                    <a href="../../Help Page/php/help.php" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Help</span>
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
                            <!-- Placeholder -->
                        </div>
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
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
                                <h1 class="profile-name">
                                    <?php echo $full_name; ?>
                                </h1>
                                <p class="profile-headline"><?php echo $course; ?> Student at <?php echo $university; ?>
                                </p>
                                <p class="profile-location"><i class="fa-solid fa-location-dot"></i> San Fernando,
                                    Pampanga</p>
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
                                    <span><?php echo $personal_email; ?></span>
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
                                    I am a motivated 3rd-year Information Technology student with a passion for web
                                    development and software engineering.
                                    I am currently looking for an internship opportunity where I can apply my skills in
                                    building user-friendly applications
                                    and learn from experienced professionals in the industry. I am a quick learner and
                                    eager to contribute to real-world projects.
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
                                            <p class="description">Led a team of 5 students in developing the
                                                organization's official website. Organized coding workshops for
                                                freshmen.</p>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-icon"><i class="fa-solid fa-hand-holding-heart"></i></div>
                                        <div class="timeline-content">
                                            <h3>Volunteer</h3>
                                            <p class="institution">Community Tech Outreach</p>
                                            <p class="date">2022</p>
                                            <p class="description">Assisted in teaching basic computer literacy to
                                                senior citizens in the local community.</p>
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
                                            <h3><?php echo $course; ?></h3>
                                            <p class="institution"><?php echo $university; ?></p>
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

    <!-- Reusing dashboard.js for shared behavior if needed, or local profile.js -->
    <script src="../js/profile.js"></script>
</body>

</html>