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
if (!isset($input['exp_id']) || !isset($input['job_title']) || 
    !isset($input['company_name']) || !isset($input['start_date']) || !isset($input['end_date'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$exp_id = $input['exp_id'];
$job_title = $input['job_title'];
$company_name = $input['company_name'];
$start_date = $input['start_date'];
$end_date = $input['end_date'];
$description = $input['description'] ?? '';

try {
    // Update experience entry
    $stmt = $conn->prepare("UPDATE StudentExperience SET job_title = ?, company_name = ?, start_date = ?, end_date = ?, description = ? WHERE exp_id = ?");
    $stmt->bind_param("sssssi", $job_title, $company_name, $start_date, $end_date, $description, $exp_id);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Experience updated successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
