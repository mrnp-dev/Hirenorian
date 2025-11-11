<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/student_regform.css">
<title>Student sign in 1</title>

</head>
<body>

  <div class="header">
    <img src="../images/DHVSU-LOGO.png" alt="Logo">
    <h1>Hirenorian</h1>
  </div>


  <div class="wrapper">
    
    <div class="left">
      <h2>“Connecting students with<br>real-world opportunities”</h2>
      <div class="steps">
        <div class="step">
          <div class="step-icon"><img src="../images/1User_White.png" alt="Logo"></div>
          <span class="step-text">Personal Information</span>
        </div>
        <div class="step">
          <div class="step-icon"><img src="../images/1Book_White.png" alt="Logo"></div>
          <span class="step-text">Educational Background</span>
        </div>
        <div class="step">
          <div class="step-icon"><img src="../images/1Briefcase_White.png" alt="Logo"></div>
          <span class="step-text">Work Preference</span>
        </div>
      </div>
    </div>
    
    
    <div class="right">
      
        <!-- PERSONAL INFO -->
        <div class="p1">
          <h3>Personalize your Profile</h3>
          <form>
            <div class="form-row">
            <input type="text" placeholder="First Name *" required>
            <input type="text" placeholder="Last Name *" required>
          </div>
          <div class="form-row">
            <input type="text" placeholder="Middle Initial *" required>
            <input type="text" id="username" placeholder="Suffix (optional)" required>
          </div>
          <div class="form-row">
            <input type="email" placeholder="Email *" required>
            <input type="tel" placeholder="Phone No *" required>
          </div>
          <input type="password" placeholder="Password *" required>
          <input type="password" placeholder="Confirm Password *" required>

          <div class="buttons">
            <button type="button" class="btn btn-landing">Back to Landing</button>
            <button type="button" class="btn btn-next">Next</button>
          </div>
          </form>
        </div>

        <!-- ACADS INFO -->
        <div class="p2">
          <h3>Display your Achievements</h3>
          <form>
          <input type="text" placeholder="University / Campus *" required>
          <div class="form-row">
            <input type="text" placeholder="Department *" required>
            <input type="text" placeholder="Course *" required>
          </div>
          <div class="form-row">
            <input type="text" placeholder="Student No *" required>
            <input type="email" placeholder="School Email *" required>
          </div>
          <input type="text" placeholder="Organization">

          <div class="buttons">
            <button type="button" class="btn btn-back">Back</button>
            <button type="button" class="btn btn-next">Next</button>
          </div>
          </form>
        </div>

        <!-- PREFERENCE -->
        <div class="p3">
            <h3>Where do you see yourself?</h3>
            <form>
            <input type="text" placeholder="Job Classification 1">
            <input type="text" placeholder="Job Classification 2">
            <input type="text" placeholder="Job Classification 3">
            <input type="text" placeholder="Ideal Location">

            <div class="buttons">
              <button type="button" class="btn btn-back">Back</button>
              <button type="submit" class="btn btn-submit">Finish</button>
            </div>
          </form>
        </div>

      
    </div>
  </div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  // All step sections
  const steps = document.querySelectorAll(".p1, .p2, .p3");
  let currentStep = 0;

  // Show the first step
  steps[currentStep].classList.add("active");

  // Handle "Next" buttons
  const nextButtons = document.querySelectorAll(".btn-next");
  nextButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
      }
    });
  });

  // Handle "Back" buttons
  const backButtons = document.querySelectorAll(".btn-back");
  backButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
      }
    });
  });
});
</script>

</body>
</html>