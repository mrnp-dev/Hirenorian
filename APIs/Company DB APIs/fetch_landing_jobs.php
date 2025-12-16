<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_con.php"; 
header("Content-type: application/json");

try {
    // Query to fetch 5 random active job posts
    $query = "
        SELECT
            jp.post_id AS id,
            jd.title,
            c.company_name,
            jd.work_type,
            jd.category,
            COALESCE(
                (SELECT icon_url FROM company_icons WHERE company_id = jp.company_id ORDER BY uploaded_at DESC LIMIT 1),
                '../../Landing Page/Images/default-company.jpg'
            ) AS company_icon
        FROM Job_Posts jp
        JOIN Job_Details jd ON jp.post_id = jd.post_id
        JOIN Company c ON jp.company_id = c.company_id
        WHERE jp.status = 'active'
        ORDER BY RAND()
        LIMIT 5
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process results to fix image URLs if they are absolute paths
    $results = array_map(function ($row) {
        if (!empty($row['company_icon']) && strpos($row['company_icon'], '/var/www/html') !== false) {
            $row['company_icon'] = str_replace('/var/www/html', 'http://mrnp.site:8080', $row['company_icon']);
        }
        return $row;
    }, $results);

    echo json_encode([
        "status" => "success",
        "data" => $results
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
