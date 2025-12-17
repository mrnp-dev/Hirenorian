<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include_once 'db_con.php';

$input = json_decode(file_get_contents("php://input"), true);
$company_id = isset($input['company_id']) ? intval($input['company_id']) : 0;

// Resolve company_id if not provided
if ($company_id <= 0) {
    $company_email = $_SESSION['email'] ?? $input['email'] ?? null;
    if ($company_email) {
        try {
            $stmt = $conn->prepare("SELECT company_id FROM Company WHERE email = :email");
            $stmt->execute([':email' => $company_email]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $company_id = intval($row['company_id']);
            }
        } catch (PDOException $e) {
            // Log error silently or return
        }
    }
}

if ($company_id > 0) {
    if (!isset($conn)) {
        echo json_encode(["status" => "error", "message" => "Database connection failed."]);
        exit;
    }

    try {
        $sql = "SELECT philjobnet_path, dole_path, bir_path, mayor_permit_path FROM Company_Documents WHERE company_id = :company_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":company_id", $company_id, PDO::PARAM_INT);
        $stmt->execute();

        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Helper to get basename from path
            $documents = [];
            foreach ($row as $key => $path) {
                if (!empty($path)) {
                    // Extract just the filename for display
                    $documents[$key] = basename($path);
                    // Also return full path if needed for download links later
                    $documents[$key . '_full'] = $path;
                } else {
                    $documents[$key] = null;
                }
            }

            echo json_encode(["status" => "success", "data" => $documents]);
        } else {
            echo json_encode(["status" => "success", "data" => null, "message" => "No documents found."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Company ID is required and could not be resolved from session."]);
}
?>