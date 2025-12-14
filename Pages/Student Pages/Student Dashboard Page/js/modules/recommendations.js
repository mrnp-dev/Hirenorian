
// ========================================
// RECOMMENDATIONS MODULE
// ========================================

import { fetchRecommendedJobsAPI, fetchStudentInfoAPI } from './api.js';

function createRecommendationCard(job) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';

    // Use company icon or fallback image
    const imageUrl = job.company_icon || '../../../Landing Page/Images/dhvsu-bg-image.jpg';

    // Extract top 3 tags
    const tagsHTML = (job.tags || []).slice(0, 3).map(tag =>
        `<span class="rec-tag">${tag}</span>`
    ).join('');

    card.innerHTML = `
        <img src="${imageUrl}" alt="${job.title}" class="recommendation-image" onerror="this.src='../../../Landing Page/Images/dhvsu-bg-image.jpg'">
        <div class="recommendation-content">
            <h3>${job.title}</h3>
            <p>${job.company_name}</p>
            <div class="recommendation-tags">
                ${tagsHTML}
                ${job.work_type ? `<span class="rec-tag">${job.work_type}</span>` : ''}
            </div>
            <div class="recommendation-footer">
                <button class="btn-quick-apply" data-job-id="${job.post_id}">Apply Now</button>
            </div>
        </div>
    `;

    // Add click handler to button
    const applyBtn = card.querySelector('.btn-quick-apply');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            window.location.href = `../../Application Form Page/php/application_form.php?job_id=${job.post_id}`;
        });
    }

    return card;
}

function displayRecommendations(jobs) {
    const recommendationsGrid = document.querySelector('.recommendations-grid');
    if (!recommendationsGrid) return;

    recommendationsGrid.innerHTML = '';

    if (jobs.length === 0) {
        recommendationsGrid.innerHTML = `
            <div class="no-recommendations">
                <i class="fa-solid fa-inbox"></i>
                <p>No recommendations available at the moment</p>
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        recommendationsGrid.appendChild(createRecommendationCard(job));
    });
}

export async function initRecommendations(studentEmail) {
    if (!studentEmail) return;

    try {
        // Step 1: Get Tags
        const studentData = await fetchStudentInfoAPI(studentEmail);
        console.log('[Dashboard] Recommendations student info response:', JSON.stringify(studentData));

        if (studentData.status !== 'success') {
            console.error('[Dashboard] API returned status:', studentData.status, 'Message:', studentData.message);
            return;
        }

        if (!studentData.data || !studentData.data.basic_info) {
            console.error('[Dashboard] API response missing data structure', studentData);
            return;
        }


        const basic = studentData.data.basic_info;
    const studentTags = [basic.tag1, basic.tag2, basic.tag3].filter(tag => tag && tag.trim() !== '');

    if (studentTags.length === 0) {
        // Could fallback to popular jobs
        console.warn('[Dashboard] No tags found for recommendations');
        return;
    }

    // Step 2: Search Jobs
    const jobsData = await fetchRecommendedJobsAPI(studentTags);
    if (jobsData.status === 'success' && jobsData.data) {
        displayRecommendations(jobsData.data.slice(0, 3));
    }

} catch (error) {
    console.error('[Dashboard] Error initializing recommendations:', error);
}
}
