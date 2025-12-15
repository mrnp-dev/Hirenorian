<?php
include '../dbCon.php';


header('Content-Type: application/json');

try {

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $action         = $data['action_type'] ?? null;
    $description    = $data['description'] ?? null;

    if (!$action || !$description) {
        throw new Exception('Missing required fields');
    }

    $stmt = $conn->prepare("
        INSERT INTO adminAuditLog (role, action, description)
        VALUES ('admin', :action, :description)
    ");

    $stmt->bindParam(':action', $action, PDO::PARAM_STR);
    $stmt->bindParam(':description', $description, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode([
        'status' => 'success',
        'message' => 'Audit log added successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
