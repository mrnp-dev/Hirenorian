<?php
// fetch_student_applications.php
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
        // Fetch application history with job details
        $query = $conn->prepare("
            SELECT 
                a.applicant_id,
                a.post_id,
                a.status,
                a.date_applied,
                a.document_type,
                jd.title AS job_title,
                jd.city,
                jd.province,
                jd.work_type,
                jd.category,
                c.company_name,
                (SELECT icon_url FROM company_icons 
                 WHERE company_id = c.company_id 
                 ORDER BY uploaded_at DESC LIMIT 1) AS company_icon
            FROM Applicants a
            JOIN Job_Posts jp ON a.post_id = jp.post_id
            JOIN Job_Details jd ON jp.post_id = jd.post_id
            JOIN Company c ON jp.company_id = c.company_id
            WHERE a.student_id = :student_id
            ORDER BY a.date_applied DESC
        ");
        
        $query->execute([':student_id' => $student_id]);
        
        $applications = $query->fetchAll(PDO::FETCH_ASSOC);
        
        // Process each application
        foreach ($applications as &$app) {
            // Format date
            $date = new DateTime($app['date_applied']);
            $app['date_applied_formatted'] = $date->format('M d, Y');
            
            // Construct location
            $location_parts = array_filter([
                $app['city'],
                $app['province']
            ]);
            $app['location'] = !empty($location_parts) ? implode(', ', $location_parts) : 'Location TBD';
            
            // Convert company icon path
            if (!empty($app['company_icon'])) {
                $app['company_icon'] = str_replace('/var/www/html', 'http://mrnp.site:8080', $app['company_icon']);
            } else {
                $app['company_icon'] = 'https://via.placeholder.com/80?text=Company';
            }
            
            // Add status badge class for frontend styling
            $status_map = [
                'Pending' => 'pending',
                'Accepted' => 'accepted',
                'Rejected' => 'rejected'
            ];
            $app['status_class'] = $status_map[$app['status']] ?? 'pending';
        }
        
        $response['status'] = 'success';
        $response['message'] = 'Application history retrieved successfully.';
        $response['count'] = count($applications);
        $response['data'] = $applications;
        
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
