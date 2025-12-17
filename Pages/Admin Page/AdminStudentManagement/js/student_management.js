document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addStudentButton = document.querySelector('.add-new-btn');
    const pageNumbers = document.querySelectorAll('.pagination-nav .page-number');
    const navArrows = document.querySelectorAll('.pagination-nav .nav-arrow');
    const seeDocuButtons = document.querySelectorAll('.seeDocu-btn');

    const activationButtons = document.querySelectorAll('.activation-btn');
    const verificationButtons = document.querySelectorAll('.verification-btn');


    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            try {
                const row = this.closest('tr');
                const cells = row.cells;

                if (!cells || cells.length < 8) {
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
                alert('An error occurred. Check console for details.');
            }
        });
    });

    document.addEventListener('click', function (e) {
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const row = actionBtn.closest('tr');
            if (!row) return;

            const accountStatusCell = row.cells[9];

            if (actionBtn.classList.contains('suspend-btn')) {
                const studentID = row.querySelector('td:first-child').textContent.trim();

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

                            accountStatusCell.innerHTML = '<span class="badge bg-danger">Deactivated</span>';
                            actionBtn.classList.remove('suspend-btn');
                            actionBtn.classList.add('activate-btn');
                            actionBtn.setAttribute('title', 'activate');
                            actionBtn.innerHTML = '<i class="fa-solid fa-power-off"></i>';
                            updateStudentActivationStatus(studentID, 'false');
                            auditLogs('Update', 'updated student activation status for student id: ' + studentID);
                        } else {
                            swal("Action cancelled.");
                        }
                    });
            } else if (actionBtn.classList.contains('activate-btn')) {
                const studentID = row.querySelector('td:first-child').textContent.trim();


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

                            accountStatusCell.innerHTML = '<span class="badge bg-success">Activated</span>';

                            actionBtn.classList.remove('activate-btn');
                            actionBtn.classList.add('suspend-btn');
                            actionBtn.setAttribute('title', 'suspend/deactivate');
                            actionBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
                            updateStudentActivationStatus(studentID, 'true');
                            auditLogs('Update', 'updated student activation status for student id: ' + studentID);
                        } else {
                            swal("Action cancelled.");
                        }
                    });

            } else if (actionBtn.classList.contains('delete-btn')) {
                const studentID = row.querySelector('td:first-child').textContent.trim();

                swal({
                    title: "Delete Student?",
                    text: "Do you want to proceed with deleting the student?",
                    icon: "info",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            row.remove();

                            deleteStudent(studentID);
                            auditLogs('Delete', 'deleted student information for student id: ' + studentID);
                            swal("Student deleted!", {
                                icon: "success",
                            });
                        } else {
                            swal("Action cancelled.");
                        }
                    });
            } else if (actionBtn.classList.contains('seeDocu-btn')) {
                const studentID = row.querySelector('td:first-child').textContent.trim();

                if (studentID) {
                    const apiUrl = `http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/fetch_documents.php?student_id=${studentID}`;

                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success' && data.data) {
                                const studentType = data.data.student_type;

                                if (studentType === 'Graduate') {
                                    window.location.href = `ViewStudDocuments.php?id=${studentID}`;
                                } else if (studentType === 'Undergraduate') {
                                    window.location.href = `viewStudDocu2.php?id=${studentID}`;
                                } else {
                                    console.warn('Unknown student type:', studentType);
                                    if (!studentType) {
                                        window.location.href = `ViewStudDocuments.php?id=${studentID}`;
                                    } else {
                                        window.location.href = `ViewStudDocuments.php?id=${studentID}`;
                                    }
                                }
                            } else {
                                swal("Error", "Failed to retrieve student information.", "error");
                            }
                        })
                        .catch(error => {
                            swal("Error", "An error occurred while fetching student details.", "error");
                        });
                }
            }
        }
    });



    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('verification-btn')) {
            const btn = e.target;
            const row = btn.closest('tr');
            if (!row) return; // Safety check

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
                        updateStudentActivationStatus(studentId, statusToSend);;
                    } else {
                        swal("Action cancelled.");
                    }
                });
        }
    });


    function updateStudentVerificationStatus(studentId, status) {

        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/update_student_verification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentId,
                verified: status
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    auditLogs('Update', 'updated student verification status for student id: ' + studentId);
                } else {
                    alert('Error updating verification: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                alert('Error Updating Verification Status');
            });
    }

    function updateStudentActivationStatus(studentID, status) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/update_student_activation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentID,
                activated: status
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Activation updated: ' + status);
                } else {
                    console.error('Failed to update activation:', data.message);
                    alert('Error updating activation: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating activation status.');
            });
    }

    function deleteStudent(studentId) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id: studentId,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    auditLogs('Delete', 'deleted information for student id: ' + studentId);
                } else {
                    alert('Error deleting student: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                alert('Error Deleting Student');
            });
    }

});

function auditLogs(actionType, description) {
    return fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/audit.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action_type: actionType,
            description: description,
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Audit log added successfully');
            } else {
                console.error('Failed to add audit log:', data.message);
               
            }
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
           
        });
}

window.handleLogout = function () {
    auditLogs('Logout', 'Logout as admin')
        .then(() => {
            window.location.href = '../../AdminRegister/php/register.php';
        })
        .catch(() => {
            
            window.location.href = '../../AdminRegister/php/register.php';
        });
};