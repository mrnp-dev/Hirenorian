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

$exp_id = $data['exp_id'];
// ideally we would verify studentId ownership here too

$query = "DELETE FROM StudentExperience WHERE exp_id = :exp_id";
$stmt = $conn->prepare($query);
$stmt->execute([':exp_id' => $exp_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "Experience entry deleted successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete entry or entry not found"]);
}
?>
