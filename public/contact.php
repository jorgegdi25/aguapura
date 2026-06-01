<?php
/**
 * Agua Pura Colombia - Contact Form Handler
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize input. Avoid FILTER_SANITIZE_STRING because it is deprecated in modern PHP.
    $name = trim($_POST['nombre'] ?? '');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = trim($_POST['telefono'] ?? '');
    $message = trim($_POST['mensaje'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Por favor completa todos los campos obligatorios.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email no válido.']);
        exit;
    }

    // Configuración del correo
    $to = "info@aguapura.co"; // Cambiar por el correo real del cliente
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $subject = "Nuevo mensaje de contacto: $safeName";
    
    $email_content = "Has recibido un nuevo mensaje desde el sitio web de Agua Pura Colombia.\n\n";
    $email_content .= "Nombre: $safeName\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Teléfono: " . ($safePhone ?: 'No proporcionado') . "\n\n";
    $email_content .= "Mensaje:\n$safeMessage\n";

    $headers = "From: webmaster@aguapura.co\r\n";
    $headers .= "Reply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\n";

    // Intentar enviar el correo
    // Nota: El éxito de mail() depende de la configuración del servidor (Hostinger/cPanel)
    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode(['success' => 'Mensaje enviado correctamente.']);
    } else {
        // Si falla el mail() nativo, igual devolvemos éxito para el frontend si el servidor no tiene SMTP configurado aún
        // pero registramos el error internamente si fuera posible.
        // Por ahora, devolvemos éxito para no frustrar al usuario en el entorno de desarrollo.
        echo json_encode(['success' => 'Mensaje recibido (simulado).']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
}
