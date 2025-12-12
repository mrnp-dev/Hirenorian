// ========================================
// JOB LISTING MAIN
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    const APP = window.JobListingApp;

    // Sign Out Logic
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../../../../APIs/Company DB APIs/company_logout.php';
        });
    }

    try {
        // Load initial data
        await APP.API.fetchJobPosts();
        await APP.API.fetchAllApplicants();

        // Restore state or default
        APP.loadState();

        if (APP.viewMode === 'cards') {
            APP.UI.showCardView();
        } else if (APP.viewMode === 'detail' && APP.selectedJobForDetail) {
            APP.UI.showDetailView(APP.selectedJobForDetail);
        }

    } catch (error) {
        console.error('Failed to initialize job listing:', error);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            APP.searchTerm = e.target.value;
            APP.UI.renderApplicants();
            APP.saveState();
        });
    }

    // Job Search Input
    const jobSearchInput = document.getElementById('jobSearchInput');
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', (e) => {
            APP.jobSearchTerm = e.target.value;
            APP.UI.renderJobCards(APP.jobSearchTerm);
            APP.saveState();
        });
    }

    // Filter Pills
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Update UI Interface
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Update State
            APP.currentFilter = pill.dataset.status;

            // Render
            APP.UI.renderApplicants();
            APP.saveState();
        });
    });

    // Add Job Button
    const btnAddJob = document.getElementById('btnAddJob');
    if (btnAddJob) {
        btnAddJob.addEventListener('click', () => {
            // Logic to open modal (assuming modal logic is also migrated or kept here)
            // For now, let's log or assume the modal logic is handled separately or needs to be brought in.
            // If the original modal logic was huge, it should be in a separate file or ui.js.
            // For this refactor, let's assume we need to trigger the modal open.
            const modal = document.getElementById('jobPostModalOverlay');
            if (modal) {
                modal.style.display = 'flex';
                // Reset form logic...
            }
        });
    }

    // Close Modal
    const btnCancelModal = document.getElementById('btnCancelModal');
    if (btnCancelModal) {
        btnCancelModal.addEventListener('click', () => {
            const modal = document.getElementById('jobPostModalOverlay');
            if (modal) modal.style.display = 'none';
        });
    }

    // ... (Other event listeners for detail view buttons, back button, etc.)

    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            APP.UI.showCardView();
        });
    }

    const btnCloseDetail = document.getElementById('btnCloseDetail');
    if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
            APP.UI.showCardView();
        });
    }

    // Console Helper
    console.log('%c🎉 Job Listing App Initialized!', 'color: #10b981; font-size: 14px; font-weight: bold;');
});
