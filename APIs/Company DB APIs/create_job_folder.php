<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-type: application/json");

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null || !isset($data['company_id']) || !isset($data['post_id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing company_id/post_id"]);
    exit();
}

$company_id = intval($data['company_id']);
$post_id = intval($data['post_id']);

// Define the target directory path
// Structure: Job_Posts/companyId/companyId_postId
$baseDir = __DIR__ . '/Job_Posts';
$companyDir = $baseDir . '/' . $company_id;
$targetDirName = $post_id;
$targetDirPath = $companyDir . '/' . $targetDirName;

try {
    // Ensure base directory exists
    if (!is_dir($baseDir)) {
        if (!mkdir($baseDir, 0777, true)) {
            throw new Exception("Failed to create base directory: " . $baseDir);
        }
    }

    // Ensure company directory exists
    if (!is_dir($companyDir)) {
        if (!mkdir($companyDir, 0777, true)) {
            throw new Exception("Failed to create company directory: " . $companyDir);
        }
    }

    // Check if target directory exists
    if (!is_dir($targetDirPath)) {
        if (!mkdir($targetDirPath, 0777, true)) {
            throw new Exception("Failed to create directory: " . $targetDirPath);
        }
        $message = "Folder created successfully";
    } else {
        $message = "Folder already exists";
    }

    echo json_encode([
        "status" => "success",
        "message" => $message,
        "path" => $targetDirPath // Useful for debug, maybe remove in prod
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>