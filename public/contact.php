<?php
// Always return JSON
header('Content-Type: application/json');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 0,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Sanitize & collect inputs
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Backend validation (important even if JS validates)
if ($name === '' || $email === '' || $phone === '' || $message === '') {
    echo json_encode([
        'status' => 0,
        'message' => 'All fields are required'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 0,
        'message' => 'Invalid email address'
    ]);
    exit;
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode([
        'status' => 0,
        'message' => 'Invalid phone number'
    ]);
    exit;
}

// Load Composer autoloader
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // ================= SMTP CONFIG =================
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'harshgharsandiya.work@gmail.com';
    $mail->Password   = 'hwnfqlnpkvvttyhd'; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // ================= EMAIL HEADERS =================
    $mail->setFrom('harshgharsandiya.work@gmail.com', 'F&H Website');
    $mail->addAddress('harshgharsandiya.work@gmail.com'); // Receiver
    $mail->addReplyTo($email, $name);

    // ================= EMAIL CONTENT =================
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';

    $mail->Body = "
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Message:</strong><br>{$message}</p>
    ";

    $mail->AltBody = "
Name: {$name}
Email: {$email}
Phone: {$phone}
Message:
{$message}
    ";

    // Send mail
    $mail->send();

    // ================= SUCCESS RESPONSE =================
    echo json_encode([
        'status' => 1,
        'message' => 'Message sent successfully'
    ]);

} catch (Exception $e) {
    // ================= ERROR RESPONSE =================
    echo json_encode([
        'status' => 0,
        'message' => 'Mailer Error: ' . $mail->ErrorInfo
    ]);
}
