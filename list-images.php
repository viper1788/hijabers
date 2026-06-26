<?php
// list-images.php
// Place this file in public_html/
// Allows Admin dashboard to browse product image folders

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$baseDir = __DIR__ . '/uploads/products/';
$baseUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/uploads/products/';

$folder = isset($_GET['folder']) ? trim($_GET['folder'], '/') : '';

// Security: prevent directory traversal
if (strpos($folder, '..') !== false || strpos($folder, '/') !== false) {
    echo json_encode(['error' => 'Invalid folder name']);
    exit;
}

// List all product folders
if (empty($folder)) {
    $folders = [];
    if (is_dir($baseDir)) {
        foreach (scandir($baseDir) as $item) {
            if ($item !== '.' && $item !== '..' && is_dir($baseDir . $item)) {
                $folders[] = $item;
            }
        }
    }
    echo json_encode(['folders' => $folders]);
    exit;
}

// List images in specific folder
$dir = $baseDir . $folder . '/';
if (!is_dir($dir)) {
    echo json_encode(['error' => 'Folder not found', 'images' => []]);
    exit;
}

$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$images = [];

foreach (scandir($dir) as $file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($ext, $allowed)) {
        $images[] = [
            'filename' => $file,
            'url' => $baseUrl . $folder . '/' . $file,
        ];
    }
}

echo json_encode([
    'folder' => $folder,
    'images' => $images,
    'count' => count($images),
]);
?>
