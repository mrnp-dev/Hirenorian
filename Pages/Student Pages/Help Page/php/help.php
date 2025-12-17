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
                        <a href="../../../Account Registration Pages/Account Selection Page/php/account_selection.php" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Help Content -->
            <main class="dashboard-body help-container">
                
                <section class="help-section">
                    <h1>Getting Started</h1>
                    
                    <h2>How to set up your profile?</h2>
                    <p>Setting up your profile is simple. After creating your account, you’ll be directed to the dashboard. Under it is the profile page where you can edit your basic information such as your email, contact details, and a short description about yourself.</p>
                    <p>You don’t need to upload your resume or requirements during profile setup — those documents are only needed when you apply to a job that specifically requests them. Your profile helps companies understand who you are, while additional requirements are submitted only when required.</p>
                </section>

                <section class="help-section">
                    <h1>Browsing and Searching for Jobs</h1>
                    <p>You can easily narrow down job and OJT opportunities using the search filters on the job listings page. The filters allow you to sort and refine results based on different categories, including:</p>
                    <ul>
                        <li><strong>Location</strong> – Find companies near you or in your preferred area.</li>
                        <li><strong>Job/OJT Type</strong> – Choose between internship, part-time, or full-time roles.</li>
                        <li><strong>Career Tags / Categories</strong> – Match openings to your field or course.</li>
                    </ul>
                    <p>Just select the filters you want, and the results update automatically to show only the positions that meet your criteria and interests.</p>

                    <h2>How to use search filters?</h2>
                    <p>Search filters help you quickly find companies or positions that match your skills and preferences. On our platform, you can filter your search by:</p>
                    <ul>
                        <li><strong>Location</strong>: Choose the city, region, or area where you want to do your OJT or work after graduation.</li>
                        <li><strong>Position</strong>: Search the keyword for the job title or role you are interested in applying for.</li>
                        <li><strong>Career Tags</strong>: Filter by the industry you want to join.</li>
                    </ul>
                    
                    <p><strong>To use the filters:</strong></p>
                    <ol>
                        <li>Go to the search bar or search section on the dashboard.</li>
                        <li>Select the filters you want to apply. You can choose multiple filters at once to narrow down your options.</li>
                        <li>Click <strong>Search</strong> or <strong>Apply Filters</strong> to see the results that match your criteria.</li>
                        <li>Browse through the filtered companies and positions, and click on the ones that interest you to view more details or apply directly.</li>
                    </ol>
                    <p>Using search filters makes your application process faster and helps you focus on opportunities that best match your profile.</p>
                </section>

                <section class="help-section">
                    <h1>Applying for Jobs</h1>
                    
                    <h2>How to submit an application</h2>
                    <p>Submitting an application on our platform is quick, clean, and built to make you look your best. When you open a job or OJT posting, you’ll see a <strong>“Apply Now”</strong> button. Once you click it, you will be reviewing your profile and confirm that all the details are correct. You won't be able to proceed unless you provide the required attached documents the company needs if they choose to require them.</p>
                    
                    <p><strong>Upload Your Files:</strong></p>
                    <ul>
                        <li>Resume/Curriculum Vitae</li>
                        <li>Cover Letter</li>
                    </ul>
                    <p>These files help companies understand your background and why you’re a good fit. The upload window accepts common file formats, and you can replace or re-upload anytime before submitting.</p>
                    <p>Once everything looks good, press <strong>Submit Application</strong>, and your application is officially sent. Smooth, clean, and stress-free.</p>

                    <h2>How to check application status</h2>
                    <p>On your student dashboard, you can easily monitor every application you've submitted. Each job or OJT you applied for will show a status label, so you always know where you stand.</p>
                    <p>Your application can fall under three possible statuses on our platform:</p>
                    <ul>
                        <li><strong>Pending</strong> - This means your application has been received and is waiting for the company to review it. Most applications start here — think of it as being in the company’s inbox.</li>
                        <li><strong>Accepted</strong> - Your application has progressed! The company is interested in you, and this usually means they may reach out for an interview, ask follow-up questions, or continue with the next steps.</li>
                        <li><strong>Declined</strong> - Your application wasn’t selected. It doesn’t reflect your worth — companies simply choose candidates based on what fits their immediate needs. You can always apply to other openings right away.</li>
                    </ul>
                    <p>Your dashboard updates these statuses automatically, so you’ll never miss a change.</p>
                </section>

                <section class="help-section">
                    <h1>Managing Your Profile</h1>
                    
                    <h2>Updating personal information</h2>
                    <p>Students can update their personal information directly from the profile page. This includes basic details like profile picture, contact number, and other general info that companies use to review your applications. Simply open the profile page, tap the pencil icon to edit, update what you need, and save your changes — everything updates instantly.</p>
                    <p>To keep everything accurate, it’s a good idea to review your profile before applying so companies see the most up-to-date version of you.</p>

                    <h2>Adding new skills or certifications</h2>
                    <p>Your profile makes it easy to showcase what you can do. In the Skills section, you’ll find two dedicated lists:</p>
                    <ul>
                        <li><strong>Technical Skills</strong> – e.g., HTML/CSS, JavaScript, PHP, MySQL</li>
                        <li><strong>Soft Skills</strong> – e.g., Communication, Teamwork, Problem Solving</li>
                    </ul>
                    <p>To add new skills, simply open your profile, click the <strong>edit icon</strong> on the Skills container, and type in the skills you want to include. They’ll appear as individual tags so companies can quickly identify your strengths.</p>
                    <p>For <strong>certifications or achievements</strong>, you can add them in the <em>Experience & Achievements</em> section. Just click the plus button on the right side of that section, enter details like your role, organization, year, and a short description, and save. This helps companies get a clear view of your accomplishments and growth.</p>
                    <p>Your profile updates in real time, helping you keep your portfolio polished and ready for any opportunity.</p>

                    <h2>How to deactivate or delete your account</h2>
                    <p>On our platform, students can deactivate their account anytime through the <strong>Account Manager</strong> section of their profile.</p>
                    <p>To do this, simply open your profile, scroll to the Account Manager panel, and click <strong>Deactivate Account</strong>. Once deactivated, your profile becomes hidden from companies, and you won’t receive notifications or updates from the platform.</p>
                    <p>At the moment, the website supports account deactivation only — not permanent deletion. If you ever want to return, you can easily reactivate your account by logging in again.</p>
                </section>

                <section class="help-section">
                    <h1>Student Dashboard</h1>
                    
                    <h2>How to view all current applications</h2>
                    <p>Your applications are displayed clearly on the Dashboard under the <strong>Application Summary</strong> section. Here, you’ll see a clean table that lists:</p>
                    <ul>
                        <li>Company name</li>
                        <li>Position you applied for</li>
                        <li>Date applied</li>
                        <li>Current status (Pending, Accepted, Declined)</li>
                    </ul>
                    <p>This table gives you a quick overview of every application you’ve submitted. If you want to see the full list in more detail, simply click <strong>View All</strong> in the upper-right corner of the table.</p>
                    <p>On the right side of your dashboard, you’ll also find the <strong>Application Status</strong> panel. This includes:</p>
                    <ul>
                        <li>A visual chart of your application outcomes</li>
                        <li>The number of Pending, Accepted, and Declined applications</li>
                    </ul>
                    <p>This layout makes it easy to track your progress and understand where your applications stand at a glance. Below all of this, you'll also see recommended internship cards based on your skills or interests.</p>

                    <h2>What each status label means?</h2>
                    <p>Your applications are tracked using three clear status labels to help you understand where you currently stand in the hiring process:</p>
                    <ul>
                        <li><strong>Pending</strong> - Your application has been submitted and is waiting for review. The company hasn't taken any action yet — this is the default status right after you apply.</li>
                        <li><strong>Accepted</strong> - Good news! The company has reviewed your application and approved it. They may contact you for the next steps, such as an interview or additional details.</li>
                        <li><strong>Rejected</strong> - Your application was not selected for the position. Don’t be discouraged — companies receive many applications, and you can apply to other opportunities at any time.</li>
                    </ul>
                    <p>These labels appear directly on your Application Summary table and in the Application Status chart on your dashboard for easy tracking.</p>
                </section>

                <section class="help-section">
                    <h1>Safety and Guidelines</h1>

                    <h2>How to identify legitimate job postings</h2>
                    <p>All job and OJT postings on our platform come from verified companies, so students can be confident that the opportunities they see are safe and legitimate. Every company must submit their business information and undergo review by the admin team before they are allowed to post openings. This helps prevent fake companies, scams, or misleading job offers.</p>
                    <p>To further protect yourself, here are a few quick signs of a legitimate posting:</p>
                    <ul>
                        <li>The job listing includes complete details (role, responsibilities, requirements, location).</li>
                        <li>No posting will ask for payment, fees, or very sensitive personal information.</li>
                        <li>Communication stays professional and uses official company channels.</li>
                    </ul>
                    <p>If anything feels suspicious, students can immediately report the posting by contacting support: <code>Hirenorian_customersupport@gmail.com</code>.</p>

                    <h2>Data protection and privacy guidelines</h2>
                    <p>Your privacy is one of our top priorities. On our platform, your personal information is never publicly visible and is protected at all times. Here’s how your data stays safe:</p>
                    <ol>
                        <li><strong>Your information is private until you apply</strong><br>Companies can only view your details after you submit an application to them. Before that, they cannot see your profile, contact number, address, or any personal information.</li>
                        <li><strong>Students cannot see other student profiles</strong><br>The platform is strictly student-to-company, meaning your profile is not visible to other students. No one can browse or search for student accounts — protecting your identity and data.</li>
                        <li><strong>Only verified companies can access your information</strong><br>Because all companies go through admin approval, only legitimate and verified employers can receive your application details.</li>
                        <li><strong>No sensitive data is shared without your action</strong><br>Your data is shared only when you apply — not before, not after, and never with unrelated parties.</li>
                    </ol>
                    <p>If a company ever asks for unnecessary personal information, you can report it immediately.</p>
                    
                    <h2>Platform rules for professionalism</h2>
                    <p>To keep the platform safe, respectful, and helpful for everyone, we encourage all students to follow these simple professionalism guidelines when using the site:</p>
                    <ul>
                        <li><strong>Submit honest and accurate information</strong><br>Make sure your profile, resume, and answers reflect your real skills and experiences. Companies appreciate transparency — and it helps you find the right opportunities.</li>
                        <li><strong>Avoid inappropriate behavior</strong><br>No offensive language, spam, or unprofessional conduct. The platform is made for career growth, so treat it like a real workplace space.</li>
                        <li><strong>Respect every company’s process</strong><br>Each company may have its own timeline and requirements. Be patient, follow instructions, and always stay professional throughout the application.</li>
                    </ul>
                    <p>These small habits help you stand out and build confidence as you step into internships or future jobs.</p>
                </section>

                <section class="help-section">
                    <h1>FAQs</h1>
                    <p><strong>Short answers to common student concerns:</strong></p>

                    <div class="faq-item">
                        <h2>Why was my account not verified?</h2>
                        <p class="faq-answer">Your account may not be verified yet for a few simple reasons. Verification helps keep the platform safe for students and companies, so the system checks for accuracy and completeness before approving any account. Common reasons include:</p>
                        <ul>
                            <li>Incorrect/Blurry attachments of academic documents.</li>
                            <li>Wrong or nontradable/blurry COR (Certificate of Registration).</li>
                            <li>Invalid ID or Transcript of Records.</li>
                            <li>Unclear Diploma for Graduates.</li>
                        </ul>
                        <p>Only active students or qualified users should use the platform. If the details don’t align with this purpose, the account may not be approved. If your account wasn’t verified, don’t worry — it’s usually a small issue. Just update your profile and try again.</p>
                    </div>

                    <div class="faq-item">
                        <h2>Why can’t I submit my resume?</h2>
                        <ul>
                            <li><strong>File Format or Size Issues</strong>: Ensure your resume is in the accepted format (PDF or DOCX) and does not exceed the maximum allowed size.</li>
                            <li><strong>Technical or Browser Issues</strong>: Occasionally, browser settings, extensions, or internet connectivity may prevent submission. Try refreshing the page, using a different browser, or clearing your cache.</li>
                            <li><strong>Application Limits</strong>: Job postings have a limited amount of applicants that can apply to a specific posting. Try another position that might fit your liking.</li>
                        </ul>
                    </div>

                    <div class="faq-item">
                        <h2>How long before companies respond?</h2>
                        <p class="faq-answer">The response time can vary depending on the company and the position you applied for. Some companies review applications quickly and may respond within a few days, while others may take longer. Often, delays happen because companies receive a large number of applications and need time to carefully review each one. In some cases, a company may be looking for very specific skills or traits, which means they are searching for the applicant who best matches their requirements.</p>
                        <p><strong>To improve your chances of a faster response:</strong></p>
                        <ul>
                            <li>Make sure your profile and application are complete and up-to-date.</li>
                            <li>Highlight relevant skills, experience, and accomplishments in your application.</li>
                            <li>Apply early, as companies may begin reviewing applications as they come in.</li>
                        </ul>
                        <p>Keep in mind that patience is key—some companies may take longer to find the perfect fit, but a thorough review means they’re serious about selecting the right candidate.</p>
                    </div>
                </section>
            </main>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="../js/ui-controls.js"></script>
    <script>
        // Simple profile dropdown toggle if not covered by included scripts
        const profileBtn = document.getElementById('userProfileBtn');
        const profileDropdown = document.getElementById('profileDropdown');
        
        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }
    </script>
</body>
</html>
