<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $company_id = isset($_POST['company_id']) ? trim($_POST['company_id']) : '';

    if (empty($company_id) || !is_numeric($company_id)) {
        echo json_encode(["status" => "error", "message" => "Invalid Company ID."]);
        exit;
    }

    // Base Directory: /var/www/html/Hirenorian/API/companyDB_APIs/Company_Documents/
    $base_dir = "/var/www/html/Hirenorian/API/companyDB_APIs/Company_Documents/";

    // Fallback for local
    if (strpos(php_uname(), 'Windows') !== false) {
        $base_dir = __DIR__ . "/Company_Documents/";
    }

    // Ensure Base Directory
    if (!file_exists($base_dir)) {
        if (!mkdir($base_dir, 0777, true)) {
            echo json_encode(["status" => "error", "message" => "Failed to create base directory."]);
            exit;
        }
    }

    // Ensure Company Directory: .../Company_Documents/{ID}/
    $company_root_dir = $base_dir . $company_id . "/";
    if (!file_exists($company_root_dir)) {
        if (!mkdir($company_root_dir, 0777, true)) {
            echo json_encode(["status" => "error", "message" => "Failed to create company directory."]);
            exit;
        }
    }

    // Map fields to folders
    $doc_types = [
        'docPhilJobNet' => 'PhilJobNet',
        'docDole' => 'DOLE',
        'docBir' => 'BIR',
        'docMayor' => 'MayorPermit'
    ];

    // Database Columns map
    $db_map = [
        'docPhilJobNet' => 'philjobnet_path',
        'docDole' => 'dole_path',
        'docBir' => 'bir_path',
        'docMayor' => 'mayor_permit_path'
    ];

    $paths_to_update = [];

    foreach ($doc_types as $input_name => $folder_name) {
        if (isset($_FILES[$input_name]) && $_FILES[$input_name]['error'] === UPLOAD_ERR_OK) {

            $file = $_FILES[$input_name];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

            // Limit file size (Backend check) - 5MB
            if ($file['size'] > 5 * 1024 * 1024) {
                $response['errors'][] = "$folder_name file too large (Max 5MB).";
                continue;
            }

            // Subfolder: .../Company_Documents/{ID}/{Type}/
            $target_dir = $company_root_dir . $folder_name . "/";

            // CLEANUP: If folder exists, delete its contents (to ensure only 1 latest file per type)
            if (file_exists($target_dir)) {
                $files = glob($target_dir . '*'); // get all files
                foreach ($files as $f) {
                    if (is_file($f)) {
                        unlink($f);
                    }
                }
            } else {
                mkdir($target_dir, 0777, true);
            }

            // Naming Convention: Use original filename
            $new_filename = basename($file['name']);
            $target_path = $target_dir . $new_filename;

            // URL Logic
            // URL: http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/Company_Documents/{ID}/{Folder}/{Filename}
            $db_path = "http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/Company_Documents/" . $company_id . "/" . $folder_name . "/" . $new_filename;

            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                $db_col = $db_map[$input_name];
                $paths_to_update[$db_col] = $db_path;
            } else {
                $response['errors'][] = "Failed to upload $folder_name.";
            }
        }
    }

    // Database Update
    if (!empty($paths_to_update)) {
        try {
            // Check if record exists
            $check = $conn->prepare("SELECT doc_id FROM Company_Documents WHERE company_id = :id");
            $check->execute([':id' => $company_id]);

            if ($check->rowCount() > 0) {
                // Update
                $set_parts = [];
                $params = [':id' => $company_id];
                foreach ($paths_to_update as $col => $val) {
                    $set_parts[] = "$col = :$col";
                    $params[":$col"] = $val;
                }

                $sql = "UPDATE Company_Documents SET " . implode(", ", $set_parts) . ", updated_at = NOW() WHERE company_id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->execute($params);

            } else {
                // Insert
                $cols = ['company_id'];
                $vals = [':id'];
                $params = [':id' => $company_id];

                foreach ($paths_to_update as $col => $val) {
                    $cols[] = $col;
                    $vals[] = ":$col";
                    $params[":$col"] = $val;
                }

                $sql = "INSERT INTO Company_Documents (" . implode(", ", $cols) . ") VALUES (" . implode(", ", $vals) . ")";
                $stmt = $conn->prepare($sql);
                $stmt->execute($params);
            }

            $response['status'] = 'success';
            $response['message'] = 'Documents uploaded successfully.';
            $response['debug'] = $paths_to_update;

        } catch (PDOException $e) {
            $response['status'] = 'error';
            $response['message'] = 'Database error: ' . $e->getMessage();
        }
    } else {
        if (empty($response['errors'])) {
            $response['status'] = 'warning';
            $response['message'] = 'No valid files selected or files validation failed.';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Upload failed for some files.';
            $response['details'] = $response['errors'];
        }
    }

} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>