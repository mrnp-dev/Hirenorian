<?php
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: ../../../Account Registration Pages/Main Account Register Page/php/main_registration.php");
    exit();
}

$student_email = $_SESSION['email'];
$apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['student_email' => $student_email]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

// Initialize variables with defaults or empty strings
$first_name = $last_name = $middle_initial = $suffix = "";
$phone_number = $university = $course = $location = $about_me = "";
$tech_skills_str = $soft_skills_str = "";
$experience = [];
$education_list = [];

if ($data && isset($data['status']) && $data['status'] === 'success') {
    $full_data = $data['data'];
    $basic_info = $full_data['basic_info'];
    $profile = $full_data['profile'];
    $skills = $full_data['skills'];
    $experience = $full_data['experience'];
    $education_list = $full_data['education'];

    // Basic Info
    $first_name     = $basic_info['first_name'];
    $last_name      = $basic_info['last_name'];
    $middle_initial = $basic_info['middle_initial'];
    $suffix         = $basic_info['suffix'];
    $phone_number   = $basic_info['phone_number'];
    
    // Profile Info
    $location       = isset($profile['location']) ? $profile['location'] : '';
    $about_me       = isset($profile['about_me']) ? $profile['about_me'] : '';
    
    // Education & Course (Logic similar to profile page)
    if (!empty($education_list)) {
        $latest_education = $education_list[0];
        $university = $latest_education['institution'];
        $course = $latest_education['degree'];
    }

    // Process Skills for comma-separated string
    $tech_skills_arr = [];
    $soft_skills_arr = [];
    foreach ($skills as $skill) {
        if ($skill['skill_category'] === 'Technical') {
            $tech_skills_arr[] = $skill['skill_name'];
        } else {
            $soft_skills_arr[] = $skill['skill_name'];
        }
    }
    $tech_skills_str = implode(", ", $tech_skills_arr);
    $soft_skills_str = implode(", ", $soft_skills_arr);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Profile - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/edit_profile.css">
    
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
                <a href="../../Student Profile Page/php/student_profile.php" class="nav-item">
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
                        <span class="user-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <main class="dashboard-body">
                <h1 class="page-title">My Profile</h1>

                <div class="profile-grid">
                    <!-- Left Column: Profile Card & Contact -->
                    <div class="profile-left">
                        <!-- Profile Card -->
                        <div class="card profile-card">
                            <div class="profile-header">
                                <div class="profile-img-container">
                                    <img src="../../../Landing Page/Images/gradpic2.png" alt="Profile Picture">
                                    <button class="edit-photo-btn" data-modal-target="#editPhotoModal"><i class="fa-solid fa-camera"></i></button>
                                </div>
                                <h2 class="profile-name"><?php echo htmlspecialchars($first_name . " " . $last_name); ?></h2>
                                <p class="profile-role"><?php echo htmlspecialchars($course); ?></p>
                                <p class="profile-university"><?php echo htmlspecialchars($university); ?></p>
                            </div>
                            <div class="profile-contact">
                                <div class="contact-header">
                                    <h3>Contact Information</h3>
                                    <button class="icon-btn" data-modal-target="#editContactModal"><i class="fa-solid fa-pen"></i></button>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span><?php echo htmlspecialchars($student_email); ?></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span><?php echo htmlspecialchars($phone_number); ?></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span><?php echo htmlspecialchars($location); ?></span>
                                </div>
                            </div>
                        </div>

                        <!-- Skills Section -->
                        <div class="card skills-section">
                            <div class="card-header">
                                <h2>Skills</h2>
                                <button class="icon-btn" data-modal-target="#editSkillsModal"><i class="fa-solid fa-pen"></i></button>
                            </div>
                            <div class="skills-category">
                                <h3>Technical</h3>
                                <div class="tags">
                                    <?php if($tech_skills_str): ?>
                                        <?php foreach(explode(',', $tech_skills_str) as $skill): ?>
                                            <span><?php echo htmlspecialchars(trim($skill)); ?></span>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <span>No technical skills listed</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="skills-category">
                                <h3>Soft Skills</h3>
                                <div class="tags">
                                    <?php if($soft_skills_str): ?>
                                        <?php foreach(explode(',', $soft_skills_str) as $skill): ?>
                                            <span><?php echo htmlspecialchars(trim($skill)); ?></span>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <span>No soft skills listed</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Details -->
                    <div class="profile-right">
                        <!-- About Me -->
                        <div class="card about-section">
                            <div class="card-header">
                                <h2>About Me</h2>
                                <button class="icon-btn" data-modal-target="#editAboutModal"><i class="fa-solid fa-pen"></i></button>
                            </div>
                            <p class="about-text">
                                <?php echo nl2br(htmlspecialchars($about_me)); ?>
                            </p>
                        </div>

                        <!-- Account Manager -->
                        <div class="card account-manager-section">
                            <div class="card-header">
                                <h2>Account Manager</h2>
                            </div>
                            <div class="account-actions">
                                <button class="btn-outline">Change Password</button>
                                <button class="btn-outline">Privacy Settings</button>
                                <button class="btn-danger">Deactivate Account</button>
                            </div>
                        </div>

                        <!-- Educational Background -->
                        <div class="card education-section">
                            <div class="card-header">
                                <h2>Educational Background</h2>
                                <button class="icon-btn" data-modal-target="#addEducationModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <?php if(empty($education_list)): ?>
                                    <p>No education history listed.</p>
                                <?php else: ?>
                                    <?php foreach($education_list as $edu): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
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

                        <!-- Experience & Achievements -->
                        <div class="card experience-section">
                            <div class="card-header">
                                <h2>Experience & Achievements</h2>
                                <button class="icon-btn" data-modal-target="#addExperienceModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <?php if(empty($experience)): ?>
                                    <p>No experience listed.</p>
                                <?php else: ?>
                                    <?php foreach($experience as $exp): ?>
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <div class="timeline-content">
                                                <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($exp['company_name']); ?></p>
                                                <p class="date"><?php echo htmlspecialchars($exp['start_year']); ?> - <?php echo htmlspecialchars($exp['end_year']); ?></p>
                                                <p class="description"><?php echo nl2br(htmlspecialchars($exp['description'])); ?></p>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal-overlay" id="modalOverlay"></div>

    <!-- Edit Photo Modal -->
    <div class="modal" id="editPhotoModal">
        <div class="modal-header">
            <h3>Update Profile Photo</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="profilePhoto">Select Image</label>
                    <input type="file" id="profilePhoto" name="profile_photo" accept="image/*">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Contact Modal -->
    <div class="modal" id="editContactModal">
        <div class="modal-header">
            <h3>Edit Contact Information</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($student_email); ?>" readonly style="background: #f0f0f0;">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($phone_number); ?>">
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" name="location" value="<?php echo htmlspecialchars($location); ?>">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Skills Modal -->
    <div class="modal" id="editSkillsModal">
        <div class="modal-header">
            <h3>Edit Skills</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST">
                <div class="form-group">
                    <label for="technicalSkills">Technical Skills (Comma separated)</label>
                    <textarea id="technicalSkills" name="technical_skills" rows="3"><?php echo htmlspecialchars($tech_skills_str); ?></textarea>
                </div>
                <div class="form-group">
                    <label for="softSkills">Soft Skills (Comma separated)</label>
                    <textarea id="softSkills" name="soft_skills" rows="3"><?php echo htmlspecialchars($soft_skills_str); ?></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit About Modal -->
    <div class="modal" id="editAboutModal">
        <div class="modal-header">
            <h3>Edit About Me</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST">
                <div class="form-group">
                    <label for="aboutMe">About Me</label>
                    <textarea id="aboutMe" name="about_me" rows="6"><?php echo htmlspecialchars($about_me); ?></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Education Modal -->
    <div class="modal" id="addEducationModal">
        <div class="modal-header">
            <h3>Add Education</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST">
                <div class="form-group">
                    <label for="degree">Degree / Strand</label>
                    <input type="text" id="degree" name="degree" placeholder="e.g. BS Information Technology">
                </div>
                <div class="form-group">
                    <label for="school">School / Institution</label>
                    <input type="text" id="school" name="school" placeholder="e.g. DHVSU">
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="eduStartDate">Start Year</label>
                        <input type="number" id="eduStartDate" name="start_year" placeholder="YYYY">
                    </div>
                    <div class="form-group">
                        <label for="eduEndDate">End Year</label>
                        <input type="text" id="eduEndDate" name="end_year" placeholder="YYYY or Present">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Experience Modal -->
    <div class="modal" id="addExperienceModal">
        <div class="modal-header">
            <h3>Add Experience</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST">
                <div class="form-group">
                    <label for="jobTitle">Job Title / Role</label>
                    <input type="text" id="jobTitle" name="job_title" placeholder="e.g. Web Developer Intern">
                </div>
                <div class="form-group">
                    <label for="company">Company / Organization</label>
                    <input type="text" id="company" name="company" placeholder="e.g. Tech Solutions Inc.">
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="expStartDate">Start Year</label>
                        <input type="number" id="expStartDate" name="start_year" placeholder="YYYY">
                    </div>
                    <div class="form-group">
                        <label for="expEndDate">End Year</label>
                        <input type="text" id="expEndDate" name="end_year" placeholder="YYYY or Present">
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../js/edit_profile.js"></script>
</body>
</html>
