<?php
/**
 * Archivo para obtener el horario guardado del usuario
 * Retorna: JSON con las materias inscritas del usuario
 */

// Iniciar sesión ANTES de cualquier output
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuración de base de datos
require_once 'config.php';

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Debes iniciar sesión',
        'materias' => []
    ]);
    exit;
}

$usuarioId = $_SESSION['usuario_id'];

try {
    // Conectar a la base de datos
    $conexion = conectarDB();
    
    // Obtener materias inscritas del usuario
    // Usar LEFT JOIN para detectar materias que no existen o están inactivas
    $stmt = $conexion->prepare("
        SELECT m.id, m.codigo, m.nombre, m.creditos, m.profesor, m.cupo_total, m.cupo_disponible,
               m.hora_inicio, m.hora_fin, m.dias, m.activa, hu.fecha_inscripcion,
               CASE 
                   WHEN m.id IS NULL THEN 'NO_EXISTE'
                   WHEN m.activa = FALSE THEN 'INACTIVA'
                   ELSE 'ACTIVA'
               END as estado_materia
        FROM horarios_usuarios hu
        LEFT JOIN materias m ON hu.materia_id = m.id
        WHERE hu.usuario_id = ?
        ORDER BY m.nombre, m.profesor
    ");
    
    $stmt->bind_param("i", $usuarioId);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    $materias = [];
    $materiasProblema = [];
    
    while ($fila = $resultado->fetch_assoc()) {
        $estadoMateria = $fila['estado_materia'] ?? 'ACTIVA';
        
        // Si la materia no existe o está inactiva, agregarla a la lista de problemas
        if ($estadoMateria !== 'ACTIVA') {
            $materiasProblema[] = [
                'materia_id' => $fila['id'],
                'codigo' => $fila['codigo'] ?? 'N/A',
                'nombre' => $fila['nombre'] ?? 'Materia no encontrada',
                'estado' => $estadoMateria,
                'fecha_inscripcion' => $fila['fecha_inscripcion']
            ];
            
            // Si la materia no existe, no la incluimos en el horario normal
            if ($estadoMateria === 'NO_EXISTE') {
                continue;
            }
        }
        
        // Solo incluir materias activas en el horario normal
        if ($estadoMateria === 'ACTIVA') {
            $materias[] = [
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
                'dias' => $fila['dias'],
                'fecha_inscripcion' => $fila['fecha_inscripcion']
            ];
        }
    }
    
    $stmt->close();
    cerrarDB($conexion);
    
    $respuesta = [
        'status' => 'success',
        'materias' => $materias,
        'total' => count($materias)
    ];
    
    // Si hay materias con problemas, incluirlas en la respuesta para diagnóstico
    if (!empty($materiasProblema)) {
        $respuesta['materias_con_problema'] = $materiasProblema;
        $respuesta['advertencia'] = 'Se encontraron materias inactivas o que no existen en tu horario';
    }
    
    echo json_encode($respuesta);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener el horario: ' . $e->getMessage(),
        'materias' => []
    ]);
}
?>
