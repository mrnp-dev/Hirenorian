<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Select Account Type</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Styles -->
    <link rel="stylesheet" href="../css/student_registration.css"> <!-- Base styles from Student Reg -->
    <link rel="stylesheet" href="../css/account_selection.css">
</head>
<body>
    
    <div class="selection-container">
        <!-- Logo Header -->
        <div class="logo-header">
            <img src="../images/DHVSU-LOGO.png" alt="Hirenorian Logo" class="brand-logo">
            <h1>Join Hirenorian</h1>
            <p>Select your account type to get started</p>
        </div>

        <!-- Cards Container -->
        <div class="cards-wrapper">
            
            <!-- Student Card -->
            <a href="../../Student Registration Modern/php/student_registration.php" class="selection-card student-card">
                <div class="card-icon">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
                <div class="card-content">
                    <h2>For Students</h2>
                    <p>Find internships, build your profile, and launch your career.</p>
                    <ul class="features-list">
                        <li><i class="fa-solid fa-check"></i> Verified Opportunities</li>
                        <li><i class="fa-solid fa-check"></i> Direct Company Access</li>
                        <li><i class="fa-solid fa-check"></i> Career Growth Tools</li>
                    </ul>
                    <span class="btn-select">Register as Student <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </a>

            <!-- Company Card -->
            <a href="../../Company Registration Modern/php/company_registration.php" class="selection-card company-card">
                <div class="card-icon">
                    <i class="fa-solid fa-building"></i>
                </div>
                <div class="card-content">
                    <h2>For Companies</h2>
                    <p>Discover top talent, post jobs, and streamline recruitment.</p>
                    <ul class="features-list">
                        <li><i class="fa-solid fa-check"></i> Access Top Talent</li>
                        <li><i class="fa-solid fa-check"></i> Trusted Platform</li>
                        <li><i class="fa-solid fa-check"></i> Free Job Posting</li>
                    </ul>
                    <span class="btn-select">Register as Company <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </a>

        </div>


    </div>

</body>
</html>
