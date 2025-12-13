<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Page Index (Debug)</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-maroon: #7b1113;
            --secondary-yellow: #ffc107;
            --text-dark: #333;
            --bg-light: #f4f6f9;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-light);
            margin: 0;
            padding: 40px;
            color: var(--text-dark);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            margin-bottom: 40px;
        }

        h1 {
            color: var(--primary-maroon);
            margin-bottom: 10px;
        }

        p.subtitle {
            color: #666;
        }

        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 1.2rem;
            color: #555;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .link-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .page-link {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            text-decoration: none;
            color: var(--text-dark);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            border-left: 5px solid var(--primary-maroon);
        }

        .page-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }

        .page-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 5px;
        }

        .page-path {
            font-size: 0.8rem;
            color: #888;
            word-break: break-all;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
            margin-top: 10px;
            align-self: flex-start;
        }

        .badge-main { background: #e3f2fd; color: #0d47a1; }
        .badge-auth { background: #fff3e0; color: #e65100; }
        .badge-student { background: #e8f5e9; color: #1b5e20; }
        .badge-company { background: #fff8e1; color: #f57f17; }

    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Hirenorian Project Index</h1>
            <p class="subtitle">Quick access to all pages for debugging and development.</p>
        </header>

        <div class="section">
            <h2 class="section-title">Main Pages</h2>
            <div class="link-grid">
                <a href="Landing Page/php/landing_page.php" class="page-link">
                    <span class="page-name">Landing Page (Original)</span>
                    <span class="page-path">Landing Page/php/landing_page.php</span>
                    <span class="badge badge-main">Public</span>
                </a>
                <a href="Landing Page Tailwind/index.php" class="page-link">
                    <span class="page-name">Landing Page (Tailwind)</span>
                    <span class="page-path">Landing Page Tailwind/index.php</span>
                    <span class="badge badge-main">New</span>
                </a>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Authentication</h2>
            <div class="link-grid">
                <a href="Account Registration Pages/Account Selection Page/php/account_selection.php" class="page-link">
                    <span class="page-name">Account Selection</span>
                    <span class="page-path">Account Registration Pages/.../account_selection.php</span>
                    <span class="badge badge-auth">Auth</span>
                </a>
                <a href="Account Registration Pages/Student Registration Page/php/student_registrationForm.php" class="page-link">
                    <span class="page-name">Student Registration</span>
                    <span class="page-path">Account Registration Pages/.../student_registrationForm.php</span>
                    <span class="badge badge-auth">Auth</span>
                </a>
                <a href="Account Registration Pages/Main Account Register Page/php/main_registration.php" class="page-link">
                    <span class="page-name">Main Account Registration</span>
                    <span class="page-path">Account Registration Pages/.../main_registration.php</span>
                    <span class="badge badge-auth">Auth</span>
                </a>
                <a href="Account Registration Pages/Company Registration Page/php/company.php" class="page-link">
                    <span class="page-name">Company Registration</span>
                    <span class="page-path">Account Registration Pages/.../company.php</span>
                    <span class="badge badge-company">Company</span>
                </a>
                <a href="Account Registration Pages/SR-Duplicate OTP Page/php/student_registrationForm.php" class="page-link">
                    <span class="page-name">SR-Duplicate OTP Page</span>
                    <span class="page-path">Account Registration Pages/.../student_registrationForm.php</span>
                    <span class="badge badge-auth">Dev</span>
                </a>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Prototyping & Testing</h2>
            <div class="link-grid">
                <a href="../Prototyping/EmailTesting/index.html" class="page-link">
                    <span class="page-name">Email Sending Test</span>
                    <span class="page-path">Prototyping/EmailTesting/index.html</span>
                    <span class="badge badge-main">Prototype</span>
                </a>
                <a href="../Prototyping/FileUpload/client_sender.php" class="page-link">
                    <span class="page-name">File Upload Sender</span>
                    <span class="page-path">Prototyping/FileUpload/client_sender.php</span>
                    <span class="badge badge-main">Prototype</span>
                </a>
                <a href="../Prototyping/FileUpload/client_viewer.php" class="page-link">
                    <span class="page-name">File Upload Viewer</span>
                    <span class="page-path">Prototyping/FileUpload/client_viewer.php</span>
                    <span class="badge badge-main">Prototype</span>
                </a>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Student Portal</h2>
            <div class="link-grid">
                <a href="Student Pages/Student Dashboard Page/php/student_dashboard.php" class="page-link">
                    <span class="page-name">Student Dashboard</span>
                    <span class="page-path">Student Pages/.../student_dashboard.php</span>
                    <span class="badge badge-student">Dashboard</span>
                </a>
                <a href="Student Pages/Student Profile Page/php/student_profile.php" class="page-link">
                    <span class="page-name">Student Profile</span>
                    <span class="page-path">Student Pages/.../student_profile.php</span>
                    <span class="badge badge-student">Profile</span>
                </a>
                <a href="Student Pages/Student Edit Profile Page/php/edit_profile.php" class="page-link">
                    <span class="page-name">Edit Profile</span>
                    <span class="page-path">Student Pages/.../edit_profile.php</span>
                    <span class="badge badge-student">Edit Profile</span>
                </a>
                <a href="Student Pages/Internship Search Page/php/internship_search.php" class="page-link">
                    <span class="page-name">Internship Search</span>
                    <span class="page-path">Student Pages/.../internship_search.php</span>
                    <span class="badge badge-student">Search</span>
                </a>

            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Company Portal</h2>
            <div class="link-grid">
                <a href="Company Pages/Company Dashboard/php/company_dashboard.php" class="page-link">
                    <span class="page-name">Company Dashboard</span>
                    <span class="page-path">Company Pages/.../company_dashboard.php</span>
                    <span class="badge badge-company">Dashboard</span>
                </a>
                <a href="Company Pages/Company Profile Page/php/company_profile.php" class="page-link">
                    <span class="page-name">Company Profile</span>
                    <span class="page-path">Company Pages/.../company_profile.php</span>
                    <span class="badge badge-company">Profile</span>
                </a>
                <a href="Company Pages/Job Listing Page/php/job_listing.php" class="page-link">
                    <span class="page-name">Job Listing</span>
                    <span class="page-path">Company Pages/.../job_listing.php</span>
                    <span class="badge badge-company">Jobs</span>
                </a>
                <a href="Company Pages/Company Edit Profile Page/php/edit_company_profile.php" class="page-link">
                    <span class="page-name">Edit Company Profile</span>
                    <span class="page-path">Company Pages/.../edit_company_profile.php</span>
                    <span class="badge badge-company">Edit Profile</span>
                </a>
                <a href="Company Pages/Applicant's Profile Page/php/applicant_profile.php" class="page-link">
                    <span class="page-name">Applicant Profile</span>
                    <span class="page-path">Company Pages/.../applicant_profile.php</span>
                    <span class="badge badge-company">Applicant</span>
                </a>
                <a href="Company Pages/Help Page/php/help.php" class="page-link">
                    <span class="page-name">Help Page</span>
                    <span class="page-path">Company Pages/.../help.php</span>
                    <span class="badge badge-company">Help</span>
                </a>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Admin Portal</h2>
            <div class="link-grid">
                <a href="Admin Page/AdminDashboard/php/dashboard.php" class="page-link">
                    <span class="page-name">Admin Dashboard</span>
                    <span class="page-path">Admin Page/.../dashboard.php</span>
                    <span class="badge badge-main">Dashboard</span>
                </a>
                <a href="Admin Page/AdminStudentManagement/php/student_management.php" class="page-link">
                    <span class="page-name">Student Management</span>
                    <span class="page-path">Admin Page/.../student_management.php</span>
                    <span class="badge badge-main">Management</span>
                </a>
                <a href="Admin Page/AdminCompanyManagement/php/company_management.php" class="page-link">
                    <span class="page-name">Company Management</span>
                    <span class="page-path">Admin Page/.../company_management.php</span>
                    <span class="badge badge-main">Management</span>
                </a>
            </div>
        </div>


    </div>
</body>
</html>