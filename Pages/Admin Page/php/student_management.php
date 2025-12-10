<?php

session_start();

$students = [];

$apiUrl = "http://localhost/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/admin_student_information.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    die("Curl error: " . curl_error($ch));
}

curl_close($ch);

$data = json_decode($response, true);

if ($data && isset($data['status'])) {
    if ($data['status'] === "success") {
        $students = $data['data'];
    } else {
        $message = isset($data['message']) ? $data['message'] : "Unknown error";
        echo "<p>Error: $message</p>";
    }
} else {
    // If JSON decode failed, it might be due to spaces/newlines in the output before json_encode
    // or the URL is returning a 404 HTML page.
    echo "<p>Error: API did not return valid JSON or response is empty. Response was: " . htmlspecialchars($response) . "</p>";
}
?>



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
                                <th>First Name</th>
                                <th>Middle Initial</th>
                                <th>Last Name</th>
                                <th>Suffix</th>
                                <th>Campus</th>
                                <th>Department</th>
                                <th>School Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($students as $student): ?>
                                <tr>
                                    <td><?= $student['student_id'] ?></td>
                                    <td><?= $student['first_name'] ?></td>
                                    <td><?= $student['middle_initial'] ?></td>
                                    <td><?= $student['last_name'] ?></td>
                                    <td><?= $student['suffix'] ?></td>
                                    <td><?= $student['department'] ?></td>
                                    <td><?= $student['course'] ?></td>
                                    <td><?= $student['student_email'] ?></td>
                                    <td><span class="status verified">Verified</span></td>
                                    <td class="action-buttons">
                                        <button class="action-btn edit-btn" title="Edit" href="../editInfo.php"><i class="fa-solid fa-pen-to-square"></i></button>
                                        <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
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