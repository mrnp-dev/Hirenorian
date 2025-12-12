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

if ($data === null || !isset($data['company_email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing company_email"]);
    exit();
}

$company_email = $data['company_email'];

// Get company_id
$query = "SELECT company_id FROM Company WHERE email = :company_email";
$stmt = $conn->prepare($query);
$stmt->execute([':company_email' => $company_email]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(["status" => "error", "message" => "Company not found"]);
    exit();
}

$company_id = $row["company_id"];

// Fetch job posts with details and applicant counts
$query = "
    SELECT
        jp.post_id AS id,
        jd.title,
        CONCAT(jd.province, ', ', jd.city) AS location,
        DATE_FORMAT(jp.created_at, '%M %d, %Y') AS datePosted,
        jp.status,
        jp.applicant_limit AS applicantLimit,
        COUNT(a.applicant_id) AS currentApplicants,
        jd.description AS jobDescription,
        (SELECT icon_url FROM company_icons WHERE company_id = jp.company_id ORDER BY uploaded_at DESC LIMIT 1) AS companyIcon
    FROM Job_Posts jp
    JOIN Job_Details jd ON jp.post_id = jd.post_id
        LEFT JOIN Applicants a ON jp.post_id = a.post_id
    WHERE jp.company_id = :company_id
    GROUP BY jp.post_id
    ORDER BY jp.created_at DESC
";

try {
    $stmt = $conn->prepare($query);
    $stmt->execute([':company_id' => $company_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process results to fix image URLs
    $results = array_map(function ($row) {
        if (!empty($row['companyIcon'])) {
            $row['companyIcon'] = str_replace('/var/www/html', 'http://mrnp.site:8080', $row['companyIcon']);
        }
        return $row;
    }, $results);

    // Return JSON response
    echo json_encode([
        "status" => "success",
        "company_id" => $company_id,
        "data" => $results
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>