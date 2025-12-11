<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

// Check for email in session or JSON input
$input_data = json_decode(file_get_contents("php://input"), true);
$company_email = $_SESSION['email'] ?? $input_data['company_email'] ?? null;

if (!$company_email) {
    echo json_encode(["status" => "error", "message" => "No company email in session or provided"]);
    exit();
}

// Lookup company_id
try {
    $query = "SELECT company_id FROM Company WHERE email = :company_email";
    $stmt = $conn->prepare($query);
    $stmt->execute([':company_email' => $company_email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["status" => "error", "message" => "Company not found"]);
        exit();
    }

    echo json_encode([
        "status" => "success",
        "company_id" => $row["company_id"]
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>