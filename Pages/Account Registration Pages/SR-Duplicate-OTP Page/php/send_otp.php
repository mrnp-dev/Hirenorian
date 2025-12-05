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
?>