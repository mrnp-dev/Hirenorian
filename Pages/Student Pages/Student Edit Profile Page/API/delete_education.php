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
if (!isset($input['edu_hist_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing education ID'
    ]);
    exit;
}

$edu_hist_id = $input['edu_hist_id'];

try {
    // Delete education entry
    $stmt = $conn->prepare("DELETE FROM StudentEducationHistory WHERE edu_hist_id = ?");
    $stmt->bind_param("i", $edu_hist_id);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Education deleted successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
