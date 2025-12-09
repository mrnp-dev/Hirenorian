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
if (!isset($input['student_email']) || !isset($input['technical_skills']) || !isset($input['soft_skills'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields'
    ]);
    exit;
}

$student_email = $input['student_email'];
$technical_skills = $input['technical_skills']; // comma-separated string
$soft_skills = $input['soft_skills']; // comma-separated string

try {
    // Get student_id
    $stmt = $conn->prepare("SELECT student_id FROM StudentBasicInfo WHERE student_email = ?");
    $stmt->bind_param("s", $student_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $student_id = $row['student_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    // Delete existing skills
    $stmt_delete = $conn->prepare("DELETE FROM StudentSkills WHERE student_id = ?");
    $stmt_delete->bind_param("i", $student_id);
    $stmt_delete->execute();
    
    // Insert technical skills
    if (!empty($technical_skills)) {
        $tech_array = array_map('trim', explode(',', $technical_skills));
        $stmt_insert = $conn->prepare("INSERT INTO StudentSkills (student_id, skill_name, skill_category) VALUES (?, ?, 'Technical')");
        foreach ($tech_array as $skill) {
            if (!empty($skill)) {
                $stmt_insert->bind_param("is", $student_id, $skill);
                $stmt_insert->execute();
            }
        }
    }
    
    // Insert soft skills
    if (!empty($soft_skills)) {
        $soft_array = array_map('trim', explode(',', $soft_skills));
        $stmt_insert = $conn->prepare("INSERT INTO StudentSkills (student_id, skill_name, skill_category) VALUES (?, ?, 'Soft')");
        foreach ($soft_array as $skill) {
            if (!empty($skill)) {
                $stmt_insert->bind_param("is", $student_id, $skill);
                $stmt_insert->execute();
            }
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Skills updated successfully'
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
