<?php
/**
 * Archivo para cerrar sesión
 */

// Iniciar sesión ANTES de cualquier output
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Destruir todas las variables de sesión
$_SESSION = array();

// Si se desea destruir la sesión completamente, también borrar la cookie de sesión
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destruir la sesión
session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Sesión cerrada correctamente'
]);
?>
