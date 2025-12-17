<?php
session_start();
$data = json_decode(file_get_contents("php://input"), true);

if(!empty($data['email']))
{
    $_SESSION['email'] = $data['email'];
    session_regenerate_id(true);
    echo json_encode([
        "status" => "success",
        "message" => "Session stored successfully",
        "debug" => "Email stored: " . $_SESSION['email']
    ]); 
}
else
{
    echo json_encode([
        "status" => "error",
        "message" => "Email is required"
    ]);
}
?>