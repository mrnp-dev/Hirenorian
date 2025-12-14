
// ========================================
// MAIN ENTRY POINT
// ========================================

import { initProfileDropdown } from './ui.js';
import { initActivityLogs } from './activity.js';
import { initApplicationCounts } from './stats.js';
import { initRecommendations } from './recommendations.js';
import { initApplicationHistory } from './applications.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎓 Student Dashboard Loading...', 'color: #3b82f6; font-size: 14px; font-weight: bold;');

    // Initialize UI
    initProfileDropdown();

    // Get Student ID and Email from global scope
    const studentId = window.STUDENT_ID || null;
    const studentEmail = window.STUDENT_EMAIL || null;

    if (studentId) {
        // Initialize Data Components
        initActivityLogs(studentId);
        initApplicationCounts(studentId);
        if (studentEmail) {
            console.log('[Dashboard] Initializing recommendations with email:', studentEmail);
            initRecommendations(studentEmail);
        } else {
            console.warn('[Dashboard] No student email found, skipping recommendations.');
        }
        initApplicationHistory(studentId);
    } else {
        console.warn('Student ID not found. Data components will not load.');
    }
});
