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

if (!$data || !isset($data['email']) || !isset($data['new_password'])) {
    echo json_encode(["status" => "error", "message" => "Missing email or new_password"]);
    exit();
}

$email = $data['email'];
$newPassword = $data['new_password'];

try {
    // Step 1: Hash the new password
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Step 2: Update the password in DB
    $stmt = $conn->prepare("UPDATE Company SET password_hash = :hash WHERE email = :email");
    $stmt->execute([
        ':hash' => $newHash,
        ':email' => $email
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Account not found or password unchanged"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $e->getMessage()]);
}
?>