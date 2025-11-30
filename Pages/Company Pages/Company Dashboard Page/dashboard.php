<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Dashboard - Hirenorian</title>
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
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
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-chart-pie"></i>
                    <span>Statistics</span>
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
                        <img src="../../../Landing Page/Images/Companies/cloudstaff_workplace.jpg" alt="Company" class="user-img"> <!-- Placeholder image -->
                        <span class="user-name">Cloudstaff</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                    </div>
                </div>
            </header>

            <!-- Dashboard Content -->
            <main class="dashboard-body">
                <h1 class="page-title">Company Dashboard</h1>

                <!-- Brief Statistics Section -->
                <section class="stats-section">
                    <h2>Brief Statistics</h2>
                    <div class="table-responsive card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Date Posted</th>
                                    <th>Responses</th>
                                    <th>Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Software Engineer Intern</td>
                                    <td>Oct 25, 2023</td>
                                    <td>12</td>
                                    <td>45</td>
                                </tr>
                                <tr>
                                    <td>Graphic Designer</td>
                                    <td>Oct 20, 2023</td>
                                    <td>8</td>
                                    <td>32</td>
                                </tr>
                                <tr>
                                    <td>Marketing Assistant</td>
                                    <td>Oct 18, 2023</td>
                                    <td>15</td>
                                    <td>60</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Posting Interface Section -->
                <section class="posting-section">
                    <h2>Create New Job Posting</h2>
                    <div class="card">
                        <form class="posting-form">
                            <div class="form-group">
                                <label for="jobTitle">Job Title</label>
                                <input type="text" id="jobTitle" name="jobTitle" placeholder="e.g. Web Developer Intern">
                            </div>

                            <div class="form-group">
                                <label for="careerTag">Career Tag</label>
                                <select id="careerTag" name="careerTag">
                                    <option value="">Select a tag</option>
                                    <option value="IT">Information Technology</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts & Design</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="jobDescription">Job Description</label>
                                <textarea id="jobDescription" name="jobDescription" rows="5" placeholder="Describe the role..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>Screening Questions (Max 5)</label>
                                <div id="questionsContainer">
                                    <input type="text" class="question-input" placeholder="Question 1">
                                    <input type="text" class="question-input" placeholder="Question 2">
                                    <input type="text" class="question-input" placeholder="Question 3">
                                    <input type="text" class="question-input" placeholder="Question 4">
                                    <input type="text" class="question-input" placeholder="Question 5">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Requirements</label>
                                <div class="checkbox-group">
                                    <label><input type="checkbox" name="requirements" value="CV"> CV</label>
                                    <label><input type="checkbox" name="requirements" value="Resume"> Resume</label>
                                    <label><input type="checkbox" name="requirements" value="CoverLetter"> Cover Letter</label>
                                    <label><input type="checkbox" name="requirements" value="Portfolio"> Portfolio</label>
                                </div>
                            </div>

                            <button type="submit" class="btn-submit">Post Job</button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    </div>

    <script src="js/dashboard.js"></script>
</body>
</html>
