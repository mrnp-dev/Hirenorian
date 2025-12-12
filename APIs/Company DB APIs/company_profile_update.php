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

    if (!empty($data['details'])) {
        $details = $data['details'];

        // Check if a record exists for this company_id
        $checkStmt = $conn->prepare("SELECT COUNT(*) FROM company_additional_informations WHERE company_id = :id");
        $checkStmt->execute([':id' => $company_id]);
        $exists = $checkStmt->fetchColumn() > 0;

        if ($exists) {
            // Update existing record
            $stmt = $conn->prepare("UPDATE company_additional_informations 
            SET about_us = :about, why_join_us = :why, website_link = :link, tagline = :tagline 
            WHERE company_id = :id");
        } else {
            // Insert new record
            $stmt = $conn->prepare("INSERT INTO company_additional_informations 
            (company_id, about_us, why_join_us, website_link, tagline) 
            VALUES (:id, :about, :why, :link, :tagline)");
        }

        $stmt->execute([
            ':id' => $company_id,
            ':about' => $details['aboutUs'],
            ':why' => $details['whyJoinUs'],
            ':link' => $details['websiteUrl'],
            ':tagline' => $details['tagline']
        ]);
    }


    // --- Replace Locations ---
    $conn->prepare("DELETE FROM company_locations WHERE company_id = :id")
        ->execute([':id' => $company_id]);

    if (!empty($data['lists']['locations'])) {
        $stmt = $conn->prepare("INSERT INTO company_locations (company_id, location, description) VALUES (:id, :loc, :desc)");
        foreach ($data['lists']['locations'] as $loc) {
            // Use 'name' from payload
            $locValue = trim((string) ($loc['name'] ?? ''));
            $descValue = trim((string) ($loc['description'] ?? ''));

            if ($locValue === '') {
                continue; // skip empty names to avoid NOT NULL violation
            }

            $stmt->execute([
                ':id' => $company_id,
                ':loc' => $locValue,
                ':desc' => $descValue
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
                ':name' => $contact['name'],
                ':pos' => $contact['position'],
                ':email' => $contact['email'],
                ':num' => $contact['phoneNumber']
            ]);
        }
    }

    // --- Replace Perks ---
    $conn->prepare("DELETE FROM company_perks_benefits WHERE company_id = :id")
        ->execute([':id' => $company_id]);

    $perksInput = $data['lists']['perks'] ?? [];
    $insertPerk = $conn->prepare("INSERT INTO company_perks_benefits (company_id, perk) VALUES (:id, :perk)");

    foreach ($perksInput as $p) {
        // Extract 'description' field from each perk object
        $perkValue = trim((string) ($p['description'] ?? ''));

        if ($perkValue === '') {
            continue; // skip empty perks to avoid NOT NULL violation
        }

        $insertPerk->execute([
            ':id' => $company_id,
            ':perk' => $perkValue
        ]);
    }

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Company profile updated"]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Update failed: " . $e->getMessage()]);
}
?>