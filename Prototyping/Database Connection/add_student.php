<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Registration</title>
</head>
<body>
  <h1>Student Registration Form</h1>

  <form action="add_student_process.php" method="POST">
    <!-- Students Table Fields -->
    <fieldset>
      <legend>Personal Information</legend>

      <label for="student_id">Student ID:</label>
      <input type="text" id="student_id" name="student_id"><br><br>

      <label for="first_name">First Name:</label>
      <input type="text" id="first_name" name="first_name" required><br><br>

      <label for="last_name">Last Name:</label>
      <input type="text" id="last_name" name="last_name" required><br><br>

      <label for="middle_initial">Middle Initial:</label>
      <input type="text" id="middle_initial" name="middle_initial" maxlength="1" required><br><br>

      <label for="suffix">Suffix:</label>
      <input type="text" id="suffix" name="suffix" maxlength="5"><br><br>

      <label for="personal_email">Personal Email:</label>
      <input type="email" id="personal_email" name="personal_email" required><br><br>

      <label for="phone_number">Phone Number:</label>
      <input type="text" id="phone_number" name="phone_number" maxlength="15" required><br><br>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>

      <label for="student_email">Student Email:</label>
      <input type="email" id="student_email" name="student_email" required><br><br>
    </fieldset>

    <!-- Education Table Fields -->
    <fieldset>
      <legend>Educational Background</legend>

      <label for="university">University:</label>
      <input type="text" id="university" name="university" required><br><br>

      <label for="department">Department:</label>
      <input type="text" id="department" name="department" required><br><br>

      <label for="course">Course:</label>
      <input type="text" id="course" name="course" required><br><br>

      <label for="organization">Organization:</label>
      <input type="text" id="organization" name="organization"><br><br>
    </fieldset>

    <!-- Submit -->
    <button type="submit">Register</button>
  </form>
</body>
</html>
