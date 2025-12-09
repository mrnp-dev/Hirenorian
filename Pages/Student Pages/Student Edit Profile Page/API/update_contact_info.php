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
if (!isset($input['student_email']) || !isset($input['personal_email']) || 
    !isset($input['phone_number']) || !isset($input['location'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$student_email = $input['student_email'];
$personal_email = $input['personal_email'];
$phone_number = $input['phone_number'];
$location = $input['location'];

try {
    // Start transaction
    $conn->begin_transaction();
    
    // Update StudentBasicInfo table
    $stmt1 = $conn->prepare("UPDATE StudentBasicInfo SET personal_email = ?, phone_number = ? WHERE student_email = ?");
    $stmt1->bind_param("sss", $personal_email, $phone_number, $student_email);
    $stmt1->execute();
    
    // Get student_id
    $stmt2 = $conn->prepare("SELECT student_id FROM StudentBasicInfo WHERE student_email = ?");
    $stmt2->bind_param("s", $student_email);
    $stmt2->execute();
    $result = $stmt2->get_result();
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    
    // Update StudentProfile table
    $stmt3 = $conn->prepare("UPDATE StudentProfile SET location = ? WHERE student_id = ?");
    $stmt3->bind_param("si", $location, $student_id);
    $stmt3->execute();
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Contact information updated successfully'
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
