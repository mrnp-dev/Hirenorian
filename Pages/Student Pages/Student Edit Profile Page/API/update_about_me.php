<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection
require_once '../../../db_connection.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['student_email']) || !isset($input['about_me'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$student_email = $input['student_email'];
$about_me = $input['about_me'];

try {
    // Get student_id
    $stmt1 = $conn->prepare("SELECT student_id FROM StudentBasicInfo WHERE student_email = ?");
    $stmt1->bind_param("s", $student_email);
    $stmt1->execute();
    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    
    // Update StudentProfile table
    $stmt2 = $conn->prepare("UPDATE StudentProfile SET about_me = ? WHERE student_id = ?");
    $stmt2->bind_param("si", $about_me, $student_id);
    $stmt2->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'About me updated successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
