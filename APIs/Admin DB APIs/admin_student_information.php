<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include("db_con.php");
header("Content-type: application/json");

$query = "SELECT 
            s.student_id, 
            s.first_name,
            s.middle_initial,
            s.last_name,
            s.suffix,
            s.student_email, 
            s.activated,
            s.verified,
            s.verified_status,
            e.course, 
            e.department
          FROM Students s
          LEFT JOIN Education e 
          ON s.student_id = e.student_id";

$stmt = $conn->prepare($query);
$stmt->execute();

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

$verified = 0;

foreach ($data as $row) {
    if ($row['verified'] == 'true') {
        $verified++;
    }
}

$unverified = 0;

foreach ($data as $row) {
    if ($row['verified'] == 'false') {
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
