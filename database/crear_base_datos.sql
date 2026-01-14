-- ============================================
-- Script SQL para crear la base de datos
-- Base de datos: horario_fi
-- ============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS horario_fi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE horario_fi;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_numero_cuenta (numero_cuenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de materias
CREATE TABLE IF NOT EXISTS materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    creditos INT NOT NULL DEFAULT 0,
    profesor VARCHAR(100) NOT NULL DEFAULT 'Sin asignar',
    cupo_total INT NOT NULL DEFAULT 25,
    cupo_disponible INT NOT NULL DEFAULT 25,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dias VARCHAR(50) NOT NULL COMMENT 'Días separados por coma: Lunes,Martes,Miércoles',
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_codigo_profesor (codigo, profesor),
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios de usuarios (materias inscritas)
CREATE TABLE IF NOT EXISTS horarios_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    materia_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_materia (usuario_id, materia_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_materia (materia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario de prueba
-- Contraseña: 123456 (en producción debe estar hasheada)
INSERT INTO usuarios (numero_cuenta, nombre, apellido, password) VALUES
('318232997', 'Usuario', 'Prueba', '123456'),
('123456789', 'Juan', 'Pérez', '123456'),
('987654321', 'María', 'González', '123456');

-- Insertar materias de ejemplo
-- Nota: Se usa INSERT IGNORE para evitar errores si ya existen
-- Ejemplo con el nuevo formato (profesor en lugar de grupo, cupo de 25, 2 días a la semana, 2 horas)
INSERT IGNORE INTO materias (codigo, nombre, creditos, profesor, cupo_total, cupo_disponible, hora_inicio, hora_fin, dias) VALUES
('MAT101', 'Matemáticas I', 8, 'Dr. Ejemplo Profesor', 25, 25, '07:00:00', '09:00:00', 'Lunes,Miércoles'),
('FIS101', 'Física I', 8, 'Mtra. Ejemplo Profesora', 25, 25, '09:00:00', '11:00:00', 'Martes,Jueves'),
('PRO101', 'Programación I', 10, 'Dr. Otro Profesor', 25, 25, '11:00:00', '13:00:00', 'Lunes,Miércoles');
