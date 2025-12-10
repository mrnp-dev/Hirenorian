<?php
// Initialize variables with empty values or values from GET parameters
$id = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '';
$firstName = isset($_GET['first']) ? htmlspecialchars($_GET['first']) : '';
$middleInitial = isset($_GET['mi']) ? htmlspecialchars($_GET['mi']) : '';
$lastName = isset($_GET['last']) ? htmlspecialchars($_GET['last']) : '';
$suffix = isset($_GET['suffix']) ? htmlspecialchars($_GET['suffix']) : '';
$email = isset($_GET['email']) ? htmlspecialchars($_GET['email']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Student Info</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .form-container {
      max-width: 400px;
      margin: auto;
    }
    label {
      display: block;
      margin-top: 10px;
    }
    input[type="text"], input[type="email"] {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      box-sizing: border-box;
    }
    .button-group {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }
    button {
      padding: 10px 20px;
      cursor: pointer;
    }
    .submit-btn {
      background-color: #007BFF;
      color: white;
      border: none;
    }
    .cancel-btn {
      background-color: #ccc;
      border: none;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Edit Student Record</h2>
    <form action="update_student.php" method="POST">

      <input type="hidden" name="id" value="<?php echo $id; ?>">

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" name="firstName" value="<?php echo $firstName; ?>" required>

      <label for="middleInitial">Middle Initial:</label>
      <input type="text" id="middleInitial" name="middleInitial" value="<?php echo $middleInitial; ?>" maxlength="1">

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" name="lastName" value="<?php echo $lastName; ?>">

      <label for="surnameSuffix">Surname Suffix:</label>
      <input type="text" id="surnameSuffix" name="surnameSuffix" value="<?php echo $suffix; ?>">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" value="<?php echo $email; ?>" required>

      <div class="button-group">
        <button type="submit" class="submit-btn">Submit</button>
        <button type="button" class="cancel-btn" onclick="window.history.back()">Cancel</button>
      </div>
    </form>
  </div>
</body>
</html>