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
        echo "<script>console.log('Curl error: " . curl_error($ch) . "');</script>";
    }
    curl_close($ch);

    $data = json_decode($response, true);
    
    // Initialize default values for header
    $first_name = ""; $last_name = ""; $profile_picture = "";

    if (isset($data['status']) && $data['status'] === "success") {
        $basic = $data['data']['basic_info'] ?? [];
        $prof = $data['data']['profile'] ?? [];

        $first_name = $basic['first_name'] ?? "";
        $last_name = $basic['last_name'] ?? "";
        $profile_picture_db = $prof['profile_picture'] ?? "";
        
        if (!empty($profile_picture_db)) {
            $profile_picture = str_replace('/var/www/html/', 'http://mrnp.site:8080/', $profile_picture_db);
        }
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
    <title>Help & Guidelines - Hirenorian</title>
    <!-- Shared CSS -->
    <link rel="stylesheet" href="../../Student Dashboard Page/css/variables.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/layout.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/sidebar.css">
    <link rel="stylesheet" href="../../Student Dashboard Page/css/topbar.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/help.css">
    
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
                <a href="#" class="nav-item active">
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
                        <a href="../../../Account Registration Pages/Account Selection Modern/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- New Help Layout -->
            <main class="dashboard-body help-container">
                
                <!-- Sticky Sidebar Nav -->
                <aside class="help-sidebar">
                    <div class="help-nav-title">Guide Navigation</div>
                    <ul class="help-nav-list">
                        <li class="help-nav-item"><a href="#dashboard" class="help-nav-link active">Dashboard Overview</a></li>
                        <li class="help-nav-item"><a href="#profile" class="help-nav-link">Profile & Security</a></li>
                        <li class="help-nav-item"><a href="#search" class="help-nav-link">Internship Search</a></li>
                        <li class="help-nav-item"><a href="#application" class="help-nav-link">Application Process</a></li>
                        <li class="help-nav-item"><a href="#faqs" class="help-nav-link">FAQs</a></li>
                    </ul>
                </aside>

                <!-- Scrollable Content -->
                <div class="help-content">
                    
                    <h1 class="help-title">Student User Guide</h1>
                    <p class="help-subtitle">Everything you need to know about managing your internship journey on Hirenorian.</p>
                    
                    <!-- 1. Dashboard -->
                    <section id="dashboard" class="help-section">
                        <h2><i class="fa-solid fa-table-columns"></i> Dashboard Overview</h2>
                        <p>The Student Dashboard is your central command center. Upon logging in, you'll see a quick snapshot of your application progress and profile status.</p>
                        
                        <h3>Key Metrics</h3>
                        <ul>
                            <li><strong>Profile Strength:</strong> Indicates how complete your profile is. A 100% score improves your visibility to employers.</li>
                            <li><strong>Accepted:</strong> Applications that companies have approved.</li>
                            <li><strong>Pending:</strong> Applications currently being reviewed.</li>
                            <li><strong>Rejected:</strong> Applications that were not selected.</li>
                        </ul>

                        <div class="info-box">
                            <strong><i class="fa-solid fa-lightbulb"></i> Tip:</strong>
                            Check the "Application Pipeline" list for real-time status updates on all your submissions.
                        </div>
                    </section>

                    <!-- 2. Profile -->
                    <section id="profile" class="help-section">
                        <h2><i class="fa-solid fa-user-shield"></i> Profile & Security</h2>
                        <p>Your profile is your digital resume. Keeping it updated is crucial for attracting companies.</p>

                        <h3>Verified Status</h3>
                        <p>You may notice a <span style="background:#e0f2f1; color:#00695c; padding:2px 8px; border-radius:12px; font-size:0.85em; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Verified</span> badge next to your name. This indicates your student enrollment has been confirmed by admins. 
                        <br><strong>Note:</strong> Unverified students cannot apply for jobs.</p>

                        <h3>Managing Skills</h3>
                        <p>In the Edit Profile page, you can add two types of skills:</p>
                        <ul>
                            <li><strong>Technical Skills:</strong> Hard skills like specific software, programming languages, or tools (e.g., Photoshop, Python, Accounting).</li>
                            <li><strong>Soft Skills:</strong> Interpersonal attributes like Leadership, Communication, or Adaptability.</li>
                        </ul>

                        <h3>Account Security (OTP)</h3>
                        <p>For your security, critical actions like <strong>changing your password</strong> or updating contact info now require a One-Time Password (OTP) sent to your registered email.</p>
                    </section>
                    
                    <!-- 3. Search -->
                    <section id="search" class="help-section">
                        <h2><i class="fa-solid fa-magnifying-glass"></i> Internship Search</h2>
                        <p>Our new search interface helps you find the right fit faster.</p>

                        <h3>Using Filters</h3>
                        <p>Use the dropdown filters next to the search bar to narrow down results:</p>
                        <ul>
                            <li><strong>Location:</strong> Filter jobs by province or city.</li>
                            <li><strong>Type:</strong> Select between Internship, Part-time, or Full-time roles.</li>
                        </ul>

                        <h3>Split-View Layout</h3>
                        <p>Clicking a job card on the left automatically opens its full details on the right side of the screen. This lets you browse quickly without losing your scroll position.</p>
                    </section>

                    <!-- 4. Application -->
                    <section id="application" class="help-section">
                        <h2><i class="fa-solid fa-paper-plane"></i> Application Process</h2>
                        <p>Applying is a simple 5-step process designed to ensure you send a complete package to employers.</p>

                        <div class="step-diagram">
                            <div class="step-item">
                                <div class="step-circle">1</div>
                                <div class="step-label">Start</div>
                            </div>
                            <div class="step-item">
                                <div class="step-circle">2</div>
                                <div class="step-label">Profile</div>
                            </div>
                            <div class="step-item">
                                <div class="step-circle">3</div>
                                <div class="step-label">Resume</div>
                            </div>
                            <div class="step-item">
                                <div class="step-circle">4</div>
                                <div class="step-label">Cover</div>
                            </div>
                            <div class="step-item">
                                <div class="step-circle">5</div>
                                <div class="step-label">Submit</div>
                            </div>
                        </div>

                        <ol>
                            <li><strong>Start:</strong> Confirm the position you are applying for.</li>
                            <li><strong>Profile Check:</strong> Review your details to ensure they are accurate.</li>
                            <li><strong>Resume:</strong> Upload your CV (PDF/DOCX is recommended).</li>
                            <li><strong>Cover Letter:</strong> Upload or write a cover letter to personalize your application.</li>
                            <li><strong>Review & Submit:</strong> Final check before sending it off.</li>
                        </ol>

                        <div class="info-box">
                            <strong><i class="fa-solid fa-triangle-exclamation"></i> Important:</strong>
                            Only <strong>Verified</strong> students can access the application page. If you are unverified, please contact the admin or complete your registration requirements.
                        </div>
                    </section>

                    <!-- 5. FAQs -->
                    <section id="faqs" class="help-section">
                        <h2><i class="fa-solid fa-circle-question"></i> FAQs</h2>
                        
                        <h3>Why can't I click "Apply Now"?</h3>
                        <p>The button is disabled for unverified accounts. Please ensure your account status is verified.</p>

                        <h3>Can I delete my application?</h3>
                        <p>Once submitted, applications cannot be deleted, but you can view their status on your dashboard sidebar.</p>

                        <h3>How do I update my email?</h3>
                        <p>Go to Edit Profile > Contact Info. You will need to verify the new email address via OTP.</p>
                    </section>

                </div>
            </main>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="../js/help_interaction.js"></script>
    <script>
        // Inline script for Profile Dropdown (Self-contained)
        const profileBtn = document.getElementById('userProfileBtn');
        const profileDropdown = document.getElementById('profileDropdown');
        
        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle 'show' class as per topbar.css
                profileDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                    profileDropdown.classList.remove('show');
                }
            });
        }
    </script>
</body>
</html>
