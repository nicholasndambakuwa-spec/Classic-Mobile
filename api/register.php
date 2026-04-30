<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(["error" => "All fields are required"]);
    exit();
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $password]);
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["error" => "Email already registered"]);
    } else {
        echo json_encode(["error" => "Registration failed"]);
    }
}
?>