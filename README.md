# 📅 Horario FI - Sistema de Horarios en Tiempo Real

Sistema web para la gestión de horarios escolares de la Facultad de Ingeniería, que permite a los estudiantes inscribir materias, visualizar su horario semanal y compartirlo con otros usuarios en tiempo real.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos del Sistema](#-requisitos-del-sistema)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🔐 Autenticación y Sesiones
- ✅ Sistema de login seguro con validación de credenciales
- ✅ Manejo de sesiones PHP con timeout de 8 minutos
- ✅ Verificación automática de sesión activa
- ✅ Timer visual con avisos de tiempo restante
- ✅ Cierre de sesión seguro

### 📚 Gestión de Materias
- ✅ Búsqueda avanzada por nombre, código o profesor
- ✅ Filtros por créditos (4, 6, 8, 10) y días de la semana
- ✅ Visualización de cupos disponibles en tiempo real
- ✅ Validación de traslapes de horario
- ✅ Validación de límites de créditos (40-60 créditos, máximo 60)
- ✅ Indicadores visuales de disponibilidad

### 📅 Horario Semanal
- ✅ Visualización de horario semanal (Lunes a Sábado, 7:00-20:00)
- ✅ Inscripción de materias con validaciones en tiempo real
- ✅ Dar de baja materias individuales
- ✅ Guardar horario en base de datos
- ✅ Reiniciar horario completo
- ✅ Exportar horario a PDF
- ✅ Colores diferenciados por tipo de materia (gradientes)
- ✅ Vista responsive optimizada para móviles

### 📊 Estadísticas
- ✅ Total de materias inscritas
- ✅ Total de créditos con indicador de color
- ✅ Total de horas semanales

### 🔗 Compartir Horario
- ✅ Generar enlace único para compartir horario
- ✅ Visualizar horarios compartidos
- ✅ Copiar enlace al portapapeles
- ✅ Página dedicada para ver horarios compartidos

### 📱 Diseño Responsive
- ✅ Diseño adaptativo para desktop, tablet y móvil
- ✅ Vista de tabla en pantallas grandes
- ✅ Vista de cards por días en dispositivos móviles
- ✅ Navegación intuitiva con tabs en móvil
- ✅ Interfaz táctil-friendly

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica del proyecto
- **CSS3** - Estilos personalizados con gradientes y animaciones
- **JavaScript (Vanilla)** - Lógica del cliente sin frameworks
- **Bootstrap 5.3.2** - Framework CSS para diseño responsive
- **AOS.js** - Animaciones al hacer scroll
- **html2canvas** - Captura de HTML para exportar a PDF
- **jsPDF** - Generación de archivos PDF

### Backend
- **PHP 7.4+** - Lenguaje del servidor
- **MySQL 5.7+** - Base de datos relacional
- **Apache** - Servidor web (incluido en XAMPP)

### Base de Datos
- **MySQL/MariaDB** - Sistema de gestión de base de datos
- Tablas principales:
  - `usuarios` - Información de usuarios
  - `materias` - Catálogo de materias
  - `horarios_usuarios` - Horarios guardados por usuario
  - `horarios_compartidos` - Enlaces para compartir horarios

## 📦 Requisitos del Sistema

### Servidor
- PHP 7.4 o superior
- MySQL 5.7 o superior (o MariaDB equivalente)
- Apache 2.4+ (incluido en XAMPP)
- Extensiones PHP requeridas:
  - `mysqli`
  - `json`
  - `session`

### Cliente
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Resolución mínima: 320px (móvil)

## 🚀 Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/horario-fi.git
cd horario-fi
```

### Paso 2: Configurar el Servidor

1. **Instalar XAMPP** (si no lo tienes instalado)
   - Descarga desde: https://www.apachefriends.org/
   - Instala Apache y MySQL

2. **Copiar el proyecto**
   ```bash
   # Windows
   copiar la carpeta horario-fi a C:\xampp\htdocs\
   
   # Linux/Mac
   copiar la carpeta horario-fi a /opt/lampp/htdocs/ o /Applications/XAMPP/htdocs/
   ```

### Paso 3: Configurar la Base de Datos

1. **Iniciar XAMPP**
   - Abre el Panel de Control de XAMPP
   - Inicia Apache y MySQL

2. **Acceder a phpMyAdmin**
   - Abre tu navegador y ve a: `http://localhost/phpmyadmin`

3. **Crear la base de datos**
   - Ve a la pestaña "SQL"
   - Copia y pega el contenido de `database/crear_base_datos.sql`
   - Ejecuta el script

4. **Crear tabla de horarios compartidos**
   - Ejecuta el script `database/crear_tabla_horarios_compartidos.sql`

### Paso 4: Configurar la Conexión a la Base de Datos

Edita el archivo `php/config.php` con tus credenciales:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Tu usuario de MySQL
define('DB_PASS', '');            // Tu contraseña de MySQL
define('DB_NAME', 'horario_fi');
```

### Paso 5: Acceder al Proyecto

Abre tu navegador y ve a:
```
http://localhost/horario-fi/
```

## ⚙️ Configuración

### Usuarios de Prueba

El script SQL incluye un usuario de prueba:
- **Número de cuenta:** 318232997
- **Contraseña:** 123456

### Insertar Materias

Para poblar la base de datos con materias, puedes:
1. Insertarlas manualmente desde phpMyAdmin
2. Usar scripts SQL personalizados
3. Importar desde un archivo CSV (requiere script adicional)

### Personalización

- **Colores de materias:** Edita la función `obtenerColorMateria()` en `js/app.js`
- **Límites de créditos:** Modifica las constantes en `js/app.js`:
  ```javascript
  const LIMITE_MAXIMO_CREDITOS = 60;
  const LIMITE_MINIMO_CREDITOS = 40;
  ```
- **Timeout de sesión:** Modifica en `js/login.js`:
  ```javascript
  const SESSION_TIMEOUT = 480; // 8 minutos en segundos
  ```

## 📖 Uso

### Para Estudiantes

1. **Iniciar Sesión**
   - Ingresa tu número de cuenta y contraseña
   - El sistema verificará tus credenciales

2. **Buscar Materias**
   - Usa el campo de búsqueda para encontrar materias
   - Aplica filtros por créditos o días si lo deseas
   - Revisa los cupos disponibles

3. **Inscribir Materias**
   - Haz clic en "Inscribir" en la materia deseada
   - El sistema validará traslapes y límites de créditos
   - La materia aparecerá en tu horario

4. **Gestionar Horario**
   - Visualiza tu horario semanal
   - Da de baja materias si es necesario
   - Guarda tu horario para persistencia

5. **Compartir Horario**
   - Haz clic en "Compartir Horario"
   - Copia el enlace generado
   - Comparte con tus compañeros

6. **Exportar PDF**
   - Haz clic en "Exportar PDF"
   - Descarga tu horario en formato PDF

### Para Administradores

1. **Gestionar Materias**
   - Accede a phpMyAdmin
   - Modifica la tabla `materias` según sea necesario
   - Actualiza cupos disponibles

2. **Gestionar Usuarios**
   - Accede a la tabla `usuarios` en phpMyAdmin
   - Crea, modifica o elimina usuarios

## 📁 Estructura del Proyecto

```
horario-fi/
├── css/
│   └── styles.css                    # Estilos personalizados
├── js/
│   ├── app.js                        # Lógica principal y utilidades
│   ├── login.js                      # Manejo de login y sesiones
│   ├── materias.js                   # Gestión de materias y búsqueda
│   └── horario.js                    # Gestión del horario y exportación PDF
├── php/
│   ├── config.php                    # Configuración de BD
│   ├── login.php                     # Validación de login
│   ├── logout.php                    # Cerrar sesión
│   ├── verificar_sesion.php          # Verificar sesión activa
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
│   └── crear_tabla_horarios_compartidos.sql # Tabla para compartir
├── img/
│   └── logo.png                      # Logo de la facultad
├── index.html                         # Página principal
├── README.md                          # Este archivo
└── ESPECIFICACIÓN DE REQUERIMIENTOS.pdf # Documentación del proyecto
```

## 📸 Capturas de Pantalla

### Pantalla de Login
![Login](screenshots/login.png)
*Interfaz de inicio de sesión con diseño moderno y gradientes*

### Dashboard Principal
![Dashboard](screenshots/dashboard.png)
*Vista principal con búsqueda de materias, estadísticas y horario semanal*

### Horario Semanal
![Horario](screenshots/horario.png)
*Visualización del horario semanal con materias inscritas y colores diferenciados*

### Vista Móvil
![Mobile](screenshots/mobile.png)
*Vista responsive optimizada para dispositivos móviles con navegación por tabs*

### Compartir Horario
![Compartir](screenshots/compartir.png)
*Modal para compartir el horario con enlace único*

### Exportar PDF
![PDF](screenshots/pdf.png)
*Ejemplo de horario exportado en formato PDF*

> **Nota:** Las capturas de pantalla deben agregarse en la carpeta `screenshots/` del proyecto.

## 🔌 API Endpoints

### Autenticación
- `POST /php/login.php` - Iniciar sesión
- `POST /php/logout.php` - Cerrar sesión
- `GET /php/verificar_sesion.php` - Verificar sesión activa

### Materias
- `GET /php/obtener_materias.php` - Obtener lista de materias (con filtros opcionales)
- `GET /php/obtener_materia_por_id.php?id={id}` - Obtener detalles de una materia

### Horario
- `POST /php/inscribir_materia.php` - Inscribir una materia
- `POST /php/dar_baja_materia.php` - Dar de baja una materia
- `POST /php/guardar_horario.php` - Guardar horario completo
- `POST /php/reiniciar_horario.php` - Reiniciar horario del usuario
- `GET /php/obtener_horario_usuario.php` - Obtener horario guardado

### Compartir
- `POST /php/compartir_horario.php` - Generar enlace compartido
- `GET /php/obtener_horario_compartido.php?codigo={codigo}` - Obtener horario compartido

## 🔒 Seguridad

### Implementado
- ✅ Prepared statements para prevenir SQL injection
- ✅ Validación de sesiones en el servidor
- ✅ Sanitización de entradas
- ✅ Timeout de sesión automático

### Recomendaciones para Producción
- ⚠️ Usar `password_hash()` y `password_verify()` para contraseñas
- ⚠️ Implementar protección CSRF
- ⚠️ Configurar HTTPS
- ⚠️ Implementar rate limiting para el login
- ⚠️ Validar y sanitizar todas las entradas
- ⚠️ Restringir acceso a archivos sensibles
- ⚠️ Configurar headers de seguridad
- ⚠️ Implementar logging de errores

## 🐛 Solución de Problemas

### Error: "Error de conexión"
- Verifica que Apache y MySQL estén corriendo en XAMPP
- Accede desde `http://localhost/horario-fi/` (NO desde Live Server)
- Verifica las credenciales en `php/config.php`

### Error: "Base de datos no encontrada"
- Ejecuta el script `database/crear_base_datos.sql` en phpMyAdmin
- Verifica que el nombre de la base de datos sea `horario_fi`

### Las materias no aparecen
- Verifica que la tabla `materias` tenga datos
- Revisa que las materias tengan `activa = TRUE`
- Verifica la conexión a la base de datos

### El PDF está en blanco
- Verifica que `html2canvas` y `jsPDF` estén cargados correctamente
- Revisa la consola del navegador para errores
- Asegúrate de tener materias inscritas antes de exportar

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Facultad de Ingeniería por el apoyo y requerimientos
- Bootstrap por el framework CSS
- Comunidad de desarrolladores PHP y JavaScript

## 📞 Contacto

Para preguntas o soporte:
- Email: tu-email@ejemplo.com
- GitHub Issues: [Crear un issue](https://github.com/tu-usuario/horario-fi/issues)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
