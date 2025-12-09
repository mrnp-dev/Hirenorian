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
if (!isset($input['edu_hist_id']) || !isset($input['degree']) || 
    !isset($input['institution']) || !isset($input['start_year']) || !isset($input['end_year'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$edu_hist_id = $input['edu_hist_id'];
$degree = $input['degree'];
$institution = $input['institution'];
$start_year = $input['start_year'];
$end_year = $input['end_year'];

try {
    // Update education entry
    $stmt = $conn->prepare("UPDATE StudentEducationHistory SET degree = ?, institution = ?, start_year = ?, end_year = ? WHERE edu_hist_id = ?");
    $stmt->bind_param("ssssi", $degree, $institution, $start_year, $end_year, $edu_hist_id);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Education updated successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
