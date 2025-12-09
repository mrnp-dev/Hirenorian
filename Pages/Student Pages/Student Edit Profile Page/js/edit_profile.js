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
                    // Prepare form data
                    const formData = new FormData(contactForm);

                    // Submit to handler
                    fetch('../handlers/handle_contact_update.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                // Update displayed values on the page
                                if (personalEmailInput) {
                                    document.querySelector('.contact-item:nth-child(1) span').textContent = personalEmailInput.value;
                                }
                                if (phoneInput) {
                                    document.querySelector('.contact-item:nth-child(3) span').textContent = phoneInput.value;
                                }
                                if (locationInput) {
                                    document.querySelector('.contact-item:nth-child(4) span').textContent = locationInput.value;
                                }

                                closeModal(contactModal);
                                alert('Contact information updated successfully!');
                            } else {
                                alert('Error: ' + data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Failed to update contact information. Please try again.');
                        });
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

                const formData = new FormData(skillsForm);

                // Submit to handler
                fetch('../handlers/handle_skills_update.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Update the displayed skills on the page
                            const technicalSkillsDisplay = document.querySelector('.skills-category:nth-child(1) .tags');
                            const softSkillsDisplay = document.querySelector('.skills-category:nth-child(2) .tags');

                            // Update technical skills display
                            if (technicalSkillsDisplay) {
                                const techSkills = Array.from(technicalContainer.querySelectorAll('.skill-tag'))
                                    .map(tag => tag.textContent.trim().replace('×', '').trim());

                                if (techSkills.length > 0) {
                                    technicalSkillsDisplay.innerHTML = techSkills.map(skill => `<span>${skill}</span>`).join('');
                                } else {
                                    technicalSkillsDisplay.innerHTML = '<span>No technical skills added</span>';
                                }
                            }

                            // Update soft skills display
                            if (softSkillsDisplay) {
                                const softSkills = Array.from(softContainer.querySelectorAll('.skill-tag'))
                                    .map(tag => tag.textContent.trim().replace('×', '').trim());

                                if (softSkills.length > 0) {
                                    softSkillsDisplay.innerHTML = softSkills.map(skill => `<span>${skill}</span>`).join('');
                                } else {
                                    softSkillsDisplay.innerHTML = '<span>No soft skills added</span>';
                                }
                            }

                            closeModal(skillsModal);
                            alert('Skills updated successfully!');
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to update skills. Please try again.');
                    });
            });
        }
    }
});


// ============ EDUCATIONAL BACKGROUND MANAGEMENT ============

document.addEventListener('DOMContentLoaded', () => {
    const editEducationModal = document.getElementById('editEducationModal');
    const editEducationForm = document.getElementById('editEducationForm');

    // Handle Edit Education Button Click
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-education-btn');

        if (editBtn) {
            const eduId = editBtn.dataset.eduId;
            const degree = editBtn.dataset.degree;
            const institution = editBtn.dataset.institution;
            const startYear = editBtn.dataset.startYear;
            const endYear = editBtn.dataset.endYear;

            // Populate the modal with current data
            document.getElementById('editEduId').value = eduId;
            document.getElementById('editDegree').value = degree;
            document.getElementById('editSchool').value = institution;
            document.getElementById('editEduStartDate').value = startYear;
            document.getElementById('editEduEndDate').value = endYear;

            // Open the modal
            openModal(editEducationModal);
        }
    });

    // Handle Edit Education Form Submission
    if (editEducationForm) {
        editEducationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const eduId = document.getElementById('editEduId').value;
            const degree = document.getElementById('editDegree').value.trim();
            const school = document.getElementById('editSchool').value.trim();
            const startYear = document.getElementById('editEduStartDate').value.trim();
            const endYear = document.getElementById('editEduEndDate').value.trim();

            // Validate inputs
            if (!degree || !school || !startYear || !endYear) {
                alert('Please fill in all fields');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('operation', 'update');
            formData.append('edu_id', eduId);
            formData.append('degree', degree);
            formData.append('school', school);
            formData.append('start_year', startYear);
            formData.append('end_year', endYear);

            // Submit to handler
            fetch('../handlers/handle_education_operations.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Update the DOM
                        const timelineItem = document.querySelector(`.timeline-item[data-edu-id="${eduId}"]`);
                        if (timelineItem) {
                            timelineItem.querySelector('h3').textContent = degree;
                            timelineItem.querySelector('.institution').textContent = school;
                            timelineItem.querySelector('.date').textContent = `${startYear} - ${endYear}`;

                            // Update data attributes on the edit button
                            const editBtn = timelineItem.querySelector('.edit-education-btn');
                            editBtn.dataset.degree = degree;
                            editBtn.dataset.institution = school;
                            editBtn.dataset.startYear = startYear;
                            editBtn.dataset.endYear = endYear;
                        }

                        // Close modal
                        closeModal(editEducationModal);

                        alert('Education entry updated successfully!');
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to update education entry. Please try again.');
                });
        });
    }

    // Handle Delete Education Button Click
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-education-btn');

        if (deleteBtn) {
            const eduId = deleteBtn.dataset.eduId;
            const timelineItem = deleteBtn.closest('.timeline-item');
            const degree = timelineItem.querySelector('h3').textContent;

            // Confirm deletion
            if (confirm(`Are you sure you want to delete "${degree}"? This action cannot be undone.`)) {
                // Prepare form data
                const formData = new FormData();
                formData.append('operation', 'delete');
                formData.append('edu_id', eduId);

                // Submit to handler
                fetch('../handlers/handle_education_operations.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Remove from DOM
                            timelineItem.remove();

                            // Check if timeline is empty
                            const timeline = document.querySelector('.education-section .timeline');
                            if (timeline && timeline.querySelectorAll('.timeline-item').length === 0) {
                                timeline.innerHTML = '<p>No education history added.</p>';
                            }

                            alert('Education entry deleted successfully!');
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to delete education entry. Please try again.');
                    });
            }
        }
    });
});

// ============ EXPERIENCE MANAGEMENT ============

document.addEventListener('DOMContentLoaded', () => {
    const editExperienceModal = document.getElementById('editExperienceModal');
    const editExperienceForm = document.getElementById('editExperienceForm');

    // Handle Edit Experience Button Click
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-experience-btn');

        if (editBtn) {
            const expId = editBtn.dataset.expId;
            const jobTitle = editBtn.dataset.jobTitle;
            const company = editBtn.dataset.company;
            const startDate = editBtn.dataset.startDate;
            const endDate = editBtn.dataset.endDate;
            const description = editBtn.dataset.description;

            // Populate the modal with current data
            document.getElementById('editExpId').value = expId;
            document.getElementById('editJobTitle').value = jobTitle;
            document.getElementById('editCompany').value = company;
            document.getElementById('editExpStartDate').value = startDate;
            document.getElementById('editExpEndDate').value = endDate;
            document.getElementById('editDescription').value = description;

            // Open the modal
            openModal(editExperienceModal);
        }
    });

    // Handle Edit Experience Form Submission
    if (editExperienceForm) {
        editExperienceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const expId = document.getElementById('editExpId').value;
            const jobTitle = document.getElementById('editJobTitle').value.trim();
            const company = document.getElementById('editCompany').value.trim();
            const startDate = document.getElementById('editExpStartDate').value.trim();
            const endDate = document.getElementById('editExpEndDate').value.trim();
            const description = document.getElementById('editDescription').value.trim();

            // Validate inputs
            if (!jobTitle || !company || !startDate || !endDate) {
                alert('Please fill in all required fields');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('operation', 'update');
            formData.append('exp_id', expId);
            formData.append('job_title', jobTitle);
            formData.append('company', company);
            formData.append('start_year', startDate);
            formData.append('end_year', endDate);
            formData.append('description', description);

            // Submit to handler
            fetch('../handlers/handle_experience_operations.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Update the DOM
                        const timelineItem = document.querySelector(`.timeline-item[data-exp-id="${expId}"]`);
                        if (timelineItem) {
                            timelineItem.querySelector('h3').textContent = jobTitle;
                            timelineItem.querySelector('.institution').textContent = company;
                            timelineItem.querySelector('.date').textContent = `${startDate} - ${endDate}`;
                            timelineItem.querySelector('.description').textContent = description;

                            // Update data attributes on the edit button
                            const editBtn = timelineItem.querySelector('.edit-experience-btn');
                            editBtn.dataset.jobTitle = jobTitle;
                            editBtn.dataset.company = company;
                            editBtn.dataset.startDate = startDate;
                            editBtn.dataset.endDate = endDate;
                            editBtn.dataset.description = description;
                        }

                        // Close modal
                        closeModal(editExperienceModal);

                        alert('Experience entry updated successfully!');
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to update experience entry. Please try again.');
                });
        });
    }

    // Handle Delete Experience Button Click
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-experience-btn');

        if (deleteBtn) {
            const expId = deleteBtn.dataset.expId;
            const timelineItem = deleteBtn.closest('.timeline-item');
            const jobTitle = timelineItem.querySelector('h3').textContent;

            // Confirm deletion
            if (confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
                // Prepare form data
                const formData = new FormData();
                formData.append('operation', 'delete');
                formData.append('exp_id', expId);

                // Submit to handler
                fetch('../handlers/handle_experience_operations.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Remove from DOM
                            timelineItem.remove();

                            // Check if timeline is empty
                            const timeline = document.querySelector('.experience-section .timeline');
                            if (timeline && timeline.querySelectorAll('.timeline-item').length === 0) {
                                timeline.innerHTML = '<p>No experience added.</p>';
                            }

                            alert('Experience entry deleted successfully!');
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Failed to delete experience entry. Please try again.');
                    });
            }
        }
    });
});
