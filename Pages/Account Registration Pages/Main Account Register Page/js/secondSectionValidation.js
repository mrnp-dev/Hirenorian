/**
 * =============================================================================
 * SECOND SECTION VALIDATION - ACADEMIC INFORMATION
 * =============================================================================
 * Validates: University/Campus, Department, Course, Student Number, School Email, Organization
 */

// ============ EVENT LISTENERS FOR SECOND INPUT SECTION ============

/**
 * Adds event listeners to all second section inputs
 * Handles focus, blur, and input events with autocomplete suggestions
 */
secondInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        validateSecondInputs(input);
    });
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        removeError(input);
    });
});

/**
 * Closes suggestion dropdowns when clicking outside input fields
 */
document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-wrapper' || !e.target.closest('button'))) {
        secondInputs.forEach(input => {
            input.nextElementSibling.classList.remove('active');
        });
        idealLocation_Input.nextElementSibling.classList.remove('active');
        validateSecondInputs(lastFocusedElement);
    }
});

// ============ MAIN VALIDATION FUNCTION ============

/**
 * Validates individual second section inputs
 * Calls autocorrect for dropdown fields
 * Updates validation state object
 * 
 * @param {HTMLElement} input - The input being validated
 */
async function validateSecondInputs(input) {
    if (input !== null) {
        switch (input.name) {
            case 'University/Campus':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isUniversity/CampusValid'] = false;
                } else {
                    autoCorrect_Suggestions(input, campuses, secondInputs_Validation);
                }
                break;
            case 'Department':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isDepartmentValid'] = false;
                } else {
                    autoCorrect_Suggestions(input, departments, secondInputs_Validation);
                }
                break;
            case 'Course':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isCourseValid'] = false;
                } else {
                    if (courses != []) {
                        autoCorrect_Suggestions(input, courses, secondInputs_Validation);
                    }
                }
                break;
            case 'Student Number':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isStudentNumberValid'] = false;
                } else if (!checkStudentNumber(input)) {
                    showError(input, `Invalid ${input.name}`);
                    secondInputs_Validation['isStudentNumberValid'] = false;
                } else {
                    ifStudentNumber_Exist().then(exists => {
                        if (!exists) {
                            secondInputs_Validation['isStudentNumberValid'] = false;
                        } else {
                            secondInputs_Validation['isStudentNumberValid'] = true;
                        }
                    })
                }
                break;
            case 'School Email':
                if (!checkIfEmpty_General(input)) {
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                } else if (!checkEmail(input)) {
                    secondInputs_Validation['isSchoolEmailValid'] = false;
                }
                else {
                    secondInputs_Validation['isSchoolEmailValid'] = true;
                }
                break;
            case 'Organization':
                if (input.value.trim() !== '') {
                    autoCorrect_Suggestions(input, organizations, secondInputs_Validation);
                } else {
                    userInformation[input.name] = '';
                }
                break;
        }
    }
}

// ============ FIELD SPECIFIC VALIDATION ============

/**
 * Checks if input field is not empty
 * Shows error if empty
 * 
 * @param {HTMLElement} input - The input element
 * @returns {boolean} - True if not empty
 */
function checkIfEmpty_General(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return true;
    }
}

/**
 * Validates student number format and year
 * Format: YYYYXXXXXX (where YYYY is admission year)
 * Year must be within 15 years of current year
 * 
 * @param {HTMLElement} input - The student number input element
 * @returns {boolean} - True if valid
 */
function checkStudentNumber(input) {
    const studentNumber_RegEx = /^(19|20)\d{2}\d{6}$/;
    const value = input.value.trim();
    
    if (!studentNumber_RegEx.test(value)) {
        return false;
    }

    // Validate year is reasonable
    const year = parseInt(value.slice(0, 4), 10);
    const currentYear = new Date().getFullYear();
    
    if (year > currentYear) {
        return false;
    }
    if (year < currentYear - 15) {
        return false;
    }
    
    userInformation[input.name] = input.value.trim();
    return true;
}

/**
 * Checks if student number already exists in database
 * Prevents duplicate registrations
 * 
 * @returns {Promise<boolean>} - True if student number is available
 */
async function ifStudentNumber_Exist() {
    return fetch("http://158.69.205.176:8080/check_student_number.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInformation)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                showError(studentNumber_Input, "This Student ID is already registered");
                return false;
            } else {
                removeError(studentNumber_Input);
                return true;
            }
        })
        .catch(err => {
            console.error(err);
            ToastSystem.show("Something went wrong, try again later.", "error");
            return false;
        });
}

// ============ AUTOCORRECT SUGGESTIONS ============

/**
 * Automatically corrects input to match item in dropdown list
 * Case-insensitive matching
 * Updates validation state and userInformation
 * 
 * @param {HTMLElement} input - The input element
 * @param {Array} list - List of valid options
 * @param {Object} validation - Validation state object to update
 */
function autoCorrect_Suggestions(input, list, validation) {
    const index = list.findIndex(item => item.toLowerCase() === input.value.trim().toLowerCase());
    
    if (index !== -1) {
        // Found exact match - autocorrect it
        input.value = list[index]
        validation[`is${input.name}Valid`] = true;
        userInformation[input.name] = input.value;
        
        // Special handling for ideal location
        if (input.name == "Ideal Location") {
            idealLocation_Valid = true;
        }
    } else {
        // No match found - show error
        showError(input, `Invalid ${input.name}`);
        validation[`is${input.name}Valid`] = false;
        
        // Special handling for ideal location
        if (input.name == "Ideal Location") {
            idealLocation_Valid = false;
        }
    }
}

// ============ SUGGESTION DROPDOWN MANAGEMENT ============

/**
 * Filters and displays suggestion list for an input
 * Called on input field focus or text change
 * 
 * @param {HTMLElement} input - The input element
 * @param {Array} list - List of options to filter and display
 */
function LoadList(input, list) {
    const value = input.value.trim().toLowerCase();

    if (value === '') {
        // Show full list if input is empty
        LoadSuggestions(input, list);
    } else {
        // Filter list based on input value
        const filteredList = list.filter(item => item.toLowerCase().includes(value));
        LoadSuggestions(input, filteredList);
    }
}

/**
 * Renders suggestion list below input field
 * Each suggestion is clickable and updates the input value
 * 
 * @param {HTMLElement} input - The input element
 * @param {Array} list - List of suggestions to display
 */
function LoadSuggestions(input, list) {
    const suggestionsContainer = input.nextElementSibling;
    suggestionsContainer.innerHTML = '';

    if (list.length === 0 || !list) {
        // Show "no results" message
        const noItems = document.createElement('div');
        noItems.className = 'no-results';
        suggestionsContainer.append(noItems);
    } else {
        // Create clickable suggestion items
        list.forEach(item => {
            const itemObj = document.createElement('div');
            itemObj.className = 'suggestion-item';
            itemObj.textContent = item;

            itemObj.addEventListener('click', async () => {
                // Update input and validate
                input.value = item;
                suggestionsContainer.classList.remove('active');
                inputValidation_SecondSection(input);
                removeError(input);
            });

            suggestionsContainer.append(itemObj);
        });
        
        // Show suggestion container
        suggestionsContainer.classList.add('active');
    }
}

// ============ SECTION-SPECIFIC INPUT HANDLING ============

/**
 * Handles special logic when second section inputs change
 * Updates related dropdowns (e.g., courses when department changes)
 * 
 * @param {HTMLElement} input - The input that changed
 */
async function inputValidation_SecondSection(input) {
    if (input.name == 'Department') {
        // Clear and reset dependent fields
        const courseField = document.querySelector('#course-input');
        courseField.nextElementSibling.innerHTML = '';
        courseField.value = '';
        courses = [];

        const organizationField = document.querySelector('#org-input');
        organizationField.nextElementSibling.innerHTML = '';
        organizations_byDepartment = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

        const value = input.value.trim().toLowerCase();
        const depIndex = departments.findIndex(dep => dep.trim().toLowerCase() == value);

        if (depIndex !== -1) {
            removeError(input);
            // Load department-specific data
            getCoursesList(departments[depIndex]);
            getOrganizationsList(departments[depIndex]);
            getJobClassificationList(departments[depIndex]);
        }
    } else if (input.name == 'University/Campus') {
        // Clear and reset campus-related organizations
        const organizationField = document.querySelector('#org-input');
        organizationField.nextElementSibling.innerHTML = '';
        organizations_byCampus = [];
        organizations = [...organizations_defaul, ...organizations_byDepartment, ...organizations_byCampus];

        const value = input.value.trim().toLowerCase();
        const campusIndex = campuses.findIndex(campus => campus.toLowerCase() == value);
        
        if (campusIndex !== -1) {
            AdditionalOrganizationsList(campuses[campusIndex]);
        }
    }
    else if (input.name.includes('Job Classification')) {
        // Remove job classification if already selected
        if (jobclassifications.includes(input.value)) {
            const jobIndex = jobclassifications.indexOf(input.value);
            jobclassifications.splice(jobIndex, 1);
        }
    } else if (input.name == 'Ideal Location') {
        validateIdeal_Location(input);
    }
}

/**
 * Validates ideal location and updates state
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

// ============ PROCEED TO NEXT SECTION ============

/**
 * Validates all second section inputs and moves to third section if valid
 * Called when "Next" button is clicked on second section
 * 
 * @param {HTMLElement} button - The next button element
 */
function goToLast(button) {
    // Validate all inputs
    secondInputs.forEach(input => {
        validateSecondInputs(input);
    });
    
    // Check if all validation states are true
    if (Object.values(secondInputs_Validation).every(Boolean)) {
        // All valid - proceed to next section
        secondInputs_Container.classList.remove('slide-left');
        secondInputs_Container.classList.add('slide-right');
        updateTagsForSelectedCourse();
        manageSteps('next');
    } else {
        // Some invalid - show error
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}
