<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Check common autoload paths
$paths = [
    __DIR__ . '/phpmailer/vendor/autoload.php',
    '/var/www/html/Hirenorian/API/studentDB_APIs/phpmailer/vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php'
];

$results = [];
foreach ($paths as $p) {
    $results[$p] = file_exists($p) ? 'EXISTS' : 'MISSING';
}

echo json_encode([
    'status' => 'probe_success',
    'message' => 'If you see this, you uploaded to the correct folder.',
    'current_file' => __FILE__,
    'current_dir' => __DIR__,
    'dependency_check' => $results
]);
?>
