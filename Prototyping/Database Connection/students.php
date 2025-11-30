<?php
include 'dbconnect.php';

$studentQuery = "SELECT * FROM Students";
$studentResult = $conn->query($studentQuery);

$educationQuery = "SELECT * FROM Education";
$educationResult = $conn->query($educationQuery);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <table border="1" cellpadding="10">
        <thead>
            <tr>
                <th>Account ID</th>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Initial</th>
                <th>Suffix</th>
                <th>Personal Email</th>
                <th>Phone Number</th>
                <th>Student Email</th>
                <th>Password Hash</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($studentResult->num_rows > 0) {
                while($row = $studentResult->fetch_assoc()) {
                    echo "<tr>
                            <td>".$row['account_id']."</td>
                            <td>".$row['student_id']."</td>
                            <td>".$row['first_name']."</td>
                            <td>".$row['last_name']."</td>
                            <td>".$row['middle_initial']."</td>
                            <td>".$row['suffix']."</td>
                            <td>".$row['personal_email']."</td>
                            <td>".$row['phone_number']."</td>
                            <td>".$row['student_email']."</td>
                            <td>".$row['password_hash']."</td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='9'>No students found</td></tr>";
            }
            ?>
        </tbody>
    </table>
    <br><br>
    <table border="1" cellpadding="10">
        <thead>
            <tr>
                <th>Education ID</th>
                <th>Student ID</th>
                <th>University</th>
                <th>Department</th>
                <th>Course</th>
                <th>Organization</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($educationResult->num_rows > 0) {
                while($row = $educationResult->fetch_assoc()) {
                    echo "<tr>
                            <td>".$row['edu_id']."</td>
                            <td>".$row['student_id']."</td>
                            <td>".$row['university']."</td>
                            <td>".$row['department']."</td>
                            <td>".$row['course']."</td>
                            <td>".$row['organization']."</td>
                          </tr>";
                }
            } else {
                echo "<tr><td colspan='6'>No education records found</td></tr>";
            }
            ?>
        </tbody>
    </table>
</body>
</html>