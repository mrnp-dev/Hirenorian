
// ========================================
// ACTIVITY LOG MODULE
// ========================================

import { fetchAuditLogsAPI } from './api.js';
import { formatTimestamp, getIconForAction, createLogDescription } from './utils.js';

function renderAuditLogs(logs) {
    const container = document.getElementById('auditLogContainer');
    const countEl = document.getElementById('logCount');

    // If container is missing, abort
    if (!container) return;

    if (!logs || logs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>No activity logged yet</p>
            </div>
        `;
        if (countEl) countEl.textContent = '0 activities';
        return;
    }

    if (countEl) countEl.textContent = `${logs.length} ${logs.length === 1 ? 'activity' : 'activities'}`;

    const timeline = document.createElement('div');
    timeline.className = 'audit-log-timeline';

    logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'audit-log-item';

        const actionClass = log.action_type.toLowerCase();
        const icon = getIconForAction(log.action_type);

        item.innerHTML = `
            <div class="log-icon ${actionClass}">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="log-content">
                <div class="log-header">
                    <div class="log-action">${log.action_type}</div>
                    <div class="log-timestamp">${formatTimestamp(log.action_timestamp)}</div>
                </div>
                <div class="log-details">
                    ${createLogDescription(log)}
                </div>
            </div>
        `;

        timeline.appendChild(item);
    });

    container.innerHTML = '';
    container.appendChild(timeline);
}

export async function initActivityLogs(studentId) {
    const container = document.getElementById('auditLogContainer');
    if (!studentId) {
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>Unable to load activity logs.</p>
                </div>
            `;
        }
        return;
    }

    try {
        const data = await fetchAuditLogsAPI(studentId);
        if (data.status === 'success') {
            renderAuditLogs(data.data);
        } else {
            console.error('[Dashboard] Error fetching logs:', data.message);
            if (container) {
                container.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <p>Failed to load activity logs</p>
                </div>
            `;
            }
        }
    } catch (error) {
        console.error('[Dashboard] Error accessing logs API:', error);
    }
}
