<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db_con.php';

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = $data['studentId'];
$currentPassword = $data['current_password'];
$newPassword = $data['new_password'];

if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit();
}

try {
    // 1. Fetch current password hash
    $query = "SELECT password_hash FROM Students WHERE student_id = :studentId";
    $stmt = $conn->prepare($query);
    $stmt->execute([':studentId' => $studentId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit();
    }

    // 2. Verify current password
    if (!password_verify($currentPassword, $user['password_hash'])) {
        echo json_encode(["status" => "error", "message" => "Incorrect current password"]);
        exit();
    }

    // 3. Hash new password
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // 4. Update password
    $updateQuery = "UPDATE Students SET password_hash = :newHash WHERE student_id = :studentId";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->execute([
        ':newHash' => $newHash,
        ':studentId' => $studentId
    ]);

    echo json_encode(["status" => "success", "message" => "Password changed successfully"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
