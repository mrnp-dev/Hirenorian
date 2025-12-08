<?php
// client_sender.php

$message = "";

if (isset($_POST['submit'])) {
    if (isset($_FILES['local_file']) && $_FILES['local_file']['error'] === UPLOAD_ERR_OK) {
        
        // 1. Prepare the file for cURL
        $filePath = $_FILES['local_file']['tmp_name'];
        $fileName = $_FILES['local_file']['name'];
        $fileType = $_FILES['local_file']['type'];
        
        // Create a CURLFile object
        $cFile = new CURLFile($filePath, $fileType, $fileName);
        
        // 2. Data to send
        // Key MUST match the one expected in remote_receiver.php ('uploaded_file')
        $postData = array(
            'uploaded_file' => $cFile,
            'description' => 'Test file upload from local client'
        );
        
        // 3. Initialize cURL
        // URL pointing to where the receiver will be on the VPS
        // Update this URL once you deploy remote_receiver.php to the VPS
        $targetUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/remote_receiver.php"; 
        
        // FOR LOCAL TESTING ONLY - Uncomment below to test locally before deploying
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
            $message = "Server Response (Status $httpCode): " . $response;
        }
        
        curl_close($ch);
        
    } else {
        $message = "Please select a valid file to upload.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Upload Prototype</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        .response { margin-top: 20px; padding: 10px; background: #f0f0f0; border-left: 4px solid #333; word-wrap: break-word; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>

<div class="container">
    <h2>Upload File to VPS Proxy</h2>
    
    <form action="" method="POST" enctype="multipart/form-data">
        <div class="form-group">
            <label for="file">Select Image:</label>
            <input type="file" name="local_file" id="file" accept="image/*" required>
        </div>
        
        <button type="submit" name="submit">Upload Image</button>
    </form>

    <?php if ($message): ?>
        <div class="response">
            <strong>Debug Output:</strong><br>
            <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
