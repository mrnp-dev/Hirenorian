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

$exp_id = $data['exp_id'];
$job_title = $data['job_title'];
$company = $data['company'];
$start_year = $data['start_year'];
$end_year = $data['end_year'];
$description = $data['description'];
// $studentId = $data['studentId']; 

$query = "UPDATE StudentExperience 
          SET job_title = :job_title, 
              company_name = :company, 
              start_date = :start_year, 
              end_date = :end_year,
              description = :description
          WHERE exp_id = :exp_id";
          
$stmt = $conn->prepare($query);
$stmt->execute([
    ':job_title' => $job_title,
    ':company' => $company,
    ':start_year' => $start_year,
    ':end_year' => $end_year,
    ':description' => $description,
    ':exp_id' => $exp_id
]);

// Return success even if rowCount is 0 (no changes made), as long as query didn't fail.
echo json_encode(["status" => "success", "message" => "Experience updated successfully"]);
?>
