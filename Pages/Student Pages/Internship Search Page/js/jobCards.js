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
        const { jobs, count } = event.detail;
        displayJobs(jobs);
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
    function displayJobs(jobs) {
        console.log(`[JobCards] Displaying ${jobs.length} jobs`);

        const jobListingsContainer = document.querySelector('.job-list');
        if (!jobListingsContainer) {
            console.error('[JobCards] Job list container not found');
            return;
        }

        // Clear existing job cards
        jobListingsContainer.innerHTML = '';

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

        // Auto-select first job
        if (jobCards.length > 0) {
            jobCards[0].click();
        }
    }

    function createJobCard(job, index) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.dataset.id = job.post_id;

        const companyIcon = job.company_icon || '../../../Landing Page/Images/default-company.jpg';

        card.innerHTML = `
            <div class="job-card-header">
                <img src="${companyIcon}" alt="${job.company_name}" class="company-logo" onerror="this.src='../../../Landing Page/Images/default-company.jpg'">
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p class="company-name">${job.company_name}</p>
                </div>
            </div>
            <p class="job-snippet">${job.description.substring(0, 100)}...</p>
            <div class="job-tags">
                ${job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                ${job.tags.length > 3 ? `<span class="tag-more">+${job.tags.length - 3}</span>` : ''}
            </div>
        `;

        return card;
    }

    function updateJobDetails(data) {
        console.log('[JobCards] Updating job details:', data.title);

        const placeholder = document.getElementById('jobDetailsPlaceholder');
        const detailsCard = document.getElementById('jobDetailsCard');

        // Toggle visibility
        if (placeholder) placeholder.style.display = 'none';
        if (detailsCard) detailsCard.style.display = 'block';

        // Update DOM elements
        const elements = {
            'detail-title': data.title,
            'detail-company': data.company_name,
            'detail-city': data.city,
            'detail-province': data.province,
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
            tagsContainer.innerHTML = data.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // Update lists
        updateList('detail-responsibilities', data.responsibilities);
        updateList('detail-qualifications', data.qualifications);
        updateList('detail-skills', data.skills);
        updateList('detail-documents', data.documents);

        // Add animation
        if (detailsCard) {
            detailsCard.classList.add('fade-in');
            setTimeout(() => detailsCard.classList.remove('fade-in'), 300);
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
