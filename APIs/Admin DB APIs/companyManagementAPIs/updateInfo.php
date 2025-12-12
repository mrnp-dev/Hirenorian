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

$companyId = $data['company_id'];
$companyName = $data['company_name'];
$email = $data['email'];

$query = "UPDATE Company
          SET company_name = :company_name,
              email = :email
          WHERE company_id = :company_id";

try {
    $stmt = $conn->prepare($query);
    $params = [
        ':company_id' => $companyId,
        ':company_name' => $companyName,
        ':email' => $email
    ];

    $stmt->execute($params);

    echo json_encode(["status" => "success", "message" => "Company info updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Update Failed: " . $e->getMessage()]);
}
