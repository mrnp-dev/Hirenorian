<?php
$servername = "158.69.205.176";
$username   = "dbuser";
$password   = "@09Pampanga09";
$dbname     = "studentDB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully!";
