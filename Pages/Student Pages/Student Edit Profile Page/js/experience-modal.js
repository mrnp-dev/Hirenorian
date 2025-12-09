/**
 * Experience Modal Module
 * Handles work experience modal functionality
 * Dependencies: ui-controls.js
 */

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
            if (confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
                // TODO: Add API call to delete the experience entry
                console.log('Deleting experience entry ID:', expId);

                // Remove from DOM
                timelineItem.remove();

                // Check if timeline is empty
                const timeline = document.querySelector('.experience-section .timeline');
                if (timeline && timeline.querySelectorAll('.timeline-item').length === 0) {
                    timeline.innerHTML = '<p>No experience added.</p>';
                }

                // Show success message
                alert('Experience entry deleted successfully!');
            }
        }
    });
});
