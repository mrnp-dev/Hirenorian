// Validation Functions

async function initialFirstInputs_Validations(input) {
    return checkIfEmpty(input);
}

async function firstInputsValidation() {
    console.log("Starting firstInputsValidation...");
    try {
        const firstInputs = document.querySelectorAll('#firstInputs input');
        const validations = await Promise.all(
            Array.from(firstInputs).map(async (input) => {
                try {
                    // Check for Password Strength Requirement
                    if (input.name == "Password") {
                        if (input.dataset.strength == "weak") {
                            showError(input, `${input.name}'s strength must be at least medium.`);
                            console.warn("Validation Failed: Weak Password");
                            return false;
                        }
                    }

                    const isValid = await checkIfEmpty(input);
                    if (!isValid) console.warn(`Validation Failed for ${input.name}`);
                    return isValid;

                } catch (innerErr) {
                    console.error(`Error validating input ${input.name}:`, innerErr);
                    return false;
                }
            })
        );

        const result = validations.every(Boolean);
        console.log("firstInputsValidation Result:", result);
        return result;
    } catch (err) {
        console.error("firstInputsValidation Critical Error:", err);
        return false;
    }
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

    // Debug Log
    // console.log(`Checking validity for: ${name}`);

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
            userInformation[input.name] = input.value.trim();
            isValid = true;
            break;
    }
    return isValid;
}

// ================= SPECIFIC CHECKS =================

async function checkEmail(input) {
    const validEmail_RegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = input.value.trim();

    if (!validEmail_RegEx.test(email)) {
        showError(input, `Invalid Email`);
        return false;
    }

    // Optimization: Skip API check if already verified and unchanged
    // userInformation['Company Email'] corresponds to the verified email if stored
    // or we can use currentVerifyingEmail from otp.js if accessible? 
    // userInformation is updated on successful check/verify.
    // If state is verified, it means userInformation['Company Email'] contains the valid email.
    if (typeof emailVerificationState !== 'undefined' &&
        emailVerificationState.companyEmail === true &&
        userInformation['Company Email'] === email) {
        console.log("Email already verified and unchanged. Skipping API check.");
        return true;
    }

    // Check if email already exists via API
    try {
        const isAvailable = await checkCompanyEmail(email);
        if (!isAvailable) {
            showError(input, "Email is already in use.");
            return false;
        }
    } catch (e) {
        console.error("Email check failed", e);
    }

    userInformation[input.name] = email;
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

    const len = input.value.length;
    if (len < password_minLength) {
        showError(input, `${input.name} must contain at least 12 characters.`);
        return false;
    } else if (len > password_maxLength) {
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
    // Safeguard closest/querySelector
    if (!section) return false;

    let strength_P = section.querySelector("p");

    // Create span for strength text
    const span = document.createElement('span');

    // Reset state
    strength_P.textContent = "strength: ";
    strength_P.style.color = "white"; // Reset default color if needed (or inherit)

    // If CSS handles colors via class, prefer classes. But preserving original inline style logic here.

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
        default:
            // 0 or invalid
            span.textContent = "weak";
            span.style.color = "red";
            element.dataset.strength = "weak";
            valid = false;
            break;
    }

    strength_P.append(span);
    strength_P.style.visibility = 'visible';

    return valid;
}

function confirmPassword(input) {
    const passwordField = document.querySelector('#password-input');
    if (!passwordField) {
        console.error("Password field not found for confirmation");
        return false;
    }
    const password = passwordField.value;

    if (input.value !== password) {
        showError(input, `Passwords do not match.`);
        return false;
    } else {
        input.classList.remove('input_InvalidInput'); // removing error class manually if utils doesn't

        // Show success message
        const section = input.closest(".input-wrapper");
        if (section) {
            const p = section.querySelector("p");
            if (p) {
                p.textContent = "Passwords matched";
                p.style.color = "green";
                p.style.visibility = 'visible';
            }
        }

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
    // Strict Check
    if (typeof companyTypes !== 'undefined' && companyTypes.length > 0 && !companyTypes.includes(input.value.trim())) {
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
    // Strict Check
    if (typeof industries !== 'undefined' && industries.length > 0 && !industries.includes(input.value.trim())) {
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
                    if (typeof companyTypes !== 'undefined') autoCorrect_Suggestions(input, companyTypes, secondInputs_Validation);
                }
                break;
            case 'Industry':
                if (checkIfEmpty_General(input)) {
                    if (typeof industries !== 'undefined') autoCorrect_Suggestions(input, industries, secondInputs_Validation);
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
    const index = list.findIndex(item => item.toLowerCase() === input.value.trim().toLowerCase());
    if (index !== -1) {
        input.value = list[index];
        removeError(input);
        userInformation[input.name] = input.value;
        if (validation) validation[`is${input.name.replace(/\s/g, '')}Valid`] = true;
    } else {
        if (list.length > 0) {
            showError(input, `Invalid ${input.name}`);
            if (validation) validation[`is${input.name.replace(/\s/g, '')}Valid`] = false;
        }
    }
}
