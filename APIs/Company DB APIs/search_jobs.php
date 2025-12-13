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
$keyword = isset($data['keyword']) && !empty($data['keyword']) ? trim($data['keyword']) : null;

error_log("[SearchJobs] Filters received:");
error_log("[SearchJobs]   - Career tags: " . json_encode($career_tags));
error_log("[SearchJobs]   - Courses: " . json_encode($courses));
error_log("[SearchJobs]   - Location: " . ($location ?? 'null'));
error_log("[SearchJobs]   - Work type: " . ($work_type ?? 'null'));
error_log("[SearchJobs]   - Keyword: " . ($keyword ?? 'null'));

try {
    // Extract pagination parameters
    $page = isset($data['page']) && is_numeric($data['page']) ? (int)$data['page'] : 1;
    $limit = isset($data['limit']) && is_numeric($data['limit']) ? (int)$data['limit'] : 10;
    $offset = ($page - 1) * $limit;

    error_log("[SearchJobs] Pagination: page=$page, limit=$limit, offset=$offset");

    // Build the base query conditions
    $base_conditions = "WHERE jp.status = 'active'";
    $params = [];

    // Add career tags filter (OR logic - match ANY tag)
    if (!empty($career_tags)) {
        $placeholders = [];
        foreach ($career_tags as $index => $tag) {
            $key = ":tag_$index";
            $placeholders[] = $key;
            $params[$key] = $tag;
        }
        $base_conditions .= " AND jt.tag IN (" . implode(', ', $placeholders) . ")";
        error_log("[SearchJobs] Added career tags filter with " . count($career_tags) . " tags");
    }

    // Add location filter (match city OR province)
    if ($location !== null) {
        // Parse location (e.g., "Angeles City, Pampanga")
        $location_parts = array_map('trim', explode(',', $location));
        if (count($location_parts) == 2) {
            // Has both city and province
            $base_conditions .= " AND (jd.city = :city AND jd.province = :province)";
            $params[':city'] = $location_parts[0];
            $params[':province'] = $location_parts[1];
            error_log("[SearchJobs] Added location filter: city={$location_parts[0]}, province={$location_parts[1]}");
        } else {
            // Only province or city
            $base_conditions .= " AND (jd.city = :location OR jd.province = :location)";
            $params[':location'] = $location;
            error_log("[SearchJobs] Added location filter: {$location}");
        }
    }

    // Add work type filter
    if ($work_type !== null) {
        $base_conditions .= " AND jd.work_type = :work_type";
        $params[':work_type'] = $work_type;
        error_log("[SearchJobs] Added work type filter: {$work_type}");
    }

    // Add keyword search filter
    if ($keyword !== null) {
        $base_conditions .= " AND (
            jd.title LIKE :keyword 
            OR c.company_name LIKE :keyword
            OR jd.description LIKE :keyword
            OR jd.category LIKE :keyword
        )";
        $params[':keyword'] = "%$keyword%";
        error_log("[SearchJobs] Added keyword filter: {$keyword}");
    }

    // 1. Get Total Count first
    $count_query = "
        SELECT COUNT(DISTINCT jp.post_id)
        FROM Job_Posts jp
        JOIN Job_Details jd ON jp.post_id = jd.post_id
        JOIN Company c ON jp.company_id = c.company_id
        LEFT JOIN Job_Tags jt ON jp.post_id = jt.post_id
        $base_conditions
    ";
    
    $count_stmt = $conn->prepare($count_query);
    $count_stmt->execute($params);
    $total_jobs = $count_stmt->fetchColumn();
    $total_pages = ceil($total_jobs / $limit);

    error_log("[SearchJobs] Total matching jobs: $total_jobs, Total pages: $total_pages");

    // 2. Get Paginated Results
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
        $base_conditions
        GROUP BY jp.post_id 
        ORDER BY jp.created_at DESC
        LIMIT :limit OFFSET :offset
    ";

    // Bind all params including limit/offset
    $stmt = $conn->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log("[SearchJobs] Found " . count($jobs) . " jobs (Page $page)");

    // Fetch additional details for each job
    foreach ($jobs as &$job) {
        $post_id = $job['post_id'];
        // error_log("[SearchJobs] Processing job ID: {$post_id}");

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

    error_log("[SearchJobs] Successfully processed page $page");

    // Return response
    echo json_encode([
        "status" => "success",
        "count" => count($jobs),
        "pagination" => [
            "current_page" => $page,
            "total_pages" => $total_pages,
            "total_jobs" => $total_jobs,
            "limit" => $limit
        ],
        "filters_applied" => [
            "career_tags" => $career_tags,
            "courses" => $courses,
            "location" => $location,
            "work_type" => $work_type,
            "keyword" => $keyword
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
