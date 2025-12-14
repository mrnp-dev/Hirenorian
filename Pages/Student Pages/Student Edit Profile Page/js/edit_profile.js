/**
 * Edit Profile - Main Entry Point
 * 
 * This file serves as the main entry point for the edit profile functionality.
 * The code has been refactored into separate modules for better maintainability:
 * 
 * Module Structure:
 * ================
 * 
 * 1. ui-controls.js (no dependencies)
 *    - Profile dropdown toggle
 *    - Modal open/close functionality
 *    - Modal event listeners
 * 
 * 2. validation.js (no dependencies)
 *    - Error display/removal utilities
 *    - Email validation
 *    - Phone number validation
 *    - Location validation
 * 
 * 3. contact-modal.js (depends on validation.js)
 *    - Contact information modal functionality
 *    - Real-time validation for contact fields
 *    - Contact form submission handling
 * 
 * 4. skills-modal.js (depends on validation.js)
 *    - Skills management modal
 *    - Add/remove skills functionality
 *    - Technical and soft skills handling
 * 
 * 5. education-modal.js (depends on ui-controls.js)
 *    - Educational background modal
 *    - Edit/delete education entries
 *    - DOM updates for education timeline
 * 
 * 6. experience-modal.js (depends on ui-controls.js)
 *    - Work experience modal
 *    - Edit/delete experience entries
 *    - Edit/delete experience entries
 *    - DOM updates for experience timeline
 * 
 * 7. photo-modal.js (depends on ui-controls.js)
 *    - Profile photo update modal
 *    - Image preview functionality
 *    - AJAX form submission for photo upload
 * 
 * Loading Order:
 * =============
 * The modules must be loaded in the following order in your HTML:
 * 
 * 1. ui-controls.js
 * 2. validation.js
 * 3. contact-modal.js
 * 4. skills-modal.js
 * 5. education-modal.js
 * 6. experience-modal.js
 * 7. photo-modal.js (depends on ui-controls.js)
 * 8. edit_profile.js (this file)
 * 
 * Note: Ensure all module files are included in your HTML before this file.
 */

// This file is intentionally minimal as all functionality has been moved to modules
// console.log('Edit Profile modules loaded successfully');

// Import the async data loader
import { initProfileData } from './profile-data.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('%cEdit Profile Loading...', 'color: #3b82f6; font-size: 14px;');

    // Initialize UI-Controls if needed directly or just wait for other events
    // ui-controls.js might already be running its DOMContentLoaded listeners?
    // ui-controls.js is a script tag, so it runs immediately.

    // Initialize Async Data
    const email = window.STUDENT_EMAIL || null;
    if (email) {
        initProfileData(email);
    } else {
        console.warn('No student email found so cannot fetch profile data.');
    }
});
