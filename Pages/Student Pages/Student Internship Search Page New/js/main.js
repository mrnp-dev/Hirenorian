import { initJobCards } from './jobCards.js';
import { initLocationFilter } from './locationFilter.js';
import { initTypeFilter } from './typeFilter.js';
import { initAdvancedFilters } from './advancedFilters.js';
import { initActiveFilters } from './activeFilters.js';
import { initSearchInput } from './searchInput.js';
import { initApplyFilterButton } from './applyFilterButton.js';
import { initStudentProfile } from './profile.js'; // Import profile handler

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI modules
    initJobCards();
    initLocationFilter();
    initTypeFilter();
    initAdvancedFilters();
    initActiveFilters();
    initSearchInput();
    initApplyFilterButton();

    // Initialize Async Data
    const email = sessionStorage.getItem('email');
    if (email) {
        initStudentProfile(email);
    } else {
        console.warn('No student email in storage');
    }
});
