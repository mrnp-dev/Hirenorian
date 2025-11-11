<?php
include 'dbconnect.php';

$sql = "SELECT stu_id, full_name, stu_age FROM studentInfo";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Info</title>
    <style>
        table {
            border-collapse: collapse;
            width: 60%;
            margin: 20px auto;
        }
        th, td {
            border: 1px solid #333;
            padding: 8px 12px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h2 style="text-align:center;">Student Information</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Age</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            // Output each row
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["stu_id"] . "</td>";
                echo "<td>" . $row["full_name"] . "</td>";
                echo "<td>" . $row["stu_age"] . "</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='3'>No records found</td></tr>";
        }
        $conn->close();
        ?>
    </table>
</body>
</html>