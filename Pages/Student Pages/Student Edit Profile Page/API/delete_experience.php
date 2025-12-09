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
if (!isset($input['exp_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing experience ID'
    ]);
    exit;
}

$exp_id = $input['exp_id'];

try {
    // Delete experience entry
    $stmt = $conn->prepare("DELETE FROM StudentExperience WHERE exp_id = ?");
    $stmt->bind_param("i", $exp_id);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Experience deleted successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
