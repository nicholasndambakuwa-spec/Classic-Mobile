<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['email']) || empty($data['password'])) {
    echo json_encode(["error" => "Email and password required"]);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data['password'], $user['password'])) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email']
        ]
    ]);
} else {
    echo json_encode(["error" => "Invalid email or password"]);
}
?>