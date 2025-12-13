// ========================================
// JOB LISTING API
// ========================================

(function (APP) {
    APP.API = {};
    const BASE_URL = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs";

    APP.API.fetchJobPosts = async function () {
        try {
            const companyEmail = document.getElementById("company_email").value;

            const response = await fetch(`${BASE_URL}/fetch_job_posts.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ company_email: companyEmail })
            });

            const result = await response.json();

            if (result.status === "success") {
                // Map API response directly into jobPostsData
                APP.jobPostsData = result.data.map(job => ({
                    id: job.id,
                    title: job.title,
                    location: job.location,
                    datePosted: job.datePosted,
                    status: job.status,
                    applicantLimit: job.applicantLimit,
                    currentApplicants: job.currentApplicants,
                    jobDescription: job.jobDescription,
                    companyIcon: job.companyIcon
                }));
                return APP.jobPostsData;
            } else {
                console.error("Failed to fetch job posts:", result.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching job posts:", error);
            return [];
        }
    };

    APP.API.fetchJobDetails = async function (jobId, forceRefresh = false) {
        if (!forceRefresh && APP.jobDetailsCache[jobId]) {
            return APP.jobDetailsCache[jobId];
        }

        try {
            const response = await fetch(`${BASE_URL}/fetch_job_details.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ job_id: jobId })
            });

            const result = await response.json();

            if (result.status === "success") {
                APP.jobDetailsCache[jobId] = result.data;
                return result.data;
            } else {
                console.error("Failed to fetch job details:", result.message);
                return null;
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
            return null;
        }
    };

    APP.API.fetchApplicants = async function (jobId) {
        try {
            const response = await fetch(`${BASE_URL}/fetch_applicants.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ job_id: jobId })
            });

            const result = await response.json();

            if (result.status === "success") {
                APP.applicantsData = result.data;

                // Update cache
                const acceptedCount = result.data.filter(a => a.status === 'accepted').length;
                APP.acceptedCountsCache[jobId] = acceptedCount;

                return APP.applicantsData;
            } else {
                console.error("Failed to fetch applicants:", result.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching applicants:", error);
            return [];
        }
    };

    APP.API.fetchAllApplicants = async function () {
        try {
            const fetchPromises = APP.jobPostsData.map(async (job) => {
                const response = await fetch(`${BASE_URL}/fetch_applicants.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ job_id: job.id })
                });

                const result = await response.json();

                if (result.status === "success") {
                    const acceptedCount = result.data.filter(a => a.status === 'accepted').length;
                    APP.acceptedCountsCache[job.id] = acceptedCount;
                }
            });

            await Promise.all(fetchPromises);
            console.log(`✅ Pre-loaded accepted counts for ${APP.jobPostsData.length} jobs:`, APP.acceptedCountsCache);
        } catch (error) {
            console.error('Error pre-loading applicants:', error);
        }
    };

    // Note: Other specific update APIs (like accept/reject applicant) would go here
    // For now, I'm just including the read functions as in the original file

})(window.JobListingApp);
