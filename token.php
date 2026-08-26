<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

$apiKey = 'APIy8GDnihpyYea';
$apiSecret = 'wprzGPOxNZ4yGUNPVqhG5nV2glWnOh13ZI8hYN6vshM';

$identity = $_GET['identity'] ?? 'invite-' . rand(1000, 9999);
$room = $_GET['room'] ?? 'ma-salle';

$now = time();
$payload = [
    'iss' => $apiKey,
    'sub' => $identity,
    'iat' => $now,
    'exp' => $now + 3600, // valide 1h
    'nbf' => $now,
    'video' => [
        'roomJoin' => true,
        'room' => $room,
    ],
];

$jwt = JWT::encode($payload, $apiSecret, 'HS256');

header('Content-Type: application/json');
echo json_encode(['token' => $jwt]);