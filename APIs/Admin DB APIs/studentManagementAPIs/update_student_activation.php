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
$activated = $data['activated'];

$query = "UPDATE Students
          SET activated = :activated
          WHERE student_id = :student_id";

$stmt = $conn->prepare($query);
$stmt->execute([
    ':student_id' => $studentId,
    ':activated' => $activated,
]);

echo json_encode(["status" => "success", "message" => "Student activation updated successfully"]);
