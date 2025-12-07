<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// NOTE: Ensure vendor/autoload.php exists. If you haven't run 'composer require phpmailer/phpmailer', this will fail.
// You might need to adjust the path to autoload.php depending on where your vendor folder is.
// Assuming vendor is in the root or relative to this file.
// For this prototype, we'll look for it in the project root or current dir.
$autoloadPath = 's';
if (!file_exists($autoloadPath)) {
    $autoloadPath = 'vendor/autoload.php';
}

if (file_exists($autoloadPath)) {
    require $autoloadPath;
} else {
    echo json_encode(['success' => false, 'message' => 'PHPMailer not found. Please run composer install.']);
    exit;
}

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$recipientEmail = $input['email'] ?? '';

if (empty($recipientEmail)) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'mail.privateemail.com';                     // Set the SMTP server to send through
    $mail->SMTPAuth = true;                                   // Enable SMTP authentication
    $mail->Username = 'mailbox_1@mrnp.site';                     // SMTP username
    $mail->Password = '@09Pampanga09';                               // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    // Sender info
    $mail->setFrom('mailbox_1@mrnp.site', 'Mailer');

    // Recipient
    $mail->addAddress($recipientEmail);     // Add a recipient

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Test Email from Prototype';
    $mail->Body = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message has been sent']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>