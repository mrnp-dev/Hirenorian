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

// ============ SKILLS MODAL MANAGEMENT ============

document.addEventListener('DOMContentLoaded', () => {
    const skillsModal = document.getElementById('editSkillsModal');

    if (skillsModal) {
        const technicalInput = document.getElementById('technicalSkillInput');
        const softInput = document.getElementById('softSkillInput');
        const addTechnicalBtn = document.getElementById('addTechnicalSkill');
        const addSoftBtn = document.getElementById('addSoftSkill');
        const technicalContainer = document.getElementById('technicalSkillsContainer');
        const softContainer = document.getElementById('softSkillsContainer');
        const skillsForm = document.getElementById('skillsForm');

        // Function to add a skill
        function addSkill(input, container, category) {
            const skillName = input.value.trim();

            if (skillName === '') {
                showError(input, 'Please enter a skill name');
                return;
            }

            // Check if skill already exists
            const existingSkills = Array.from(container.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.trim().replace('×', '').trim());

            if (existingSkills.includes(skillName)) {
                showError(input, 'This skill is already added');
                return;
            }

            // Create skill tag
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.setAttribute('data-category', category);
            skillTag.innerHTML = `
                ${skillName}
                <button type="button" class="remove-skill"><i class="fa-solid fa-times"></i></button>
            `;

            // Add click event to remove button
            skillTag.querySelector('.remove-skill').addEventListener('click', function () {
                skillTag.remove();
                updateHiddenInputs();
            });

            // Add to container
            container.appendChild(skillTag);

            // Clear input and remove error
            input.value = '';
            removeError(input);

            // Update hidden inputs
            updateHiddenInputs();
        }

        // Function to update hidden inputs for form submission
        function updateHiddenInputs() {
            const technicalSkills = Array.from(technicalContainer.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.trim().replace('×', '').trim());
            const softSkills = Array.from(softContainer.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.trim().replace('×', '').trim());

            document.getElementById('technicalSkillsData').value = technicalSkills.join(',');
            document.getElementById('softSkillsData').value = softSkills.join(',');
        }

        // Add skill on button click
        if (addTechnicalBtn) {
            addTechnicalBtn.addEventListener('click', () => {
                addSkill(technicalInput, technicalContainer, 'technical');
            });
        }

        if (addSoftBtn) {
            addSoftBtn.addEventListener('click', () => {
                addSkill(softInput, softContainer, 'soft');
            });
        }

        // Add skill on Enter key
        if (technicalInput) {
            technicalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(technicalInput, technicalContainer, 'technical');
                }
            });
        }

        if (softInput) {
            softInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(softInput, softContainer, 'soft');
                }
            });
        }

        // Handle existing remove buttons on page load
        document.querySelectorAll('.skill-tag .remove-skill').forEach(button => {
            button.addEventListener('click', function () {
                this.closest('.skill-tag').remove();
                updateHiddenInputs();
            });
        });

        // Initialize hidden inputs on page load
        updateHiddenInputs();

        // Handle form submission
        if (skillsForm) {
            skillsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                updateHiddenInputs();

                console.log('Technical Skills:', document.getElementById('technicalSkillsData').value);
                console.log('Soft Skills:', document.getElementById('softSkillsData').value);

                // TODO: Add actual form submission logic here
                alert('Skills updated! Form submission logic to be implemented.');
            });
        }
    }
});

