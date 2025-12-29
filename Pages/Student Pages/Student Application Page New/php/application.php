<?php
session_start();
if(!isset($_SESSION['email'])) {
    header("Location: ../../../Landing Page Tailwind/php/index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apply for Internship - Hirenorian</title>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/application.css">
</head>
<body>

    <!-- Main Container -->
    <div class="app-wrapper">
        
        <!-- Left Panel: Progress -->
        <div class="app-sidebar">
            <div class="app-logo">
                <img src="../../../Landing Page/Images/dhvsulogo.png" alt="Logo">
                <span>Hirenorian</span>
            </div>
            
            <div class="progress-steps-container">
                <div class="progress-step active" data-step="1">
                    <div class="step-icon">1</div>
                    <div class="step-text">
                        <h3>Start</h3>
                        <p>Welcome</p>
                    </div>
                </div>
                <div class="progress-step" data-step="2">
                    <div class="step-icon">2</div>
                    <div class="step-text">
                        <h3>Profile</h3>
                        <p>Review Details</p>
                    </div>
                </div>
                <div class="progress-step" data-step="3">
                    <div class="step-icon">3</div>
                    <div class="step-text">
                        <h3>Resume</h3>
                        <p>Upload CV</p>
                    </div>
                </div>
                <div class="progress-step" data-step="4">
                    <div class="step-icon">4</div>
                    <div class="step-text">
                        <h3>Cover Letter</h3>
                        <p>Add Letter</p>
                    </div>
                </div>
                <div class="progress-step" data-step="5">
                    <div class="step-icon">5</div>
                    <div class="step-text">
                        <h3>Review</h3>
                        <p>Final Check</p>
                    </div>
                </div>
            </div>
            
            <div class="app-sidebar-footer">
                <button id="cancelAppBtn" class="btn-text-only">Cancel Application</button>
            </div>
        </div>

        <!-- Right Panel: Content -->
        <main class="app-content">
            
            <!-- Step 1: Welcome -->
            <div class="app-step active" id="step-1">
                <div class="step-header">
                    <h1>Ready to Apply?</h1>
                    <p>You are applying for the position of <strong id="jobTitleDisplay">...</strong> at <strong id="companyNameDisplay">...</strong></p>
                </div>
                <div class="step-body center-content">
                    <img src="../../../Landing Page/Images/resume-folder.svg" alt="Apply" class="step-illustration" onerror="this.style.display='none'">
                    <p class="instruction-text">Make sure your profile information is up to date and you have your documents ready.</p>
                </div>
                <div class="step-footer">
                   <button class="btn-primary-large btn-next" data-next="2">Get Started <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>

            <!-- Step 2: Profile Review -->
            <div class="app-step" id="step-2">
                <div class="step-header">
                    <h2>Review Your Profile</h2>
                    <p>Confirm your personal details before proceeding.</p>
                </div>
                <div class="step-body">
                    <div class="profile-preview-card" id="profilePreview">
                        <!-- Populated by JS -->
                        <div class="loading-spinner"><div class="spinner"></div></div>
                    </div>
                    <div class="info-alert">
                       <i class="fa-solid fa-circle-info"></i>
                       <span>To update these details, please go to your Profile page.</span>
                    </div>
                </div>
                <div class="step-footer">
                    <button class="btn-secondary btn-prev" data-prev="1">Back</button>
                    <button class="btn-primary btn-next" data-next="3">Looks Good</button>
                </div>
            </div>

            <!-- Step 3: Resume -->
            <div class="app-step" id="step-3">
                <div class="step-header">
                    <h2>Upload Resume</h2>
                    <p id="resumeRequirementText">Please upload your resume (PDF/DOCX).</p>
                </div>
                <div class="step-body">
                    <div class="upload-zone" id="resumeUploadZone">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <h3>Drag & drop your resume here</h3>
                        <p>or <span class="browser-link">browse files</span></p>
                        <input type="file" id="resumeFile" hidden accept=".pdf,.doc,.docx">
                    </div>
                    
                    <div class="file-preview-card" id="resumePreview" style="display: none;">
                       <div class="file-icon"><i class="fa-solid fa-file-pdf"></i></div>
                       <div class="file-info">
                           <h4 id="resumeName">filename.pdf</h4>
                           <span id="resumeSize">0 KB</span>
                       </div>
                       <button class="btn-remove-file" id="removeResume"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
                <div class="step-footer">
                    <button class="btn-secondary btn-prev" data-prev="2">Back</button>
                    <button class="btn-primary btn-next" id="resumeNextBtn" data-next="4">Next Step</button>
                </div>
            </div>

            <!-- Step 4: Cover Letter -->
            <div class="app-step" id="step-4">
                <div class="step-header">
                    <h2>Cover Letter</h2>
                    <p id="coverLetterRequirementText">Add a cover letter to stand out.</p>
                </div>
                <div class="step-body">
                    <div class="upload-zone" id="clUploadZone">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <h3>Drag & drop cover letter</h3>
                        <p>or <span class="browser-link">browse files</span></p>
                         <input type="file" id="coverLetterFile" hidden accept=".pdf,.doc,.docx">
                    </div>

                    <div class="file-preview-card" id="clPreview" style="display: none;">
                       <div class="file-icon"><i class="fa-solid fa-file-lines"></i></div>
                       <div class="file-info">
                           <h4 id="clName">filename.pdf</h4>
                           <span id="clSize">0 KB</span>
                       </div>
                       <button class="btn-remove-file" id="removeCl"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
                <div class="step-footer">
                    <button class="btn-secondary btn-prev" data-prev="3">Back</button>
                    <button class="btn-primary btn-next" id="clNextBtn" data-next="5">Next Step</button>
                </div>
            </div>

            <!-- Step 5: Final Review -->
            <div class="app-step" id="step-5">
                <div class="step-header">
                    <h2>Review Application</h2>
                    <p>You are about to submit your application.</p>
                </div>
                <div class="step-body">
                    <div class="review-summary">
                        <div class="review-section">
                            <h3>Job Details</h3>
                            <div id="reviewJobDetails"></div>
                        </div>
                        <div class="review-section">
                            <h3>Documents</h3>
                            <div id="reviewDocuments"></div>
                        </div>
                    </div>
                </div>
                <div class="step-footer">
                    <button class="btn-secondary btn-prev" data-prev="4">Back</button>
                    <button class="btn-primary-large" id="submitAppBtn">Submit Application</button>
                </div>
            </div>

            <!-- Step 6: Success -->
            <div class="app-step" id="step-6">
                 <div class="success-content">
                     <div class="success-icon">
                         <i class="fa-solid fa-check"></i>
                     </div>
                     <h2>Application Submitted!</h2>
                     <p>Your application has been successfully sent to the company. Good luck!</p>
                     
                     <div class="success-actions">
                         <a href="../../Student Dashboard Page/php/student_dashboard.php" class="btn-primary">Return to Dashboard</a>
                         <a href="../../Student Internship Search Page New/php/internship_search.php" class="btn-secondary">Search More Jobs</a>
                     </div>
                 </div>
            </div>

        </main>
    </div>

    <!-- Custom Modal -->
    <div class="custom-modal" id="appModal">
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header">
                <div class="modal-icon" id="modalIcon">
                    <i class="fa-solid fa-circle-info"></i>
                </div>
                <h3 id="modalTitle">Notification</h3>
            </div>
            <div class="modal-body">
                <p id="modalMessage">Message goes here...</p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="modalCancelBtn">Cancel</button>
                <button class="btn-primary" id="modalConfirmBtn">Confirm</button>
            </div>
        </div>
    </div>

    <!-- Initialization Data -->
    <script>
        const USER_EMAIL = '<?php echo addslashes($_SESSION['email']); ?>';
    </script>
    <script type="module" src="../js/application.js"></script>
</body>
</html>
