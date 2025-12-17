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

include "../../db_con.php"; // Adjust path to point to APIs/Student DB APIs/db_con.php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Helper to find autoload
function getAutoloadPath()
{
    $possiblePaths = [
        '/var/www/html/Hirenorian/API/phpmailer/vendor/autoload.php',
        __DIR__ . '/../../phpmailer/vendor/autoload.php',
        __DIR__ . '/../../../vendor/autoload.php',
        str_replace('Pages/Student Pages/Student Edit Profile Page/php', 'vendor/autoload.php', $_SERVER['DOCUMENT_ROOT'] . $_SERVER['PHP_SELF']), // Context aware?
        $_SERVER['DOCUMENT_ROOT'] . '/Web Projects/Hirenorian-1/vendor/autoload.php',
        '../../../../vendor/autoload.php'
    ];

    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            return $path;
        }
    }
    return false;
}

$autoloadPath = getAutoloadPath();

if ($autoloadPath) {
    require $autoloadPath;
} else {
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
    // Generate OTP
    $otp = rand(100000, 999999);

    // Send Email
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
    $mail->Subject = 'Verify Your New Email Address';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
            <h2>Email Verification</h2>
            <p>You requested to update your email address. Your verification code is:</p>
            <h1 style='color: #4CAF50; letter-spacing: 5px;'>{$otp}</h1>
            <p>This code is valid for 5 minutes.</p>
            <p>If you did not request this change, please ignore this email.</p>
        </div>
    ";

    $mail->send();

    // Return OTP for client-side validation (matching existing pattern)
    echo json_encode(['status' => 'success', 'message' => 'OTP sent successfully', 'otp' => $otp]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send OTP: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
