<?php
/**
 * Archivo para guardar el horario del usuario
 * Recibe: materias (array de IDs de materias) por POST
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
        'message' => 'Debes iniciar sesión para guardar tu horario'
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];

// Obtener materias del POST
$materiasJson = isset($_POST['materias']) ? $_POST['materias'] : '[]';
$materias = json_decode($materiasJson, true);

if (!is_array($materias)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Formato de datos inválido'
    ]);
    exit;
}

try {
    // Conectar a la base de datos
    $conexion = conectarDB();
    
    // Iniciar transacción
    $conexion->begin_transaction();
    
    // Obtener materias anteriores del usuario para restaurar cupos
    $stmtGetAnteriores = $conexion->prepare("SELECT materia_id FROM horarios_usuarios WHERE usuario_id = ?");
    $stmtGetAnteriores->bind_param("i", $usuarioId);
    $stmtGetAnteriores->execute();
    $resultadoAnteriores = $stmtGetAnteriores->get_result();
    
    $materiasAnteriores = [];
    while ($fila = $resultadoAnteriores->fetch_assoc()) {
        $materiasAnteriores[] = $fila['materia_id'];
    }
    $stmtGetAnteriores->close();
    
    // Restaurar cupos de materias que se eliminan
    $materiasAEliminar = array_diff($materiasAnteriores, $materias);
    if (!empty($materiasAEliminar)) {
        $stmtRestaurarCupo = $conexion->prepare("UPDATE materias SET cupo_disponible = cupo_disponible + 1 WHERE id = ?");
        foreach ($materiasAEliminar as $materiaIdEliminar) {
            $stmtRestaurarCupo->bind_param("i", $materiaIdEliminar);
            $stmtRestaurarCupo->execute();
        }
        $stmtRestaurarCupo->close();
    }
    
    // Eliminar horarios anteriores del usuario
    $stmtDelete = $conexion->prepare("DELETE FROM horarios_usuarios WHERE usuario_id = ?");
    $stmtDelete->bind_param("i", $usuarioId);
    $stmtDelete->execute();
    $stmtDelete->close();
    
    // Insertar nuevas materias inscritas y actualizar cupos
    $stmtInsert = $conexion->prepare("INSERT INTO horarios_usuarios (usuario_id, materia_id) VALUES (?, ?)");
    $stmtUpdateCupo = $conexion->prepare("UPDATE materias SET cupo_disponible = cupo_disponible - 1 WHERE id = ?");
    $materiasInsertadas = 0;
    
    foreach ($materias as $materiaId) {
        // Verificar que la materia existe y tiene cupo
        $stmtCheck = $conexion->prepare("SELECT id, cupo_disponible FROM materias WHERE id = ? AND activa = TRUE");
        $stmtCheck->bind_param("i", $materiaId);
        $stmtCheck->execute();
        $resultado = $stmtCheck->get_result();
        
        if ($resultado->num_rows > 0) {
            $materia = $resultado->fetch_assoc();
            
            // Verificar cupo disponible (solo si no estaba ya inscrita)
            $yaEstabaInscrita = in_array($materiaId, $materiasAnteriores);
            
            if ($yaEstabaInscrita || $materia['cupo_disponible'] > 0) {
                $stmtInsert->bind_param("ii", $usuarioId, $materiaId);
                $stmtInsert->execute();
                
                // Solo actualizar cupo si no estaba ya inscrita
                if (!$yaEstabaInscrita) {
                    $stmtUpdateCupo->bind_param("i", $materiaId);
                    $stmtUpdateCupo->execute();
                }
                
                $materiasInsertadas++;
            }
        }
        $stmtCheck->close();
    }
    
    $stmtInsert->close();
    $stmtUpdateCupo->close();
    
    // Confirmar transacción
    $conexion->commit();
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'message' => "Horario guardado correctamente. ${materiasInsertadas} materia(s) inscrita(s).",
        'materias_guardadas' => $materiasInsertadas
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    if (isset($conexion)) {
        $conexion->rollback();
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al guardar el horario: ' . $e->getMessage()
    ]);
}
?>
