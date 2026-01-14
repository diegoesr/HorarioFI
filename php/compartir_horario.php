<?php
/**
 * Archivo para compartir el horario del usuario
 * Genera un código único para compartir el horario
 * Retorna: JSON con status, codigo_compartido y enlace
 */

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Debes iniciar sesión para compartir tu horario'
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];

try {
    $conexion = conectarDB();
    
    // Verificar que el usuario tenga un horario guardado
    $stmtCheck = $conexion->prepare("SELECT COUNT(*) as total FROM horarios_usuarios WHERE usuario_id = ?");
    $stmtCheck->bind_param("i", $usuarioId);
    $stmtCheck->execute();
    $resultadoCheck = $stmtCheck->get_result();
    $check = $resultadoCheck->fetch_assoc();
    $stmtCheck->close();
    
    if ($check['total'] == 0) {
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'No tienes un horario guardado. Guarda tu horario primero antes de compartirlo.'
        ]);
        exit;
    }
    
    // Desactivar códigos anteriores del usuario (opcional, para tener solo uno activo)
    $stmtDesactivar = $conexion->prepare("UPDATE horarios_compartidos SET activo = FALSE WHERE usuario_id = ?");
    $stmtDesactivar->bind_param("i", $usuarioId);
    $stmtDesactivar->execute();
    $stmtDesactivar->close();
    
    // Generar código único
    $codigoCompartido = bin2hex(random_bytes(16)); // Genera un código de 32 caracteres
    
    // Insertar código en la base de datos
    $stmtInsert = $conexion->prepare("INSERT INTO horarios_compartidos (usuario_id, codigo_compartido, activo) VALUES (?, ?, TRUE)");
    $stmtInsert->bind_param("is", $usuarioId, $codigoCompartido);
    $stmtInsert->execute();
    $stmtInsert->close();
    
    // Obtener URL base (subir un nivel desde php/ a la raíz del proyecto)
    $protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    // dirname($_SERVER['PHP_SELF']) devuelve /horario-fi/php, necesitamos subir un nivel
    $basePath = dirname(dirname($_SERVER['PHP_SELF']));
    $enlaceCompartir = $protocolo . '://' . $host . $basePath . '/ver_horario_compartido.php?codigo=' . $codigoCompartido;
    
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'codigo_compartido' => $codigoCompartido,
        'enlace' => $enlaceCompartir,
        'message' => 'Enlace de compartir generado correctamente'
    ]);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al generar enlace de compartir: ' . $e->getMessage()
    ]);
}
?>
