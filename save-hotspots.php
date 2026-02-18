<?php
header('Content-Type: application/json; charset=utf-8');

$adminSlug = 'admin-hotspots-2026';
$hotspotsFile = __DIR__ . '/assets/hotspots.json';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

if (($data['adminSlug'] ?? '') !== $adminSlug) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'forbidden']);
    exit;
}

$zones = $data['zones'] ?? null;
if (!is_array($zones)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_zones']);
    exit;
}

$encoded = json_encode($zones, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if ($encoded === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'encode_failed']);
    exit;
}

if (file_put_contents($hotspotsFile, $encoded . PHP_EOL, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'write_failed']);
    exit;
}

echo json_encode(['ok' => true]);
