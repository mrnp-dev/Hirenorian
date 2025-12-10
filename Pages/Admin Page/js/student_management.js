document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addStudentButton = document.querySelector('.add-new-btn');
    const pageNumbers = document.querySelectorAll('.pagination-nav .page-number');
    const navArrows = document.querySelectorAll('.pagination-nav .nav-arrow');

    // --- CRUD Actions (Front-end only simulation) ---

    // ✅ Edit button navigates to editInfo.php with student ID
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.closest('tr').querySelector('td:first-child').textContent;
            window.location.href = `editInfo.php?id=${studentId}`;
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const studentId = row.querySelector('td:first-child').textContent;
            
            if (confirm('Are you sure you want to delete student ID: ' + studentId + '?')) {
                // In a real application, this would send an AJAX request to the backend
                row.remove();
                alert('Student ID ' + studentId + ' deleted (front-end simulation).');
            }
        });
    });

    if (addStudentButton) {
        addStudentButton.addEventListener('click', function() {
            alert('Opening form to add a new student.');
        });
    }

    // --- Pagination Actions (Visual only simulation) ---
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            pageNumbers.forEach(n => n.classList.remove('active-page'));
            this.classList.add('active-page');
            alert('Navigating to page ' + this.textContent);
        });
    });
    
    navArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const currentPage = document.querySelector('.active-page');
            let targetPage = null;

            if (arrow.querySelector('.fa-chevron-right')) {
                targetPage = currentPage.nextElementSibling;
            } else if (arrow.querySelector('.fa-chevron-left')) {
                targetPage = currentPage.previousElementSibling;
            }

            if (targetPage && targetPage.classList.contains('page-number')) {
                currentPage.classList.remove('active-page');
                targetPage.classList.add('active-page');
                alert('Navigating to page ' + targetPage.textContent);
            }
        });
    });
});