/**
 * =============================================================================
 * FORM INITIALIZATION & DOM READY
 * =============================================================================
 * Sets up all event listeners and initializes data on page load
 */

/**
 * Main initialization function
 * Runs when DOM is fully loaded
 * Sets up all data loading and event listeners
 */
window.addEventListener('DOMContentLoaded', async e => {
    console.log("Initializing form...");

    // ========== LOAD ALL DROPDOWN DATA ==========
    const suggestionsContainer = document.querySelectorAll('.suggestions');
    campuses = await loadCampuses();
    departments = await loadDepartments();
    organizations_defaul = await defaultOrganizations();
    locations = await getLocationList();
    organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

    console.log("Data loaded:", {
        campuses: campuses.length,
        departments: departments.length,
        locations: locations.length
    });

    // ========== SETUP SECOND SECTION INPUT LISTENERS ==========
    /**
     * Manages autocomplete suggestions for second section inputs
     * Handles focus, input, and click events
     */
    secondInputs.forEach(async (input) => {
        let list = []
        
        /**
         * When input field receives focus:
         * Show appropriate suggestion list
         */
        input.addEventListener('focus', (e) => {
            switch (input.name.toLowerCase()) {
                case 'university/campus':
                    list = campuses;
                    break;
                case 'department':
                    list = departments;
                    break;
                case 'course':
                    list = courses;
                    break;
                case 'organization':
                    list = organizations;
                    break;
            }
            
            // Hide other open suggestion containers
            suggestionsContainer.forEach(container => {
                container.classList.remove('active');
            });
            
            // Track which element is focused
            lastFocusedElement = e.target;
            
            // Display suggestions
            LoadList(e.target, list);
        });

        /**
         * When input field text changes:
         * Update suggestions and trigger validation/data loading
         */
        input.addEventListener('input', async (e) => {
            if (input.name == 'Department') {
                // When department changes, clear and reload courses
                const value = input.value.trim().toLowerCase();
                const depIndex = departments.findIndex(dep => dep.toLowerCase() == value);
                const courseField = document.querySelector('#course-input');
                courseField.nextElementSibling.innerHTML = '';
                courseField.value = '';
                courses = [];

                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byDepartment = [];

                if (depIndex !== -1) {
                    // Load courses and organizations for selected department
                    courses = await getCoursesList(departments[depIndex]);
                    organizations_byDepartment = await getOrganizationsList(departments[depIndex]);
                    await getJobClassificationList(departments[depIndex]);
                }
            }
            else if (input.name == 'University/Campus') {
                // When campus changes, reload campus-specific organizations
                const organizationField = document.querySelector('#org-input');
                organizationField.nextElementSibling.innerHTML = '';
                organizations_byCampus = [];

                const value = input.value.trim().toLowerCase();
                const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
                if (campusIndex !== -1) {
                    organizations_byCampus = await AdditionalOrganizationsList(campuses[campusIndex]);
                }
            }
            
            // Update suggestions based on new input value
            let list = [];
            switch (input.name.toLowerCase()) {
                case 'university/campus':
                    list = campuses;
                    break;
                case 'department':
                    list = departments;
                    break;
                case 'course':
                    list = courses;
                    break;
                case 'organization':
                    list = organizations;
                    break;
            }
            LoadList(e.target, list);
            inputValidation_SecondSection(input)
        });
    });

    // ========== SETUP IDEAL LOCATION LISTENERS ==========
    /**
     * Ideal location input - handle focus, input, and blur
     */
    idealLocation_Input.addEventListener('focus', (e) => {
        let list = locations;
        suggestionsContainer.forEach(container => {
            container.classList.remove('active');
        });
        LoadList(e.target, list);
    });

    idealLocation_Input.addEventListener('input', async (e) => {
        let list = locations;
        LoadList(e.target, list);
        validateIdeal_Location(idealLocation_Input)
        inputValidation_SecondSection(idealLocation_Input);
    });

    // ========== INITIALIZE PANEL TOGGLE ==========
    initializePanelToggle();

    console.log("Form initialization complete");
});
