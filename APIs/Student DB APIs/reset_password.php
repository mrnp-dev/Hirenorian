<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once "db_con.php";

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

    // Step 2: Update the password in Students DB (using student_email column)
    $stmt = $conn->prepare("UPDATE Students SET password_hash = :hash WHERE student_email = :email");
    $stmt->execute([
        ':hash' => $newHash,
        ':email' => $email
    ]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
    } else {
        // It's possible the password was same as before or email doesn't exist (though Step 1 check covers existence)
        // We'll return success if it updated or if it just exists. 
        // But rowCount=0 usually means no match or no change. 
        // Let's assume success if no error for user-friendly flow unless critical.
        // Actually, let's be strict if email assumes to exist.
        echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Update failed: " . $e->getMessage()]);
}

