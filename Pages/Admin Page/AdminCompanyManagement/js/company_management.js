document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const resetPwdButtons = document.querySelectorAll('.reset-pwd-btn');

    // --- Edit Company Info ---
    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const row = this.closest('tr');
            if (!row) return;

            const cells = row.cells;
            // Assuming order: Logo(0), Name(1), Type(2), Industry(3), Contact(4), Email(5), Status(6), ActivationStatus(7), Actions(8)
            const id = this.getAttribute('data-id');
            const name = cells[1].textContent.trim();
            const type = cells[2].textContent.trim();
            const industry = cells[3].textContent.trim();
            const contact = cells[4].textContent.trim();
            const email = cells[5].textContent.trim();

            const params = new URLSearchParams({
                id: id,
                name: name,
                type: type,
                industry: industry,
                contact: contact,
                email: email
            });

            window.location.href = `editCompanyInfo.php?${params.toString()}`;
        });
    });

    // --- Suspend / Deactivate / Activate Account & Verify (Event Delegation) ---
    document.addEventListener('click', function (e) {
        // Handle Action Buttons (Suspend/Activate)
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const row = actionBtn.closest('tr');
            if (!row) return;

            // Assuming Column Indices:
            // 0: Logo, 1: Name, 2: Type, 3: Industry, 4: Contact, 5: Email, 6: Account Status(Ver), 7: Activation Status(Active), 8: Actions
            const accountStatusCell = row.cells[7];
            const id = actionBtn.getAttribute('data-id');

            // Suspend Action
            if (actionBtn.classList.contains('suspend-btn')) {
                swal({
                    title: "Suspend Account?",
                    text: "Are you sure you want to suspend this company account?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willSuspend) => {
                        if (willSuspend) {
                            swal("Suspended!", "Company ID " + id + " has been suspended.", "success");

                            // Update Status Badge
                            accountStatusCell.innerHTML = '<span class="badge bg-danger">Deactivated</span>';

                            // Update Button to Activate
                            actionBtn.classList.remove('suspend-btn');
                            actionBtn.classList.add('activate-btn');
                            actionBtn.setAttribute('title', 'Activate');
                            actionBtn.innerHTML = '<i class="fa-solid fa-power-off"></i>';
                        }
                    });
            }
            // Activate Action
            else if (actionBtn.classList.contains('activate-btn')) {
                swal({
                    title: "Activate Account?",
                    text: "Are you sure you want to activate this company account?",
                    icon: "info",
                    buttons: true,
                })
                    .then((willActivate) => {
                        if (willActivate) {
                            swal("Activated!", "Company ID " + id + " has been activated.", "success");

                            // Update Status Badge
                            accountStatusCell.innerHTML = '<span class="badge bg-success">Active</span>';

                            // Update Button to Suspend
                            actionBtn.classList.remove('activate-btn');
                            actionBtn.classList.add('suspend-btn');
                            actionBtn.setAttribute('title', 'Suspend/Deactivate');
                            actionBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
                        }
                    });
            }
            return; // Exit if action button handled
        }

        // Handle Status Toggle (Verify/Unverify)
        if (e.target.classList.contains('activation-btn')) {
            const btn = e.target;
            const id = btn.getAttribute('data-id');

            if (btn.classList.contains('verified')) {
                swal({
                    title: "Unverify Company?",
                    text: "Mark this company as Unverified?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willUnverify) => {
                    if (willUnverify) {
                        btn.classList.remove('verified');
                        btn.classList.add('unverified');
                        btn.textContent = 'Unverified';
                        swal("Unverified", "Company ID " + id + " is now unverified.", "success");
                    }
                });

            } else {
                swal({
                    title: "Approve / Verify Company?",
                    text: "Mark this company as Verified?",
                    icon: "info",
                    buttons: true,
                }).then((willVerify) => {
                    if (willVerify) {
                        btn.classList.remove('unverified');
                        btn.classList.add('verified');
                        btn.textContent = 'Verified';
                        swal("Verified", "Company ID " + id + " is now verified.", "success");
                    }
                });
            }
        }
    });

    // --- Reset Password ---
    resetPwdButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            swal({
                title: "Reset Password?",
                text: "This will reset the company's password to default.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willReset) => {
                    if (willReset) {
                        swal("Reset!", "Password for Company ID " + id + " has been reset.", "success");
                        // Todo: AJAX call
                    }
                });
        });
    });

});
