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

// Helper function to recursively delete a directory
function deleteDirectory($dir)
{
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }

    return rmdir($dir);
}

try {
    if (is_dir($targetDirPath)) {
        if (deleteDirectory($targetDirPath)) {
            echo json_encode([
                "status" => "success",
                "message" => "Folder deleted successfully"
            ]);
        } else {
            throw new Exception("Failed to delete folder");
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Folder not found"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>