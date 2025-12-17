<?php

session_start();

date_default_timezone_set('Asia/Manila');

//students
$students = [];
$studentsVerified = 0;
$studentsUnverified = 0;

$apiUrl = "http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/admin_student_information.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    echo "<script>console.error('[DEBUG] Dashboard: Students CURL Error = " . addslashes($error) . "');</script>";
    die("Curl error: " . $error);
}

curl_close($ch);
echo "<script>console.log('[DEBUG] Dashboard: Students Response Length = " . strlen($response) . " bytes');</script>";

$data = json_decode($response, true);

if ($data && isset($data['status'])) {
    echo "<script>console.log('[DEBUG] Dashboard: Students API Status = " . $data['status'] . "');</script>";
    if ($data['status'] === "success") {
        $students = $data['data'];

        $studentsVerified = 0;
        $studentsUnverified = 0;

        foreach ($students as $student) {

            if (isset($student['verified']) && (trim(strtolower($student['verified'])) === 'true' || $student['verified'] == 1)) {
                $studentsVerified++;
            } else {
                $studentsUnverified++;
            }
        }
    } else {
        $message = isset($data['message']) ? $data['message'] : "Unknown error";
        echo "<script>console.error('[DEBUG] Dashboard: Students API Error = " . addslashes($message) . "');</script>";
        echo "<p>Error: $message</p>";
    }
} else {
    echo "<script>console.error('[DEBUG] Dashboard: Students Invalid JSON or empty response');</script>";
    echo "<p>Error: API did not return valid JSON or response is empty. Response was: " . htmlspecialchars($response) . "</p>";
}


//companies
$companies = [];
$companiesVerified = 0;
$companiesUnverified = 0;

$apiUrl = "http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/admin_company_information.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    echo "<script>console.error('[DEBUG] Dashboard: Companies CURL Error = " . addslashes($error) . "');</script>";
    die("Curl error: " . $error);
}

curl_close($ch);
echo "<script>console.log('[DEBUG] Dashboard: Companies Response Length = " . strlen($response) . " bytes');</script>";

$data = json_decode($response, true);

if ($data && isset($data['status'])) {
    echo "<script>console.log('[DEBUG] Dashboard: Companies API Status = " . $data['status'] . "');</script>";
    if ($data['status'] === "success") {
        $companies = $data['data'];
        $companiesVerified = isset($data['verified']) ? $data['verified'] : 0;
        $companiesUnverified = isset($data['unverified']) ? $data['unverified'] : 0;
        echo "<script>console.log('[DEBUG] Dashboard: Companies loaded = " . count($companies) . ", Verified = " . $companiesVerified . ", Unverified = " . $companiesUnverified . "');</script>";
    } else {
        $message = isset($data['message']) ? $data['message'] : "Unknown error";
        echo "<script>console.error('[DEBUG] Dashboard: Companies API Error = " . addslashes($message) . "');</script>";
        echo "<p>Error: $message</p>";
    }
} else {
    echo "<script>console.error('[DEBUG] Dashboard: Companies Invalid JSON or empty response');</script>";
    echo "<p>Error: API did not return valid JSON or response is empty. Response was: " . htmlspecialchars($response) . "</p>";
}

//audit

$auditLogs = [];

$apiUrl = "http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/fetch_audit_logs.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    echo "<script>console.error('[DEBUG] Dashboard: Audit Logs CURL Error = " . addslashes($error) . "');</script>";
    die("Curl error: " . $error);
}

curl_close($ch);
echo "<script>console.log('[DEBUG] Dashboard: Audit Logs Response Length = " . strlen($response) . " bytes');</script>";

$data = json_decode($response, true);

if ($data && isset($data['status'])) {
    echo "<script>console.log('[DEBUG] Dashboard: Audit Logs API Status = " . $data['status'] . "');</script>";
    if ($data['status'] === "success") {
        $auditLogs = $data['data'];
        echo "<script>console.log('[DEBUG] Dashboard: Audit Logs loaded = " . count($auditLogs) . "');</script>";
    } else {
        $message = isset($data['message']) ? $data['message'] : "Unknown error";
        echo "<script>console.error('[DEBUG] Dashboard: Audit Logs API Error = " . addslashes($message) . "');</script>";
        echo "<p>Error: $message</p>";
    }
} else {
    echo "<script>console.error('[DEBUG] Dashboard: Audit Logs Invalid JSON or empty response');</script>";
    echo "<p>Error: API did not return valid JSON or response is empty. Response was: " . htmlspecialchars($response) . "</p>";
}


function timeAgo($timestamp)
{
    try {

        $now = new DateTime('now', new DateTimeZone('Asia/Manila'));
        $ago = new DateTime($timestamp);
        $ago->setTimezone(new DateTimeZone('Asia/Manila'));

        $diff = $now->diff($ago);

        if ($diff->y > 0) {
            return $diff->y . ' year' . ($diff->y > 1 ? 's' : '') . ' ago';
        } elseif ($diff->m > 0) {
            return $diff->m . ' month' . ($diff->m > 1 ? 's' : '') . ' ago';
        } elseif ($diff->d > 0) {
            return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
        } elseif ($diff->i > 0) {
            return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';
        } else {
            return 'Just now';
        }
    } catch (Exception $e) {
        return 'Unknown';
    }
}


?>



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
    <link rel="stylesheet" href="../css/dashboard_two.css?v=<?php echo time(); ?>">
</head>

<body>
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page Tailwind/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <pre> </pre>
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
                        <a href="../../AdminRegister/php/register.php" class="dropdown-item"><i class="fa-solid fa-right-from-bracket" onclick="auditLogs('Logout', 'Logout as admin')"></i> Logout</a>

                    </div>
                </div>
            </header>

            <main class="dashboard-body">

                <nav class="breadcrumb-nav">
                    <i class="fa-solid fa-house"></i>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">Dashboard</span>
                </nav>

                <h1 class="page-title">Dashboard Overview</h1>


                <div class="summary-cards-grid">
                    <div class="summary-card maroon">
                        <div class="summary-card-icon">
                            <i class="fa-solid fa-user-graduate"></i>
                        </div>
                        <div class="summary-card-content">
                            <h3>Number of Students</h3>
                            <p class="summary-card-value"><?= count($students) ?></p>
                            <span class="summary-card-label">Total Registered</span>
                        </div>
                    </div>

                    <div class="summary-card yellow">
                        <div class="summary-card-icon">
                            <i class="fa-solid fa-building"></i>
                        </div>
                        <div class="summary-card-content">
                            <h3>Number of Companies</h3>
                            <p class="summary-card-value"><?= count($companies) ?></p>
                            <span class="summary-card-label">Total Accredited</span>
                        </div>
                    </div>
                </div>

                <div class="charts-grid">
                    <div class="card chart-card">
                        <div class="chart-header">
                            <h2><i class="fa-solid fa-chart-pie"></i> Student Verification</h2>
                        </div>
                        <div class="chart-body">
                            <canvas id="studentVerificationChart"></canvas>
                        </div>
                        <div class="chart-footer">
                            <div class="chart-legend-inline">
                                <div class="legend-item-vertical">
                                    <div class="legend-value">
                                        <span class="legend-dot verified"></span>
                                        <span class="legend-number"><?= $studentsVerified ?></span>
                                    </div>
                                    <span class="legend-label">Verified</span>
                                </div>
                                <div class="legend-item-vertical">
                                    <div class="legend-value">
                                        <span class="legend-dot unverified"></span>
                                        <span class="legend-number"><?= $studentsUnverified ?></span>
                                    </div>
                                    <span class="legend-label">Unverified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card chart-card">
                        <div class="chart-header">
                            <h2><i class="fa-solid fa-chart-pie"></i> Company Verification</h2>
                        </div>
                        <div class="chart-body">
                            <canvas id="companyVerificationChart"></canvas>
                        </div>
                        <div class="chart-footer">
                            <div class="chart-legend-inline">
                                <div class="legend-item-vertical">
                                    <div class="legend-value">
                                        <span class="legend-dot verified"></span>
                                        <span class="legend-number"><?= $companiesVerified ?></span>
                                    </div>
                                    <span class="legend-label">Verified</span>
                                </div>
                                <div class="legend-item-vertical">
                                    <div class="legend-value">
                                        <span class="legend-dot unverified"></span>
                                        <span class="legend-number"><?= $companiesUnverified ?></span>
                                    </div>
                                    <span class="legend-label">Unverified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card audit-trail-section">
                    <div class="audit-trail-header">
                        <h2><i class="fa-solid fa-clock-rotate-left"></i> Audit Trails</h2>
                        <div class="audit-trail-actions">
                            <input type="text" id="auditSearch" class="audit-search-input" placeholder="Search audit logs...">
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="audit-table" id="auditTable">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Time Ago</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($auditLogs as $auditLog) { ?>
                                    <tr>
                                        <td><?php echo $auditLog['created_at']; ?></td>
                                        <td><span class="time-ago-badge"><?php echo timeAgo($auditLog['created_at']); ?></span></td>
                                        <td><span class="role-badge <?php echo strtolower($auditLog['role']); ?>"><?php echo ucfirst($auditLog['role']); ?></span></td>
                                        <td><span class="action-badge <?php echo strtolower($auditLog['action']); ?>"><?php echo ucfirst($auditLog['action']); ?></span></td>
                                        <td><?php echo $auditLog['description']; ?></td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>

                    <div class="audit-trail-footer">
                        <p class="audit-trail-info">Showing <?php echo count($auditLogs); ?> entries</p>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script>
        window.dashboardData = {
            students: {
                verified: <?= $studentsVerified ?>,
                unverified: <?= $studentsUnverified ?>
            },
            companies: {
                verified: <?= $companiesVerified ?>,
                unverified: <?= $companiesUnverified ?>
            }
        };

        console.log('Dashboard Data Loaded:', window.dashboardData);
        console.log('Students - Verified:', <?= $studentsVerified ?>, 'Unverified:', <?= $studentsUnverified ?>);
        console.log('Companies - Verified:', <?= $companiesVerified ?>, 'Unverified:', <?= $companiesUnverified ?>);
    </script>
    <script src="../js/dashboard.js"></script>
</body>

</html>