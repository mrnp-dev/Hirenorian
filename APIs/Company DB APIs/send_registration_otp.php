<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Logging function
function log_debug($message)
{
    $logFile = __DIR__ . '/otp_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

log_debug("Registration OTP Script started. DB Included.");

if (!isset($conn)) {
    log_debug("Critical: \$conn is not set after including db_con.php");
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit;
}

// Helper to find autoload
function getAutoloadPath()
{
    $possiblePaths = [
        __DIR__ . '/vendor/autoload.php', // Check same folder (easiest for user)
        __DIR__ . '/../../vendor/autoload.php', // Common project root (Hirenorian/vendor)
        __DIR__ . '/../../../vendor/autoload.php', // 3 levels up
        $_SERVER['DOCUMENT_ROOT'] . '/Hirenorian/vendor/autoload.php', // Absolute path attempt
        $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php', // Web root vendor
        __DIR__ . '/../../../../vendor/autoload.php', // Original local dev path
        '../../vendor/autoload.php' // Simple relative
    ];

    $tried = [];
    foreach ($possiblePaths as $path) {
        $tried[] = $path;
        if (file_exists($path)) {
            return $path;
        }
    }

    // Log what we tried if we fail
    log_debug("Failed to find autoload.php. Tried: " . implode(", ", $tried));
    return null;
}

$autoloadPath = getAutoloadPath();
if ($autoloadPath) {
    require $autoloadPath;
} else {
    log_debug("PHPMailer autoload not found.");
    echo json_encode(['status' => 'error', 'message' => 'Internal Server Error: Dependencies not found.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';

if (empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Email is required']);
    exit;
}

try {
    // 1. Generate OTP
    $otp = rand(100000, 999999);

    // 2. Store OTP in DB
    $insertStmt = $conn->prepare("INSERT INTO OTP_Verification (email, otp, status) VALUES (:email, :otp, 'valid')");
    $insertStmt->execute([':email' => $email, ':otp' => $otp]);

    // 3. Send Email
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'mail.privateemail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mailbox_1@mrnp.site';
    $mail->Password = '@09Pampanga09';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('mailbox_1@mrnp.site', 'Hirenorian Support');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = 'Verify Your Email - Hirenorian';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style='color: #4CAF50; letter-spacing: 5px;'>{$otp}</h1>
            <p>This code is valid for 1 minute.</p>
            <p>If you did not request this code, you can ignore this email.</p>
        </div>
    ";

    $mail->send();
    log_debug("Registration OTP sent to $email");
    echo json_encode(['status' => 'success', 'message' => 'OTP sent successfully']);

} catch (Exception $e) {
    log_debug("Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to send OTP: ' . $e->getMessage()]);
} catch (PDOException $e) {
    log_debug("DB Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
}
?>