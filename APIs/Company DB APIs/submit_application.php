<?php
// submit_application.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Include database connection
include 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Validate required POST data
    if (!isset($_POST['post_id']) || !isset($_POST['student_id']) || !isset($_POST['document_type'])) {
        $response['status'] = 'error';
        $response['message'] = 'Missing required fields: post_id, student_id, or document_type.';
        echo json_encode($response);
        exit();
    }
    
    $post_id = trim($_POST['post_id']);
    $student_id = trim($_POST['student_id']);
    $document_type = trim($_POST['document_type']);
    
    // Basic validation to prevent SQL injection and path traversal
    if (!is_numeric($post_id) || !is_numeric($student_id)) {
        $response['status'] = 'error';
        $response['message'] = 'Invalid post_id or student_id. Must be numeric.';
        echo json_encode($response);
        exit();
    }
    
    try {
        // Get the company_id associated with this post_id
        $company_query = $conn->prepare("SELECT company_id FROM Job_Posts WHERE post_id = :post_id");
        $company_query->execute([':post_id' => $post_id]);
        
        if ($company_query->rowCount() === 0) {
            $response['status'] = 'error';
            $response['message'] = 'Job post not found.';
            echo json_encode($response);
            exit();
        }
        
        $company_data = $company_query->fetch(PDO::FETCH_ASSOC);
        $company_id = $company_data['company_id'];
        
        // Check if student has already applied for this position
        $check_query = $conn->prepare("SELECT applicant_id FROM Applicants WHERE post_id = :post_id AND student_id = :student_id");
        $check_query->execute([
            ':post_id' => $post_id,
            ':student_id' => $student_id
        ]);
        
        if ($check_query->rowCount() > 0) {
            $response['status'] = 'error';
            $response['message'] = 'You have already applied for this position.';
            echo json_encode($response);
            exit();
        }
        
        // Define target directory structure
        // Job_Posts/<company_id>/<post_id>/Applicants/<student_id>/
        $base_dir = __DIR__ . "/Job_Posts/";
        $company_dir = $base_dir . $company_id . "/";
        $post_dir = $company_dir . $post_id . "/";
        $applicants_dir = $post_dir . "Applicants/";
        $target_dir = $applicants_dir . $student_id . "/";
        
        // Create directories if they don't exist
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                $error = error_get_last();
                $response['status'] = 'error';
                $response['message'] = 'Failed to create directory structure. Error: ' . ($error['message'] ?? 'Unknown');
                $response['debug_path'] = $target_dir;
                echo json_encode($response);
                exit();
            }
        }
        
        // Initialize file paths
        $resume_path = null;
        $coverletter_path = null;
        
        // Allowed file types for documents
        $allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        // Process Resume Upload (REQUIRED)
        if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
            $resume = $_FILES['resume'];
            
            // Validate file type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime_type = finfo_file($finfo, $resume['tmp_name']);
            finfo_close($finfo);
            
            if (!in_array($mime_type, $allowed_types)) {
                $response['status'] = 'error';
                $response['message'] = 'Invalid resume file type. Only PDF and DOC/DOCX files are allowed.';
                echo json_encode($response);
                exit();
            }
            
            // Validate file size (10MB max)
            if ($resume['size'] > 10 * 1024 * 1024) {
                $response['status'] = 'error';
                $response['message'] = 'Resume file size exceeds 10MB limit.';
                echo json_encode($response);
                exit();
            }
            
            // Generate filename
            $resume_extension = pathinfo($resume['name'], PATHINFO_EXTENSION);
            $resume_filename = "resume_" . time() . "." . $resume_extension;
            $resume_target_path = $target_dir . $resume_filename;
            
            // Move uploaded file
            if (!move_uploaded_file($resume['tmp_name'], $resume_target_path)) {
                $response['status'] = 'error';
                $response['message'] = 'Failed to upload resume file.';
                echo json_encode($response);
                exit();
            }
            
            // Construct absolute VPS path for database
            $vps_base_path = '/var/www/html/Hirenorian/API/companyDB_APIs/';
            $resume_relative_path = 'Job_Posts/' . $company_id . '/' . $post_id . '/Applicants/' . $student_id . '/' . $resume_filename;
            $resume_encoded_path = str_replace(' ', '%20', $resume_relative_path);
            $resume_path = $vps_base_path . $resume_encoded_path;
        } else {
            // Resume is required
            $response['status'] = 'error';
            $response['message'] = 'Resume file is required.';
            echo json_encode($response);
            exit();
        }
        
        // Process Cover Letter Upload (OPTIONAL)
        if (isset($_FILES['cover_letter']) && $_FILES['cover_letter']['error'] === UPLOAD_ERR_OK) {
            $cover_letter = $_FILES['cover_letter'];
            
            // Validate file type
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime_type = finfo_file($finfo, $cover_letter['tmp_name']);
            finfo_close($finfo);
            
            if (!in_array($mime_type, $allowed_types)) {
                $response['status'] = 'error';
                $response['message'] = 'Invalid cover letter file type. Only PDF and DOC/DOCX files are allowed.';
                echo json_encode($response);
                exit();
            }
            
            // Validate file size (10MB max)
            if ($cover_letter['size'] > 10 * 1024 * 1024) {
                $response['status'] = 'error';
                $response['message'] = 'Cover letter file size exceeds 10MB limit.';
                echo json_encode($response);
                exit();
            }
            
            // Generate filename
            $cl_extension = pathinfo($cover_letter['name'], PATHINFO_EXTENSION);
            $cl_filename = "cover_letter_" . time() . "." . $cl_extension;
            $cl_target_path = $target_dir . $cl_filename;
            
            // Move uploaded file
            if (!move_uploaded_file($cover_letter['tmp_name'], $cl_target_path)) {
                $response['status'] = 'error';
                $response['message'] = 'Failed to upload cover letter file.';
                echo json_encode($response);
                exit();
            }
            
            // Construct absolute VPS path for database
            $vps_base_path = '/var/www/html/Hirenorian/API/companyDB_APIs/';
            $cl_relative_path = 'Job_Posts/' . $company_id . '/' . $post_id . '/Applicants/' . $student_id . '/' . $cl_filename;
            $cl_encoded_path = str_replace(' ', '%20', $cl_relative_path);
            $coverletter_path = $vps_base_path . $cl_encoded_path;
        }
        
        // Insert application into database
        $insert_query = $conn->prepare("
            INSERT INTO Applicants (post_id, student_id, document_type, resume_path, coverletter_path, status) 
            VALUES (:post_id, :student_id, :document_type, :resume_path, :coverletter_path, 'Pending')
        ");
        
        $insert_query->execute([
            ':post_id' => $post_id,
            ':student_id' => $student_id,
            ':document_type' => $document_type,
            ':resume_path' => $resume_path,
            ':coverletter_path' => $coverletter_path
        ]);
        
        $applicant_id = $conn->lastInsertId();
        
        $response['status'] = 'success';
        $response['message'] = 'Application submitted successfully.';
        $response['data'] = [
            'applicant_id' => $applicant_id,
            'post_id' => $post_id,
            'student_id' => $student_id,
            'resume_path' => $resume_path,
            'coverletter_path' => $coverletter_path,
            'status' => 'Pending'
        ];
        
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
