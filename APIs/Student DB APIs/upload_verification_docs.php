<?php
ob_start(); // Start buffering to catch any included noise
// upload_verification_docs.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

include 'db_con.php';

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST['student_id'], $_POST['student_type'])) {
        
        $student_id = trim($_POST['student_id']);
        $student_type = trim($_POST['student_type']); // 'graduate' or 'undergraduate'
        
        // Validation
        if (empty($student_id) || preg_match('/[^a-zA-Z0-9_-]/', $student_id)) {
            $response['status'] = 'error';
            $response['message'] = 'Invalid Student ID.';
            echo json_encode($response);
            exit();
        }

        $base_upload_dir = __DIR__ . "/Student Accounts/" . $student_id . "/Verification/";
        $db_paths = array(); // Store paths to update DB
        $upload_errors = array();

        // Map form field names to database column names and folder names
        // Field Name => [DB Column, Folder Name]
        $expected_files = [
            'tor_file' => ['tor_file', 'TOR'],
            'diploma_file' => ['diploma_file', 'Diploma'],
            'student_id_file' => ['student_id_file', 'StudentID'],
            'cor_file' => ['cor_file', 'COR']
        ];

        // Process each expected file
        foreach ($expected_files as $field_name => $config) {
            if (isset($_FILES[$field_name]) && $_FILES[$field_name]['error'] === UPLOAD_ERR_OK) {
                
                $file = $_FILES[$field_name];
                $db_col = $config[0];
                $folder_name = $config[1];
                
                // Validate Type (Images + PDF)
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime_type = finfo_file($finfo, $file['tmp_name']);
                finfo_close($finfo);

                if (!in_array($mime_type, $allowed_types)) {
                    $upload_errors[] = "Invalid file type for $field_name. Allowed: Images, PDF.";
                    continue;
                }

                // Create Target Directory
                $target_dir = $base_upload_dir . $folder_name . "/";
                if (!file_exists($target_dir)) {
                    if (!mkdir($target_dir, 0777, true)) {
                        $upload_errors[] = "Failed to create directory for $folder_name.";
                        continue;
                    }
                }

                // Generate Filename
                $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                $new_filename = $folder_name . "_" . time() . "." . $extension;
                $target_path = $target_dir . $new_filename;

                // Move File
                if (move_uploaded_file($file['tmp_name'], $target_path)) {
                     // Construct URL Path for DB
                    $url_base_path = 'http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/';
                    $relative_path = 'Student Accounts/' . $student_id . '/Verification/' . $folder_name . '/' . $new_filename;
                    
                    // Store the full HTTP URL in the database
                    $db_paths[$db_col] = $url_base_path . str_replace(' ', '%20', $relative_path);

                } else {
                    $upload_errors[] = "Failed to move file for $field_name.";
                }
            }
        }

        if (empty($db_paths)) {
             $response['status'] = 'error';
             $response['message'] = 'No files were successfully uploaded. ' . implode(" ", $upload_errors);
             echo json_encode($response);
             exit();
        }

        // Database Update/Insert
        try {
            // Check if request exists
            $check_sql = "SELECT request_id FROM StudentVerificationRequests WHERE student_id = :student_id";
            $stmt = $conn->prepare($check_sql);
            $stmt->execute([':student_id' => $student_id]);
            
            if ($stmt->rowCount() > 0) {
                // Update
                $sql = "UPDATE StudentVerificationRequests SET student_type = :student_type, status = 'Pending', updated_at = NOW()";
                foreach ($db_paths as $col => $path) {
                    $sql .= ", $col = :$col";
                }
                $sql .= " WHERE student_id = :student_id";
                
                $params = array_merge([':student_type' => $student_type, ':student_id' => $student_id], $db_paths);
                $stmt = $conn->prepare($sql);
                $stmt->execute($params);

            } else {
                // Insert
                $cols = "student_id, student_type, status";
                $vals = ":student_id, :student_type, 'Pending'";
                $params = [':student_id' => $student_id, ':student_type' => $student_type];

                foreach ($db_paths as $col => $path) {
                    $cols .= ", $col";
                    $vals .= ", :$col";
                    $params[":$col"] = $path;
                }

                $sql = "INSERT INTO StudentVerificationRequests ($cols) VALUES ($vals)";
                $stmt = $conn->prepare($sql);
                $stmt->execute($params);
            }

            // Update Students table verified_status to 'processing'
            $update_student_sql = "UPDATE Students SET verified_status = 'processing' WHERE student_id = :student_id";
            $stmt_student = $conn->prepare($update_student_sql);
            $stmt_student->execute([':student_id' => $student_id]);

            $response['status'] = 'success';
            $response['message'] = 'Verification documents uploaded successfully.';
            if (!empty($upload_errors)) {
                $response['warnings'] = $upload_errors;
            }

        } catch (PDOException $e) {
            $response['status'] = 'error';
            $response['message'] = 'Database error: ' . $e->getMessage();
        }

    } else {
        $response['status'] = 'error';
        $response['message'] = 'Missing required fields (student_id, student_type).';
    }

} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

ob_end_clean(); // Clean any previous output (warnings, whitespace)
echo json_encode($response);
exit();
