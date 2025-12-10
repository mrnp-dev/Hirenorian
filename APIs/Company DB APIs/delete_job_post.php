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

    // Check if job exists and check status
    // Note: User requirement implies we can only delete if closed? 
    // Usually delete is available for any, but let's stick to the flow: Edit/Close -> Delete
    // The API itself should probably just delete regardless, but let's be safe.

    $checkQuery = "SELECT post_id FROM Job_Posts WHERE post_id = :post_id";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->execute([':post_id' => $post_id]);

    if (!$checkStmt->fetch()) {
        $conn->rollBack();
        echo json_encode(["status" => "error", "message" => "Job post not found"]);
        exit();
    }

    // Delete in order of dependencies (Child -> Parent) although foreign keys usually cascade if set,
    // but explicit delete is safer if cascades aren't reliable.

    // 1. Delete Tags
    $deleteTags = "DELETE FROM Job_Tags WHERE post_id = :post_id";
    $conn->prepare($deleteTags)->execute([':post_id' => $post_id]);

    // 2. Delete Job Details
    $deleteDetails = "DELETE FROM Job_Details WHERE post_id = :post_id";
    $conn->prepare($deleteDetails)->execute([':post_id' => $post_id]);

    // 3. Delete Applicants
    $deleteApplicants = "DELETE FROM Applicants WHERE post_id = :post_id";
    $conn->prepare($deleteApplicants)->execute([':post_id' => $post_id]);

    // 4. Delete Job Post (Master record)
    $deletePost = "DELETE FROM Job_Posts WHERE post_id = :post_id";
    $conn->prepare($deletePost)->execute([':post_id' => $post_id]);

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Job post deleted successfully"
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>