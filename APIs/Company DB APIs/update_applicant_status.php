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

if ($data === null || !isset($data['applicant_id']) || !isset($data['status'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing parameters"]);
    exit();
}

$applicant_id = $data['applicant_id'];
$status = strtolower($data['status']);

// Validate status
if (!in_array($status, ['accepted', 'rejected', 'pending'])) {
    echo json_encode(["status" => "error", "message" => "Invalid status. Must be 'accepted', 'rejected', or 'pending'"]);
    exit();
}

try {
    // Get applicant details and job info
    $query = "
        SELECT 
            a.applicant_id,
            a.post_id,
            a.status AS current_status,
            jp.applicant_limit,
            (SELECT COUNT(*) FROM Applicants WHERE post_id = a.post_id AND status = 'accepted') AS current_accepted
        FROM Applicants a
        JOIN Job_Posts jp ON a.post_id = jp.post_id
        WHERE a.applicant_id = :applicant_id
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute([':applicant_id' => $applicant_id]);
    $applicant = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$applicant) {
        echo json_encode(["status" => "error", "message" => "Applicant not found"]);
        exit();
    }

    // Check if accepting would exceed limit
    if ($status === 'accepted') {
        $newAcceptedCount = $applicant['current_accepted'];

        // If current status is not already accepted, this will increase the count
        if ($applicant['current_status'] !== 'accepted') {
            $newAcceptedCount++;
        }

        if ($newAcceptedCount > $applicant['applicant_limit']) {
            echo json_encode([
                "status" => "error",
                "code" => "LIMIT_REACHED",
                "message" => "Cannot accept more applicants. Applicant limit reached ({$applicant['applicant_limit']} accepted)",
                "current_accepted" => $applicant['current_accepted'],
                "limit" => $applicant['applicant_limit']
            ]);
            exit();
        }
    }

    // Update applicant status
    $updateQuery = "UPDATE Applicants SET status = :status WHERE applicant_id = :applicant_id";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->execute([
        ':status' => $status,
        ':applicant_id' => $applicant_id
    ]);

    // Check if job should be closed (limit reached)
    $checkLimitQuery = "
        SELECT COUNT(*) AS accepted_count 
        FROM Applicants 
        WHERE post_id = :post_id AND status = 'accepted'
    ";
    $checkStmt = $conn->prepare($checkLimitQuery);
    $checkStmt->execute([':post_id' => $applicant['post_id']]);
    $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

    $jobClosed = false;
    if ($result['accepted_count'] >= $applicant['applicant_limit']) {
        // Auto-close the job post
        $closeQuery = "UPDATE Job_Posts SET status = 'closed' WHERE post_id = :post_id";
        $closeStmt = $conn->prepare($closeQuery);
        $closeStmt->execute([':post_id' => $applicant['post_id']]);
        $jobClosed = true;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Applicant status updated successfully",
        "applicant_id" => $applicant_id,
        "new_status" => $status,
        "job_closed" => $jobClosed,
        "accepted_count" => $result['accepted_count'],
        "applicant_limit" => $applicant['applicant_limit']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>