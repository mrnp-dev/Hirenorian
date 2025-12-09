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
$title = $data['title'] ?? null;
$location = $data['location'] ?? null;
$work_type = $data['work_type'] ?? null;
$applicant_limit = $data['applicant_limit'] ?? null;
$category = $data['category'] ?? null;
$work_tags = $data['work_tags'] ?? []; // Array of tags
$required_document = $data['required_document'] ?? null;
$description = $data['description'] ?? null;
$responsibilities = $data['responsibilities'] ?? null;
$qualifications = $data['qualifications'] ?? null;
$skills = $data['skills'] ?? null;

// Validate required fields
if (
    !$title || !$location || !$work_type || !$applicant_limit || !$category ||
    !$required_document || !$description || !$responsibilities || !$qualifications || !$skills
) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

try {
    // Start transaction
    $conn->beginTransaction();

    // Check if job exists
    $checkQuery = "SELECT post_id FROM Job_Posts WHERE post_id = :post_id";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':post_id' => $post_id]);

    if (!$checkStmt->fetch()) {
        $conn->rollBack();
        echo json_encode(["status" => "error", "message" => "Job post not found"]);
        exit();
    }

    // ✅ VALIDATION: Check if applicant_limit is less than current accepted count
    $acceptedQuery = "SELECT COUNT(*) as accepted_count FROM Applicants 
                      WHERE post_id = :post_id AND status = 'accepted'";
    $acceptedStmt = $conn->prepare($acceptedQuery);
    $acceptedStmt->execute([':post_id' => $post_id]);
    $acceptedResult = $acceptedStmt->fetch(PDO::FETCH_ASSOC);
    $acceptedCount = $acceptedResult['accepted_count'];

    if ($applicant_limit < $acceptedCount) {
        $conn->rollBack();
        echo json_encode([
            "status" => "error",
            "code" => "LIMIT_BELOW_ACCEPTED",
            "message" => "Cannot set applicant limit to {$applicant_limit}. You already have {$acceptedCount} accepted applicants.",
            "accepted_count" => $acceptedCount,
            "requested_limit" => $applicant_limit
        ]);
        exit();
    }

    // Update Job_Posts table
    $updatePostsQuery = "UPDATE Job_Posts 
                         SET applicant_limit = :applicant_limit
                         WHERE post_id = :post_id";
    $updatePostsStmt = $conn->prepare($updatePostsQuery);
    $updatePostsStmt->execute([
        ':applicant_limit' => $applicant_limit,
        ':post_id' => $post_id
    ]);

    // Update Job_Details table
    $updateDetailsQuery = "UPDATE Job_Details 
                           SET title = :title,
                               location = :location,
                               work_type = :work_type,
                               category = :category,
                               required_document = :required_document,
                               description = :description,
                               responsibilities = :responsibilities,
                               qualifications = :qualifications,
                               skills = :skills
                           WHERE post_id = :post_id";
    $updateDetailsStmt = $conn->prepare($updateDetailsQuery);
    $updateDetailsStmt->execute([
        ':title' => $title,
        ':location' => $location,
        ':work_type' => $work_type,
        ':category' => $category,
        ':required_document' => $required_document,
        ':description' => $description,
        ':responsibilities' => $responsibilities,
        ':qualifications' => $qualifications,
        ':skills' => $skills,
        ':post_id' => $post_id
    ]);

    // Update work tags - delete old ones and insert new ones
    $deleteTagsQuery = "DELETE FROM Job_Tags WHERE post_id = :post_id";
    $deleteTagsStmt = $conn->prepare($deleteTagsQuery);
    $deleteTagsStmt->execute([':post_id' => $post_id]);

    // Insert new tags
    if (!empty($work_tags)) {
        $insertTagQuery = "INSERT INTO Job_Tags (post_id, tag) VALUES (:post_id, :tag)";
        $insertTagStmt = $conn->prepare($insertTagQuery);

        foreach ($work_tags as $tag) {
            $insertTagStmt->execute([
                ':post_id' => $post_id,
                ':tag' => $tag
            ]);
        }
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Job post updated successfully",
        "post_id" => $post_id
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>