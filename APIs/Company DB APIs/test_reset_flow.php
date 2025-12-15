<?php
include "db_con.php";

echo "Starting Verification Test...\n";

// 1. Create Dummy User
$testEmail = "test_verification_" . time() . "@example.com";
$testPass = "old_password";
$hash = password_hash($testPass, PASSWORD_DEFAULT);

$conn->query("INSERT INTO Company (company_name, email, password_hash, verification) VALUES ('Test Company', '$testEmail', '$hash', 'false')");
echo "1. Dummy User Created: $testEmail\n";

// 2. Call send_reset_otp.php (Simulated via included logic or curl)
// I will just use curl to test the API endpoint if possible, but I can't easily curl localhost from here if env is restricted.
// I will simulate by including the file context or just running the logic.
// Actually, easier to just check DB after "sending".
// Let's run the send_reset_otp.php script via command line using php-cgi or just fake request.
// Helper to call local script
function call_api($file, $data)
{
    // This is a hacky way to test local PHP files that expect POST input
    // We can't easily execute them as HTTP requests without a server, 
    // but we can try to run them with CLI and mock STDIN.

    $jsonData = json_encode($data);
    $descriptorSpec = [
        0 => ["pipe", "r"],
        1 => ["pipe", "w"],
        2 => ["pipe", "w"]
    ];

    $process = proc_open("php \"$file\"", $descriptorSpec, $pipes);
    if (is_resource($process)) {
        fwrite($pipes[0], $jsonData);
        fclose($pipes[0]);

        $output = stream_get_contents($pipes[1]);
        $errors = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        proc_close($process);

        return $output;
    }
    return null;
}

echo "2. Testing send_reset_otp.php...\n";
$send_response = call_api("D:/xampp/htdocs/Hirenorian/APIs/Company DB APIs/send_reset_otp.php", ['email' => $testEmail]);
echo "Response: $send_response\n";

// 3. Check OTP in DB
$stmt = $conn->prepare("SELECT * FROM OTP_Verification WHERE email = ? ORDER BY otp_id DESC LIMIT 1");
$stmt->execute([$testEmail]);
$otpRow = $stmt->fetch(PDO::FETCH_ASSOC);

if ($otpRow) {
    echo "3. OTP Found in DB: " . $otpRow['otp'] . "\n";
    $otp = $otpRow['otp'];

    // 4. Verify OTP
    echo "4. Testing verify_otp.php...\n";
    $verify_response = call_api("D:/xampp/htdocs/Hirenorian/APIs/Company DB APIs/verify_otp.php", ['email' => $testEmail, 'otp' => $otp]);
    echo "Response: $verify_response\n";

    // 5. Reset Password
    echo "5. Testing reset_password.php...\n";
    $newPass = "new_secure_password_123";
    $reset_response = call_api("D:/xampp/htdocs/Hirenorian/APIs/Company DB APIs/reset_password.php", ['email' => $testEmail, 'new_password' => $newPass]);
    echo "Response: $reset_response\n";

    // 6. Verify Password Change
    $stmt = $conn->prepare("SELECT password_hash FROM Company WHERE email = ?");
    $stmt->execute([$testEmail]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($newPass, $row['password_hash'])) {
        echo "6. SUCCESS: Password updated correctly.\n";
    } else {
        echo "6. FAILURE: Password mismatch.\n";
    }

} else {
    echo "3. FAILURE: OTP not found in DB.\n";
}

// Cleanup
$conn->query("DELETE FROM Company WHERE email = '$testEmail'");
$conn->query("DELETE FROM OTP_Verification WHERE email = '$testEmail'");
echo "Cleanup Done.\n";

?>