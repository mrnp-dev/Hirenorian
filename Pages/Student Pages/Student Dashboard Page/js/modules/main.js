
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

    // Get Student ID from global scope (injected by PHP)
    const studentId = typeof STUDENT_ID !== 'undefined' ? STUDENT_ID : null;

    if (studentId) {
        // Initialize Data Components
        initActivityLogs(studentId);
        initApplicationCounts(studentId);
        initRecommendations(studentId);
        initApplicationHistory(studentId);
    } else {
        console.warn('Student ID not found. Data components will not load.');
    }
});
