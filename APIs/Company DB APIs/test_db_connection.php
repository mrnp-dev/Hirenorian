<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: text/plain");

echo "Diagnostic: Testing Database Connection...\n\n";

$servername = "localhost";
$username = "dbuser";
$password = "@09Pampanga09";
$dbname = "Hirenorian";

echo "Target: $dbname on $servername with user $username\n\n";

try {
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "SUCCESS: Connection established!\n";
} catch (PDOException $e) {
    echo "FAILURE: Connection failed.\n";
    echo "Error Code: " . $e->getCode() . "\n";
    echo "Error Message: " . $e->getMessage() . "\n";
}
?>