<?php
include 'dbconnect.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$student_id = $_POST['student_id'] ?? '';
$first_name = $_POST['first_name'] ?? '';
$last_name = $_POST['last_name'] ?? '';
$middle_initial = $_POST['middle_initial'] ?? '';
$suffix = $_POST['suffix'] ?? '';
$personal_email = $_POST['personal_email'] ?? '';
$phone_number = $_POST['phone_number'] ?? '';
$password = $_POST['password'] ?? '';
$student_email = $_POST['student_email'] ?? '';
$university = $_POST['university'] ?? '';
$department = $_POST['department'] ?? '';
$course = $_POST['course'] ?? '';
$organization = $_POST['organization'] ?? '';

$insertQuery = $conn->prepare("INSERT INTO Students 
(student_id, first_name, last_name, 
middle_initial, suffix, personal_email, 
phone_number, password_hash, student_email) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

$password = password_hash($password, PASSWORD_BCRYPT);

$insertQuery->bind_param("sssssssss", 
$student_id, $first_name, $last_name, 
$middle_initial, $suffix, $personal_email, 
$phone_number, $password, $student_email);

if ($insertQuery->execute())
{
    // Proceed to insert into Education table
}
else
{
    echo "Error: " . $insertQuery->error;
}

$insertQuery = $conn->prepare("INSERT INTO Education
(student_id, university, department, course, organization)
VALUES (?, ?, ?, ?, ?)");

$insertQuery->bind_param("sssss",
$student_id, $university, $department, $course, $organization);

if ($insertQuery->execute())
{
    header("Location: students.php");
}
else
{
    echo "Error: " . $insertQuery->error;
}
?>
