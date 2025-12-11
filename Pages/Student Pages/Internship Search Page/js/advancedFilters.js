import { updateSelectedCourses, updateSelectedTags, selectedFilters, updateSelectedFiltersDisplay } from './selectedFilters.js';
import { loadStudentTags } from './studentTags.js';

let filtersData = null;
let originalFiltersState = null; // Store original state when modal opens

export function initAdvancedFilters() {
    const moreFiltersBtn = document.querySelector('.btn-more-filters');
    const filtersModalOverlay = document.getElementById('filtersModalOverlay');
    const filtersModal = document.getElementById('filtersModal');
    const closeFiltersModalBtn = document.getElementById('closeFiltersModal');
    const cancelFiltersBtn = document.getElementById('cancelFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    const filterSearchInput = document.getElementById('filterSearch');

    // Custom confirmation dialog elements
    const confirmDialogOverlay = document.getElementById('confirmDialogOverlay');
    const confirmDialogMessage = document.getElementById('confirmDialogMessage');
    const btnConfirmApply = document.getElementById('btnConfirmApply');
    const btnConfirmDiscard = document.getElementById('btnConfirmDiscard');

    // Save current filter state (snapshot)
    function saveFiltersState() {
        originalFiltersState = {
            courses: [...selectedFilters.courses],
            careerTags: [...selectedFilters.careerTags],
            checkboxStates: {}
        };

        // Save checkbox states
        document.querySelectorAll('.filters-modal input[type="checkbox"]').forEach(cb => {
            originalFiltersState.checkboxStates[cb.id] = cb.checked;
        });

        console.log('[AdvancedFilters] Saved original state:', originalFiltersState);
    }

    // Restore filter state to original
    function restoreFiltersState() {
        if (!originalFiltersState) return;

        console.log('[AdvancedFilters] Restoring original state:', originalFiltersState);

        // Restore selectedFilters object
        selectedFilters.courses = [...originalFiltersState.courses];
        selectedFilters.careerTags = [...originalFiltersState.careerTags];

        // Restore checkbox states
        document.querySelectorAll('.filters-modal input[type="checkbox"]').forEach(cb => {
            if (originalFiltersState.checkboxStates.hasOwnProperty(cb.id)) {
                cb.checked = originalFiltersState.checkboxStates[cb.id];
            }
        });

        // Update display
        updateSelectedFiltersDisplay();
    }

    // Show custom confirmation dialog
    function showConfirmDialog(filterCount) {
        confirmDialogMessage.textContent = `You have ${filterCount} filter${filterCount !== 1 ? 's' : ''} selected. Do you want to apply them before closing?`;
        confirmDialogOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Hide custom confirmation dialog
    function hideConfirmDialog() {
        confirmDialogOverlay.classList.remove('active');
        if (!filtersModalOverlay.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

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
    async function buildFiltersUI() {
        buildStudentCourses();
        buildCareerTags();
        initializeSidebarNavigation();
        // Auto-check student's tags after UI is built (wait for it to complete)
        await loadStudentTags();
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
        // Save current state when opening modal
        saveFiltersState();
        filtersModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal (with optional force close)
    function closeFiltersModal(forceClose = false) {
        // Check if there are any selected filters
        const hasSelectedFilters = selectedFilters.courses.length > 0 || selectedFilters.careerTags.length > 0;

        if (hasSelectedFilters && !forceClose) {
            // Show custom confirmation dialog
            const filterCount = selectedFilters.courses.length + selectedFilters.careerTags.length;
            showConfirmDialog(filterCount);
        } else {
            // Close directly
            filtersModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('[AdvancedFilters] Modal closed');
        }
    }

    // Handle dialog Apply button
    if (btnConfirmApply) {
        btnConfirmApply.addEventListener('click', () => {
            console.log('[AdvancedFilters] Confirm Apply clicked');
            hideConfirmDialog();
            applyFilters();
        });
    }

    // Handle dialog Discard button
    if (btnConfirmDiscard) {
        btnConfirmDiscard.addEventListener('click', () => {
            console.log('[AdvancedFilters] Confirm Discard clicked');
            // Restore original state
            restoreFiltersState();
            // Close both dialogs
            hideConfirmDialog();
            closeFiltersModal(true); // Force close without showing dialog again
        });
    }

    // Close dialog when clicking overlay
    if (confirmDialogOverlay) {
        confirmDialogOverlay.addEventListener('click', (e) => {
            if (e.target === confirmDialogOverlay) {
                hideConfirmDialog();
            }
        });
    }

    // Apply filters
    async function applyFilters() {
        console.log('[AdvancedFilters] Apply filters clicked');
        console.log('[AdvancedFilters] Selected filters:', selectedFilters);

        // Close modal immediately (no confirmation needed when explicitly applying)
        closeFiltersModal(true);

        // Dispatch search started event to show loading state
        document.dispatchEvent(new CustomEvent('searchStarted'));

        // Get location and work type values
        const locationValue = document.getElementById('locationValue')?.value || '';
        const typeValue = document.getElementById('typeValue')?.value || '';
        const searchKeyword = window.getCurrentSearchKeyword ? window.getCurrentSearchKeyword() : '';

        console.log('[AdvancedFilters] Location:', locationValue);
        console.log('[AdvancedFilters] Work type:', typeValue);
        console.log('[AdvancedFilters] Search keyword:', searchKeyword);

        // Prepare request body
        const requestBody = {
            career_tags: selectedFilters.careerTags,
            courses: selectedFilters.courses,
            location: locationValue !== '' ? locationValue : null,
            work_type: typeValue !== '' ? typeValue : null,
            keyword: searchKeyword !== '' ? searchKeyword : null
        };


        console.log('[AdvancedFilters] Sending API request:', requestBody);

        try {
            const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/search_jobs.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('[AdvancedFilters] API response status:', response.status);

            const result = await response.json();
            console.log('[AdvancedFilters] API result:', result);

            if (result.status === 'success') {
                console.log(`[AdvancedFilters] Found ${result.count} jobs`);

                // Dispatch custom event with job data
                const jobsEvent = new CustomEvent('jobsLoaded', {
                    detail: {
                        jobs: result.data,
                        count: result.count,
                        filters: result.filters_applied
                    }
                });
                document.dispatchEvent(jobsEvent);
            } else {
                console.error('[AdvancedFilters] API error:', result.message);
                // Dispatch error event
                document.dispatchEvent(new CustomEvent('searchError', {
                    detail: { message: result.message }
                }));
                alert('Error loading jobs: ' + result.message);
            }
        } catch (error) {
            console.error('[AdvancedFilters] Fetch error:', error);
            // Dispatch error event
            document.dispatchEvent(new CustomEvent('searchError', {
                detail: { message: error.message }
            }));
            alert('Failed to fetch jobs. Please try again.');
        }
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

    // Listen for active filter removal events
    document.addEventListener('removeActiveFilter', (event) => {
        const { type, value } = event.detail;
        console.log(`[AdvancedFilters] Removing active filter - ${type}:`, value);

        // Find and uncheck the corresponding checkbox
        const checkboxes = document.querySelectorAll('.filters-modal input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.value === value) {
                cb.checked = false;
            }
        });

        // Update selected filters
        if (type === 'course') {
            selectedFilters.courses = selectedFilters.courses.filter(c => c !== value);
        } else if (type === 'career') {
            selectedFilters.careerTags = selectedFilters.careerTags.filter(t => t !== value);
        }

        updateSelectedFiltersDisplay();
    });

    // Listen for reapply filters event
    document.addEventListener('reapplyFilters', () => {
        console.log('[AdvancedFilters] Reapplying filters after removal');
        applyFilters();
    });

    // Listen for clear all active filters event
    document.addEventListener('clearAllActiveFilters', () => {
        console.log('[AdvancedFilters] Clearing all active filters');
        clearAllFilters();
        // Trigger a search with no filters
        applyFilters();
    });

    // Listen for search triggered from search input
    document.addEventListener('searchTriggered', (event) => {
        console.log('[AdvancedFilters] Search triggered with keyword:', event.detail.keyword);
        // Apply filters with the new keyword
        applyFilters();
    });
}
