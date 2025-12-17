<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration - Hirenorian</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../AdminStudentManagement/css/dashboard.css">
    <link rel="stylesheet" href="../css/register.css">
</head>

<body class="registration-body">

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $valid_user = "HireAdmin@01";
        $valid_pass = "1PSU8Adm6nCode1";

        if ($username === $valid_user && $password === $valid_pass) {
            include '../../../../APIs/Admin DB APIs/db_con.php';

            if (isset($conn)) {
                try {
                    $action = "Log In";
                    $description = "Log In as admin";

                    $stmt = $conn->prepare("INSERT INTO adminAuditLog (role, action, description) VALUES ('admin', :action, :description)");
                    $stmt->execute([':action' => $action, ':description' => $description]);
                } catch (Exception $e) {

                }
            }

            header("Location: ../../AdminDashboard/php/dashboard.php");
            exit();
        } else {
            echo "<script>alert('Invalid Credentials! Please try again.');</script>";
        }
    }
    ?>

    <div class="registration-container">
        <div class="registration-card-new">
            <div class="form-column">
                <div class="logo-header">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                </div>
                <h2 class="form-title-new">Admin Log In</h2>
                <form action="" method="POST" class="registration-form">
                    <div class="input-group-new">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter username" required>
                    </div>
                    <div class="input-group-new">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter password" required>
                    </div>
                    <button type="submit" class="register-btn-new">Log In</button>
                </form>
            </div>
        </div>
    </div>
</body>

</html>