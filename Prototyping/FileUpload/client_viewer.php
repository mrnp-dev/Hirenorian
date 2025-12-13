<?php
// client_viewer.php

$imageContent = null;
$contentType = null;
$error = null;

if (isset($_GET['filename'])) {
    $filename = basename($_GET['filename']); // Simple sanitization
    // URL to the image on the VPS
    // Ensure this matches where remote_receiver.php saves files
    $remoteUrl = "http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/uploads/" . $filename;

    // Initialize cURL to fetch the image
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $remoteUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Include headers to check for 404s etc
    curl_setopt($ch, CURLOPT_HEADER, false); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    $imageContent = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    
    if (curl_errno($ch)) {
        $error = 'Curl error: ' . curl_error($ch);
    } elseif ($httpCode !== 200) {
        $error = "Failed to fetch image. Server returned status: $httpCode";
        $imageContent = null; // Discard error page content
    }
    
    curl_close($ch);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Remote Image Viewer</title>
    <style>
        body { font-family: sans-serif; padding: 20px; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; }
        form { margin-bottom: 20px; }
        input[type="text"] { padding: 10px; width: 300px; }
        button { padding: 10px 20px; background: #28a745; color: white; border: none; cursor: pointer; }
        .image-container { margin-top: 20px; border: 1px solid #ddd; padding: 10px; display: inline-block; }
        img { max-width: 100%; height: auto; }
        .error { color: red; margin-top: 20px; }
    </style>
</head>
<body>

<div class="container">
    <h2>Fetch & Display Image from VPS</h2>
    
    <form action="" method="GET">
        <input type="text" name="filename" placeholder="Enter filename (e.g., image.jpg)" required value="<?php echo isset($_GET['filename']) ? htmlspecialchars($_GET['filename']) : ''; ?>">
        <button type="submit">Fetch Image</button>
    </form>

    <?php if ($error): ?>
        <div class="error"><strong>Error:</strong> <?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <?php if ($imageContent && $contentType): ?>
        <div class="image-container">
            <h3>Displaying: <?php echo htmlspecialchars($filename); ?></h3>
            <!-- Embedding directly using base64 to simulate 'fetching and displaying' without just hotlinking -->
            <img src="data:<?php echo $contentType; ?>;base64,<?php echo base64_encode($imageContent); ?>" alt="Fetched Remote Image">
        </div>
    <?php endif; ?>
</div>

</body>
</html>
