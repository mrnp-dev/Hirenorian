<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Trying Root
$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "Hirenorian";

$dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8mb4";

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully as ROOT.\n";

    $sql = "CREATE TABLE IF NOT EXISTS OTP_Verification (
        otp_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        status ENUM('valid', 'expired', 'used') DEFAULT 'valid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $conn->exec($sql);
    echo "Table OTP_Verification created successfully\n";

} catch (PDOException $e) {
    echo "Root Connection Failed: " . $e->getMessage() . "\n";
}
?>