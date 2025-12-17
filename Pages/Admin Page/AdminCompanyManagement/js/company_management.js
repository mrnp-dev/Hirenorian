document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const viewDocButtons = document.querySelectorAll('.seeDocu-btn');
    const resetPwdButtons = document.querySelectorAll('.reset-pwd-btn');

    // --- Edit Company Info ---
    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const row = this.closest('tr');
            if (!row) return;

            const cells = row.cells;
            const id = this.getAttribute('data-id');
            const name = cells[1].textContent.trim();
            const email = cells[5].textContent.trim();

            const params = new URLSearchParams({
                id: id,
                company_name: name,
                email: email
            });

            window.location.href = `editCompanyInfo.php?${params.toString()}`;
        });

    });





    document.addEventListener('click', function (e) {
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const row = actionBtn.closest('tr');
            if (!row) return;

            const accountStatusCell = row.cells[7];

            if (actionBtn.classList.contains('suspend-btn')) {
                const companyID = row.querySelector('td:first-child').textContent.trim();

                swal({
                    title: "Update Activation Status?",
                    text: "Do you want to proceed with changing the company's activation status?",
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
                            updateCompanyActivationStatus(companyID, 'deactivated');
                            auditLogs('Update', 'updated company activation status for company id: ' + companyID);
                        } else {
                            swal("Action cancelled.");
                        }
                    });
            } else if (actionBtn.classList.contains('activate-btn')) {
                const companyID = row.querySelector('td:first-child').textContent.trim();


                swal({
                    title: "Update Activation Status?",
                    text: "Do you want to proceed with changing the company's activation status?",
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

                            // Update Button to Suspend
                            actionBtn.classList.remove('activate-btn');
                            actionBtn.classList.add('suspend-btn');
                            actionBtn.setAttribute('title', 'suspend/deactivate');
                            actionBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
                            updateCompanyActivationStatus(companyID, 'activated');
                            auditLogs('Update', 'updated company activation status for company id: ' + companyID);
                        } else {
                            swal("Action cancelled.");
                        }
                    });

            } else if (actionBtn.classList.contains('delete-btn')) {
                const companyID = row.querySelector('td:first-child').textContent.trim();

                swal({
                    title: "Delete Company?",
                    text: "Do you want to proceed with deleting the company?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            row.remove();

                            deleteCompany(companyID);

                            swal("Company deleted!", {
                                icon: "success",
                            });
                        } else {
                            swal("Action cancelled.");
                        }
                    });
            } else if (actionBtn.classList.contains('seeDocu-btn')) {
                const companyID = actionBtn.getAttribute('data-id');
                if (companyID) {
                    window.location.href = `ViewCompanyDocuments.php?id=${companyID}`;
                } else {
                    console.error("Company ID missing on view document button");
                }
            }
        }

        if (e.target.classList.contains('verification-btn')) {
            const btn = e.target;
            const row = btn.closest('tr');

            swal({
                title: "Update Activation Status?",
                text: "Do you want to proceed with changing the company's activation status?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
                .then((willChange) => {
                    if (willChange) {
                        swal("Activation status updated!", {
                            icon: "success",
                        });

                        if (!row) return;
                        const companyID = row.querySelector('td:first-child').textContent.trim();

                        if (btn.classList.contains('verified')) {
                            btn.classList.remove('verified');
                            btn.classList.add('unverified');
                            btn.textContent = 'unverified';
                            updateCompanyVerificationStatus(companyID, 'unverified');
                            auditLogs('Update', 'updated company verification status for company id: ' + companyID);

                        } else {
                            btn.classList.remove('unverified');
                            btn.classList.add('verified');
                            btn.textContent = 'verified';
                            updateCompanyVerificationStatus(companyID, 'verified');
                            auditLogs('Update', 'updated company verification status for company id: ' + companyID);
                        }
                    } else {
                        swal("Action cancelled.");
                    }
                });
        }
    });

    function updateCompanyVerificationStatus(companyID, status) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/update_company_verification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company_id: companyID,
                verified_status: status
            })
        })
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

    function updateCompanyActivationStatus(companyID, status) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/update_company_activation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company_id: companyID,
                activation: status
            })
        })
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




    function deleteCompany(companyId) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/deleteCompanyInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company_id: companyId,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Company deleted: ' + companyId);
                    auditLogs('Delete', 'deleted company with company id: ' + companyId);
                } else {
                    console.error('Failed to delete company:', data.message);
                    alert('Error deleting company: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error Deleting Company');
            });
    }

    function auditLogs(actionType, decription) {
        fetch('http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/audit.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action_type: actionType,
                description: decription,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Audit log added successfully');
                } else {
                    console.error('Failed to add audit log:', data.message);
                    alert('Error adding audit log: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error logging audit log.');
            });
    }


});