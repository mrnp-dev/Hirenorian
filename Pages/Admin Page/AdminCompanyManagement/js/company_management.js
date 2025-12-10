document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const suspendButtons = document.querySelectorAll('.suspend-btn');
    const activateButtons = document.querySelectorAll('.activate-btn');
    const resetPwdButtons = document.querySelectorAll('.reset-pwd-btn');
    const verifyButtons = document.querySelectorAll('.activation-btn');

    // --- Edit Company Info ---
    editButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const row = this.closest('tr');
            if (!row) return;

            const cells = row.cells;
            // Assuming order: Logo(0), Name(1), Type(2), Industry(3), Contact(4), Email(5), Status(6), Actions(7)
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

    // --- Suspend / Deactivate Account ---
    suspendButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
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
                        // Todo: AJAX call to update status
                    }
                });
        });
    });

    // --- Activate Account ---
    activateButtons.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            swal({
                title: "Activate Account?",
                text: "Are you sure you want to activate this company account?",
                icon: "info",
                buttons: true,
            })
                .then((willActivate) => {
                    if (willActivate) {
                        swal("Activated!", "Company ID " + id + " has been activated.", "success");
                        // Todo: AJAX call to update status
                    }
                });
        });
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

    // --- Verify / Unverify (Approve) ---
    // Using delegation for dynamic elements if table redraws (but here using static listen is fine for MVP)
    // Actually, let's use document level event listener for safery if Datatables redraws
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('activation-btn')) {
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

});
