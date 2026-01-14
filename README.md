# 📅 Horario FI - Sistema de Horarios en Tiempo Real

Sistema web para la gestión de horarios escolares de la Facultad de Ingeniería, que permite a los estudiantes inscribir materias, visualizar su horario semanal y compartirlo con otros usuarios en tiempo real.

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
- ✅ Vista responsive optimizada para móviles

### 📊 Estadísticas
- ✅ Total de materias inscritas
- ✅ Total de créditos con indicador de color
- ✅ Total de horas semanales

### 🔗 Compartir Horario
- ✅ Generar enlace único para compartir horario a tus amigos
- ✅ Visualizar horarios compartidos
- ✅ Copiar enlace al portapapeles
- ✅ Página dedicada para ver horarios compartidos

### 📱 Diseño Responsive
- ✅ Diseño adaptativo para desktop, tablet y móvil
- ✅ Vista de tabla en pantallas grandes
- ✅ Vista de cards por días en dispositivos móviles
- ✅ Navegación intuitiva con tabs en móvil

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

## 👥 Autores

- **Diego Esparza Rodríguez** - *Desarrollo inicial* - [TuGitHub](https://github.com/diegoesr)

