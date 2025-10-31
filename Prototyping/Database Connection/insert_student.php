<?php
include 'dbconnect.php'; // reuse your connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $full_name = $_POST['full_name'];
    $email     = $_POST['email'];
    $stu_age   = $_POST['stu_age'];

    // Prepare SQL statement
    $sql = "INSERT INTO studentInfo (full_name, stu_age) 
            VALUES ('$full_name', '$stu_age')";

    if ($conn->query($sql) === TRUE) {
        echo "New student added successfully!<br>";
        echo "<a href='students.php'>View Students</a>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
