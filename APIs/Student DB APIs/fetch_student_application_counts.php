<?php
// fetch_student_application_counts.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Include database connection
include 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate student_id
    if (!isset($input['student_id']) || empty($input['student_id'])) {
        $response['status'] = 'error';
        $response['message'] = 'Missing required field: student_id';
        echo json_encode($response);
        exit();
    }
    
    $student_id = trim($input['student_id']);
    
    // Validate student_id is numeric
    if (!is_numeric($student_id)) {
        $response['status'] = 'error';
        $response['message'] = 'Invalid student_id. Must be numeric.';
        echo json_encode($response);
        exit();
    }
    
    try {
        // Fetch application counts grouped by status
        $query = $conn->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) as accepted,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as under_review,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
            FROM Applicants
            WHERE student_id = :student_id
        ");
        
        $query->execute([':student_id' => $student_id]);
        
        $result = $query->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $response['status'] = 'success';
            $response['message'] = 'Application counts retrieved successfully.';
            $response['data'] = [
                'total' => intval($result['total']),
                'accepted' => intval($result['accepted']),
                'under_review' => intval($result['under_review']),
                'rejected' => intval($result['rejected'])
            ];
        } else {
            // No applications found
            $response['status'] = 'success';
            $response['message'] = 'No applications found for this student.';
            $response['data'] = [
                'total' => 0,
                'accepted' => 0,
                'under_review' => 0,
                'rejected' => 0
            ];
        }
        
    } catch (PDOException $e) {
        $response['status'] = 'error';
        $response['message'] = 'Database error: ' . $e->getMessage();
    }
    
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method. Use POST.';
}

echo json_encode($response);
?>
