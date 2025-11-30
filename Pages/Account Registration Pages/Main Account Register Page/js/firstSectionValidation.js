/**
 * =============================================================================
 * FIRST SECTION VALIDATION - PERSONAL INFORMATION
 * =============================================================================
 * Validates: First Name, Last Name, Middle Initial, Suffix, Email, Phone, Password
 */

// ============ EVENT LISTENERS FOR FIRST INPUT SECTION ============

/**
 * Adds event listeners to all first section inputs
 * Handles focus, blur, and input events for real-time validation
 */
firstInputs.forEach(input => {
    input.addEventListener('blur', async () => {
        initialFirstInputs_Validations(input);
        if (input.name === "Password" && input.dataset.strength == "weak") {
            showError(input, `${input.name}'s strength must be atleast medium.`);
        }
    });
    input.addEventListener('focus', async () => {
        removeError(input);
    });
    input.addEventListener('input', async () => {
        if (input.name == "Password") {
            const confirmPass_field = document.querySelector('#confirmPass-input');
            if (input.value.trim().length >= 12) {
                if (confirmPass_field.value.trim()) {
                    confirmPassword(confirmPass_field);
                }
                checkPassword(input);
            } else {
                removeError(confirmPass_field);
                removeError(input);
            }
        } else if (input.name == "Confirm Password") {
            confirmPassword(input);
        } else {
            removeError(input);
        }
    });
});

/**
 * Validates all first section inputs on blur
 * 
 * @param {HTMLElement} input - The input being validated
 * @returns {Promise<boolean>} - True if valid
 */
async function initialFirstInputs_Validations(input) {
    if (input.name !== 'Suffix') {
        return checkIfEmpty(input);
    } else {
        return checkIfValid(input);
    }
}

/**
 * Validates all first section inputs before moving to next section
 * Runs parallel validation checks for all inputs
 * 
 * @returns {Promise<boolean>} - True if all inputs are valid
 */
async function firstInputsValidation() {
    const validations = await Promise.all(
        Array.from(firstInputs).map(input => {
            if (input.name !== 'Suffix') {
                if (input.name == "Password" && input.dataset.strength == "weak") {
                    showError(input, `${input.name}'s strength must be atleast medium.`);
                    return false;
                } else {
                    return checkIfEmpty(input);
                }
            } else {
                return checkIfValid(input);
            }
        })
    );
    if (validations.every(Boolean)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Proceeds to next section after first section validation
 * Shows slide animation and updates step indicator
 */
async function goNext() {
    if (await firstInputsValidation()) {
        firstInputs_Container.classList.remove('slide-left');
        firstInputs_Container.classList.add('slide-right');
        manageSteps('next');
    } else {
        ToastSystem.show("Please correct the highlighted fields.", "error");
    }
}

// ============ INDIVIDUAL FIELD VALIDATORS ============

/**
 * Checks if an input is not empty
 * 
 * @param {HTMLElement} input - The input element
 * @returns {Promise<boolean>} - True if not empty and valid
 */
async function checkIfEmpty(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return await checkIfValid(input);
    }
}

/**
 * Routes validation based on input name
 * Calls appropriate validator for each field type
 * 
 * @param {HTMLElement} input - The input element
 * @returns {Promise<boolean>} - Validation result
 */
async function checkIfValid(input) {
    let isValid = true;
    switch (input.name.trim().toLowerCase()) {
        case 'first name':
            isValid = checkFirst_Last_Name(input);
            break;
        case 'last name':
            isValid = checkFirst_Last_Name(input);
            break;
        case 'middle initial':
            isValid = validateMiddleInitial(input);
            break;
        case 'suffix':
            isValid = checkSuffix(input);
            if (input.value.trim() == "") userInformation[input.name] = "";
            break;
        case 'email':
            isValid = checkEmail(input);
            break;
        case 'phone number':
            isValid = checkPhoneNumber(input);
            break;
        case 'password':
            isValid = await checkPassword(input);
            break;
        case 'confirm password':
            isValid = confirmPassword(input);
            break;
    }
    return isValid;
}

// ============ NAME VALIDATION (First Name & Last Name) ============

/**
 * Validates first and last names
 * Checks length and format
 * 
 * @param {HTMLElement} input - The name input element
 * @returns {boolean} - True if valid
 */
function checkFirst_Last_Name(input) {
    if (!checkNameLength(input)) {
        return false;
    } else {
        return true;
    }
}

/**
 * Checks if name length is within acceptable range (2-50 chars)
 * 
 * @param {HTMLElement} input - The name input element
 * @returns {boolean} - True if valid length
 */
function checkNameLength(input) {
    const trimmedName = input.value.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        showError(input, `${input.name} must be between 2 and 50 characters.`);
        return false;
    } else {
        if (checkWhiteSpaces(input)) return validateFirst_Last_Name(input);
    }
}

/**
 * Validates first and last name characters
 * Allows letters, accents, spaces, and hyphens
 * 
 * @param {HTMLElement} input - The name input element
 * @returns {boolean} - True if valid
 */
function validateFirst_Last_Name(input) {
    const first_last_Name_regex = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s\-]{2,50}$/;

    if (!first_last_Name_regex.test(input.value)) {
        showError(input, `${input.name} contains invalid characters.`);
        return false;
    } else {
        userInformation[input.name] = capitalizeFirstLetter(input);
        return true;
    }
}

/**
 * Capitalizes first letter of each word in a name
 * 
 * @param {HTMLElement} input - The name input element
 * @returns {string} - Properly capitalized name
 */
function capitalizeFirstLetter(input) {
    const parts = input.value.trim().split(" ");
    if (!parts.includes('')) {
        return parts.map(part => {
            return part[0].toUpperCase() + part.slice(1).toLowerCase();
        }).join(' ');
    }
}

/**
 * Checks for excessive whitespace (2+ consecutive spaces)
 * 
 * @param {HTMLElement} input - The input element
 * @returns {boolean} - True if no excessive spaces
 */
function checkWhiteSpaces(input) {
    const regExSpaces = /\s{2,}/;
    if (regExSpaces.test(input.value.trim())) {
        showError(input, `${input.name} contains too much spaces.`);
        return false;
    } else {
        return true;
    }
}

// ============ MIDDLE INITIAL VALIDATION ============

/**
 * Validates middle initial (single letter, optional period)
 * 
 * @param {HTMLElement} input - The middle initial input element
 * @returns {boolean} - True if valid
 */
function validateMiddleInitial(input) {
    const middleInitial_regex = /^[A-Za-z]\.?$/
    if (!middleInitial_regex.test(input.value)) {
        showError(input, `Invalid ${input.name}.`);
        return false;
    } else {
        userInformation[input.name] = input.value.includes(".") ?
            input.value.toUpperCase() :
            input.value.toUpperCase() + ".";
        return true;
    }
}

// ============ SUFFIX VALIDATION ============

/**
 * Validates suffix (Jr., Sr., II, III, etc.)
 * 
 * @param {HTMLElement} input - The suffix input element
 * @returns {boolean} - True if valid (or empty, which is optional)
 */
function checkSuffix(input) {
    const suffix_regex = /^(Jr\.?|Sr\.?|[A-Za-z]\.?|II|III|IV|V|VI|VII|VIII|IX|X)$/i;
    let valid = true;
    if (input.value.trim() !== '') {
        if (!suffix_regex.test(input.value)) {
            showError(input, `Invalid ${input.name}.`);
            valid = false;
        } else {
            userInformation[input.name] = input.value.toUpperCase();
        }
    }
    return valid;
}

// ============ EMAIL VALIDATION ============

/**
 * Validates email addresses
 * - Personal email: standard format, NOT school email
 * - School email: must match PSU format and student number
 * 
 * @param {HTMLElement} input - The email input element
 * @returns {boolean} - True if valid
 */
function checkEmail(input) {
    const validSchoolEmail_RegEx = /^20[0-9]{2}[0-9]{6}@pampangastateu\.edu\.ph$/;
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.name == 'Email') {
        // Personal email validation
        if (!validEmail_RegEx.test(input.value.trim())) {
            showError(input, `Invalid Email`);
            return false;
        } else {
            if (validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())) {
                showError(input, `Not your School Email`);
                return false;
            }
            userInformation[input.name] = input.value;
            return true;
        }
    } else {
        // School email validation
        if (!validSchoolEmail_RegEx.test(input.value.trim().toLowerCase())) {
            showError(input, `Invalid ${input.name}`);
            return false;
        } else {
            const year = parseInt(input.value.substring(0, 4), 10);
            const currentYear = new Date().getFullYear();

            // Check if year is reasonable (within 15 years)
            if (year < currentYear - 15 || year > currentYear) {
                showError(input, `Invalid ${input.name}`);
                return false;
            }

            // Verify school email matches student number
            const studentNumber_substr = input.value.trim().toLowerCase().slice(0, 10);
            if (studentNumber_Input.value.trim()) {
                if (studentNumber_Input.value.trim() == studentNumber_substr) {
                    userInformation[input.name] = input.value.toLowerCase();
                    return true;
                } else {
                    showError(input, `Use your own school email address`);
                    return false;
                }
            }
        }
    }
}

// ============ PHONE NUMBER VALIDATION ============

/**
 * Validates Philippine phone numbers
 * Accepts: +639XXXXXXXXX or 09XXXXXXXXX format
 * 
 * @param {HTMLElement} input - The phone number input element
 * @returns {boolean} - True if valid
 */
function checkPhoneNumber(input) {
    const validPhoneNo_regex = /^(?:\+639\d{9}|09\d{9})$/;
    if (!validPhoneNo_regex.test(input.value.trim())) {
        showError(input, `Invalid Philippine phone number.`);
        return false;
    } else {
        userInformation[input.name] = input.value;
        return true;
    }
}

// ============ PASSWORD VALIDATION ============

/**
 * Validates password length (12-64 characters)
 * Then checks password strength
 * 
 * @param {HTMLElement} input - The password input element
 * @returns {Promise<boolean>} - True if valid
 */
async function checkPassword(input) {
    const password_minLength = 12;
    const password_maxLength = 64;
    
    if (input.value.length < password_minLength) {
        showError(input, `${input.name} must contain atleast 12 characters.`);
        return false;
    } else if (input.value.length > password_maxLength) {
        showError(input, `${input.name} must not exceed 64 characters.`);
        return false;
    } else {
        return checkPasswordStrength(input);
    }
}

/**
 * Checks password strength based on character types
 * Evaluates: letters, numbers, special characters
 * 
 * @param {HTMLElement} input - The password input element
 * @returns {boolean} - False if weak, true otherwise
 */
function checkPasswordStrength(input) {
    const password = input.value;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);

    // Count character type varieties (min 2 required for medium strength)
    const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;
    return changePasswordStrength_text(input, typesCount);
}

// ============ PASSWORD VISIBILITY TOGGLE ============

/**
 * Toggles password field visibility (password <-> text)
 * Updates eye icon to show current state
 */
function toggleShow_Hide_Password() {
    const toggleButtons = document.querySelectorAll('.toggle_show_hide');
    toggleButtons.forEach(button => {
        const input_wrapper = button.closest('.input-wrapper');
        const eye = input_wrapper.querySelector('i');
        const passwordField = input_wrapper.querySelector('input');
        
        // Toggle between password and text type
        if (passwordField.type == 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
        
        // Toggle eye icon
        eye.classList.toggle('fa-eye');
        eye.classList.toggle('fa-eye-slash');
    });
}
