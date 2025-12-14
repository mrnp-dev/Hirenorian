<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../dbCon.php';
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = $data['student_id'];
$verification = $data['verified'];

$query = "UPDATE Students
          SET verified = :verification
          WHERE student_id = :student_id";  

$stmt = $conn->prepare($query);
$stmt->execute([
    ':student_id' => $studentId,
    ':verification' => $verification,
]);

// Return success even if rowCount is 0 (no changes made), as long as query didn't fail.
echo json_encode(["status" => "success", "message" => "Student verification updated successfully"]);
