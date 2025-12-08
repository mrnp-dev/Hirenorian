<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
        http_response_code(200);
        exit();
}

include "db_con.php";
header("Content-type: application/json");

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null)
{
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        exit();
}

$stu_email = $data['student_email'];
$query = "SELECT student_id FROM Students WHERE student_email = :stu_email";
$stmt =  $conn->prepare($query);
$stmt->execute(['stu_email' => $stu_email]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$stu_id = $row["student_id"];

$query = "SELECT * FROM Students s JOIN Education e ON s.student_id = e.student_id WHERE e.student_id = :stu_id";
$stmt = $conn->prepare($query);
$stmt->execute(['stu_id' => $stu_id]);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
        "status" => "success",
        "student_id" => $stu_id,
        "data" => $data
]);
?>
