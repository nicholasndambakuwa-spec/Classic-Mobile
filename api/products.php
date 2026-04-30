<?php
require 'config.php';

$stmt = $pdo->query("SELECT * FROM products");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($products);
?>