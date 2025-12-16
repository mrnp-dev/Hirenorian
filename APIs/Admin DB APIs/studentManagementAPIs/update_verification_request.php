<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../dbCon.php';

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$studentId = isset($data['student_id']) ? $data['student_id'] : '';
$status = isset($data['status']) ? $data['status'] : '';

if (empty($studentId) || empty($status)) {
    echo json_encode(["status" => "error", "message" => "Missing student_id or status"]);
    exit();
}

try {
    $conn->beginTransaction();

    $queryReq = "UPDATE StudentVerificationRequests 
                SET status = :status 
                WHERE student_id = :student_id";
    $stmtReq = $conn->prepare($queryReq);
    $stmtReq->execute([':status' => $status, ':student_id' => $studentId]);
    $verifiedStatus = 'processing';
    $normalizedStatus = strtolower($status);

    if ($normalizedStatus === 'approved') {
        $verifiedStatus = 'verified';
    } elseif ($normalizedStatus === 'rejected') {
        $verifiedStatus = 'unverified';
    } elseif ($normalizedStatus === 'pending') {
        $verifiedStatus = 'processing';
    }

    $queryStud = "UPDATE Students 
                  SET verified_status = :verified_status 
                  WHERE student_id = :student_id";
    $stmtStud = $conn->prepare($queryStud);
    $stmtStud->execute([':verified_status' => $verifiedStatus, ':student_id' => $studentId]);

    $conn->commit();

    echo json_encode(["status" => "success", "message" => "Status updated successfully"]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
