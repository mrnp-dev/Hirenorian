
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
            <div class="no-applications">
                <i class="fa-solid fa-inbox"></i>
                <p>No applications submitted yet</p>
                <p class="hint">Start by browsing internship opportunities!</p>
            </div>
        `;
        return;
    }

    applications.forEach(app => {
        applicationsList.appendChild(createApplicationCard(app));
    });
}

export async function initApplicationHistory(studentId) {
    if (!studentId) return;

    try {
        const data = await fetchApplicationHistoryAPI(studentId);
        if (data.status === 'success') {
            displayApplicationHistory(data.data);
        } else {
            console.error('[Dashboard] Error fetching app history:', data.message);
        }
    } catch (error) {
        console.error('[Dashboard] Error init app history:', error);
    }
}
