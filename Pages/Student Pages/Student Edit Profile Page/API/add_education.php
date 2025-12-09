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
if (!isset($input['student_email']) || !isset($input['degree']) || 
    !isset($input['institution']) || !isset($input['start_year']) || !isset($input['end_year'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$student_email = $input['student_email'];
$degree = $input['degree'];
$institution = $input['institution'];
$start_year = $input['start_year'];
$end_year = $input['end_year'];

try {
    // Get student_id
    $stmt1 = $conn->prepare("SELECT student_id FROM StudentBasicInfo WHERE student_email = ?");
    $stmt1->bind_param("s", $student_email);
    $stmt1->execute();
    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    
    // Insert into StudentEducationHistory
    $stmt2 = $conn->prepare("INSERT INTO StudentEducationHistory (student_id, institution, degree, start_year, end_year) VALUES (?, ?, ?, ?, ?)");
    $stmt2->bind_param("issss", $student_id, $institution, $degree, $start_year, $end_year);
    $stmt2->execute();
    
    $new_id = $conn->insert_id;
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Education added successfully',
        'edu_hist_id' => $new_id
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
