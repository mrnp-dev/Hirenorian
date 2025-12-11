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

error_log("[SearchJobs] API called at " . date('Y-m-d H:i:s'));

// Read JSON input
$response = file_get_contents("php://input");
error_log("[SearchJobs] Raw input: " . $response);

$data = json_decode($response, true);

if ($data === null) {
    error_log("[SearchJobs] ERROR: Invalid JSON");
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit();
}

// Extract filter parameters
$career_tags = isset($data['career_tags']) && is_array($data['career_tags']) ? $data['career_tags'] : [];
$courses = isset($data['courses']) && is_array($data['courses']) ? $data['courses'] : [];
$location = isset($data['location']) && !empty($data['location']) ? $data['location'] : null;
$work_type = isset($data['work_type']) && !empty($data['work_type']) ? $data['work_type'] : null;

error_log("[SearchJobs] Filters received:");
error_log("[SearchJobs]   - Career tags: " . json_encode($career_tags));
error_log("[SearchJobs]   - Courses: " . json_encode($courses));
error_log("[SearchJobs]   - Location: " . ($location ?? 'null'));
error_log("[SearchJobs]   - Work type: " . ($work_type ?? 'null'));

try {
    // Build the base query
    $query = "
        SELECT DISTINCT
            jp.post_id,
            jd.title,
            c.company_name,
            (SELECT icon_url FROM company_icons WHERE company_id = jp.company_id ORDER BY uploaded_at DESC LIMIT 1) AS company_icon,
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
        error_log("[SearchJobs] Added career tags filter with " . count($career_tags) . " tags");
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
            error_log("[SearchJobs] Added location filter: city={$location_parts[0]}, province={$location_parts[1]}");
        } else {
            // Only province or city
            $query .= " AND (jd.city = :location OR jd.province = :location)";
            $params[':location'] = $location;
            error_log("[SearchJobs] Added location filter: {$location}");
        }
    }

    // Add work type filter
    if ($work_type !== null) {
        $query .= " AND jd.work_type = :work_type";
        $params[':work_type'] = $work_type;
        error_log("[SearchJobs] Added work type filter: {$work_type}");
    }

    $query .= " GROUP BY jp.post_id ORDER BY jp.created_at DESC";

    error_log("[SearchJobs] Final SQL query: " . preg_replace('/\s+/', ' ', $query));
    error_log("[SearchJobs] Query parameters: " . json_encode($params));

    // Execute query
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log("[SearchJobs] Found " . count($jobs) . " jobs");

    // Fetch additional details for each job
    foreach ($jobs as &$job) {
        $post_id = $job['post_id'];
        error_log("[SearchJobs] Processing job ID: {$post_id} - {$job['title']}");

        // Fetch tags
        $tags_query = "SELECT tag FROM Job_Tags WHERE post_id = :post_id";
        $tags_stmt = $conn->prepare($tags_query);
        $tags_stmt->execute([':post_id' => $post_id]);
        $job['tags'] = $tags_stmt->fetchAll(PDO::FETCH_COLUMN);
        error_log("[SearchJobs]   - Tags: " . json_encode($job['tags']));

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

        error_log("[SearchJobs]   - Requirements: resp=" . count($job['responsibilities']) . 
                  ", qual=" . count($job['qualifications']) . 
                  ", skills=" . count($job['skills']) . 
                  ", docs=" . count($job['documents']));

        // Fix company icon URL
        if (!empty($job['company_icon'])) {
            $job['company_icon'] = str_replace('/var/www/html', 'http://mrnp.site:8080', $job['company_icon']);
        }
    }

    error_log("[SearchJobs] Successfully processed all jobs. Returning " . count($jobs) . " results");

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
    error_log("[SearchJobs] DATABASE ERROR: " . $e->getMessage());
    error_log("[SearchJobs] Stack trace: " . $e->getTraceAsString());
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
