<?php
require 'config.php';

/**
 * PayNow Checkout Integration
 * 
 * DEMO MODE: Currently configured to use PayNow demo payment page
 * TEST MODE: To use actual PayNow test credentials:
 * 
 * 1. Sign up at: https://www.paynow.co.zw/Customer/Register
 * 2. Go to: https://www.paynow.co.zw/Home/Receive
 * 3. Create an Advanced Integration (initially in TEST mode)
 * 4. Get your Integration ID and Key
 * 5. Use PayNow Test Tokens (from https://developers.paynow.co.zw/docs/paynow/test_mode):
 *    - Mobile: 0771111111 (success), 0772222222 (delayed), 0773333333 (cancelled), 0774444444 (insufficient)
 *    - Cards: {11111111-1111-1111-1111-111111111111} (success), etc.
 * 
 * LIVE MODE: When ready for production:
 * - Request to be Set Live from PayNow dashboard
 * - Update integration ID and key to production credentials
 * - Set paynow_configured = true
 */

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['user_id']) || empty($data['items']) || empty($data['total'])) {
    echo json_encode(["error" => "Missing order data"]);
    exit();
}

try {
    $paynow_ref = "PAY-" . strtoupper(uniqid());

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total, status, paynow_ref) VALUES (?, ?, 'pending', ?)");
    $stmt->execute([$data['user_id'], $data['total'], $paynow_ref]);
    $order_id = $pdo->lastInsertId();

    foreach ($data['items'] as $item) {
        $stmt2 = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt2->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
    }

    // Check if PayNow is configured with real credentials
    // For demo mode, we don't return a guid - frontend will show a demo payment page
    $paynow_configured = false; // Set to true and add real credentials below for live PayNow
    
    if ($paynow_configured) {
        $paynow_integration_id = "YOUR_REAL_INTEGRATION_ID"; // Get from PayNow dashboard
        $paynow_integration_key = "YOUR_REAL_INTEGRATION_KEY"; // Get from PayNow dashboard
        $hashString = $paynow_integration_id . $data['total'] . $paynow_ref . $paynow_integration_key;
        $hash = hash('sha512', $hashString);
        
        echo json_encode([
            "success" => true,
            "order_id" => $order_id,
            "paynow_ref" => $paynow_ref,
            "paynow_guid" => $paynow_integration_id,
            "hash" => $hash,
            "message" => "Order placed! Redirecting to PayNow..."
        ]);
    } else {
        // Demo mode - no real PayNow redirect
        echo json_encode([
            "success" => true,
            "order_id" => $order_id,
            "paynow_ref" => $paynow_ref,
            "demo_mode" => true,
            "message" => "Order placed! Opening payment..."
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Order failed: " . $e->getMessage()]);
}
?>