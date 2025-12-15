<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['email']) || !isset($data['current_password'])) {
    echo json_encode(["status" => "error", "message" => "Missing email or current_password"]);
    exit();
}

$email = $data['email'];
$currentPassword = $data['current_password'];

try {
    // Step 1: Get stored hash by email
    $stmt = $conn->prepare("SELECT password_hash FROM Company WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "Account not found"]);
        exit();
    }

    $storedHash = $user['password_hash'];

    // Step 2: Verify password
    if (password_verify($currentPassword, $storedHash)) {
        echo json_encode(["status" => "success", "message" => "Password verified"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid current password"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Check failed: " . $e->getMessage()]);
}
?>