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
    $student_id = ""; // Added for hidden inputs in modals
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

        $student_id = $basic['student_id'] ?? "";
        $first_name = $basic['first_name'] ?? "";
        $last_name = $basic['last_name'] ?? "";
        $middle_initial = $basic['middle_initial'] ?? "";
        $suffix = $basic['suffix'] ?? "";
        $suffix = $basic['suffix'] ?? "";
        $verified_status = $basic['verified_status'] ?? "unverified"; // Added verified_status extraction
        $student_email_val = $basic['student_email'] ?? ""; // logical email
        $personal_email = $basic['personal_email'] ?? "";
        $phone_number = $basic['phone_number'] ?? "";

        $location = $prof['location'] ?? "";
        $about_me = $prof['about_me'] ?? "";
        $profile_picture_db = $prof['profile_picture'] ?? "";
        
        // Convert VPS absolute path to HTTP URL
        if (!empty($profile_picture_db)) {
            // Path is stored as: /var/www/html/Hirenorian/API/studentDB_APIs/Student%20Accounts/...
            // Convert to: http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Student%20Accounts/...
            $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
        } else {
            $profile_picture = "";
        }

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
} else {
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
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
                <a href="../../Student Profile Page/php/student_profile.php" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Student Internship Search Page New/php/internship_search.php" class="nav-item">
                    <i class="fa-solid fa-briefcase"></i>
                    <span>Internships</span>
                </a>

                <a href="../../Help Page/php/help.php" class="nav-item">
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
                        <a href="../../logout.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="../../../Account Registration Pages/Account Selection Page/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Profile Content -->
            <main class="dashboard-body">
                
                <!-- Hero Section (Edit Mode) -->
                <div class="profile-hero edit-mode">
                    <div class="profile-hero-content">
                        <div class="profile-avatar-wrapper">
                             <img src="<?php echo !empty($profile_picture) ? htmlspecialchars($profile_picture) : '../../../Landing Page/Images/gradpic2.png'; ?>" alt="Profile Picture" class="profile-avatar">
                             <button class="edit-photo-btn" data-modal-target="#editPhotoModal" title="Change Photo"><i class="fa-solid fa-camera"></i></button>
                        </div>
                        <div class="profile-info-main">
                             <h1 class="profile-name">
                                <span id="display-full-name"><?php echo htmlspecialchars($first_name . " " . ($middle_initial ? $middle_initial . ". " : "") . $last_name . " " . $suffix); ?></span>
                                <button class="btn-icon-edit-hero" data-modal-target="#editPersonalModal" title="Edit Name"><i class="fa-solid fa-pen"></i></button>
                             </h1>
                             <p class="profile-headline"><?php echo htmlspecialchars($course); ?></p>
                             <p class="profile-institution"><?php echo htmlspecialchars($university); ?></p>
                             
                             <div class="hero-verification-status">
                                <?php
                                if ($verified_status === 'verified') {
                                    echo '<span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Account Verified</span>';
                                } elseif ($verified_status === 'processing') {
                                    echo '<span class="processing-badge"><i class="fa-solid fa-spinner fa-spin"></i> Verification Processing</span>';
                                } else {
                                    echo '<span class="unverified-badge"><i class="fa-solid fa-circle-exclamation"></i> Verification Required</span>';
                                }
                                ?>
                             </div>
                        </div>
                        <div class="profile-hero-actions">
                            <!-- Account Actions -->
                            <button class="btn-profile-password" data-modal-target="#changePasswordModal">
                                <i class="fa-solid fa-key"></i> Password
                            </button>
                            <?php
                            if ($verified_status === 'unverified') {
                                echo '<button class="btn-profile-verify" onclick="window.location.href=\'../../Student Account Verification Page/php/verification.php\'"><i class="fa-solid fa-shield-halved"></i> Verify Now</button>';
                            } elseif ($verified_status === 'processing') {
                                echo '<button class="btn-profile-processing" onclick="alert(\'Verification is pending review.\')"><i class="fa-solid fa-clock"></i> Pending...</button>';
                            }
                            ?>
                        </div>
                    </div>
                </div>


                <div class="content-grid profile-grid-layout">
                    <!-- Left Sidebar (Sticky) -->
                    <div class="profile-sidebar">
                        
                        <!-- Contact Info -->
                        <div class="widget info-card">
                            <div class="widget-header-row">
                                <h3 class="widget-title"><i class="fa-solid fa-address-book"></i> Contact</h3>
                                <button class="icon-btn-edit" data-modal-target="#editContactModal"><i class="fa-solid fa-pen"></i></button>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-envelope"></i>
                                <div>
                                    <div class="info-label">Personal Email</div>
                                    <div class="info-value" id="display-personal-email"><?php echo !empty($personal_email) ? htmlspecialchars($personal_email) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-envelope-open-text"></i>
                                <div>
                                    <div class="info-label">Student Email</div>
                                    <div class="info-value"><?php echo !empty($student_email_val) ? htmlspecialchars($student_email_val) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-phone"></i>
                                <div>
                                    <div class="info-label">Phone Number</div>
                                    <div class="info-value" id="display-phone"><?php echo !empty($phone_number) ? htmlspecialchars($phone_number) : '<em style="color: #999;">Not Provided</em>'; ?></div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fa-solid fa-location-dot"></i>
                                <div>
                                    <div class="info-label">Location</div>
                                    <div class="info-value" id="display-location"><?php echo !empty($location) ? htmlspecialchars($location) : '<em style="color: #999;">Not Specified</em>'; ?></div>
                                </div>
                            </div>
                        </div>

                        <!-- Skills -->
                        <div class="widget skills-card">
                            <div class="widget-header-row">
                                <h3 class="widget-title"><i class="fa-solid fa-layer-group"></i> Skills</h3>
                                <button class="icon-btn-edit" data-modal-target="#editSkillsModal"><i class="fa-solid fa-pen"></i></button>
                            </div>

                            <div class="skill-category">
                                <h4>Technical</h4>
                                <div class="tags" id="technical-skills-display">
                                    <?php if(!empty($tech_arr)): foreach($tech_arr as $skill): ?>
                                    <span><?php echo htmlspecialchars($skill); ?></span>
                                    <?php endforeach; else: echo "<span class='empty-skill'>No technical skills</span>"; endif; ?>
                                </div>
                            </div>

                            <div class="skill-category">
                                <h4>Soft Skills</h4>
                                <div class="tags" id="soft-skills-display">
                                    <?php if(!empty($soft_arr)): foreach($soft_arr as $skill): ?>
                                    <span><?php echo htmlspecialchars($skill); ?></span>
                                    <?php endforeach; else: echo "<span class='empty-skill'>No soft skills</span>"; endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="profile-main">
                        <!-- About Me -->
                        <div class="widget section-card">
                            <div class="widget-header-row">
                                <h2 class="section-title"><i class="fa-solid fa-user-circle"></i> About Me</h2>
                                <button class="icon-btn-edit" data-modal-target="#editAboutModal"><i class="fa-solid fa-pen"></i></button>
                            </div>
                            <p class="section-text" id="display-about-me">
                                <?php echo !empty($about_me) ? nl2br(htmlspecialchars($about_me)) : "No bio added yet."; ?>
                            </p>
                        </div>

                        <!-- Experience -->
                        <div class="widget section-card">
                            <div class="widget-header-row">
                                <h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Experience</h2>
                                <button class="icon-btn-add" data-modal-target="#addExperienceModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline-v2">
                                <?php if(!empty($experience_list)): foreach($experience_list as $exp): ?>
                                <div class="timeline-item" data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>">
                                    <div class="timeline-icon"><i class="fa-solid fa-briefcase"></i></div>
                                    <div class="timeline-content">
                                        <div class="flex-between">
                                            <h3><?php echo htmlspecialchars($exp['job_title']); ?></h3>
                                            <div class="item-actions">
                                                <button class="action-btn edit edit-experience-btn" 
                                                    data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>"
                                                    data-job-title="<?php echo htmlspecialchars($exp['job_title']); ?>"
                                                    data-company="<?php echo htmlspecialchars($exp['company_name']); ?>"
                                                    data-start-date="<?php echo htmlspecialchars($exp['start_date']); ?>"
                                                    data-end-date="<?php echo htmlspecialchars($exp['end_date']); ?>"
                                                    data-description="<?php echo htmlspecialchars($exp['description']); ?>">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button class="action-btn delete delete-experience-btn" 
                                                    data-exp-id="<?php echo htmlspecialchars($exp['exp_id']); ?>">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p class="institution"><?php echo htmlspecialchars($exp['company_name']); ?></p>
                                        <p class="date"><?php echo htmlspecialchars($exp['start_date']) . " - " . htmlspecialchars($exp['end_date']); ?></p>
                                        <p class="description"><?php echo htmlspecialchars($exp['description']); ?></p>
                                    </div>
                                </div>
                                <?php endforeach; else: echo "<div class='empty-state'>No experience listed.</div>"; endif; ?>
                            </div>
                        </div>

                        <!-- Education -->
                        <div class="widget section-card">
                            <div class="widget-header-row">
                                <h2 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h2>
                                <button class="icon-btn-add" data-modal-target="#addEducationModal"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="timeline-v2">
                                <!-- Current Education (Usually not editable here manually unless part of history, let's keep it display only or add edit if desired, but typical user flow is history editting) -->
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

                                <?php if(!empty($education_history)): foreach($education_history as $hist): ?>
                                <div class="timeline-item" data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>">
                                    <div class="timeline-icon"><i class="fa-solid fa-school"></i></div>
                                    <div class="timeline-content">
                                        <div class="flex-between">
                                            <h3><?php echo htmlspecialchars($hist['degree']); ?></h3>
                                            <div class="item-actions">
                                                <button class="action-btn edit edit-education-btn" 
                                                    data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>"
                                                    data-degree="<?php echo htmlspecialchars($hist['degree']); ?>"
                                                    data-institution="<?php echo htmlspecialchars($hist['institution']); ?>"
                                                    data-start-year="<?php echo htmlspecialchars($hist['start_year']); ?>"
                                                    data-end-year="<?php echo htmlspecialchars($hist['end_year']); ?>">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button class="action-btn delete delete-education-btn" 
                                                    data-edu-id="<?php echo htmlspecialchars($hist['edu_hist_id']); ?>">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p class="institution"><?php echo htmlspecialchars($hist['institution']); ?></p>
                                        <p class="date"><?php echo htmlspecialchars($hist['start_year']) . " - " . htmlspecialchars($hist['end_year']); ?></p>
                                    </div>
                                </div>
                                <?php endforeach; endif; ?>
                                
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
            <input type="hidden" name="student_id" value="<?php echo htmlspecialchars($student_id); ?>">
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
                <input type="hidden" name="student_id" id="studentIdPersonal" value="<?php echo htmlspecialchars($student_id); ?>">
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="first_name" value="<?php echo htmlspecialchars($first_name); ?>">
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="last_name" value="<?php echo htmlspecialchars($last_name); ?>">
                    </div>
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="middleInitial">Middle Initial</label>
                        <input type="text" id="middleInitial" name="middle_initial" value="<?php echo htmlspecialchars($middle_initial); ?>" maxlength="2">
                    </div>
                    <div class="form-group">
                        <label for="suffix">Suffix</label>
                        <input type="text" id="suffix" name="suffix" value="<?php echo htmlspecialchars($suffix); ?>" placeholder="e.g. Jr., III">
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
            <!-- Hidden Fields -->
            <input type="hidden" id="otp_student_email" value="<?php echo htmlspecialchars($student_email_val); ?>">
            <input type="hidden" id="otp_student_id" value="<?php echo htmlspecialchars($student_id); ?>">

            <!-- Step 1: Security Verification (OTP) -->
             <div id="password-step-otp">
                <div class="text-center" style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px;">Security Verification</h4>
                    <div style="margin-bottom: 15px;">
                       <i class="fa-solid fa-shield-halved" style="font-size: 3rem; color: var(--primary-maroon);"></i>
                    </div>
                    <p style="color: #666; font-size: 0.9em;">To protect your account, we've sent a verification code to your student email: <strong id="password-otp-email-display"><?php echo htmlspecialchars($student_email_val); ?></strong></p>
                    <p id="password-otp-status" style="font-size: 0.8em; color: #888; margin-top: 5px;"><i class="fa fa-spinner fa-spin"></i> Sending code...</p>
                </div>
                
                <div class="form-group">
                    <div class="otp-input-container">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        <input type="text" class="password-otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                    </div>
                    <p id="password-otp-error" style="color: red; text-align: center; font-size: 0.9em; display: none;">Invalid OTP</p>
                </div>

                <div class="modal-footer" style="justify-content: center;">
                    <button type="button" class="btn-primary" id="btn-verify-password-otp">Verify Code</button>
                    <!-- <button type="button" class="btn-secondary" id="btn-resend-password-otp" style="font-size: 0.8rem; margin-top: 10px;">Resend Code</button> -->
                </div>
            </div>

            <!-- Step 2: Change Password Form (Hidden initially) -->
            <form action="" method="POST" id="passwordForm" style="display: none;">
                <input type="hidden" name="student_id" id="studentIdPassword" value="<?php echo htmlspecialchars($student_id); ?>">
                
                <!-- Current Password Field Removed as per user request (OTP used instead) -->
                
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
            <form action="" method="POST" id="contactForm">
                <input type="hidden" name="student_id" id="student_id" value="<?php echo htmlspecialchars($student_id); ?>">
                
                <!-- Step 1: Input Details -->
                <div id="contact-step-1">
                    <div class="form-group">
                        <label for="personalEmail">Personal Email</label>
                        <div class="email-verification-wrapper">
                            <input type="hidden" id="originalPersonalEmail" value="<?php echo htmlspecialchars($personal_email); ?>">
                            <input type="email" id="personalEmail" name="personal_email" value="<?php echo htmlspecialchars($personal_email); ?>">
                            
                            <!-- Verify Button (Hidden by default, shown when email changes) -->
                            <button type="button" class="verify-btn" id="verify-personal-email-btn" style="display: none;" title="Verify Email">
                                <i class="fa fa-shield-alt"></i>
                            </button>
                            
                            <!-- Verified Badge (Shown by default) -->
                            <div class="input-verified-badge" id="personal-email-verified">
                                <i class="fa fa-circle-check"></i>
                            </div>
                        </div>
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
                        <button type="submit" class="btn-primary" id="btn-save-contact">Save Changes</button>
                    </div>
                </div>

                <!-- Step 2: OTP Verification (Hidden initially) -->
                <div id="contact-step-2" style="display: none;">
                    <div class="text-center" style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">Verify Email</h4>
                        <p style="color: #666; font-size: 0.9em;">We sent a verification code to <strong id="verify-email-display"></strong></p>
                    </div>
                    
                    <div class="form-group">
                        <label>Enter 6-Digit Code</label>
                        <div class="otp-input-container">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                            <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                        </div>
                        <p id="otp-error" style="color: red; text-align: center; font-size: 0.9em; display: none;">Invalid OTP</p>
                    </div>

                    <div class="modal-footer" style="justify-content: space-between;">
                        <button type="button" class="btn-secondary" id="btn-back-contact">Back</button>
                        <button type="button" class="btn-primary" id="btn-verify-contact">Verify & Save</button>
                    </div>
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
            <input type="hidden" name="student_id" value="<?php echo htmlspecialchars($student_id); ?>">
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
            <input type="hidden" name="student_id" id="studentId" value="<?php echo htmlspecialchars($student_id); ?>">
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
            <form action="" method="POST" id="addEducationForm">
            <input type="hidden" name="student_id" id="studentId" value="<?php echo htmlspecialchars($student_id); ?>">
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
                <input type="hidden" name="student_id" value="<?php echo htmlspecialchars($student_id); ?>">
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
            <input type="hidden" name="student_id" id="studentIdExp" value="<?php echo htmlspecialchars($student_id); ?>">
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
                <input type="hidden" name="student_id" value="<?php echo htmlspecialchars($student_id); ?>">
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
    <script src="../js/edit_profile.js"></script>
</body>
</html>