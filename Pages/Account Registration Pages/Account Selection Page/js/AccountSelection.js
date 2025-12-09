const studentCard = document.getElementById('studentCard');
const companyCard = document.getElementById('companyCard');

// Toggles the active class when a card is clicked
studentCard.addEventListener('click', () => {
    if (!studentCard.classList.contains('active')) {
        studentCard.classList.add('active');
        companyCard.classList.remove('active');
    }
});

companyCard.addEventListener('click', () => {
    if (!companyCard.classList.contains('active')) {
        companyCard.classList.add('active');
        studentCard.classList.remove('active');
    }
});