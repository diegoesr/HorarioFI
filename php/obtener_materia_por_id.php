<?php
/**
 * Archivo para obtener una materia específica por ID
 * Recibe: id por GET
 * Retorna: JSON con la materia (incluyendo si tiene cupo o no)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuración de base de datos
require_once 'config.php';

// Obtener ID de la materia
$materiaId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

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
    
    // Preparar consulta - Obtener la materia incluso si no tiene cupo
    $stmt = $conexion->prepare("
        SELECT id, codigo, nombre, creditos, profesor, cupo_total, cupo_disponible, 
               hora_inicio, hora_fin, dias 
        FROM materias 
        WHERE id = ? AND activa = TRUE
    ");
    
    $stmt->bind_param("i", $materiaId);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) {
        $stmt->close();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'Materia no encontrada'
        ]);
        exit;
    }
    
    $fila = $resultado->fetch_assoc();
    $stmt->close();
    cerrarDB($conexion);
    
    $materia = [
        'id' => $fila['id'],
        'codigo' => $fila['codigo'],
        'nombre' => $fila['nombre'],
        'creditos' => (int)$fila['creditos'],
        'profesor' => !empty($fila['profesor']) ? $fila['profesor'] : 'Sin asignar',
        'grupo' => !empty($fila['profesor']) ? $fila['profesor'] : 'Sin asignar', // Mantener compatibilidad con código existente
        'cupo_total' => (int)$fila['cupo_total'],
        'cupos_disponibles' => (int)$fila['cupo_disponible'],
        'hora_inicio' => $fila['hora_inicio'],
        'hora_fin' => $fila['hora_fin'],
        'dias' => $fila['dias']
    ];
    
    echo json_encode([
        'status' => 'success',
        'materia' => $materia
    ]);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener la materia: ' . $e->getMessage()
    ]);
}
?>
