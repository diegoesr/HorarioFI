<?php
/**
 * Archivo para obtener las materias disponibles
 * Recibe: busqueda (opcional) por GET
 * Retorna: JSON con array de materias
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuración de base de datos
require_once 'config.php';

// Obtener parámetros de búsqueda y filtros
$busqueda = isset($_GET['busqueda']) ? trim($_GET['busqueda']) : '';
$creditos = isset($_GET['creditos']) ? $_GET['creditos'] : [];
$dias = isset($_GET['dias']) ? $_GET['dias'] : [];

// Convertir créditos y días a arrays si vienen como strings
if (is_string($creditos) && !empty($creditos)) {
    $creditos = explode(',', $creditos);
}
if (is_string($dias) && !empty($dias)) {
    $dias = explode(',', $dias);
}
if (!is_array($creditos)) $creditos = [];
if (!is_array($dias)) $dias = [];

try {
    // Conectar a la base de datos
    $conexion = conectarDB();
    
    // Construir la consulta base
    $whereConditions = ["activa = TRUE"];
    $params = [];
    $types = "";
    
    // Filtro de búsqueda por texto
    if (!empty($busqueda)) {
        $whereConditions[] = "(nombre LIKE ? OR codigo LIKE ? OR profesor LIKE ?)";
        $busquedaParam = "%{$busqueda}%";
        $params[] = $busquedaParam;
        $params[] = $busquedaParam;
        $params[] = $busquedaParam;
        $types .= "sss";
    }
    
    // Filtro por créditos
    if (!empty($creditos)) {
        $creditosInt = array_map('intval', $creditos);
        $placeholders = implode(',', array_fill(0, count($creditosInt), '?'));
        $whereConditions[] = "creditos IN ($placeholders)";
        $params = array_merge($params, $creditosInt);
        $types .= str_repeat('i', count($creditosInt));
    }
    
    // Filtro por días (normalizar para manejar variaciones como "Sábado" y "Sabado")
    if (!empty($dias)) {
        $diaConditions = [];
        foreach ($dias as $dia) {
            $diaTrimmed = trim($dia);
            // Buscar tanto con tilde como sin tilde, y con espacios
            $diaConditions[] = "(dias LIKE ? OR dias LIKE ?)";
            // Con tilde y espacios
            $params[] = "%{$diaTrimmed}%";
            // Sin tilde (normalizar)
            $diaSinTilde = str_replace(['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú'], 
                                       ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'], 
                                       $diaTrimmed);
            $params[] = "%{$diaSinTilde}%";
            $types .= "ss";
        }
        if (!empty($diaConditions)) {
            $whereConditions[] = "(" . implode(" OR ", $diaConditions) . ")";
        }
    }
    
    $whereClause = implode(" AND ", $whereConditions);
    
    $query = "
        SELECT id, codigo, nombre, creditos, profesor, cupo_total, cupo_disponible, 
               hora_inicio, hora_fin, dias 
        FROM materias 
        WHERE {$whereClause}
        ORDER BY nombre, profesor
        LIMIT 100
    ";
    
    $stmt = $conexion->prepare($query);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    $materias = [];
    while ($fila = $resultado->fetch_assoc()) {
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
            'dias' => $fila['dias']
        ];
    }
    
    cerrarDB($conexion);
    
    echo json_encode([
        'status' => 'success',
        'materias' => $materias,
        'total' => count($materias)
    ]);
    
} catch (Exception $e) {
    if (isset($conexion)) {
        cerrarDB($conexion);
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener materias: ' . $e->getMessage(),
        'materias' => []
    ]);
}
?>
