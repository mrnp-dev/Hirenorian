<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include '../db_con.php';
$response = file_get_contents("php://input");
$data = json_decode($response, true);
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$personalEmail = $data['email'];
$phone = $data['phone'];
$location = $data['location'];
$studentId = $data['studentId'];

$query1 = "UPDATE Students SET personal_email = :personalEmail, phone_number = :phone WHERE student_id = :studentId";
$query2 = "INSERT INTO StudentProfile (student_id, location) 
            VALUES (:studentId, :location) ON DUPLICATE KEY UPDATE location = :location";

$stmt1 = $conn->prepare($query1);
$stmt2 = $conn->prepare($query2);

$stmt1->execute([
    'studentId' => $studentId,
    'personalEmail' => $personalEmail,
    'phone' => $phone
]);

$stmt2->execute([
    'studentId' => $studentId,
    'location' => $location
]);

if ($stmt1->rowCount() > 0 || $stmt2->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "Contact updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update contact"]);
}
?>