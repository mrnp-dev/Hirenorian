<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management - Hirenorian</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../css/dashboard.css">
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
                <a href="dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="student_management.php" class="nav-item active">
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
                <h1 class="page-title">Student Management</h1>
                
                <div class="card student-management-card">
                    <div class="table-actions">
                        <button class="add-new-btn"><i class="fa-solid fa-plus"></i> Add New Student</button>
                    </div>
                    
                    <table class="crud-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Campus</th>
                                <th>Department</th>
                                <th>School Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Yisrael Christian C. Bulanadi</td>
                                <td>Main Campus</td>
                                <td>CCS</td>
                                <td>202330111@pampangastateu.edu.ph</td>
                                <td><span class="status verified">Verified</span></td>
                                <td class="action-buttons">
                                    <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Yisrael Christian C. Bulanadi</td>
                                <td>Main Campus</td>
                                <td>CCS</td>
                                <td>202330111@pampangastateu.edu.ph</td>
                                <td><span class="status unverified">Unverified</span></td>
                                <td class="action-buttons">
                                    <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Yisrael Christian C. Bulanadi</td>
                                <td>Main Campus</td>
                                <td>CCS</td>
                                <td>202330111@pampangastateu.edu.ph</td>
                                <td><span class="status verified">Verified</span></td>
                                <td class="action-buttons">
                                    <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Yisrael Christian C. Bulanadi</td>
                                <td>Main Campus</td>
                                <td>CCS</td>
                                <td>202330111@pampangastateu.edu.ph</td>
                                <td><span class="status unverified">Unverified</span></td>
                                <td class="action-buttons">
                                    <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="pagination-footer">
                        <div class="page-controls">
                            <select class="entries-select">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                            <span class="display-info">Displaying 01 out of 500</span>
                        </div>
                        <div class="pagination-nav">
                            <button class="nav-arrow" disabled><i class="fa-solid fa-chevron-left"></i></button>
                            <span class="page-number active-page">1</span>
                            <span class="page-number">2</span>
                            <span class="page-number">3</span>
                            <span class="page-number">4</span>
                            <span class="page-number">5</span>
                            <span class="page-number">6</span>
                            <button class="nav-arrow"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    </div>

    <script src="../js/dashboard.js"></script>
    <script src="../js/student_management.js"></script>
</body>
</html>