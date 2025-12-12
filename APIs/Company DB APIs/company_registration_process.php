<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include 'db_con.php';
$response = file_get_contents("php://input");
$data = json_decode($response, true);
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}
$Company_Address = $data['Company Address'] ?? '';
$Company_Email = $data['Company Email'] ?? '';
$Company_Name = $data['Company Name'] ?? '';
$Company_Type = $data['Company Type'] ?? '';
$Industry = $data['Industry'] ?? '';
$Password = $data['Password'] ?? '';
$student_email = $data['School Email'] ?? '';
$Phone_Number = $data['Phone Number'] ?? '';

header('Content-Type: application/json');
try {
    $conn->beginTransaction();
    $password_hash = password_hash($Password, PASSWORD_BCRYPT);
    $query = $conn->prepare("
        INSERT INTO Company
        (company_name, email, password_hash, phone_number, company_type, industry, address)
        VALUES (:company_name, :email, :password_hash, :phone_number, :company_type, :industry, :address)");

    $query->execute([
        ':company_name' => $Company_Name,
        ':email' => $Company_Email,
        ':password_hash' => $password_hash,
        ':phone_number' => $Phone_Number,
        ':company_type' => $Company_Type,
        ':industry' => $Industry,
        ':address' => $Company_Address
    ]);

    $conn->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Company registered successfully",
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
    ]);
}