<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-type: application/json");

$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

$stu_email = $data['student_email'];

try {
    // 1. Get Student ID (and basic info from Students table if needed, though mostly in Profile now?)
    // Assuming Students table has the email mapping
    $query = "SELECT * FROM Students WHERE student_email = :stu_email";
    $stmt = $conn->prepare($query);
    $stmt->execute(['stu_email' => $stu_email]);
    $student_basic = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student_basic) {
        echo json_encode(["status" => "error", "message" => "Student not found"]);
        exit();
    }

    $stu_id = $student_basic['student_id'];

    // 2. Fetch Student Profile (1:1)
    $queryProfile = "SELECT * FROM StudentProfile WHERE student_id = :stu_id";
    $stmtProfile = $conn->prepare($queryProfile);
    $stmtProfile->execute(['stu_id' => $stu_id]);
    $profile = $stmtProfile->fetch(PDO::FETCH_ASSOC);

    // 3. Fetch Skills (1:Matching)
    $querySkills = "SELECT * FROM StudentSkills WHERE student_id = :stu_id";
    $stmtSkills = $conn->prepare($querySkills);
    $stmtSkills->execute(['stu_id' => $stu_id]);
    $skills = $stmtSkills->fetchAll(PDO::FETCH_ASSOC);

    // 4. Fetch Experience (1:Matching)
    $queryExp = "SELECT * FROM StudentExperience WHERE student_id = :stu_id";
    $stmtExp = $conn->prepare($queryExp);
    $stmtExp->execute(['stu_id' => $stu_id]);
    $experience = $stmtExp->fetchAll(PDO::FETCH_ASSOC);

    // 5. Fetch Education History (1:Matching)
    $queryEduHist = "SELECT * FROM StudentEducationHistory WHERE student_id = :stu_id";
    $stmtEduHist = $conn->prepare($queryEduHist);
    $stmtEduHist->execute(['stu_id' => $stu_id]);
    $education_history = $stmtEduHist->fetchAll(PDO::FETCH_ASSOC);

    // 6. Fetch Education (Current/Primary?) (1:Matching or 1:1?)
    // Based on describe table, it has an auto increment edu_id, so it might be multiple rows or single.
    // However, usually "Education" vs "History" implies current vs past. assuming multiple or single, fetchAll is safe.
    $queryEdu = "SELECT * FROM Education WHERE student_id = :stu_id";
    $stmtEdu = $conn->prepare($queryEdu);
    $stmtEdu->execute(['stu_id' => $stu_id]);
    $education = $stmtEdu->fetchAll(PDO::FETCH_ASSOC);

    // Combine all data
    $full_data = [
        "basic_info" => $student_basic,
        "profile" => $profile ? $profile : [], // Empty object/array if not set
        "skills" => $skills,
        "experience" => $experience,
        "education_history" => $education_history,
        "education" => $education
    ];

    echo json_encode([
        "status" => "success",
        "student_id" => $stu_id,
        "data" => $full_data
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
