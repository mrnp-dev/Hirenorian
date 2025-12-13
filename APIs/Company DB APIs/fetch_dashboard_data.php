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
    // --- 2. Recruitment Analytics (Total, Accepted, Rejected) ---
    // Total
    $totalAppsQuery = "SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :cid";
    $stmt = $conn->prepare($totalAppsQuery);
    $stmt->execute([':cid' => $company_id]);
    $totalApps = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Accepted
    $acceptedAppsQuery = "SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :cid AND a.status = 'accepted'";
    $stmt = $conn->prepare($acceptedAppsQuery);
    $stmt->execute([':cid' => $company_id]);
    $acceptedApps = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Rejected
    $rejectedAppsQuery = "SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :cid AND a.status = 'rejected'";
    $stmt = $conn->prepare($rejectedAppsQuery);
    $stmt->execute([':cid' => $company_id]);
    $rejectedApps = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Pending
    $pendingAppsQuery = "SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :cid AND a.status = 'pending'";
    $stmt = $conn->prepare($pendingAppsQuery);
    $stmt->execute([':cid' => $company_id]);
    $pendingApps = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // --- 3. Post Availability Stats (Active vs Closed) ---
    // Active
    $activePostsQuery = "SELECT COUNT(post_id) as total FROM Job_Posts WHERE company_id = :cid AND status = 'active'";
    $stmt = $conn->prepare($activePostsQuery);
    $stmt->execute([':cid' => $company_id]);
    $activePosts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Closed
    $closedPostsQuery = "SELECT COUNT(post_id) as total FROM Job_Posts WHERE company_id = :cid AND status = 'closed'";
    $stmt = $conn->prepare($closedPostsQuery);
    $stmt->execute([':cid' => $company_id]);
    $closedPosts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // --- 4. Recent Job Listings ---
    // Fetch latest 5 jobs with basic stats
    $jobsQuery = "
        SELECT 
            jp.post_id,
            jp.status,
            jp.created_at,
            jp.applicant_limit,
            jd.title,
            (SELECT COUNT(*) FROM Applicants a WHERE a.post_id = jp.post_id AND a.status = 'Accepted') as applicant_count
        FROM Job_Posts jp
        JOIN Job_Details jd ON jp.post_id = jd.post_id
        WHERE jp.company_id = :cid
        ORDER BY jp.created_at DESC
        LIMIT 10
    ";
    $stmt = $conn->prepare($jobsQuery);
    $stmt->execute([':cid' => $company_id]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format dates and status
    $formattedJobs = [];
    foreach ($jobs as $job) {
        $formattedJobs[] = [
            "id" => $job['post_id'],
            "title" => $job['title'],
            "status" => ucfirst($job['status']), // Active or Closed
            "date_posted" => date("M d, Y", strtotime($job['created_at'])),
            "applicant_count" => $job['applicant_count'],
            "applicant_limit" => $job['applicant_limit']
        ];
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "stats" => [
                "total_applicants" => $totalApps,
                "accepted" => $acceptedApps,
                "rejected" => $rejectedApps,
                "pending" => $pendingApps
            ],
            "post_stats" => [
                "active_count" => $activePosts,
                "closed_count" => $closedPosts,
                "total_posts" => $activePosts + $closedPosts
            ],
            "recent_jobs" => $formattedJobs
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
