<?php
/**
 * Archivo para inscribir una materia individualmente
 * Recibe: materia_id por POST
 * Retorna: JSON con status y mensaje
 * Actualiza el cupo disponible de la materia
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

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Debes iniciar sesión'
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];
$materiaId = isset($_POST['materia_id']) ? (int)$_POST['materia_id'] : 0;

if ($materiaId <= 0) {
    echo json_encode([
        'status' => 'error',
        'message' => 'ID de materia inválido'
    ]);
    exit;
}

try {
    // Conectar a la base de datos
    $conexion = conectarDB();
    
    // Iniciar transacción
    $conexion->begin_transaction();
    
    // Verificar que la materia existe y tiene cupo
    $stmtCheck = $conexion->prepare("SELECT id, nombre, cupo_disponible FROM materias WHERE id = ? AND activa = TRUE");
    $stmtCheck->bind_param("i", $materiaId);
    $stmtCheck->execute();
    $resultado = $stmtCheck->get_result();
    
    if ($resultado->num_rows === 0) {
        $stmtCheck->close();
        $conexion->rollback();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'La materia no existe o no está disponible'
        ]);
        exit;
    }
    
    $materia = $resultado->fetch_assoc();
    $stmtCheck->close();
    
    // Verificar cupo disponible con mensaje más específico
    if ($materia['cupo_disponible'] <= 0) {
        $conexion->rollback();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => "No hay cupos disponibles para la materia \"${materia['nombre']}\". Todos los lugares han sido ocupados.",
            'codigo_error' => 'SIN_CUPOS'
        ]);
        exit;
    }
    
    // Verificar si el usuario ya tiene esta materia inscrita
    $stmtCheckInscripcion = $conexion->prepare("SELECT id FROM horarios_usuarios WHERE usuario_id = ? AND materia_id = ?");
    $stmtCheckInscripcion->bind_param("ii", $usuarioId, $materiaId);
    $stmtCheckInscripcion->execute();
    $resultadoInscripcion = $stmtCheckInscripcion->get_result();
    
    if ($resultadoInscripcion->num_rows > 0) {
        $stmtCheckInscripcion->close();
        $conexion->rollback();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'Ya tienes esta materia inscrita'
        ]);
        exit;
    }
    $stmtCheckInscripcion->close();
    
    // Insertar la materia en el horario del usuario
    $stmtInsert = $conexion->prepare("INSERT INTO horarios_usuarios (usuario_id, materia_id) VALUES (?, ?)");
    $stmtInsert->bind_param("ii", $usuarioId, $materiaId);
    $stmtInsert->execute();
    $stmtInsert->close();
    
    // Actualizar el cupo disponible (disminuir en 1)
    $stmtUpdateCupo = $conexion->prepare("UPDATE materias SET cupo_disponible = cupo_disponible - 1 WHERE id = ?");
    $stmtUpdateCupo->bind_param("i", $materiaId);
    $stmtUpdateCupo->execute();
    $stmtUpdateCupo->close();
    
    // Confirmar transacción
    $conexion->commit();
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'message' => "Materia \"${materia['nombre']}\" inscrita correctamente",
        'cupo_actualizado' => true
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    if (isset($conexion)) {
        $conexion->rollback();
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al inscribir la materia: ' . $e->getMessage()
    ]);
}
?>
