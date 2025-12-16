
// ========================================
// RECOMMENDATIONS MODULE
// ========================================

import { fetchRecommendedJobsAPI, fetchStudentInfoAPI } from './api.js';

// --- Modal Logic ---
const modal = document.getElementById('jobDetailsModal');
const closeBtn = document.getElementById('closeJobModal');
const applyBtn = document.getElementById('modal-btn-apply');

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openJobModal(job) {
    if (!modal) return;

    // Populate Modal
    document.getElementById('modal-detail-title').textContent = job.title;
    document.getElementById('modal-detail-company').textContent = job.company_name;
    document.getElementById('modal-detail-city').textContent = job.city;
    document.getElementById('modal-detail-province').textContent = job.province;
    document.getElementById('modal-detail-work-type').textContent = job.work_type;
    document.getElementById('modal-detail-category').textContent = job.tags ? job.tags[0] : 'General';
    document.getElementById('modal-detail-posted-date').textContent = job.date_posted || 'Recently';
    document.getElementById('modal-detail-description').innerHTML = job.description;

    const logo = document.getElementById('modal-detail-logo');
    logo.src = job.company_icon || '../../../Landing Page/Images/dhvsulogo.png';
    logo.onerror = () => logo.src = '../../../Landing Page/Images/dhvsulogo.png';

    // Helper for lists
    const populateList = (elementId, items) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.innerHTML = '';
        if (items && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                el.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'None specified';
            li.style.color = '#999';
            el.appendChild(li);
        }
    };

    // Helper for comma-separated strings if API returns string or array
    const parseList = (input) => {
        if (Array.isArray(input)) return input;
        if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(s => s);
        return [];
    };

    populateList('modal-detail-responsibilities', parseList(job.responsibilities));
    populateList('modal-detail-qualifications', parseList(job.qualifications));
    populateList('modal-detail-skills', parseList(job.skills));
    populateList('modal-detail-documents', parseList(job.requirements)); // "requirements" often mapped to documents in other parts

    // Tags
    const tagsContainer = document.getElementById('modal-detail-tags');
    tagsContainer.innerHTML = '';
    const tags = parseList(job.tags);
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag-detail';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // Apply Button
    if (applyBtn) {
        applyBtn.onclick = () => {
            window.location.href = `../../Application Form Page/php/application_form.php?job_id=${job.post_id}`;
        };
    }

    // Show Modal
    modal.classList.add('active');
}


function createRecommendationCard(job) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.style.cursor = 'pointer'; // Make readable as clickable

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

    // Click on Card -> Open Modal
    card.addEventListener('click', (e) => {
        // If clicking apply button, don't open modal (let button handler handle it, or just use modal apply)
        // Actually, button handler below redirects.
        // If user clicks "Apply Now", maybe we should just redirect.
        if (e.target.classList.contains('btn-quick-apply')) {
            return;
        }
        openJobModal(job);
    });

    // Add click handler to button (Direct apply)
    const applyBtn = card.querySelector('.btn-quick-apply');
    if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
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

        if (studentData.status !== 'success' || !studentData.data || !studentData.data.basic_info) {
            console.warn('[Dashboard] Could not fetch student tags for recommendations');
            // Fallback or exit
            return;
        }

        const basic = studentData.data.basic_info;
        const studentTags = [basic.tag1, basic.tag2, basic.tag3].filter(tag => tag && tag.trim() !== '');

        if (studentTags.length === 0) {
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
