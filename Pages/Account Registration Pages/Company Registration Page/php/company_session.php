<?php
session_start();
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['company_email'])) {
    $_SESSION['company_email'] = $data['company_email'];
    session_regenerate_id(true);
    echo json_encode([
        "status" => "success",
        "message" => "Session stored successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Email is required"
    ]);
}
?>