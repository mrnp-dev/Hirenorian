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

$student_email = $_SESSION['email'];
$operation = $_POST['operation'] ?? '';

// Determine which API endpoint to call
$apiEndpoint = '';
$data = ['student_email' => $student_email];

switch ($operation) {
    case 'add':
        $apiEndpoint = 'add_education.php';
        $data['degree'] = $_POST['degree'] ?? '';
        $data['institution'] = $_POST['school'] ?? '';
        $data['start_year'] = $_POST['start_year'] ?? '';
        $data['end_year'] = $_POST['end_year'] ?? '';
        break;
        
    case 'update':
        $apiEndpoint = 'update_education.php';
        $data['edu_hist_id'] = $_POST['edu_id'] ?? '';
        $data['degree'] = $_POST['degree'] ?? '';
        $data['institution'] = $_POST['school'] ?? '';
        $data['start_year'] = $_POST['start_year'] ?? '';
        $data['end_year'] = $_POST['end_year'] ?? '';
        break;
        
    case 'delete':
        $apiEndpoint = 'delete_education.php';
        $data['edu_hist_id'] = $_POST['edu_id'] ?? '';
        break;
        
    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid operation'
        ]);
        exit;
}

// Call VPS API
$apiUrl = "http://mrnp.site:8080/Hirenorian/API/Edit_profile_API/" . $apiEndpoint;

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
