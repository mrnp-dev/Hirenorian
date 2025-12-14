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

$edu_id = $data['edu_id'];
// ideally we would verify studentId ownership here too, but for now just ID
// $studentId = $data['studentId']; 

$query = "DELETE FROM StudentEducationHistory WHERE edu_hist_id = :edu_id";
$stmt = $conn->prepare($query);
$stmt->execute(['edu_id' => $edu_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "Education entry deleted successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete entry or entry not found"]);
}
?>
