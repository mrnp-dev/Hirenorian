/**
 * Skills Modal Module
 * Handles skills management modal functionality
 * Dependencies: validation.js
 */

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

                const studentId = document.getElementsByName('student_id')[0].value;
                const technicalSkills = document.getElementById('technicalSkillsData').value;
                const softSkills = document.getElementById('softSkillsData').value;

                // Loading State
                const submitBtn = skillsForm.querySelector('button[type="submit"]');
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;

                fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/update_skills_bg.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: studentId,
                        technical_skills: technicalSkills,
                        soft_skills: softSkills
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "success") {
                            // Update Static Display
                            const techDisplay = document.getElementById('technical-skills-display');
                            const softDisplay = document.getElementById('soft-skills-display');

                            if (techDisplay) {
                                const techList = technicalSkills.split(',').filter(s => s.trim() !== '');
                                techDisplay.innerHTML = techList.length > 0
                                    ? techList.map(skill => `<span>${skill.trim()}</span>`).join('')
                                    : '<span>No technical skills added</span>';
                            }

                            if (softDisplay) {
                                const softList = softSkills.split(',').filter(s => s.trim() !== '');
                                softDisplay.innerHTML = softList.length > 0
                                    ? softList.map(skill => `<span>${skill.trim()}</span>`).join('')
                                    : '<span>No soft skills added</span>';
                            }

                            // Close modal
                            if (skillsModal) closeModal(skillsModal);

                            ToastSystem.show('Skills updated successfully', "success");
                        } else {
                            ToastSystem.show('Failed to update skills', "error");
                        }
                    })
                    .catch(err => {
                        console.error("Fetch error:", err);
                        ToastSystem.show('Network error', "error");
                    })
                    .finally(() => {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;
                    });
            });
        }
    }
});
