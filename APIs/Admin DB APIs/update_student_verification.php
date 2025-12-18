<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("db_con.php");
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = $data['student_id'];
$verification = $data['verified'];

$verifiedStatus = 'unverified';
$normalizedVerification = strtolower((string)$verification);

if ($normalizedVerification === 'true' || $normalizedVerification === '1' || $normalizedVerification === 'verified' || $normalizedVerification === 'approved') {
    $verifiedStatus = 'verified';
} elseif ($normalizedVerification === 'processing' || $normalizedVerification === 'pending') {
    $verifiedStatus = 'processing';
}

$query = "UPDATE Students
          SET verified = :verification,
              verified_status = :verified_status
          WHERE student_id = :student_id";

$stmt = $conn->prepare($query);
$stmt->execute([
    ':student_id' => $studentId,
    ':verification' => $verification,
    ':verified_status' => $verifiedStatus,
]);


$requestStatus = 'Pending';
if ($verifiedStatus === 'verified') {
    $requestStatus = 'Approved';
} elseif ($verifiedStatus === 'unverified') {
    $requestStatus = 'Rejected';
}


$queryRequests = "UPDATE StudentVerificationRequests 
                  SET status = :status 
                  WHERE student_id = :student_id";
$stmtRequests = $conn->prepare($queryRequests);
$stmtRequests->execute([
    ':status' => $requestStatus,
    ':student_id' => $studentId
]);

echo json_encode(["status" => "success", "message" => "Student verification updated successfully"]);
