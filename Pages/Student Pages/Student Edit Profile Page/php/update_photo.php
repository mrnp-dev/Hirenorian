<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

$message = "";
$status = "error";
$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_FILES['local_file']) && $_FILES['local_file']['error'] === UPLOAD_ERR_OK) {
        
        $student_id = isset($_POST['student_id']) ? $_POST['student_id'] : '';

        // 1. Prepare the file for cURL
        $filePath = $_FILES['local_file']['tmp_name'];
        $fileName = $_FILES['local_file']['name'];
        $fileType = $_FILES['local_file']['type'];
        
        // Create a CURLFile object
        $cFile = new CURLFile($filePath, $fileType, $fileName);
        
        // 2. Data to send
        $postData = array(
            'uploaded_file' => $cFile,
            'description' => 'Profile photo update',
            'student_id' => $student_id, // Pass student ID if needed by remote receiver to associate image
            'update_type' => 'profile_picture' // Flag to tell receiver this is a profile pic
        );
        
        // 3. Initialize cURL
        $targetUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/remote_receiver.php"; 
        
        // FOR LOCAL TESTING ONLY
        # $targetUrl = "http://localhost/Web%20Projects/Hirenorian-1/Prototyping/FileUpload/remote_receiver.php";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $targetUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // Execute request
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if ($response === false) {
            $message = "cURL Error: " . curl_error($ch);
        } else {
            // Check if response is JSON
            $decoded = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                 // Forward the remote response
                 $status = isset($decoded['status']) ? $decoded['status'] : 'success'; // Default to success if not specified but valid json? No, be strict.
                 $message = isset($decoded['message']) ? $decoded['message'] : 'Upload completed';
                 if (isset($decoded['file_path'])) {
                     $data['image_url'] = $decoded['file_path'];
                 }
            } else {
                // If not JSON, just treat as text response
                 if ($httpCode == 200) {
                     $status = "success";
                     $message = "Upload successful.";
                     // We might not have the URL here if the remote script doesn't return JSON. 
                     // Ideally remote_receiver should return JSON.
                 } else {
                     $message = "Server Response (Status $httpCode): " . $response;
                 }
            }
        }
        
        curl_close($ch);
        
    } else {
        $message = "Please select a valid file to upload.";
        if (isset($_FILES['local_file']['error'])) {
            $message .= " Error code: " . $_FILES['local_file']['error'];
        }
    }
} else {
    $message = "Invalid request method.";
}

echo json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
?>
