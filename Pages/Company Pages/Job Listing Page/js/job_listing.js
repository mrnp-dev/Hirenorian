// ========================================
// JOB LISTING PAGE - INTERACTIVE FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // MOCK DATA (Backend Integration Ready)
    // ========================================

    // This data structure is ready for backend integration
    // Simply replace with: fetch('/api/applicants').then(res => res.json()).then(data => {...})
    const applicantsData = [
        {
            id: 1,
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
    let currentFilter = 'all';
    let searchTerm = '';
    let selectedApplicants = new Set();

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const searchInput = document.getElementById('searchInput');
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');
    const filterDropdown = document.querySelector('.filter-dropdown');
    const applicantsList = document.getElementById('applicantsList');
    const emptyState = document.getElementById('emptyState');
    const selectAllCheckbox = document.getElementById('selectAll');
    const totalCountEl = document.getElementById('totalCount');
    const acceptedCountEl = document.getElementById('acceptedCount');
    const rejectedCountEl = document.getElementById('rejectedCount');

    // Chart initialization
    let statsChart;

    // ========================================
    // STATISTICS CHART
    // ========================================
    function initChart() {
        const ctx = document.getElementById('statsChart');
        if (!ctx) return;

        const stats = calculateStatistics(applicantsData);

        statsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Accepted', 'Rejected'],
                datasets: [{
                    data: [stats.accepted, stats.rejected],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#333',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                }
            }
        });

        updateStatistics();
    }

    // ========================================
    // STATISTICS CALCULATION & UPDATE
    // ========================================
    function calculateStatistics(data) {
        const accepted = data.filter(a => a.status === 'accepted').length;
        const rejected = data.filter(a => a.status === 'rejected').length;
        const total = data.length;
        return { accepted, rejected, total };
    }

    function updateStatistics() {
        const stats = calculateStatistics(applicantsData);
        totalCountEl.textContent = stats.total;
        acceptedCountEl.textContent = stats.accepted;
        rejectedCountEl.textContent = stats.rejected;

        if (statsChart) {
            statsChart.data.datasets[0].data = [stats.accepted, stats.rejected];
            statsChart.update();
        }
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

        card.innerHTML = `
            <div class="applicant-row">
                <div class="cell checkbox-cell">
                    <input type="checkbox" class="applicant-checkbox" data-id="${applicant.id}">
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

        // Add checkbox event
        const checkbox = card.querySelector('.applicant-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            handleCheckboxChange(applicant.id, checkbox.checked);
        });

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
        let filtered = [...applicantsData];

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
        const filteredData = getFilteredData();
        renderApplicants(filteredData);
        updateStatistics();
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        updateDisplay();
    });

    // ========================================
    // FILTER FUNCTIONALITY
    // ========================================
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('active');
    });

    // Close filter menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('active');
        }
    });

    // Filter option selection
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Update active state
            filterOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update filter
            currentFilter = option.dataset.filter;
            document.getElementById('filterLabel').textContent = option.textContent.trim();

            // Close dropdown
            filterDropdown.classList.remove('active');

            // Update display
            updateDisplay();
        });
    });

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
    }

    function updateSelectAllCheckbox() {
        const visibleCheckboxes = document.querySelectorAll('.applicant-checkbox');
        const checkedCount = Array.from(visibleCheckboxes).filter(cb => cb.checked).length;

        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
    }

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
    });

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

    // ========================================
    // ACTION BUTTONS
    // ========================================
    document.getElementById('btnAdd').addEventListener('click', () => {
        // TODO: Show modal for adding new job post
        console.log('Add button clicked - Modal to be implemented');
    });

    document.getElementById('btnClose').addEventListener('click', () => {
        // TODO: Show confirmation modal for closing job and rejecting pending applicants
        console.log('Close button clicked - Confirmation modal to be implemented');
    });

    document.getElementById('btnEdit').addEventListener('click', () => {
        // TODO: Show modal for editing job post
        console.log('Edit button clicked - Modal to be implemented');
    });

    // ========================================
    // INITIALIZATION
    // ========================================
    initChart();
    updateDisplay();

    console.log('Job Listing Page Loaded Successfully!');
});
