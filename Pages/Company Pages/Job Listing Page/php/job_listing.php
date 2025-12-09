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
                <li class="nav-item">
                    <a href="../../Help Page/php/help.php" class="nav-link">
                        <i class="fa-solid fa-circle-info"></i>
                        <span class="link-text">Help</span>
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
                        <div class="user-avatar"></div>
                        <span class="user-name">Juan Dela Cruz</span>
                        <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="#" class="dropdown-item">Sign Out</a>
                    </div>
                </div>
            </header>

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
                            <button class="btn-add-job" id="btnAddJob">
                                <i class="fa-solid fa-plus"></i>
                                Add Job Posting
                            </button>
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
                                        <!-- Views Stat -->
                                        <div class="stat-card-item views">
                                            <div class="stat-icon">
                                                <i class="fa-solid fa-eye"></i>
                                            </div>
                                            <div class="stat-info">
                                                <span class="stat-value" id="viewsCount">0</span>
                                                <span class="stat-label">Views</span>
                                            </div>
                                        </div>

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
                        <label for="locationInput">Location</label>
                        <input type="text" id="locationInput" name="location" placeholder="Location" required>
                        <p class="error-message" id="locationError"></p>
                    </div>
                    <div class="input-group">
                        <label for="workTypeSelect">Type of work</label>
                        <select id="workTypeSelect" name="workType" required>
                            <option value="">Select work type...</option>
                            <!-- Populated by JavaScript -->
                        </select>
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
                            <input type="radio" name="requiredDocument" value="resume" checked>
                            <span class="radio-custom"></span>
                            <span class="radio-text">Resume/ CV</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="requiredDocument" value="cover-letter">
                            <span class="radio-custom"></span>
                            <span class="radio-text">Cover Letter</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="requiredDocument" value="none">
                            <span class="radio-custom"></span>
                            <span class="radio-text">None</span>
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
            </form>
        </div>
    </div>

    <script src="../../Company Dashboard/js/dashboard.js"></script>
    <script src="../js/job_listing.js"></script>
</body>

</html>