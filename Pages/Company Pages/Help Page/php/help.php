<?php
session_start();
if (isset($_SESSION['email'])) {
    $company_email = $_SESSION['email'];
    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_information.php";

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "company_email" => $company_email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {
        die("Curl error: " . curl_error($ch));
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Updated to match new API structure
    if (isset($data['company'])) {
        $company = $data['company'];
        $company_id = $company['company_id'];
        $company_name = $company['company_name'];
        // Assume API returns 'verification' or similar due to our previous finding
        // Checking API: fetch_company_information.php
        // It returns all company columns including 'verification'
        // Check for boolean true, string "true", or integer 1
        $verification_val = isset($company['verification']) ? $company['verification'] : false;
        $is_verified = ($verification_val === true || $verification_val === 'true' || $verification_val == 1);

        $company_icon_url = "https://via.placeholder.com/40"; // Default
        if (!empty($data['icons'])) {
            $url = $data['icons'][0]['icon_url'];
            $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
        }

        // Default Icon Logic (adapted from user's request to fit existing data structure)
        $is_default_icon = false;
        if (empty($company_icon_url) || $company_icon_url == "https://via.placeholder.com/40") {
            $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            $is_default_icon = true;
        }

    } else {
        $company_name = "Unknown";
        $company_id = 0;
        $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000"; // Default icon for unknown company
        $is_verified = false;
    }

} else {
    header("Location: ../../../Landing Page Tailwind/php/landing_page.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help Center - Hirenorian</title>
    <!-- Shared CSS from Dashboard -->
    <link rel="stylesheet" href="../../Company Dashboard/css/variables.css">
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/help.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
                <li class="nav-item">
                    <a href="../../Job Listing Page/php/job_listing.php" class="nav-link">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="link-text">Job Listing</span>
                    </a>
                </li>
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Help</span>
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfile" style="margin-left: auto;">
                    <div class="user-info">
                        <div class="user-avatar-wrapper" style="position: relative; display: inline-block;">
                            <img src="<?php echo $company_icon_url; ?>" alt="Profile"
                                class="user-avatar <?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                            <?php if ($is_verified): ?>
                                <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=10b981" alt="Verified"
                                    class="header-verification-badge verified" title="Verified Account">
                            <?php else: ?>
                                <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=ef4444"
                                    alt="Unverified" class="header-verification-badge unverified"
                                    title="Unverified Account">
                            <?php endif; ?>
                        </div>
                        <span class="user-name" id="headerCompanyName"><?php echo htmlspecialchars($company_name); ?></span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item" id="signOutBtn">Sign Out</a>
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <div class="page-title">
                    <h1>Company Help Center</h1>
                    <p class="text-muted">Everything you need to know about managing your company profile and recruiting
                        on Hirenorian.</p>
                </div>

                <div class="help-container">
                    <!-- Sticky Navigation Sidebar -->
                    <aside class="help-sidebar">
                        <div class="help-nav-title">On this page</div>
                        <ul class="help-nav">
                            <li class="help-nav-item"><a href="#getting-started" class="help-nav-link active">Getting
                                    Started</a></li>
                            <li class="help-nav-item"><a href="#job-postings" class="help-nav-link">Creating Job
                                    Postings</a></li>
                            <li class="help-nav-item"><a href="#managing-jobs" class="help-nav-link">Managing Jobs</a>
                            </li>
                            <li class="help-nav-item"><a href="#applicants" class="help-nav-link">Reviewing
                                    Applicants</a></li>
                            <li class="help-nav-item"><a href="#dashboard" class="help-nav-link">Dashboard Overview</a>
                            </li>
                            <li class="help-nav-item"><a href="#account" class="help-nav-link">Account Management</a>
                            </li>
                            <li class="help-nav-item"><a href="#compliance" class="help-nav-link">Safety &
                                    Compliance</a></li>
                            <li class="help-nav-item"><a href="#faqs" class="help-nav-link">FAQs</a></li>
                        </ul>
                    </aside>

                    <!-- Content Sections -->
                    <div class="help-content">

                        <!-- 1. Getting Started -->
                        <section id="getting-started" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-rocket"></i>
                                <h2>Getting Started for Companies</h2>
                            </div>

                            <div class="help-block">
                                <h3>What are the documents for verification?</h3>
                                <p class="help-text">To ensure your company is fully verified and trusted on our
                                    platform, you’ll need to submit documents that prove your business’s legitimacy.
                                    Depending on your company type, here’s what’s required:</p>

                                <h4>Business Type Registration</h4>
                                <ul class="help-list">
                                    <li><strong>DTI Registration</strong> – for sole proprietorships</li>
                                    <li><strong>SEC Registration</strong> – for partnerships or corporations</li>
                                    <li><strong>CDA Certificate</strong> – for cooperatives</li>
                                </ul>

                                <h4>Other Required Documents</h4>
                                <ul class="help-list">
                                    <li><strong>Valid DOLE License</strong> – if you’re a Private Employment Agency
                                        (PEA)</li>
                                    <li><strong>DOLE Registration</strong> – for Contractors and Subcontractors</li>
                                    <li><strong>DMW License</strong> – for Overseas Recruitment and Placement Agencies
                                    </li>
                                    <li><strong>Mayor’s Permit</strong> – a clear picture of the permit</li>
                                    <li><strong>BIR Form 2303</strong> – Certificate of Registration or Tax Exemption
                                        certificate (if applicable)</li>
                                    <li><strong>Certificate of No Pending Case</strong> – issued by DOLE</li>
                                    <li><strong>PhilJobNet Proof of Accreditation</strong></li>
                                </ul>

                                <div class="help-alert">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <div class="help-alert-content">
                                        <h4>Make sure all documents are valid!</h4>
                                        <p>Submitting legible and up-to-date documents ensures your company can post
                                            jobs and interact confidently with applicants on our platform.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="help-block">
                                <h3>Verification Timeline & Status</h3>
                                <p class="help-text">After you upload the required documents, your company’s
                                    verification depends on our admin team’s availability. Because review times may
                                    vary, there’s no fixed guarantee — but we make every effort to process requests as
                                    promptly as possible.</p>
                                <p class="help-text">You can monitor the progress from your Profile Page. You’ll also
                                    receive an email notification once the review is completed.</p>
                            </div>

                            <div class="help-block">
                                <h3>Completing Your Company Profile</h3>
                                <p class="help-text">Once verified, it’s time to make your profile shine! A complete
                                    profile increases your visibility. Don’t forget to review everything before saving.
                                </p>

                                <h4>Fields to Complete:</h4>
                                <ul class="help-list">
                                    <li><strong>Email</strong> – The main contact email displayed for inquiries.</li>
                                    <li><strong>Location</strong> – Let students know where your company operates.</li>
                                    <li><strong>Website Links</strong> – Showcase your official website.</li>
                                    <li><strong>About Us</strong> – Tell your story and what you do.</li>
                                    <li><strong>Why Join Us</strong> – Highlight what sets your workplace apart.</li>
                                    <li><strong>Perks and Benefits</strong> – Share incentives and programs.</li>
                                    <li><strong>Office Locations</strong> – List all your office branches.</li>
                                    <li><strong>Logo & Banner</strong> – Upload images for a professional look.</li>
                                </ul>
                            </div>
                        </section>

                        <!-- 2. Creating Job Postings -->
                        <section id="job-postings" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <h2>Creating Job & Internship Postings</h2>
                            </div>

                            <div class="help-block">
                                <p class="help-text">Once your company is verified, you can quickly create new
                                    opportunities from your Company Dashboard.</p>

                                <h4>How to Start</h4>
                                <ol class="help-list" style="list-style-type: decimal; padding-left: 1.5rem;">
                                    <li>Go to your <strong>Job Listing Page</strong>.</li>
                                    <li>Click <strong>Add</strong> to create a new posting.</li>
                                </ol>

                                <h4>Key Details to Fill Out</h4>
                                <ul class="help-list">
                                    <li><strong>Basic Details:</strong> Job Title, Location, Type of Work (Internship,
                                        Full-time), Applicant Limit.</li>
                                    <li><strong>Requirements:</strong> Required Documents (Résumé, Portfolio), Career
                                        Tags.</li>
                                    <li><strong>Job Content:</strong> Description, Roles & Responsibilities,
                                        Qualifications, Skills.</li>
                                </ul>

                                <p class="help-text">After completing the fields, review all details for clarity and
                                    click <strong>Submit</strong>. Your posting will immediately appear on the platform.
                                </p>
                            </div>
                        </section>

                        <!-- 3. Managing Job Postings -->
                        <section id="managing-jobs" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-list-check"></i>
                                <h2>Managing Job Postings</h2>
                            </div>

                            <div class="help-block">
                                <h3>Editing Existing Postings</h3>
                                <p class="help-text">To edit, go to your Company Dashboard, select the posting you want
                                    to change, make the updates, and click Save. Any changes will be immediately
                                    reflected.</p>
                                <ul class="help-list">
                                    <li><strong>Job Title & Description</strong> – Correct names or add details.</li>
                                    <li><strong>Roles & Qualifications</strong> – Adjust expectations as needed.</li>
                                    <li><strong>Skills</strong> – Add or remove desired skills.</li>
                                </ul>
                            </div>

                            <div class="help-block">
                                <h3>Viewing Posting Performance</h3>
                                <p class="help-text">Track effectiveness directly from your Dashboard:</p>
                                <ul class="help-list">
                                    <li><strong>Views</strong> – How many times your posting has been viewed.</li>
                                    <li><strong>Total Applicants</strong> – Total students who have applied.</li>
                                    <li><strong>Pending/Accepted/Rejected</strong> – Monitor application status.</li>
                                </ul>
                            </div>

                            <div class="help-block">
                                <h3>Closing Postings</h3>
                                <p class="help-text"><strong>Manual Closure:</strong> Click the "Close Posting" button
                                    anytime from your dashboard.<br>
                                    <strong>Automatic Closure:</strong> Postings close automatically once the maximum
                                    number of accepted applicants is reached.
                                </p>
                            </div>
                        </section>

                        <!-- 4. Reviewing Applicants -->
                        <section id="applicants" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-user-check"></i>
                                <h2>Reviewing Applicants</h2>
                            </div>

                            <div class="help-block">
                                <h3>Viewing Profiles & Resumes</h3>
                                <p class="help-text">Review profiles and resumes directly from the job listing page. You
                                    can view:</p>
                                <ul class="help-list">
                                    <li>Full Name, Email & Phone Number</li>
                                    <li>Resume / CV & Portfolio Links</li>
                                    <li>Skills, Qualifications & Education</li>
                                </ul>
                            </div>

                            <div class="help-block">
                                <h3>Accepting or Rejecting Applicants</h3>
                                <p class="help-text">Take action on each candidate directly from the Dashboard:</p>
                                <ul class="help-list">
                                    <li><strong>Accept:</strong> Approve a candidate for the next stage.</li>
                                    <li><strong>Reject:</strong> Decline a candidate who doesn’t meet requirements.</li>
                                </ul>
                                <div class="help-alert">
                                    <i class="fa-solid fa-bell"></i>
                                    <div class="help-alert-content">
                                        <h4>Notifications</h4>
                                        <p>Applicants are automatically notified of your decision via their dashboard
                                            and email.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- 5. Company Dashboard -->
                        <section id="dashboard" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-chart-line"></i>
                                <h2>Company Dashboard Overview</h2>
                            </div>
                            <div class="help-block">
                                <p class="help-text">The Company Dashboard gives you a comprehensive view of your
                                    recruitement activities at a glance.</p>

                                <h4>What You Can See:</h4>
                                <ul class="help-list">
                                    <li><strong>Job Listing Summary:</strong> Table showing Job Titles, Applicant
                                        counts, Status (Active/Closed).</li>
                                    <li><strong>Recruitment Analytics:</strong> Visual stats including Total
                                        Applications, Accepted, and Rejected counts.</li>
                                    <li><strong>Quick Actions:</strong> Buttons to View All, Edit, or Close postings.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <!-- 6. Account Management -->
                        <section id="account" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-gear"></i>
                                <h2>Company Account Management</h2>
                            </div>

                            <div class="help-block">
                                <h3>Updating Company Details</h3>
                                <p class="help-text">Navigate to the profile page and click Edit. You can update your
                                    Logo, Banner, Contact Info, "About Us", and more. Changes reflect immediately.</p>
                            </div>

                            <div class="help-block">
                                <h3>How to Deactivate Account</h3>
                                <p class="help-text">If you no longer need access, contact
                                    <strong>Hirenorian_customerservice@gmail.com</strong> to request permanent
                                    deactivation. This action ensures security and cannot be undone.
                                </p>
                            </div>
                        </section>

                        <!-- 7. Safety & Compliance -->
                        <section id="compliance" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-shield-halved"></i>
                                <h2>Safety, Guidelines, and Compliance</h2>
                            </div>

                            <div class="help-block">
                                <h3>Posting Guidelines</h3>
                                <p class="help-text">To maintain platform quality, the following are <strong>NOT
                                        allowed</strong>:</p>
                                <ul class="help-list">
                                    <li>False or misleading information (fake jobs, deceptive compensation).</li>
                                    <li>Unpaid roles disguised as employment (unless clearly labeled as internship).
                                    </li>
                                    <li>Offensive, discriminatory, or inappropriate material.</li>
                                    <li>Spam, mass promotions, or external links to unsafe sites.</li>
                                </ul>
                            </div>

                            <div class="help-block">
                                <h3>Reporting Issues</h3>
                                <p class="help-text">For bugs or technical concerns, email
                                    <strong>Hirenorian_customersupport@gmail.com</strong> with a description,
                                    screenshots, and your company details.
                                </p>
                            </div>

                            <div class="help-block">
                                <h3>Data Privacy Obligations</h3>
                                <p class="help-text">By using applicant data, you agree to:</p>
                                <ul class="help-list">
                                    <li>Use student info <strong>only</strong> for legitimate recruitment.</li>
                                    <li>Keep data secure and confidential.</li>
                                    <li>Respect communication boundaries (no spam).</li>
                                    <li>Delete stored student info if your account is deactivated.</li>
                                </ul>
                            </div>
                        </section>

                        <!-- 8. FAQs -->
                        <section id="faqs" class="help-section">
                            <div class="help-section-title">
                                <i class="fa-solid fa-circle-question"></i>
                                <h2>Frequently Asked Questions</h2>
                            </div>

                            <div class="faq-container">
                                <div class="faq-item">
                                    <button class="faq-header">
                                        <span class="faq-title">Why wasn’t my company verified?</span>
                                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                                    </button>
                                    <div class="faq-body">
                                        <div class="faq-content">
                                            Verification may be delayed or rejected if information is incomplete,
                                            inaccurate, or documents are invalid. Ensure all details are up-to-date.
                                        </div>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-header">
                                        <span class="faq-title">What if I posted incorrect information?</span>
                                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                                    </button>
                                    <div class="faq-body">
                                        <div class="faq-content">
                                            No worries! You can edit any active posting from your dashboard, or delete
                                            it and create a new one.
                                        </div>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-header">
                                        <span class="faq-title">How long does verification take?</span>
                                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                                    </button>
                                    <div class="faq-body">
                                        <div class="faq-content">
                                            Verification usually takes 1–3 business days, depending on application
                                            volume. We review every company to ensure authenticity.
                                        </div>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-header">
                                        <span class="faq-title">Is there any billing or pricing?</span>
                                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                                    </button>
                                    <div class="faq-body">
                                        <div class="faq-content">
                                            Everything on our platform is completely free! There are no fees to post
                                            jobs, edit profiles, or contact applicants.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="../../Company Dashboard/js/dashboard.js"></script>
    <script src="../js/help.js"></script>
</body>

</html>