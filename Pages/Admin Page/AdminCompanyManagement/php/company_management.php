<?php
session_start();

$companies = [];

$apiUrl = "http://localhost/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/companyManagementAPIs/admin_company_information.php";

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
        $companies = $data['data'];
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
    <title>Company Management - Hirenorian</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.bootstrap5.min.css">

    <link rel="stylesheet" href="../css/style.css?v=<?php echo time(); ?>">
</head>

<body>
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo"><pre> </pre>
                    <span>Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="../../AdminDashboard/php/dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../AdminStudentManagement/php/student_management.php" class="nav-item">
                    <i class="fa-solid fa-user-graduate"></i>
                    <span>Student Management</span>
                </a>
                <a href="company_management.php" class="nav-item active">
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
                <h1 class="page-title">Company Management</h1>

                <div class="card item-management-card">
                    <!-- <div class="table-actions">
                        <button class="add-new-btn"><i class="fa-solid fa-plus"></i> Add New Company</button>
                    </div> -->

                    <table class="crud-table" id="companyTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Company Name</th>
                                <th>Business Type</th>
                                <th>Industry</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Account Status</th>
                                <th>Activation Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($companies as $company): ?>
                                <tr>
                                    <td><?= $company['company_id'] ?></td>
                                    <td><?= $company['company_name'] ?></td>
                                    <td><?= $company['company_type'] ?></td>
                                    <td><?= $company['industry'] ?></td>
                                    <td><?= $company['contact_name'] ?></td>
                                    <td><?= $company['email'] ?></td>
                                    <td>
                                        <button type="button" class="status verification-btn 
                                           <?= (trim(strtolower($company['verification'])) === 'true' || $company['verification'] == 1) ? 'verified' : 'unverified' ?>">
                                            <?= (trim(strtolower($company['verification'])) === 'true' || $company['verification'] == 1) ? 'verified' : 'unverified' ?>
                                        </button>
                                    </td>

                                    <td>
                                        <?php if (trim(strtolower($company['activation'])) === 'activated'): ?>
                                            <span class="badge bg-success activated">Activated</span>
                                        <?php else: ?>
                                            <span class="badge bg-danger deactivated">Deactivated</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="action-buttons">
                                        <button type="button" class="action-btn edit-btn" title="Update Info" data-id="<?= $company['company_id'] ?>"><i class="fa-solid fa-pen-to-square"></i></button>

                                        <?php if (trim(strtolower($company['activation'])) === 'activated'): ?>
                                            <button type="button" class="action-btn suspend-btn" title="Suspend/Deactivate" data-id="<?= $company['company_name'] ?>"><i class="fa-solid fa-ban"></i></button>
                                        <?php else: ?>
                                            <button type="button" class="action-btn activate-btn" title="Activate" data-id="<?= $company['company_name'] ?>"><i class="fa-solid fa-power-off"></i></button>
                                        <?php endif; ?>

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

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#companyTable').DataTable();
        });
    </script>

    <script src="../js/company_management.js"></script>
</body>

</html>