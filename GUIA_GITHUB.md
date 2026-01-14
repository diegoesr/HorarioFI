# 🚀 Guía para Subir el Proyecto a GitHub

## Paso 1: Crear un Repositorio en GitHub

1. **Inicia sesión en GitHub**
   - Ve a https://github.com
   - Inicia sesión con tu cuenta

2. **Crear nuevo repositorio**
   - Haz clic en el botón "+" en la esquina superior derecha
   - Selecciona "New repository"
   - Nombre del repositorio: `horario-fi` (o el que prefieras)
   - Descripción: "Sistema de Horarios en Tiempo Real para la Facultad de Ingeniería"
   - Visibilidad: Elige "Public" o "Private"
   - **NO marques** "Initialize this repository with a README" (ya tenemos uno)
   - Haz clic en "Create repository"

## Paso 2: Inicializar Git en tu Proyecto Local

Abre tu terminal o PowerShell en la carpeta del proyecto:

```bash
# Navegar a la carpeta del proyecto
cd C:\xampp\htdocs\horario-fi

# Inicializar Git (si no está inicializado)
git init

# Verificar el estado
git status
```

## Paso 3: Configurar Git (Solo la primera vez)

Si es la primera vez que usas Git en esta computadora:

```bash
# Configurar tu nombre
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu-email@ejemplo.com"
```

## Paso 4: Agregar Archivos al Repositorio

```bash
# Agregar todos los archivos (excepto los del .gitignore)
git add .

# Verificar qué archivos se agregaron
git status
```

## Paso 5: Hacer el Primer Commit

```bash
# Crear el commit inicial
git commit -m "Initial commit: Sistema de Horarios en Tiempo Real - Horario FI"

# Ver el historial
git log --oneline
```

## Paso 6: Conectar con GitHub

```bash
# Agregar el repositorio remoto (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/horario-fi.git

# Verificar la conexión
git remote -v
```

## Paso 7: Subir el Código a GitHub

```bash
# Subir el código a la rama main (o master)
git branch -M main
git push -u origin main
```

Si te pide credenciales:
- Usuario: Tu usuario de GitHub
- Contraseña: Usa un **Personal Access Token** (no tu contraseña normal)

### Crear Personal Access Token (si es necesario)

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Haz clic en "Generate new token"
3. Selecciona los permisos: `repo` (acceso completo a repositorios)
4. Copia el token generado
5. Úsalo como contraseña cuando Git lo solicite

## Paso 8: Verificar en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/TU-USUARIO/horario-fi`
2. Verifica que todos los archivos estén presentes
3. El README.md debería mostrarse automáticamente

## Comandos Útiles para el Futuro

### Actualizar el Repositorio

```bash
# Ver cambios
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir cambios
git push origin main
```

### Crear una Nueva Rama

```bash
# Crear y cambiar a nueva rama
git checkout -b nombre-de-la-rama

# Hacer cambios y commit
git add .
git commit -m "Cambios en nueva funcionalidad"

# Subir la nueva rama
git push origin nombre-de-la-rama
```

### Ver Historial

```bash
# Ver commits
git log --oneline

# Ver cambios específicos
git diff
```

## Solución de Problemas

### Error: "remote origin already exists"
```bash
# Eliminar el remoto existente
git remote remove origin

# Agregar nuevamente
git remote add origin https://github.com/TU-USUARIO/horario-fi.git
```

### Error: "failed to push some refs"
```bash
# Primero hacer pull
git pull origin main --allow-unrelated-histories

# Luego hacer push
git push origin main
```

### Olvidaste agregar un archivo
```bash
# Agregar el archivo
git add nombre-del-archivo

# Hacer commit
git commit -m "Agregar archivo faltante"

# Push
git push origin main
```

## Agregar Capturas de Pantalla

1. **Crear carpeta para screenshots**
   ```bash
   mkdir screenshots
   ```

2. **Agregar capturas de pantalla**
   - Toma capturas de las principales pantallas
   - Guárdalas en la carpeta `screenshots/`
   - Nombres sugeridos:
     - `login.png`
     - `dashboard.png`
     - `horario.png`
     - `mobile.png`
     - `compartir.png`
     - `pdf.png`

3. **Actualizar el README**
   - Las rutas de las imágenes ya están en el README.md
   - Solo asegúrate de que los nombres coincidan

4. **Subir las imágenes**
   ```bash
   git add screenshots/
   git commit -m "Agregar capturas de pantalla"
   git push origin main
   ```

## Personalizar el README

Antes de subir, edita el `README.md` y reemplaza:
- `tu-usuario` → Tu usuario de GitHub
- `Tu Nombre` → Tu nombre real
- `tu-email@ejemplo.com` → Tu email
- Agrega tu información de contacto

## ¡Listo! 🎉

Tu proyecto ahora está en GitHub y listo para compartir con el mundo.
