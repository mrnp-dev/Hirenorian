<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");
header("Content-type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    include("db_con.php");

    $query = "SELECT 
               c.company_id,
               c.company_name,
               c.email,
               c.company_type,
               c.industry,
               TRIM(c.verified_status) as verified_status,
               c.activation,
               cp.contact_name
              FROM Company c
              LEFT JOIN company_contact_persons cp 
              ON c.company_id = cp.company_id";

    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . implode(", ", $conn->errorInfo()));
    }

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $verified = 0;
    $unverified = 0;

    foreach ($data as $row) {
        $verificationStr = trim(strtolower((string)$row['verified_status']));

        if ($verificationStr === 'verified') {
            $verified++;
        } else if ($verificationStr === 'unverified') {
            $unverified++;
        }
    }

    echo json_encode([
        "status" => "success",
        "count" => count($data),
        "data" => $data,
        "verified" => $verified,
        "unverified" => $unverified
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage(),
        "count" => 0,
        "data" => [],
        "verified" => 0,
        "unverified" => 0
    ]);
    error_log("Company API DB Error: " . $e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "count" => 0,
        "data" => [],
        "verified" => 0,
        "unverified" => 0
    ]);
    error_log("Company API Error: " . $e->getMessage());
}
?>