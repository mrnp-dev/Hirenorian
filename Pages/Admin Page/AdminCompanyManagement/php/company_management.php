<?php
session_start();

// Mock Data for Companies
$companies = [
    [
        'id' => '1',
        'logo' => 'https://via.placeholder.com/40',
        'name' => 'Tech Solutions Inc.',
        'type' => 'Corporation',
        'industry' => 'Information Technology',
        'contact_person' => 'John Doe',
        'email' => 'johndoe@techsolutions.com',
        'status' => 'verified',
        'account_status' => 'active'
    ],
    [
        'id' => '2',
        'logo' => 'https://via.placeholder.com/40',
        'name' => 'Creative Designs Co.',
        'type' => 'Partnership',
        'industry' => 'Design & Arts',
        'contact_person' => 'Jane Smith',
        'email' => 'jane@creativedesigns.com',
        'status' => 'unverified',
        'account_status' => 'active'
    ],
    [
        'id' => '3',
        'logo' => 'https://via.placeholder.com/40',
        'name' => 'Global Logistics',
        'type' => 'Corporation',
        'industry' => 'Logistics',
        'contact_person' => 'Michael Brown',
        'email' => 'michael@globallogistics.com',
        'status' => 'verified',
        'account_status' => 'deactivated'
    ]
];
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

    <link rel="stylesheet" href="../css/style.css">
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
                                <th>Logo</th>
                                <th>Company Name</th>
                                <th>Business Type</th>
                                <th>Industry</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($companies as $company): ?>
                                <tr>
                                    <td><img src="<?= $company['logo'] ?>" alt="Logo" style="width: 40px; height: 40px; border-radius: 50%;"></td>
                                    <td><?= htmlspecialchars($company['name']) ?></td>
                                    <td><?= htmlspecialchars($company['type']) ?></td>
                                    <td><?= htmlspecialchars($company['industry']) ?></td>
                                    <td><?= htmlspecialchars($company['contact_person']) ?></td>
                                    <td><?= htmlspecialchars($company['email']) ?></td>
                                    <td>
                                        <?php if ($company['status'] === 'verified'): ?>
                                            <button type="button" class="status verified activation-btn" data-id="<?= $company['id'] ?>">Verified</button>
                                        <?php else: ?>
                                            <button type="button" class="status unverified activation-btn" data-id="<?= $company['id'] ?>">Unverified</button>
                                        <?php endif; ?>
                                    </td>
                                    <td class="action-buttons">
                                        <!-- Approve Account Button (Contextual if needed, or part of status) -->
                                        <!-- <button type="button" class="action-btn approve-btn" title="Approve Account"><i class="fa-solid fa-check"></i></button> -->
                                        
                                        <button type="button" class="action-btn edit-btn" title="Update Info" data-id="<?= $company['id'] ?>"><i class="fa-solid fa-pen-to-square"></i></button>
                                        
                                        <?php if ($company['account_status'] === 'active'): ?>
                                            <button type="button" class="action-btn suspend-btn" title="Suspend/Deactivate" data-id="<?= $company['id'] ?>"><i class="fa-solid fa-ban"></i></button>
                                        <?php else: ?>
                                            <button type="button" class="action-btn activate-btn" title="Activate" data-id="<?= $company['id'] ?>"><i class="fa-solid fa-power-off"></i></button>
                                        <?php endif; ?>

                                        <button type="button" class="action-btn reset-pwd-btn" title="Reset Password" data-id="<?= $company['id'] ?>"><i class="fa-solid fa-key"></i></button>
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
