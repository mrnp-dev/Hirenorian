// Simple dropdown toggle (Reused from dashboard logic)
const profileBtn = document.getElementById('userProfileBtn');
const dropdown = document.getElementById('profileDropdown');

if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Modal Logic
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('modalOverlay');

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
    });
});

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

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

// ============ CONTACT MODAL VALIDATION ============

document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('editContactModal');

    if (contactModal) {
        const personalEmailInput = contactModal.querySelector('#personalEmail');
        const phoneInput = contactModal.querySelector('#phone');
        const locationInput = contactModal.querySelector('#location');
        const contactForm = contactModal.querySelector('form');

        // Add event listeners for real-time validation
        if (personalEmailInput) {
            personalEmailInput.addEventListener('blur', () => validateEmail(personalEmailInput));
            personalEmailInput.addEventListener('input', () => {
                if (personalEmailInput.classList.contains('error')) {
                    validateEmail(personalEmailInput);
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => validatePhoneNumber(phoneInput));
            phoneInput.addEventListener('input', () => {
                if (phoneInput.classList.contains('error')) {
                    validatePhoneNumber(phoneInput);
                }
            });
        }

        if (locationInput) {
            locationInput.addEventListener('blur', () => validateLocation(locationInput));
            locationInput.addEventListener('input', () => {
                if (locationInput.classList.contains('error')) {
                    validateLocation(locationInput);
                }
            });
        }

        // Validate on form submit
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const isEmailValid = personalEmailInput ? validateEmail(personalEmailInput) : true;
                const isPhoneValid = phoneInput ? validatePhoneNumber(phoneInput) : true;
                const isLocationValid = locationInput ? validateLocation(locationInput) : true;

                if (isEmailValid && isPhoneValid && isLocationValid) {
                    // All validations passed
                    console.log('Form is valid, ready to submit');
                    // TODO: Add actual form submission logic here
                    alert('Validation passed! Form submission logic to be implemented.');
                }
            });
        }
    }
});
