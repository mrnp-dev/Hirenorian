<?php
$data = json_decode(file_get_contents("php://input"), true);

$otp = rand(100000, 999999);

$to = $data['email'];
$subject = "Your OTP Code";
$message = "Your OTP is: " . $otp;

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/plain;charset=UTF-8\r\n";
$headers .= "From: mailbox_1@mrnp.site\r\n";
$headers .= "Reply-To: support@mrnp.site\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully.";
} else {
    echo "Failed to send email.";
}
?><?php
// Load Composer's autoloader (make sure PHPMailer is installed via Composer)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Adjust path if needed

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = 0;                       // Disable verbose debug output (use 2 for debugging)
    $mail->isSMTP();                            // Send using SMTP
    $mail->Host       = 'mail.privateemail.com';// Namecheap Private Email SMTP server
    $mail->SMTPAuth   = true;                   // Enable SMTP authentication
    $mail->Username   = 'your-email@yourdomain.com'; // Your full Private Email address
    $mail->Password   = 'your-email-password';  // Your Private Email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encryption (TLS)
    $mail->Port       = 587;                    // TCP port (use 465 if SSL)

    // Sender info
    $mail->setFrom('your-email@yourdomain.com', 'Your Name');

    // Recipient
    $mail->addAddress('recipient@example.com', 'Recipient Name');

    // Reply-To (optional)
    $mail->addReplyTo('your-email@yourdomain.com', 'Your Name');

    // Content
    $mail->isHTML(true);                        // Set email format to HTML
    $mail->Subject = 'Test Email from Namecheap Private Email';
    $mail->Body    = '<h1>Hello!</h1><p>This is a test email sent using <b>PHPMailer</b> via Namecheap Private Email SMTP.</p>';
    $mail->AltBody = 'Hello! This is a test email sent using PHPMailer via Namecheap Private Email SMTP.';

    // Send email
    $mail->send();
    echo "Message has been sent successfully!";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
