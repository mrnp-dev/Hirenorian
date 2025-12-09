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

// Fetch applicants for this job post
$query = "
    SELECT
    a.applicant_id AS id,
    a.post_id AS jobId,
    CONCAT(s.first_name, ' ', COALESCE(s.middle_initial, ''), ' ', s.last_name, ' ', COALESCE(s.suffix, '')) AS name,
    e.course,
    a.document_type AS documentType,
    a.document_url AS documentUrl,
    s.student_email AS studentEmail,
    s.personal_email AS personalEmail,
    s.phone_number AS phone,
    DATE_FORMAT(a.date_applied, '%Y-%m-%d') AS dateApplied,
    a.status
FROM Applicants a
JOIN Students s ON a.student_id = s.student_id
LEFT JOIN Education e ON s.student_id = e.student_id
WHERE a.post_id = :job_id
ORDER BY a.date_applied DESC;

";

$stmt = $conn->prepare($query);
$stmt->execute([':job_id' => $job_id]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
// Transform into expected JSON structure
$applicants = array_map(function ($row) {
    return [
        "id" => $row["id"],
        "jobId" => $row["jobId"],
        "name" => $row["name"],
        "course" => $row["course"],
        "documentType" => $row["documentType"],
        "documentUrl" => $row["documentUrl"] ?? null,
        "dateApplied" => $row["dateApplied"],
        "status" => strtolower($row["status"]), // normalize to "pending" | "accepted" | "rejected"
        "contactInfo" => [
            "personalEmail" => $row["personalEmail"],
            "studentEmail" => $row["studentEmail"],
            "phone" => $row["phone"]
        ]
    ];
}, $results);

echo json_encode([
    "status" => "success",
    "data" => $applicants
], JSON_PRETTY_PRINT);
?>