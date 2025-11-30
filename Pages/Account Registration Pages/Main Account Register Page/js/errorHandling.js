/**
 * =============================================================================
 * FORM VALIDATION - ERROR DISPLAY & MESSAGE HANDLING
 * =============================================================================
 * Handles displaying and removing error messages, showing validation feedback
 */

/**
 * Displays an error message for an input field
 * Adds red border, shows error text below the input
 * 
 * @param {HTMLElement} input - The input element
 * @param {string} errorMessage - The error message to display
 */
function showError(input, errorMessage) {
    input.classList.add('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.textContent = errorMessage;
    errorElement.style.color = 'red';
    errorElement.style.visibility = 'visible';
}

/**
 * Removes error styling and message from an input field
 * Hides the error text and removes red border
 * 
 * @param {HTMLElement} input - The input element
 */
function removeError(input) {
    input.classList.remove('input_InvalidInput');
    const section = input.closest(".input-wrapper");
    const errorElement = section.querySelector("p");
    errorElement.style.visibility = 'hidden';
}

/**
 * Displays password strength feedback
 * Shows "weak", "medium", or "strong" with appropriate color coding
 * 
 * @param {HTMLElement} element - The password input element
 * @param {number} strength - Strength level (1=weak, 2=medium, 3=strong)
 * @returns {boolean} - Returns false if weak, true otherwise
 */
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

/**
 * Shows password match confirmation message
 * Displays "Passwords matched" in green when passwords match
 * 
 * @param {HTMLElement} input - The confirm password input element
 * @returns {boolean} - Returns false if passwords don't match
 */
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

/**
 * Clears all error messages and invalid input styles from the form
 */
function clearAllErrors() {
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.classList.remove('input_InvalidInput'));
}
