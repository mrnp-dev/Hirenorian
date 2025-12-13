<?php
session_start();

if (isset($_SESSION['email'])) {
    $company_email = $_SESSION['email'];

    $apiUrl = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_company_information.php";

    // Send JSON with "company_email"
    $payload = json_encode([
        "company_email" => $company_email
    ]);

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {
        die("Curl error: " . curl_error($ch));
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if ($data['status'] === "success") {
        // --- Base company info ---
        $company = $data['company'];
        $company_id = $company['company_id'];
        $company_name = $company['company_name'];
        $company_email = $company['email'];

        // Check for boolean true, string "true", or integer 1
        $verification_val = isset($data['company']['verification']) ? $data['company']['verification'] : false;
        $is_verified = ($verification_val === true || $verification_val === 'true' || $verification_val == 1);

        // --- Images (Icons) ---
        $company_icon_url = "";
        if (!empty($data['icons'])) {
            $url = $data['icons'][0]['icon_url'];
            $company_icon_url = str_replace('/var/www/html', 'http://mrnp.site:8080', $url);
        }

        // Default Icon Logic
        $is_default_icon = false;
        if (empty($company_icon_url)) {
            $company_icon_url = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            $is_default_icon = true;
        }
    } else {
        $error_message = $data['message'];
    }

} else {
    header("Location: ../../../Landing Page/php/landing_page.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Listing - Hirenorian</title>
    <!-- Shared CSS from Dashboard -->
    <link rel="stylesheet" href="../../Company Dashboard/css/variables.css">
    <link rel="stylesheet" href="../../Company Dashboard/css/dashboard.css">
    <!-- Page Specific CSS -->
    <link rel="stylesheet" href="../css/job_listing.css">
    <link rel="stylesheet" href="../css/job_listing_dropdown.css">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo-container">
                <img src="https://dhvsu.edu.ph/images/about_pampanga_state_u/pampanga-state-u-logo-small.png"
                    alt="Pampanga State University" class="logo-icon">
                <span class="logo-text">Hirenorian</span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="../../Company Dashboard/php/company_dashboard.php" class="nav-link">
                        <i class="fa-solid fa-table-columns"></i>
                        <span class="link-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../../Company Profile Page/php/company_profile.php" class="nav-link">
                        <i class="fa-solid fa-users"></i>
                        <span class="link-text">Company Profile</span>
                    </a>
                </li>
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="link-text">Job Listing</span>
                    </a>
                </li>

            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="top-bar">
                <div class="user-profile" id="userProfile">
                    <div class="user-info">
                        <div class="user-avatar-wrapper" style="position: relative; display: inline-block;">
                            <img src="<?php echo $company_icon_url; ?>" alt="Profile"
                                class="user-avatar <?php echo $is_default_icon ? 'default-icon' : ''; ?>"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                            <?php if ($is_verified): ?>
                                <img src="https://img.icons8.com/?size=100&id=84992&format=png&color=10b981" alt="Verified"
                                    class="header-verification-badge verified" title="Verified Account">
                            <?php else: ?>
                                <img src="https://img.icons8.com/?size=100&id=85083&format=png&color=ef4444"
                                    alt="Unverified" class="header-verification-badge unverified"
                                    title="Unverified Account">
                            <?php endif; ?>
                        </div>
                        <span class="user-name"><?php echo $company_name; ?></span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item" id="signOutBtn">Sign Out</a>
                    </div>
                </div>
            </header>
            <input type="hidden" id="company_email" value="<?php echo htmlspecialchars($company_email); ?>">
            <div class="content-wrapper">
                <div class="page-title">
                    <h1>Job Listing</h1>
                </div>

                <!-- Job Listing Content -->
                <section class="content-section active">
                    <!-- ==================== CARD VIEW CONTAINER ==================== -->
                    <div id="card-view-container">
                        <!-- Search and Add Button -->
                        <div class="job-search-header">
                            <div class="search-bar-wrapper">
                                <i class="fa-solid fa-search"></i>
                                <input type="text" id="jobSearchInput" class="job-search-input"
                                    placeholder="Search job titles...">
                            </div>
                            <?php if ($is_verified): ?>
                                <button class="btn-add-job" id="btnAddJob">
                                    <i class="fa-solid fa-plus"></i>
                                    Add Job Posting
                                </button>
                            <?php else: ?>
                                <button class="btn-add-job disabled-unverified" id="btnAddJobUnverified"
                                    onclick="ToastSystem.show('You must verify your account before posting a job.', 'warning');"
                                    style="opacity: 0.6; cursor: not-allowed; background-color: #95a5a6;"
                                    title="Account verification required">
                                    <i class="fa-solid fa-lock"></i>
                                    Post a Job (Locked)
                                </button>
                            <?php endif; ?>
                        </div>

                        <!-- Job Cards Grid -->
                        <div id="jobCardsGrid" class="job-cards-grid">
                            <!-- Job cards will be populated by JavaScript -->
                        </div>

                        <!-- Empty State for No Jobs -->
                        <div id="noJobsState" class="empty-state-jobs" style="display: none;">
                            <i class="fa-solid fa-briefcase"></i>
                            <h3>No Job Posts Yet</h3>
                            <p>Click "Add Job Posting" to create your first job post</p>
                        </div>
                    </div>

                    <!-- ==================== DETAIL VIEW CONTAINER ==================== -->
                    <div id="detail-view-container" style="display: none;">
                        <!-- Action Bar (Top) -->
                        <div class="action-bar-top">
                            <button class="btn-action-top btn-back" id="btnBack">
                                <i class="fa-solid fa-arrow-left"></i>
                                Back
                            </button>
                            <div class="action-buttons-right">
                                <button class="btn-action-top btn-edit-detail" id="btnEditDetail">
                                    <i class="fa-solid fa-pen"></i>
                                    Edit
                                </button>
                                <button class="btn-action-top btn-close-detail" id="btnCloseDetail">
                                    <i class="fa-solid fa-times"></i>
                                    Close Post
                                </button>
                                <button class="btn-action-top btn-delete-detail" id="btnDeleteDetail"
                                    style="display: none; background: #fee2e2; color: #ef4444; border: 1px solid #fecaca;">
                                    <i class="fa-solid fa-trash"></i>
                                    Delete Post
                                </button>
                            </div>
                        </div>

                        <!-- Job Detail Information -->
                        <div class="job-detail-card">
                            <div class="job-detail-header">
                                <div class="company-badge">
                                    <img id="detailCompanyIcon" src="" alt="Company Icon" class="detail-company-icon">
                                    <span id="detailCompanyName" class="detail-company-name"></span>
                                </div>
                                <h2 id="detailJobTitle" class="detail-job-title"></h2>

                                <!-- Work Tags under Job Title -->
                                <div id="detailWorkTags" class="job-detail-tags">
                                    <!-- Tags will be populated dynamically -->
                                </div>
                            </div>

                            <div class="job-detail-meta">
                                <div class="meta-item">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span id="detailLocation"></span>
                                </div>
                                <div class="meta-item">
                                    <i class="fa-solid fa-briefcase"></i>
                                    <span id="detailWorkType"></span>
                                </div>
                                <div class="meta-item">
                                    <i class="fa-solid fa-users"></i>
                                    <span id="detailApplicantLimit"></span>
                                </div>
                                <div class="meta-item">
                                    <i class="fa-solid fa-file-alt"></i>
                                    <span id="detailRequiredDoc"></span>
                                </div>
                            </div>

                            <!-- Job Detail Sections in Horizontal Layout -->
                            <div class="job-detail-sections-grid">
                                <div class="job-detail-section">
                                    <h3>Job Description</h3>
                                    <p id="detailJobDescription"></p>
                                </div>

                                <div class="job-detail-section">
                                    <h3>Responsibilities</h3>
                                    <p id="detailResponsibilities"></p>
                                </div>

                                <div class="job-detail-section">
                                    <h3>Qualifications</h3>
                                    <p id="detailQualifications"></p>
                                </div>

                                <div class="job-detail-section">
                                    <h3>Skills</h3>
                                    <p id="detailSkills"></p>
                                </div>
                            </div>
                        </div>

                        <!-- Statistics and Applicants Layout -->
                        <div class="detail-content-layout">
                            <!-- Statistics Sidebar -->
                            <div class="statistics-sidebar">
                                <div class="stats-card">
                                    <h3>Post Statistics</h3>
                                    <div class="stats-stack">
                                        <!-- Applicants Stat -->
                                        <div class="stat-card-item applicants">
                                            <div class="stat-icon">
                                                <i class="fa-solid fa-users"></i>
                                            </div>
                                            <div class="stat-info">
                                                <span class="stat-value" id="totalCount">0</span>
                                                <span class="stat-label">Applicants</span>
                                            </div>
                                        </div>

                                        <!-- Pending Stat -->
                                        <div class="stat-card-item pending">
                                            <div class="stat-icon">
                                                <i class="fa-solid fa-clock"></i>
                                            </div>
                                            <div class="stat-info">
                                                <span class="stat-value" id="pendingCount">0</span>
                                                <span class="stat-label">Pending</span>
                                            </div>
                                        </div>

                                        <!-- Accepted Stat -->
                                        <div class="stat-card-item accepted">
                                            <div class="stat-icon">
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                            <div class="stat-info">
                                                <span class="stat-value" id="acceptedCount">0</span>
                                                <span class="stat-label">Accepted</span>
                                            </div>
                                        </div>

                                        <!-- Rejected Stat -->
                                        <div class="stat-card-item rejected">
                                            <div class="stat-icon">
                                                <i class="fa-solid fa-times"></i>
                                            </div>
                                            <div class="stat-info">
                                                <span class="stat-value" id="rejectedCount">0</span>
                                                <span class="stat-label">Rejected</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Applicants Container -->
                            <div class="applicants-container-detail">
                                <!-- Batch Actions Toolbar (Hidden by default) -->
                                <div class="batch-actions-toolbar" id="batchActionsToolbar" style="display: none;">
                                    <span class="selected-count" id="selectedCount">0 selected</span>
                                    <div class="batch-actions-buttons">
                                        <button class="batch-btn batch-accept" id="batchAcceptBtn">
                                            <i class="fa-solid fa-check"></i>
                                            Accept Selected
                                        </button>
                                        <button class="batch-btn batch-reject" id="batchRejectBtn">
                                            <i class="fa-solid fa-times"></i>
                                            Reject Selected
                                        </button>
                                        <button class="batch-btn batch-cancel" id="batchCancelBtn">
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                <!-- List Controls (Search & Filter) -->
                                <div class="list-controls">
                                    <div class="filter-pills">
                                        <button class="filter-pill active" data-status="all">All</button>
                                        <button class="filter-pill" data-status="pending">Pending</button>
                                        <button class="filter-pill" data-status="accepted">Accepted</button>
                                        <button class="filter-pill" data-status="rejected">Rejected</button>
                                    </div>
                                    <div class="search-box-inline">
                                        <i class="fa-solid fa-search"></i>
                                        <input type="text" id="searchInput" placeholder="Search applicants...">
                                    </div>
                                </div>

                                <!-- Table Header -->
                                <div class="applicants-header">
                                    <div class="header-cell checkbox-cell">
                                        <input type="checkbox" id="selectAll" class="checkbox-master">
                                    </div>
                                    <div class="header-cell name-cell">Name</div>
                                    <div class="header-cell course-cell">Course</div>
                                    <div class="header-cell document-cell">Document Type</div>
                                    <div class="header-cell date-cell">Date Applied</div>
                                    <div class="header-cell actions-cell">Actions</div>
                                </div>

                                <!-- Applicants List (Dynamically Populated) -->
                                <div id="applicantsList" class="applicants-list">
                                    <!-- Items will be populated by JavaScript -->
                                </div>

                                <!-- Empty State -->
                                <div id="emptyState" class="empty-state" style="display: none;">
                                    <i class="fa-solid fa-inbox"></i>
                                    <h3>No Applicants Found</h3>
                                    <p>Try adjusting your search or filter criteria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Batch Actions Toolbar (Hidden by default) -->
                    <div class="batch-actions-toolbar-placeholder" style="display: none;">
                        <!--keeping this structure for script compatibility -->
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- Job Posting Modal -->
    <div class="job-post-modal-overlay" id="jobPostModalOverlay" style="display: none;">
        <div class="job-post-modal">
            <form id="jobPostForm" class="job-post-form">
                <!-- Mode Indicator -->
                <div class="modal-mode-indicator" id="modalModeIndicator" style="display: none;">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span id="modalModeText">Editing: <strong id="editingJobTitle"></strong></span>
                </div>

                <!-- Modal Header -->
                <div class="modal-header">
                    <div class="job-title-input-group">
                        <input type="text" id="jobTitleInput" name="jobTitle" placeholder="Job title" required>
                        <p class="error-message" id="jobTitleError"></p>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-modal btn-cancel" id="btnCancelModal">
                            <i class="fa-solid fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn-modal btn-post" id="btnPostJob">
                            <i class="fa-solid fa-check"></i> <span id="submitBtnText">Post</span>
                        </button>
                    </div>
                </div>

                <!-- Job Details Row -->
                <div class="job-details-row">
                    <div class="input-group">
                        <label for="locationDropdown">Location</label>
                        <div class="cascading-dropdown" id="locationDropdown">
                            <input type="text" class="dropdown-display" id="locationDisplay"
                                placeholder="Select Province and City..." readonly>
                            <div class="dropdown-menu" id="locationDropdownMenu">
                                <!-- Dynamically populated -->
                            </div>
                        </div>
                        <input type="hidden" id="provinceInput" name="province">
                        <input type="hidden" id="cityInput" name="city">
                        <p class="error-message" id="locationError"></p>
                    </div>
                    <div class="input-group">
                        <label for="workTypeSelect">Type of work</label>
                        <div class="cascading-dropdown" id="workTypeDropdown">
                            <input type="text" class="dropdown-display" id="workTypeDisplay"
                                placeholder="Select work type..." readonly>
                            <div class="dropdown-menu" id="workTypeDropdownMenu">
                                <div class="simple-dropdown-item" data-value="Full-time">Full-time</div>
                                <div class="simple-dropdown-item" data-value="Part-time">Part-time</div>
                                <div class="simple-dropdown-item" data-value="Internship">Internship</div>
                            </div>
                        </div>
                        <input type="hidden" id="workTypeInput" name="workType" required>
                        <p class="error-message" id="workTypeError"></p>
                    </div>
                    <div class="input-group">
                        <label for="applicantLimitInput">Applicant Limit</label>
                        <input type="number" id="applicantLimitInput" name="applicantLimit" placeholder="1/20" min="1"
                            max="99" required>
                        <p class="error-message" id="applicantLimitError"></p>
                    </div>
                </div>

                <!-- Work Tags Section -->
                <div class="work-tags-section">
                    <div class="tags-header">
                        <label>Work Tags</label>
                        <span class="tag-counter" id="tagCounter">Selected: 0/3</span>
                    </div>
                    <div class="category-selector">
                        <select id="categorySelect" name="category">
                            <option value="">Select a category...</option>
                            <!-- Populated by JavaScript -->
                        </select>
                    </div>
                    <div class="tags-container" id="tagsContainer">
                        <p class="tag-placeholder">Please select a category to view available tags</p>
                    </div>
                    <p class="error-message" id="tagsError"></p>
                </div>

                <!-- Required Documents Section -->
                <div class="documents-section">
                    <label>Require Documents</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="checkbox" name="requireResume" id="requireResume">
                            <span class="radio-custom"></span>
                            <span class="radio-text">Resume/ CV</span>
                        </label>
                        <label class="radio-label">
                            <input type="checkbox" name="requireCoverLetter" id="requireCoverLetter">
                            <span class="radio-custom"></span>
                            <span class="radio-text">Cover Letter</span>
                        </label>
                    </div>
                </div>

                <!-- Job Description -->
                <div class="textarea-group">
                    <label for="jobDescriptionTextarea">Job Description</label>
                    <textarea id="jobDescriptionTextarea" name="jobDescription" rows="6"
                        placeholder="Type something here...." required></textarea>
                    <p class="error-message" id="jobDescriptionError"></p>
                </div>

                <!-- Responsibilities -->
                <div class="textarea-group">
                    <label for="responsibilitiesTextarea">Responsibilities</label>
                    <textarea id="responsibilitiesTextarea" name="responsibilities" rows="6"
                        placeholder="Type something here...." required></textarea>
                    <p class="error-message" id="responsibilitiesError"></p>
                </div>

                <!-- Qualification -->
                <div class="textarea-group">
                    <label for="qualificationTextarea">Qualification</label>
                    <textarea id="qualificationTextarea" name="qualification" rows="6"
                        placeholder="Type something here...." required></textarea>
                    <p class="error-message" id="qualificationError"></p>
                </div>

                <!-- Skills -->
                <div class="textarea-group">
                    <label for="skillsTextarea">Skills</label>
                    <textarea id="skillsTextarea" name="skills" rows="6" placeholder="Type something here...."
                        required></textarea>
                    <p class="error-message" id="skillsError"></p>
                </div>
        </div>
        </form>
    </div>
    </div>

    <!-- Hidden Inputs for JS -->
    <input type="hidden" id="company_email" value="<?php echo htmlspecialchars($company_email ?? ''); ?>">
    <input type="hidden" id="company_name" value="<?php echo htmlspecialchars($company_name ?? ''); ?>">

    <!-- Custom Confirmation Modal -->
    <div class="confirmation-modal-overlay" id="confirmationModalOverlay" style="display: none;">
        <div class="confirmation-modal">
            <div class="confirmation-icon-wrapper" id="confirmationIconWrapper">
                <i class="fa-solid fa-triangle-exclamation" id="confirmationIcon"></i>
            </div>
            <h3 class="confirmation-title" id="confirmationTitle">Confirmation</h3>
            <p class="confirmation-message" id="confirmationMessage">Are you sure you want to proceed?</p>
            <div class="confirmation-actions">
                <button class="btn-confirm-cancel" id="btnConfirmCancel">Cancel</button>
                <button class="btn-confirm-proceed" id="btnConfirmProceed">Confirm</button>
            </div>
        </div>
    </div>

    <script src="../../Company Dashboard/js/toast.js"></script>
    <script src="../../Company Dashboard/js/dashboard.js"></script>
    <script src="../js/job_listing.js"></script>
</body>

</html>