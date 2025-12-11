// advancedFilters.js - Advanced Filters modal core functionality

import { updateSelectedCourses, updateSelectedTags, selectedFilters, updateSelectedFiltersDisplay } from './selectedFilters.js';
import { loadStudentTags } from './studentTags.js';

let filtersData = null;

export function initAdvancedFilters() {
    const moreFiltersBtn = document.querySelector('.btn-more-filters');
    const filtersModalOverlay = document.getElementById('filtersModalOverlay');
    const filtersModal = document.getElementById('filtersModal');
    const closeFiltersModalBtn = document.getElementById('closeFiltersModal');
    const cancelFiltersBtn = document.getElementById('cancelFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    const filterSearchInput = document.getElementById('filterSearch');

    // Load filters data
    async function loadFiltersData() {
        try {
            const response = await fetch('../json/filters_data.json');
            filtersData = await response.json();
            buildFiltersUI();
        } catch (error) {
            console.error('Failed to load filters data:', error);
        }
    }

    // Build filters UI
    function buildFiltersUI() {
        buildStudentCourses();
        buildCareerTags();
        initializeSidebarNavigation();
        // Auto-check student's tags after UI is built
        loadStudentTags();
    }

    // Initialize Sidebar Navigation
    function initializeSidebarNavigation() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const filterViews = document.querySelectorAll('.filter-view');

        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;

                // Remove active class from all items and views
                sidebarItems.forEach(si => si.classList.remove('active'));
                filterViews.forEach(fv => fv.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Show corresponding view
                const targetView = document.getElementById(`${section}-view`);
                if (targetView) {
                    targetView.classList.add('active');
                }
            });
        });
    }

    // Build Student Courses section
    function buildStudentCourses() {
        const container = document.getElementById('studentCoursesContainer');
        container.innerHTML = '';

        filtersData.studentCourses.forEach((college, index) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'filter-category';
            categoryDiv.dataset.categoryName = college.college.toLowerCase();

            const headerDiv = document.createElement('div');
            headerDiv.className = 'category-header';
            headerDiv.innerHTML = `
                <h4>${college.college}</h4>
                <div class="category-toggle">
                    <span class="count">${college.courses.length}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            `;

            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'category-items';

            college.courses.forEach(course => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'filter-checkbox';
                checkboxDiv.dataset.searchText = course.toLowerCase();

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `course-${course.replace(/\s+/g, '-')}`;
                checkbox.value = course;
                checkbox.addEventListener('change', () => updateSelectedCourses());

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = course;

                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                itemsDiv.appendChild(checkboxDiv);
            });

            categoryDiv.appendChild(headerDiv);
            categoryDiv.appendChild(itemsDiv);
            container.appendChild(categoryDiv);

            // Toggle category
            headerDiv.addEventListener('click', () => {
                categoryDiv.classList.toggle('expanded');
            });
        });
    }

    // Build Career Tags section
    function buildCareerTags() {
        const container = document.getElementById('careerTagsContainer');
        container.innerHTML = '';

        filtersData.careerTags.forEach((category, index) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'filter-category';
            categoryDiv.dataset.categoryName = category.category.toLowerCase();

            const headerDiv = document.createElement('div');
            headerDiv.className = 'category-header';
            headerDiv.innerHTML = `
                <h4>${category.category}</h4>
                <div class="category-toggle">
                    <span class="count">${category.tags.length}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            `;

            const itemsDiv = document.createElement('div');
            itemsDiv.className = 'category-items';

            category.tags.forEach(tag => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'filter-checkbox';
                checkboxDiv.dataset.searchText = tag.toLowerCase();

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `tag-${tag.replace(/\s+/g, '-').replace(/\//g, '-')}`;
                checkbox.value = tag;
                checkbox.addEventListener('change', () => updateSelectedTags());

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = tag;

                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                itemsDiv.appendChild(checkboxDiv);
            });

            categoryDiv.appendChild(headerDiv);
            categoryDiv.appendChild(itemsDiv);
            container.appendChild(categoryDiv);

            // Toggle category
            headerDiv.addEventListener('click', () => {
                categoryDiv.classList.toggle('expanded');
            });
        });
    }

    // Search functionality
    if (filterSearchInput) {
        filterSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            // Get active view
            const activeView = document.querySelector('.filter-view.active');
            if (!activeView) return;

            // Search only in active view's checkboxes
            const allCheckboxes = activeView.querySelectorAll('.filter-checkbox[data-search-text]');
            const allCategories = activeView.querySelectorAll('.filter-category');

            if (searchTerm === '') {
                // Show all
                allCheckboxes.forEach(cb => cb.classList.remove('hidden'));
                allCategories.forEach(cat => cat.classList.remove('hidden'));
            } else {
                // Hide non-matching
                allCheckboxes.forEach(cb => {
                    const text = cb.dataset.searchText;
                    if (text.includes(searchTerm)) {
                        cb.classList.remove('hidden');
                    } else {
                        cb.classList.add('hidden');
                    }
                });

                // Hide empty categories
                allCategories.forEach(cat => {
                    const visibleItems = cat.querySelectorAll('.filter-checkbox:not(.hidden)');
                    if (visibleItems.length === 0) {
                        cat.classList.add('hidden');
                    } else {
                        cat.classList.remove('hidden');
                        cat.classList.add('expanded'); // Auto-expand when searching
                    }
                });
            }
        });
    }

    // Open modal
    function openFiltersModal() {
        filtersModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeFiltersModal() {
        filtersModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Apply filters
    function applyFilters() {
        console.log('Applied Filters:', selectedFilters);
        // TODO: Implement actual filtering logic here
        // This would filter the job listings based on selectedFilters
        closeFiltersModal();
    }

    // Clear all filters
    function clearAllFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('.filters-modal input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset selected filters (direct mutation since it's imported)
        selectedFilters.courses = [];
        selectedFilters.careerTags = [];

        // Clear search
        if (filterSearchInput) {
            filterSearchInput.value = '';
            filterSearchInput.dispatchEvent(new Event('input'));
        }

        // Update display
        updateSelectedFiltersDisplay();
    }

    // Event listeners
    if (moreFiltersBtn) {
        moreFiltersBtn.addEventListener('click', openFiltersModal);
    }

    if (closeFiltersModalBtn) {
        closeFiltersModalBtn.addEventListener('click', closeFiltersModal);
    }

    if (cancelFiltersBtn) {
        cancelFiltersBtn.addEventListener('click', closeFiltersModal);
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Clear selected button in the selected filters bar
    const clearSelectedBtn = document.getElementById('clearSelectedBtn');
    if (clearSelectedBtn) {
        clearSelectedBtn.addEventListener('click', clearAllFilters);
    }

    // Close modal when clicking overlay
    if (filtersModalOverlay) {
        filtersModalOverlay.addEventListener('click', (e) => {
            if (e.target === filtersModalOverlay) {
                closeFiltersModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filtersModalOverlay.classList.contains('active')) {
            closeFiltersModal();
        }
    });

    // Initialize filters
    loadFiltersData();
}
