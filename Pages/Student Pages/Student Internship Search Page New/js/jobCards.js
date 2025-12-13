// jobCards.js - Handle job card interactions and details panel updates

export function initJobCards() {
    console.log('[JobCards] Initializing job cards module');

    // Listen for search started event
    document.addEventListener('searchStarted', () => {
        console.log('[JobCards] Search started - showing loading state');
        showLoadingState();
    });

    // Listen for jobs loaded event from API
    document.addEventListener('jobsLoaded', (event) => {
        console.log('[JobCards] Jobs loaded event received:', event.detail);
        const { jobs, count, pagination } = event.detail;
        displayJobs(jobs, pagination);
    });

    // Listen for search errors
    document.addEventListener('searchError', (event) => {
        console.log('[JobCards] Search error:', event.detail);
        showErrorState(event.detail.message);
    });

    // Show loading state
    function showLoadingState() {
        const jobListingsContainer = document.querySelector('.job-list');
        if (!jobListingsContainer) return;

        jobListingsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p>Searching for jobs...</p>
            </div>
        `;
    }

    // Show error state
    function showErrorState(message) {
        const jobListingsContainer = document.querySelector('.job-list');
        if (!jobListingsContainer) return;

        jobListingsContainer.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h3>Search Error</h3>
                <p>${message}</p>
                <p class="error-hint">Please try again or adjust your filters</p>
            </div>
        `;
    }

    // Function to display jobs in the DOM
    function displayJobs(jobs, pagination) {
        console.log(`[JobCards] Displaying ${jobs.length} jobs`);

        const jobListingsContainer = document.querySelector('.job-list');
        const paginationContainer = document.getElementById('paginationContainer');

        if (!jobListingsContainer) {
            console.error('[JobCards] Job list container not found');
            return;
        }

        // Clear existing job cards
        jobListingsContainer.innerHTML = '';
        if (paginationContainer) paginationContainer.innerHTML = '';

        if (jobs.length === 0) {
            jobListingsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters to see more results</p>
                </div>
            `;
            return;
        }

        // Create job cards
        jobs.forEach((job, index) => {
            const jobCard = createJobCard(job, index + 1);
            jobListingsContainer.appendChild(jobCard);
        });

        // Render pagination if available
        if (pagination && pagination.total_pages > 1) {
            renderPagination(pagination);
        }

        // Attach click handlers
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            card.addEventListener('click', function () {
                console.log('[JobCards] Job card clicked:', this.dataset.id);

                // Remove active class from all cards
                jobCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                this.classList.add('active');

                // Get Job ID
                const jobId = this.dataset.id;
                const jobData = jobs.find(j => j.post_id == jobId);

                if (jobData) {
                    updateJobDetails(jobData);
                }
            });
        });

        // Ensure no job card is auto-selected - show placeholder instead
        // Remove any active class from all cards
        jobCards.forEach(card => card.classList.remove('active'));

        // Ensure placeholder is visible and details card is hidden
        const placeholder = document.getElementById('jobDetailsPlaceholder');
        const detailsCard = document.getElementById('jobDetailsCard');
        if (placeholder) placeholder.style.display = 'flex';
        if (detailsCard) detailsCard.style.display = 'none';
    }

    function renderPagination(pagination) {
        const container = document.getElementById('paginationContainer');
        if (!container) return;

        const { current_page, total_pages } = pagination;
        let html = '<div class="pagination">';

        // Prev Button
        html += `<button class="page-btn prev-btn" ${current_page === 1 ? 'disabled' : ''} data-page="${current_page - 1}">
                    <i class="fa-solid fa-chevron-left"></i>
                 </button>`;

        // Page Numbers
        // Simple logic: Show 1, ... Current-1, Current, Current+1, ... Last
        const range = 2; // Neighbors
        for (let i = 1; i <= total_pages; i++) {
            if (i === 1 || i === total_pages || (i >= current_page - range && i <= current_page + range)) {
                html += `<button class="page-btn number-btn ${i === current_page ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === current_page - range - 1 || i === current_page + range + 1) {
                html += `<span class="page-dots">...</span>`;
            }
        }

        // Next Button
        html += `<button class="page-btn next-btn" ${current_page === total_pages ? 'disabled' : ''} data-page="${current_page + 1}">
                    <i class="fa-solid fa-chevron-right"></i>
                 </button>`;

        html += '</div>';

        // Info Text
        html += `<div class="pagination-info">Showing page ${current_page} of ${total_pages}</div>`;

        container.innerHTML = html;

        // Add Event Listeners
        container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled && !btn.classList.contains('active')) {
                    const page = parseInt(btn.dataset.page);
                    document.dispatchEvent(new CustomEvent('changePage', {
                        detail: { page: page }
                    }));
                }
            });
        });
    }

    function createJobCard(job, index) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.dataset.id = job.post_id;

        const companyIcon = job.company_icon || '../../../Landing Page/Images/default-company.jpg';

        // Format relative time (simple approximation)
        const postedDate = job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently';

        card.innerHTML = `
            <div class="job-card-header">
                <img src="${companyIcon}" alt="${job.company_name}" class="company-logo-small" onerror="this.src='../../../Landing Page/Images/default-company.jpg'">
                <div class="job-info-mini">
                    <h3>${job.title}</h3>
                    <p class="company-name-mini">${job.company_name}</p>
                </div>
            </div>
            
            <div class="job-tags-mini">
                ${job.tags.slice(0, 3).map(tag => `<span class="tag-mini">${tag}</span>`).join('')}
                ${job.tags.length > 3 ? `<span class="tag-mini">+${job.tags.length - 3}</span>` : ''}
            </div>
            
            <div class="job-meta-mini">
                <span>${job.work_type}</span>
                <span>${job.city}</span>
                <span>${postedDate}</span>
            </div>
        `;

        return card;
    }

    function updateJobDetails(data) {
        console.log('[JobCards] Updating job details for:', data.title);
        console.log('[JobCards] Full Job Data Object:', data);
        console.log('[JobCards] Responsibilities count:', data.responsibilities?.length);
        console.log('[JobCards] Qualifications count:', data.qualifications?.length);
        console.log('[JobCards] Skills count:', data.skills?.length);
        console.log('[JobCards] Resume Required:', data.resume_required);

        const placeholder = document.getElementById('jobDetailsPlaceholder');
        const detailsCard = document.getElementById('jobDetailsCard');

        // Toggle visibility
        if (placeholder) placeholder.style.display = 'none';
        if (detailsCard) detailsCard.style.display = 'flex'; // Flex for layout

        // Update DOM elements
        const elements = {
            'detail-title': data.title,
            'detail-company': data.company_name,
            'detail-city': data.city || 'N/A',
            'detail-province': data.province || 'N/A',
            'detail-work-type': data.work_type,
            'detail-category': data.category,
            'detail-posted-date': `Posted ${data.created_at} `,
            'detail-description': data.description
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update logo
        const logo = document.getElementById('detail-logo');
        if (logo) {
            logo.src = data.company_icon || '../../../Landing Page/Images/default-company.jpg';
            logo.onerror = () => logo.src = '../../../Landing Page/Images/default-company.jpg';
        }

        // Update tags
        const tagsContainer = document.getElementById('detail-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = (data.tags || []).map(tag =>
                `<span class="tag-mini">${tag}</span>`
            ).join('');
        }

        // Build document requirements array from new boolean flags
        const documents = [];
        if (data.resume_required) {
            documents.push('Resume');
        }
        if (data.cover_letter_required) {
            documents.push('Cover Letter');
        }
        // If neither is required explicitly, show optional message
        if (documents.length === 0) {
            documents.push('No specific documents required');
        }

        // Update lists with defensive checks
        updateList('detail-responsibilities', data.responsibilities || []);
        updateList('detail-qualifications', data.qualifications || []);
        updateList('detail-skills', data.skills || []);
        updateList('detail-documents', documents);

        // Add animation
        if (detailsCard) {
            detailsCard.classList.remove('fade-in');
            void detailsCard.offsetWidth; // Trigger reflow
            detailsCard.classList.add('fade-in');
        }

        // Store job data for application form
        if (data.post_id) {
            sessionStorage.setItem('applicationJobId', data.post_id);
            sessionStorage.setItem('applicationJobData', JSON.stringify({
                title: data.title,
                company_name: data.company_name,
                city: data.city,
                province: data.province,
                work_type: data.work_type,
                category: data.category,
                resume: data.resume_required || false,
                cover_letter: data.cover_letter_required || false
            }));
        }

        // Add Apply Now button handler
        const applyNowBtn = detailsCard?.querySelector('.btn-apply-now');
        if (applyNowBtn) {
            applyNowBtn.onclick = () => {
                if (data.post_id) {
                    window.location.href = `../../Application Form Page/php/application_form.php?job_id=${data.post_id}`;
                } else {
                    alert('Job information is missing. Please select a job again.');
                }
            };
        }
    }

    function updateList(elementId, items) {
        const list = document.getElementById(elementId);
        if (!list) return;

        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }
}
