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

if ($data === null || !isset($data['job_id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing job_id"]);
    exit();
}

$job_id = $data['job_id'];

// Fetch job details
$query = "
    SELECT 
        jp.post_id AS jobId,
        jd.title AS jobTitle,
        jd.province,
        jd.city,
        jd.work_type AS workType,
        jp.status, /* Added status field */
        jp.applicant_limit AS applicantLimit,
        COUNT(a.applicant_id) AS currentApplicants,
        jd.category,
        jd.resume,
        jd.cover_letter AS coverLetter,
        jd.description AS jobDescription,
        jd.responsibilities,
        jd.qualifications,
        jd.skills,
        c.company_name AS companyName,
        (SELECT icon_url FROM company_icons WHERE company_id = c.company_id ORDER BY uploaded_at DESC LIMIT 1) AS companyIcon
    FROM Job_Posts jp
    JOIN Job_Details jd ON jp.post_id = jd.post_id
    JOIN Company c ON jp.company_id = c.company_id
    LEFT JOIN Applicants a ON jp.post_id = a.post_id
    WHERE jp.post_id = :job_id
    GROUP BY jp.post_id
";

try {
    $stmt = $conn->prepare($query);
    $stmt->execute([':job_id' => $job_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["status" => "error", "message" => "Job not found"]);
        exit();
    }

    // Fetch tags separately
    $tagQuery = "SELECT tag FROM Job_Tags WHERE post_id = :job_id";
    $tagStmt = $conn->prepare($tagQuery);
    $tagStmt->execute([':job_id' => $job_id]);
    $tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN);

    // DEBUG: Log the raw category value from database
    error_log("🔍 DEBUG [fetch_job_details.php] - Job ID: {$job_id}, Category from DB: '{$row["category"]}', Tags: " . json_encode($tags));

    // Build response
    echo json_encode([
        "status" => "success",
        "data" => [
            "jobId" => $row["jobId"],
            "jobTitle" => $row["jobTitle"],
            "province" => $row["province"],
            "city" => $row["city"],
            "workType" => $row["workType"],
            "status" => $row["status"],
            "applicantLimit" => $row["applicantLimit"],
            "currentApplicants" => $row["currentApplicants"],
            "category" => $row["category"],
            "workTags" => $tags,
            "resume" => (bool) $row["resume"],
            "coverLetter" => (bool) $row["coverLetter"],
            "jobDescription" => $row["jobDescription"],
            "responsibilities" => $row["responsibilities"],
            "qualifications" => $row["qualifications"],
            "skills" => $row["skills"],
            "companyName" => $row["companyName"],
            "companyIcon" => $row["companyIcon"] ? str_replace('/var/www/html', 'http://mrnp.site:8080', $row["companyIcon"]) : "https://via.placeholder.com/80?text=Company"
        ]
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>