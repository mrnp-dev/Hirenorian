// ========================================
// JOB LISTING PAGE - INTERACTIVE FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', async () => {

    // ========================================
    // BACKEND DATA STORAGE
    // ========================================
    let jobPostsData = [];      // Will store: [{id, title, location, datePosted, status, applicantLimit, currentApplicants, jobDescription}, ...]
    let jobDetailsCache = {};   // Will store: {jobId: {full job details object}}
    let applicantsData = [];    // Will store: [{id, jobId, name, course, documentType, documentUrl, dateApplied, status, contactInfo}, ...]
    let acceptedCountsCache = {}; // ✅ FIX: Store accepted counts per job {jobId: acceptedCount}

    // ========================================
    // STATE MANAGEMENT VARIABLES
    // ========================================
    let viewMode = 'cards';             // 'cards' or 'detail'
    let selectedJobId = null;           // Currently selected job post
    let selectedJobForDetail = null;    // Job ID for detail view
    let currentFilter = 'all';          // Applicant filter: 'all', 'pending', 'accepted', 'rejected'
    let searchTerm = '';                // Search term for applicant name/course
    let jobSearchTerm = '';             // Search term for job titles
    let selectedApplicants = new Set(); // Set of selected applicant IDs for batch actions
    let batchMode = false;              // Track if in batch selection mode

    // ========================================
    // BACKEND INTEGRATION - FETCH JOB POSTS
    // ========================================
    // ✅ PERFECTLY IMPLEMENTED!
    // - Correctly gets company email from DOM
    // - Calls your backend endpoint
    // - Maps response data to jobPostsData array
    // - This data is used by renderJobCards() to display job post cards

    // ========================================
    // HELPER: CUSTOM CONFIRMATION MODAL
    // ========================================
    function showConfirmationModal(title, message, type, onConfirm) {
        const overlay = document.getElementById('confirmationModalOverlay');
        const titleEl = document.getElementById('confirmationTitle');
        const messageEl = document.getElementById('confirmationMessage');
        const modalEl = document.querySelector('.confirmation-modal');
        const iconEl = document.getElementById('confirmationIcon');
        const btnCancel = document.getElementById('btnConfirmCancel');
        const btnProceed = document.getElementById('btnConfirmProceed');

        if (!overlay) return;

        // Reset state
        modalEl.classList.remove('danger');

        // Remove old event listeners by cloning
        const newBtnProceed = btnProceed.cloneNode(true);
        btnProceed.parentNode.replaceChild(newBtnProceed, btnProceed);

        const newBtnCancel = btnCancel.cloneNode(true);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        // Set content
        titleEl.textContent = title;
        messageEl.innerHTML = message.replace(/\n/g, '<br>');

        // Handle type
        if (type === 'danger') {
            modalEl.classList.add('danger');
            iconEl.className = 'fa-solid fa-trash-can';
        } else {
            iconEl.className = 'fa-solid fa-triangle-exclamation';
        }

        // Show modal
        overlay.style.display = 'flex';

        // Handlers
        const close = () => { overlay.style.display = 'none'; };

        newBtnCancel.addEventListener('click', close);
        newBtnProceed.addEventListener('click', () => {
            close();
            onConfirm();
        });
    }

    async function fetchJobPosts() {
        try {
            // ✅ Get company email from session/context or DOM
            const companyEmail = document.getElementById("company_email").value;

            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_job_posts.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ company_email: companyEmail })
            });

            const result = await response.json();

            if (result.status === "success") {
                // ✅ Map API response directly into jobPostsData
                jobPostsData = result.data.map(job => ({
                    id: job.id,
                    title: job.title,
                    location: job.location,
                    datePosted: job.datePosted,
                    datePosted: job.datePosted,
                    status: job.status, // Ensure status is mapped correctly
                    applicantLimit: job.applicantLimit,
                    currentApplicants: job.currentApplicants,
                    jobDescription: job.jobDescription,
                    companyIcon: job.companyIcon // Map company icon
                }));
                return jobPostsData;
            } else {
                console.error("Failed to fetch job posts:", result.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching job posts:", error);
            return [];
        }
    }

    // ========================================
    // BACKEND INTEGRATION - FETCH JOB DETAILS
    // ========================================
    // ✅ PERFECTLY IMPLEMENTED!
    // - Includes caching to avoid repeated fetches
    // - Calls your backend endpoint with job_id
    // - Returns full job details for the detail view
    async function fetchJobDetails(jobId, forceRefresh = false) {
        // Check cache first (unless forced)
        if (!forceRefresh && jobDetailsCache[jobId]) {
            return jobDetailsCache[jobId];
        }

        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_job_details.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ job_id: jobId })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Cache the details
                jobDetailsCache[jobId] = result.data;
                return result.data;
            } else {
                console.error("Failed to fetch job details:", result.message);
                return null;
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
            return null;
        }
    }

    // ========================================
    // BACKEND INTEGRATION - FETCH APPLICANTS
    // ========================================
    // ✅ FIXED! Your PHP already returns the correct structure, so no need to remap
    async function fetchApplicants(jobId) {
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_applicants.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ job_id: jobId })
            });

            const result = await response.json();

            if (result.status === "success") {
                // ✅ Your PHP already returns the correct structure with nested contactInfo
                // So we can use it directly without remapping
                applicantsData = result.data;

                // ✅ FIX: Also update the accepted count cache
                const acceptedCount = result.data.filter(a => a.status === 'accepted').length;
                acceptedCountsCache[jobId] = acceptedCount;

                return applicantsData;
            } else {
                console.error("Failed to fetch applicants:", result.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching applicants:", error);
            return [];
        }
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    /**
     * Gets the company ID from session/context
     * ✅ PERFECTLY IMPLEMENTED!
     * - Uses backend API to get company_id from PHP session
     * - Properly handles async/await
     */
    async function getCompanyId() {
        try {
            // Try to get email from hidden input if available
            const companyEmailInput = document.getElementById('company_email');
            const companyEmail = companyEmailInput ? companyEmailInput.value : '';

            // Fetch company_id using backend API
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/get_company_id.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ company_email: companyEmail })
            });

            const result = await response.json();

            if (result.status === "success") {
                return result.company_id;
            } else {
                throw new Error("Failed to get company ID: " + result.message);
            }
        } catch (error) {
            console.error("Error fetching company ID:", error);
            return null;
        }
    }

    /**
     * Format document requirements for display
     * Converts boolean resume/coverLetter values to readable string
     */
    function formatDocumentRequirements(resume, coverLetter) {
        if (!resume && !coverLetter) return 'None';
        if (resume && coverLetter) return 'Resume & Cover Letter';
        if (resume) return 'Resume';
        if (coverLetter) return 'Cover Letter';
        return 'None';
    }

    /**
     * Format document cell for applicant list
     * Shows resume/cover letter with View links in stacked format when both exist
     */
    function formatDocumentCell(resumeUrl, coverLetterUrl) {
        const hasResume = resumeUrl && resumeUrl !== '';
        const hasCoverLetter = coverLetterUrl && coverLetterUrl !== '';

        if (!hasResume && !hasCoverLetter) {
            return '<span class="doc-label">None</span>';
        }

        if (hasResume && hasCoverLetter) {
            // Stacked format for both documents
            return `
    < div class="doc-stack" >
                    <div class="doc-item">
                        <span class="doc-label">Resume</span>
                        <a href="${resumeUrl}" class="doc-view-link" target="_blank">View</a>
                    </div>
                    <div class="doc-item">
                        <span class="doc-label">Cover Letter</span>
                        <a href="${coverLetterUrl}" class="doc-view-link" target="_blank">View</a>
                    </div>
                </div >
    `;
        }

        if (hasResume) {
            return `
    < span class="doc-label" > Resume</span >
        <a href="${resumeUrl}" class="doc-view-link" target="_blank">View</a>
`;
        }

        return `
    < span class="doc-label" > Cover Letter</span >
        <a href="${coverLetterUrl}" class="doc-view-link" target="_blank">View</a>
`;
    }

    /**
     * Gets applicants for a specific job from the loaded data
     */
    function getApplicantsForJob(jobId) {
        if (!jobId) return [];
        return applicantsData.filter(a => a.jobId === jobId);
    }

    /**
     * Fetches applicants for ALL jobs at once and caches accepted counts
     * Called during initialization to pre-load all applicant data
     * ✅ This fixes the bug where accepted counts show 0 until detail view is opened
     */
    async function fetchAllApplicants() {
        try {
            // Fetch applicants for each job and calculate accepted counts
            const fetchPromises = jobPostsData.map(async (job) => {
                const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/fetch_applicants.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ job_id: job.id })
                });

                const result = await response.json();

                if (result.status === "success") {
                    // Count accepted applicants for this job
                    const acceptedCount = result.data.filter(a => a.status === 'accepted').length;
                    // Store in cache
                    acceptedCountsCache[job.id] = acceptedCount;
                }
            });

            // Wait for all fetches to complete
            await Promise.all(fetchPromises);

            console.log(`✅ Pre - loaded accepted counts for ${jobPostsData.length} jobs: `, acceptedCountsCache);
        } catch (error) {
            console.error('Error pre-loading applicants:', error);
        }
    }

    // ========================================
    // INITIALIZATION - LOAD DATA
    // ========================================
    try {
        // Load initial data
        await fetchJobPosts();

        // ✅ FIX: Pre-load all applicants data so counts show correctly from the start
        await fetchAllApplicants();

        // Restore saved state or show card view
        loadState();

        // CHECK URL PARAMS for direct link (Overrides saved state)
        const urlParams = new URLSearchParams(window.location.search);
        const urlJobId = urlParams.get('post_id');

        if (urlJobId) {
            // Find job in loaded data
            const jobExists = jobPostsData.find(j => j.id == urlJobId);
            if (jobExists) {
                showDetailView(jobExists.id);
            } else {
                showCardView(); // Fallback
            }
        } else {
            // If no saved state or URL param, show card view by default
            if (viewMode === 'cards') {
                showCardView();
            } else if (viewMode === 'detail' && selectedJobForDetail) {
                // Try to restore detail view from session
                showDetailView(selectedJobForDetail);
            }
        }
    } catch (error) {
        console.error('Failed to initialize job listing:', error);
        // Show error state to user
    }


    // ========================================
    // STATE PERSISTENCE
    // ========================================
    function saveState() {
        const state = {
            viewMode,
            selectedJobId: selectedJobForDetail || selectedJobId,
            currentFilter,
            searchTerm,
            jobSearchTerm
        };
        sessionStorage.setItem('jobListingState', JSON.stringify(state));
    }

    function loadState() {
        const savedState = sessionStorage.getItem('jobListingState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);

                // Load view mode
                if (state.viewMode) viewMode = state.viewMode;

                // Validate if job ID still exists in our current data
                if (state.selectedJobId) {
                    const jobExists = jobPostsData.some(j => j.id === state.selectedJobId);
                    if (jobExists) {
                        selectedJobId = state.selectedJobId;
                        selectedJobForDetail = state.selectedJobId;
                    }
                }

                if (state.currentFilter) currentFilter = state.currentFilter;
                if (state.searchTerm !== undefined) searchTerm = state.searchTerm;
                if (state.jobSearchTerm !== undefined) jobSearchTerm = state.jobSearchTerm;

                // Sync UI elements
                const jobSearchInput = document.getElementById('jobSearchInput');
                if (jobSearchInput && jobSearchTerm) jobSearchInput.value = jobSearchTerm;

                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = searchTerm;

                const filterPills = document.querySelectorAll('.filter-pill');
                if (filterPills) {
                    filterPills.forEach(pill => {
                        if (pill.dataset.status === currentFilter) {
                            pill.classList.add('active');
                        } else {
                            pill.classList.remove('active');
                        }
                    });
                }

                // Restore view based on state
                if (viewMode === 'detail' && selectedJobForDetail) {
                    showDetailView(selectedJobForDetail);
                } else {
                    showCardView();
                }
            } catch (e) {
                console.error("Error loading state:", e);
                sessionStorage.removeItem('jobListingState');
            }
        }
    }

    // ========================================
    // CARD VIEW FUNCTIONS
    // ========================================
    function renderJobCards(searchQuery = '') {
        const jobCardsGrid = document.getElementById('jobCardsGrid');
        const noJobsState = document.getElementById('noJobsState');
        // ✅ Get company name from hidden input
        const companyName = document.getElementById('company_name')?.value || 'Company Name';

        if (!jobCardsGrid) return;

        const filteredJobs = searchQuery
            ? jobPostsData.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : jobPostsData;

        if (filteredJobs.length === 0) {
            jobCardsGrid.style.display = 'none';
            noJobsState.style.display = 'block';
            return;
        }

        jobCardsGrid.style.display = 'grid';
        noJobsState.style.display = 'none';

        jobCardsGrid.innerHTML = filteredJobs.map(job => {
            // ✅ FIX: Use cached accepted count instead of calculating from applicantsData
            const acceptedCount = acceptedCountsCache[job.id] || 0;

            // Default Icon Logic
            let iconUrl = job.companyIcon;
            let isDefault = false;

            if (!iconUrl || iconUrl === 'https://via.placeholder.com/40') {
                iconUrl = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
                isDefault = true;
            }

            return `
    < div class="job-card" data - job - id="${job.id}" >
                    <div class="job-card-header">
                        <img src="${iconUrl}" alt="Company Logo" class="card-company-icon ${isDefault ? 'default-icon' : ''}">
                        <span class="card-company-name">${companyName}</span>
                    </div>
                    <h3 class="job-card-title">${job.title}</h3>
                    <div class="job-card-meta">
                        <div class="card-meta-item">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${job.location}</span>
                        </div>
                    </div>
                    <div class="card-applicant-status">${acceptedCount}/${job.applicantLimit}</div>
                    <p class="job-card-description">${job.jobDescription}</p>
                </div >
    `;
        }).join('');

        // Add click handlers to cards
        document.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', () => {
                const jobId = parseInt(card.dataset.jobId);
                showDetailView(jobId);
            });
        });
    }

    function showCardView() {
        viewMode = 'cards';
        const cardViewContainer = document.getElementById('card-view-container');
        const detailViewContainer = document.getElementById('detail-view-container');

        if (cardViewContainer) cardViewContainer.style.display = 'block';
        if (detailViewContainer) detailViewContainer.style.display = 'none';

        renderJobCards(jobSearchTerm);
        saveState();
    }

    // ========================================
    // DETAIL VIEW FUNCTIONS
    // ========================================
    /**
     * Shows detail view for a specific job
     * ✅ BACKEND INTEGRATED - Fetches job details and applicants from server
     */
    async function showDetailView(jobId) {
        viewMode = 'detail';
        selectedJobForDetail = jobId;
        selectedJobId = jobId;

        const cardViewContainer = document.getElementById('card-view-container');
        const detailViewContainer = document.getElementById('detail-view-container');

        if (cardViewContainer) cardViewContainer.style.display = 'none';
        if (detailViewContainer) detailViewContainer.style.display = 'block';

        // ✅ BACKEND: Fetch job details and applicants
        await renderJobDetail(jobId);
        await fetchApplicants(jobId);

        updateStatistics(jobId);
        renderApplicants();
        saveState();
    }

    /**
     * Renders job detail information in the detail view
     * ✅ BACKEND INTEGRATED - Uses fetchJobDetails() to get data from server
     */
    async function renderJobDetail(jobId) {
        // ✅ BACKEND: Fetch job details from server (uses cache if available)
        const jobDetails = await fetchJobDetails(jobId);

        if (!jobDetails) {
            console.error('Failed to load job details for job ID:', jobId);
            if (typeof ToastSystem !== 'undefined') {
                ToastSystem.show('Failed to load job details. Please try again.', 'error');
            } else {
                alert('Failed to load job details. Please try again.');
            }
            return;
        }

        // Update company badge
        const detailIcon = document.getElementById('detailCompanyIcon');
        let detailIconUrl = jobDetails.companyIcon;

        if (!detailIconUrl || detailIconUrl === 'https://via.placeholder.com/40') {
            detailIconUrl = "https://img.icons8.com/?size=100&id=85050&format=png&color=FF0000";
            detailIcon.classList.add('default-icon');
        } else {
            detailIcon.classList.remove('default-icon');
        }

        detailIcon.src = detailIconUrl;
        document.getElementById('detailCompanyName').textContent = jobDetails.companyName;

        // Update job title
        document.getElementById('detailJobTitle').textContent = jobDetails.jobTitle;

        // Update meta information
        const locationText = jobDetails.province && jobDetails.city
            ? `${jobDetails.province}, ${jobDetails.city} `
            : (jobDetails.location || 'N/A');
        document.getElementById('detailLocation').textContent = locationText;
        document.getElementById('detailWorkType').textContent = jobDetails.workType;
        // ✅ FIX: Use cached accepted count instead of calculating from applicantsData
        const acceptedApplicants = acceptedCountsCache[jobId] || 0;
        document.getElementById('detailApplicantLimit').textContent = `${acceptedApplicants}/${jobDetails.applicantLimit} Applicants`;

        // ✅ HANDLE BUTTON VISIBILITY BASED ON STATUS
        const btnEdit = document.getElementById('btnEditDetail');
        const btnClose = document.getElementById('btnCloseDetail');
        const btnDelete = document.getElementById('btnDeleteDetail');

        // Normalize status check (backend might send 'Active'/'active')
        const isClosed = (jobDetails.status || '').toLowerCase() === 'closed';

        if (isClosed) {
            // If closed: Hide Edit/Close, Show Delete
            if (btnEdit) btnEdit.style.display = 'none';
            if (btnClose) btnClose.style.display = 'none';
            if (btnDelete) btnDelete.style.display = 'flex'; // Use flex to maintain alignment
        } else {
            // If active: Show Edit/Close, Hide Delete
            if (btnEdit) btnEdit.style.display = 'flex';
            if (btnClose) btnClose.style.display = 'flex';
            if (btnDelete) btnDelete.style.display = 'none';
        }


        // Format and display required documents
        const detailRequiredDoc = document.getElementById('detailRequiredDoc');
        if (detailRequiredDoc) {
            detailRequiredDoc.textContent = formatDocumentRequirements(
                jobDetails.resume,
                jobDetails.coverLetter
            );
        }

        // Update work tags
        const tagsContainer = document.getElementById('detailWorkTags');
        tagsContainer.innerHTML = jobDetails.workTags.map(tag =>
            `<span class="detail-tag">${tag}</span>`
        ).join('');

        // Update job sections
        // ✅ FIX: Changed from 'qualification' (singular) to 'qualifications' (plural)
        document.getElementById('detailJobDescription').textContent = jobDetails.jobDescription;
        document.getElementById('detailResponsibilities').textContent = jobDetails.responsibilities;
        document.getElementById('detailQualifications').textContent = jobDetails.qualifications;
        document.getElementById('detailSkills').textContent = jobDetails.skills;
    }

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const jobTitleSelect = document.getElementById('jobTitleSelect');
    const searchInput = document.getElementById('searchInput');
    const filterPills = document.querySelectorAll('.filter-pill');
    const applicantsList = document.getElementById('applicantsList');
    const emptyState = document.getElementById('emptyState');
    const selectAllCheckbox = document.getElementById('selectAll');

    // Statistics elements
    const statisticsSidebar = document.querySelector('.statistics-sidebar');
    const viewsCountEl = document.getElementById('viewsCount');
    const totalCountEl = document.getElementById('totalCount');
    const pendingCountEl = document.getElementById('pendingCount');
    const acceptedCountEl = document.getElementById('acceptedCount');
    const rejectedCountEl = document.getElementById('rejectedCount');

    // Toolbar elements
    const regularToolbar = document.querySelector('.action-buttons');
    const batchActionsToolbar = document.getElementById('batchActionsToolbar');
    const selectedCountEl = document.getElementById('selectedCount');


    // ========================================
    // BATCH ACTIONS & SELECTION LOGIC
    // ========================================

    // Handle Individual Checkbox Toggle
    if (applicantsList) {
        applicantsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('applicant-checkbox')) {
                const applicantId = e.target.dataset.id;
                if (e.target.checked) {
                    selectedApplicants.add(applicantId);
                } else {
                    selectedApplicants.delete(applicantId);
                }
                updateBatchUI();
            }
        });
    }

    // Handle Select All Toggle
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const visibleCheckboxes = document.querySelectorAll('.applicant-checkbox');

            visibleCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const applicantId = checkbox.dataset.id;
                if (isChecked) {
                    selectedApplicants.add(applicantId);
                } else {
                    selectedApplicants.delete(applicantId);
                }
            });
            updateBatchUI();
        });
    }

    // Update UI based on selection
    function updateBatchUI() {
        const count = selectedApplicants.size;

        // Update Select All state
        const visibleCheckboxes = document.querySelectorAll('.applicant-checkbox');
        const allChecked = visibleCheckboxes.length > 0 && Array.from(visibleCheckboxes).every(cb => cb.checked);
        const someChecked = visibleCheckboxes.length > 0 && Array.from(visibleCheckboxes).some(cb => cb.checked);

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
        }

        // Show/Hide Toolbar
        if (count > 0) {
            if (batchActionsToolbar) batchActionsToolbar.style.display = 'flex';
            if (selectedCountEl) selectedCountEl.textContent = `${count} selected`;
        } else {
            if (batchActionsToolbar) batchActionsToolbar.style.display = 'none';
        }
    }

    // Batch Accept Button
    if (batchActionsToolbar) {
        // Use event delegation or check if buttons exist
        const acceptBtn = document.getElementById('batchAcceptBtn');
        const rejectBtn = document.getElementById('batchRejectBtn');
        const cancelBtn = document.getElementById('batchCancelBtn');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                showConfirmationModal(
                    'Accept Applicants',
                    `Are you sure you want to accept ${selectedApplicants.size} applicant(s)?\nThis will update their status to Accepted.`,
                    'normal',
                    () => performBatchUpdate('accepted')
                );
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                showConfirmationModal(
                    'Reject Applicants',
                    `Are you sure you want to reject ${selectedApplicants.size} applicant(s)?\nThis action cannot be easily undone.`,
                    'danger',
                    () => performBatchUpdate('rejected')
                );
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                selectedApplicants.clear();
                const visibleCheckboxes = document.querySelectorAll('.applicant-checkbox');
                visibleCheckboxes.forEach(cb => cb.checked = false);
                updateBatchUI();
            });
        }
    }

    // ========================================
    // ACTION HANDLERS (SINGLE & BATCH)
    // ========================================

    // Event Delegation for Single Actions
    applicantsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-accept')) {
            const id = e.target.dataset.id;
            const applicant = applicantsData.find(a => a.id == id);
            showConfirmationModal(
                'Accept Applicant',
                `Accept application for <strong>${applicant ? applicant.name : 'this applicant'}</strong>?`,
                'normal',
                () => performSingleUpdate(id, 'accepted')
            );
        } else if (e.target.classList.contains('btn-reject')) {
            const id = e.target.dataset.id;
            const applicant = applicantsData.find(a => a.id == id);
            showConfirmationModal(
                'Reject Applicant',
                `Reject application for <strong>${applicant ? applicant.name : 'this applicant'}</strong>?`,
                'danger',
                () => performSingleUpdate(id, 'rejected')
            );
        }
    });

    // Perform Single Update
    async function performSingleUpdate(applicantId, status) {
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/update_applicant_status.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicant_id: applicantId, status: status })
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show(`Applicant ${status} successfully!`, 'success');
                }
                // Refresh data
                await fetchApplicants(selectedJobId);
                fetchJobDetails(selectedJobId, true); // Refresh metrics
                updateStatistics();
                renderApplicants();
            } else {
                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show(result.message || 'Update failed', 'error');
                } else {
                    alert(result.message || 'Update failed');
                }
            }
        } catch (error) {
            console.error('Update error:', error);
            if (typeof ToastSystem !== 'undefined') {
                ToastSystem.show('An error occurred. Please try again.', 'error');
            }
        }
    }

    // Perform Batch Update
    async function performBatchUpdate(status) {
        const ids = Array.from(selectedApplicants);
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/batch_update_applicants.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicant_ids: ids, status: status })
            });

            const result = await response.json();

            if (result.status === 'success') {
                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show(`Batch update complete! ${result.updated_count} applicants updated.`, 'success');
                }

                // Clear selection
                selectedApplicants.clear();
                updateBatchUI();

                // Refresh data
                await fetchApplicants(selectedJobId);
                fetchJobDetails(selectedJobId, true); // Refresh metrics
                updateStatistics();
                renderApplicants();
            } else {
                if (typeof ToastSystem !== 'undefined') {
                    ToastSystem.show(result.message || 'Batch update failed', 'error');
                } else {
                    alert(result.message || 'Batch update failed');
                }
            }
        } catch (error) {
            console.error('Batch update error:', error);
            if (typeof ToastSystem !== 'undefined') {
                ToastSystem.show('An error occurred during batch update.', 'error');
            }
        }
    }


    // ========================================

    // STATISTICS CALCULATION & UPDATE
    // ========================================
    function getApplicantsForJob(jobId) {
        if (!jobId) return [];
        return applicantsData.filter(a => a.jobId === jobId);
    }

    function calculateJobStatistics(jobId) {
        if (!jobId) {
            return { views: 0, total: 0, pending: 0, accepted: 0, rejected: 0 };
        }

        const job = jobPostsData.find(j => j.id === jobId);
        const jobApplicants = getApplicantsForJob(jobId);

        const accepted = jobApplicants.filter(a => a.status === 'accepted').length;
        const rejected = jobApplicants.filter(a => a.status === 'rejected').length;
        const pending = jobApplicants.filter(a => a.status === 'pending').length;
        const total = jobApplicants.length;
        const views = job ? job.views : 0;

        return { views, total, pending, accepted, rejected };
    }

    function updateStatistics() {
        const stats = calculateJobStatistics(selectedJobId);

        if (viewsCountEl) viewsCountEl.textContent = stats.views;
        if (totalCountEl) totalCountEl.textContent = stats.total;
        if (pendingCountEl) pendingCountEl.textContent = stats.pending;
        if (acceptedCountEl) acceptedCountEl.textContent = stats.accepted;
        if (rejectedCountEl) rejectedCountEl.textContent = stats.rejected;
    }

    // ========================================
    // RENDER APPLICANTS
    // ========================================
    function renderApplicants(data = null) {
        // If no data provided, get filtered data based on current filter
        const applicantsToRender = data || getFilteredData();

        applicantsList.innerHTML = '';

        if (applicantsToRender.length === 0) {
            emptyState.style.display = 'block';

            // Show context-aware empty state message
            if (!selectedJobId) {
                // No job selected
                emptyState.innerHTML = `
                    <i class="fa-solid fa-briefcase"></i>
                    <h3>No Job Selected</h3>
                    <p>Please select a job title from the dropdown above to view applicants</p>
                `;
            } else {
                // Job is selected but no applicants match the current filter/search
                let message = '';
                let icon = 'fa-inbox';

                if (searchTerm) {
                    message = `No applicants found matching "${searchTerm}"`;
                } else if (currentFilter === 'pending') {
                    message = 'No pending applicants yet';
                    icon = 'fa-clock';
                } else if (currentFilter === 'accepted') {
                    message = 'No accepted applicants yet';
                    icon = 'fa-check-circle';
                } else if (currentFilter === 'rejected') {
                    message = 'No rejected applicants yet';
                    icon = 'fa-times-circle';
                } else {
                    message = 'No applicants have applied yet';
                }

                emptyState.innerHTML = `
                    <i class="fa-solid ${icon}"></i>
                    <h3>${message}</h3>
                    <p>Check back later or try adjusting your filters</p>
                `;
            }
            return;
        }

        emptyState.style.display = 'none';

        applicantsToRender.forEach(applicant => {
            const card = createApplicantCard(applicant);
            applicantsList.appendChild(card);
        });
    }

    // ========================================
    // CREATE APPLICANT CARD
    // ========================================
    function createApplicantCard(applicant) {
        const card = document.createElement('div');
        card.className = 'applicant-card';
        card.dataset.id = applicant.id;

        // Get initials for avatar
        const initials = applicant.name.split(' ').map(n => n[0]).join('').substring(0, 2);

        // Only show checkbox for pending applicants
        const showCheckbox = applicant.status === 'pending';

        card.innerHTML = `
            <div class="applicant-row">
                <div class="cell checkbox-cell">
                    ${showCheckbox ? `<input type="checkbox" class="applicant-checkbox" data-id="${applicant.id}" ${selectedApplicants.has(String(applicant.id)) ? 'checked' : ''}>` : ''}
                </div>
                <div class="cell name-cell">
                    <div class="applicant-avatar">${initials}</div>
                    <a href="../../Applicant's Profile Page/php/applicant_profile.php?id=${applicant.id}" class="applicant-name-link" style="text-decoration:none; color:inherit; font-weight:600;">${applicant.name}</a>
                </div>
                <div class="cell course-cell">${applicant.course}</div>
       <div class="cell document-cell">
                    ${formatDocumentCell(applicant.resumeUrl, applicant.coverLetterUrl)}
                </div>
                <div class="cell date-cell">${applicant.dateApplied}</div>
                <div class="cell actions-cell">
                    ${applicant.status === 'pending' ? `
                        <button class="action-btn btn-accept" data-id="${applicant.id}">Accept</button>
                        <button class="action-btn btn-reject" data-id="${applicant.id}">Reject</button>
                    ` : `
                        <span class="status-badge ${applicant.status}">${applicant.status}</span>
                    `}
                </div>
            </div>
            <div class="contact-details">
                <h4>Contact Information</h4>
                <div class="contact-info-grid">
                    <div class="contact-item">
                        <span class="contact-label">Personal Email</span>
                        <span class="contact-value">${applicant.contactInfo.personalEmail}</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-label">Student Email</span>
                        <span class="contact-value">${applicant.contactInfo.studentEmail}</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-label">Phone Number</span>
                        <span class="contact-value">${applicant.contactInfo.phone}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click event for row expansion
        const row = card.querySelector('.applicant-row');
        row.addEventListener('click', (e) => {
            // Don't expand if clicking on checkbox or action buttons
            if (e.target.closest('.checkbox-cell') || e.target.closest('.action-btn') || e.target.closest('.applicant-checkbox')) {
                return;
            }
            card.classList.toggle('expanded');
        });


        return card;
    }

    // ========================================
    // FILTER & SEARCH
    // ========================================
    function getFilteredData() {
        // Start with applicants for the selected job
        let filtered = selectedJobId ? getApplicantsForJob(selectedJobId) : [];

        // Apply status filter
        if (currentFilter !== 'all') {
            filtered = filtered.filter(a => a.status === currentFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                a.name.toLowerCase().includes(term) ||
                a.course.toLowerCase().includes(term)
            );
        }

        return filtered;
    }

    function updateDisplay() {
        const isJobSelected = !!selectedJobId;

        // Always show the statistics sidebar and applicants container structure
        if (statisticsSidebar) statisticsSidebar.style.display = 'block';
        const applicantsContainer = document.querySelector('.applicants-container');
        if (applicantsContainer) applicantsContainer.style.display = 'block';

        if (!isJobSelected) {
            //  Set all statistics to 0 when no job is selected
            if (viewsCountEl) viewsCountEl.textContent = '0';
            if (totalCountEl) totalCountEl.textContent = '0';
            if (pendingCountEl) pendingCountEl.textContent = '0';
            if (acceptedCountEl) acceptedCountEl.textContent = '0';
            if (rejectedCountEl) rejectedCountEl.textContent = '0';

            // Show empty state message in the list area
            if (applicantsList) applicantsList.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <i class="fa-solid fa-briefcase"></i>
                    <h3>No Job Selected</h3>
                    <p>Please select a job title from the dropdown above to view applicants</p>
                `;
            }
        } else {
            // Job is selected, populate with real data
            if (emptyState) emptyState.style.display = 'none';
            const filteredData = getFilteredData();
            renderApplicants(filteredData);
            updateStatistics();
        }
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ======================================== 
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            saveState();
            updateDisplay();
        });
    }

    // ========================================
    // FILTER PILLS FUNCTIONALITY
    // ========================================
    if (filterPills) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // Update filter
                currentFilter = pill.dataset.status;

                // Update display
                saveState();
                updateDisplay();
            });
        });
    }

    // ========================================
    // CHECKBOX FUNCTIONALITY
    // ========================================
    function handleCheckboxChange(id, checked) {
        if (checked) {
            selectedApplicants.add(id);
        } else {
            selectedApplicants.delete(id);
        }
        updateSelectAllCheckbox();
        toggleBatchMode();
    }

    function updateSelectAllCheckbox() {
        const visibleCheckboxes = document.querySelectorAll('.applicant-checkbox');
        const checkedCount = Array.from(visibleCheckboxes).filter(cb => cb.checked).length;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
        }
    }

    function toggleBatchMode() {
        const hasSelection = selectedApplicants.size > 0;
        batchMode = hasSelection;

        if (batchActionsToolbar && regularToolbar) {
            if (hasSelection) {
                regularToolbar.style.display = 'none';
                batchActionsToolbar.style.display = 'flex';
                if (selectedCountEl) {
                    selectedCountEl.textContent = `${selectedApplicants.size} selected`;
                }
            } else {
                regularToolbar.style.display = 'flex';
                batchActionsToolbar.style.display = 'none';
            }
        }
    }

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checked = e.target.checked;
            document.querySelectorAll('.applicant-checkbox').forEach(cb => {
                cb.checked = checked;
                const id = parseInt(cb.dataset.id);
                if (checked) {
                    selectedApplicants.add(id);
                } else {
                    selectedApplicants.delete(id);
                }
            });
            toggleBatchMode();
        });
    }

    // ========================================
    // ACCEPT/REJECT ACTIONS
    // ========================================
    async function acceptApplicant(id) {
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/update_applicant_status.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ applicant_id: id, status: "accepted" })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Update local data
                const applicant = applicantsData.find(a => a.id === id);
                if (applicant) {
                    applicant.status = 'accepted';
                }

                // Update cache
                if (selectedJobForDetail) {
                    acceptedCountsCache[selectedJobForDetail] = result.accepted_count;
                    // ✅ FIX: Update the detail view header count immediately
                    const detailApplicantLimit = document.getElementById('detailApplicantLimit');
                    if (detailApplicantLimit && selectedJobForDetail) {
                        const job = jobPostsData.find(j => j.id === selectedJobForDetail);
                        if (job) {
                            detailApplicantLimit.textContent = `${result.accepted_count}/${job.applicantLimit} Applicants`;
                        }
                    }
                }

                // If job was closed, update job status
                if (result.job_closed) {
                    const job = jobPostsData.find(j => j.id === selectedJobForDetail);
                    if (job) job.status = 'closed';
                    alert(`Job post has been automatically closed (${result.accepted_count}/${result.applicant_limit} applicants accepted)`);
                }

                updateDisplay();
            } else if (result.code === "LIMIT_REACHED") {
                alert(result.message);
            } else {
                alert("Failed to accept applicant: " + result.message);
            }
        } catch (error) {
            console.error("Error accepting applicant:", error);
            alert("Network error. Please try again.");
        }
    }

    async function rejectApplicant(id) {
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/update_applicant_status.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ applicant_id: id, status: "rejected" })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Update local data
                const applicant = applicantsData.find(a => a.id === id);
                if (applicant) {
                    applicant.status = 'rejected';
                }

                // Update cache (rejecting decreases accepted count if previously accepted)
                if (selectedJobForDetail) {
                    acceptedCountsCache[selectedJobForDetail] = result.accepted_count;
                    // ✅ FIX: Update the detail view header count immediately
                    const detailApplicantLimit = document.getElementById('detailApplicantLimit');
                    if (detailApplicantLimit && selectedJobForDetail) {
                        const job = jobPostsData.find(j => j.id === selectedJobForDetail);
                        if (job) {
                            detailApplicantLimit.textContent = `${result.accepted_count}/${job.applicantLimit} Applicants`;
                        }
                    }
                }

                updateDisplay();
            } else {
                alert("Failed to reject applicant: " + result.message);
            }
        } catch (error) {
            console.error("Error rejecting applicant:", error);
            alert("Network error. Please try again.");
        }
    }

    // Batch operations
    async function acceptSelectedApplicants() {
        const ids = Array.from(selectedApplicants);
        if (ids.length === 0) return;

        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/batch_update_applicants.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ applicant_ids: ids, status: "accepted" })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Update local data
                ids.forEach(id => {
                    const applicant = applicantsData.find(a => a.id === id);
                    if (applicant) {
                        applicant.status = 'accepted';
                    }
                });

                // Refresh accepted counts for all affected jobs
                if (selectedJobForDetail) {
                    await fetchApplicants(selectedJobForDetail);
                }

                // Notify if jobs were closed
                if (result.closed_jobs && result.closed_jobs.length > 0) {
                    alert(`${result.updated_count} applicant(s) accepted. ${result.closed_jobs.length} job post(s) automatically closed due to reaching limit.`);
                    // Update job statuses
                    result.closed_jobs.forEach(jobId => {
                        const job = jobPostsData.find(j => j.id === jobId);
                        if (job) job.status = 'closed';
                    });
                } else {
                    alert(`${result.updated_count} applicant(s) accepted successfully.`);
                }

                clearSelection();
                updateDisplay();
            } else if (result.code === "LIMIT_REACHED") {
                alert(result.message);
            } else {
                alert("Failed to accept applicants: " + result.message);
            }
        } catch (error) {
            console.error("Error accepting applicants:", error);
            alert("Network error. Please try again.");
        }
    }

    async function rejectSelectedApplicants() {
        const ids = Array.from(selectedApplicants);
        if (ids.length === 0) return;

        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/batch_update_applicants.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ applicant_ids: ids, status: "rejected" })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Update local data
                ids.forEach(id => {
                    const applicant = applicantsData.find(a => a.id === id);
                    if (applicant) {
                        applicant.status = 'rejected';
                    }
                });

                // Refresh accepted counts
                if (selectedJobForDetail) {
                    await fetchApplicants(selectedJobForDetail);
                }

                alert(`${result.updated_count} applicant(s) rejected successfully.`);
                clearSelection();
                updateDisplay();
            } else {
                alert("Failed to reject applicants: " + result.message);
            }
        } catch (error) {
            console.error("Error rejecting applicants:", error);
            alert("Network error. Please try again.");
        }
    }

    function clearSelection() {
        selectedApplicants.clear();
        document.querySelectorAll('.applicant-checkbox').forEach(cb => cb.checked = false);
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        toggleBatchMode();
    }

    // ========================================
    // JOB DROPDOWN FUNCTIONALITY
    // ========================================
    function populateJobDropdown() {
        if (!jobTitleSelect) return;

        // Clear existing options
        jobTitleSelect.innerHTML = '<option value="">Select a job post...</option>';

        if (jobPostsData.length === 0) {
            jobTitleSelect.innerHTML = '<option value="">You don\'t post any job title yet.</option>';
            jobTitleSelect.disabled = true;
            return;
        }

        // Populate with job posts
        jobPostsData.forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.title;
            jobTitleSelect.appendChild(option);
        });

        jobTitleSelect.disabled = false;
    }

    if (jobTitleSelect) {
        jobTitleSelect.addEventListener('change', (e) => {
            selectedJobId = e.target.value ? parseInt(e.target.value) : null;
            clearSelection(); // Clear any selections when changing jobs
            saveState();
            updateDisplay();
        });
    }

    // ========================================
    // ACTION BUTTONS
    // ========================================
    const btnAdd = document.getElementById('btnAdd');
    const btnClose = document.getElementById('btnClose');
    const btnEdit = document.getElementById('btnEdit');

    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            openJobPostModal();
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            // TODO: Show confirmation modal for closing job and rejecting pending applicants
            console.log('Close button clicked - Confirmation modal to be implemented');
        });
    }

    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            const selectedJobId = jobTitleSelect.value;

            if (!selectedJobId) {
                alert('Please select a job post to edit');
                return;
            }

            // Get the selected job post data
            const selectedJob = jobPostsData.find(job => job.id.toString() === selectedJobId);

            if (!selectedJob) {
                console.error('Job not found');
                return;
            }

            // Create mock data for edit (using actual job title from dropdown)
            // For testing, using random values for other fields as requested
            const mockJobData = {
                jobId: selectedJob.id,
                jobTitle: selectedJob.title, // Actual job title from dropdown
                location: "Manila, Philippines", // Mock data
                workType: "Full-time", // Mock data
                applicantLimit: 15, // Mock data
                category: "Technology & Digital", // Mock data
                workTags: ["Software Development", "Web Development", "Cloud Computing"], // Mock data
                requiredDocument: "resume", // Mock data
                jobDescription: "We are looking for an experienced professional to join our growing team. This is an exciting opportunity to work on cutting-edge projects with a collaborative team of experts.", // Mock data
                responsibilities: "• Lead project development and implementation\n• Collaborate with cross-functional teams\n• Mentor junior team members\n• Ensure code quality and best practices", // Mock data
                qualification: "• Bachelor's degree in relevant field\n• 5+ years of experience\n• Strong problem-solving skills\n• Excellent communication abilities", // Mock data
                skills: "• Technical expertise in relevant technologies\n• Leadership and team management\n• Agile/Scrum methodology\n• Strong analytical skills", // Mock data 
                status: selectedJob.status,
                views: selectedJob.views
            };

            // Open modal in edit mode
            openJobPostModal('edit', mockJobData);
        });
    }

    // Batch action buttons
    const batchAcceptBtn = document.getElementById('batchAcceptBtn');
    const batchRejectBtn = document.getElementById('batchRejectBtn');
    const batchCancelBtn = document.getElementById('batchCancelBtn');

    if (batchAcceptBtn) {
        batchAcceptBtn.addEventListener('click', () => {
            if (selectedApplicants.size > 0) {
                acceptSelectedApplicants();
            }
        });
    }

    if (batchRejectBtn) {
        batchRejectBtn.addEventListener('click', () => {
            if (selectedApplicants.size > 0) {
                rejectSelectedApplicants();
            }
        });
    }

    if (batchCancelBtn) {
        batchCancelBtn.addEventListener('click', () => {
            clearSelection();
        });
    }

    // ========================================
    // JOB POSTING MODAL FUNCTIONALITY
    // ========================================

    let categoriesTagsData = {};
    let workTypesData = [];
    let selectedTags = [];
    const MAX_TAGS = 3;

    // Modal Mode Management
    let modalMode = 'add'; // 'add' or 'edit'
    let currentEditingJobId = null;

    // DOM Elements for Modal
    const jobPostModalOverlay = document.getElementById('jobPostModalOverlay');
    const jobPostForm = document.getElementById('jobPostForm');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const categorySelect = document.getElementById('categorySelect');
    const tagsContainer = document.getElementById('tagsContainer');
    const tagCounter = document.getElementById('tagCounter');
    const modalModeIndicator = document.getElementById('modalModeIndicator');
    const editingJobTitle = document.getElementById('editingJobTitle');
    const submitBtnText = document.getElementById('submitBtnText');

    // Fetch Categories and Tags Data
    async function fetchCategoriesAndTags() {
        try {
            const response = await fetch(`../json/categories_tags.json?t=${new Date().getTime()}`);
            categoriesTagsData = await response.json();
            populateCategoryDropdown();
        } catch (error) {
            console.error('Error fetching categories and tags:', error);
        }
    }

    // Fetch Work Types Data
    async function fetchWorkTypes() {
        try {
            const response = await fetch(`../json/work_types.json?t=${new Date().getTime()}`);
            workTypesData = await response.json();
            populateWorkTypesDropdown();
        } catch (error) {
            console.error('Error fetching work types:', error);
        }
    }

    // ========================================
    // PHILIPPINES LOCATIONS - CASCADING DROPDOWN
    // ========================================
    let philippinesLocations = {};
    let currentSubmenu = null;

    // Fetch Philippines Locations Data
    async function fetchPhilippinesLocations() {
        try {
            const response = await fetch(`../json/philippines_locations.json?t=${new Date().getTime()}`);
            philippinesLocations = await response.json();
            console.log('✅ Philippines locations loaded:', Object.keys(philippinesLocations).length, 'provinces');
        } catch (error) {
            console.error('Error fetching Philippines locations:', error);
        }
    }

    // Render Location Dropdown
    function renderLocationDropdown() {
        const dropdownMenu = document.getElementById('locationDropdownMenu');
        if (!dropdownMenu) return;

        dropdownMenu.innerHTML = '';

        Object.keys(philippinesLocations).forEach(province => {
            const provinceItem = document.createElement('div');
            provinceItem.className = 'province-item';
            provinceItem.textContent = province;

            const citySubmenu = document.createElement('div');
            citySubmenu.className = 'city-submenu';

            philippinesLocations[province].forEach(city => {
                const cityItem = document.createElement('div');
                cityItem.className = 'city-item';
                cityItem.textContent = city;
                cityItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectLocation(province, city);
                });
                citySubmenu.appendChild(cityItem);
            });

            // Show submenu on province hover
            provinceItem.addEventListener('mouseenter', () => {
                // Hide any currently visible submenu
                if (currentSubmenu && currentSubmenu !== citySubmenu) {
                    currentSubmenu.style.display = 'none';
                }

                // Position and show this submenu
                const rect = provinceItem.getBoundingClientRect();
                citySubmenu.style.left = `${rect.right + 5}px`;
                citySubmenu.style.top = `${rect.top}px`;
                citySubmenu.style.display = 'block';
                currentSubmenu = citySubmenu;
            });

            // Keep submenu visible when hovering over it
            citySubmenu.addEventListener('mouseenter', () => {
                citySubmenu.style.display = 'block';
            });

            // Hide submenu when leaving it
            citySubmenu.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!provinceItem.matches(':hover') && !citySubmenu.matches(':hover')) {
                        citySubmenu.style.display = 'none';
                    }
                }, 100);
            });

            // Hide submenu when leaving province
            provinceItem.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!provinceItem.matches(':hover') && !citySubmenu.matches(':hover')) {
                        citySubmenu.style.display = 'none';
                    }
                }, 100);
            });

            provinceItem.appendChild(citySubmenu);
            dropdownMenu.appendChild(provinceItem);
        });

        console.log('✅ Location dropdown populated with', Object.keys(philippinesLocations).length, 'provinces');
    }

    // Select Location
    function selectLocation(province, city) {
        const locationDisplay = document.getElementById('locationDisplay');
        const provinceInput = document.getElementById('provinceInput');
        const cityInput = document.getElementById('cityInput');

        if (locationDisplay && provinceInput && cityInput) {
            locationDisplay.value = `${province}, ${city}`;
            provinceInput.value = province;
            cityInput.value = city;
            console.log(`Location selected: ${province}, ${city}`);
        }

        closeLocationDropdown();
    }

    // Open/Close Location Dropdown
    const locationDropdown = document.getElementById('locationDropdown');
    const locationDisplay = document.getElementById('locationDisplay');

    if (locationDisplay) {
        locationDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            locationDropdown.classList.toggle('open');
        });
    }

    function closeLocationDropdown() {
        if (locationDropdown) {
            locationDropdown.classList.remove('open');
        }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (locationDropdown && !e.target.closest('#locationDropdown')) {
            closeLocationDropdown();
        }
    });

    // ========================================
    // WORK TYPE DROPDOWN LOGIC (Custom implementation to match Location style)
    // ========================================
    const workTypeDropdown = document.getElementById('workTypeDropdown');
    const workTypeDisplay = document.getElementById('workTypeDisplay');
    const workTypeInput = document.getElementById('workTypeInput');
    const workTypeMenu = document.getElementById('workTypeDropdownMenu');

    if (workTypeDisplay && workTypeDropdown && workTypeInput && workTypeMenu) {
        // Toggle Dropdown
        workTypeDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns first
            closeLocationDropdown();
            workTypeDropdown.classList.toggle('open');
        });

        // Select Options
        workTypeMenu.querySelectorAll('.simple-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = item.getAttribute('data-value');
                const text = item.textContent;

                workTypeInput.value = value;
                workTypeDisplay.value = text;

                workTypeDropdown.classList.remove('open');

                // Validate Work Type
                const workTypeError = document.getElementById('workTypeError');
                if (!workTypeInput.value) {
                    workTypeError.textContent = 'Please select a work type';
                    workTypeError.classList.add('show');
                    if (workTypeDisplay) {
                        workTypeDisplay.style.borderColor = '#ef4444';
                        // Reset border on interaction
                        const resetBorder = () => {
                            workTypeDisplay.style.borderColor = '#e5e7eb';
                            workTypeDisplay.removeEventListener('click', resetBorder);
                        };
                        workTypeDisplay.addEventListener('click', resetBorder);
                    }
                } else {
                    workTypeError.textContent = '';
                    workTypeError.classList.remove('show');
                    if (workTypeDisplay) workTypeDisplay.style.borderColor = '#e5e7eb';
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!workTypeDropdown.contains(e.target)) {
                workTypeDropdown.classList.remove('open');
            }
        });
    }


    // Populate Category Dropdown
    function populateCategoryDropdown() {
        if (!categorySelect) return;

        // (This snippet is just to locate the area, the actual replacement target is below)

        categorySelect.innerHTML = '<option value="">Select a category...</option>';

        Object.keys(categoriesTagsData).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }



    // Helper: Wait for dropdown to have options populated
    function waitForDropdownOptions(selectElement, minOptionCount = 2) {
        return new Promise((resolve) => {
            const checkOptions = () => {
                if (selectElement.options.length >= minOptionCount) {
                    resolve();
                } else {
                    requestAnimationFrame(checkOptions);
                }
            };
            checkOptions();
        });
    }

    // Helper: Wait for tags to be rendered in the container
    function waitForTagsToRender(expectedTagCount = 0) {
        return new Promise((resolve) => {
            const checkTags = () => {
                const tagPills = document.querySelectorAll('.tag-pill');
                // If we expect specific tags, wait for them; otherwise wait for any tags
                if (expectedTagCount > 0 ? tagPills.length >= expectedTagCount : tagPills.length > 0) {
                    resolve();
                } else {
                    requestAnimationFrame(checkTags);
                }
            };
            // Give a small initial delay before checking
            setTimeout(checkTags, 50);
        });
    }

    // Open Job Post Modal
    async function openJobPostModal(mode = 'add', jobData = null) {
        if (jobPostModalOverlay) {
            // Fetch data if not already loaded (Wait for it before populating)
            if (Object.keys(categoriesTagsData).length === 0) {
                await fetchCategoriesAndTags();
            }
            // Populate dropdowns AFTER data is fetched
            populateCategoryDropdown();
            // populateWorkTypesDropdown call removed - Hardcoded HTML is used instead

            // Load Philippines locations if not already loaded
            if (Object.keys(philippinesLocations).length === 0) {
                await fetchPhilippinesLocations();
            }
            renderLocationDropdown();

            modalMode = mode;

            jobPostModalOverlay.style.display = 'flex';
            jobPostModalOverlay.classList.remove('closing');
            resetJobPostForm();

            // Update UI based on mode
            if (mode === 'edit' && jobData) {
                currentEditingJobId = jobData.jobId;

                // Show mode indicator
                if (modalModeIndicator) {
                    modalModeIndicator.style.display = 'flex';
                    if (editingJobTitle) {
                        editingJobTitle.textContent = jobData.jobTitle;
                    }
                }

                // Change button text
                if (submitBtnText) {
                    submitBtnText.textContent = 'Update';
                }

                // Populate form - now async
                await populateFormForEdit(jobData);
            } else {
                // Add mode - hide indicator
                if (modalModeIndicator) {
                    modalModeIndicator.style.display = 'none';
                }

                // Reset button text
                if (submitBtnText) {
                    submitBtnText.textContent = 'Post';
                }

                currentEditingJobId = null;
            }
        }
    }

    // Populate Form for Edit Mode
    async function populateFormForEdit(jobData) {
        console.log('📝 Populating form for edit with data:', jobData);

        // Populate job title
        const jobTitleInput = document.getElementById('jobTitleInput');
        if (jobTitleInput) jobTitleInput.value = jobData.jobTitle || '';

        // Populate province and city
        const locationDisplay = document.getElementById('locationDisplay');
        const provinceInput = document.getElementById('provinceInput');
        const cityInput = document.getElementById('cityInput');

        if (jobData.province && jobData.city) {
            if (locationDisplay) locationDisplay.value = `${jobData.province}, ${jobData.city}`;
            if (provinceInput) provinceInput.value = jobData.province;
            if (cityInput) cityInput.value = jobData.city;
            console.log(`✅ Location set to: ${jobData.province}, ${jobData.city}`);
        }

        // Populate applicant limit
        const applicantLimitInput = document.getElementById('applicantLimitInput');
        if (applicantLimitInput) applicantLimitInput.value = jobData.applicantLimit || '';

        // Populate Work Type (Custom Dropdown)
        const workTypeInput = document.getElementById('workTypeInput');
        const workTypeDisplay = document.getElementById('workTypeDisplay');

        if (workTypeInput && workTypeDisplay) {
            console.log('SETTING WORK TYPE TO:', jobData.workType);
            workTypeInput.value = jobData.workType || '';
            workTypeDisplay.value = jobData.workType || '';
        }

        // Populate category and tags
        if (jobData.category && jobData.workTags) {
            console.log('📂 Setting category:', jobData.category, 'with tags:', jobData.workTags);

            // Wait for category dropdown to have options
            if (categorySelect) {
                await waitForDropdownOptions(categorySelect);

                // Set category value
                categorySelect.value = jobData.category;
                console.log('✅ Category dropdown set to:', categorySelect.value);

                // Trigger change event to render tags for this category
                const changeEvent = new Event('change');
                categorySelect.dispatchEvent(changeEvent);

                // Wait for tags to be rendered (wait for at least 1 tag pill)
                await waitForTagsToRender(1);
                console.log('✅ Tags rendered, now selecting...');

                // Now select the tags
                selectedTags = [...jobData.workTags];
                const tagPills = document.querySelectorAll('.tag-pill');

                let selectedCount = 0;
                tagPills.forEach(pill => {
                    const tagName = pill.dataset.tag;
                    if (selectedTags.includes(tagName)) {
                        pill.classList.add('selected');
                        selectedCount++;
                        console.log(`  ✓ Selected tag: ${tagName}`);
                    }
                });

                console.log(`✅ Pre-selected ${selectedCount} tags out of ${selectedTags.length} expected`);

                // Disable non-selected tags if max reached
                if (selectedTags.length >= MAX_TAGS) {
                    document.querySelectorAll('.tag-pill:not(.selected)').forEach(pill => {
                        pill.classList.add('disabled');
                    });
                }

                updateTagCounter();
            }
        }

        // Populate required documents checkboxes
        const resumeCheckbox = document.getElementById('requireResume');
        const coverLetterCheckbox = document.getElementById('requireCoverLetter');

        if (resumeCheckbox) resumeCheckbox.checked = jobData.resume || false;
        if (coverLetterCheckbox) coverLetterCheckbox.checked = jobData.coverLetter || false;

        // Populate text areas
        const jobDescriptionTextarea = document.getElementById('jobDescriptionTextarea');
        if (jobDescriptionTextarea) jobDescriptionTextarea.value = jobData.jobDescription || '';

        const responsibilitiesTextarea = document.getElementById('responsibilitiesTextarea');
        if (responsibilitiesTextarea) responsibilitiesTextarea.value = jobData.responsibilities || '';

        const qualificationTextarea = document.getElementById('qualificationTextarea');
        if (qualificationTextarea) qualificationTextarea.value = jobData.qualifications || jobData.qualification || '';

        const skillsTextarea = document.getElementById('skillsTextarea');
        if (skillsTextarea) skillsTextarea.value = jobData.skills || '';
    }

    // Close Job Post Modal
    function closeJobPostModal() {
        if (jobPostModalOverlay) {
            jobPostModalOverlay.classList.add('closing');
            setTimeout(() => {
                jobPostModalOverlay.style.display = 'none';
                jobPostModalOverlay.classList.remove('closing');
            }, 300);
        }
    }

    // Reset Job Post Form
    function resetJobPostForm() {
        if (jobPostForm) {
            jobPostForm.reset();
        }
        selectedTags = [];
        updateTagCounter();
        clearTags();
        clearAllErrors();
    }

    // Category Selection Handler
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            if (selectedCategory && categoriesTagsData[selectedCategory]) {
                renderTags(categoriesTagsData[selectedCategory]);
            } else {
                clearTags();
            }
            // Reset selected tags when category changes
            selectedTags = [];
            updateTagCounter();
            clearError('tags');
        });
    }

    // Render Tags
    function renderTags(tags) {
        if (!tagsContainer) return;

        tagsContainer.innerHTML = '';

        if (!tags || tags.length === 0) {
            tagsContainer.innerHTML = '<p class="tag-placeholder">No tags available for this category</p>';
            return;
        }

        tags.forEach(tag => {
            const tagPill = document.createElement('div');
            tagPill.className = 'tag-pill';
            tagPill.textContent = tag;
            tagPill.dataset.tag = tag;

            tagPill.addEventListener('click', () => toggleTagSelection(tag, tagPill));

            tagsContainer.appendChild(tagPill);
        });
    }

    // Clear Tags
    function clearTags() {
        if (tagsContainer) {
            tagsContainer.innerHTML = '<p class="tag-placeholder">Please select a category to view available tags</p>';
        }
    }

    // Toggle Tag Selection
    function toggleTagSelection(tag, element) {
        const tagIndex = selectedTags.indexOf(tag);

        if (tagIndex > -1) {
            // Tag is already selected, remove it
            selectedTags.splice(tagIndex, 1);
            element.classList.remove('selected');

            // Re-enable all tags
            document.querySelectorAll('.tag-pill.disabled').forEach(pill => {
                pill.classList.remove('disabled');
            });
        } else {
            // Check if max limit reached
            if (selectedTags.length >= MAX_TAGS) {
                // Show visual feedback
                if (tagCounter) {
                    tagCounter.style.color = '#ef4444';
                    setTimeout(() => {
                        tagCounter.style.color = 'var(--secondary-yellow)';
                    }, 500);
                }
                return;
            }

            // Add tag
            selectedTags.push(tag);
            element.classList.add('selected');

            // Disable other tags if max reached
            if (selectedTags.length >= MAX_TAGS) {
                document.querySelectorAll('.tag-pill:not(.selected)').forEach(pill => {
                    pill.classList.add('disabled');
                });
            }
        }

        updateTagCounter();
    }

    // Update Tag Counter
    function updateTagCounter() {
        if (tagCounter) {
            tagCounter.textContent = `Selected: ${selectedTags.length}/${MAX_TAGS}`;
        }
    }

    // Form Validation
    function validateJobPostForm() {
        let isValid = true;

        // Job Title
        const jobTitle = document.getElementById('jobTitleInput').value.trim();
        if (!jobTitle) {
            showError('jobTitle', 'Job title is required');
            isValid = false;
        }

        // Location (Province and City)
        const province = document.getElementById('provinceInput').value;
        const city = document.getElementById('cityInput').value;
        if (!province || !city) {
            showError('location', 'Please select a province and city');
            isValid = false;
        }

        // Work Type
        const workType = document.getElementById('workTypeInput').value;
        if (!workType) {
            showError('workType', 'Work type is required');
            isValid = false;
        }

        // Applicant Limit
        const applicantLimit = document.getElementById('applicantLimitInput').value;
        if (!applicantLimit || applicantLimit < 1) {
            showError('applicantLimit', 'Applicant limit must be at least 1');
            isValid = false;
        }

        // Work Tags (minimum 1)
        if (selectedTags.length < 1) {
            showError('tags', 'Please select at least 1 work tag');
            isValid = false;
        }

        // Job Description
        const jobDescription = document.getElementById('jobDescriptionTextarea').value.trim();
        if (!jobDescription) {
            showError('jobDescription', 'Job description is required');
            isValid = false;
        }

        // Responsibilities
        const responsibilities = document.getElementById('responsibilitiesTextarea').value.trim();
        if (!responsibilities) {
            showError('responsibilities', 'Responsibilities are required');
            isValid = false;
        }

        // Qualification
        const qualification = document.getElementById('qualificationTextarea').value.trim();
        if (!qualification) {
            showError('qualification', 'Qualification is required');
            isValid = false;
        }

        // Skills
        const skills = document.getElementById('skillsTextarea').value.trim();
        if (!skills) {
            showError('skills', 'Skills are required');
            isValid = false;
        }

        return isValid;
    }

    // Show Error
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(`${fieldName}Input`) ||
            document.getElementById(`${fieldName}Select`) ||
            document.getElementById(`${fieldName}Textarea`);

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    // Clear Error
    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(`${fieldName}Input`) ||
            document.getElementById(`${fieldName}Select`) ||
            document.getElementById(`${fieldName}Textarea`);

        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }

        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    // Clear All Errors
    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }

    // Add input event listeners to clear errors on user input
    if (jobPostForm) {
        const inputs = jobPostForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const fieldName = e.target.id.replace('Input', '').replace('Select', '').replace('Textarea', '');
                clearError(fieldName);
            });
        });
    }

    // Form Submission Handler
    if (jobPostForm) {
        jobPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            clearAllErrors();

            // Validate form
            if (!validateJobPostForm()) {
                return;
            }

            // Collect form data
            const formData = {
                title: document.getElementById('jobTitleInput').value.trim(),
                province: document.getElementById('provinceInput').value,
                city: document.getElementById('cityInput').value,
                work_type: document.getElementById('workTypeInput').value,
                applicant_limit: parseInt(document.getElementById('applicantLimitInput').value),
                category: document.getElementById('categorySelect').value,
                work_tags: [...selectedTags],
                resume: document.getElementById('requireResume')?.checked || false,
                cover_letter: document.getElementById('requireCoverLetter')?.checked || false,
                description: document.getElementById('jobDescriptionTextarea').value.trim(),
                responsibilities: document.getElementById('responsibilitiesTextarea').value.trim(),
                qualifications: document.getElementById('qualificationTextarea').value.trim(),
                skills: document.getElementById('skillsTextarea').value.trim()
            };

            // Check mode and handle accordingly
            if (modalMode === 'edit') {
                // Add job ID for update
                formData.post_id = currentEditingJobId;

                // Button State
                const submitBtn = document.getElementById('btnPostJob');
                let originalBtnText = '';
                if (submitBtn) {
                    originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';
                }

                try {
                    const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/update_job_post.php", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (result.status === "success") {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Job post updated successfully!', 'success');
                        } else {
                            alert('Job post updated successfully!');
                        }

                        // Refresh job details (FORCE REFRESH)
                        await fetchJobDetails(currentEditingJobId, true);

                        // Re-render the detail view immediately
                        await renderJobDetail(currentEditingJobId);

                        // Update cache in jobPostsData as well for card view
                        const jobIndex = jobPostsData.findIndex(j => j.id === currentEditingJobId);
                        if (jobIndex !== -1) {
                            jobPostsData[jobIndex].title = formData.title;
                            jobPostsData[jobIndex].location = `${formData.province}, ${formData.city}`;
                            jobPostsData[jobIndex].applicantLimit = formData.applicant_limit;
                            jobPostsData[jobIndex].jobDescription = formData.description;

                            // Re-render view if in cards mode
                            if (viewMode === 'cards') {
                                showCardView();
                            }
                        }

                        closeJobPostModal();
                    } else if (result.code === "LIMIT_BELOW_ACCEPTED") {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show(result.message, 'error');
                        } else {
                            alert(result.message);
                        }
                    } else {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Failed to update job post: ' + result.message, 'error');
                        } else {
                            alert('Failed to update job post: ' + result.message);
                        }
                    }
                } catch (error) {
                    console.error('Error updating job post:', error);
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show('Network error. Please try again.', 'error');
                    } else {
                        alert('Network error. Please try again.');
                    }
                } finally {
                    // Re-enable button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            } else {
                // ========================================
                // CREATE MODE
                // ========================================
                // Button State
                const submitBtn = document.getElementById('btnPostJob');
                let originalBtnText = '';
                if (submitBtn) {
                    originalBtnText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Posting...';
                }

                try {
                    const companyEmail = document.getElementById('company_email')?.value || '';
                    if (!companyEmail) {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Error: Company email not found. Please reload.', 'error');
                        } else {
                            alert('Error: Company email not found. Please reload.');
                        }
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnText;
                        }
                        return;
                    }

                    const payload = {
                        company_email: companyEmail,
                        title: formData.title,
                        province: formData.province,
                        city: formData.city,
                        work_type: formData.work_type,
                        applicant_limit: formData.applicant_limit,
                        category: formData.category,
                        work_tags: formData.work_tags,
                        resume: formData.resume,
                        cover_letter: formData.cover_letter,
                        description: formData.description,
                        responsibilities: formData.responsibilities,
                        qualifications: formData.qualifications,
                        skills: formData.skills
                    };

                    const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/post_job.php", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (result.status === "success") {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Job post created successfully!', 'success');
                        } else {
                            alert('Job post created successfully!');
                        }

                        // Create Job Folder for File Uploads
                        try {
                            const companyId = await getCompanyId();
                            if (companyId && result.post_id) {
                                await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/create_job_folder.php", {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        company_id: companyId,
                                        post_id: result.post_id
                                    })
                                });
                                console.log('✅ Job folder created successfully');
                            }
                        } catch (folderError) {
                            console.error('Failed to create job folder:', folderError);
                            // We don't block the UI flow for this background task, but logging it is good
                        }

                        closeJobPostModal();

                        // Refresh data
                        await fetchJobPosts();
                        if (viewMode === 'cards') {
                            renderJobCards(jobSearchTerm);
                        }
                    } else {
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Failed to create job: ' + result.message, 'error');
                        } else {
                            alert('Failed to create job: ' + result.message);
                        }
                    }
                } catch (error) {
                    console.error('Error creating job post:', error);
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show('Network error.', 'error');
                    } else {
                        alert('Network error.');
                    }
                } finally {
                    // Re-enable button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            }
        });
    }

    // Open Modal for New Post
    const btnAddJob = document.getElementById('btnAddJob');
    if (btnAddJob) {
        btnAddJob.addEventListener('click', () => {
            openJobPostModal('add');
        });
    }

    // Cancel Button Handler
    if (btnCancelModal) {
        btnCancelModal.addEventListener('click', closeJobPostModal);
    }

    // Close modal when clicking outside
    if (jobPostModalOverlay) {
        jobPostModalOverlay.addEventListener('click', (e) => {
            if (e.target === jobPostModalOverlay) {
                closeJobPostModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && jobPostModalOverlay && jobPostModalOverlay.style.display === 'flex') {
            closeJobPostModal();
        }
    });

    // ========================================
    // NEW EVENT HANDLERS FOR CARD VIEW UI
    // ========================================
    const jobSearchInput = document.getElementById('jobSearchInput');
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', (e) => {
            jobSearchTerm = e.target.value;
            saveState();
            renderJobCards(jobSearchTerm);
        });
    }

    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            // Clear URL parameters to prevent re-redirection on refresh
            const cleanUrl = window.location.pathname;
            window.history.pushState({}, document.title, cleanUrl);

            showCardView();
        });
    }

    const btnEditDetail = document.getElementById('btnEditDetail');
    if (btnEditDetail) {
        btnEditDetail.addEventListener('click', async () => {
            if (selectedJobForDetail) {
                // Use cached details if available, otherwise fetch
                let jobDetails = jobDetailsCache[selectedJobForDetail];
                if (!jobDetails) {
                    await fetchJobDetails(selectedJobForDetail);
                    jobDetails = jobDetailsCache[selectedJobForDetail];
                }

                if (jobDetails) {
                    openJobPostModal('edit', jobDetails);
                } else {
                    console.error('Job details not found for ID:', selectedJobForDetail);
                    if (typeof ToastSystem !== 'undefined') {
                        ToastSystem.show('Could not load job details for editing.', 'error');
                    } else {
                        alert('Could not load job details for editing.');
                    }
                }
            }
        });
    }

    const btnCloseDetail = document.getElementById('btnCloseDetail');
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', async () => {
            if (!selectedJobForDetail) return;

            showConfirmationModal(
                'Close Job Post?',
                'Are you sure you want to CLOSE this job post?\n\nThis will REJECT all pending applicants and cannot be undone.',
                'warning',
                async () => {
                    const btn = document.getElementById('btnCloseDetail');
                    let originalText = '';
                    if (btn) {
                        originalText = btn.innerHTML;
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Closing...';
                    }

                    try {
                        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/close_job_post.php", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ post_id: selectedJobForDetail })
                        });

                        const result = await response.json();

                        if (result.status === "success") {
                            if (typeof ToastSystem !== 'undefined') {
                                ToastSystem.show(`Job post closed! Rejected ${result.rejected_count} pending applicants.`, 'success');
                            } else {
                                alert(`Job post closed! Rejected ${result.rejected_count} pending applicants.`);
                            }

                            // Force refresh details to update status and UI
                            await fetchJobDetails(selectedJobForDetail, true);
                            await renderJobDetail(selectedJobForDetail);

                            // Update lists
                            await fetchJobPosts();
                            await fetchAllApplicants(); // Counts changed
                        } else {
                            if (typeof ToastSystem !== 'undefined') {
                                ToastSystem.show(result.message, 'error');
                            } else {
                                alert(result.message);
                            }
                        }
                    } catch (error) {
                        console.error('Error closing job:', error);
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Network error.', 'error');
                        } else {
                            alert('Network error.');
                        }
                    } finally {
                        if (btn && originalText) {
                            btn.disabled = false;
                            btn.innerHTML = originalText;
                        }
                    }
                }
            );
        });
    }

    const btnDeleteDetail = document.getElementById('btnDeleteDetail');
    if (btnDeleteDetail) {
        btnDeleteDetail.addEventListener('click', async () => {
            if (!selectedJobForDetail) return;

            showConfirmationModal(
                'Delete Job Post?',
                '⚠️ PERMANENTLY DELETE JOB POST? ⚠️\n\nThis will remove ALL records including applicants, interviews, and statistics.\nThis action CANNOT be undone.',
                'danger',
                async () => {
                    const btn = document.getElementById('btnDeleteDetail');
                    let originalText = '';
                    if (btn) {
                        originalText = btn.innerHTML;
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
                    }

                    try {
                        const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/delete_job_post.php", {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ post_id: selectedJobForDetail })
                        });

                        const result = await response.json();

                        if (result.status === "success") {
                            if (typeof ToastSystem !== 'undefined') {
                                ToastSystem.show('Job post deleted successfully.', 'success');
                            } else {
                                alert('Job post deleted successfully.');
                            }

                            // Delete Job Folder
                            try {
                                const companyId = await getCompanyId();
                                if (companyId && selectedJobForDetail) {
                                    await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/delete_job_folder.php", {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            company_id: companyId,
                                            post_id: selectedJobForDetail
                                        })
                                    });
                                    console.log('✅ Job folder deleted successfully');
                                }
                            } catch (folderError) {
                                console.error('Failed to delete job folder:', folderError);
                            }

                            // Go back to list and refresh
                            showCardView();
                            await fetchJobPosts();
                            if (viewMode === 'cards') renderJobCards(jobSearchTerm);
                        } else {
                            if (typeof ToastSystem !== 'undefined') {
                                ToastSystem.show('Failed to delete: ' + result.message, 'error');
                            } else {
                                alert('Failed to delete: ' + result.message);
                            }
                        }
                    } catch (error) {
                        console.error('Error deleting job:', error);
                        if (typeof ToastSystem !== 'undefined') {
                            ToastSystem.show('Network error.', 'error');
                        } else {
                            alert('Network error.');
                        }
                    } finally {
                        if (btn && originalText) {
                            btn.disabled = false;
                            btn.innerHTML = originalText;
                        }
                    }
                }
            );
        });
    }
});
