<?php
session_start();
if (isset($_SESSION['email'])) {
    $student_email = $_SESSION['email'];
    
    // Fetch student information from API (for Topbar Display)
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
            $student_id = $basic_info['student_id']; // Added student_id
            $profile_picture_db = $profile['profile_picture'];
            
            // Convert VPS absolute path to HTTP URL
            if (!empty($profile_picture_db)) {
                $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
            }
        }
    }
} else {
    // Redirect to Landing Page if not logged in
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Account - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/verification.css">
    
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
                <a href="../../Student Profile Page New/php/student_profile.php" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Student Internship Search Page New/php/internship_search.php" class="nav-item">
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
                </div>
            </header>

            <!-- Verification Page Content -->
            <main class="verification-body">
                <div class="verification-container">
                    <input type="hidden" id="studentId" value="<?php echo htmlspecialchars($student_id ?? ''); ?>">                <!-- Step 1: Welcome -->
                    <div class="verification-step active" data-step="1">
                        <div class="step-header">
                            <div class="type-icon">
                                <i class="fa-solid fa-shield-halved"></i>
                            </div>
                            <h2>Verify Your Account</h2>
                            <p>Get verified to access exclusive internship opportunities and unlock all features.</p>
                        </div>
                        <div class="step-content" style="text-align: center;">
                            <p style="color: #666; margin-bottom: 30px;">
                                Helping us verify your identity builds trust with employers and universities. 
                                The process is simple and only takes a few minutes.
                            </p>
                            <button class="btn-primary-action btn-next-step" data-next="2">
                                Start Verification <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Status Selection -->
                    <div class="verification-step" data-step="2">
                        <div class="step-header">
                            <h2>What is your current status?</h2>
                            <p>Please select your current educational status.</p>
                        </div>
                        <div class="type-selection-grid">
                            <!-- Graduate Option -->
                            <div class="type-card" data-type="graduate">
                                <div class="type-icon"><i class="fa-solid fa-graduation-cap"></i></div>
                                <h3>Graduate</h3>
                                <p>I have completed my degree and graduated.</p>
                            </div>
                            
                            <!-- Undergraduate Option -->
                            <div class="type-card" data-type="undergraduate">
                                <div class="type-icon"><i class="fa-solid fa-user-graduate"></i></div>
                                <h3>Undergraduate</h3>
                                <p>I am currently enrolled as a student.</p>
                            </div>
                        </div>
                        <div class="step-actions">
                            <button class="btn-secondary-action btn-back-step" data-prev="1">
                                <i class="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <button class="btn-primary-action btn-next-step step-2-next" data-next="3" disabled>
                                Continue <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Document Upload -->
                    <div class="verification-step" data-step="3">
                        <div class="step-header">
                            <h2>Upload Documents</h2>
                            <p>Please upload clear copies of the required documents.</p>
                        </div>

                        <!-- Graduate Uploads -->
                        <div id="graduate-uploads" style="display: none;">
                            <div class="upload-group">
                                <label>Transcript of Records (TOR)</label>
                                <div class="upload-area">
                                    <input type="file" id="torFile" accept="image/*,.pdf" hidden>
                                    <div class="upload-icon"><i class="fa-solid fa-file-contract"></i></div>
                                    <p class="upload-text">Click to upload TOR</p>
                                    <span class="file-name-display"></span>
                                </div>
                            </div>
                            <div class="upload-group">
                                <label>Diploma</label>
                                <div class="upload-area">
                                    <input type="file" id="diplomaFile" accept="image/*,.pdf" hidden>
                                    <div class="upload-icon"><i class="fa-solid fa-certificate"></i></div>
                                    <p class="upload-text">Click to upload Diploma</p>
                                    <span class="file-name-display"></span>
                                </div>
                            </div>
                        </div>

                        <!-- Undergraduate Uploads -->
                        <div id="undergraduate-uploads" style="display: none;">
                            <div class="upload-group">
                                <label>Student ID (Front & Back)</label>
                                <div class="upload-area">
                                    <input type="file" id="idFile" accept="image/*,.pdf" hidden>
                                    <div class="upload-icon"><i class="fa-solid fa-id-card"></i></div>
                                    <p class="upload-text">Click to upload Student ID</p>
                                    <span class="file-name-display"></span>
                                </div>
                            </div>
                            <div class="upload-group">
                                <label>Certificate of Registration (COR)</label>
                                <div class="upload-area">
                                    <input type="file" id="corFile" accept="image/*,.pdf" hidden>
                                    <div class="upload-icon"><i class="fa-solid fa-file-invoice"></i></div>
                                    <p class="upload-text">Click to upload COR</p>
                                    <span class="file-name-display"></span>
                                </div>
                            </div>
                        </div>

                        <div class="step-actions">
                            <button class="btn-secondary-action btn-back-step" data-prev="2">
                                <i class="fa-solid fa-arrow-left"></i> Back
                            </button>
                            <button class="btn-primary-action btn-submit" id="submitVerificationBtn" disabled>
                                Submit Verification <i class="fa-solid fa-check"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Step 4: Success -->
                    <div class="verification-step" data-step="4">
                        <div class="success-content">
                            <div class="success-icon">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h2>Verification Submitted!</h2>
                            <p>Thank you! Your documents have been received and are under review. We will notify you once your account status is updated.</p>
                            
                            <a href="../../Student Dashboard Page/php/student_dashboard.php" class="btn-primary-action btn-dashboard">
                                Return to Dashboard
                            </a>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>
    
    <script src="../js/verification.js"></script> 
    <!-- Click on upload area trigger input -->
    <script>
        document.querySelectorAll('.upload-area').forEach(area => {
            area.addEventListener('click', () => {
                area.querySelector('input').click();
            });
            area.querySelector('input').addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    </script>
</body>
</html>
