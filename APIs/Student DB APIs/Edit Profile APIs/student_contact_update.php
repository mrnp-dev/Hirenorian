<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include 'db_con.php';
$response = file_get_contents("php://input");
$data = json_decode($response, true);
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$personalEmail = $data['email'];
$phone = $data['phone'];
$location = $data['location'];

$query = "UPDATE Students SET personal_email = :personalEmail, phone_number = :phone WHERE "

?>