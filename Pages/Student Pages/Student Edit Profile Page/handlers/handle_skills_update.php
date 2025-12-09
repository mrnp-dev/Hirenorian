<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['email'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Not authorized'
    ]);
    exit;
}

// Get form data
$technical_skills = $_POST['technical_skills'] ?? '';
$soft_skills = $_POST['soft_skills'] ?? '';
$student_email = $_SESSION['email'];

// Prepare data for VPS API
$data = [
    'student_email' => $student_email,
    'technical_skills' => $technical_skills,
    'soft_skills' => $soft_skills
];

// Call VPS API
$apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit Profile APIs/update_skills.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to connect to server: ' . curl_error($ch)
    ]);
} else {
    echo $response;
}

curl_close($ch);
?>
