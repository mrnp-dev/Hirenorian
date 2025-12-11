<?php
// Initialize variables with empty values or values from GET parameters
$id = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '';
$name = isset($_GET['name']) ? htmlspecialchars($_GET['name']) : '';
$type = isset($_GET['type']) ? htmlspecialchars($_GET['type']) : '';
$industry = isset($_GET['industry']) ? htmlspecialchars($_GET['industry']) : '';
$contact = isset($_GET['contact']) ? htmlspecialchars($_GET['contact']) : '';
$email = isset($_GET['email']) ? htmlspecialchars($_GET['email']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Company Info</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Outfit', sans-serif;
      padding: 40px;
      background-color: #f4f6f9;
    }
    .form-container {
      max-width: 500px;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h2 {
        text-align: center;
        margin-bottom: 25px;
        color: #333;
    }
    label {
      display: block;
      margin-top: 15px;
      font-weight: 500;
      color: #555;
    }
    input[type="text"], input[type="email"] {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    .button-group {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      gap: 15px;
    }
    button {
      padding: 12px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;
      flex: 1;
      transition: background 0.2s;
    }
    .submit-btn {
      background-color: #007BFF;
      color: white;
      border: none;
    }
    .submit-btn:hover {
       background-color: #0056b3;
    }
    .cancel-btn {
      background-color: #e2e6ea;
      border: 1px solid #dae0e5;
      color: #333;
    }
    .cancel-btn:hover {
        background-color: #dbe0e5;
    }
  </style>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
  <div class="form-container">
    <h2>Edit Company Record</h2>
    <!-- Action points to a dummy update script or self for now -->
    <form id="editForm" onsubmit="return submitForm(event)">
      <input type="hidden" name="id" value="<?php echo $id; ?>">

      <label for="name">Company Name:</label>
      <input type="text" id="name" name="name" value="<?php echo $name; ?>" required>

      <label for="type">Business Type:</label>
      <input type="text" id="type" name="type" value="<?php echo $type; ?>" required placeholder="e.g. Corporation, Partnership">

      <label for="industry">Industry:</label>
      <input type="text" id="industry" name="industry" value="<?php echo $industry; ?>" required>

      <label for="contact">Contact Person:</label>
      <input type="text" id="contact" name="contact" value="<?php echo $contact; ?>" required>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" value="<?php echo $email; ?>" required>

      <div class="button-group">
        <button type="submit" class="submit-btn">Save Changes</button>
        <button type="button" class="cancel-btn" onclick="window.history.back()">Cancel</button>
      </div>
    </form>
  </div>

  <script>
      function submitForm(event) {
          event.preventDefault();
          // Simulate update
          swal({
            title: "Success!",
            text: "Company information updated (Simulation).",
            icon: "success",
            button: "Back to List",
          }).then(() => {
              window.location.href = 'company_management.php';
          });
          return false;
      }
  </script>
</body>
</html>
