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

$stmt = $conn->prepare("SELECT * FROM Company WHERE email = :company_email");
$stmt->execute([':company_email' => $company_email]);
$company = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$company) {
    echo json_encode(["status" => "error", "message" => "Company not found"]);
    exit();
}

$company_id = $company['company_id'];
$company_name = $company['company_name'];

$stmt = $conn->prepare("SELECT * FROM company_statistics WHERE company_id = :company_id");
$stmt->execute([':company_id' => $company_id]);
$statistics = $stmt->fetchAll(PDO::FETCH_ASSOC);

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