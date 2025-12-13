// selectedFilters.js - Selected filters display and management

export let selectedFilters = {
    courses: [],
    careerTags: []
};

export function updateSelectedCourses() {
    selectedFilters.courses = Array.from(
        document.querySelectorAll('#studentCoursesContainer input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    updateSelectedFiltersDisplay();
}

export function updateSelectedTags() {
    selectedFilters.careerTags = Array.from(
        document.querySelectorAll('#careerTagsContainer input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    updateSelectedFiltersDisplay();
}

export function updateSelectedFiltersDisplay() {
    const selectedBar = document.getElementById('selectedFiltersBar');
    const selectedTagsContainer = document.getElementById('selectedFiltersTags');
    const selectedCountEl = document.querySelector('.selected-count');
    const clearSelectedBtn = document.getElementById('clearSelectedBtn');

    // Combine all selected filters
    const allSelected = [
        ...selectedFilters.courses.map(c => ({ type: 'course', value: c })),
        ...selectedFilters.careerTags.map(t => ({ type: 'tag', value: t }))
    ];

    const totalCount = allSelected.length;

    // Update count
    selectedCountEl.textContent = `${totalCount} filter${totalCount !== 1 ? 's' : ''} selected`;

    // Show/hide the bar
    if (totalCount > 0) {
        selectedBar.classList.add('active');
        clearSelectedBtn.style.display = 'block';
    } else {
        selectedBar.classList.remove('active');
        clearSelectedBtn.style.display = 'none';
    }

    // Build tags HTML
    selectedTagsContainer.innerHTML = allSelected.map(item => {
        const categoryLabel = item.type === 'course' ? 'Course' : 'Tag';
        return `
            <div class="selected-tag-chip" data-type="${item.type}" data-value="${item.value}">
                <span class="tag-category">${categoryLabel}</span>
                <span class="tag-label">${item.value}</span>
                <span class="remove-tag" onclick="removeSelectedFilter('${item.type}', '${item.value.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-xmark"></i>
                </span>
            </div>
        `;
    }).join('');
}

// Remove individual filter - exposed globally for onclick handlers
window.removeSelectedFilter = function (type, value) {
    if (type === 'course') {
        const checkbox = document.querySelector(`#studentCoursesContainer input[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
            updateSelectedCourses();
        }
    } else if (type === 'tag') {
        const checkbox = document.querySelector(`#careerTagsContainer input[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
            updateSelectedTags();
        }
    }
};
