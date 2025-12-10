<?php
// remote_receiver.php
// Setup headers for CORS if needed, though usually strict for uploads
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$response = array();
$upload_dir = 'uploads/';

// Create upload directory if it doesn't exist
if (!file_exists($upload_dir)) {
    if (!mkdir($upload_dir, 0777, true)) {
        $response['status'] = 'error';
        $response['message'] = 'Failed to create upload directory.';
        echo json_encode($response);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['uploaded_file'])) {
        $file = $_FILES['uploaded_file'];
        
        // 1. Validate Image Type
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

        $original_filename = $file['name'];
        // Sanitize filename
        $original_filename = preg_replace("/[^a-zA-Z0-9\._-]/", "", $original_filename);
        $target_path = $upload_dir . basename($original_filename);
        
        // Detailed error checking
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $response['status'] = 'error';
            $response['message'] = 'Upload error code: ' . $file['error'];
        } else {
            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $response['status'] = 'success';
                $response['message'] = 'Image uploaded successfully.';
                // Return the public URL
                $response['file_url'] = 'http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/' . $target_path;
                $response['file_path'] = $target_path;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to move uploaded file.';
            }
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No file received. Key "uploaded_file" missing.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
