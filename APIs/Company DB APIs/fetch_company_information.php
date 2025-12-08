<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$company_email = $data['company_email'];
$query = "SELECT company_id FROM Company WHERE email = :company_email";
$stmt = $conn->prepare($query);
$stmt->execute([':company_email' => $company_email]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$company_id = $row["company_id"];

$query = "SELECT * FROM Company WHERE company_id = :company_id";
$stmt = $conn->prepare($query);
$stmt->execute([':company_id' => $company_id]);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "company_id" => $company_id,
    "data" => $data
]);
?>