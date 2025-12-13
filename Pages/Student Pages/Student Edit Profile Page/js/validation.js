/**
 * Validation Module
 * Centralized validation logic for all forms
 */

// ============ VALIDATION UTILITIES ============

function showError(input, errorMessage) {
    input.classList.add('error');
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '4px';
        errorElement.style.display = 'block';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
}

function removeError(input) {
    input.classList.remove('error');
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) {
        errorElement.remove();
    }
}

// ============ VALIDATION FUNCTIONS ============

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = input.value.trim();

    if (value === '') {
        showError(input, 'Email cannot be empty');
        return false;
    }

    if (!emailRegex.test(value)) {
        showError(input, 'Invalid email format');
        return false;
    }

    removeError(input);
    return true;
}

function validatePhoneNumber(input) {
    const phoneRegex = /^(?:\+639\d{9}|09\d{9})$/;
    const value = input.value.trim();

    if (value === '') {
        showError(input, 'Phone number cannot be empty');
        return false;
    }

    if (!phoneRegex.test(value)) {
        showError(input, 'Invalid Philippine phone number (e.g., 09123456789 or +639123456789)');
        return false;
    }

    removeError(input);
    return true;
}

function validateLocation(input) {
    const value = input.value.trim();

    if (value === '') {
        showError(input, 'Location cannot be empty');
        return false;
    }

    if (value.length < 3) {
        showError(input, 'Location must be at least 3 characters');
        return false;
    }

    removeError(input);
    return true;
}

// Export functions for use in other modules
window.showError = showError;
window.removeError = removeError;
window.validateEmail = validateEmail;
window.validatePhoneNumber = validatePhoneNumber;
window.validateLocation = validateLocation;
