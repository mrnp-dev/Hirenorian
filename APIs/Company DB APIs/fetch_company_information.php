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

if ($data === null || !isset($data['company_email'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing company_email"]);
    exit();
}

$company_email = $data['company_email'];

$query = "SELECT company_id FROM Company WHERE email = :company_email";
$stmt = $conn->prepare($query);
$stmt->execute([':company_email' => $company_email]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(["status" => "error", "message" => "Company not found"]);
    exit();
}

$company_id = $row["company_id"];

$query = "
SELECT
    c.company_id, c.company_name, c.email, c.phone_number,
    c.company_type, c.industry, c.address, c.verification,
    cs.stat_id, cs.employees, cs.accepted, cs.ex_employees,
    cai.company_add_id, cai.about_us, cai.why_join_us, cai.perks_benefits,
    cai.locations AS add_locations, cai.website_link, cai.tagline,
    cl.loc_id, cl.location AS branch_location, cl.description AS location_description,
    ccp.contact_person_id, ccp.position, ccp.email AS contact_email, ccp.contact_number
FROM Company c
LEFT JOIN company_statistics cs ON c.company_id = cs.company_id
LEFT JOIN company_additional_informations cai ON c.company_id = cai.company_id
LEFT JOIN company_locations cl ON c.company_id = cl.company_id
LEFT JOIN company_contact_persons ccp ON c.company_id = ccp.company_id
WHERE c.company_id = :company_id
";

$stmt = $conn->prepare($query);
$stmt->execute([':company_id' => $company_id]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "company_id" => $company_id,
    "data" => $results
], JSON_PRETTY_PRINT);
?>