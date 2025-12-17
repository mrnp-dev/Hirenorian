<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include ("db_con.php");
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$companyID = $data['company_id'];
$verified = $data['verified_status'];

$query = "UPDATE Company
          SET verified_status = :verified_status
          WHERE company_id = :company_id";

$stmt = $conn->prepare($query);
$stmt->execute([
    ':company_id' => $companyID,
    ':verified_status' => $verified,
]);

echo json_encode(["status" => "success", "message" => "Company verification updated successfully"]);