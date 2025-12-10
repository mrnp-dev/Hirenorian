/**
 * Experience Modal Module
 * Handles work experience modal functionality
 * Dependencies: ui-controls.js
 */

// ============ EXPERIENCE MANAGEMENT ============

document.addEventListener('DOMContentLoaded', () => {
    const editExperienceModal = document.getElementById('editExperienceModal');
    const editExperienceForm = document.getElementById('editExperienceForm');
    const addExperienceForm = document.getElementById('addExperienceForm');
    const addExperienceModal = document.getElementById('addExperienceModal');

    // Handle Add Experience Form Submission
    if (addExperienceForm) {
        addExperienceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('studentIdExp').value;
            const jobTitle = addExperienceForm.querySelector('#jobTitle').value.trim();
            const company = addExperienceForm.querySelector('#company').value.trim();
            const startYear = addExperienceForm.querySelector('#expStartDate').value.trim();
            const endYear = addExperienceForm.querySelector('#expEndDate').value.trim();
            const description = addExperienceForm.querySelector('#description').value.trim();

            if (!jobTitle || !company || !startYear || !endYear) {
                ToastSystem.show('Please fill in required fields', 'warning');
                return;
            }

            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/add_experience_bg.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    job_title: jobTitle,
                    company,
                    start_year: startYear,
                    end_year: endYear,
                    description: description
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        ToastSystem.show('Experience added successfully', "success");
                        if (addExperienceModal) closeModal(addExperienceModal);

                        // SPA Update: Add new item to timeline
                        const timeline = document.querySelector('.experience-section .timeline');
                        if (timeline) {
                            // Check if it was empty state
                            if (timeline.querySelector('p') && timeline.querySelector('p').textContent.includes('No experience')) {
                                timeline.innerHTML = '';
                            }

                            const newExpId = data.exp_id || Date.now();

                            const newItem = document.createElement('div');
                            newItem.className = 'timeline-item';
                            newItem.setAttribute('data-exp-id', newExpId);

                            // Create HTML structure for new item
                            newItem.innerHTML = `
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <div class="timeline-info">
                                        <h3>${jobTitle}</h3>
                                        <p class="institution">${company}</p>
                                        <p class="date">${startYear} - ${endYear}</p>
                                        <p class="description">${description || ''}</p>
                                    </div>
                                    <div class="timeline-actions">
                                        <button class="icon-btn-sm edit-experience-btn" 
                                            data-exp-id="${newExpId}"
                                            data-job-title="${jobTitle}"
                                            data-company="${company}"
                                            data-start-date="${startYear}"
                                            data-end-date="${endYear}"
                                            data-description="${description || ''}">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                        <button class="icon-btn-sm delete-experience-btn" 
                                            data-exp-id="${newExpId}">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;

                            // Append to timeline
                            timeline.appendChild(newItem);

                            // Clean form inputs
                            addExperienceForm.reset();
                        }
                    } else {
                        ToastSystem.show('Failed to add experience', "error");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    ToastSystem.show('Network error', "error");
                });
        });
    }

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

            // TODO: Add API call to update the experience entry
            console.log('Updating experience entry:', {
                exp_id: expId,
                job_title: jobTitle,
                company_name: company,
                start_date: startDate,
                end_date: endDate,
                description: description
            });

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

            // Show success message
            alert('Experience entry updated successfully!');
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
            // Confirm deletion
            ConfirmSystem.show(
                `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`,
                () => {
                    fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/delete_experience_bg.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            exp_id: expId
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === "success") {
                                // Remove from DOM
                                timelineItem.remove();

                                // Check if timeline is empty
                                const timeline = document.querySelector('.experience-section .timeline');
                                if (timeline && timeline.querySelectorAll('.timeline-item').length === 0) {
                                    timeline.innerHTML = '<p>No experience added.</p>';
                                }

                                ToastSystem.show('Experience entry deleted successfully', "success");
                            } else {
                                ToastSystem.show('Failed to delete experience entry', "error");
                            }
                        })
                        .catch(err => {
                            console.error("Fetch error:", err);
                            ToastSystem.show('Network error', "error");
                        });
                },
                'danger',
                'Delete Experience'
            );
        }
    });
});
