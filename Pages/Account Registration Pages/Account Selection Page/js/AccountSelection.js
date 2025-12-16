const studentCard = document.getElementById('studentCard');
const companyCard = document.getElementById('companyCard');

// Toggles the active class when a card is clicked
studentCard.addEventListener('click', () => {
    window.location.href = '../../Student Registration Modern/php/student_registration.php';
});

companyCard.addEventListener('click', () => {
    window.location.href = '../../Company Registration Modern/php/company_registration.php';
});