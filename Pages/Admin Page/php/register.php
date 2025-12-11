<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Registration - Hirenorian</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/register.css"> 
</head>
<body class="registration-body">

    <div class="registration-container">
        
        <div class="registration-card-new">
            
            <div class="form-column">
                <div class="logo-header">
                    <img src="../../../Landing Page/Images/dhvsulogo.png" alt="University Logo" class="logo">
                </div>
                
                <h2 class="form-title-new">Admin Registration</h2>
                
                <form action="#" method="POST" class="registration-form">
                    
                    <div class="input-group-new">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter username" required>
                    </div>
                    
                    <div class="input-group-new">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter password" required>
                    </div>
                    
                    <button type="submit" class="register-btn-new">Register</button>
                    
                    <div class="login-link-new">
                        Already registered? <a href="dashboard.php">Log In</a>
                    </div>
                </form>
            </div>
            
            <div class="info-column">
                <h3 class="info-title">Secure Admin Access</h3>
                <ul class="info-list">
                    <li><i class="fa-solid fa-user-shield"></i> User Credentials</li>
                    <li><i class="fa-solid fa-table-columns"></i> Access Dashboard</li>
                    <li><i class="fa-solid fa-graduation-cap"></i> Manage Students</li>
                </ul>
            </div>
            
        </div>
    </div>

</body>
</html>