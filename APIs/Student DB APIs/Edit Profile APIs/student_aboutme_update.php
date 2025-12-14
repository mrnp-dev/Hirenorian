<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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

$aboutme = $data['aboutme'];
$studentId = $data['studentId'];

$query = "INSERT INTO StudentProfile (student_id, about_me) 
        VALUES (:studentId, :aboutme) 
        ON DUPLICATE KEY UPDATE about_me = :aboutme";
$stmt = $conn->prepare($query);
$stmt->execute([
    'studentId' => $studentId,
    'aboutme' => $aboutme
]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "About me updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update about me"]);
}
?>