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
$personal_email = $_POST['personal_email'] ?? '';
$phone_number = $_POST['phone'] ?? '';
$location = $_POST['location'] ?? '';
$student_email = $_SESSION['email'];

// Prepare data for VPS API
$data = [
    'student_email' => $student_email,
    'personal_email' => $personal_email,
    'phone_number' => $phone_number,
    'location' => $location
];

// Call VPS API
$apiUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Edit Profile APIs/update_contact_info.php";

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to connect to server: ' . curl_error($ch)
    ]);
} else {
    // Return the API response
    echo $response;
}

curl_close($ch);
?>
