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
                <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                <span class="logo-text">Hirenorian</span>
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
                                <h2 class="profile-name">Juan Dela Cruz</h2>
                                <p class="profile-role">BS Information Technology</p>
                                <p class="profile-university">Don Honorio Ventura State University</p>
                            </div>
                            <div class="profile-contact">
                                <div class="contact-header">
                                    <h3>Contact Information</h3>
                                    <button class="icon-btn" data-modal-target="#editContactModal"><i class="fa-solid fa-pen"></i></button>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span>juan.delacruz@email.com</span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>+63 912 345 6789</span>
                                </div>
                                <div class="contact-item">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span>San Fernando, Pampanga</span>
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
                                    <span>HTML/CSS</span>
                                    <span>JavaScript</span>
                                    <span>PHP</span>
                                    <span>MySQL</span>
                                    <span>React</span>
                                </div>
                            </div>
                            <div class="skills-category">
                                <h3>Soft Skills</h3>
                                <div class="tags">
                                    <span>Communication</span>
                                    <span>Teamwork</span>
                                    <span>Problem Solving</span>
                                    <span>Time Management</span>
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
                                I am a motivated 3rd-year Information Technology student with a passion for web development and software engineering. 
                                I am currently looking for an internship opportunity where I can apply my skills in building user-friendly applications 
                                and learn from experienced professionals in the industry. I am a quick learner and eager to contribute to real-world projects.
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
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <h3>Bachelor of Science in Information Technology</h3>
                                        <p class="institution">Don Honorio Ventura State University</p>
                                        <p class="date">2021 - Present</p>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <h3>Senior High School (STEM Strand)</h3>
                                        <p class="institution">Pampanga High School</p>
                                        <p class="date">2019 - 2021</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Experience & Achievements -->
                        <div class="card experience-section">
                            <div class="card-header">
                                <h2>Experience & Achievements</h2>
                                <button class="icon-btn" data-modal-target="#addExperienceModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <h3>Web Development Lead</h3>
                                        <p class="institution">DHVSU Computer Society</p>
                                        <p class="date">2023 - Present</p>
                                        <p class="description">Led a team of 5 students in developing the organization's official website. Organized coding workshops for freshmen.</p>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot"></div>
                                    <div class="timeline-content">
                                        <h3>Volunteer</h3>
                                        <p class="institution">Community Tech Outreach</p>
                                        <p class="date">2022</p>
                                        <p class="description">Assisted in teaching basic computer literacy to senior citizens in the local community.</p>
                                    </div>
                                </div>
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
                    <input type="email" id="email" name="email" value="juan.delacruz@email.com">
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value="+63 912 345 6789">
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" name="location" value="San Fernando, Pampanga">
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
                    <textarea id="technicalSkills" name="technical_skills" rows="3">HTML/CSS, JavaScript, PHP, MySQL, React</textarea>
                </div>
                <div class="form-group">
                    <label for="softSkills">Soft Skills (Comma separated)</label>
                    <textarea id="softSkills" name="soft_skills" rows="3">Communication, Teamwork, Problem Solving, Time Management</textarea>
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
                    <textarea id="aboutMe" name="about_me" rows="6">I am a motivated 3rd-year Information Technology student with a passion for web development and software engineering. I am currently looking for an internship opportunity where I can apply my skills in building user-friendly applications and learn from experienced professionals in the industry. I am a quick learner and eager to contribute to real-world projects.</textarea>
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
