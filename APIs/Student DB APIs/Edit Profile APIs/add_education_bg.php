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

$degree = $data['degree'];
$institution = $data['institution'];
$start_year = $data['start_year'];
$end_year = $data['end_year'];
$studentId = $data['studentId'];

$query = "INSERT INTO StudentEducationHistory (student_id, degree, institution, start_year, end_year)
        VALUES (:studentId, :degree, :institution, :start_year, :end_year)";
$stmt = $conn->prepare($query);
$stmt->execute([
    'studentId' => $studentId,
    'degree' => $degree,
    'institution' => $institution,
    'start_year' => $start_year,
    'end_year' => $end_year
]);

if ($stmt->rowCount() > 0) {
    $new_edu_id = $conn->lastInsertId();
    echo json_encode(["status" => "success", "message" => "Education background added successfully", "edu_id" => $new_edu_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add education background"]);
}
?>