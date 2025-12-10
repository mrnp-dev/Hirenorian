<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include 'db_con.php';
$response = file_get_contents("php://input");
$data = json_decode($response, true);
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}
$student_number = $data['Student Number'] ?? '';
$first_name = $data['First Name'] ?? '';
$last_name = $data['Last Name'] ?? '';
$middle_initial = $data['Middle Initial'] ?? '';
$suffix = $data['Suffix'] ?? '';
$personal_email = $data['Email'] ?? '';
$phone_number = $data['Phone Number'] ?? '';
$password = $data['Password'] ?? '';
$student_email = $data['School Email'] ?? '';
$university = $data['University/Campus'] ?? '';
$department = $data['Department'] ?? '';
$course = $data['Course'] ?? '';
$organization = $data['Organization'] ?? '';
// New Fields
$ideal_location = $data['Ideal Location'] ?? null;
$tags = $data['Tags'] ?? [];
// Map tags to individual variables
$tag1 = $tags[0] ?? null;
$tag2 = $tags[1] ?? null;
$tag3 = $tags[2] ?? null;
header('Content-Type: application/json');
try {
    $conn->beginTransaction();
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $query = $conn->prepare("
        INSERT INTO Students
        (student_id, first_name, last_name, middle_initial, suffix, personal_email, phone_number, password_hash, student_email, tag1, tag2, tag3, ideal_location)
        VALUES (:student_id, :first_name, :last_name, :middle_initial, :suffix, :personal_email, :phone_number, :password_hash, :student_email, :tag1, :tag2, :tag3, :ideal_location)
    ");
    $query->execute([
        ':student_id' => $student_number,
        ':first_name' => $first_name,
        ':last_name' => $last_name,
        ':middle_initial' => $middle_initial,
        ':suffix' => $suffix,
        ':personal_email' => $personal_email,
        ':phone_number' => $phone_number,
        ':password_hash' => $password_hash,
        ':student_email' => $student_email,
        ':tag1' => $tag1,
        ':tag2' => $tag2,
        ':tag3' => $tag3,
        ':ideal_location' => $ideal_location
    ]);
    $query = $conn->prepare("
        INSERT INTO Education
        (student_id, university, department, course, organization)
        VALUES (:student_id, :university, :department, :course, :organization)
    ");
    $query->execute([
        ':student_id' => $student_number,
        ':university' => $university,
        ':department' => $department,
        ':course' => $course,
        ':organization' => $organization
    ]);
    $conn->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Student registered successfully",
        "debug_received_tags" => $tags,
        "debug_tag1" => $tag1,
        "debug_tag2" => $tag2,
        "debug_tag3" => $tag3
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "debug_received_tags" => $tags
    ]);
}
?>