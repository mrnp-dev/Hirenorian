<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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

$job_title = $data['job_title'];
$company = $data['company'];
$start_year = $data['start_year'];
$end_year = $data['end_year'];
$description = $data['description'];
$studentId = $data['studentId'];

$query = "INSERT INTO StudentExperience (student_id, job_title, company, start_year, end_year, description)
        VALUES (:studentId, :job_title, :company, :start_year, :end_year, :description)";
$stmt = $conn->prepare($query);
$stmt->execute([
    'studentId' => $studentId,
    'job_title' => $job_title,
    'company' => $company,
    'start_year' => $start_year,
    'end_year' => $end_year,
    'description' => $description
]);

if ($stmt->rowCount() > 0) {
    $new_exp_id = $conn->lastInsertId();
    echo json_encode(["status" => "success", "message" => "Experience added successfully", "exp_id" => $new_exp_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add experience"]);
}
?>
