<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
include "db_con.php";

// Get POST data
$response = file_get_contents("php://input");
$data = json_decode($response, true);

// Validate input
if (!isset($data['company_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Company ID is required"
    ]);
    exit;
}

$company_id = intval($data['company_id']);
$limit = isset($data['limit']) ? intval($data['limit']) : 20;
$offset = isset($data['offset']) ? intval($data['offset']) : 0;

try {
    // Check if table exists first
    $tableCheck = $conn->query("SHOW TABLES LIKE 'company_activity_log'");
    if ($tableCheck->rowCount() == 0) {
        echo json_encode([
            "status" => "success",
            "activities" => [],
            "total_count" => 0,
            "limit" => $limit,
            "offset" => $offset,
            "message" => "Activity log table not yet created. Please run the SQL migration first."
        ]);
        exit;
    }

    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM company_activity_log WHERE company_id = :company_id";
    $countStmt = $conn->prepare($countSql);
    $countStmt->execute([':company_id' => $company_id]);
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get activity log entries
    $sql = "SELECT 
                log_id,
                action_type,
                table_affected,
                record_id,
                field_name,
                old_value,
                new_value,
                action_description,
                action_timestamp,
                ip_address
            FROM company_activity_log 
            WHERE company_id = :company_id
            ORDER BY action_timestamp DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':company_id', $company_id, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $activities = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $activities[] = [
            'log_id' => $row['log_id'],
            'action_type' => $row['action_type'],
            'table_affected' => $row['table_affected'],
            'record_id' => $row['record_id'],
            'field_name' => $row['field_name'],
            'old_value' => $row['old_value'],
            'new_value' => $row['new_value'],
            'action_description' => $row['action_description'],
            'action_timestamp' => $row['action_timestamp'],
            'ip_address' => $row['ip_address']
        ];
    }

    echo json_encode([
        "status" => "success",
        "activities" => $activities,
        "total_count" => (int) $totalCount,
        "limit" => $limit,
        "offset" => $offset
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch activity log: " . $e->getMessage()
    ]);
}
?>