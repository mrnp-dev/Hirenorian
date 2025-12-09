/**
 * Education Modal Module
 * Handles educational background modal functionality
 * Dependencies: ui-controls.js
 */

// ============ EDUCATIONAL BACKGROUND MANAGEMENT ============

document.addEventListener('DOMContentLoaded', () => {
    const editEducationModal = document.getElementById('editEducationModal');
    const editEducationForm = document.getElementById('editEducationForm');
    const addEducationForm = document.getElementById('addEducationForm');
    const addEducationModal = document.getElementById('addEducationModal');

    // Handle Add Education Form Submission
    if (addEducationForm) {
        addEducationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('studentId').value;
            // Note: Use querySelector within the form to avoid ID conflicts if IDs are reused or checking specifically for add form inputs
            // The add form inputs have simple IDs in edit_profile.php: id="degree", id="school", id="eduStartDate", id="eduEndDate"
            const degree = addEducationForm.querySelector('#degree').value.trim();
            const school = addEducationForm.querySelector('#school').value.trim();
            const startYear = addEducationForm.querySelector('#eduStartDate').value.trim();
            const endYear = addEducationForm.querySelector('#eduEndDate').value.trim();

            if (!degree || !school || !startYear || !endYear) {
                ToastSystem.show('Please fill in all fields', 'warning');
                return;
            }

            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/add_education_bg.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    degree,
                    institution: school,
                    start_year: startYear,
                    end_year: endYear
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        ToastSystem.show('Education added successfully', "success");
                        if (addEducationModal) closeModal(addEducationModal);

                        // SPA Update: Add new item to timeline
                        const timeline = document.querySelector('.education-section .timeline');
                        if (timeline) {
                            // Check if it was empty state
                            if (timeline.querySelector('p') && timeline.querySelector('p').textContent.includes('No education')) {
                                timeline.innerHTML = '';
                            }

                            const newEduId = data.edu_id || Date.now(); // Fallback if API doesn't return ID

                            const newItem = document.createElement('div');
                            newItem.className = 'timeline-item';
                            newItem.setAttribute('data-edu-id', newEduId);

                            // Create HTML structure for new item
                            newItem.innerHTML = `
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <div class="timeline-info">
                                        <h3>${degree}</h3>
                                        <p class="institution">${school}</p>
                                        <p class="date">${startYear} - ${endYear}</p>
                                    </div>
                                    <div class="timeline-actions">
                                        <button class="icon-btn-sm edit-education-btn" 
                                            data-edu-id="${newEduId}"
                                            data-degree="${degree}"
                                            data-institution="${school}"
                                            data-start-year="${startYear}"
                                            data-end-year="${endYear}">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                        <button class="icon-btn-sm delete-education-btn" 
                                            data-edu-id="${newEduId}">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;

                            // Append to timeline
                            timeline.appendChild(newItem);

                            // Clean form inputs
                            addEducationForm.reset();
                        }
                    } else {
                        ToastSystem.show('Failed to add education', "error");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    ToastSystem.show('Network error', "error");
                });
        });
    }

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
            const studentId = document.getElementById('studentId').value;

            // Validate inputs
            if (!degree || !school || !startYear || !endYear) {
                ToastSystem.show('Please fill in all fields', 'warning');
                return;
            }

            // TODO: Add API call to update the education entry
            // For now, simulate success if no API exists for EDIT yet
            console.log('Updating education entry:', {
                edu_id: eduId,
                degree: degree,
                institution: school,
                start_year: startYear,
                end_year: endYear
            });

            // We can add logic here to fetch an update API if/when created.
            // Current user request only mentioned "add_education_update.php" (bg).

            // Update DOM purely for visual feedback or just reload if we had an API.
            // Since we don't have an edit API yet, we'll keep the existing simulation logic 
            // but update it to use ToastSystem and maybe simulate reload if desired, 
            // though without saving it will reset. 

            // Wait, looking at the previous file content, it was alerting. 
            // I'll leave the Edit logic mostly as is but upgrade alerts to Toasts.

            ToastSystem.show('Education updated (Simulation only - API missing)', "info");

            /* 
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
            */

            // Close modal
            closeModal(editEducationModal);
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
                // TODO: Add API call to delete the education entry
                console.log('Deleting education entry ID:', eduId);

                // Remove from DOM
                timelineItem.remove();

                // Check if timeline is empty
                const timeline = document.querySelector('.education-section .timeline');
                if (timeline && timeline.querySelectorAll('.timeline-item').length === 0) {
                    timeline.innerHTML = '<p>No education history added.</p>';
                }

                // Show success message
                ToastSystem.show('Education deleted (Simulation)', "info");
            }
        }
    });
});
