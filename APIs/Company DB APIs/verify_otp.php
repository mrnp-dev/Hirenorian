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

// Logging function
function log_debug($message)
{
    $logFile = __DIR__ . '/otp_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

if (!isset($conn)) {
    log_debug("Critical: \$conn is not set in verify_otp.php");
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$otp = $input['otp'] ?? '';

if (empty($email) || empty($otp)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and OTP are required']);
    exit;
}

try {
    // Check if OTP exists, is valid, and matches email
    // Also check time limit (1 minute)
    // We order by otp_id DESC to get the latest one
    $stmt = $conn->prepare("SELECT * FROM OTP_Verification WHERE email = :email AND otp = :otp AND status = 'valid' ORDER BY otp_id DESC LIMIT 1");
    $stmt->execute([':email' => $email, ':otp' => $otp]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $created_at = strtotime($result['created_at']);
        $current_time = time();
        $diff = $current_time - $created_at;

        if ($diff <= 60) { // 1 minute = 60 seconds
            // Valid
            // Update status to 'used' so it can't be reused
            $updateStmt = $conn->prepare("UPDATE OTP_Verification SET status = 'used' WHERE otp_id = :id");
            $updateStmt->execute([':id' => $result['otp_id']]);

            echo json_encode(['status' => 'success', 'message' => 'OTP verified successfully']);
        } else {
            // Expired
            // Mark as expired?
            $updateStmt = $conn->prepare("UPDATE OTP_Verification SET status = 'expired' WHERE otp_id = :id");
            $updateStmt->execute([':id' => $result['otp_id']]);

            echo json_encode(['status' => 'error', 'message' => 'OTP has expired']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid OTP']);
    }

} catch (PDOException $e) {
    log_debug("DB Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
}
?>