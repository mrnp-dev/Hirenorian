<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include ("db_con.php");
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = $data['student_id'];
$firstName = $data['first_name'];
$middleInitial = $data['middle_initial'];
$lastName = $data['last_name'];
$suffix = $data['suffix'];
$email = $data['email'];

$query = "UPDATE Students
          SET first_name = :first_name,
              middle_initial = :middle_initial,
              last_name = :last_name,
              suffix = :suffix,
              student_email = :email
          WHERE student_id = :student_id";

try {
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':student_id' => $studentId,
        ':first_name' => $firstName,
        ':middle_initial' => $middleInitial,
        ':last_name' => $lastName,
        ':suffix' => $suffix,
        ':email' => $email,
    ]);

    echo json_encode(["status" => "success", "message" => "Student info updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Update Failed: " . $e->getMessage()]);
}
