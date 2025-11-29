<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hirenorian - Company Dashboard</title>
    <link rel="stylesheet" href="../css/dashboard.css">
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
                <img src="../../../../assets/logo.png" alt="Hirenorian Logo" class="logo-icon">
                <!-- Placeholder path -->
                <span class="logo-text">Hirenorian</span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-table-columns"></i>
                        <span class="link-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span class="link-text">Company Deets</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="link-text">Applicants Manager</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Company Info</span>
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="page-title">
                    <h1>Dashboard</h1>
                </div>
                <div class="user-profile" id="userProfile">
                    <div class="user-info">
                        <div class="user-avatar">
                            <!-- Placeholder for user image -->
                        </div>
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item">Sign Out</a>
                    </div>
                </div>
            </header>

            <div class="content-wrapper">
                <!-- Applicants Section -->
                <section class="applicants-section">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Job Title</th>
                                    <th>Date Posted</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Juan Dela Cruz</td>
                                    <td>Tech Solutions Inc.</td>
                                    <td>Oct 24, 2023</td>
                                    <td><span class="status-badge pending">Pending</span></td>
                                    <td><button class="btn-view">View</button></td>
                                </tr>
                                <tr>
                                    <td>Juan Dela Cruz</td>
                                    <td>Tech Solutions Inc.</td>
                                    <td>Oct 20, 2023</td>
                                    <td><span class="status-badge accepted">Accepted</span></td>
                                    <td><button class="btn-view">View</button></td>
                                </tr>
                                <tr>
                                    <td>Juan Dela Cruz</td>
                                    <td>Tech Solutions Inc.</td>
                                    <td>Oct 15, 2023</td>
                                    <td><span class="status-badge rejected">Rejected</span></td>
                                    <td><button class="btn-view">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Bottom Section -->
                <div class="bottom-section">
                    <!-- Post Creation Section -->
                    <div class="post-creation">
                        <div class="tabs">
                            <button class="tab-btn active" data-tab="text">Text</button>
                            <button class="tab-btn" data-tab="questions">Questions</button>
                        </div>

                        <!-- Text Tab Content -->
                        <div class="tab-content active" id="text-content">
                            <div class="form-group full-width">
                                <input type="text" placeholder="Job title *" class="form-input">
                            </div>
                            <div class="form-row">
                                <div class="form-group half-width">
                                    <div class="career-tags-input">
                                        <input type="text" placeholder="Career tags" class="form-input">
                                        <span class="tag-badge">Career Tag</span>
                                    </div>
                                </div>
                                <div class="form-group half-width">
                                    <input type="text" placeholder="Requirements" class="form-input">
                                </div>
                                <div class="form-group checkbox-group">
                                    <label class="custom-checkbox">
                                        <input type="checkbox">
                                        <span class="checkmark"><i class="fa-solid fa-check"></i></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group full-width">
                                <textarea placeholder="Job description" class="form-input textarea-large"></textarea>
                            </div>
                            <div class="form-actions">
                                <button class="btn-next">Next</button>
                            </div>
                        </div>

                        <!-- Questions Tab Content -->
                        <div class="tab-content" id="questions-content">
                            <div class="questions-list">
                                <div class="question-row">
                                    <input type="text" placeholder="Question 1" class="form-input question-input">
                                    <div class="yes-no-options">
                                        <div class="option-box"></div>
                                        <div class="option-box checked"><i class="fa-solid fa-check"></i></div>
                                    </div>
                                </div>
                                <div class="question-row">
                                    <input type="text" placeholder="Question 2" class="form-input question-input">
                                    <div class="yes-no-options">
                                        <div class="option-box"></div>
                                        <div class="option-box checked"><i class="fa-solid fa-check"></i></div>
                                    </div>
                                </div>
                                <div class="question-row">
                                    <input type="text" placeholder="Question 3" class="form-input question-input">
                                    <div class="yes-no-options">
                                        <div class="option-box"></div>
                                        <div class="option-box checked"><i class="fa-solid fa-check"></i></div>
                                    </div>
                                </div>
                                <div class="question-row">
                                    <input type="text" placeholder="Question 4" class="form-input question-input">
                                    <div class="yes-no-options">
                                        <div class="option-box checked"><i class="fa-solid fa-check"></i></div>
                                        <div class="option-box"></div>
                                    </div>
                                </div>
                                <div class="question-row">
                                    <input type="text" placeholder="Question 5" class="form-input question-input">
                                    <div class="yes-no-options">
                                        <div class="option-box checked"><i class="fa-solid fa-check"></i></div>
                                        <div class="option-box"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button class="btn-next">Next</button>
                            </div>
                        </div>
                    </div>

                    <!-- Company Status Section -->
                    <div class="company-status">
                        <div class="profile-card">
                            <div class="profile-content">
                                <h3>DHVSU</h3>
                                <p>Student Assistant</p>
                            </div>
                            <button class="btn-apply">APPLY NOW</button>
                        </div>
                        <div class="stats-card">
                            <h4>Post Info</h4>
                            <div class="stat-item">
                                <div class="stat-icon pending"><i class="fa-solid fa-clock"></i></div>
                                <div class="stat-details">
                                    <span class="stat-label">Pending</span>
                                    <span class="stat-value">1</span>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon accepted"><i class="fa-solid fa-circle-check"></i></div>
                                <div class="stat-details">
                                    <span class="stat-label">Accepted</span>
                                    <span class="stat-value">1</span>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon rejected"><i class="fa-solid fa-circle-xmark"></i></div>
                                <div class="stat-details">
                                    <span class="stat-label">Rejected</span>
                                    <span class="stat-value">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="../js/dashboard.js"></script>
</body>

</html>