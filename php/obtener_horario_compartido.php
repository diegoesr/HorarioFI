<?php
/**
 * Archivo para obtener un horario compartido por código
 * Recibe: codigo (GET)
 * Retorna: JSON con status y datos del horario compartido
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Obtener código del GET
$codigo = isset($_GET['codigo']) ? trim($_GET['codigo']) : '';

if (empty($codigo)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Código de compartir no proporcionado'
    ]);
    exit;
}

try {
    $conexion = conectarDB();
    
    // Buscar horario compartido activo
    $stmt = $conexion->prepare("
        SELECT 
            hc.id,
            hc.usuario_id,
            hc.codigo_compartido,
            hc.activo,
            hc.fecha_creacion,
            u.nombre,
            u.apellido,
            u.numero_cuenta
        FROM horarios_compartidos hc
        INNER JOIN usuarios u ON hc.usuario_id = u.id
        WHERE hc.codigo_compartido = ? AND hc.activo = TRUE
        AND (hc.fecha_expiracion IS NULL OR hc.fecha_expiracion > NOW())
    ");
    $stmt->bind_param("s", $codigo);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) {
        $stmt->close();
        cerrarDB($conexion);
        echo json_encode([
            'status' => 'error',
            'message' => 'Código de compartir no válido o expirado'
        ]);
        exit;
    }
    
    $horarioCompartido = $resultado->fetch_assoc();
    $usuarioId = $horarioCompartido['usuario_id'];
    $stmt->close();
    
    // Obtener materias del horario compartido
    $stmtMaterias = $conexion->prepare("
        SELECT 
            m.id,
            m.codigo,
            m.nombre,
            m.creditos,
            m.profesor,
            m.hora_inicio,
            m.hora_fin,
            m.dias
        FROM horarios_usuarios hu
        INNER JOIN materias m ON hu.materia_id = m.id
        WHERE hu.usuario_id = ?
        ORDER BY m.nombre, m.profesor
    ");
    $stmtMaterias->bind_param("i", $usuarioId);
    $stmtMaterias->execute();
    $resultadoMaterias = $stmtMaterias->get_result();
    
    $materias = [];
    while ($materia = $resultadoMaterias->fetch_assoc()) {
        $materias[] = $materia;
    }
    $stmtMaterias->close();
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'usuario' => [
            'nombre' => $horarioCompartido['nombre'],
            'apellido' => $horarioCompartido['apellido'],
            'nombre_completo' => $horarioCompartido['nombre'] . ' ' . $horarioCompartido['apellido'],
            'numero_cuenta' => $horarioCompartido['numero_cuenta']
        ],
        'materias' => $materias,
        'fecha_creacion' => $horarioCompartido['fecha_creacion']
    ]);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener horario compartido: ' . $e->getMessage()
    ]);
}
?>
