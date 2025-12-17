<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include ("db_con.php");

$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : '';

if (empty($student_id)) {
    echo json_encode(["status" => "error", "message" => "Student ID required"]);
    exit();
}

try {

    $queryStudents = "SELECT CONCAT(first_name, ' ', middle_initial, ' ', last_name, ' ', suffix) as student_name FROM Students WHERE student_id = :student_id";
    $stmtStudents = $conn->prepare($queryStudents);
    $stmtStudents->execute([':student_id' => $student_id]);
    $students = $stmtStudents->fetch(PDO::FETCH_ASSOC);

    if (!$students) {
        echo json_encode(["status" => "error", "message" => "Student not found"]);
        exit();
    }

    $queryDocs = "SELECT request_id, student_id, student_type, tor_file, diploma_file, student_id_file, cor_file, status
                  FROM StudentVerificationRequests
                  WHERE student_id = :student_id";

    $stmtDocs = $conn->prepare($queryDocs);
    $stmtDocs->execute([':student_id' => $student_id]);
    $documents = $stmtDocs->fetch(PDO::FETCH_ASSOC);

    if (!$documents) {
        $documents = [
            'doc_id' => null,
            'student_id' => $student_id,
            'student_type' => null,
            'tor_file' => null,
            'diploma_file' => null,
            'student_id_file' => null,
            'cor_file' => null,
            'status' => null
        ];
    }

    echo json_encode([
        "status" => "success",
        "student_name" => $students['student_name'],
        "data" => $documents
    ]);
} catch (PDOException $e) {

    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
