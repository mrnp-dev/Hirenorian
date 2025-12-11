// main.js - Entry point for Internship Search page

import { initJobCards } from './jobCards.js';
import { initLocationFilter } from './locationFilter.js';
import { initTypeFilter } from './typeFilter.js';
import { initAdvancedFilters } from './advancedFilters.js';
import { initActiveFilters } from './activeFilters.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initJobCards();
    initLocationFilter();
    initTypeFilter();
    initAdvancedFilters();
    initActiveFilters();
});
