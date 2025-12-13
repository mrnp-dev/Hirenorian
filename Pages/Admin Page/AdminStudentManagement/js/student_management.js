document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addStudentButton = document.querySelector('.add-new-btn');
    const pageNumbers = document.querySelectorAll('.pagination-nav .page-number');
    const navArrows = document.querySelectorAll('.pagination-nav .nav-arrow');


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
        if (e.target && e.target.classList.contains('activation-btn')) {
            const btn = e.target;

            if (btn.classList.contains('verified')) {
                btn.classList.remove('verified');
                btn.classList.add('unverified');
                btn.textContent = 'Unverified';
            } else {
                btn.classList.remove('unverified');
                btn.classList.add('verified');
                btn.textContent = 'Verified';
            }
        }
    });



});