<link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.min.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.bootstrap5.min.css">


<?php

session_start();

$students = [];

$apiUrl = "http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/admin_student_information.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    echo "<script>console.error('[DEBUG] Student Management: CURL Error = " . addslashes($error) . "');</script>";
    die("Curl error: " . $error);
}

curl_close($ch);

echo "<script>console.log('[DEBUG] Student Management: Raw API Response Length = " . strlen($response) . " bytes');</script>";

$data = json_decode($response, true);

if ($data && isset($data['status'])) {
    echo "<script>console.log('[DEBUG] Student Management: API Status = " . $data['status'] . "');</script>";
    if ($data['status'] === "success") {
        $students = $data['data'];
        echo "<script>console.log('[DEBUG] Student Management: Students loaded = " . count($students) . "');</script>";
        echo "<script>console.log('[DEBUG] Student Management: First student data:', " . json_encode($students[0] ?? null) . ");</script>";
    } else {
        $message = isset($data['message']) ? $data['message'] : "Unknown error";
        echo "<script>console.error('[DEBUG] Student Management: API Error Message = " . addslashes($message) . "');</script>";
        echo "<p>Error: $message</p>";
    }
} else {
    echo "<script>console.error('[DEBUG] Student Management: Invalid JSON or empty response');</script>";
    echo "<script>console.log('[DEBUG] Student Management: Raw response:', " . json_encode(substr($response, 0, 200)) . ");</script>";
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

    <link rel="stylesheet" href="../../AdminStudentManagement/css/dashboard.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="../css/student_management_modern.css">
</head>

<body>
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page Tailwind/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <pre> </pre>
                    <span>Hirenorian
                    </span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="../../AdminDashboard/php/dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="student_management.php" class="nav-item active">
                    <i class="fa-solid fa-user-graduate"></i>
                    <span>Student Management</span>
                </a>
                <a href="../../AdminCompanyManagement/php/company_management.php" class="nav-item">
                    <i class="fa-solid fa-building"></i>
                    <span>Company Management</span>
                </a>
            </nav>
        </aside>

        <div class="main-content">
            <header class="top-bar">
                <div class="top-bar-right">
                    <div class="user-profile" id="userProfileBtn" onclick="document.getElementById('profileDropdown').classList.toggle('show')">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Admin" class="user-img">
                        <span class="user-name">Admin</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="../../AdminRegister/php/register.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
                        <?php
                        include '../../API/adminDB_APIs/db_con.php';

                        if (isset($conn)) {
                            try {
                                $action = "Log Out";
                                $description = "Log Out as admin";

                                $stmt = $conn->prepare("INSERT INTO adminAuditLog (role, action, description) VALUES ('admin', :action, :description)");
                                $stmt->execute([':action' => $action, ':description' => $description]);
                            } catch (Exception $e) {
                            }
                        }
                        ?>
                    </div>
            </header>

            <main class="dashboard-body">
                <h1 class="page-title">Student Management</h1>
                <div class="card student-management-card">


                    <table class="crud-table" id="datatableid">
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
                                <th>Account Status</th>
                                <th>Activation Status</th>
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
                                    <td>
                                        <button type="button" class="status verification-btn 
                                            <?= (trim(strtolower($student['verified'])) === 'true' || $student['verified'] == 1) ? 'verified' : 'unverified' ?>">
                                            <?= (trim(strtolower($student['verified'])) === 'true' || $student['verified'] == 1) ? 'verified' : 'unverified' ?>
                                        </button>
                                    </td>

                                    <td>
                                        <?php if (trim(strtolower($student['activated'])) === 'true' || $student['activated'] == 1): ?>
                                            <span class="badge bg-success activated">Activated</span>
                                        <?php else: ?>
                                            <span class="badge bg-danger deactivated">Deactivated</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="action-buttons">
                                        <button type="button" class="action-btn edit-btn" title="Update Info" data-id="<?= $student['student_id'] ?>"><i class="fa-solid fa-pen-to-square"></i></button>

                                        <?php if (trim(strtolower($student['activated'])) === 'true' || $student['activated'] == 1): ?>
                                            <button type="button" class="action-btn suspend-btn" title="Suspend/Deactivate" data-id="<?= $student['student_id'] ?>"><i class="fa-solid fa-ban"></i></button>
                                        <?php else: ?>
                                            <button type="button" class="action-btn activate-btn" title="Activate" data-id="<?= $student['student_id'] ?>"><i class="fa-solid fa-power-off"></i></button>
                                        <?php endif; ?>

                                        <button type="button" class="action-btn seeDocu-btn" title="View Documents" data-id="<?= $student['student_id'] ?>"><i class="fa-solid fa-file-lines"></i></button>

                                        <button type="button" class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                </div>

            </main>
        </div>
    </div>

    <script src="../../AdminStudentManagement/js/dashboard.js"></script>
    <script src="../../AdminStudentManagement/js/student_management.js?v=<?php echo time(); ?>"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

    <script>
        console.log('[DEBUG] Student Management: DOM Ready - Initializing DataTable');
        console.log('[DEBUG] Student Management: Total students in table = <?= count($students) ?>');
        
        $(document).ready(function() {
            try {
                const table = $('#datatableid').DataTable();
                console.log('[DEBUG] Student Management: DataTable initialized successfully');
                console.log('[DEBUG] Student Management: DataTable rows = ' + table.rows().count());
            } catch(error) {
                console.error('[DEBUG] Student Management: DataTable initialization error:', error);
            }
        });
    </script>

</body>

</html>