/**
 * =============================================================================
 * THIRD SECTION - CAREER INTERESTS & TAGS
 * =============================================================================
 * Manages ideal location validation and working field tag selection
 */

// ============ TAG MANAGEMENT (Working Fields) ============

/**
 * Fetches course tags data from JSON file on page load
 * Tags are loaded once and reused for performance
 */
async function fetchCourseTags() {
    try {
        const response = await fetch('../JSON/courses_tags.json');
        const data = await response.json();
        courseTagsData = data.tags;
    } catch (error) {
        console.error('Error fetching course tags:', error);
    }
}

// Load tags on script execution
fetchCourseTags();

/**
 * Renders tags for a selected course
 * Creates clickable tag elements in the tags container
 * 
 * @param {Array} tags - Array of tag strings to display
 */
function renderTags(tags) {
    tagsContainer.innerHTML = '';

    if (!tags || tags.length === 0) {
        tagsContainer.innerHTML = '<p>No tags available for this course.</p>';
        return;
    }

    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTag(tag, tagElement));
        tagsContainer.appendChild(tagElement);
    });
}

/**
 * Toggles selection of a tag (add or remove)
 * Max 3 tags can be selected
 * Shows shake animation when max is reached
 * 
 * @param {string} tag - The tag text
 * @param {HTMLElement} element - The tag element
 */
function toggleTag(tag, element) {
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
        // Remove tag if already selected
        selectedTags.splice(index, 1);
        element.classList.remove('chosen');
    } else {
        // Add tag if not at max selection
        if (selectedTags.length < maxSelection) {
            selectedTags.push(tag);
            element.classList.add('chosen');
        } else {
            // Show shake animation when max reached
            selectedCount.classList.add("shake");
            setTimeout(() => {
                selectedCount.classList.remove("shake");
            }, 500);
        }
    }
    updateSelectedCount();
}

/**
 * Updates the display of selected tags count
 * Shows "Selected: X/3"
 */
function updateSelectedCount() {
    selectedCount.textContent = `Selected: ${selectedTags.length}/${maxSelection}`;
}

/**
 * Updates available tags when course selection changes
 * Resets previous tag selections
 * Loads tags specific to the selected course
 */
function updateTagsForSelectedCourse() {
    const courseInput = document.querySelector('#course-input');
    const selectedCourse = courseInput.value.trim();

    // Clear previous selection when course changes
    selectedTags = [];
    updateSelectedCount();

    if (courseTagsData[selectedCourse]) {
        renderTags(courseTagsData[selectedCourse]);
    } else {
        renderTags([]); // Handle when no tags available
    }
}

// ============ IDEAL LOCATION EVENT LISTENERS ============

/**
 * Ideal location input - clear error on focus
 */
idealLocation_Input.addEventListener('focus', async () => {
    removeError(idealLocation_Input);
});

/**
 * Ideal location input - validate on blur
 */
idealLocation_Input.addEventListener('blur', async () => {
    validateIdeal_Location(idealLocation_Input);
});

/**
 * Ideal location input - clear error on typing
 */
idealLocation_Input.addEventListener('input', async () => {
    removeError(idealLocation_Input);
});

/**
 * Validates ideal location field
 * Checks if value matches one of the available locations
 * 
 * @param {HTMLElement} input - The ideal location input element
 */
function validateIdeal_Location(input) {
    if (input !== null) {
        if (!checkIfEmpty_General(input)) {
            idealLocation_Valid = false;
        } else {
            autoCorrect_Suggestions(input, locations, { isIdeal_LocationValid: false });
        }
    }
}

// ============ SUBMIT FORM ============

/**
 * Validates third section and submits form
 * Collects ideal location and selected tags into userInformation
 * Called when "Finish" button is clicked
 * 
 * @param {HTMLElement} button - The submit button element
 */
function submitTheForm(button) {
    // Add ideal location to user information if valid
    if (idealLocation_Valid) userInformation['Ideal Location'] = idealLocation_Input.value.trim();
    
    // Add selected tags to user information
    if (selectedTags) userInformation['Tags'] = [...selectedTags];
    
    console.log(userInformation);
    Register_Student();
}
