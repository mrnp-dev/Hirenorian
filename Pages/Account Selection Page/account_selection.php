<?php

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Account Selection | Hirenorian</title>

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="student.css">
  <link rel="stylesheet" href="company.css">
</head>

<body>
  <div class="selection-container">
    <div class="card student-card active" id="studentCard">
      <h2>🎓 For Students</h2>
      <ul>
        <li>Access to university-approved companies</li>
        <li>Safe and verified internship opportunities</li>
        <li>Career guidance and resources</li>
        <li>Build your professional network</li>
      </ul>
      <button class="btn">Get Started</button>
    </div>

    <div class="card company-card" id="companyCard">
      <h2>🏢 For Companies</h2>
      <ul>
        <li>Connect with qualified student talent</li>
        <li>University-endorsed recruitment platform</li>
        <li>Streamlined application process</li>
        <li>Build your employer brand on campus</li>
      </ul>
      <button class="btn">Get Started</button>
    </div>
  </div>

  <script>
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
  </script>
</body>
</html>