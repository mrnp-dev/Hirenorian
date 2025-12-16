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

log_debug("Script started. DB Included.");

// Helper to find autoload
function getAutoloadPath()
{
    $possiblePaths = [
        '/var/www/html/Hirenorian/API/phpmailer/vendor/autoload.php', // EXACT USER PATH
        __DIR__ . '/../phpmailer/vendor/autoload.php', // Parent directory (User confirmed location)
        __DIR__ . '/vendor/autoload.php', // Check same folder (easiest for user)
        __DIR__ . '/../../vendor/autoload.php', // Local Dev
        __DIR__ . '/phpmailer/vendor/autoload.php', // User specified relative
        '/var/www/html/Hirenorian/API/studentDB_APIs/phpmailer/vendor/autoload.php', // User specified absolute
        __DIR__ . '/../../../vendor/autoload.php', // 3 levels up
        $_SERVER['DOCUMENT_ROOT'] . '/Hirenorian/vendor/autoload.php', // Absolute path attempt
        $_SERVER['DOCUMENT_ROOT'] . '/Hirenorian/API/phpmailer/vendor/autoload.php', // Absolute path attempt
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
    $triedStr = implode(", ", $tried);
    log_debug("Failed to find autoload.php. Tried: " . $triedStr);
    log_debug("Current DIR: " . __DIR__);
    return ['error' => true, 'tried' => $tried, 'current_dir' => __DIR__];
}

$autoloadResult = getAutoloadPath();

if (!is_array($autoloadResult) && $autoloadResult) {
    log_debug("Autoload found at: $autoloadResult");
    require $autoloadResult;
} else {
    log_debug("PHPMailer autoload not found.");
    $debugInfo = is_array($autoloadResult) ? " Tried: " . implode(" | ", $autoloadResult['tried']) . ". DIR: " . $autoloadResult['current_dir'] : "";
    // ADDED VERSION TAG TO CONFIRM FILE UPDATE
    echo json_encode(['status' => 'error', 'message' => '[v2_DEBUG] Internal Server Error: Dependencies not found.' . $debugInfo]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
log_debug("Received request for email: " . ($email ? $email : "EMPTY"));

if (empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Email is required']);
    exit;
}

try {
    // 1. Check if email exists in Students table
    $stmt = $conn->prepare("SELECT student_id FROM Students WHERE student_email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->rowCount() == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email not found']);
        exit;
    }

    // 2. Generate OTP
    $otp = rand(100000, 999999);

    // 4. Send Email
    log_debug("Preparing to send email to $email");
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
    $mail->Subject = 'Password Reset OTP';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2>Password Reset Request</h2>
            <p>Your One-Time Password (OTP) for password reset is:</p>
            <h1 style='color: #4CAF50; letter-spacing: 5px;'>{$otp}</h1>
            <p>This code is valid for 1 minute.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
    ";

    $mail->send();
    log_debug("OTP sent successfully to $email via SMTP");

    // 4. Return OTP for client-side validation (No DB storage as requested)
    echo json_encode(['status' => 'success', 'message' => 'OTP sent successfully', 'otp' => $otp]);

} catch (Exception $e) {
    log_debug("Mailer Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to send OTP: ' . $e->getMessage()]);
} catch (PDOException $e) {
    log_debug("DB Error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
}
?>
