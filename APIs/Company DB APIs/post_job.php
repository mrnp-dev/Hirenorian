<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit();
}

// Extract company email
$company_email = $data['company_email'] ?? '';

if (empty($company_email)) {
    echo json_encode(["status" => "error", "message" => "Missing company email"]);
    exit();
}

// 1. Get Company ID
$query = "SELECT company_id FROM Company WHERE email = :company_email";
$stmt = $conn->prepare($query);
$stmt->execute([':company_email' => $company_email]);
$companyRow = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$companyRow) {
    echo json_encode(["status" => "error", "message" => "Company not found"]);
    exit();
}

$company_id = $companyRow['company_id'];

// Extract Job Data
$jobTitle = $data['jobTitle'] ?? '';
$location = $data['location'] ?? '';
$workType = $data['workType'] ?? '';
$applicantLimit = $data['applicantLimit'] ?? 0;
$category = $data['category'] ?? '';
$requiredDocument = $data['requiredDocument'] ?? 'resume';
$description = $data['jobDescription'] ?? '';
$responsibilities = $data['responsibilities'] ?? '';
$qualifications = $data['qualifications'] ?? ''; // Note: frontend might send 'qualification'
$skills = $data['skills'] ?? '';
$tags = $data['tags'] ?? []; // Array of strings

// Basic validation
if (empty($jobTitle) || empty($location) || empty($description)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields (Title, Location, Description)"]);
    exit();
}

try {
    $conn->beginTransaction();

    // 2. Insert into Job_Posts
    // status defaults to 'active'
    $postQuery = "INSERT INTO Job_Posts (company_id, status, applicant_limit, created_at, updated_at) 
                  VALUES (:company_id, 'active', :applicant_limit, NOW(), NOW())";

    $postStmt = $conn->prepare($postQuery);
    $postStmt->execute([
        ':company_id' => $company_id,
        ':applicant_limit' => $applicantLimit
    ]);

    $post_id = $conn->lastInsertId();

    // 3. Insert into Job_Details
    $detailsQuery = "INSERT INTO Job_Details (post_id, title, description, responsibilities, qualifications, skills, location, work_type, category, required_document)
                     VALUES (:post_id, :title, :description, :responsibilities, :qualifications, :skills, :location, :work_type, :category, :required_document)";

    $detailsStmt = $conn->prepare($detailsQuery);
    $detailsStmt->execute([
        ':post_id' => $post_id,
        ':title' => $jobTitle,
        ':description' => $description,
        ':responsibilities' => $responsibilities,
        ':qualifications' => $qualifications,
        ':skills' => $skills,
        ':location' => $location,
        ':work_type' => $workType,
        ':category' => $category,
        ':required_document' => $requiredDocument
    ]);

    // 4. Insert Job_Tags
    if (!empty($tags)) {
        $tagQuery = "INSERT INTO Job_Tags (post_id, tag) VALUES (:post_id, :tag)";
        $tagStmt = $conn->prepare($tagQuery);

        foreach ($tags as $tag) {
            $tagStmt->execute([
                ':post_id' => $post_id,
                ':tag' => trim($tag)
            ]);
        }
    }

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Job posted successfully",
        "post_id" => $post_id
    ]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => "Failed to create job post: " . $e->getMessage()
    ]);
}
