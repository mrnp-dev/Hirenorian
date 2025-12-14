<?php
session_start();
if(isset($_SESSION['email']))
{
    $student_email = $_SESSION['email'];
    // Data fetching removed. handled by JS.
} else {
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
    <style>
        /* Skeleton Loading Styles */
        .skeleton {
            background: #e0e0e0;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            color: transparent !important;
            border-radius: 4px;
            display: inline-block;
        }

        .skeleton-text {
            height: 1em;
            width: 100%;
            border-radius: 4px;
        }

        .skeleton-block {
            width: 100%;
            height: 100px;
            border-radius: 8px;
        }
        
        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
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
            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img skeleton" id="headerProfileImg">
                        <span class="user-name skeleton skeleton-text" id="headerProfileName" style="width: 100px;">Student</span>
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
                                    <img src="../../../Landing Page/Images/gradpic2.png" alt="Profile Picture" class="skeleton" id="profile-img-display">
                                    <button class="edit-photo-btn" data-modal-target="#editPhotoModal"><i class="fa-solid fa-camera"></i></button>
                                </div>
                                <h2 class="profile-name">
                                    <span id="display-full-name" class="skeleton skeleton-text" style="width: 200px;">Student Name</span>
                                    <button class="icon-btn" data-modal-target="#editPersonalModal" style="font-size: 0.8em; margin-left: 10px;"><i class="fa-solid fa-pen"></i></button>
                                </h2>
                                <p class="profile-role skeleton skeleton-text" id="profile-role-display" style="width: 150px; margin: 5px auto;"></p>
                                <p class="profile-university skeleton skeleton-text" id="profile-university-display" style="width: 180px; margin: 5px auto;"></p>
                            </div>
                            <div class="profile-contact">
                                <div class="contact-header">
                                    <h3>Contact Information</h3>
                                    <button class="icon-btn" data-modal-target="#editContactModal"><i class="fa-solid fa-pen"></i></button>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span id="display-personal-email" class="skeleton skeleton-text" style="width: 180px;"></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    <span id="display-student-email" class="skeleton skeleton-text" style="width: 180px;"></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span id="display-phone" class="skeleton skeleton-text" style="width: 120px;"></span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span id="display-location" class="skeleton skeleton-text" style="width: 150px;"></span>
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
                                <div class="tags" id="technical-skills-display">
                                    <!-- Populated by JS -->
                                    <span class="skeleton skeleton-text" style="width: 60px;"></span>
                                    <span class="skeleton skeleton-text" style="width: 80px;"></span>
                                </div>
                            </div>
                            <div class="skills-category">
                                <h3>Soft Skills</h3>
                                <div class="tags" id="soft-skills-display">
                                    <!-- Populated by JS -->
                                    <span class="skeleton skeleton-text" style="width: 70px;"></span>
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
                            <p class="about-text skeleton skeleton-block" id="display-about-me">
                                <!-- Populated by JS -->
                            </p>
                        </div>

                        <!-- Account Manager -->
                        <div class="card account-manager-section">
                            <div class="card-header">
                                <h2>Account Manager</h2>
                            </div>
                            <div class="account-actions">
                                <button class="btn-outline" data-modal-target="#changePasswordModal">Change Password</button>
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
                                <!-- Populated by JS -->
                            </div>
                        </div>

                        <!-- Experience & Achievements -->
                        <div class="card experience-section">
                            <div class="card-header">
                                <h2>Experience & Achievements</h2>
                                <button class="icon-btn" data-modal-target="#addExperienceModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <!-- Populated by JS -->
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
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="student_id" id="student_id" value="">
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

    <!-- Edit Personal Details Modal -->
    <div class="modal" id="editPersonalModal">
        <div class="modal-header">
            <h3>Edit Personal Details</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST" id="personalForm">
                <input type="hidden" name="student_id" id="studentIdPersonal" value="">
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="first_name" value="">
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="last_name" value="">
                    </div>
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="middleInitial">Middle Initial</label>
                        <input type="text" id="middleInitial" name="middle_initial" value="" maxlength="2">
                    </div>
                    <div class="form-group">
                        <label for="suffix">Suffix</label>
                        <input type="text" id="suffix" name="suffix" value="" placeholder="e.g. Jr., III">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal" id="changePasswordModal">
        <div class="modal-header">
            <h3>Change Password</h3>
            <button class="close-modal" data-close-button>&times;</button>
        </div>
        <div class="modal-body">
            <form action="" method="POST" id="passwordForm">
                <input type="hidden" name="student_id" id="studentIdPassword" value="">
                
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <div class="input-wrapper" style="position: relative;">
                        <input type="password" id="currentPassword" name="current_password" required style="padding-right: 40px;">
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility(this)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666;">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <p class="error-text" style="color: red; font-size: 0.8em; margin-top: 5px; visibility: hidden;">Error message</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <div class="input-wrapper" style="position: relative;">
                        <input type="password" id="newPassword" name="Password" data-strength="" required style="padding-right: 40px;">
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility(this)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666;">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <p class="error-text" style="color: red; font-size: 0.8em; margin-top: 5px; visibility: hidden;">Error message</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <div class="input-wrapper" style="position: relative;">
                        <input type="password" id="confirmPassword" name="Confirm Password" required style="padding-right: 40px;">
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility(this)" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666;">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <p class="error-text" style="color: red; font-size: 0.8em; margin-top: 5px; visibility: hidden;">Error message</p>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-close-button>Cancel</button>
                    <button type="submit" class="btn-primary">Change Password</button>
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
                <!-- Using same ID for student_id potentially as helper sets it -->
                <input type="hidden" name="student_id" id="studentIdContact" value=""> 
                <div class="form-group">
                    <label for="personalEmail">Personal Email</label>
                    <input type="email" id="personalEmail" name="personal_email" value="">
                </div>
                <div class="form-group">
                    <label for="studentEmail">Student Email <small style="color: #999; font-weight: normal;">(Not Editable)</small></label>
                    <input type="email" id="studentEmail" name="student_email" value="" disabled>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value="">
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" name="location" value="">
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
                <input type="hidden" name="student_id" id="studentIdSkills" value="">
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
                        <!-- Populated by JS -->
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
                         <!-- Populated by JS -->
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
                <input type="hidden" name="student_id" id="studentId" value="">
                <div class="form-group">
                    <label for="aboutMe">About Me</label>
                    <textarea id="aboutMe" name="about_me" rows="6"></textarea>
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
            <form action="" method="POST" id="addEducationForm">
                <input type="hidden" name="student_id" id="studentId" value=""> <!-- using shared ID 'studentId' be careful if selecting unique -->
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
                <input type="hidden" name="student_id" value="">
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
            <form action="" method="POST" id="addExperienceForm">
                <input type="hidden" name="student_id" id="studentIdExp" value="">
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
                <input type="hidden" name="student_id" value="">
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

    <!-- Pass PHP session data to JavaScript -->
    <script>
        window.STUDENT_EMAIL = "<?php echo $student_email; ?>";
    </script>

    <!-- JavaScript Modules (in dependency order) -->
    <!-- Core modules (no dependencies) -->
    <script src="../js/ui-controls.js"></script>
    <script src="../js/validation.js"></script>
    
    <!-- Feature modules (depend on core modules) -->
    <script src="../js/toast.js"></script>
    <script src="../js/confirm.js"></script>
    <script src="../js/contact-modal.js"></script>
    <script src="../js/about-modal.js"></script>
    <script src="../js/education-modal.js"></script>
    <script src="../js/experience-modal.js"></script>
    <script src="../js/skills-modal.js"></script>
    <script src="../js/personal-modal.js"></script>
    <script src="../js/password-modal.js"></script>
    <script src="../js/photo-modal.js"></script>
    
    <!-- Main entry point -->
    <script type="module" src="../js/edit_profile.js"></script>
</body>
</html>