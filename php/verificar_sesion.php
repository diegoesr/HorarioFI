<?php
/**
 * Archivo para verificar si hay una sesión activa
 * Retorna: JSON con status y datos del usuario si hay sesión activa
 */

// Iniciar sesión ANTES de cualquier output
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar si hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'success',
        'sesion_activa' => true,
        'usuario' => [
            'id' => $_SESSION['usuario_id'],
            'numero_cuenta' => $_SESSION['numero_cuenta'],
            'nombre' => $_SESSION['nombre'],
            'apellido' => $_SESSION['apellido'],
            'nombre_completo' => $_SESSION['nombre'] . ' ' . $_SESSION['apellido']
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'sesion_activa' => false,
        'message' => 'No hay sesión activa'
    ]);
}
?>
