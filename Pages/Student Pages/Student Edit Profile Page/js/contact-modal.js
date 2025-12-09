/**
 * Contact Modal Module
 * Handles contact information modal functionality
 * Dependencies: validation.js
 */

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
