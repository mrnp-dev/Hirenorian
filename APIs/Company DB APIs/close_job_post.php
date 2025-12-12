<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null || !isset($data['post_id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing post_id"]);
    exit();
}

$post_id = $data['post_id'];

try {
    // Start transaction
    $conn->beginTransaction();

    // Check if job exists
    $checkQuery = "SELECT post_id, status FROM Job_Posts WHERE post_id = :post_id";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':post_id' => $post_id]);
    $job = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$job) {
        $conn->rollBack();
        echo json_encode(["status" => "error", "message" => "Job post not found"]);
        exit();
    }

    if (strtolower($job['status']) === 'closed') {
        $conn->rollBack();
        echo json_encode(["status" => "error", "message" => "Job post is already closed"]);
        exit();
    }

    // 1. Update Job Post Status to 'closed'
    $updateJobQuery = "UPDATE Job_Posts SET status = 'closed' WHERE post_id = :post_id";
    $updateJobStmt = $conn->prepare($updateJobQuery);
    $updateJobStmt->execute([':post_id' => $post_id]);

    // 2. Reject all 'pending' applicants
    $updateApplicantsQuery = "UPDATE Applicants SET status = 'rejected' WHERE post_id = :post_id AND status = 'pending'";
    $updateApplicantsStmt = $conn->prepare($updateApplicantsQuery);
    $updateApplicantsStmt->execute([':post_id' => $post_id]);
    $rejectedCount = $updateApplicantsStmt->rowCount();

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Job post closed successfully",
        "rejected_count" => $rejectedCount
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>