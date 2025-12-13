<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Hirenorian</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../../AdminStudentManagement/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <span>Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">   
                <a href="../../AdminDashboard/php/dashboard.php" class="nav-item active">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../AdminStudentManagement/php/student_management.php" class="nav-item">
                    <i class="fa-solid fa-user-graduate"></i>
                    <span>Student Management</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-building"></i>
                    <span>Company Management</span>
                </a>
            </nav>
        </aside>

        <div class="main-content">
            <header class="top-bar">
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Admin" class="user-img">
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-users"></i> Switch Account</a>
                    </div>
                </div>
            </header>

            <main class="dashboard-body">
                <h1 class="page-title">Dashboard</h1>

                <div class="admin-stats-grid">
                    <div class="stat-card-admin maroon">
                        <div class="stat-icon-admin"><i class="fa-solid fa-graduation-cap"></i></div>
                        <div class="stat-info-admin">
                            <h3>Number of Students</h3>
                            <p class="stat-number-admin">50</p>
                        </div>
                    </div>
                    <div class="stat-card-admin yellow">
                        <div class="stat-icon-admin"><i class="fa-solid fa-city"></i></div>
                        <div class="stat-info-admin">
                            <h3>Number of Companies</h3>
                            <p class="stat-number-admin">50</p>
                        </div>
                    </div>
                    <div class="stat-card-admin green">
                        <div class="stat-icon-admin"><i class="fa-solid fa-briefcase"></i></div>
                        <div class="stat-info-admin">
                            <h3>Active Job Posting</h3>
                            <p class="stat-number-admin">50</p>
                        </div>
                    </div>
                    <div class="stat-card-admin red">
                        <div class="stat-icon-admin"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="stat-info-admin">
                            <h3>Closed Job Posting</h3>
                            <p class="stat-number-admin">50</p>
                        </div>
                    </div>
                </div>

                <div class="stats-summary-grid admin-bottom-grid">
                    <div class="card applicants-chart-card">
                        <h2>Total Applicants Number</h2>
                        <div class="chart-content-wrapper">
                            <div class="chart-container">
                                <canvas id="applicantsChart"></canvas>
                            </div>
                            <div class="chart-legend-admin">
                                <div class="legend-item"><span class="legend-color accepted"></span>Accepted</div>
                                <div class="legend-item"><span class="legend-color pending"></span>Pending</div>
                                <div class="legend-item"><span class="legend-color rejected"></span>Rejected</div>
                            </div>
                        </div>
                        <p class="chart-description">A clear overview of total accepted, pending and rejected applicants of students.</p>
                    </div>

                    <div class="card top-companies-card">
                        <h2>Top Accepted Companies</h2>
                        <ul class="company-list">
                            <li><img src="../../../Landing Page/Images/google.jpg" alt="Google">Google</li>
                            <li><img src="../../../Landing Page/Images/samsung.jpg" alt="Samsung">Samsung</li>
                            <li><img src="../../../Landing Page/Images/hyundai.jpg" alt="Hyundai">Hyundai</li>
                            <li><img src="../../../Landing Page/Images/apple.jpg" alt="Apple">Apple</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="../js/dashboard.js"></script>
</body>
</html>