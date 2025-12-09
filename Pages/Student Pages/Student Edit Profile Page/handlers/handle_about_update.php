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
$about_me = $_POST['about_me'] ?? '';
$student_email = $_SESSION['email'];

// Prepare data for VPS API
$data = [
    'student_email' => $student_email,
    'about_me' => $about_me
];

// Call VPS API
$apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit Profile APIs/update_about_me.php";

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
