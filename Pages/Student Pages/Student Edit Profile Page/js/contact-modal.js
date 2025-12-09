/**
 * Contact Modal Module
 * Handles contact information modal functionality
 * Dependencies: validation.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('editContactModal');

    if (contactModal) {
        const studentIdInput = contactModal.querySelector('#student_id');
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

                const studentId = studentIdInput ? studentIdInput.value : "";
                const isEmailValid = personalEmailInput ? validateEmail(personalEmailInput) : true;
                const isPhoneValid = phoneInput ? validatePhoneNumber(phoneInput) : true;
                const isLocationValid = locationInput ? validateLocation(locationInput) : true;

                if (isEmailValid && isPhoneValid && isLocationValid) {
                    // All validations passed
                    const email = personalEmailInput.value;
                    const phone = phoneInput.value;
                    const location = locationInput.value;

                    console.log('Form is valid, ready to submit');
                    console.log('Email:', email);
                    console.log('Phone:', phone);
                    console.log('Location:', location);

                    fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit Profile APIs/student_contact_update.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            phone,
                            location,
                            studentId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            ToastSystem.show('Contact updated successfully', "success");
                            closeModal(contactModal);
                        } else {
                            ToastSystem.show('Failed to update contact', "error");
                        }
                    })
                    .catch(err => {
                        console.error("Fetch error:", err);
                        ToastSystem.show('Network error', "error");
                    });
                }
            });
        }
    }
});
