<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

$studentId = $data['studentId'];
$firstName = $data['first_name'];
$lastName = $data['last_name'];
$middleInitial = $data['middle_initial'];
$suffix = $data['suffix'];

// Update Students table
$query = "UPDATE Students SET 
            first_name = :firstName,
            last_name = :lastName,
            middle_initial = :middleInitial,
            suffix = :suffix
          WHERE student_id = :studentId";

$stmt = $conn->prepare($query);
$stmt->execute([
    ':firstName' => $firstName,
    ':lastName' => $lastName,
    ':middleInitial' => $middleInitial,
    ':suffix' => $suffix,
    ':studentId' => $studentId
]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "success", "message" => "Personal details updated successfully"]);
} else {
    // Check if it's just because no fields changed
    echo json_encode(["status" => "success", "message" => "No changes made or details updated successfully"]);
}
?>
