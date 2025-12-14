<?php
// fetch_audit_logs.php
// API to fetch student audit logs from StudentProfileAuditLog table
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    if ($data === null) {
        $response['status'] = 'error';
        $response['message'] = 'Invalid JSON';
        echo json_encode($response);
        exit();
    }
    
    $student_id = $data['student_id'] ?? null;
    $limit = $data['limit'] ?? 50; // Default to 50 most recent logs
    
    if (empty($student_id)) {
        $response['status'] = 'error';
        $response['message'] = 'Student ID is required';
        echo json_encode($response);
        exit();
    }
    
    try {
        // Fetch audit logs for the student
        $query = $conn->prepare("
            SELECT 
                log_id,
                student_id,
                action_type,
                table_affected,
                record_id,
                field_name,
                old_value,
                new_value,
                action_timestamp,
                ip_address,
                user_agent
            FROM StudentProfileAuditLog
            WHERE student_id = :student_id
            ORDER BY action_timestamp DESC
            LIMIT :limit
        ");
        
        $query->bindValue(':student_id', $student_id, PDO::PARAM_INT);
        $query->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $query->execute();
        
        $logs = $query->fetchAll(PDO::FETCH_ASSOC);
        
        $response['status'] = 'success';
        $response['message'] = 'Audit logs retrieved successfully';
        $response['data'] = $logs;
        $response['count'] = count($logs);
        
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Database error: ' . $e->getMessage();
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method';
}

echo json_encode($response);
?>
