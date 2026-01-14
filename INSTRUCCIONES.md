# Instrucciones de Configuración - Horario FI

## Configuración de la Base de Datos

### Paso 1: Crear la Base de Datos

1. Abre phpMyAdmin en tu navegador: `http://localhost/phpmyadmin`
2. Ve a la pestaña "SQL"
3. Copia y pega el contenido del archivo `database/crear_base_datos.sql`
4. Ejecuta el script

O desde la línea de comandos:
```bash
mysql -u root -p < database/crear_base_datos.sql
```

### Paso 2: Crear Tabla de Horarios Compartidos

1. En phpMyAdmin, ejecuta el script `database/crear_tabla_horarios_compartidos.sql`

### Paso 3: Insertar Materias (Opcional)

Si necesitas insertar o actualizar materias, puedes usar:
- `database/insertar_materias_nuevo_formato.sql` - Para insertar materias con el formato actual
- `database/insertar_o_actualizar_materias.sql` - Para insertar o actualizar materias existentes
- `database/activar_todas_las_materias.sql` - Para activar todas las materias en la base de datos

### Paso 4: Verificar Configuración

Abre el archivo `php/config.php` y verifica que las credenciales de la base de datos sean correctas:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Tu contraseña de MySQL (si tienes una)
define('DB_NAME', 'horario_fi');
```

### Paso 5: Usuarios de Prueba

El script SQL incluye usuarios de prueba:
- **Número de cuenta:** 318232997
- **Contraseña:** 123456

También puedes crear más usuarios directamente en phpMyAdmin.

## Estructura de Archivos

```
horario-fi/
├── css/
│   └── styles.css                    # Estilos del proyecto
├── js/
│   ├── app.js                        # Lógica principal y utilidades
│   ├── login.js                      # Manejo del login y sesiones
│   ├── materias.js                   # Gestión de materias y búsqueda
│   ├── horario.js                    # Gestión del horario y exportación PDF
│   └── hugeicons.js                  # Iconos SVG personalizados
├── php/
│   ├── config.php                    # Configuración de BD
│   ├── login.php                     # Validación de login
│   ├── logout.php                    # Cerrar sesión
│   ├── verificar_sesion.php         # Verificar sesión activa
│   ├── obtener_materias.php          # Obtener lista de materias
│   ├── obtener_materia_por_id.php    # Obtener detalles de una materia
│   ├── inscribir_materia.php         # Inscribir una materia
│   ├── dar_baja_materia.php          # Dar de baja una materia
│   ├── guardar_horario.php           # Guardar horario completo
│   ├── reiniciar_horario.php         # Reiniciar horario del usuario
│   ├── obtener_horario_usuario.php   # Obtener horario guardado
│   ├── compartir_horario.php         # Generar enlace compartido
│   ├── obtener_horario_compartido.php # Obtener horario compartido
│   └── ver_horario_compartido.php    # Página para ver horario compartido
├── database/
│   ├── crear_base_datos.sql          # Script principal de creación
│   ├── crear_tabla_horarios_compartidos.sql # Tabla para compartir
│   ├── insertar_materias_nuevo_formato.sql # Insertar materias
│   ├── insertar_o_actualizar_materias.sql # Insertar/actualizar materias
│   ├── activar_todas_las_materias.sql # Activar todas las materias
│   └── materias-bd.sql               # Backup de materias
├── img/
│   └── logo.png                      # Logo de la facultad
├── index.html                         # Página principal
└── INSTRUCCIONES.md                   # Este archivo
```

## Funcionalidades Implementadas

### ✅ Login y Sesiones
- Validación de credenciales contra base de datos
- Manejo de sesiones PHP
- Verificación automática de sesión activa
- Timeout de sesión de 8 minutos con avisos visuales
- Mensajes de error/success

### ✅ Gestión de Materias
- Búsqueda de materias por nombre, código o profesor
- Filtros por créditos y días de la semana
- Visualización de cupos disponibles en tiempo real
- Validación de traslapes de horario
- Validación de límites de créditos (40-60 créditos, máximo 60)

### ✅ Horario
- Visualización de horario semanal (Lunes a Sábado, 7:00-20:00)
- Inscripción de materias con validaciones
- Dar de baja materias
- Guardar horario en base de datos
- Reiniciar horario completo
- Exportar horario a PDF
- Colores diferenciados por tipo de materia (gradientes)

### ✅ Compartir Horario
- Generar enlace único para compartir horario
- Visualizar horarios compartidos
- Copiar enlace al portapapeles

### ✅ Estadísticas
- Total de materias inscritas
- Total de créditos (con indicador de color)
- Total de horas semanales

## Acceso al Proyecto

**IMPORTANTE:** Debes acceder al proyecto desde XAMPP, NO desde Live Server:

```
http://localhost/horario-fi/
```

O también puedes usar:

```
http://127.0.0.1/horario-fi/
```

## Requisitos del Sistema

- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache (incluido en XAMPP)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## Notas de Seguridad

⚠️ **IMPORTANTE:** En producción, debes:
- Usar `password_hash()` y `password_verify()` para las contraseñas
- Implementar protección CSRF
- Validar y sanitizar todas las entradas
- Usar prepared statements (ya implementado)
- Implementar rate limiting para el login
- Configurar HTTPS
- Restringir acceso a archivos sensibles

## Soporte

Para problemas o consultas, revisa:
- Los logs de PHP en `C:\xampp\php\logs\`
- La consola del navegador (F12) para errores JavaScript
- Los logs de Apache en `C:\xampp\apache\logs\`