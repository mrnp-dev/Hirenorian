// typeFilter.js - Type dropdown (Full-time, Part-time, Internship)

export function initTypeFilter() {
    const typeTrigger = document.getElementById('typeTrigger');
    const typeDropdown = document.getElementById('typeDropdown');
    const typeValue = document.getElementById('typeValue');
    const typeOptions = document.querySelectorAll('.type-option');

    function selectType(value, displayText) {
        typeValue.value = value;
        typeTrigger.querySelector('span').textContent = displayText;
        closeTypeDropdown();

        // Remove previous selections
        typeOptions.forEach(option => option.classList.remove('selected'));

        // Add selected class to current selection
        const selectedOption = Array.from(typeOptions).find(opt => opt.dataset.value === value);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    function openTypeDropdown() {
        typeDropdown.classList.add('active');
        typeTrigger.classList.add('active');
    }

    function closeTypeDropdown() {
        typeDropdown.classList.remove('active');
        typeTrigger.classList.remove('active');
    }

    function toggleTypeDropdown() {
        if (typeDropdown.classList.contains('active')) {
            closeTypeDropdown();
        } else {
            openTypeDropdown();
        }
    }

    // Event listeners for Type dropdown
    if (typeTrigger) {
        typeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTypeDropdown();
        });
    }

    // Handle type option clicks
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const displayText = option.textContent;
            selectType(value, displayText);
        });
    });

    // Close type dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.type-filter-wrapper')) {
            closeTypeDropdown();
        }
    });

    // Close type dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTypeDropdown();
        }
    });
}
