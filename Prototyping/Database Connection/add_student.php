<!DOCTYPE html>
<html>
<head>
    <title>Add Student</title>
</head>
<body>
    <h2>Add New Student</h2>
    <form action="insert_student.php" method="post">
        Full Name: <input type="text" name="full_name" required><br><br>
        Email: <input type="email" name="email" required><br><br>
        Age: <input type="number" name="stu_age" required><br><br>
        <input type="submit" value="Add Student">
    </form>
</body>
</html>
