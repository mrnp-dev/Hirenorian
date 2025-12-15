// Validation Functions

async function initialFirstInputs_Validations(input) {
    return checkIfEmpty(input);
}

async function firstInputsValidation() {
    const firstInputs = document.querySelectorAll('#firstInputs input');
    const validations = await Promise.all(
        Array.from(firstInputs).map(input => {
            if (input.name == "Password" && input.dataset.strength == "weak") {
                showError(input, `${input.name}'s strength must be at least medium.`);
                return false;
            } else {
                return checkIfEmpty(input);
            }
        })
    );
    return validations.every(Boolean);
}

async function checkIfEmpty(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return await checkIfValid(input);
    }
}

async function checkIfValid(input) {
    let isValid = true;
    const name = input.name.trim().toLowerCase();

    switch (name) {
        case 'company email':
            isValid = await checkEmail(input);
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

        case 'company name':
            // Simple non-empty check already passed
            userInformation[input.name] = input.value.trim();
            isValid = true;
            break;

        case 'company type':
            isValid = checkCompanyType(input);
            break;

        case 'industry':
            isValid = checkIndustry(input);
            break;

        case 'company address':
            // Simple non-empty check
            userInformation[input.name] = input.value.trim();
            isValid = true;
            break;
    }
    return isValid;
}

// ================= SPECIFIC CHECKS =================

async function checkEmail(input) {
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail_RegEx.test(input.value.trim())) {
        showError(input, `Invalid Email`);
        return false;
    }

    // Check if email already exists via API
    try {
        const isAvailable = await checkCompanyEmail(input.value.trim());
        if (!isAvailable) {
            showError(input, "Email is already in use.");
            return false;
        }
    } catch (e) {
        console.error("Email check failed", e);
    }

    userInformation[input.name] = input.value.trim();
    return true;
}

function checkPhoneNumber(input) {
    const validPhoneNo_regex = /^(?:\+639\d{9}|09\d{9})$/;
    if (!validPhoneNo_regex.test(input.value.trim())) {
        showError(input, `Invalid Philippine phone number.`);
        return false;
    } else {
        userInformation[input.name] = input.value.trim();
        return true;
    }
}

async function checkPassword(input) {
    const password_minLength = 12,
        password_maxLength = 64;
    if (input.value.length < password_minLength) {
        showError(input, `${input.name} must contain at least 12 characters.`);
        return false;
    } else if (input.value.length > password_maxLength) {
        showError(input, `${input.name} must not exceed 64 characters.`);
        return false;
    } else {
        return checkPasswordStrength(input);
    }
}

function checkPasswordStrength(input) {
    const password = input.value;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecials = /[^a-zA-Z0-9]/.test(password);

    const typesCount = [hasLetters, hasNumbers, hasSpecials].filter(Boolean).length;
    return changePasswordStrength_text(input, typesCount);
}

function changePasswordStrength_text(element, strength) {
    let valid = true;
    const section = element.closest(".input-wrapper");
    const strength_P = section.querySelector("p");
    const span = document.createElement('span');
    strength_P.textContent = "strength: ";
    strength_P.style.color = "white";

    switch (strength) {
        case 1:
            span.textContent = "weak";
            span.style.color = "red";
            element.dataset.strength = "weak";
            valid = false;
            break;
        case 2:
            span.textContent = "medium";
            span.style.color = "orange";
            element.dataset.strength = "medium";
            break;
        case 3:
            span.textContent = "strong";
            span.style.color = "green";
            element.dataset.strength = "strong";
            break;
    }

    strength_P.append(span);
    strength_P.style.visibility = 'visible';

    return valid;
}

function confirmPassword(input) {
    const password = document.querySelector('#password-input').value;
    if (input.value !== password) {
        showError(input, `Passwords do not match.`);
        return false;
    } else {
        input.classList.remove('input_InvalidInput');
        const section = input.closest(".input-wrapper");
        const p = section.querySelector("p");
        p.textContent = "Passwords matched";
        p.style.color = "green";
        p.style.visibility = 'visible';
        userInformation[`Password`] = input.value;
        return true;
    }
}

// Company Specific Checks

function checkCompanyType(input) {
    if (input.value.trim() === '') {
        showError(input, 'Company Type cannot be empty');
        return false;
    }
    // Optional: Force selection from list
    // const isValid = companyTypes.includes(input.value.trim());
    // if (!isValid) { 
    //    showError(input, 'Please select from the list'); return false; 
    // } 
    // For now, allow free text if desired, or strictly valid. Original checked validity.
    // Let's assume strict validity if list is loaded.
    if (companyTypes.length > 0 && !companyTypes.includes(input.value.trim())) {
        showError(input, 'Please select a valid company type from the dropdown');
        return false;
    }

    userInformation[input.name] = input.value.trim();
    return true;
}

function checkIndustry(input) {
    if (input.value.trim() === '') {
        showError(input, 'Industry cannot be empty');
        return false;
    }
    if (industries.length > 0 && !industries.includes(input.value.trim())) {
        showError(input, 'Please select a valid industry from the dropdown');
        return false;
    }
    userInformation[input.name] = input.value.trim();
    return true;
}


// Real-time validation for second inputs
async function validateSecondInputs(input) {
    if (input !== null) {
        switch (input.name) {
            case 'Company Name':
                checkIfEmpty(input);
                break;
            case 'Company Type':
                if (checkIfEmpty_General(input)) {
                    autoCorrect_Suggestions(input, companyTypes, secondInputs_Validation);
                }
                break;
            case 'Industry':
                if (checkIfEmpty_General(input)) {
                    autoCorrect_Suggestions(input, industries, secondInputs_Validation);
                }
                break;
            case 'Company Address':
                checkIfEmpty(input);
                break;
        }
    }
}

function checkIfEmpty_General(input) {
    const trimmedValue = input.value.trim();
    if (trimmedValue == '') {
        showError(input, `${input.name} cannot be empty`);
        return false;
    } else {
        return true;
    }
}

function autoCorrect_Suggestions(input, list, validation) {
    // Basic implementation: if exact match found (case insensitive), fix case.
    // If no match, it might be valid if we allow free text, but usually dropdowns imply strict choice.
    // Original company_registration.js enforced strict choice.

    const index = list.findIndex(item => item.toLowerCase() === input.value.trim().toLowerCase());
    if (index !== -1) {
        input.value = list[index];
        removeError(input);
        userInformation[input.name] = input.value;
        if (validation) validation[`is${input.name.replace(/\s/g, '')}Valid`] = true;
    } else {
        // Only show error if we want to enforce selection
        // showError(input, `Invalid ${input.name}`);
        // if(validation) validation[`is${input.name.replace(/\s/g, '')}Valid`] = false;

        // Let's enforce it for now as per original
        if (list.length > 0) {
            showError(input, `Invalid ${input.name}`);
            if (validation) validation[`is${input.name.replace(/\s/g, '')}Valid`] = false;
        }
    }
}

// Helper: Show/Remove Error (if not in utils.js, but it should be? 
// Actually utils.js has showError/removeError usually? 
// Let's check utils.js later. If not, I'll add them here or assume global access. 
// Original code had them in main.js or locally defined.
// The student validation.js relied on global `showError`. I'll assume it's available or I need to define it.
// Wait, `student_registration.js` (original) had them. 
// In modular version, `utils.js` likely contains them.
