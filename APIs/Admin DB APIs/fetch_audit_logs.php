<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("dbCon.php");
header("Content-type: application/json");

$query = "SELECT 
            a.role, 
            a.action,
            a.description,
            CONVERT_TZ(a.created_at, '+00:00', '+08:00') as created_at
          FROM adminAuditLog a
          ORDER BY a.created_at DESC";

$stmt = $conn->prepare($query);
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "count" => count($data),
    "data" => $data,
]);
