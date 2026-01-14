// ============================================
// FUNCIONALIDAD DE LOGIN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una sesión activa al cargar la página
    verificarSesionActiva();
    
    // Toggle para mostrar/ocultar contraseña
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar icono SVG
            const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            
            if (type === 'password') {
                togglePassword.innerHTML = eyeOffIcon;
            } else {
                togglePassword.innerHTML = eyeIcon;
            }
        });
    }

    // Manejo del formulario de login
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const numeroCuenta = document.getElementById('numero-cuenta').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Validación básica
            if (!numeroCuenta || !password) {
                mostrarMensaje('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Deshabilitar botón durante la petición
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; animation: spin 1s linear infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span> Iniciando sesión...';
            
            // Crear FormData para enviar datos
            const formData = new FormData();
            formData.append('numero_cuenta', numeroCuenta);
            formData.append('password', password);
            
            // Realizar petición AJAX al servidor
            fetch('php/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                
                // Obtener el texto de la respuesta primero para debug
                return response.text().then(text => {
                    
                    // Intentar parsear como JSON
                    try {
                        const data = JSON.parse(text);
                        return { ok: response.ok, data: data };
                    } catch (e) {
                        console.error('Error al parsear JSON:', e);
                        throw new Error('El servidor no está respondiendo en formato JSON. Respuesta: ' + text.substring(0, 200));
                    }
                });
            })
            .then(result => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Ingresar';
                
                const data = result.data;
                
                if (result.ok && data.status === 'success') {
                    // Login exitoso
                    mostrarMensaje('Login exitoso. Redirigiendo...', 'success');
                    
                    // Guardar información del usuario
                    if (data.usuario) {
                        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
                        const usuarioNombreEl = document.getElementById('usuario-nombre');
                        if (usuarioNombreEl) {
                            usuarioNombreEl.textContent = data.usuario.nombre_completo;
                        }
                    }
                    
                    // Mostrar sección principal después de un breve delay
                    setTimeout(() => {
                        mostrarSeccionPrincipal();
                    }, 500);
                } else {
                    // Error en el login
                    const mensajeError = data.message || data.error || 'Error al iniciar sesión';
                    console.error('Error en login:', mensajeError);
                    mostrarMensaje(mensajeError, 'error');
                }
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Ingresar';
                console.error('Error completo:', error);
                console.error('Stack trace:', error.stack);
                
                // Mensaje más específico según el tipo de error
                let mensajeError = 'Error de conexión. ';
                
                if (error.message) {
                    mensajeError += error.message;
                } else if (error.message && error.message.includes('servidor no está respondiendo')) {
                    mensajeError += 'Asegúrate de usar XAMPP y acceder desde: http://localhost/horario-fi/';
                } else {
                    mensajeError += 'Por favor, verifica que Apache esté corriendo en XAMPP. Revisa la consola del navegador (F12) para más detalles.';
                }
                
                mostrarMensaje(mensajeError, 'error');
            });
        });
    }
});

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo = 'info') {
    
    // Buscar si ya existe un mensaje
    let mensajeDiv = document.getElementById('mensaje-login');
    
    // Si no existe, crear uno nuevo
    if (!mensajeDiv) {
        mensajeDiv = document.createElement('div');
        mensajeDiv.id = 'mensaje-login';
        mensajeDiv.style.position = 'fixed';
        mensajeDiv.style.top = '100px';
        mensajeDiv.style.right = '20px';
        mensajeDiv.style.zIndex = '99999';
        mensajeDiv.style.minWidth = '350px';
        mensajeDiv.style.maxWidth = '500px';
        document.body.appendChild(mensajeDiv);
    }
    
    // Configurar clases según el tipo
    const alertClass = tipo === 'error' ? 'danger' : tipo === 'success' ? 'success' : 'info';
    mensajeDiv.className = `alert alert-${alertClass} alert-dismissible fade show`;
    mensajeDiv.innerHTML = `
        <strong>${tipo === 'error' ? '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>Error:' : tipo === 'success' ? '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>Éxito:' : '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>Info:'}</strong>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Asegurar que el mensaje sea visible
    mensajeDiv.style.display = 'block';
    
    // Auto-ocultar después de unos segundos
    const tiempoAutoCierre = tipo === 'success' ? 3000 : tipo === 'error' ? 5000 : 4000;
    setTimeout(() => {
        if (mensajeDiv && mensajeDiv.parentElement) {
            try {
                const bsAlert = new bootstrap.Alert(mensajeDiv);
                bsAlert.close();
            } catch (e) {
                mensajeDiv.remove();
            }
        }
    }, tiempoAutoCierre);
}

// Variables globales para el timer de sesión
let sessionTimer = null;
let sessionTimeLeft = 480; // 8 minutos en segundos (480 segundos)
let warningShown = false;

// Función para iniciar el timer de sesión
function iniciarTimerSesion() {
    // Verificar si hay un tiempo guardado en sessionStorage
    const tiempoGuardado = sessionStorage.getItem('sessionStartTime');
    const tiempoActual = Date.now();
    
    if (tiempoGuardado) {
        // Calcular tiempo transcurrido desde el inicio de la sesión
        const tiempoTranscurrido = Math.floor((tiempoActual - parseInt(tiempoGuardado)) / 1000);
        sessionTimeLeft = Math.max(0, 480 - tiempoTranscurrido);
        
        // Si ya pasaron los 8 minutos, cerrar sesión
        if (sessionTimeLeft <= 0) {
            cerrarSesionPorTimeout();
            return;
        }
    } else {
        // Primera vez que se inicia la sesión
        sessionTimeLeft = 480; // 8 minutos
        sessionStorage.setItem('sessionStartTime', tiempoActual.toString());
    }
    
    warningShown = false;
    
    // Mostrar el contador
    const timerDisplay = document.getElementById('timer-display');
    const timerText = document.getElementById('timer-text');
    
    if (timerDisplay && timerText) {
        timerDisplay.style.display = 'inline-flex';
        actualizarDisplayTimer();
    }
    
    // Limpiar timer anterior si existe
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    // Crear nuevo timer que se ejecuta cada segundo
    sessionTimer = setInterval(() => {
        sessionTimeLeft--;
        actualizarDisplayTimer();
        
        // Mostrar advertencia cuando queden 60 segundos (1 minuto)
        if (sessionTimeLeft === 60 && !warningShown) {
            mostrarAdvertenciaTimeout();
            warningShown = true;
        }
        
        // Cerrar sesión cuando el tiempo se agote
        if (sessionTimeLeft <= 0) {
            clearInterval(sessionTimer);
            cerrarSesionPorTimeout();
        }
    }, 1000);
}

// Función para actualizar el display del timer
function actualizarDisplayTimer() {
    const timerText = document.getElementById('timer-text');
    const timerDisplay = document.getElementById('timer-display');
    
    if (timerText && timerDisplay) {
        const minutos = Math.floor(sessionTimeLeft / 60);
        const segundos = sessionTimeLeft % 60;
        const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        
        timerText.textContent = tiempoFormateado;
        
        // Agregar clase de urgencia cuando queden menos de 60 segundos
        if (sessionTimeLeft <= 60) {
            timerDisplay.classList.add('timer-urgente');
        } else {
            timerDisplay.classList.remove('timer-urgente');
        }
    }
}

// Función para mostrar advertencia de timeout
function mostrarAdvertenciaTimeout() {
    const mensaje = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 10000; min-width: 350px;">
            <h5 class="alert-heading">
                <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>¡Tiempo por agotarse!
            </h5>
            <p class="mb-2">Tu sesión expirará en <strong>1 minuto</strong>.</p>
            <p class="mb-0">Por favor, guarda tu horario antes de que se cierre la sesión automáticamente.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Insertar el mensaje en el body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mensaje;
    document.body.appendChild(tempDiv.firstElementChild);
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert-warning');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 10000);
}

// Función para cerrar sesión por timeout
function cerrarSesionPorTimeout() {
    // Limpiar timer guardado
    sessionStorage.removeItem('sessionStartTime');
    
    // Mostrar mensaje de sesión expirada
    const mensaje = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; min-width: 400px; text-align: center;">
            <h5 class="alert-heading">
                <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>Sesión Expirada
            </h5>
            <p class="mb-0">Tu sesión ha expirado por inactividad. Serás redirigido al login.</p>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mensaje;
    document.body.appendChild(tempDiv.firstElementChild);
    
    // Cerrar sesión después de 2 segundos
    setTimeout(() => {
        cerrarSesion();
    }, 2000);
}

// Función para resetear el timer (opcional, si quieres resetear cuando el usuario hace acciones)
function resetearTimerSesion() {
    // Guardar nuevo tiempo de inicio
    const tiempoActual = Date.now();
    sessionStorage.setItem('sessionStartTime', tiempoActual.toString());
    
    sessionTimeLeft = 480; // Resetear a 8 minutos
    warningShown = false;
    
    // Reiniciar el timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    iniciarTimerSesion();
}

// Función para detener el timer
function detenerTimerSesion() {
    if (sessionTimer) {
        clearInterval(sessionTimer);
        sessionTimer = null;
    }
    
    // Ocultar el display del timer
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.style.display = 'none';
    }
}

// Función para limpiar completamente el horario y estadísticas
function limpiarHorarioYEstadisticas() {
    // Limpiar array de materias inscritas
    if (typeof window.materiasInscritas !== 'undefined') {
        window.materiasInscritas.length = 0;
    }
    if (typeof materiasInscritas !== 'undefined') {
        materiasInscritas.length = 0;
    }
    
    // Limpiar el horario visual completamente - reinicializar la tabla
    // La mejor forma es reinicializar la tabla completa
    if (typeof inicializarHorario === 'function') {
        inicializarHorario(); // Esto recrea todas las filas limpias
    } else {
        // Fallback: limpiar manualmente
        const tbody = document.getElementById('horario-tbody');
        if (tbody) {
            const filas = tbody.querySelectorAll('tr');
            filas.forEach(fila => {
                // Limpiar todas las celdas excepto la primera (hora)
                const celdas = fila.querySelectorAll('td[data-dia]');
                celdas.forEach(celda => {
                    celda.innerHTML = '';
                    celda.removeAttribute('rowspan');
                    celda.style.backgroundColor = '';
                    celda.removeAttribute('data-materia-id');
                });
            });
        }
    }
    
    // Reiniciar estadísticas a 0
    const statMaterias = document.getElementById('stat-materias');
    const statCreditos = document.getElementById('stat-creditos');
    const statHoras = document.getElementById('stat-horas');
    
    if (statMaterias) statMaterias.textContent = '0';
    if (statCreditos) {
        statCreditos.textContent = '0';
        statCreditos.style.color = '';
    }
    if (statHoras) statHoras.textContent = '0';
    
    // Limpiar lista de materias disponibles
    const materiasDisponibles = document.getElementById('materias-disponibles');
    if (materiasDisponibles) {
        materiasDisponibles.innerHTML = `
            <p class="text-muted text-center mb-0 py-3">
                <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                Ingresa un término de búsqueda...
            </p>
        `;
    }
    
    // Limpiar campo de búsqueda
    const busquedaInput = document.getElementById('busqueda-materia');
    if (busquedaInput) {
        busquedaInput.value = '';
    }
}

// Función para mostrar la sección principal después del login
function mostrarSeccionPrincipal() {
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-section');
    
    if (loginSection && mainSection) {
        // Primero limpiar completamente el horario y estadísticas del usuario anterior
        limpiarHorarioYEstadisticas();
        
        loginSection.classList.add('d-none');
        mainSection.classList.remove('d-none');
        
        // Ocultar el header principal también
        const mainHeader = document.querySelector('.main-header');
        if (mainHeader) {
            mainHeader.classList.add('d-none');
        }
        
        // Reinicializar la tabla de horario (limpia y recrea las filas)
        if (typeof inicializarHorario === 'function') {
            inicializarHorario();
        }
        
        // Cargar horario guardado del nuevo usuario
        cargarHorarioGuardado();
        
        // Iniciar el timer de sesión
        iniciarTimerSesion();
    }
}

// Función para cargar el horario guardado del usuario
async function cargarHorarioGuardado() {
    try {
        // Asegurarse de que el array esté limpio antes de cargar
        if (typeof window.materiasInscritas !== 'undefined') {
            window.materiasInscritas.length = 0;
        }
        if (typeof materiasInscritas !== 'undefined') {
            materiasInscritas.length = 0;
        }
        
        // Reiniciar estadísticas a 0 antes de cargar
        const statMaterias = document.getElementById('stat-materias');
        const statCreditos = document.getElementById('stat-creditos');
        const statHoras = document.getElementById('stat-horas');
        
        if (statMaterias) statMaterias.textContent = '0';
        if (statCreditos) {
            statCreditos.textContent = '0';
            statCreditos.style.color = '';
        }
        if (statHoras) statHoras.textContent = '0';
        
        const response = await fetch('php/obtener_horario_usuario.php');
        const data = await response.json();
        
        if (data.status === 'success' && data.materias && data.materias.length > 0) {
            // Cargar materias en el array global
            if (typeof window.materiasInscritas !== 'undefined') {
                window.materiasInscritas.push(...data.materias);
            } else {
                window.materiasInscritas = [...data.materias];
            }
            
            // Agregar materias al horario visual
            data.materias.forEach(materia => {
                if (typeof agregarMateriaAlHorario === 'function') {
                    agregarMateriaAlHorario(materia);
                }
            });
            
            // Actualizar estadísticas después de agregar todas las materias
            setTimeout(() => {
                if (typeof actualizarEstadisticas === 'function') {
                    actualizarEstadisticas();
                }
                // Actualizar vista móvil
                if (typeof actualizarVistaMovilHorario === 'function') {
                    actualizarVistaMovilHorario();
                }
            }, 200);
        } else {
            // Si no hay materias, asegurarse de que las estadísticas estén en 0
            if (typeof actualizarEstadisticas === 'function') {
                actualizarEstadisticas();
            }
        }
    } catch (error) {
        console.error('Error al cargar horario guardado:', error);
        // En caso de error, asegurarse de que las estadísticas estén en 0
        if (typeof actualizarEstadisticas === 'function') {
            actualizarEstadisticas();
        }
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Detener el timer de sesión
    detenerTimerSesion();
    
    // Limpiar completamente el horario y estadísticas
    limpiarHorarioYEstadisticas();
    
    // Limpiar sesión del navegador
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('sessionStartTime');
    
    // Hacer petición al servidor para cerrar sesión
    fetch('php/logout.php', {
        method: 'POST'
    }).catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
    
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-section');
    const mainHeader = document.querySelector('.main-header');
    
    if (loginSection && mainSection) {
        mainSection.classList.add('d-none');
        loginSection.classList.remove('d-none');
        
        // Mostrar header principal nuevamente
        if (mainHeader) {
            mainHeader.classList.remove('d-none');
        }
        
        // Limpiar formulario
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.reset();
        }
        
        // Limpiar nombre de usuario
        const usuarioNombre = document.getElementById('usuario-nombre');
        if (usuarioNombre) {
            usuarioNombre.textContent = '';
        }
    }
}

// Función para verificar si hay una sesión activa al cargar la página
async function verificarSesionActiva() {
    try {
        // Primero limpiar todo por si acaso hay datos residuales
        limpiarHorarioYEstadisticas();
        
        const response = await fetch('php/verificar_sesion.php');
        const data = await response.json();
        
        if (data.status === 'success' && data.sesion_activa && data.usuario) {
            // Hay una sesión activa, restaurar la sesión
            sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            const usuarioNombreEl = document.getElementById('usuario-nombre');
            if (usuarioNombreEl) {
                usuarioNombreEl.textContent = data.usuario.nombre_completo;
            }
            
            // Mostrar sección principal (esto limpiará y cargará el horario del usuario)
            mostrarSeccionPrincipal();
        } else {
            // No hay sesión activa, limpiar todo y mostrar login
            limpiarHorarioYEstadisticas();
            
            const loginSection = document.getElementById('login-section');
            const mainSection = document.getElementById('main-section');
            
            if (loginSection && mainSection) {
                loginSection.classList.remove('d-none');
                mainSection.classList.add('d-none');
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        // En caso de error, limpiar todo y mostrar login
        limpiarHorarioYEstadisticas();
        
        const loginSection = document.getElementById('login-section');
        const mainSection = document.getElementById('main-section');
        
        if (loginSection && mainSection) {
            loginSection.classList.remove('d-none');
            mainSection.classList.add('d-none');
        }
    }
}

// Event listener para el botón de cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', cerrarSesion);
    }
});
