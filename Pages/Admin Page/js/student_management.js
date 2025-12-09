document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const addStudentButton = document.querySelector('.add-new-btn');
    const pageNumbers = document.querySelectorAll('.pagination-nav .page-number');
    const navArrows = document.querySelectorAll('.pagination-nav .nav-arrow');

    // --- CRUD Actions (Front-end only simulation) ---

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would open a modal pre-filled with student data
            alert('Editing student ID: ' + this.closest('tr').querySelector('td:first-child').textContent);
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
            // Remove active class from all pages
            pageNumbers.forEach(n => n.classList.remove('active-page'));
            
            // Set active class on the clicked page
            this.classList.add('active-page');
            
            // In a real application, this would load data for the new page number
            alert('Navigating to page ' + this.textContent);
        });
    });
    
    // Add logic for previous/next arrows (visual simulation)
    navArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            const currentPage = document.querySelector('.active-page');
            let currentPageNum = parseInt(currentPage.textContent);
            let targetPage = null;

            // Determine if clicking Next or Previous
            if (arrow.querySelector('.fa-chevron-right')) {
                // Next
                targetPage = currentPage.nextElementSibling;
            } else if (arrow.querySelector('.fa-chevron-left')) {
                // Previous
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