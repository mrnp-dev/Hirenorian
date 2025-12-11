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

// Read JSON input
$response = file_get_contents("php://input");
$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

// Extract filter parameters
$career_tags = isset($data['career_tags']) && is_array($data['career_tags']) ? $data['career_tags'] : [];
$courses = isset($data['courses']) && is_array($data['courses']) ? $data['courses'] : [];
$location = isset($data['location']) && !empty($data['location']) ? $data['location'] : null;
$work_type = isset($data['work_type']) && !empty($data['work_type']) ? $data['work_type'] : null;

try {
    // Build the base query
    $query = "
        SELECT DISTINCT
            jp.post_id,
            jd.title,
            c.company_name,
            c.company_icon,
            jd.province,
            jd.city,
            jd.work_type,
           jd.category,
            jd.description,
            DATE_FORMAT(jp.created_at, '%M %d, %Y') AS created_at
        FROM Job_Posts jp
        JOIN Job_Details jd ON jp.post_id = jd.post_id
        JOIN Company c ON jp.company_id = c.company_id
        LEFT JOIN Job_Tags jt ON jp.post_id = jt.post_id
        WHERE jp.status = 'active'
    ";

    $params = [];

    // Add career tags filter (OR logic - match ANY tag)
    if (!empty($career_tags)) {
        $placeholders = [];
        foreach ($career_tags as $index => $tag) {
            $key = ":tag_$index";
            $placeholders[] = $key;
            $params[$key] = $tag;
        }
        $query .= " AND jt.tag IN (" . implode(', ', $placeholders) . ")";
    }

    // Add location filter (match city OR province)
    if ($location !== null) {
        // Parse location (e.g., "Angeles City, Pampanga")
        $location_parts = array_map('trim', explode(',', $location));
        if (count($location_parts) == 2) {
            // Has both city and province
            $query .= " AND (jd.city = :city AND jd.province = :province)";
            $params[':city'] = $location_parts[0];
            $params[':province'] = $location_parts[1];
        } else {
            // Only province or city
            $query .= " AND (jd.city = :location OR jd.province = :location)";
            $params[':location'] = $location;
        }
    }

    // Add work type filter
    if ($work_type !== null) {
        $query .= " AND jd.work_type = :work_type";
        $params[':work_type'] = $work_type;
    }

    $query .= " GROUP BY jp.post_id ORDER BY jp.created_at DESC";

    // Execute query
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch additional details for each job
    foreach ($jobs as &$job) {
        $post_id = $job['post_id'];

        // Fetch tags
        $tags_query = "SELECT tag FROM Job_Tags WHERE post_id = :post_id";
        $tags_stmt = $conn->prepare($tags_query);
        $tags_stmt->execute([':post_id' => $post_id]);
        $job['tags'] = $tags_stmt->fetchAll(PDO::FETCH_COLUMN);

        // Fetch requirements by type
        $req_query = "SELECT requirement_type, requirement_text FROM Job_Requirements WHERE post_id = :post_id";
        $req_stmt = $conn->prepare($req_query);
        $req_stmt->execute([':post_id' => $post_id]);
        $requirements = $req_stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group requirements by type
        $job['responsibilities'] = [];
        $job['qualifications'] = [];
        $job['skills'] = [];
        $job['documents'] = [];

        foreach ($requirements as $req) {
            switch ($req['requirement_type']) {
                case 'responsibility':
                    $job['responsibilities'][] = $req['requirement_text'];
                    break;
                case 'qualification':
                    $job['qualifications'][] = $req['requirement_text'];
                    break;
                case 'skill':
                    $job['skills'][] = $req['requirement_text'];
                    break;
                case 'document':
                    $job['documents'][] = $req['requirement_text'];
                    break;
            }
        }

        // Fix company icon URL
        if (!empty($job['company_icon'])) {
            $job['company_icon'] = str_replace('/var/www/html', 'http://mrnp.site:8080', $job['company_icon']);
        }
    }

    // Return response
    echo json_encode([
        "status" => "success",
        "count" => count($jobs),
        "filters_applied" => [
            "career_tags" => $career_tags,
            "courses" => $courses,
            "location" => $location,
            "work_type" => $work_type
        ],
        "data" => $jobs
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
