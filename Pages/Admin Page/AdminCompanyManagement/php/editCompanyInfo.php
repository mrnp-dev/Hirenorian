<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $url = 'http://mrnp.site:8080/Hirenorian/API/adminDB_APIs/updateInfo.php';

  $data = array(
    'company_name' => $_POST['companyName'],
    'email' => $_POST['email'],
    'company_id' => $_POST['id']
  );

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $result = curl_exec($ch);
  curl_close($ch);

  header("Location: company_management.php");
  exit();
}

$companyName = isset($_GET['company_name']) ? htmlspecialchars($_GET['company_name']) : '';
$id = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '';
$email = isset($_GET['email']) ? htmlspecialchars($_GET['email']) : '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Company Info - Hirenorian</title>

  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

  <link rel="stylesheet" href="../css/style.css">

  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .form-card {
      width: 100%;
      max-width: 500px;
      padding: 40px;
      border-top: 5px solid var(--primary-maroon);
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .form-header h2 {
      color: var(--primary-maroon);
      font-weight: 700;
      font-size: 1.8rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-maroon);
      box-shadow: 0 0 0 3px rgba(123, 17, 19, 0.1);
    }

    .button-group {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background-color: var(--primary-maroon);
      color: white;
    }

    .btn-primary:hover {
      background-color: #5d0c0e;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #d0d0d0;
    }

    .btn:active {
      transform: scale(0.98);
    }
  </style>
</head>

<body>

  <div class="card form-card">
    <div class="form-header">
      <i class="fa-solid fa-building-user" style="font-size: 3rem; color: var(--secondary-yellow); margin-bottom: 15px;"></i>
      <h2>Edit Company Record</h2>
    </div>

    <form action="" method="POST">
      <input type="hidden" name="id" value="<?php echo $id; ?>">

      <div class="form-group">
        <label for="companyName">Company Name</label>
        <div style="position: relative;">
          <i class="fa-solid fa-building" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;"></i>
          <input type="text" class="form-control" id="companyName" name="companyName" value="<?php echo $companyName; ?>" required style="padding-left: 40px;">
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <div style="position: relative;">
          <i class="fa-solid fa-envelope" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;"></i>
          <input type="email" class="form-control" id="email" name="email" value="<?php echo $email; ?>" required style="padding-left: 40px;">
        </div>
      </div>

      <div class="button-group">
        <button type="button" class="btn btn-secondary" onclick="window.history.back()">
          <i class="fa-solid fa-arrow-left"></i> Cancel
        </button>
        <button type="submit" class="btn btn-primary" id="updateBtn">
          <i class="fa-solid fa-save"></i> Update
        </button>
      </div>
    </form>
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <script>
    $(document).ready(function() {
      $('#updateBtn').on('click', function(e) {
        e.preventDefault();

        swal({
            title: "Update Company Information?",
            text: "Are you sure you want to update this company's record?",
            icon: "warning",
            buttons: ["Cancel", "Yes, Update"],
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
                auditLogs('Update', 'updated company information for company id: ' + <?php echo $id; ?>);
              });
            }
          });
      });
    });
  </script>


  <script>
    function auditLogs(actionType, decription) {
      fetch('/web-projects/Hirenorian-2/APIs/Admin%20DB%20APIs/studentManagementAPIs/audit.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action_type: actionType,
            description: decription,
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            console.log('Audit log added successfully');
          } else {
            console.error('Failed to add audit log:', data.message);
            alert('Error adding audit log: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error logging audit log.');
        });
    }
  </script>
</body>

</html>