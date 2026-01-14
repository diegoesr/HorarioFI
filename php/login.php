<?php
/**
 * Archivo para validar el login del usuario
 * Recibe: numero_cuenta y password por POST
 * Retorna: JSON con status y mensaje
 */

// Iniciar sesión ANTES de cualquier output
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Obtener datos del POST
$numeroCuenta = isset($_POST['numero_cuenta']) ? trim($_POST['numero_cuenta']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validar que los campos no estén vacíos
if (empty($numeroCuenta) || empty($password)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Por favor, completa todos los campos'
    ]);
    exit;
}

try {
    // Conectar a la base de datos
    $conexion = conectarDB();
    
    if (!$conexion) {
        throw new Exception("No se pudo conectar a la base de datos");
    }
    
    // Preparar consulta para buscar el usuario
    $stmt = $conexion->prepare("SELECT id, numero_cuenta, nombre, apellido, password FROM usuarios WHERE numero_cuenta = ?");
    
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conexion->error);
    }
    
    $stmt->bind_param("s", $numeroCuenta);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    // Verificar si el usuario existe
    if ($resultado->num_rows === 0) {
        $stmt->close();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'Número de cuenta o contraseña incorrectos',
            'debug' => 'Usuario no encontrado con número: ' . $numeroCuenta
        ]);
        exit;
    }
    
    // Obtener datos del usuario
    $usuario = $resultado->fetch_assoc();
    $stmt->close();
    
    // Debug: mostrar qué contraseña se está comparando (solo para desarrollo)
    // En producción, esto NO debe mostrarse
    
    // Verificar contraseña (en producción debería estar hasheada)
    // Por ahora comparamos directamente, pero deberías usar password_verify() con password_hash()
    if ($password === $usuario['password']) {
        // Login exitoso
        // La sesión ya está iniciada arriba
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['numero_cuenta'] = $usuario['numero_cuenta'];
        $_SESSION['nombre'] = $usuario['nombre'];
        $_SESSION['apellido'] = $usuario['apellido'];
        
        cerrarDB($conexion);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario['id'],
                'numero_cuenta' => $usuario['numero_cuenta'],
                'nombre' => $usuario['nombre'],
                'apellido' => $usuario['apellido'],
                'nombre_completo' => $usuario['nombre'] . ' ' . $usuario['apellido']
            ]
        ]);
    } else {
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'Número de cuenta o contraseña incorrectos',
            'debug' => 'Contraseña no coincide'
        ]);
    }
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    
    // Log del error para debug
    error_log("Error en login.php: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Error en el servidor: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>
