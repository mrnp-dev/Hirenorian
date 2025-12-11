<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("../dbCon.php");
header("Content-type: application/json");

$query = "SELECT 
           c.company_id,
           c.company_name,
           c.email,
           c.company_type,
           c.industry,
           c.verification,
           c.activation,
           cp.contact_name
          FROM Company c
          LEFT JOIN company_contact_persons cp 
          ON c.company_id = cp.company_id";

$stmt = $conn->prepare($query);
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "count" => count($data),
    "data" => $data
]);
