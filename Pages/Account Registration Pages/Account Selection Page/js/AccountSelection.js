const studentCard = document.getElementById('studentCard');
const companyCard = document.getElementById('companyCard');

// Toggles the active class when a card is clicked
studentCard.addEventListener('click', () => {
    window.location.href = '../../SR-Duplicate OTP Page/php/student_registrationForm.php';
});

companyCard.addEventListener('click', () => {
    window.location.href = '../../Company Registration Page/php/company.php';
});