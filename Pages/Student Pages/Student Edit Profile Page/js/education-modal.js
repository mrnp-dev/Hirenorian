/**
 * Education Modal Module
 * Handles educational background modal functionality
 * Dependencies: ui-controls.js
 */

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

            // TODO: Add API call to update the education entry
            console.log('Updating education entry:', {
                edu_id: eduId,
                degree: degree,
                institution: school,
                start_year: startYear,
                end_year: endYear
            });

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

            // Show success message
            alert('Education entry updated successfully!');
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
                alert('Education entry deleted successfully!');
            }
        }
    });
});
