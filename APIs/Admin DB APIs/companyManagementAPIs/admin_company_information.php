<?php
// Enable error logging for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output
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
    // Include database connection
    include("../dbCon.php");
    
    // Check if connection exists
    if (!isset($conn)) {
        throw new Exception("Database connection failed");
    }

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
    
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . implode(", ", $conn->errorInfo()));
    }
    
    $stmt->execute();
    
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Count verified companies
    $verified = 0;
    foreach ($data as $row) {
        if (trim(strtolower($row['verification'])) == 'true' || $row['verification'] == 1) {
            $verified++;
        }
    }

    // Count unverified companies
    $unverified = 0;
    foreach ($data as $row) {
        if (trim(strtolower($row['verification'])) == 'false' || $row['verification'] == 0) {
            $unverified++;
        }
    }

    // Return success response
    echo json_encode([
        "status" => "success",
        "count" => count($data),
        "data" => $data,
        "verified" => $verified,
        "unverified" => $unverified
    ]);

} catch (PDOException $e) {
    // Database error
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
    // General error
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
