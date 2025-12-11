<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_FILES['uploaded_file']) && isset($_POST['company_id']) && isset($_POST['image_type'])) {

        $file = $_FILES['uploaded_file'];
        $company_id = trim($_POST['company_id']);
        $image_type = trim($_POST['image_type']); // 'icon' or 'banner'

        if (empty($company_id) || !is_numeric($company_id)) {
            $response['status'] = 'error';
            $response['message'] = 'Invalid Company ID.';
            echo json_encode($response);
            exit();
        }

        if ($image_type !== 'icon' && $image_type !== 'banner') {
            $response['status'] = 'error';
            $response['message'] = 'Invalid Image Type. Must be icon or banner.';
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

        // Define Base Directory
        // Structure: /var/www/html/Hirenorian/API/companyDB_APIs/Company_Images/
        // Subfolders: company_icons/ or company_banners/
        $base_dir = __DIR__ . "/Company_Images/";

        $subfolder = ($image_type === 'icon') ? "company_icons/" : "company_banners/";
        $target_dir = $base_dir . $subfolder;

        // Create directory if not exists
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                $error = error_get_last();
                $response['status'] = 'error';
                $response['message'] = 'Failed to create directory: ' . $target_dir . '. Reason: ' . ($error['message'] ?? 'Unknown');
                echo json_encode($response);
                exit;
            }
        }

        // Generate Filename: {company_id}_{type}.{ext}
        $original_filename = $file['name'];
        $extension = pathinfo($original_filename, PATHINFO_EXTENSION);
        $new_filename = $company_id . "_" . $image_type . "." . $extension;
        $target_path = $target_dir . $new_filename;

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $response['status'] = 'error';
            $response['message'] = 'Upload error code: ' . $file['error'];
        } else {
            if (move_uploaded_file($file['tmp_name'], $target_path)) {

                // Construct URL and Path
                $vps_base_path = '/var/www/html/Hirenorian/API/companyDB_APIs/Company_Images/' . $subfolder;
                $absolute_vps_path = $vps_base_path . $new_filename;

                // URL for frontend
                $base_url = 'http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/Company_Images/' . $subfolder;
                $image_url = $base_url . $new_filename;

                try {
                    // Update Database (Upsert Logic)
                    if ($image_type === 'icon') {
                        // Check exist
                        $check = $conn->prepare("SELECT icon_id FROM company_icons WHERE company_id = :id");
                        $check->execute([':id' => $company_id]);
                        if ($check->rowCount() > 0) {
                            $stmt = $conn->prepare("UPDATE company_icons SET icon_url = :url, uploaded_at = NOW() WHERE company_id = :id");
                        } else {
                            $stmt = $conn->prepare("INSERT INTO company_icons (company_id, icon_url) VALUES (:id, :url)");
                        }
                    } else { // banner
                        $check = $conn->prepare("SELECT banner_id FROM company_banners WHERE company_id = :id");
                        $check->execute([':id' => $company_id]);
                        if ($check->rowCount() > 0) {
                            $stmt = $conn->prepare("UPDATE company_banners SET banner_url = :url, uploaded_at = NOW() WHERE company_id = :id");
                        } else {
                            $stmt = $conn->prepare("INSERT INTO company_banners (company_id, banner_url) VALUES (:id, :url)");
                        }
                    }

                    $stmt->execute([':id' => $company_id, ':url' => $absolute_vps_path]);

                    $response['status'] = 'success';
                    $response['message'] = ucfirst($image_type) . ' updated successfully.';
                    $response['data'] = [
                        'image_url' => $image_url,
                        'db_path' => $absolute_vps_path
                    ];

                } catch (PDOException $e) {
                    $response['status'] = 'error';
                    $response['message'] = 'Database error: ' . $e->getMessage();
                }

            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to move uploaded file.';
            }
        }

    } else {
        $response['status'] = 'error';
        $response['message'] = 'Missing parameters.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>