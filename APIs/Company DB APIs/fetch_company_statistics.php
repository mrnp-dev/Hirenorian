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

try {
    // 2. Query Statistics
    // We need to count applicants linked to job posts owned by this company

    // Total Applicants
    $totalQuery = "
        SELECT COUNT(a.applicant_id) as total
        FROM Applicants a
        JOIN Job_Posts jp ON a.post_id = jp.post_id
        WHERE jp.company_id = :company_id
    ";
    $stmt = $conn->prepare($totalQuery);
    $stmt->execute([':company_id' => $company_id]);
    $totalApplicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Accepted Applicants
    $acceptedQuery = "
        SELECT COUNT(a.applicant_id) as total
        FROM Applicants a
        JOIN Job_Posts jp ON a.post_id = jp.post_id
        WHERE jp.company_id = :company_id AND a.status = 'accepted'
    ";
    $stmt = $conn->prepare($acceptedQuery);
    $stmt->execute([':company_id' => $company_id]);
    $acceptedApplicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Rejected Applicants
    $rejectedQuery = "
        SELECT COUNT(a.applicant_id) as total
        FROM Applicants a
        JOIN Job_Posts jp ON a.post_id = jp.post_id
        WHERE jp.company_id = :company_id AND a.status = 'rejected'
    ";
    $stmt = $conn->prepare($rejectedQuery);
    $stmt->execute([':company_id' => $company_id]);
    $rejectedApplicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        "status" => "success",
        "data" => [
            "totalApplicants" => $totalApplicants,
            "accepted" => $acceptedApplicants,
            "rejected" => $rejectedApplicants
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
