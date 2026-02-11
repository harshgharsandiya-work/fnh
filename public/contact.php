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

function contactEmailTemplate($name, $email, $phone, $message)
{
    return "
    <div style='font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;'>
        <div style='max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;'>

            <div style='background:#151515; color:#ffffff; padding:16px 20px;'>
                <h2 style='margin:0; font-size:20px;'>New Contact Form Submission</h2>
            </div>

            <div style='padding:20px; color:#333;'>
                <p><strong>Name:</strong> {$name}</p>
                <p><strong>Email:</strong> {$email}</p>
                <p><strong>Phone:</strong> {$phone}</p>

                <div style='margin-top:15px;'>
                    <p><strong>Message:</strong></p>
                    <div style='background:#f2f2f2; padding:12px; border-radius:6px;'>
                        {$message}
                    </div>
                </div>
            </div>

            <div style='background:#f0f0f0; padding:12px; font-size:12px; color:#666; text-align:center;'>
                Sent from F&H Website Contact Form
            </div>

        </div>
    </div>
    ";
}


// Load Composer autoloader
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
$mail->SMTPDebug = 2;
$mail->Debugoutput = 'html';

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

    $mail->Body = contactEmailTemplate(
        $name,
        $email,
        $phone,
        nl2br(htmlspecialchars($message))
    );

    $mail->AltBody = "New Contact Form Submission
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
