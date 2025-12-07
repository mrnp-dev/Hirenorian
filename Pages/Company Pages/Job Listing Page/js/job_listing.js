// ========================================
// JOB LISTING PAGE - INTERACTIVE FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // MOCK DATA (Backend Integration Ready)
    // ========================================

    // Job Posts Data - Replace with: fetch('/api/job-posts').then(res => res.json())
    const jobPostsData = [
        {
            id: 1,
            title: "Marketing Intern",
            datePosted: "November 15, 2025",
            status: "active",
            views: 15
        },
        {
            id: 2,
            title: "Software Engineer",
            datePosted: "October 20, 2025",
            status: "active",
            views: 42
        },
        {
            id: 3,
            title: "Data Analyst",
            datePosted: "December 1, 2025",
            status: "active",
            views: 28
        }
    ];

    // Applicants Data - Now linked to job posts via jobId
    // Replace with: fetch('/api/applicants').then(res => res.json())
    const applicantsData = [
        {
            id: 1,
            jobId: 1, // Marketing Intern
            name: "Jose E. Batumbakal",
            course: "Bachelor of Science in Computer Science",
            documentType: "Cover Letter",
            documentUrl: "#",
            dateApplied: "December 1, 2025",
            status: "pending",
            contactInfo: {
                personalEmail: "jose@email.com",
                studentEmail: "202300001@student.dhvsu.edu.ph",
                phone: "09123456789"
            }
        },
        {
            id: 2,
            jobId: 1, // Marketing Intern
            name: "Pedro Dee Z. Nuts",
            course: "Bachelor of Science in Information and Communications Technology",
            documentType: "Resume",
            documentUrl: "#",
            dateApplied: "November 16, 2025",
            status: "accepted",
            contactInfo: {
                personalEmail: "pedro@email.com",
                studentEmail: "202300002@student.dhvsu.edu.ph",
                phone: "09234567890"
            }
        },
        {
            id: 3,
            jobId: 1, // Marketing Intern
            name: "Jebron G. Lames",
            course: "Bachelor of Science in Accounting Technology",
            documentType: "None",
            documentUrl: null,
            dateApplied: "October 3, 2025",
            status: "pending",
            contactInfo: {
                personalEmail: "jebron@email.com",
                studentEmail: "202300003@student.dhvsu.edu.ph",
                phone: "09345678901"
            }
        },
        {
            id: 4,
            jobId: 1, // Marketing Intern
            name: "Tobay D. Brown",
            course: "Bachelor of Science in Information Technology",
            documentType: "None",
            documentUrl: null,
            dateApplied: "October 12, 2025",
            status: "rejected",
            contactInfo: {
                personalEmail: "tobay@email.com",
                studentEmail: "202300004@student.dhvsu.edu.ph",
                phone: "09456789012"
            }
        },
        {
            id: 5,
            jobId: 2, // Software Engineer
            name: "Sakha M. Adibix",
            course: "Bachelor of Science in Information Systems",
            documentType: "Cover Letter",
            documentUrl: "#",
            dateApplied: "September 3, 2025",
            status: "accepted",
            contactInfo: {
                personalEmail: "sakha@email.com",
                studentEmail: "202300005@student.dhvsu.edu.ph",
                phone: "09567890123"
            }
        },
        {
            id: 6,
            jobId: 2, // Software Engineer
            name: "Seyda Z. Elven",
            course: "Bachelor of Science in Computer Engineering",
            documentType: "Cover Letter",
            documentUrl: "#",
            dateApplied: "September 13, 2025",
            status: "pending",
            contactInfo: {
                personalEmail: "seyda@email.com",
                studentEmail: "202300006@student.dhvsu.edu.ph",
                phone: "09678901234"
            }
        },
        {
            id: 7,
            jobId: 2, // Software Engineer
            name: "DayMo N. Taim",
            course: "Bachelor of Science in Data Science",
            documentType: "None",
            documentUrl: null,
            dateApplied: "September 12, 2025",
            status: "rejected",
            contactInfo: {
                personalEmail: "daymo@email.com",
                studentEmail: "202300007@student.dhvsu.edu.ph",
                phone: "09789012345"
            }
        },
        {
            id: 8,
            jobId: 3, // Data Analyst
            name: "Koby L. Jay",
            course: "Bachelor of Science in Software Engineering",
            documentType: "Resume",
            documentUrl: "#",
            dateApplied: "August 10, 2025",
            status: "accepted",
            contactInfo: {
                personalEmail: "koby@email.com",
                studentEmail: "202300008@student.dhvsu.edu.ph",
                phone: "09890123456"
            }
        },
        {
            id: 9,
            jobId: 3, // Data Analyst
            name: "Jaydos D. Crist",
            course: "Bachelor of Science in Cybersecurity",
            documentType: "Resume",
            documentUrl: "#",
            dateApplied: "June 12, 2025",
            status: "pending",
            contactInfo: {
                personalEmail: "jaydos@email.com",
                studentEmail: "202300009@student.dhvsu.edu.ph",
                phone: "09901234567"
            }
        },
        {
            id: 10,
            jobId: 3, // Data Analyst
            name: "Rayd Ohm M. Dih",
            course: "Bachelor of Science in Game Development",
            documentType: "Resume",
            documentUrl: "#",
            dateApplied: "May 10, 2025",
            status: "rejected",
            contactInfo: {
                personalEmail: "rayd@email.com",
                studentEmail: "202300010@student.dhvsu.edu.ph",
                phone: "09012345678"
            }
        }
    ];

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    let selectedJobId = null; // Currently selected job post
    let currentFilter = 'all';
    let searchTerm = '';
    let selectedApplicants = new Set();
    let batchMode = false; // Track if in batch selection mode

    // ========================================
    // STATE PERSISTENCE
    // ========================================
    function saveState() {
        const state = {
            selectedJobId,
            currentFilter,
            searchTerm
        };
        sessionStorage.setItem('jobListingState', JSON.stringify(state));
    }

    function loadState() {
        const savedState = sessionStorage.getItem('jobListingState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);

                // Validate if job ID still exists in our current data
                if (state.selectedJobId) {
                    const jobExists = jobPostsData.some(j => j.id === state.selectedJobId);
                    if (jobExists) {
                        selectedJobId = state.selectedJobId;
                    }
                }

                if (state.currentFilter) currentFilter = state.currentFilter;
                if (state.searchTerm !== undefined) searchTerm = state.searchTerm;

                // Sync UI elements
                if (jobTitleSelect) jobTitleSelect.value = selectedJobId || "";
                if (searchInput) searchInput.value = searchTerm;

                if (filterPills) {
                    filterPills.forEach(pill => {
                        if (pill.dataset.status === currentFilter) {
                            pill.classList.add('active');
                        } else {
                            pill.classList.remove('active');
                        }
                    });
                }
            } catch (e) {
                console.error("Error loading state:", e);
                sessionStorage.removeItem('jobListingState');
            }
        }
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
    function renderApplicants(data) {
        applicantsList.innerHTML = '';

        if (data.length === 0) {
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

        data.forEach(applicant => {
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
                    ${showCheckbox ? `<input type="checkbox" class="applicant-checkbox" data-id="${applicant.id}">` : ''}
                </div>
                <div class="cell name-cell">
                    <div class="applicant-avatar">${initials}</div>
                    <a href="../../Applicant's Profile Page/php/applicant_profile.php?id=${applicant.id}" class="applicant-name-link" style="text-decoration:none; color:inherit; font-weight:600;">${applicant.name}</a>
                </div>
                <div class="cell course-cell">${applicant.course}</div>
       <div class="cell document-cell">
                    <span class="doc-label">${applicant.documentType}</span>
                    ${applicant.documentUrl ? `<a href="${applicant.documentUrl}" class="doc-view-link" target="_blank">View</a>` : ''}
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
            if (e.target.closest('.checkbox-cell') || e.target.closest('.action-btn')) {
                return;
            }
            card.classList.toggle('expanded');
        });

        // Add checkbox event only if checkbox exists
        if (showCheckbox) {
            const checkbox = card.querySelector('.applicant-checkbox');
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    handleCheckboxChange(applicant.id, checkbox.checked);
                });
            }
        }

        // Add action button events
        const acceptBtn = card.querySelector('.btn-accept');
        const rejectBtn = card.querySelector('.btn-reject');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                acceptApplicant(applicant.id);
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                rejectApplicant(applicant.id);
            });
        }

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
    function acceptApplicant(id) {
        const applicant = applicantsData.find(a => a.id === id);
        if (applicant && applicant.status === 'pending') {
            applicant.status = 'accepted';
            // Backend integration point:
            // fetch('/api/applicants/accept', { method: 'POST', body: JSON.stringify({ id }) })
            updateDisplay();
        }
    }

    function rejectApplicant(id) {
        const applicant = applicantsData.find(a => a.id === id);
        if (applicant && applicant.status === 'pending') {
            applicant.status = 'rejected';
            // Backend integration point:
            // fetch('/api/applicants/reject', { method: 'POST', body: JSON.stringify({ id }) })
            updateDisplay();
        }
    }

    // Batch operations
    function acceptSelectedApplicants() {
        selectedApplicants.forEach(id => {
            const applicant = applicantsData.find(a => a.id === id);
            if (applicant && applicant.status === 'pending') {
                applicant.status = 'accepted';
            }
        });
        // Backend integration point:
        // fetch('/api/applicants/batch-accept', { method: 'POST', body: JSON.stringify({ ids: Array.from(selectedApplicants) }) })

        clearSelection();
        updateDisplay();
    }

    function rejectSelectedApplicants() {
        selectedApplicants.forEach(id => {
            const applicant = applicantsData.find(a => a.id === id);
            if (applicant && applicant.status === 'pending') {
                applicant.status = 'rejected';
            }
        });
        // Backend integration point:
        // fetch('/api/applicants/batch-reject', { method: 'POST', body: JSON.stringify({ ids: Array.from(selectedApplicants) }) })

        clearSelection();
        updateDisplay();
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
            const response = await fetch('../json/categories_tags.json');
            categoriesTagsData = await response.json();
            populateCategoryDropdown();
        } catch (error) {
            console.error('Error fetching categories and tags:', error);
        }
    }

    // Fetch Work Types Data
    async function fetchWorkTypes() {
        try {
            const response = await fetch('../json/work_types.json');
            workTypesData = await response.json();
            populateWorkTypesDropdown();
        } catch (error) {
            console.error('Error fetching work types:', error);
        }
    }

    // Populate Category Dropdown
    function populateCategoryDropdown() {
        if (!categorySelect) return;

        categorySelect.innerHTML = '<option value="">Select a category...</option>';

        Object.keys(categoriesTagsData).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Populate Work Types Dropdown
    function populateWorkTypesDropdown() {
        const workTypeSelect = document.getElementById('workTypeSelect');
        if (!workTypeSelect) return;

        workTypeSelect.innerHTML = '<option value="">Select work type...</option>';

        workTypesData.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            workTypeSelect.appendChild(option);
        });
    }

    // Open Job Post Modal
    function openJobPostModal(mode = 'add', jobData = null) {
        if (jobPostModalOverlay) {
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

                // Populate form
                populateFormForEdit(jobData);
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

            // Fetch data if not already loaded
            if (Object.keys(categoriesTagsData).length === 0) {
                fetchCategoriesAndTags();
            }
            if (workTypesData.length === 0) {
                fetchWorkTypes();
            }
        }
    }

    // Populate Form for Edit Mode
    function populateFormForEdit(jobData) {
        // Populate job title
        const jobTitleInput = document.getElementById('jobTitleInput');
        if (jobTitleInput) jobTitleInput.value = jobData.jobTitle || '';

        // Populate location
        const locationInput = document.getElementById('locationInput');
        if (locationInput) locationInput.value = jobData.location || '';

        // Populate work type
        const workTypeSelect = document.getElementById('workTypeSelect');
        if (workTypeSelect && jobData.workType) {
            // Wait for options to load
            setTimeout(() => {
                workTypeSelect.value = jobData.workType;
            }, 100);
        }

        // Populate applicant limit
        const applicantLimitInput = document.getElementById('applicantLimitInput');
        if (applicantLimitInput) applicantLimitInput.value = jobData.applicantLimit || '';

        // Populate category and tags
        if (jobData.category && jobData.workTags) {
            setTimeout(() => {
                // Set category
                if (categorySelect) {
                    categorySelect.value = jobData.category;
                    // Trigger change event to render tags
                    const event = new Event('change');
                    categorySelect.dispatchEvent(event);

                    // Select tags after they're rendered
                    setTimeout(() => {
                        selectedTags = [...jobData.workTags];
                        const tagPills = document.querySelectorAll('.tag-pill');
                        tagPills.forEach(pill => {
                            const tagName = pill.dataset.tag;
                            if (selectedTags.includes(tagName)) {
                                pill.classList.add('selected');
                            }
                        });

                        // Disable non-selected tags if max reached
                        if (selectedTags.length >= MAX_TAGS) {
                            document.querySelectorAll('.tag-pill:not(.selected)').forEach(pill => {
                                pill.classList.add('disabled');
                            });
                        }

                        updateTagCounter();
                    }, 200);
                }
            }, 150);
        }

        // Populate required document
        if (jobData.requiredDocument) {
            const docRadios = document.getElementsByName('requiredDocument');
            docRadios.forEach(radio => {
                if (radio.value === jobData.requiredDocument) {
                    radio.checked = true;
                }
            });
        }

        // Populate text areas
        const jobDescriptionTextarea = document.getElementById('jobDescriptionTextarea');
        if (jobDescriptionTextarea) jobDescriptionTextarea.value = jobData.jobDescription || '';

        const responsibilitiesTextarea = document.getElementById('responsibilitiesTextarea');
        if (responsibilitiesTextarea) responsibilitiesTextarea.value = jobData.responsibilities || '';

        const qualificationTextarea = document.getElementById('qualificationTextarea');
        if (qualificationTextarea) qualificationTextarea.value = jobData.qualification || '';

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

        // Location
        const location = document.getElementById('locationInput').value.trim();
        if (!location) {
            showError('location', 'Location is required');
            isValid = false;
        }

        // Work Type
        const workType = document.getElementById('workTypeSelect').value;
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
        jobPostForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous errors
            clearAllErrors();

            // Validate form
            if (!validateJobPostForm()) {
                return;
            }

            // Collect form data
            const formData = {
                jobTitle: document.getElementById('jobTitleInput').value.trim(),
                location: document.getElementById('locationInput').value.trim(),
                workType: document.getElementById('workTypeSelect').value,
                applicantLimit: parseInt(document.getElementById('applicantLimitInput').value),
                category: document.getElementById('categorySelect').value,
                workTags: [...selectedTags],
                requiredDocument: document.querySelector('input[name="requiredDocument"]:checked').value,
                jobDescription: document.getElementById('jobDescriptionTextarea').value.trim(),
                responsibilities: document.getElementById('responsibilitiesTextarea').value.trim(),
                qualification: document.getElementById('qualificationTextarea').value.trim(),
                skills: document.getElementById('skillsTextarea').value.trim(),
                datePosted: new Date().toISOString(),
                status: 'active',
                views: 0
            };

            // Check mode and handle accordingly
            if (modalMode === 'edit') {
                // Add job ID for update
                formData.jobId = currentEditingJobId;

                // Log update data for now (backend integration point)
                console.log('=== JOB POST UPDATE ===');
                console.log('Updating Job ID:', currentEditingJobId);
                console.log('Updated Job Data:', formData);

                // TODO: Send update to backend
                // fetch(`/api/job-posts/${currentEditingJobId}`, { 
                //     method: 'PUT', 
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData) 
                // })

                alert('Job post updated successfully! (Backend integration pending)');
            } else {
                // Add mode - Log create data for now (backend integration point)
                console.log('=== NEW JOB POST ===');
                console.log('Job Posting Data:', formData);

                // TODO: Send data to backend
                // fetch('/api/job-posts', { 
                //     method: 'POST', 
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData) 
                // })

                alert('Job post created successfully! (Backend integration pending)');
            }

            closeJobPostModal();
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
    // INITIALIZATION
    // ========================================
    populateJobDropdown();
    loadState();
    updateDisplay();

    console.log('Job Listing Page Loaded Successfully!');
    console.log('Job Posts:', jobPostsData);
    console.log('Applicants:', applicantsData);
});
