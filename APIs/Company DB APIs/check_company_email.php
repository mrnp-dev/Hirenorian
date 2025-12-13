<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null || !isset($data['email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload or missing email"]);
    exit();
}

$email = trim($data['email']);

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Email cannot be empty"]);
    exit();
}

try {
    $query = "SELECT company_id FROM Company WHERE email = :email";
    $stmt = $conn->prepare($query);
    $stmt->execute([':email' => $email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "exists", "message" => "Email already registered"]);
    } else {
        echo json_encode(["status" => "available", "message" => "Email is available"]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>