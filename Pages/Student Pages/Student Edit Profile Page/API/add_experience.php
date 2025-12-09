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
if (!isset($input['student_email']) || !isset($input['job_title']) || 
    !isset($input['company_name']) || !isset($input['start_date']) || !isset($input['end_date'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$student_email = $input['student_email'];
$job_title = $input['job_title'];
$company_name = $input['company_name'];
$start_date = $input['start_date'];
$end_date = $input['end_date'];
$description = $input['description'] ?? '';

try {
    // Get student_id
    $stmt1 = $conn->prepare("SELECT student_id FROM StudentBasicInfo WHERE student_email = ?");
    $stmt1->bind_param("s", $student_email);
    $stmt1->execute();
    $result = $stmt1->get_result();
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    
    // Insert into StudentExperience
    $stmt2 = $conn->prepare("INSERT INTO StudentExperience (student_id, job_title, company_name, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt2->bind_param("isssss", $student_id, $job_title, $company_name, $start_date, $end_date, $description);
    $stmt2->execute();
    
    $new_id = $conn->insert_id;
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Experience added successfully',
        'exp_id' => $new_id
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
