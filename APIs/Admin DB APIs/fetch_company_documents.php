<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db_con.php';

$company_id = isset($_GET['company_id']) ? $_GET['company_id'] : '';

if (empty($company_id)) {
    echo json_encode(["status" => "error", "message" => "Company ID required"]);
    exit();
}

try {

    $queryCompany = "SELECT company_name, verification FROM Company WHERE company_id = :company_id";
    $stmtCompany = $conn->prepare($queryCompany);
    $stmtCompany->execute([':company_id' => $company_id]);
    $company = $stmtCompany->fetch(PDO::FETCH_ASSOC);

    if (!$company) {
        echo json_encode(["status" => "error", "message" => "Company not found"]);
        exit();
    }

    $queryDocs = "SELECT doc_id, company_id, philjobnet_path, dole_path, bir_path, mayor_permit_path, business_type_doc_path 
                  FROM Company_Documents
                  WHERE company_id = :company_id";

    $stmtDocs = $conn->prepare($queryDocs);
    $stmtDocs->execute([':company_id' => $company_id]);
    $documents = $stmtDocs->fetch(PDO::FETCH_ASSOC);

    if (!$documents) {
        $documents = [
            'doc_id' => null,
            'company_id' => $company_id,
            'philjobnet_path' => null,
            'dole_path' => null,
            'bir_path' => null,
            'mayor_permit_path' => null,
            'business_type_doc_path' => null
        ];
    }

    echo json_encode([
        "status" => "success",
        "company_name" => $company['company_name'],
        "verification_status" => $company['verification'],
        "data" => $documents
    ]);
} catch (PDOException $e) {

    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
