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
    
    if ($response !== false) {
        $data = json_decode($response, true);
        
        if (isset($data['status']) && $data['status'] === "success") {
            $basic_info = $data['data']['basic_info'];
            $profile = $data['data']['profile'];
            
            $first_name = $basic_info['first_name'];
            $last_name = $basic_info['last_name'];
            $profile_picture_db = $profile['profile_picture'];
            
            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }
        }
    }
} else {
    header("Location: ../../../Landing Page/php/landing_page.php");
    exit();
}
?>
// Get job ID from query parameter
$job_id = isset($_GET['job_id']) ? $_GET['job_id'] : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Application - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/application_form.css">
    
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
                <a href="../../Internship Search Page/php/internship_search.php" class="nav-item">
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
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Application Form Content -->
            <main class="dashboard-body application-form-body">
                <div class="application-container">
                    <!-- Progress Indicator -->
                    <div class="progress-indicator">
                        <div class="progress-step" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Welcome</div>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Review Profile</div>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Resume</div>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="4">
                            <div class="step-number">4</div>
                            <div class="step-label">Cover Letter</div>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="5">
                            <div class="step-number">5</div>
                            <div class="step-label">Review</div>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step" data-step="6">
                            <div class="step-number">6</div>
                            <div class="step-label">Complete</div>
                        </div>
                    </div>

                    <!-- Step 1: Landing Poster -->
                    <div class="application-step active" id="step-1">
                        <div class="step-poster landing-poster">
                            <div class="poster-icon">
                                <i class="fa-solid fa-briefcase"></i>
                            </div>
                            <h1>Ready to Apply?</h1>
                            <p>Let's get started with your application. This process will take just a few minutes.</p>
                            <div class="poster-features">
                                <div class="feature-item">
                                    <i class="fa-solid fa-check-circle"></i>
                                    <span>Review your profile</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fa-solid fa-check-circle"></i>
                                    <span>Upload your documents</span>
                                </div>
                                <div class="feature-item">
                                    <i class="fa-solid fa-check-circle"></i>
                                    <span>Review and submit</span>
                                </div>
                            </div>
                            <button class="btn-primary btn-next-step" data-next="2">
                                Get Started <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Review Profile -->
                    <div class="application-step" id="step-2">
                        <div class="step-content">
                            <h2>Review Your Profile</h2>
                            <p class="step-description">Please review your profile information before proceeding. Make sure all information is up to date.</p>
                            
                            <div class="profile-review-card">
                                <div class="review-header">
                                    <h3>Your Profile Information</h3>
                                    <a href="../../Student Profile Page/php/student_profile.php" class="btn-edit-profile" target="_blank">
                                        <i class="fa-solid fa-external-link"></i> Edit Profile
                                    </a>
                                </div>
                                <div class="profile-preview" id="profilePreview">
                                    <!-- Profile information will be loaded here via JavaScript -->
                                    <div class="loading-state">
                                        <div class="spinner"></div>
                                        <p>Loading profile information...</p>
                                    </div>
                                </div>
                            </div>

                            <div class="step-actions">
                                <button class="btn-secondary btn-prev-step" data-prev="1">
                                    <i class="fa-solid fa-arrow-left"></i> Back
                                </button>
                                <button class="btn-primary btn-next-step" data-next="3">
                                    Continue <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Upload Resume -->
                    <div class="application-step" id="step-3">
                        <div class="step-content">
                            <h2>Upload Your Resume</h2>
                            <p class="step-description">Please upload your resume in PDF format. Maximum file size: 5MB</p>
                            
                            <div class="upload-section">
                                <div class="upload-area" id="resumeUploadArea">
                                    <input type="file" id="resumeFile" name="resume" accept=".pdf,.doc,.docx" style="display: none;">
                                    <div class="upload-content">
                                        <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                                        <h3>Drop your resume here</h3>
                                        <p>or <span class="upload-link" id="resumeUploadLink">browse files</span></p>
                                        <p class="upload-hint">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                </div>
                                
                                <div class="uploaded-file" id="resumeFileInfo" style="display: none;">
                                    <div class="file-info">
                                        <i class="fa-solid fa-file-pdf file-icon"></i>
                                        <div class="file-details">
                                            <span class="file-name" id="resumeFileName"></span>
                                            <span class="file-size" id="resumeFileSize"></span>
                                        </div>
                                        <button class="btn-remove-file" id="removeResume">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="step-actions">
                                <button class="btn-secondary btn-prev-step" data-prev="2">
                                    <i class="fa-solid fa-arrow-left"></i> Back
                                </button>
                                <button class="btn-primary btn-next-step" data-next="4" id="resumeNextBtn" disabled>
                                    Continue <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Upload Cover Letter -->
                    <div class="application-step" id="step-4">
                        <div class="step-content">
                            <h2>Upload Your Cover Letter</h2>
                            <p class="step-description">Please upload your cover letter in PDF format. Maximum file size: 5MB</p>
                            
                            <div class="upload-section">
                                <div class="upload-area" id="coverLetterUploadArea">
                                    <input type="file" id="coverLetterFile" name="cover_letter" accept=".pdf,.doc,.docx" style="display: none;">
                                    <div class="upload-content">
                                        <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                                        <h3>Drop your cover letter here</h3>
                                        <p>or <span class="upload-link" id="coverLetterUploadLink">browse files</span></p>
                                        <p class="upload-hint">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                </div>
                                
                                <div class="uploaded-file" id="coverLetterFileInfo" style="display: none;">
                                    <div class="file-info">
                                        <i class="fa-solid fa-file-pdf file-icon"></i>
                                        <div class="file-details">
                                            <span class="file-name" id="coverLetterFileName"></span>
                                            <span class="file-size" id="coverLetterFileSize"></span>
                                        </div>
                                        <button class="btn-remove-file" id="removeCoverLetter">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="step-actions">
                                <button class="btn-secondary btn-prev-step" data-prev="3">
                                    <i class="fa-solid fa-arrow-left"></i> Back
                                </button>
                                <button class="btn-primary btn-next-step" data-next="5" id="coverLetterNextBtn" disabled>
                                    Continue <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 5: Review All Information -->
                    <div class="application-step" id="step-5">
                        <div class="step-content">
                            <h2>Review Your Application</h2>
                            <p class="step-description">Please review all information before submitting. You can edit any section if needed.</p>
                            
                            <div class="review-section">
                                <!-- Job Information -->
                                <div class="review-card">
                                    <div class="review-card-header">
                                        <h3><i class="fa-solid fa-briefcase"></i> Job Information</h3>
                                        <span class="edit-badge">Read-only</span>
                                    </div>
                                    <div class="review-card-body" id="jobInfoReview">
                                        <!-- Job info will be populated via JavaScript -->
                                    </div>
                                </div>

                                <!-- Profile Information -->
                                <div class="review-card">
                                    <div class="review-card-header">
                                        <h3><i class="fa-solid fa-user"></i> Profile Information</h3>
                                        <a href="../../Student Profile Page/php/student_profile.php" class="edit-link" target="_blank">
                                            <i class="fa-solid fa-external-link"></i> Edit
                                        </a>
                                    </div>
                                    <div class="review-card-body" id="profileInfoReview">
                                        <!-- Profile info will be populated via JavaScript -->
                                    </div>
                                </div>

                                <!-- Resume -->
                                <div class="review-card">
                                    <div class="review-card-header">
                                        <h3><i class="fa-solid fa-file-pdf"></i> Resume</h3>
                                        <button class="edit-link" id="editResumeBtn">
                                            <i class="fa-solid fa-pencil"></i> Change
                                        </button>
                                    </div>
                                    <div class="review-card-body" id="resumeReview">
                                        <!-- Resume info will be populated via JavaScript -->
                                    </div>
                                </div>

                                <!-- Cover Letter -->
                                <div class="review-card">
                                    <div class="review-card-header">
                                        <h3><i class="fa-solid fa-file-lines"></i> Cover Letter</h3>
                                        <button class="edit-link" id="editCoverLetterBtn">
                                            <i class="fa-solid fa-pencil"></i> Change
                                        </button>
                                    </div>
                                    <div class="review-card-body" id="coverLetterReview">
                                        <!-- Cover letter info will be populated via JavaScript -->
                                    </div>
                                </div>
                            </div>

                            <div class="step-actions">
                                <button class="btn-secondary btn-prev-step" data-prev="4">
                                    <i class="fa-solid fa-arrow-left"></i> Back
                                </button>
                                <button class="btn-primary btn-submit-application" id="submitApplicationBtn">
                                    <i class="fa-solid fa-paper-plane"></i> Submit Application
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 6: Completion Poster -->
                    <div class="application-step" id="step-6">
                        <div class="step-poster completion-poster">
                            <div class="poster-icon success">
                                <i class="fa-solid fa-check-circle"></i>
                            </div>
                            <h1>Application Submitted!</h1>
                            <p>Thank you for applying. Your application has been successfully submitted.</p>
                            <div class="completion-details">
                                <p><strong>What's next?</strong></p>
                                <ul>
                                    <li>You will receive a confirmation email shortly</li>
                                    <li>The company will review your application</li>
                                    <li>You'll be notified of any updates via email</li>
                                </ul>
                            </div>
                            <div class="poster-actions">
                                <a href="../../Internship Search Page/php/internship_search.php" class="btn-primary">
                                    <i class="fa-solid fa-magnifying-glass"></i> Browse More Jobs
                                </a>
                                <a href="../../Student Dashboard Page/php/student_dashboard.php" class="btn-secondary">
                                    <i class="fa-solid fa-table-columns"></i> Go to Dashboard
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Pass PHP session data and job ID to JavaScript -->
    <script>
        // Store session email and job ID in sessionStorage for JavaScript modules
        <?php if(isset($_SESSION['email'])): ?>
        sessionStorage.setItem('email', '<?php echo addslashes($_SESSION['email']); ?>');
        <?php endif; ?>
        sessionStorage.setItem('applicationJobId', '<?php echo addslashes($job_id); ?>');
    </script>
    
    <script type="module" src="../js/application_form.js"></script>
</body>
</html>

