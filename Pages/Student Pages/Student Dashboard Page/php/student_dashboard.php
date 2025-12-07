<?php
session_start();
if(isset($_SESSION['email']))
{
    echo "<script>console.log('email in session');</script>";
}
else
{
    echo "<script>console.log('email not in session');</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Hirenorian</title>
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/topbar.css">
    <link rel="stylesheet" href="../css/stats.css">
    <link rel="stylesheet" href="../css/recommendations.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <!-- Left Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 12px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <span class="logo-text">Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../Student Profile Page/php/student_profile.php" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="../../Student Pages/Internship Search Page/php/internship_search.php" class="nav-item">
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
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Student" class="user-img"> <!-- Placeholder image -->
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <main class="dashboard-body">
                <h1 class="page-title">Dashboard</h1>

                <!-- Stats and Summary Section -->
                <div class="stats-summary-grid">
                    <!-- Application Summary Table -->
                    <div class="card application-summary">
                        <div class="card-header">
                            <h2>Application Summary</h2>
                            <a href="#" class="view-more">View All</a>
                        </div>
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Position</th>
                                        <th>Date Applied</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Tech Solutions Inc.</td>
                                        <td>Web Developer Intern</td>
                                        <td>Oct 24, 2023</td>
                                        <td><span class="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>Creative Studio</td>
                                        <td>Graphic Designer</td>
                                        <td>Oct 20, 2023</td>
                                        <td><span class="status accepted">Accepted</span></td>
                                    </tr>
                                    <tr>
                                        <td>Global Systems</td>
                                        <td>IT Support</td>
                                        <td>Oct 15, 2023</td>
                                        <td><span class="status rejected">Rejected</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="stats-container">
                        <h2>Application Status</h2>
                        <div class="stats-content">
                            <div class="chart-wrapper">
                                <canvas id="applicationChart"></canvas>
                            </div>
                            <div class="stats-cards">
                                <div class="stat-card pending">
                                    <div class="stat-icon"><i class="fa-solid fa-clock"></i></div>
                                    <div class="stat-info">
                                        <h3>Pending</h3>
                                        <p class="stat-number">1</p>
                                    </div>
                                </div>
                                <div class="stat-card accepted">
                                    <div class="stat-icon"><i class="fa-solid fa-check-circle"></i></div>
                                    <div class="stat-info">
                                        <h3>Accepted</h3>
                                        <p class="stat-number">1</p>
                                    </div>
                                </div>
                                <div class="stat-card rejected">
                                    <div class="stat-icon"><i class="fa-solid fa-times-circle"></i></div>
                                    <div class="stat-info">
                                        <h3>Rejected</h3>
                                        <p class="stat-number">1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recommended Internships -->
                <div class="recommended-section">
                    <h2>Recommended Internships</h2>
                    <div class="recommendation-cards">
                        <!-- Card 1 -->
                        <article class="company-card">
                            <div class="company-card__image-wrapper">
                                <img src="../../../Landing Page/Images/Companies/cloudstaff_workplace.jpg" alt="Google workplace" class="company-card__image">
                            </div>
                            <div class="company-card__logo">
                                <img src="../../../Landing Page/Images/google.jpg" alt="Google logo">
                            </div>
                            <div class="company-card__content">
                                <h3 class="company-card__name">Google</h3>
                                <p class="company-card__position">Software Engineer Intern</p>
                            </div>
                            <button class="company-card__footer">
                                Apply Now
                            </button>
                        </article>

                        <!-- Card 2 -->
                        <article class="company-card">
                            <div class="company-card__image-wrapper">
                                <img src="../../../Landing Page/Images/Companies/samsung_workplace.webp" alt="Samsung workplace" class="company-card__image">
                            </div>
                            <div class="company-card__logo">
                                <img src="../../../Landing Page/Images/samsung.jpg" alt="Samsung logo">
                            </div>
                            <div class="company-card__content">
                                <h3 class="company-card__name">Samsung</h3>
                                <p class="company-card__position">Data Analyst Intern</p>
                            </div>
                            <button class="company-card__footer">
                                Apply Now
                            </button>
                        </article>

                        <!-- Card 3 -->
                        <article class="company-card">
                            <div class="company-card__image-wrapper">
                                <img src="../../../Landing Page/Images/Companies/cloudstaff_workplace.jpg" alt="Hyundai workplace" class="company-card__image">
                            </div>
                            <div class="company-card__logo">
                                <img src="../../../Landing Page/Images/hyundai.jpg" alt="Hyundai logo">
                            </div>
                            <div class="company-card__content">
                                <h3 class="company-card__name">Hyundai</h3>
                                <p class="company-card__position">Marketing Intern</p>
                            </div>
                            <button class="company-card__footer">
                                Apply Now
                            </button>
                        </article>

                        <!-- Card 4 -->
                        <article class="company-card">
                            <div class="company-card__image-wrapper">
                                <img src="../../../Landing Page/Images/Companies/cloudstaff_workplace.jpg" alt="Local Corp workplace" class="company-card__image">
                            </div>
                            <div class="company-card__logo">
                                <img src="../../../Landing Page/Images/job.png" alt="Local Corp logo">
                            </div>
                            <div class="company-card__content">
                                <h3 class="company-card__name">Local Corp</h3>
                                <p class="company-card__position">HR Assistant</p>
                            </div>
                            <button class="company-card__footer">
                                Apply Now
                            </button>
                        </article>

                        <!-- Card 5 -->
                        <article class="company-card">
                            <div class="company-card__image-wrapper">
                                <img src="../../../Landing Page/Images/dhvsu-bg-image.jpg" alt="DHVSU workplace" class="company-card__image">
                            </div>
                            <div class="company-card__logo">
                                <img src="../../../Landing Page/Images/dhvsulogo.png" alt="DHVSU logo">
                            </div>
                            <div class="company-card__content">
                                <h3 class="company-card__name">DHVSU</h3>
                                <p class="company-card__position">Student Assistant</p>
                            </div>
                            <button class="company-card__footer">
                                Apply Now
                            </button>
                        </article>
                    </div>
                </div>
            </main>
        </div>
    </div>



    <script src="../js/dashboard.js"></script>
</body>
</html>
