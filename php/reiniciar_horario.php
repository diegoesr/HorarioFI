<?php
/**
 * Archivo para reiniciar/eliminar completamente el horario del usuario
 * Elimina todas las materias inscritas y restaura los cupos disponibles
 * Retorna: JSON con status y mensaje
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
        'message' => 'Debes iniciar sesión para reiniciar tu horario'
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];

try {
    $conexion = conectarDB();
    
    // Iniciar transacción
    $conexion->begin_transaction();
    
    // Obtener todas las materias del usuario para restaurar cupos
    $stmtGetMaterias = $conexion->prepare("SELECT materia_id FROM horarios_usuarios WHERE usuario_id = ?");
    $stmtGetMaterias->bind_param("i", $usuarioId);
    $stmtGetMaterias->execute();
    $resultadoMaterias = $stmtGetMaterias->get_result();
    
    $materiasIds = [];
    while ($fila = $resultadoMaterias->fetch_assoc()) {
        $materiasIds[] = $fila['materia_id'];
    }
    $stmtGetMaterias->close();
    
    // Restaurar cupos disponibles de todas las materias
    if (!empty($materiasIds)) {
        $stmtRestaurarCupo = $conexion->prepare("UPDATE materias SET cupo_disponible = cupo_disponible + 1 WHERE id = ? AND cupo_disponible < cupo_total");
        foreach ($materiasIds as $materiaId) {
            $stmtRestaurarCupo->bind_param("i", $materiaId);
            $stmtRestaurarCupo->execute();
        }
        $stmtRestaurarCupo->close();
    }
    
    // Eliminar todas las materias del horario del usuario
    $stmtDelete = $conexion->prepare("DELETE FROM horarios_usuarios WHERE usuario_id = ?");
    $stmtDelete->bind_param("i", $usuarioId);
    $stmtDelete->execute();
    $materiasEliminadas = $stmtDelete->affected_rows;
    $stmtDelete->close();
    
    // Confirmar transacción
    $conexion->commit();
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'message' => "Horario reiniciado correctamente. ${materiasEliminadas} materia(s) eliminada(s).",
        'materias_eliminadas' => $materiasEliminadas
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    if (isset($conexion)) {
        $conexion->rollback();
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al reiniciar el horario: ' . $e->getMessage()
    ]);
}
?>
