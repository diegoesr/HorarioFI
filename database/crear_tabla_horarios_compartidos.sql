-- ============================================
-- Script SQL para crear la tabla de horarios compartidos
-- Permite compartir horarios con un código único
-- ============================================

USE horario_fi;

-- Tabla de horarios compartidos
CREATE TABLE IF NOT EXISTS horarios_compartidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    codigo_compartido VARCHAR(32) UNIQUE NOT NULL COMMENT 'Código único para compartir el horario',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Si está activo, el enlace funciona',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL COMMENT 'Fecha de expiración del enlace (opcional)',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_codigo (codigo_compartido),
    INDEX idx_usuario (usuario_id),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
