/**
 * Personal Details Modal Module
 * Handles editing of personal information (Name)
 * Dependencies: ui-controls.js, toast.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const editPersonalModal = document.getElementById('editPersonalModal');
    const personalForm = document.getElementById('personalForm');

    if (personalForm) {
        personalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentId = document.getElementById('studentIdPersonal').value;
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const middleInitial = document.getElementById('middleInitial').value.trim();
            const suffix = document.getElementById('suffix').value.trim();

            if (!firstName || !lastName) {
                ToastSystem.show('First Name and Last Name are required', 'warning');
                return;
            }

            // Loading State
            const submitBtn = personalForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;

            fetch("http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit%20Profile%20APIs/student_personal_update.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    first_name: firstName,
                    last_name: lastName,
                    middle_initial: middleInitial,
                    suffix: suffix
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Update DOM
                        const fullNameDisplay = document.getElementById('display-full-name');
                        if (fullNameDisplay) {
                            let fullName = `${firstName} `;
                            if (middleInitial) fullName += `${middleInitial}. `;
                            fullName += lastName;
                            if (suffix) fullName += ` ${suffix}`;
                            fullNameDisplay.textContent = fullName;
                        }

                        ToastSystem.show('Personal details updated successfully', 'success');
                        if (editPersonalModal) closeModal(editPersonalModal);
                    } else {
                        ToastSystem.show(data.message || 'Failed to update details', 'error');
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    ToastSystem.show('Network error', 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.disabled = false;
                });
        });
    }
});
