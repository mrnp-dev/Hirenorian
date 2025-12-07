<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Logging function
function log_debug($message)
{
    $logFile = __DIR__ . '/otp_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

log_debug("Script started.");

// Adjust path to vendor/autoload.php
$possiblePaths = [
    __DIR__ . '/../../../../vendor/autoload.php', // 4 levels up
    __DIR__ . '/../../../../../vendor/autoload.php', // 5 levels up
    $_SERVER['DOCUMENT_ROOT'] . '/Web Projects/Hirenorian-1/vendor/autoload.php' // Absolute path attempt
];

$autoloadPath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $autoloadPath = $path;
        log_debug("Found autoload at: $path");
        break;
    }
}

if (!$autoloadPath) {
    log_debug("Autoload not found in expected paths.");
    // Fallback
    $autoloadPath = '../../../../vendor/autoload.php';
}

if (file_exists($autoloadPath)) {
    require $autoloadPath;
} else {
    log_debug("PHPMailer not found at $autoloadPath");
    echo json_encode(['success' => false, 'message' => 'PHPMailer not found. Please run composer install.']);
    exit;
}

header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

$inputRaw = file_get_contents('php://input');
log_debug("Raw input: $inputRaw");

$input = json_decode($inputRaw, true);
$recipientEmail = $input['email'] ?? '';

if (empty($recipientEmail)) {
    log_debug("Email is empty.");
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

// Generate OTP
$otp = rand(100000, 999999);
log_debug("Generated OTP: $otp for $recipientEmail");

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = 0; // Disable verbose debug output to stdout, we log manually
    $mail->isSMTP();
    $mail->Host = 'mail.privateemail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mailbox_1@mrnp.site';
    $mail->Password = '@09Pampanga09';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    log_debug("SMTP configured.");

    // Sender info
    $mail->setFrom('mailbox_1@mrnp.site', 'Hirenorian Support');
    $mail->addReplyTo('support@mrnp.site', 'Support');

    // Recipient
    $mail->addAddress($recipientEmail);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Your Hirenorian Verification Code';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <h1 style='color: #4CAF50; letter-spacing: 5px;'>{$otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
    ";
    $mail->AltBody = "Your verification code is: {$otp}. This code will expire in 5 minutes.";

    log_debug("Attempting to send...");
    $mail->send();
    log_debug("Email sent successfully.");

    echo json_encode(['success' => true, 'message' => 'OTP sent successfully', 'otp' => $otp]);

} catch (Exception $e) {
    log_debug("Mailer Error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>