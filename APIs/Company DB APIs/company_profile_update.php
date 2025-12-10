<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['company_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing company_id or invalid JSON"]);
    exit();
}

$company_id = $data['company_id'];

try {
    $conn->beginTransaction();

    // --- Update Company (basic_info) ---
    $basic = $data['basic_info'];
    $stmt = $conn->prepare("UPDATE Company 
        SET company_name = :name, email = :email, phone_number = :phone, 
            address = :address, industry = :industry 
        WHERE company_id = :id");
    $stmt->execute([
        ':name' => $basic['name'],
        ':email' => $basic['email'],
        ':phone' => $basic['phoneNumber'],
        ':address' => $basic['address'],
        ':industry' => $basic['industry'],
        ':id' => $company_id
    ]);

    // --- Update Additional Info (details) ---
    if (!empty($data['details'])) {
        $details = $data['details'];
        $stmt = $conn->prepare("UPDATE company_additional_informations 
            SET about_us = :about, why_join_us = :why, website_link = :link, tagline = :tagline 
            WHERE company_id = :id");
        $stmt->execute([
            ':about' => $details['aboutUs'],
            ':why' => $details['whyJoinUs'],
            ':link' => $details['websiteUrl'],
            ':tagline' => $details['tagline'],
            ':id' => $company_id
        ]);
    }

    // --- Replace Locations ---
    $conn->prepare("DELETE FROM company_locations WHERE company_id = :id")->execute([':id' => $company_id]);
    if (!empty($data['lists']['locations'])) {
        $stmt = $conn->prepare("INSERT INTO company_locations (company_id, location, description) VALUES (:id, :loc, :desc)");
        foreach ($data['lists']['locations'] as $loc) {
            $stmt->execute([
                ':id' => $company_id,
                ':loc' => $loc['location'],
                ':desc' => $loc['description']
            ]);
        }
    }

    // --- Replace Contacts ---
    $conn->prepare("DELETE FROM company_contact_persons WHERE company_id = :id")->execute([':id' => $company_id]);
    if (!empty($data['lists']['contacts'])) {
        $stmt = $conn->prepare("INSERT INTO company_contact_persons (company_id, contact_name, position, email, contact_number) 
            VALUES (:id, :name, :pos, :email, :num)");
        foreach ($data['lists']['contacts'] as $contact) {
            $stmt->execute([
                ':id' => $company_id,
                ':name' => $contact['contact_name'],
                ':pos' => $contact['position'],
                ':email' => $contact['email'],
                ':num' => $contact['contact_number']
            ]);
        }
    }

    // --- Replace Perks ---
    $conn->prepare("DELETE FROM company_perks_benefits WHERE company_id = :id")->execute([':id' => $company_id]);
    if (!empty($data['lists']['perks'])) {
        $stmt = $conn->prepare("INSERT INTO company_perks_benefits (company_id, perk) VALUES (:id, :perk)");
        foreach ($data['lists']['perks'] as $perk) {
            $stmt->execute([
                ':id' => $company_id,
                ':perk' => $perk['perk']
            ]);
        }
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Company profile updated"]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Update failed: " . $e->getMessage()]);
}
?>