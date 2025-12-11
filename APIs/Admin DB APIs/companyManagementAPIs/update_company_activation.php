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

$companyID = $data['company_id'];
$activation = $data['activation'];

$query = "UPDATE Company
          SET activation = :activation
          WHERE company_id = :company_id";

$stmt = $conn->prepare($query);
$stmt->execute([
    ':company_id' => $companyID,
    ':activation' => $activation,
]);

// Return success even if rowCount is 0 (no changes made), as long as query didn't fail.
echo json_encode(["status" => "success", "message" => "Company activation updated successfully"]);
