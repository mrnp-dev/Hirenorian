
// ========================================
// APPLICATIONS MODULE
// ========================================

import { fetchApplicationHistoryAPI } from './api.js';

function createApplicationCard(app) {
    const card = document.createElement('div');
    card.className = `application-card ${app.status_class}`;

    const companyIcon = app.company_icon || '../../../Landing Page/Images/default-company.jpg';
    const statusText = app.status;

    card.innerHTML = `
        <div class="app-header">
            <div class="app-company">
                <img src="${companyIcon}" alt="${app.company_name}" class="company-logo-small" onerror="this.src='../../../Landing Page/Images/default-company.jpg'">
                <div class="app-info">
                    <h4>${app.job_title}</h4>
                    <p>${app.company_name}</p>
                </div>
            </div>
            <span class="app-status-badge ${app.status_class}">${statusText}</span>
        </div>
        <div class="app-meta">
            <div class="app-meta-item">
                <i class="fa-solid fa-calendar"></i>
                Applied ${app.date_applied_formatted}
            </div>
            <div class="app-meta-item">
                <i class="fa-solid fa-location-dot"></i>
                ${app.location}
            </div>
        </div>
    `;

    return card;
}

function displayApplicationHistory(applications) {
    const applicationsList = document.querySelector('.applications-list');
    if (!applicationsList) return;

    applicationsList.innerHTML = '';

    if (applications.length === 0) {
        applicationsList.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fa-solid fa-folder-open" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                <h3 style="color: #64748b; font-size: 18px; margin-bottom: 8px;">No applications yet</h3>
                <p style="color: #94a3b8; margin-bottom: 24px;">Start your journey by finding the perfect internship.</p>
                <a href="../../Student Internship Search Page New/php/internship_search.php" style="display: inline-flex; align-items: center; justify-content: center; background: #800000; color: white; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(128, 0, 0, 0.2);">
                    <i class="fa-solid fa-magnifying-glass" style="margin-right: 8px;"></i> Find Internships
                </a>
            </div>
        `;
        return;
    }

    applications.forEach(app => {
        applicationsList.appendChild(createApplicationCard(app));
    });
}

let allApplications = [];

export async function initApplicationHistory(studentId) {
    if (!studentId) return;

    try {
        const data = await fetchApplicationHistoryAPI(studentId);
        if (data.status === 'success') {
            allApplications = data.data;
            displayApplicationHistory(allApplications);
            initFilterListeners();
        } else {
            console.error('[Dashboard] Error fetching app history:', data.message);
        }
    } catch (error) {
        console.error('[Dashboard] Error init app history:', error);
    }
}

function initFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.dataset.filter; // all, accepted, pending, rejected
            filterApplications(filter);
        });
    });
}

function filterApplications(filter) {
    if (filter === 'all') {
        displayApplicationHistory(allApplications);
        return;
    }

    const filtered = allApplications.filter(app => {
        const status = app.status.toLowerCase();
        // Map UI filters to API status values roughly
        if (filter === 'accepted') return status.includes('accept') || status.includes('offer') || status.includes('hired');
        if (filter === 'pending') return status.includes('pending') || status.includes('review') || status.includes('interview');
        if (filter === 'rejected') return status.includes('reject') || status.includes('decline');
        return false;
    });

    displayApplicationHistory(filtered);
}
