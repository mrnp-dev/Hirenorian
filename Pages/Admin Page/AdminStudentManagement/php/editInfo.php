<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $url = 'http://localhost/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/studentManagementAPIs/updateInfo.php';

  $data = array(
    'student_id' => $_POST['id'],
    'first_name' => $_POST['firstName'],
    'middle_initial' => $_POST['middleInitial'],
    'last_name' => $_POST['lastName'],
    'suffix' => $_POST['suffix'],
    'email' => $_POST['email']
  );

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $result = curl_exec($ch);


  curl_close($ch);

  header("Location: student_management.php");
  exit();
}

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

    input[type="text"],
    input[type="email"] {
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
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

<body>
  <div class="form-container">
    <h2>Edit Student Record</h2>
    <form action="" method="POST">

      <input type="hidden" id="studentId" name="id" value="<?php echo $id; ?>">

      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" name="firstName" value="<?php echo $firstName; ?>" required>

      <label for="middleInitial">Middle Initial:</label>
      <input type="text" id="middleInitial" name="middleInitial" value="<?php echo $middleInitial; ?>" maxlength="1">

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" name="lastName" value="<?php echo $lastName; ?>">

      <label for="suffix">Surname Suffix:</label>
      <input type="text" id="suffix" name="suffix" value="<?php echo $suffix; ?>">

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" value="<?php echo $email; ?>" required>

      <div class="button-group">
        <button type="submit" class="submit-btn" id="updateBtn">Update</button>
        <button type="button" class="cancel-btn" onclick="window.history.back()">Cancel</button>
      </div>
    </form>
  </div>

  <script>
    $(document).ready(function() {
      $('#updateBtn').on('click', function(e) {
        e.preventDefault();

        swal({
            title: "Update Student Information?",
            text: "Are you sure you want to update this student's record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willUpdate) => {
            if (willUpdate) {
              swal("Updating...", {
                icon: "success",
                buttons: false,
                timer: 1000,
              }).then(() => {
                $('form')[0].submit();
              });
            } else {
              swal("Update cancelled.");
            }
          });
      });
    });
  </script>
</body>

</html>