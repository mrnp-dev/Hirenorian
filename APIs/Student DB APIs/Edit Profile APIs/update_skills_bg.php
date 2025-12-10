<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db_con.php';

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = $data['studentId'];
// Split string by comma and trim whitespace, filter out empty strings
$technical_skills = array_filter(array_map('trim', explode(',', $data['technical_skills'])));
$soft_skills = array_filter(array_map('trim', explode(',', $data['soft_skills'])));

try {
    $conn->beginTransaction();

    // 1. Delete all existing skills for this student
    $deleteQuery = "DELETE FROM StudentSkills WHERE student_id = :studentId";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->execute([':studentId' => $studentId]);

    // 2. Insert Technical Skills
    $insertQuery = "INSERT INTO StudentSkills (student_id, skill_name, skill_category) VALUES (:studentId, :skillName, :skillType)";
    $insertStmt = $conn->prepare($insertQuery);

    foreach ($technical_skills as $skill) {
        if (!empty($skill)) {
            $insertStmt->execute([
                ':studentId' => $studentId,
                ':skillName' => $skill,
                ':skillType' => 'Technical'
            ]);
        }
    }

    // 3. Insert Soft Skills
    foreach ($soft_skills as $skill) {
        if (!empty($skill)) {
            $insertStmt->execute([
                ':studentId' => $studentId,
                ':skillName' => $skill,
                ':skillType' => 'Soft'
            ]);
        }
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Skills updated successfully"]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Failed to update skills: " . $e->getMessage()]);
}
?>
