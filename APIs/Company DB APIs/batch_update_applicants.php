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

if ($data === null || !isset($data['applicant_ids']) || !isset($data['status'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing parameters"]);
    exit();
}

$applicant_ids = $data['applicant_ids'];
$status = strtolower($data['status']);

// Validate inputs
if (!is_array($applicant_ids) || empty($applicant_ids)) {
    echo json_encode(["status" => "error", "message" => "applicant_ids must be a non-empty array"]);
    exit();
}

if (!in_array($status, ['accepted', 'rejected', 'pending'])) {
    echo json_encode(["status" => "error", "message" => "Invalid status. Must be 'accepted', 'rejected', or 'pending'"]);
    exit();
}

try {
    // Get all applicants with their job info
    $placeholders = implode(',', array_fill(0, count($applicant_ids), '?'));
    $query = "
        SELECT 
            a.applicant_id,
            a.post_id,
            a.status AS current_status,
            jp.applicant_limit,
            (SELECT COUNT(*) FROM Applicants WHERE post_id = a.post_id AND status = 'accepted') AS current_accepted
        FROM Applicants a
        JOIN Job_Posts jp ON a.post_id = jp.post_id
        WHERE a.applicant_id IN ($placeholders)
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute($applicant_ids);
    $applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($applicants)) {
        echo json_encode(["status" => "error", "message" => "No applicants found"]);
        exit();
    }

    // If accepting, check limit per job post
    if ($status === 'accepted') {
        $jobPostLimits = [];

        foreach ($applicants as $applicant) {
            $postId = $applicant['post_id'];

            if (!isset($jobPostLimits[$postId])) {
                $jobPostLimits[$postId] = [
                    'limit' => $applicant['applicant_limit'],
                    'current' => $applicant['current_accepted'],
                    'to_accept' => 0
                ];
            }

            // Count how many from this batch will be newly accepted
            if ($applicant['current_status'] !== 'accepted') {
                $jobPostLimits[$postId]['to_accept']++;
            }
        }

        // Check if any job would exceed limit
        foreach ($jobPostLimits as $postId => $limits) {
            $newTotal = $limits['current'] + $limits['to_accept'];
            if ($newTotal > $limits['limit']) {
                echo json_encode([
                    "status" => "error",
                    "code" => "LIMIT_REACHED",
                    "message" => "Cannot accept all applicants. Would exceed limit for job post #$postId",
                    "job_post_id" => $postId,
                    "current_accepted" => $limits['current'],
                    "trying_to_accept" => $limits['to_accept'],
                    "limit" => $limits['limit']
                ]);
                exit();
            }
        }
    }

    // Update all applicants
    $updateQuery = "UPDATE Applicants SET status = :status WHERE applicant_id IN ($placeholders)";
    $updateStmt = $conn->prepare($updateQuery);
    $params = array_merge([$status], $applicant_ids);
    $updateStmt->execute(array_combine(
        array_merge([':status'], array_map(fn($i) => $i, range(0, count($applicant_ids) - 1))),
        $params
    ));

    $updatedCount = $updateStmt->rowCount();

    // Check which jobs should be closed
    $jobPostsToCheck = array_unique(array_column($applicants, 'post_id'));
    $closedJobs = [];

    foreach ($jobPostsToCheck as $postId) {
        $checkQuery = "
            SELECT 
                COUNT(*) AS accepted_count,
                jp.applicant_limit
            FROM Applicants a
            JOIN Job_Posts jp ON a.post_id = jp.post_id
            WHERE a.post_id = :post_id AND a.status = 'accepted'
            GROUP BY jp.applicant_limit
        ";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->execute([':post_id' => $postId]);
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($result && $result['accepted_count'] >= $result['applicant_limit']) {
            // Auto-close job
            $closeQuery = "UPDATE Job_Posts SET status = 'closed' WHERE post_id = :post_id";
            $closeStmt = $conn->prepare($closeQuery);
            $closeStmt->execute([':post_id' => $postId]);
            $closedJobs[] = $postId;
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Batch update completed successfully",
        "updated_count" => $updatedCount,
        "new_status" => $status,
        "closed_jobs" => $closedJobs
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>