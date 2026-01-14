// ============================================
// GESTIÓN DE MATERIAS
// ============================================

// Esta función se conectará con el backend PHP para obtener las materias
async function obtenerMaterias(busqueda = '', creditos = [], dias = []) {
    try {
        // Construir parámetros de URL
        const params = new URLSearchParams();
        if (busqueda) {
            params.append('busqueda', busqueda);
        }
        if (creditos.length > 0) {
            params.append('creditos', creditos.join(','));
        }
        if (dias.length > 0) {
            params.append('dias', dias.join(','));
        }
        
        const response = await fetch(`php/obtener_materias.php?${params.toString()}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.materias) {
            return data.materias;
        } else {
            console.error('Error en la respuesta:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error al obtener materias:', error);
        return [];
    }
}

// Función para obtener los filtros activos
function obtenerFiltrosActivos() {
    const creditosSeleccionados = [];
    document.querySelectorAll('.filtro-creditos:checked').forEach(checkbox => {
        creditosSeleccionados.push(checkbox.value);
    });
    
    const diasSeleccionados = [];
    document.querySelectorAll('.filtro-dias:checked').forEach(checkbox => {
        diasSeleccionados.push(checkbox.value);
    });
    
    return {
        creditos: creditosSeleccionados,
        dias: diasSeleccionados
    };
}

// Función para aplicar filtros y búsqueda
async function aplicarFiltrosYBusqueda() {
    const busqueda = document.getElementById('busqueda-materia')?.value.trim() || '';
    const filtros = obtenerFiltrosActivos();
    
    // Si hay filtros activos o búsqueda, realizar la consulta
    if (busqueda.length >= 2 || filtros.creditos.length > 0 || filtros.dias.length > 0) {
        const materias = await obtenerMaterias(busqueda, filtros.creditos, filtros.dias);
        mostrarMateriasDisponibles(materias);
    } else {
        // Si no hay filtros ni búsqueda, mostrar mensaje inicial
        const contenedor = document.getElementById('materias-disponibles');
        if (contenedor) {
            contenedor.innerHTML = `
                <p class="text-muted text-center mb-0 py-3">
                    <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                    Ingresa un término de búsqueda o selecciona filtros...
                </p>
            `;
        }
    }
}

// Función para mostrar materias disponibles
function mostrarMateriasDisponibles(materias) {
    const contenedor = document.getElementById('materias-disponibles');
    if (!contenedor) return;
    
    if (materias.length === 0) {
        const busqueda = document.getElementById('busqueda-materia')?.value.trim() || '';
        const filtros = obtenerFiltrosActivos();
        
        let mensaje = 'No se encontraron materias';
        let sugerencias = [];
        
        if (busqueda.length > 0) {
            sugerencias.push('Intenta buscar con menos caracteres o sin filtros');
        }
        if (filtros.creditos.length > 0 || filtros.dias.length > 0) {
            sugerencias.push('Prueba quitando los filtros de créditos o días');
        }
        if (sugerencias.length === 0) {
            sugerencias.push('Verifica que la materia esté activa en la base de datos');
        }
        
        contenedor.innerHTML = `
            <div class="empty-message">
                <p style="margin-bottom: 0.5rem;">
                    <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg></span>
                    <strong>${mensaje}</strong>
                </p>
                ${sugerencias.length > 0 ? `<small class="text-muted">${sugerencias.join('<br>')}</small>` : ''}
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = materias.map(materia => `
        <div class="materia-card" data-id="${materia.id}">
            <div class="card-body">
                <h6 class="card-title">${materia.nombre}</h6>
                <p class="card-text">
                    <strong><span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg></span> Código:</strong> ${materia.codigo}<br>
                    <strong><span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> Profesor:</strong> ${materia.profesor || 'Sin asignar'}<br>
                    <strong><span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></span> Créditos:</strong> ${materia.creditos || 0}<br>
                    <strong><span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span> Horario:</strong> ${materia.dias} ${materia.hora_inicio} - ${materia.hora_fin}<br>
                    <strong><span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg></span> Cupos disponibles:</strong> 
                    <span style="color: ${materia.cupos_disponibles > 0 ? '#28a745' : '#dc3545'}; font-weight: 700;">
                        ${materia.cupos_disponibles}
                        ${materia.cupos_disponibles === 0 ? ' (SIN CUPOS)' : ''}
                    </span>
                </p>
                <button class="btn w-100 inscribir-materia ${materia.cupos_disponibles <= 0 ? 'btn-secondary' : 'btn-danger'}" 
                        data-materia-id="${materia.id}"
                        data-materia-nombre="${materia.nombre}"
                        data-materia-profesor="${materia.profesor || 'Sin asignar'}"
                        data-materia-creditos="${materia.creditos || 0}"
                        ${materia.cupos_disponibles <= 0 ? 'disabled title="No hay cupos disponibles"' : ''}>
                    <span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span> ${materia.cupos_disponibles <= 0 ? 'Sin cupos disponibles' : 'Inscribir'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones
    contenedor.querySelectorAll('.inscribir-materia').forEach(btn => {
        btn.addEventListener('click', function() {
            const materiaId = this.getAttribute('data-materia-id');
            inscribirMateria(materiaId);
        });
    });
}

// Cache de materias para evitar múltiples peticiones
let cacheMaterias = null;

// Función para obtener información completa de una materia (siempre desde el servidor para tener cupos actualizados)
async function obtenerMateriaPorId(materiaId) {
    try {
        // Buscar directamente en el servidor para obtener cupos actualizados
        const response = await fetch(`php/obtener_materia_por_id.php?id=${materiaId}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.materia) {
            return data.materia;
        }
        
        // Fallback: buscar en la lista general
        const responseList = await fetch(`php/obtener_materias.php?busqueda=${materiaId}`);
        const dataList = await responseList.json();
        
        if (dataList.status === 'success' && dataList.materias && dataList.materias.length > 0) {
            const materia = dataList.materias.find(m => m.id == materiaId);
            if (materia) {
                return materia;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error al obtener materia:', error);
        return null;
    }
}

// Función para limpiar el cache de materias
function limpiarCacheMaterias() {
    cacheMaterias = null;
}

// Función para calcular créditos totales
function calcularCreditosTotales() {
    return materiasInscritas.reduce((total, materia) => {
        return total + (materia.creditos || 0);
    }, 0);
}

// Función para verificar si hay traslape de horarios
function verificarTraslapeHorario(nuevaMateria) {
    // Usar normalizarDia si está disponible, sino usar el método anterior
    const normalizar = typeof normalizarDia === 'function' ? normalizarDia : (d) => d.trim().toLowerCase();
    const diasNueva = nuevaMateria.dias.split(',').map(d => normalizar(d));
    const horaInicioNueva = nuevaMateria.hora_inicio;
    const horaFinNueva = nuevaMateria.hora_fin;
    
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : materiasInscritas;
    
    for (let materia of materias) {
        const diasMateria = materia.dias.split(',').map(d => normalizar(d));
        
        // Verificar si hay días en común
        const diasComunes = diasNueva.filter(dia => diasMateria.includes(dia));
        
        if (diasComunes.length > 0) {
            // Verificar si hay traslape de horas
            if (hayTraslapeHoras(horaInicioNueva, horaFinNueva, materia.hora_inicio, materia.hora_fin)) {
                return {
                    hayTraslape: true,
                    materiaConflictiva: materia
                };
            }
        }
    }
    
    return { hayTraslape: false };
}

// Función auxiliar para convertir hora a minutos
function convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

// Función auxiliar para verificar traslape de horas
function hayTraslapeHoras(inicio1, fin1, inicio2, fin2) {
    const h1Inicio = convertirHoraAMinutos(inicio1);
    const h1Fin = convertirHoraAMinutos(fin1);
    const h2Inicio = convertirHoraAMinutos(inicio2);
    const h2Fin = convertirHoraAMinutos(fin2);
    
    // Verificar si hay solapamiento
    return (h1Inicio < h2Fin && h1Fin > h2Inicio);
}

// Función para convertir hora a minutos
function convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

// Función para inscribir una materia
async function inscribirMateria(materiaId) {
    // Obtener información completa de la materia
    const materia = await obtenerMateriaPorId(materiaId);
    
    if (!materia) {
        mostrarMensajeError('No se pudo obtener la información de la materia');
        return;
    }
    
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : materiasInscritas;
    
    // Verificar si la materia ya está inscrita
    if (materias.some(m => m.id == materiaId)) {
        mostrarMensajeError('Esta materia ya está inscrita');
        return;
    }
    
    // Calcular créditos actuales
    const creditosActuales = calcularCreditosTotales();
    const creditosNuevaMateria = materia.creditos || 0;
    const creditosTotales = creditosActuales + creditosNuevaMateria;
    
    // Validar límite máximo de créditos
    if (creditosTotales > LIMITE_MAXIMO_CREDITOS) {
        mostrarMensajeError(
            `No puedes inscribir esta materia. Excederías el límite de ${LIMITE_MAXIMO_CREDITOS} créditos. ` +
            `Créditos actuales: ${creditosActuales}, Créditos de la materia: ${creditosNuevaMateria}, Total: ${creditosTotales}`
        );
        return;
    }
    
    // Verificar traslape de horarios
    const traslape = verificarTraslapeHorario(materia);
    if (traslape.hayTraslape) {
        mostrarMensajeError(
            `Ya tienes una materia inscrita en ese horario: ${traslape.materiaConflictiva.nombre} (${traslape.materiaConflictiva.profesor || traslape.materiaConflictiva.grupo || 'Sin asignar'})`
        );
        return;
    }
    
    // Verificar cupo disponible
    if (materia.cupos_disponibles <= 0) {
        mostrarMensajeError('No hay cupos disponibles para esta materia');
        return;
    }
    
    try {
        // Enviar petición al servidor para inscribir la materia y actualizar cupos
        const formData = new FormData();
        formData.append('materia_id', materiaId);
        
        const response = await fetch('php/inscribir_materia.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Agregar materia a la lista de inscritas (usar window para asegurar acceso global)
            if (typeof window.materiasInscritas !== 'undefined') {
                window.materiasInscritas.push(materia);
            } else {
                window.materiasInscritas = [materia];
            }
            
            // Actualizar cupo disponible en el objeto materia
            materia.cupos_disponibles = Math.max(0, materia.cupos_disponibles - 1);
            
            // Agregar al horario visual
            agregarMateriaAlHorario(materia);
            
            // Actualizar estadísticas
            actualizarEstadisticas();
            
            // Actualizar la visualización de materias disponibles
            const busquedaInput = document.getElementById('busqueda-materia');
            if (busquedaInput && busquedaInput.value.trim().length >= 2) {
                // Refrescar la lista de materias para mostrar cupos actualizados
                const materias = await obtenerMaterias(busquedaInput.value.trim());
                mostrarMateriasDisponibles(materias);
            }
            
            // Mostrar mensaje de éxito
            mostrarMensajeExito(data.message || `Materia "${materia.nombre}" inscrita correctamente`);
            
            // Resetear el timer cuando se inscribe una materia
            if (typeof resetearTimerSesion === 'function') {
                resetearTimerSesion();
            }
        } else {
            // Mensaje de error más específico
            let mensajeError = data.message || 'Error al inscribir la materia';
            
            if (data.codigo_error === 'SIN_CUPOS') {
                mensajeError = `❌ ${mensajeError}\n\nPor favor, selecciona otra materia o profesor.`;
            }
            
            mostrarMensajeError(mensajeError);
            
            // Refrescar la lista de materias para mostrar cupos actualizados
            const busquedaInput = document.getElementById('busqueda-materia');
            if (busquedaInput && busquedaInput.value.trim().length >= 2) {
                setTimeout(async () => {
                    const materias = await obtenerMaterias(busquedaInput.value.trim());
                    mostrarMateriasDisponibles(materias);
                }, 500);
            }
        }
    } catch (error) {
        console.error('Error al inscribir materia:', error);
        mostrarMensajeError('Error de conexión al inscribir la materia');
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    
    // Obtener materias inscritas
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : (typeof materiasInscritas !== 'undefined' ? materiasInscritas : []);
    
    
    const totalCreditos = calcularCreditosTotales();
    const totalMaterias = materias.length;
    
    // Calcular horas semanales (aproximado: cada crédito = 1 hora semanal)
    const horasSemanales = totalCreditos;
    
    
    // Actualizar elementos del DOM
    const statMaterias = document.getElementById('stat-materias');
    const statCreditos = document.getElementById('stat-creditos');
    const statHoras = document.getElementById('stat-horas');
    
    if (statMaterias) {
        statMaterias.textContent = totalMaterias;
    } else {
        console.warn('No se encontró elemento stat-materias');
    }
    
    if (statCreditos) {
        statCreditos.textContent = totalCreditos;
        
        // Cambiar color según el total de créditos
        if (totalCreditos >= LIMITE_MINIMO_CREDITOS && totalCreditos <= LIMITE_MAXIMO_CREDITOS) {
            statCreditos.style.color = '#28a745'; // Verde
        } else if (totalCreditos > LIMITE_MAXIMO_CREDITOS) {
            statCreditos.style.color = '#dc3545'; // Rojo
        } else {
            statCreditos.style.color = '#ffc107'; // Amarillo
        }
    } else {
        console.warn('No se encontró elemento stat-creditos');
    }
    
    if (statHoras) {
        statHoras.textContent = horasSemanales;
    } else {
        console.warn('No se encontró elemento stat-horas');
    }
}

// Función para mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '350px';
    alertDiv.innerHTML = `
        <strong><span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>Error:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '350px';
    alertDiv.innerHTML = `
        <strong><span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>Éxito:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 3000);
}
