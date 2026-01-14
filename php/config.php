<?php
/**
 * Configuración de la Base de Datos
 * Archivo de conexión a MySQL
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'horario_fi');

/**
 * Función para conectar a la base de datos
 * @return mysqli|false Retorna la conexión o false en caso de error
 */
function conectarDB() {
    $conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Verificar conexión
    if ($conexion->connect_error) {
        die("Error de conexión: " . $conexion->connect_error);
    }
    
    // Establecer charset UTF-8
    $conexion->set_charset("utf8");
    
    return $conexion;
}

/**
 * Función para cerrar la conexión
 * @param mysqli $conexion Conexión a cerrar
 */
function cerrarDB($conexion) {
    if ($conexion) {
        $conexion->close();
    }
}
?>
