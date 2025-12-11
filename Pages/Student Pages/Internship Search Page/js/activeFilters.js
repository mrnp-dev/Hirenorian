// activeFilters.js - Display active filters on main page

export function initActiveFilters() {
    const activeFiltersDisplay = document.getElementById('activeFiltersDisplay');
    const activeFiltersTags = document.getElementById('activeFiltersTags');
    const btnClearAllFilters = document.getElementById('btnClearAllFilters');

    // Listen for jobs loaded event (filters were applied)
    document.addEventListener('jobsLoaded', (event) => {
        const { filters } = event.detail;
        console.log('[ActiveFilters] Received filters:', filters);
        updateActiveFiltersDisplay(filters);
    });

    // Update active filters display
    function updateActiveFiltersDisplay(filters) {
        if (!activeFiltersTags || !activeFiltersDisplay) return;

        // Clear existing tags
        activeFiltersTags.innerHTML = '';

        const courses = filters.courses || [];
        const careerTags = filters.career_tags || [];
        const totalFilters = courses.length + careerTags.length;

        if (totalFilters === 0) {
            // Hide if no filters
            activeFiltersDisplay.style.display = 'none';
            return;
        }

        // Show display
        activeFiltersDisplay.style.display = 'block';

        // Add course tags
        courses.forEach(course => {
            const tag = createFilterTag(course, 'course', () => removeFilter('course', course));
            activeFiltersTags.appendChild(tag);
        });

        // Add career tags
        careerTags.forEach(tag => {
            const tagElement = createFilterTag(tag, 'career', () => removeFilter('career', tag));
            activeFiltersTags.appendChild(tagElement);
        });

        console.log(`[ActiveFilters] Displayed ${totalFilters} active filters`);
    }

    // Create filter tag element
    function createFilterTag(label, type, onRemove) {
        const tag = document.createElement('div');
        tag.className = `active-filter-tag ${type}-tag`;

        tag.innerHTML = `
            <span class="tag-label">${label}</span>
            <span class="tag-remove">
                <i class="fa-solid fa-xmark"></i>
            </span>
        `;

        // Add click handler to remove button
        const removeBtn = tag.querySelector('.tag-remove');
        removeBtn.addEventListener('click', onRemove);

        return tag;
    }

    // Remove individual filter
    function removeFilter(type, value) {
        console.log(`[ActiveFilters] Removing ${type} filter:`, value);

        // Dispatch custom event to update filters
        const removeEvent = new CustomEvent('removeActiveFilter', {
            detail: { type, value }
        });
        document.dispatchEvent(removeEvent);

        // Re-apply filters (trigger search without removed filter)
        const applyEvent = new CustomEvent('reapplyFilters');
        document.dispatchEvent(applyEvent);
    }

    // Clear all filters
    if (btnClearAllFilters) {
        btnClearAllFilters.addEventListener('click', () => {
            console.log('[ActiveFilters] Clear all filters clicked');

            // Dispatch event to clear all filters
            const clearEvent = new CustomEvent('clearAllActiveFilters');
            document.dispatchEvent(clearEvent);

            // Hide display
            activeFiltersDisplay.style.display = 'none';
        });
    }
}
