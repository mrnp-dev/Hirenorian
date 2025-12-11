<?php
// update_profile_picture.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Check if file and student_id are present
    if (isset($_FILES['uploaded_file']) && isset($_POST['student_id'])) {
        
        $file = $_FILES['uploaded_file'];
        $student_id = trim($_POST['student_id']);
        
        // Basic validation for student_id to prevent path traversal
        if (empty($student_id) || preg_match('/[^a-zA-Z0-9_-]/', $student_id)) {
            $response['status'] = 'error';
            $response['message'] = 'Invalid Student ID.';
            echo json_encode($response);
            exit();
        }

        // Validate Image Type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime_type, $allowed_types)) {
            $response['status'] = 'error';
            $response['message'] = 'Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed.';
            echo json_encode($response);
            exit;
        }

        // Define target directory
        // studentDB_APIs/Student Accounts/<student_id>/Images/
        $base_dir = __DIR__ . "/Student Accounts/";
        $student_dir = $base_dir . $student_id . "/";
        $target_dir = $student_dir . "Images/";

        // Create directories if they don't exist
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                $error = error_get_last();
                $response['status'] = 'error';
                $response['message'] = 'Failed to create directory structure. Error: ' . ($error['message'] ?? 'Unknown');
                // Debug info
                $response['debug_path'] = $target_dir;
                echo json_encode($response);
                exit;
            }
        }

        // Generate a unique filename to avoid caching issues or overwrites?
        // Or keep original name? User didn't specify. Let's use timestamp + sanitized original name.
        $original_filename = $file['name'];
        $extension = pathinfo($original_filename, PATHINFO_EXTENSION);
        $new_filename = "profile_pic_" . time() . "." . $extension;
        $target_path = $target_dir . $new_filename;

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $response['status'] = 'error';
            $response['message'] = 'Upload error code: ' . $file['error'];
        } else {
            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $response['status'] = 'success';
                $response['message'] = 'Profile picture updated successfully.';
                // Return the public URL. Assuming standard path structure on VPS.
                $response['data'] = [
                     // Construct URL based on where this script is accessed from
                     // If script is at http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/update_profile_picture.php
                     // Then image is at http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/Student Accounts/...
                    'image_url' => 'http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/' . $target_path
                ];
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to move uploaded file.';
            }
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Missing file or student ID.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
