<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_con.php';

header('Content-Type: application/json');

$response = file_get_contents("php://input");
$data = json_decode($response, true);

$email = isset($data['email']) ? trim($data['email']) : "";
$password = isset($data['password']) ? $data['password'] : "";

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password required"]);
    exit();
}

$query = $conn->prepare("SELECT company_id, password_hash FROM Company WHERE email = :email");
$query->execute([":email" => $email]);
$row = $query->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    exit();
}

if (password_verify($password, $row['password_hash'])) {
    echo json_encode([
        "status" => "success",
        "message" => "Login successful",
        "user_id" => $row['id']
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
}
?>