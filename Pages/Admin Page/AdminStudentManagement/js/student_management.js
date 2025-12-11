document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addStudentButton = document.querySelector('.add-new-btn');
    const pageNumbers = document.querySelectorAll('.pagination-nav .page-number');
    const navArrows = document.querySelectorAll('.pagination-nav .nav-arrow');

    const activationButtons = document.querySelectorAll('.activation-btn');
    const verificationButtons = document.querySelectorAll('.verification-btn');



    // --- CRUD Actions (Front-end only simulation) ---
    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            try {
                const row = this.closest('tr');
                const cells = row.cells;

                if (!cells || cells.length < 8) {
                    console.error('Row does not have enough columns (expected at least 8).', cells);
                    alert('Error: Table structure mismatch. Please refresh the page.');
                    return;
                }

                const studentId = cells[0].textContent.trim();
                const firstName = cells[1].textContent.trim();
                const middleInitial = cells[2].textContent.trim();
                const lastName = cells[3].textContent.trim();
                const suffix = cells[4].textContent.trim();
                const email = cells[7].textContent.trim();

                const params = new URLSearchParams({
                    id: studentId,
                    first: firstName,
                    mi: middleInitial,
                    last: lastName,
                    suffix: suffix,
                    email: email
                });

                window.location.href = `editInfo.php?${params.toString()}`;
            } catch (err) {
                console.error('Error in edit button handler:', err);
                alert('An error occurred. Check console for details.');
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const studentId = row.querySelector('td:first-child').textContent;

            if (confirm('Are you sure you want to delete student ID: ' + studentId + '?')) {
                row.remove();
                alert('Student ID ' + studentId + ' deleted (front-end simulation).');
            }
        });
    });

    if (addStudentButton) {
        addStudentButton.addEventListener('click', function () {
            alert('Opening form to add a new student.');
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('verification-btn')) {
            const btn = e.target;

            swal({
                title: "Update Verification Status?",
                text: "Do you want to proceed with changing the student's verification status?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willChange) => {
                if (willChange) {
                    swal("Verification status updated!", {
                        icon: "success",
                    });


                    const row = btn.closest('tr');
                    if (!row) return;
                    const studentId = row.querySelector('td:first-child').textContent.trim();

                    let statusToSend = '';

                    if (btn.classList.contains('verified')) {
                        btn.classList.remove('verified');
                        btn.classList.add('unverified');
                        btn.textContent = 'unverified';
                        statusToSend = 'false';
                    } else {
                        btn.classList.remove('unverified');
                        btn.classList.add('verified');
                        btn.textContent = 'verified';
                        statusToSend = 'true';
                    }
                        updateStudentVerificationStatus(studentId, statusToSend);
                } else {
                    swal("Action cancelled.");
                }
            });
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('activation-btn')) {
            const btn = e.target;

            swal({
                title: "Update Activation Status?",
                text: "Do you want to proceed with changing the student's activation status?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willChange) => {
                if (willChange) {
                    swal("Activation status updated!", {
                        icon: "success",
                });

                const row = btn.closest('tr');
                if (!row) return;
                const studentId = row.querySelector('td:first-child').textContent.trim();

                let statusToSend = '';

                if (btn.classList.contains('activated')) {
                    btn.classList.remove('activated');
                    btn.classList.add('deactivated');
                    btn.textContent = 'deactivated';
                    statusToSend = 'false';
                } else {
                    btn.classList.remove('deactivated');
                    btn.classList.add('activated');
                    btn.textContent = 'activated';
                    statusToSend = 'true';
                }
                updateStudentActivationStatus(studentId, statusToSend);
             } else {
                    swal("Action cancelled.");
                }
            });
        }
    });

    function updateStudentActivationStatus(studentId, status) {
        fetch('/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/studentManagementAPIs/update_student_activation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentId,
                activated: status
            })
        })
            //TODO: update dialog notification
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Activation updated: ' + status);
                } else {
                    console.error('Failed to update activation:', data.message);
                    alert('Error updating status: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating activation status.');
            });
    }

    function updateStudentVerificationStatus(studentId, status) {

        fetch('/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/studentManagementAPIs/update_student_verification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentId,
                verified: status
            })
        })
            //TODO: update dialog notification
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Verification updated: ' + status);
                } else {
                    console.error('Failed to update verification:', data.message);
                    alert('Error updating verification: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error Updating Verification Status');
            });
    }

});