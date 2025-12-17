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

$response = file_get_contents("php://input");
$data = json_decode($response, true);

$company_id_input = isset($data['company_id']) ? $data['company_id'] : null;
$company_email_input = isset($data['company_email']) ? $data['company_email'] : null;

if ($data === null || (!$company_id_input && !$company_email_input)) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing company_email/company_id"]);
    exit();
}

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$company = false;

if ($company_id_input) {
    // Fetch by ID
    $stmt = $conn->prepare("SELECT * FROM Company WHERE company_id = :id");
    $stmt->execute([':id' => $company_id_input]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);
} elseif ($company_email_input) {
    // Fetch by Email
    $stmt = $conn->prepare("SELECT * FROM Company WHERE email = :email");
    $stmt->execute([':email' => $company_email_input]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);
}
if (!$company) {
    echo json_encode(["status" => "error", "message" => "Company not found"]);
    exit();
}

$company_id = $company['company_id'];
$company_name = $company['company_name'];

// --- REPLACED STATIC STATISTICS WITH DYNAMIC CALCULATIONS ---
// Total Applicants
$stmt = $conn->prepare("SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$total_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Accepted Applicants
$stmt = $conn->prepare("SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :company_id AND a.status = 'Accepted'");
$stmt->execute([':company_id' => $company_id]);
$accepted_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Rejected Applicants
$stmt = $conn->prepare("SELECT COUNT(a.applicant_id) as total FROM Applicants a JOIN Job_Posts jp ON a.post_id = jp.post_id WHERE jp.company_id = :company_id AND a.status = 'Rejected'");
$stmt->execute([':company_id' => $company_id]);
$rejected_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Store in an array to match previous structure somewhat, or just pass as distinct fields
$statistics = [
    [
        'employees' => $total_applicants,      // Mapping to old key 'employees' for frontend compatibility or new keys? 
        // Frontend uses 'employees', 'accepted', 'ex_employees'(rejected?)
        // Let's use simpler keys but keep structure if needed.
        // Actually, let's just return them as top level or in a better stats object.
        'total_applicants' => $total_applicants,
        'accepted' => $accepted_applicants,
        'rejected' => $rejected_applicants
    ]
];

// Fetch Additional Info
$stmt = $conn->prepare("SELECT * FROM company_additional_informations WHERE company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$additional_info = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Locations
$stmt = $conn->prepare("SELECT * FROM company_locations WHERE company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$locations = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Contacts
$stmt = $conn->prepare("SELECT * FROM company_contact_persons WHERE company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Icons (New)
$stmt = $conn->prepare("SELECT * FROM company_icons WHERE company_id = :company_id ORDER BY uploaded_at DESC LIMIT 1");
$stmt->execute([':company_id' => $company_id]);
$icons = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch Banners (New)
$stmt = $conn->prepare("SELECT * FROM company_banners WHERE company_id = :company_id ORDER BY uploaded_at DESC LIMIT 1");
$stmt->execute([':company_id' => $company_id]);
$banners = $stmt->fetchAll(PDO::FETCH_ASSOC);

// The original script had a separate 'perks' array from company_perks_benefits.
// The new query includes 'perks_benefits' as a column in company_additional_informations.
// If the original 'company_perks_benefits' table is still desired as a separate array,
// a separate query for it would be needed, or the main query would need to join it.
// For now, we'll assume the 'perks_benefits' from additional_info is sufficient,
// or that the original 'perks' array should remain empty if not explicitly fetched.
// To maintain the original structure, we'll add a separate query for perks.

$stmt = $conn->prepare("SELECT * FROM company_perks_benefits WHERE company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$perks = $stmt->fetchAll(PDO::FETCH_ASSOC);


echo json_encode([
    "status" => "success",
    "company" => $company,
    "statistics" => $statistics,
    "additional_info" => $additional_info,
    "locations" => $locations,
    "contacts" => $contacts,
    "perks" => $perks,
    "icons" => $icons, // Added icons
    "banners" => $banners, // Added banners
    "company_id" => $company_id,
    "company_name" => $company_name
], JSON_PRETTY_PRINT);
?>