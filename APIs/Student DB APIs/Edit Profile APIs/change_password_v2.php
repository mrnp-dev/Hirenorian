<?php
header("Access-Control-Allow-Origin: *");
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

$studentId = $data['studentId'] ?? '';
$newPassword = $data['new_password'] ?? '';

// Validation
if (empty($newPassword)) {
    echo json_encode(["status" => "error", "message" => "New password is required"]);
    exit();
}

if (empty($studentId)) {
    echo json_encode(["status" => "error", "message" => "Student ID is missing"]);
    exit();
}

try {
    // 1. (Optional) Check if user exists
    $query = "SELECT student_id FROM Students WHERE student_id = :studentId";
    $stmt = $conn->prepare($query);
    $stmt->execute([':studentId' => $studentId]);
    
    if (!$stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit();
    }

    // 2. Hash new password
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // 3. Update password
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
