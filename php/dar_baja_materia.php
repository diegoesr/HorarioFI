<?php
/**
 * Archivo para dar de baja una materia del horario del usuario
 * Recibe: materia_id por POST
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
    
    // Verificar que la materia pertenece al usuario
    $stmtCheck = $conexion->prepare("
        SELECT hu.id, m.nombre 
        FROM horarios_usuarios hu
        INNER JOIN materias m ON hu.materia_id = m.id
        WHERE hu.usuario_id = ? AND hu.materia_id = ?
    ");
    $stmtCheck->bind_param("ii", $usuarioId, $materiaId);
    $stmtCheck->execute();
    $resultado = $stmtCheck->get_result();
    
    if ($resultado->num_rows === 0) {
        $stmtCheck->close();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'La materia no está inscrita en tu horario'
        ]);
        exit;
    }
    
    $materia = $resultado->fetch_assoc();
    $stmtCheck->close();
    
    // Eliminar la materia del horario del usuario
    $stmtDelete = $conexion->prepare("DELETE FROM horarios_usuarios WHERE usuario_id = ? AND materia_id = ?");
    $stmtDelete->bind_param("ii", $usuarioId, $materiaId);
    $stmtDelete->execute();
    $stmtDelete->close();
    
    // Restaurar el cupo disponible (incrementar en 1)
    $stmtUpdateCupo = $conexion->prepare("UPDATE materias SET cupo_disponible = cupo_disponible + 1 WHERE id = ? AND cupo_disponible < cupo_total");
    $stmtUpdateCupo->bind_param("i", $materiaId);
    $stmtUpdateCupo->execute();
    $stmtUpdateCupo->close();
    
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'message' => "Materia \"${materia['nombre']}\" dada de baja correctamente"
    ]);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al dar de baja la materia: ' . $e->getMessage()
    ]);
}
?>
