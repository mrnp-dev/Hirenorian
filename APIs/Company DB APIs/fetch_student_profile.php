<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";
header("Content-Type: application/json");

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null || !isset($data['applicant_id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing applicant_id"]);
    exit();
}

$applicant_id = $data['applicant_id'];

try {
    // First, get student_id from Applicants table
    $getStudentIdQuery = "SELECT student_id FROM Applicants WHERE applicant_id = :applicant_id";
    $stmt = $conn->prepare($getStudentIdQuery);
    $stmt->execute([':applicant_id' => $applicant_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(["status" => "error", "message" => "Applicant not found"]);
        exit();
    }

    $student_id = $result['student_id'];

    // Helper function to convert VPS path to HTTP URL
    function convertToHttpUrl($vpsPath)
    {
        if (empty($vpsPath)) {
            return null;
        }
        return str_replace('/var/www/html', 'http://mrnp.site:8080', $vpsPath);
    }

    // Fetch basic student information
    $studentQuery = "
        SELECT 
            s.student_id,
            TRIM(CONCAT(
                s.first_name, ' ',
                COALESCE(CONCAT(s.middle_initial, ' '), ''),
                s.last_name, ' ',
                COALESCE(s.suffix, '')
            )) AS full_name,
            s.first_name,
            s.last_name,
            s.middle_initial,
            s.suffix,
            s.personal_email,
            s.student_email,
            s.phone_number,
            e.course,
            e.university,
            sp.location,
            sp.about_me,
            sp.profile_picture
        FROM Students s
        LEFT JOIN Education e ON s.student_id = e.student_id
        LEFT JOIN StudentProfile sp ON s.student_id = sp.student_id
        WHERE s.student_id = :student_id
    ";

    $stmt = $conn->prepare($studentQuery);
    $stmt->execute([':student_id' => $student_id]);
    $studentData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$studentData) {
        echo json_encode(["status" => "error", "message" => "Student data not found"]);
        exit();
    }

    // Fetch skills (Technical + Soft)
    $skillsQuery = "
        SELECT 
            skill_name,
            skill_category
        FROM StudentSkills
        WHERE student_id = :student_id
        ORDER BY skill_category, skill_name
    ";

    $stmt = $conn->prepare($skillsQuery);
    $stmt->execute([':student_id' => $student_id]);
    $skillsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Categorize skills
    $technicalSkills = [];
    $softSkills = [];
    foreach ($skillsData as $skill) {
        if ($skill['skill_category'] === 'Technical') {
            $technicalSkills[] = $skill['skill_name'];
        } else {
            $softSkills[] = $skill['skill_name'];
        }
    }

    // Fetch experience
    $experienceQuery = "
        SELECT 
            job_title,
            company_name,
            start_date,
            end_date,
            description
        FROM StudentExperience
        WHERE student_id = :student_id
        ORDER BY start_date DESC
    ";

    $stmt = $conn->prepare($experienceQuery);
    $stmt->execute([':student_id' => $student_id]);
    $experienceData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch education history
    $educationQuery = "
        SELECT 
            institution,
            degree,
            start_year,
            end_year
        FROM StudentEducationHistory
        WHERE student_id = :student_id
        ORDER BY start_year DESC
    ";

    $stmt = $conn->prepare($educationQuery);
    $stmt->execute([':student_id' => $student_id]);
    $educationHistory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Build comprehensive response
    echo json_encode([
        "status" => "success",
        "data" => [
            "studentId" => $studentData["student_id"],
            "fullName" => $studentData["full_name"],
            "firstName" => $studentData["first_name"],
            "lastName" => $studentData["last_name"],
            "middleInitial" => $studentData["middle_initial"],
            "suffix" => $studentData["suffix"],
            "personalEmail" => $studentData["personal_email"],
            "studentEmail" => $studentData["student_email"],
            "phoneNumber" => $studentData["phone_number"],
            "course" => $studentData["course"] ?? "N/A",
            "university" => $studentData["university"] ?? "N/A",
            "location" => $studentData["location"] ?? "",
            "aboutMe" => $studentData["about_me"] ?? "",
            "profilePicture" => convertToHttpUrl($studentData["profile_picture"]),
            "skills" => [
                "technical" => $technicalSkills,
                "soft" => $softSkills
            ],
            "experience" => $experienceData,
            "educationHistory" => $educationHistory
        ]
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>