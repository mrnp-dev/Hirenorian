<?php
session_start();
$student_id = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Student Documents - Hirenorian</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="../css/dashboard.css?v=<?php echo time(); ?>">
    <style>

    </style>
</head>

<body>
    <div class="dashboard-container">

        <aside class="sidebar">
            <div class="logo-container">
                <a href="../../../Landing Page/php/landing_page.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px; color: inherit;">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                    <pre> </pre>
                    <span>Hirenorian</span>
                </a>
            </div>
            <nav class="sidebar-nav">
                <a href="../../AdminDashboard/php/dashboard.php" class="nav-item">
                    <i class="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </a>
                <a href="../../AdminStudentManagement/php/student_management.php" class="nav-item active">
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
                    <div class="user-profile">
                        <img src="../../../Landing Page/Images/gradpic2.png" alt="Admin" class="user-img">
                        <span class="user-name">Admin</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </header>

            <main class="dashboard-body">
                <div class="d-flex align-items-center gap-3 mb-4">
                    <a href="student_management.php" class="btn btn-outline-secondary btn-sm">
                        <i class="fa-solid fa-arrow-left"></i> Back
                    </a>
                    <h2 class="page-title m-0">Student Documents</h2>
                </div>

                <div class="card p-4 border-0 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="m-0">Documents for: <span class="text-primary" id="studentNameDisplay">Loading...</span></h4>
                        <div class="d-flex gap-4">
                            <div>
                                <div class="info-label">Student ID</div>
                                <div class="info-value" id="displayStudentId"><?= htmlspecialchars($student_id) ?></div>
                            </div>

                            <div>
                                <button type="button" class="btn btn-secondary" id="verificationStatusBtn">
                                    Pending
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="loadingSpinner" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 text-secondary">Fetching documents...</p>
                    </div>

                    <div id="documentsContainer" class="row g-4" style="display: none;">

                        <div class="col-md-6 col-lg-4">
                            <div class="doc-section-card h-100">
                                <div class="doc-header">
                                    <h6 class="m-0"><i class="fa-solid fa-file-contract me-2 text-primary"></i> TOR</h6>
                                    <span class="status-badge bg-warning text-dark" id="status-tor">Not Uploaded</span>
                                </div>
                                <div class="doc-body">
                                    <div class="mb-3">
                                        <i class="fa-regular fa-file-pdf fa-3x text-secondary" id="icon-tor"></i>
                                    </div>
                                    <div id="action-tor">
                                        <button class="btn btn-sm btn-unavailable" disabled>Unavailable</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 col-lg-4">
                            <div class="doc-section-card h-100">
                                <div class="doc-header">
                                    <h6 class="m-0"><i class="fa-solid fa-landmark me-2 text-primary"></i> Diploma</h6>
                                    <span class="status-badge bg-warning text-dark" id="status-diploma">Not Uploaded</span>
                                </div>
                                <div class="doc-body">
                                    <div class="mb-3">
                                        <i class="fa-regular fa-file-pdf fa-3x text-secondary" id="icon-diploma"></i>
                                    </div>
                                    <div id="action-diploma">
                                        <button class="btn btn-sm btn-unavailable" disabled>Unavailable</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div id="errorMessage" class="alert alert-danger mt-3" style="display: none;"></div>

                </div>

            </main>
        </div>
    </div>

    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const studentId = "<?= $student_id ?>";

            if (!studentId) {
                showError('No Student ID provided. Please go back and select a student.');
                return;
            }

            fetchDocuments(studentId);

            const statusBtn = document.getElementById('verificationStatusBtn');
            if (statusBtn) {
                statusBtn.addEventListener('click', function() {
                    swal({
                            title: "Update Status",
                            text: "Choose the new status for this student's document verification.",
                            icon: "info",
                            buttons: {
                                cancel: "Cancel",
                                reject: {
                                    text: "Reject",
                                    value: "Rejected",
                                    className: "bg-danger"
                                },
                                pending: {
                                    text: "Pending",
                                    value: "Pending",
                                    className: "bg-secondary"
                                },
                                accept: {
                                    text: "Approve",
                                    value: "Approved",
                                    className: "bg-success"
                                }
                            },
                        })
                        .then((value) => {
                            if (value === "Approved" || value === "Rejected" || value === "Pending") {
                                updateVerificationStatus(studentId, value);
                            }
                        });
                });
            }
        });

        function fetchDocuments(id) {
            const apiUrl = `http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/fetch_documents.php?student_id=${id}`;

            fetch(apiUrl)
                .then(async response => {
                    const text = await response.text();
                    try {
                        const data = JSON.parse(text);
                        if (!response.ok) {
                            throw new Error(data.message || 'Server returned an error');
                        }
                        return data;
                    } catch (e) {
                        console.error('Response text:', text);
                        throw new Error('Invalid server response: ' + text.substring(0, 100));
                    }
                })
                .then(data => {
                    document.getElementById('loadingSpinner').style.display = 'none';

                    if (data.status === 'success') {
                        document.getElementById('documentsContainer').style.display = 'flex';

                        if (data.student_name) {
                            document.getElementById('studentNameDisplay').textContent = data.student_name;
                        }

                        if (data.data && data.data.status) {
                            updateStatusButtonUI(data.data.status);
                        } else {
                            updateStatusButtonUI('Pending');
                        }



                        updateDocumentCard('tor', data.data.tor_file);
                        updateDocumentCard('diploma', data.data.diploma_file);

                    } else {
                        showError(data.message || 'Failed to fetch documents');
                    }
                })
                .catch(err => {
                    document.getElementById('loadingSpinner').style.display = 'none';
                    showError(err.message || 'An error occurred while communicating with the server.');
                });
        }

        function updateStatusButtonUI(status) {
            const btn = document.getElementById('verificationStatusBtn');
            if (!btn) return;

            status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

            btn.textContent = status;
            btn.className = 'btn';

            if (status === 'Approved') {
                btn.classList.add('btn-success');
            } else if (status === 'Rejected') {
                btn.classList.add('btn-danger');
            } else {
                btn.classList.add('btn-secondary');
                btn.textContent = 'Pending';
                if (status !== 'Pending') btn.textContent = status;
            }
        }

        function updateVerificationStatus(studentId, newStatus) {
            const apiUrl = `http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/update_verification_request.php`;

            fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        student_id: studentId,
                        status: newStatus
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        swal("Success", "Status updated to " + newStatus, "success");
                        updateStatusButtonUI(newStatus);
                        auditLogs('Update', 'updated document verification status for student id: ' + studentId);
                    } else {
                        swal("Error", data.message || "Failed to update status", "error");
                    }
                })
                .catch(err => {
                    swal("Error", "An unexpected error occurred", "error");
                });
        }

        function updateDocumentCard(type, filePath) {
            const statusBadge = document.getElementById(`status-${type}`);
            const actionDiv = document.getElementById(`action-${type}`);
            const icon = document.getElementById(`icon-${type}`);

            statusBadge.className = 'status-badge';

            if (filePath) {

                statusBadge.textContent = 'Uploaded';
                statusBadge.classList.add('bg-success', 'text-white');

                icon.classList.remove('text-secondary');
                icon.classList.add('text-danger');

                const viewBtn = document.createElement('a');
                viewBtn.href = filePath;
                viewBtn.target = '_blank';
                viewBtn.className = 'btn btn-primary btn-sm';
                viewBtn.innerHTML = '<i class="fa-solid fa-eye me-1"></i> View Document';

                actionDiv.innerHTML = '';
                actionDiv.appendChild(viewBtn);
            } else {

                statusBadge.textContent = 'Not Uploaded';
                statusBadge.classList.add('bg-warning', 'text-dark');

                icon.classList.add('text-secondary');

                actionDiv.innerHTML = '<button class="btn btn-sm btn-unavailable" disabled>Unavailable</button>';
            }
        }

        function showError(msg) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
            document.getElementById('loadingSpinner').style.display = 'none';
        }




        function auditLogs(actionType, decription) {
            fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/audit.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action_type: actionType,
                        description: decription,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log('Audit log added successfully');
                    } else {
                        alert('Error adding audit log: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    alert('Error logging audit log.');
                });
        }
    </script>
</body>

</html>