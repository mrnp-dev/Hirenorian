
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
            <div class="no-applications" style="text-align: center; padding: 40px 20px; color: #64748b; background: #f8fafc; border-radius: 12px; border: 2px dashed #e2e8f0;">
                <div style="background: #fff; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <i class="fa-solid fa-paper-plane" style="font-size: 24px; color: #800000;"></i>
                </div>
                <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No applications yet</h3>
                <p style="margin-bottom: 24px; font-size: 14px; color: #64748b;">Your application pipeline is empty. Start exploring opportunities!</p>
                <a href="../../Internship Search Page/php/internship_search.php" style="display: inline-flex; align-items: center; justify-content: center; background: #800000; color: white; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(128, 0, 0, 0.2);">
                    <i class="fa-solid fa-magnifying-glass" style="margin-right: 8px;"></i>Browse Internships
                </a>
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
