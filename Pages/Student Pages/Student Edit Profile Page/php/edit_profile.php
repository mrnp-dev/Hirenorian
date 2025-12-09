<?php
session_start();
if(isset($_SESSION['email']))
{
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
        // Handle error silently or log
        echo "<script>console.log('Curl error: " . curl_error($ch) . "');</script>";
    }
    curl_close($ch);

    $data = json_decode($response, true);
    
    // Initialize default values
    $first_name = ""; $last_name = ""; $middle_initial = ""; $suffix = ""; 
    $student_email_val = ""; $phone_number = "";
    $location = ""; $about_me = ""; $course = ""; $university = "";
    $profile_picture = "";
    $technical_skills = ""; $soft_skills = "";
    $tech_arr = []; $soft_arr = [];
    $education_history = []; $experience_list = [];

    if (isset($data['status']) && $data['status'] === "success") {
        $basic = $data['data']['basic_info'] ?? [];
        $prof = $data['data']['profile'] ?? [];
        $skills_data = $data['data']['skills'] ?? [];
        $edu_data = $data['data']['education'] ?? []; // Current
        $education_history = $data['data']['education_history'] ?? [];
        $experience_list = $data['data']['experience'] ?? [];

        $first_name = $basic['first_name'] ?? "";
        $last_name = $basic['last_name'] ?? "";
        $middle_initial = $basic['middle_initial'] ?? "";
        $suffix = $basic['suffix'] ?? "";
        $suffix = $basic['suffix'] ?? "";
        $student_email_val = $basic['student_email'] ?? ""; // logical email
        $personal_email = $basic['personal_email'] ?? "";
        $phone_number = $basic['phone_number'] ?? "";

        $location = $prof['location'] ?? "";
        $about_me = $prof['about_me'] ?? "";
        $profile_picture = $prof['profile_picture'] ?? "";

        if (!empty($edu_data) && isset($edu_data[0])) {
            $course = $edu_data[0]['course'] ?? "";
            $university = $edu_data[0]['university'] ?? "";
        }

        // Process skills
        foreach($skills_data as $s) {
            if (isset($s['skill_category'])) {
                if ($s['skill_category'] === 'Technical') $tech_arr[] = $s['skill_name'];
                if (stripos($s['skill_category'], 'Soft') !== false) $soft_arr[] = $s['skill_name'];
            }
        }
        $technical_skills = implode(", ", $tech_arr);
        $soft_skills = implode(", ", $soft_arr);
    }
}
else
{
    header("Location: ../../../Landing Page/php/landing_page.php");
    exit();
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
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
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
                                    <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile Picture">
                                    <button class="edit-photo-btn" data-modal-target="#editPhotoModal"><i class="fa-solid fa-camera"></i></button>
                                </div>
                                <h2 class="profile-name"><?php echo htmlspecialchars($first_name . " " . ($middle_initial ? $middle_initial . ". " : "") . $last_name . " " . $suffix); ?></h2>
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
                                    <span><?php echo !empty($personal_email) ? htmlspecialchars($personal_email) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    <span><?php echo !empty($student_email_val) ? htmlspecialchars($student_email_val) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span><?php echo !empty($phone_number) ? htmlspecialchars($phone_number) : '<em style="color: #999;">Not Provided</em>'; ?></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span><?php echo !empty($location) ? htmlspecialchars($location) : '<em style="color: #999;">Not Specified</em>'; ?></span>
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
                                    <?php if(!empty($tech_arr)): foreach($tech_arr as $skill): ?>
                                    <span><?php echo htmlspecialchars($skill); ?></span>
                                    <?php endforeach; else: echo "<span>No technical skills added</span>"; endif; ?>
                                </div>
                            </div>
                            <div class="skills-category">
                                <h3>Soft Skills</h3>
                                <div class="tags">
                                    <?php if(!empty($soft_arr)): foreach($soft_arr as $skill): ?>
                                    <span><?php echo htmlspecialchars($skill); ?></span>
                                    <?php endforeach; else: echo "<span>No soft skills added</span>"; endif; ?>
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
                                <?php echo !empty($about_me) ? nl2br(htmlspecialchars($about_me)) : "No bio added yet."; ?>
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
                                <button class="btn-danger">Verify Account</button>
                            </div>
                        </div>

                        <!-- Educational Background -->
                        <div class="card education-section">
                            <div class="card-header">
                                <h2>Educational Background</h2>
                                <button class="icon-btn" data-modal-target="#addEducationModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <?php if(!empty($education_history)): foreach($education_history as $hist): ?>
                                <div class="timeline-item" data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-header">
                                            <div class="timeline-info">
                                                <h3><?php echo htmlspecialchars($hist['degree']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($hist['institution']); ?></p>
                                                <p class="date"><?php echo htmlspecialchars($hist['start_year']) . " - " . htmlspecialchars($hist['end_year']); ?></p>
                                            </div>
                                            <div class="timeline-actions">
                                                <button class="icon-btn-sm edit-education-btn" 
                                                    data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>"
                                                    data-degree="<?php echo htmlspecialchars($hist['degree']); ?>"
                                                    data-institution="<?php echo htmlspecialchars($hist['institution']); ?>"
                                                    data-start-year="<?php echo htmlspecialchars($hist['start_year']); ?>"
                                                    data-end-year="<?php echo htmlspecialchars($hist['end_year']); ?>">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button class="icon-btn-sm delete-education-btn" 
                                                    data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; else: echo "<p>No education history added.</p>"; endif; ?>
                            </div>
                        </div>

                        <!-- Experience & Achievements -->
                        <div class="card experience-section">
                            <div class="card-header">
                                <h2>Experience & Achievements</h2>
                                <button class="icon-btn" data-modal-target="#addExperienceModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <?php if(!empty($experience_list)): foreach($experience_list as $exp): ?>
                                <div class="timeline-item" data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <div class="timeline-header">
                                            <div class="timeline-info">
                                                <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                                <p class="institution"><?php echo htmlspecialchars($exp['company_name']); ?></p>
                                                <p class="date"><?php echo htmlspecialchars($exp['start_date']) . " - " . htmlspecialchars($exp['end_date']); ?></p>
                                                <p class="description"><?php echo htmlspecialchars($exp['description']); ?></p>
                                            </div>
                                            <div class="timeline-actions">
                                                <button class="icon-btn-sm edit-experience-btn" 
                                                    data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>"
                                                    data-job-title="<?php echo htmlspecialchars($exp['job_title']); ?>"
                                                    data-company="<?php echo htmlspecialchars($exp['company_name']); ?>"
                                                    data-start-date="<?php echo htmlspecialchars($exp['start_date']); ?>"
                                                    data-end-date="<?php echo htmlspecialchars($exp['end_date']); ?>"
                                                    data-description="<?php echo htmlspecialchars($exp['description']); ?>">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button class="icon-btn-sm delete-experience-btn" 
                                                    data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; else: echo "<p>No experience added.</p>"; endif; ?>
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
                    <label for="personalEmail">Personal Email</label>
                    <input type="email" id="personalEmail" name="personal_email" value="<?php echo htmlspecialchars($personal_email); ?>">
                </div>
                <div class="form-group">
                    <label for="studentEmail">Student Email <small style="color: #999; font-weight: normal;">(Not Editable)</small></label>
                    <input type="email" id="studentEmail" name="student_email" value="<?php echo htmlspecialchars($student_email_val); ?>" disabled>
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
            <form action="" method="POST" id="skillsForm">
                <!-- Technical Skills Section -->
                <div class="form-group">
                    <label>Technical Skills</label>
                    <div class="skill-input-group">
                        <input type="text" id="technicalSkillInput" placeholder="Enter a technical skill">
                        <button type="button" class="btn-add-skill" id="addTechnicalSkill">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                    <div class="skills-container" id="technicalSkillsContainer">
                        <?php if(!empty($tech_arr)): foreach($tech_arr as $skill): ?>
                        <span class="skill-tag" data-category="technical">
                            <?php echo htmlspecialchars($skill); ?>
                            <button type="button" class="remove-skill"><i class="fa-solid fa-times"></i></button>
                        </span>
                        <?php endforeach; endif; ?>
                    </div>
                    <small style="color: #666; margin-top: 5px; display: block;">Add skills one at a time using the button above</small>
                </div>

                <!-- Soft Skills Section -->
                <div class="form-group" style="margin-top: 20px;">
                    <label>Soft Skills</label>
                    <div class="skill-input-group">
                        <input type="text" id="softSkillInput" placeholder="Enter a soft skill">
                        <button type="button" class="btn-add-skill" id="addSoftSkill">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                    <div class="skills-container" id="softSkillsContainer">
                        <?php if(!empty($soft_arr)): foreach($soft_arr as $skill): ?>
                        <span class="skill-tag" data-category="soft">
                            <?php echo htmlspecialchars($skill); ?>
                            <button type="button" class="remove-skill"><i class="fa-solid fa-times"></i></button>
                        </span>
                        <?php endforeach; endif; ?>
                    </div>
                    <small style="color: #666; margin-top: 5px; display: block;">Add skills one at a time using the button above</small>
                </div>

                <!-- Hidden inputs to store skills for form submission -->
                <input type="hidden" id="technicalSkillsData" name="technical_skills" value="">
                <input type="hidden" id="softSkillsData" name="soft_skills" value="">

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
                    <label for="degree">Degree / Strand / Level</label>
                    <input type="text" id="degree" name="degree" placeholder="e.g. BS Information Technology, STEM, Elementary">
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

    <!-- Edit Education Modal -->
    <div class="modal" id="editEducationModal">
        <div class="modal-header">
            <h3>Edit Education</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST" id="editEducationForm">
                <input type="hidden" id="editEduId" name="edu_id" value="">
                <div class="form-group">
                    <label for="editDegree">Degree / Strand / Level</label>
                    <input type="text" id="editDegree" name="degree" placeholder="e.g. BS Information Technology, STEM, Elementary">
                </div>
                <div class="form-group">
                    <label for="editSchool">School / Institution</label>
                    <input type="text" id="editSchool" name="school" placeholder="e.g. DHVSU">
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="editEduStartDate">Start Year</label>
                        <input type="number" id="editEduStartDate" name="start_year" placeholder="YYYY">
                    </div>
                    <div class="form-group">
                        <label for="editEduEndDate">End Year</label>
                        <input type="text" id="editEduEndDate" name="end_year" placeholder="YYYY or Present">
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

    <!-- Edit Experience Modal -->
    <div class="modal" id="editExperienceModal">
        <div class="modal-header">
            <h3>Edit Experience</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST" id="editExperienceForm">
                <input type="hidden" id="editExpId" name="exp_id" value="">
                <div class="form-group">
                    <label for="editJobTitle">Job Title / Role</label>
                    <input type="text" id="editJobTitle" name="job_title" placeholder="e.g. Web Developer Intern">
                </div>
                <div class="form-group">
                    <label for="editCompany">Company / Organization</label>
                    <input type="text" id="editCompany" name="company" placeholder="e.g. Tech Solutions Inc.">
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="editExpStartDate">Start Year</label>
                        <input type="number" id="editExpStartDate" name="start_year" placeholder="YYYY">
                    </div>
                    <div class="form-group">
                        <label for="editExpEndDate">End Year</label>
                        <input type="text" id="editExpEndDate" name="end_year" placeholder="YYYY or Present">
                    </div>
                </div>
                <div class="form-group">
                    <label for="editDescription">Description</label>
                    <textarea id="editDescription" name="description" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- JavaScript Modules (in dependency order) -->
    <!-- Core modules (no dependencies) -->
    <script src="../js/ui-controls.js"></script>
    <script src="../js/validation.js"></script>
    
    <!-- Feature modules (depend on core modules) -->
    <script src="../js/contact-modal.js"></script>
    <script src="../js/skills-modal.js"></script>
    <script src="../js/education-modal.js"></script>
    <script src="../js/experience-modal.js"></script>
    
    <!-- Main entry point -->
    <script src="../js/edit_profile.js"></script>
</body>
</html>