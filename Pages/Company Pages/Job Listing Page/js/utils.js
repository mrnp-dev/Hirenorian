// ========================================
// JOB LISTING UTILITIES
// ========================================

(function (APP) {
    // Expose Utils
    APP.Utils = {};

    /**
     * Helper: Custom Confirmation Modal
     */
    APP.Utils.showConfirmationModal = function (title, message, type, onConfirm) {
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
    };

    /**
     * Gets applicants for a specific job from the loaded data
     */
    APP.Utils.getApplicantsForJob = function (jobId) {
        if (!jobId) return [];
        return APP.applicantsData.filter(a => a.jobId === jobId);
    };

    /**
     * Calculates job statistics
     */
    APP.Utils.calculateJobStatistics = function (jobId) {
        if (!jobId) {
            return { views: 0, total: 0, pending: 0, accepted: 0, rejected: 0 };
        }

        const job = APP.jobPostsData.find(j => j.id === jobId);
        const jobApplicants = APP.Utils.getApplicantsForJob(jobId);

        const accepted = jobApplicants.filter(a => a.status === 'accepted').length;
        const rejected = jobApplicants.filter(a => a.status === 'rejected').length;
        const pending = jobApplicants.filter(a => a.status === 'pending').length;
        const total = jobApplicants.length;
        const views = job ? job.views : 0;

        return { views, total, pending, accepted, rejected };
    };

    /**
     * Gets the company ID from session/context
     */
    APP.Utils.getCompanyId = async function () {
        try {
            const response = await fetch("http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/get_company_id.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
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
    };

})(window.JobListingApp);
