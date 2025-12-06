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
                    <span class="applicant-name">${applicant.name}</span>
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
        // Check if a job is selected
        if (!selectedJobId) {
            // Hide statistics sidebar
            if (statisticsSidebar) statisticsSidebar.style.display = 'none';

            // Hide the entire applicants container to prevent scattered UI elements
            const applicantsContainer = document.querySelector('.applicants-container');
            if (applicantsContainer) applicantsContainer.style.display = 'none';

            // Show empty state in the applicants list area
            if (applicantsList) applicantsList.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
                emptyState.innerHTML = `
                    <i class="fa-solid fa-briefcase"></i>
                    <h3>No Job Selected</h3>
                    <p>Please select a job title from the dropdown above to view applicants</p>
                `;
            }
            return;
        }

        // Show statistics sidebar
        if (statisticsSidebar) statisticsSidebar.style.display = 'block';

        // Show applicants container
        const applicantsContainer = document.querySelector('.applicants-container');
        if (applicantsContainer) applicantsContainer.style.display = 'block';

        const filteredData = getFilteredData();
        renderApplicants(filteredData);
        updateStatistics();
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value;
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
            // TODO: Show modal for adding new job post
            console.log('Add button clicked - Modal to be implemented');
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
            // TODO: Show modal for editing job post
            console.log('Edit button clicked - Modal to be implemented');
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
    // INITIALIZATION
    // ========================================
    populateJobDropdown();
    updateDisplay();

    console.log('Job Listing Page Loaded Successfully!');
    console.log('Job Posts:', jobPostsData);
    console.log('Applicants:', applicantsData);
});
