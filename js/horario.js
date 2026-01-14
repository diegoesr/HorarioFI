// ============================================
// GESTIÓN DEL HORARIO EN TIEMPO REAL
// ============================================

// Función para actualizar la vista móvil del horario
function actualizarVistaMovilHorario() {
    // Mapeo de días normalizados a IDs de contenedores
    const diasMap = {
        'lunes': 'mobile-materias-lunes',
        'martes': 'mobile-materias-martes',
        'miercoles': 'mobile-materias-miercoles',
        'jueves': 'mobile-materias-jueves',
        'viernes': 'mobile-materias-viernes',
        'sabado': 'mobile-materias-sabado'
    };
    
    // Limpiar todos los contenedores
    Object.values(diasMap).forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Agrupar materias por día
    const materiasPorDia = {
        'lunes': [],
        'martes': [],
        'miercoles': [],
        'jueves': [],
        'viernes': [],
        'sabado': []
    };
    
    // Obtener materias inscritas
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : [];
    
    materias.forEach(materia => {
        const normalizar = typeof normalizarDia === 'function' ? normalizarDia : (d) => d.trim().toLowerCase();
        const dias = materia.dias.split(',').map(d => normalizar(d.trim()));
        
        dias.forEach(dia => {
            if (materiasPorDia[dia]) {
                materiasPorDia[dia].push(materia);
            }
        });
    });
    
    // Ordenar materias por hora de inicio en cada día
    Object.keys(materiasPorDia).forEach(dia => {
        materiasPorDia[dia].sort((a, b) => {
            return convertirHoraAMinutos(a.hora_inicio) - convertirHoraAMinutos(b.hora_inicio);
        });
    });
    
    // Generar HTML para cada día
    Object.keys(materiasPorDia).forEach(dia => {
        const containerId = diasMap[dia];
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const materiasDelDia = materiasPorDia[dia];
        
        if (materiasDelDia.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-4">No hay materias inscritas para este día</p>';
        } else {
            container.innerHTML = materiasDelDia.map(materia => {
                const gradienteMateria = typeof obtenerColorMateria === 'function' ? 
                    obtenerColorMateria(materia.codigo) : 'linear-gradient(135deg, #E0E0E0 0%, #C0C0C0 100%)';
                
                // Formatear hora para mostrar
                const horaInicio = materia.hora_inicio.substring(0, 5);
                const horaFin = materia.hora_fin.substring(0, 5);
                
                return `
                    <div class="mobile-materia-card" style="border-left-color: ${obtenerColorBaseMateria ? obtenerColorBaseMateria(materia.codigo) : '#dc3545'};">
                        <div class="mobile-materia-card-header">
                            <h6 class="mobile-materia-card-title">${materia.nombre}</h6>
                            <div class="mobile-materia-card-time">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                ${horaInicio} - ${horaFin}
                            </div>
                        </div>
                        <div class="mobile-materia-card-body">
                            <div class="mobile-materia-card-info">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                <span><strong>Código:</strong> ${materia.codigo}</span>
                            </div>
                            <div class="mobile-materia-card-info">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span><strong>Profesor:</strong> ${materia.profesor || materia.grupo || 'Sin asignar'}</span>
                            </div>
                            <div class="mobile-materia-card-info">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                </svg>
                                <span><strong>Créditos:</strong> ${materia.creditos || 0}</span>
                            </div>
                        </div>
                        <div class="mobile-materia-card-actions">
                            <button class="btn btn-danger btn-sm" onclick="darBajaMateria(${materia.id}); event.stopPropagation();">
                                <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </span>
                                Dar de baja
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Actualizar badge en el tab si hay materias
        const tabButton = document.querySelector(`#day-${dia}-tab`);
        if (tabButton) {
            let badge = tabButton.querySelector('.mobile-day-badge');
            if (materiasDelDia.length > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'mobile-day-badge';
                    tabButton.appendChild(badge);
                }
                badge.textContent = materiasDelDia.length;
            } else if (badge) {
                badge.remove();
            }
        }
    });
}

// Función para agregar una materia al horario
function agregarMateriaAlHorario(materia) {
    // Usar normalizarDia si está disponible (definida en app.js), sino usar el método anterior
    const normalizar = typeof normalizarDia === 'function' ? normalizarDia : (d) => d.trim().toLowerCase();
    const dias = materia.dias.split(',').map(d => normalizar(d));
    const horaInicio = materia.hora_inicio;
    const horaFin = materia.hora_fin;
    
    // Convertir horas a minutos para comparación
    const inicioMinutos = convertirHoraAMinutos(horaInicio);
    const finMinutos = convertirHoraAMinutos(horaFin);
    
    dias.forEach(dia => {
        // Buscar la celda que coincide exactamente con la hora de inicio de la materia
        const celdas = document.querySelectorAll(`td[data-dia="${dia}"]`);
        let celdaInicio = null;
        
        // Primero buscar coincidencia exacta
        celdas.forEach(celda => {
            const horaInicioCelda = celda.getAttribute('data-hora-inicio');
            
            if (horaInicioCelda && horaInicioCelda === horaInicio) {
                celdaInicio = celda;
            }
        });
        
        // Si no encontramos coincidencia exacta, buscar la celda más cercana
        if (!celdaInicio) {
            celdas.forEach(celda => {
                const horaInicioCelda = celda.getAttribute('data-hora-inicio');
                
                if (horaInicioCelda) {
                    const inicioCeldaMinutos = convertirHoraAMinutos(horaInicioCelda);
                    
                    // Si la hora de inicio de la materia está dentro del rango de esta celda
                    // (la materia empieza en esta hora o después pero antes de la siguiente)
                    if (inicioMinutos >= inicioCeldaMinutos && inicioMinutos < inicioCeldaMinutos + 60) {
                        if (!celdaInicio || inicioCeldaMinutos <= convertirHoraAMinutos(celdaInicio.getAttribute('data-hora-inicio'))) {
                            celdaInicio = celda;
                        }
                    }
                }
            });
        }
        
        if (celdaInicio) {
            // Verificar si ya hay una materia en esta celda
            if (celdaInicio.querySelector('.materia-cell')) {
                return false;
            }
            
            // Calcular cuántas celdas ocupa la materia (duración en horas)
            const duracionHoras = (finMinutos - inicioMinutos) / 60;
            const celdasOcupadas = Math.ceil(duracionHoras);
            
            // Obtener el elemento TD
            const td = celdaInicio.closest('td');
            if (td) {
                // Establecer rowspan para que la celda ocupe múltiples filas
                td.setAttribute('rowspan', celdasOcupadas);
                
                // Truncar nombre si es muy largo
                const nombreCorto = materia.nombre.length > 20 ? 
                    materia.nombre.substring(0, 20) + '...' : materia.nombre;
                
                // Obtener gradiente según el código de la materia
                const gradienteMateria = typeof obtenerColorMateria === 'function' ? 
                    obtenerColorMateria(materia.codigo) : 'linear-gradient(135deg, #E0E0E0 0%, #C0C0C0 100%)';
                
                // Siempre usar texto negro para mejor legibilidad
                const colorTexto = '#000000';
                
                // Agregar la materia a la celda con el gradiente correspondiente
                td.innerHTML = `
                    <div class="materia-cell" data-materia-id="${materia.id}" style="background: ${gradienteMateria}; color: ${colorTexto};">
                        <div>
                            <strong title="${materia.nombre}" style="color: ${colorTexto}; font-weight: bold;">${nombreCorto}</strong>
                            <small style="color: ${colorTexto}; font-weight: bold;">Profesor: ${materia.profesor || materia.grupo || 'Sin asignar'}</small>
                            <small style="color: ${colorTexto}; font-weight: bold;">Créditos: ${materia.creditos || 0}</small>
                            <small style="color: ${colorTexto}; font-weight: bold;">${horaInicio} - ${horaFin}</small>
                        </div>
                        <button class="btn btn-sm btn-danger w-100" 
                                onclick="darBajaMateria(${materia.id}); event.stopPropagation();" 
                                style="font-size: 10px; padding: 3px 5px;">
                            <span style="display: inline-flex; align-items: center; margin-right: 0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span> Dar de baja
                        </button>
                    </div>
                `;
                
                // Aplicar el gradiente también a la celda TD
                td.style.background = gradienteMateria;
                
                // Eliminar las celdas siguientes que están ocupadas por el rowspan
                let filaActual = td.parentElement;
                for (let i = 1; i < celdasOcupadas; i++) {
                    const siguienteFila = filaActual.nextElementSibling;
                    if (siguienteFila) {
                        const siguienteCelda = siguienteFila.querySelector(`td[data-dia="${dia}"]`);
                        if (siguienteCelda) {
                            siguienteCelda.remove();
                        }
                        filaActual = siguienteFila;
                    } else {
                        break;
                    }
                }
            }
        }
    });
    
    // Actualizar vista móvil
    actualizarVistaMovilHorario();
    
    return true;
}

// Función auxiliar para convertir hora a minutos
function convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

// Función global para dar de baja una materia (accesible desde onclick)
window.darBajaMateria = async function(materiaId) {
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : materiasInscritas;
    
    // Buscar la materia en las inscritas
    const materiaIndex = materias.findIndex(m => m.id == materiaId);
    
    if (materiaIndex === -1) {
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('La materia no está inscrita');
        }
        return false;
    }
    
    const materia = materiasInscritas[materiaIndex];
    
    // Confirmar eliminación
    if (!confirm(`¿Estás seguro de dar de baja "${materia.nombre}" (Profesor: ${materia.profesor || materia.grupo || 'Sin asignar'})?`)) {
        return false;
    }
    
    try {
        // Enviar petición al servidor para dar de baja
        const formData = new FormData();
        formData.append('materia_id', materiaId);
        
        const response = await fetch('php/dar_baja_materia.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Eliminar del array local
            if (typeof window.materiasInscritas !== 'undefined') {
                window.materiasInscritas.splice(materiaIndex, 1);
            } else if (typeof materiasInscritas !== 'undefined') {
                materiasInscritas.splice(materiaIndex, 1);
            }
            
            // Eliminar del horario visual
            eliminarMateriaDelHorarioVisual(materiaId);
            
            // Actualizar vista móvil
            actualizarVistaMovilHorario();
            
            // Actualizar estadísticas
            setTimeout(() => {
                if (typeof actualizarEstadisticas === 'function') {
                    actualizarEstadisticas();
                }
            }, 100);
            
            // Mostrar mensaje de éxito
            if (typeof mostrarMensajeExito === 'function') {
                mostrarMensajeExito(data.message || `Materia "${materia.nombre}" dada de baja correctamente`);
            } else {
                alert(data.message || `Materia "${materia.nombre}" dada de baja correctamente`);
            }
        } else {
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError(data.message || 'Error al dar de baja la materia');
            } else {
                alert(data.message || 'Error al dar de baja la materia');
            }
        }
    } catch (error) {
        console.error('Error al dar de baja materia:', error);
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('Error de conexión al dar de baja la materia');
        } else {
            alert('Error de conexión al dar de baja la materia');
        }
    }
    
    return true;
}

// Función auxiliar para eliminar materia del horario visual
function eliminarMateriaDelHorarioVisual(materiaId) {
    const celdas = document.querySelectorAll(`[data-materia-id="${materiaId}"]`);
    celdas.forEach(celda => {
        const td = celda.closest('td');
        if (td) {
            const fila = td.parentElement;
            const dia = td.getAttribute('data-dia');
            const rowspan = parseInt(td.getAttribute('rowspan')) || 1;
            
            if (dia) {
                // Limpiar la celda principal
                td.removeAttribute('rowspan');
                td.innerHTML = '';
                td.style.backgroundColor = '';
                
                // Restaurar las celdas que fueron eliminadas por el rowspan
                // Necesitamos recrear las filas que fueron eliminadas
                let filaActual = fila;
                for (let i = 1; i < rowspan; i++) {
                    const siguienteFila = filaActual.nextElementSibling;
                    if (siguienteFila) {
                        // Crear nueva celda para este día
                        const nuevaCelda = document.createElement('td');
                        nuevaCelda.setAttribute('data-dia', dia);
                        nuevaCelda.setAttribute('data-hora-inicio', siguienteFila.querySelector('td:first-child')?.textContent?.trim() || '');
                        nuevaCelda.setAttribute('data-hora-fin', '');
                        
                        // Insertar en la posición correcta
                        const primeraCelda = siguienteFila.querySelector('td:first-child');
                        if (primeraCelda) {
                            primeraCelda.after(nuevaCelda);
                        }
                    }
                    filaActual = siguienteFila;
                }
            } else {
                // Fallback: limpiar directamente
                td.removeAttribute('rowspan');
                td.innerHTML = '';
                td.style.backgroundColor = '';
            }
        }
    });
    
    // Actualizar vista móvil después de eliminar
    actualizarVistaMovilHorario();
}

// Función para mostrar advertencia de traslape
function mostrarAdvertenciaTraslape() {
    const modal = new bootstrap.Modal(document.getElementById('warning-modal'));
    document.getElementById('warning-message').textContent = 
        'Ya tienes una materia inscrita en ese horario';
    modal.show();
}

// Función para guardar el horario
async function guardarHorario() {
    const materias = typeof window.materiasInscritas !== 'undefined' ? window.materiasInscritas : (typeof materiasInscritas !== 'undefined' ? materiasInscritas : []);
    
    // Verificar que hay materias inscritas
    if (!materias || materias.length === 0) {
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('No hay materias inscritas para guardar');
        } else {
            alert('No hay materias inscritas para guardar');
        }
        return;
    }
    
    // Obtener IDs de las materias
    const materiasIds = materias.map(m => m.id);
    
    // Crear FormData
    const formData = new FormData();
    formData.append('materias', JSON.stringify(materiasIds));
    
    try {
        // Mostrar indicador de carga
        const guardarBtn = document.getElementById('guardar-horario-btn');
        const textoOriginal = guardarBtn ? guardarBtn.innerHTML : '';
        if (guardarBtn) {
            guardarBtn.disabled = true;
            guardarBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; animation: spin 1s linear infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span> Guardando...';
        }
        
        const response = await fetch('php/guardar_horario.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        // Restaurar botón
        if (guardarBtn) {
            guardarBtn.disabled = false;
            guardarBtn.innerHTML = textoOriginal;
        }
        
        if (data.status === 'success') {
            if (typeof mostrarMensajeExito === 'function') {
                mostrarMensajeExito(data.message || 'Horario guardado correctamente');
            } else {
                alert(data.message || 'Horario guardado correctamente');
            }
            
            // Resetear el timer cuando se guarda el horario
            if (typeof resetearTimerSesion === 'function') {
                resetearTimerSesion();
            }
        } else {
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError(data.message || 'Error al guardar el horario');
            } else {
                alert(data.message || 'Error al guardar el horario');
            }
        }
    } catch (error) {
        console.error('Error al guardar horario:', error);
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('Error de conexión al guardar el horario');
        } else {
            alert('Error de conexión al guardar el horario');
        }
        
        // Restaurar botón
        const guardarBtn = document.getElementById('guardar-horario-btn');
        if (guardarBtn) {
            guardarBtn.disabled = false;
            guardarBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></span>Guardar Horario';
        }
    }
}

// Función para exportar a PDF
async function exportarAPDF() {
    
    // Resetear el timer cuando se exporta el horario
    if (typeof resetearTimerSesion === 'function') {
        resetearTimerSesion();
    }
    
    try {
        // Obtener el elemento que contiene el horario completo (el elemento visible)
        const horarioCard = document.querySelector('.col-lg-8 .card.shadow-sm');
        const tablaHorarioOriginal = document.getElementById('tabla-horario');
        
        if (!horarioCard || !tablaHorarioOriginal) {
            mostrarMensaje('No se encontró el horario para exportar', 'error');
            return;
        }
        
        // Obtener información del usuario
        const usuarioNombre = document.getElementById('usuario-nombre')?.textContent || 'Usuario';
        const statMaterias = document.getElementById('stat-materias')?.textContent || '0';
        const statCreditos = document.getElementById('stat-creditos')?.textContent || '0';
        const statHoras = document.getElementById('stat-horas')?.textContent || '0';
        
        // Verificar que hay contenido en el horario
        const materiasEnHorario = tablaHorarioOriginal.querySelectorAll('.materia-cell');
        if (materiasEnHorario.length === 0) {
            mostrarMensaje('No hay materias en el horario para exportar', 'error');
            return;
        }
        
        // Crear un contenedor temporal para el PDF con mejor formato
        const pdfContainer = document.createElement('div');
        pdfContainer.style.cssText = `
            padding: 20px;
            background: white;
            font-family: Arial, sans-serif;
        `;
        
        // Crear header del PDF
        const pdfHeader = document.createElement('div');
        pdfHeader.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #dc3545;
        `;
        pdfHeader.innerHTML = `
            <h2 style="color: #dc3545; margin: 0 0 10px 0; font-size: 24px;">Horario FI</h2>
            <h3 style="color: #333; margin: 0 0 5px 0; font-size: 18px;">Sistema de Horarios en Tiempo Real</h3>
            <p style="color: #666; margin: 5px 0; font-size: 14px;"><strong>Estudiante:</strong> ${usuarioNombre}</p>
            <p style="color: #666; margin: 5px 0; font-size: 12px;"><strong>Fecha de exportación:</strong> ${new Date().toLocaleString('es-ES')}</p>
        `;
        
        // Crear sección de estadísticas
        const pdfStats = document.createElement('div');
        pdfStats.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
        `;
        pdfStats.innerHTML = `
            <h4 style="color: #dc3545; margin: 0 0 10px 0; font-size: 16px;">Estadísticas</h4>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div style="text-align: center; margin: 5px;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${statMaterias}</div>
                    <div style="font-size: 12px; color: #666;">Materias</div>
                </div>
                <div style="text-align: center; margin: 5px;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${statCreditos}</div>
                    <div style="font-size: 12px; color: #666;">Créditos</div>
                </div>
                <div style="text-align: center; margin: 5px;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${statHoras}</div>
                    <div style="font-size: 12px; color: #666;">Horas/Semana</div>
                </div>
            </div>
        `;
        
        // Clonar el horario y agregarlo al contenedor
        const horarioClone = horarioCard.cloneNode(true);
        
        // Remover elementos que no necesitamos en el PDF (botones, etc.)
        const botones = horarioClone.querySelectorAll('button');
        botones.forEach(btn => btn.remove());
        
        // Ajustar estilos del clon para mejor visualización en PDF
        const tablaHorario = horarioClone.querySelector('#tabla-horario');
        if (tablaHorario) {
            tablaHorario.style.width = '100%';
            tablaHorario.style.fontSize = '10px';
            tablaHorario.style.borderCollapse = 'collapse';
        }
        
        // Asegurar que todos los elementos sean visibles
        horarioClone.style.display = 'block';
        horarioClone.style.visibility = 'visible';
        horarioClone.style.opacity = '1';
        
        // Asegurar que las celdas de materias sean visibles, mantengan gradientes y tengan texto negro
        const materiasCells = horarioClone.querySelectorAll('.materia-cell');
        materiasCells.forEach(cell => {
            cell.style.display = 'flex';
            cell.style.visibility = 'visible';
            cell.style.opacity = '1';
            cell.style.position = 'relative';
            
            // Obtener el estilo inline actual
            const estiloInline = cell.getAttribute('style') || '';
            
            // Extraer el gradiente del estilo inline si existe
            let gradienteEncontrado = null;
            const gradienteMatch = estiloInline.match(/background:\s*([^;]+gradient[^;]*)/i);
            if (gradienteMatch) {
                gradienteEncontrado = gradienteMatch[1].trim();
            }
            
            // Si no encontramos gradiente en el estilo inline, intentar obtenerlo del código
            if (!gradienteEncontrado) {
                const materiaText = cell.textContent || '';
                const codigoMatch = materiaText.match(/\d{4}/);
                if (codigoMatch && typeof obtenerColorMateria === 'function') {
                    const codigo = codigoMatch[0];
                    gradienteEncontrado = obtenerColorMateria(codigo);
                }
            }
            
            // Mantener o aplicar el gradiente y forzar texto negro
            if (gradienteEncontrado) {
                // Aplicar gradiente directamente usando style.background
                cell.style.background = gradienteEncontrado;
                cell.style.backgroundColor = 'transparent';
                cell.style.backgroundImage = 'none';
            }
            
            // Forzar texto negro siempre (sobrescribir cualquier color existente)
            cell.style.color = '#000000';
            cell.style.fontWeight = 'bold';
            
            // Asegurar que todos los elementos de texto dentro de la celda sean negros
            const textos = cell.querySelectorAll('strong, small, span, div, p');
            textos.forEach(texto => {
                texto.style.color = '#000000';
                texto.style.fontWeight = 'bold';
                texto.style.textShadow = 'none';
                // Eliminar cualquier estilo inline de color que pueda tener
                const estiloTexto = texto.getAttribute('style') || '';
                if (estiloTexto.includes('color:')) {
                    const nuevoEstiloTexto = estiloTexto.replace(/color:\s*[^;]+/gi, 'color: #000000');
                    texto.setAttribute('style', nuevoEstiloTexto);
                } else {
                    texto.style.color = '#000000';
                }
            });
            
            // Asegurar que los botones también tengan texto negro (excepto el botón de dar de baja que es rojo)
            const botones = cell.querySelectorAll('.btn:not(.btn-danger)');
            botones.forEach(btn => {
                btn.style.color = '#000000';
            });
        });
        
        // Asegurar que las celdas TD también mantengan sus gradientes si los tienen
        const todasLasCeldasTD = horarioClone.querySelectorAll('#tabla-horario td');
        todasLasCeldasTD.forEach(td => {
            const estiloTD = td.getAttribute('style') || '';
            const gradienteTD = estiloTD.match(/background:\s*([^;]+gradient[^;]*)/i);
            if (gradienteTD) {
                // Mantener el gradiente en la celda TD
                td.style.background = gradienteTD[1].trim();
            }
        });
        
        // Asegurar que la tabla tenga estilos correctos
        if (tablaHorario) {
            tablaHorario.style.border = '1px solid #000';
            tablaHorario.style.borderCollapse = 'collapse';
            
            // Asegurar que todas las celdas tengan bordes visibles
            const todasLasCeldas = tablaHorario.querySelectorAll('td, th');
            todasLasCeldas.forEach(celda => {
                celda.style.border = '1px solid #ccc';
                celda.style.padding = '4px';
            });
        }
        
        // Agregar elementos al contenedor
        pdfContainer.appendChild(pdfHeader);
        pdfContainer.appendChild(pdfStats);
        pdfContainer.appendChild(horarioClone);
        
        // Configurar el contenedor para que sea invisible al usuario pero capturable por html2canvas
        // html2canvas necesita que el elemento esté en el DOM y técnicamente "visible" pero fuera de la vista
        pdfContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: -2000px;
            width: 1200px;
            min-height: 800px;
            background: white;
            padding: 20px;
            font-family: Arial, sans-serif;
            z-index: -1;
            visibility: visible;
            opacity: 1;
            display: block;
            overflow: visible;
            color: #000;
            pointer-events: none;
        `;
        
        // Agregar al DOM (fuera de la vista del usuario, a la izquierda de la pantalla)
        document.body.appendChild(pdfContainer);
        
        // Forzar reflow para asegurar que los estilos se apliquen
        pdfContainer.offsetHeight;
        
        // Esperar a que se renderice completamente
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verificar que el contenedor tiene contenido antes de generar PDF
        const contenidoVerificacion = pdfContainer.innerHTML;
        if (!contenidoVerificacion || contenidoVerificacion.trim().length === 0) {
            mostrarMensaje('Error: El contenido del PDF está vacío', 'error');
            if (pdfContainer.parentNode) {
                document.body.removeChild(pdfContainer);
            }
            return;
        }
        
        
        // Mostrar mensaje discreto sin overlay que obstruya la vista
        mostrarMensaje('Generando PDF, por favor espere...', 'info');
        
        try {
            // Usar html2canvas directamente y luego jsPDF
            // El contenedor ya está fuera de la vista del usuario (left: -2000px)
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                letterRendering: true,
                logging: false,
                windowWidth: 1200,
                windowHeight: pdfContainer.scrollHeight || 1200,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff',
                x: 0,
                y: 0,
                width: 1200,
                height: pdfContainer.scrollHeight || 1200,
                ignoreElements: function(element) {
                    // Ignorar elementos que no queremos en el PDF
                    return false;
                }
            });
            
            
            if (canvas.width === 0 || canvas.height === 0) {
                throw new Error('El canvas generado está vacío');
            }
            
            // Convertir canvas a imagen
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Crear PDF usando jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calcular dimensiones para ajustar la imagen al PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const finalWidth = imgWidth * ratio;
            const finalHeight = imgHeight * ratio;
            
            // Calcular posición para centrar la imagen
            const x = (pdfWidth - finalWidth) / 2;
            const y = (pdfHeight - finalHeight) / 2;
            
            // Agregar imagen al PDF centrada
            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            
            // Guardar PDF
            const filename = `Horario_${usuarioNombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);
            
            // Mostrar mensaje de éxito
            mostrarMensaje('PDF generado y descargado correctamente', 'success');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            console.error('Detalles del error:', {
                message: error.message,
                stack: error.stack
            });
            mostrarMensaje('Error al generar el PDF: ' + error.message, 'error');
        } finally {
            // Eliminar el contenedor temporal después de un pequeño delay
            setTimeout(() => {
                if (pdfContainer.parentNode) {
                    document.body.removeChild(pdfContainer);
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        mostrarMensaje('Error al generar el PDF: ' + error.message, 'error');
    }
}

// Función para reiniciar el horario
async function reiniciarHorario() {
    // Confirmar acción
    if (!confirm('¿Estás seguro de que deseas reiniciar el horario? Se eliminarán TODAS las materias inscritas tanto localmente como en el servidor. Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const reiniciarBtn = document.getElementById('reiniciar-horario-btn');
        const textoOriginal = reiniciarBtn ? reiniciarBtn.innerHTML : '';
        if (reiniciarBtn) {
            reiniciarBtn.disabled = true;
            reiniciarBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; animation: spin 1s linear infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></span> Reiniciando...';
        }

        // Llamar al endpoint PHP para eliminar el horario de la base de datos
        const response = await fetch('php/reiniciar_horario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const data = await response.json();

        // Restaurar botón
        if (reiniciarBtn) {
            reiniciarBtn.disabled = false;
            reiniciarBtn.innerHTML = textoOriginal;
        }

        if (data.status === 'success') {
            // Limpiar array de materias inscritas
            if (typeof window.materiasInscritas !== 'undefined') {
                window.materiasInscritas.length = 0;
            }
            if (typeof materiasInscritas !== 'undefined') {
                materiasInscritas.length = 0;
            }
            
            // Limpiar el horario visual - reinicializar la tabla
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
            
            // Actualizar estadísticas
            if (typeof actualizarEstadisticas === 'function') {
                actualizarEstadisticas();
            }
            
            // Actualizar vista móvil
            actualizarVistaMovilHorario();
            
            // Limpiar campo de búsqueda y resultados
            const busquedaInput = document.getElementById('busqueda-materia');
            if (busquedaInput) {
                busquedaInput.value = '';
            }
            const materiasDisponibles = document.getElementById('materias-disponibles');
            if (materiasDisponibles) {
                materiasDisponibles.innerHTML = `
                    <p class="text-muted text-center mb-0 py-3">
                        <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                        Ingresa un término de búsqueda...
                    </p>
                `;
            }
            
            // Resetear el timer cuando se reinicia el horario
            if (typeof resetearTimerSesion === 'function') {
                resetearTimerSesion();
            }
            
            // Mostrar mensaje de éxito
            if (typeof mostrarMensajeExito === 'function') {
                mostrarMensajeExito(data.message || 'Horario reiniciado correctamente');
            } else if (typeof mostrarMensaje === 'function') {
                mostrarMensaje(data.message || 'Horario reiniciado correctamente', 'success');
            } else {
                alert(data.message || 'Horario reiniciado correctamente');
            }
        } else {
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError(data.message || 'Error al reiniciar el horario');
            } else {
                alert(data.message || 'Error al reiniciar el horario');
            }
        }
        
    } catch (error) {
        console.error('Error al reiniciar horario:', error);
        const reiniciarBtn = document.getElementById('reiniciar-horario-btn');
        if (reiniciarBtn) {
            reiniciarBtn.disabled = false;
            reiniciarBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></span>Reiniciar Horario';
        }
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('Error de conexión al reiniciar el horario');
        } else {
            alert('Error de conexión al reiniciar el horario');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const guardarBtn = document.getElementById('guardar-horario-btn');
    const reiniciarBtn = document.getElementById('reiniciar-horario-btn');
    const exportarBtn = document.getElementById('exportar-pdf-btn');
    const compartirBtn = document.getElementById('compartir-horario-btn');
    
    if (guardarBtn) {
        guardarBtn.addEventListener('click', guardarHorario);
    }
    
    if (reiniciarBtn) {
        reiniciarBtn.addEventListener('click', reiniciarHorario);
    }
    
    if (exportarBtn) {
        exportarBtn.addEventListener('click', exportarAPDF);
    }

    if (compartirBtn) {
        compartirBtn.addEventListener('click', compartirHorario);
    }

    // Event listener para el botón de copiar enlace
    const btnCopiarEnlace = document.getElementById('btn-copiar-enlace');
    if (btnCopiarEnlace) {
        btnCopiarEnlace.addEventListener('click', copiarEnlace);
    }

    // Event listener para el botón de visitar enlace
    const btnVisitarEnlace = document.getElementById('btn-visitar-enlace');
    if (btnVisitarEnlace) {
        btnVisitarEnlace.addEventListener('click', visitarEnlace);
    }
});

// Función para compartir horario
async function compartirHorario() {
    try {
        // Verificar que haya materias inscritas
        if (!window.materiasInscritas || window.materiasInscritas.length === 0) {
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError('No tienes materias inscritas. Agrega materias a tu horario primero.');
            } else {
                alert('No tienes materias inscritas. Agrega materias a tu horario primero.');
            }
            return;
        }

        // Mostrar indicador de carga
        const compartirBtn = document.getElementById('compartir-horario-btn');
        const textoOriginal = compartirBtn ? compartirBtn.innerHTML : '';
        if (compartirBtn) {
            compartirBtn.disabled = true;
            compartirBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem; animation: spin 1s linear infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span> Generando enlace...';
        }

        const response = await fetch('php/compartir_horario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const data = await response.json();

        // Restaurar botón
        if (compartirBtn) {
            compartirBtn.disabled = false;
            compartirBtn.innerHTML = textoOriginal;
        }

        if (data.status === 'success') {
            // Mostrar modal con el enlace
            mostrarModalCompartir(data.enlace);
            
            // Resetear el timer cuando se comparte el horario
            if (typeof resetearTimerSesion === 'function') {
                resetearTimerSesion();
            }
        } else {
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError(data.message || 'Error al generar enlace de compartir');
            } else {
                alert(data.message || 'Error al generar enlace de compartir');
            }
        }
    } catch (error) {
        console.error('Error al compartir horario:', error);
        const compartirBtn = document.getElementById('compartir-horario-btn');
        if (compartirBtn) {
            compartirBtn.disabled = false;
            compartirBtn.innerHTML = '<span style="display: inline-flex; align-items: center; margin-right: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></span>Compartir Horario';
        }
        if (typeof mostrarMensajeError === 'function') {
            mostrarMensajeError('Error de conexión al generar enlace de compartir');
        } else {
            alert('Error de conexión al generar enlace de compartir');
        }
    }
}

// Variable global para almacenar el enlace compartido
let enlaceCompartidoActual = '';

// Función para mostrar modal de compartir
function mostrarModalCompartir(enlace) {
    enlaceCompartidoActual = enlace;
    const modal = new bootstrap.Modal(document.getElementById('modal-compartir-horario'));
    const inputEnlace = document.getElementById('enlace-compartir');
    
    if (inputEnlace) {
        inputEnlace.value = enlace;
    }
    
    modal.show();
}

// Función para visitar el enlace compartido
function visitarEnlace() {
    if (enlaceCompartidoActual) {
        window.open(enlaceCompartidoActual, '_blank');
    } else {
        const inputEnlace = document.getElementById('enlace-compartir');
        if (inputEnlace && inputEnlace.value) {
            window.open(inputEnlace.value, '_blank');
        }
    }
}

// Función para copiar enlace al portapapeles
function copiarEnlace() {
    const inputEnlace = document.getElementById('enlace-compartir');
    if (inputEnlace) {
        inputEnlace.select();
        inputEnlace.setSelectionRange(0, 99999); // Para dispositivos móviles
        
        try {
            document.execCommand('copy');
            
            // Mostrar feedback visual
            const btnCopiar = document.getElementById('btn-copiar-enlace');
            if (btnCopiar) {
                const textoOriginal = btnCopiar.innerHTML;
                btnCopiar.innerHTML = '<span style="display: inline-flex; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> ¡Copiado!';
                btnCopiar.classList.add('btn-success');
                btnCopiar.classList.remove('btn-outline-secondary');
                
                setTimeout(() => {
                    btnCopiar.innerHTML = textoOriginal;
                    btnCopiar.classList.remove('btn-success');
                    btnCopiar.classList.add('btn-outline-secondary');
                }, 2000);
            }
            
            if (typeof mostrarMensajeExito === 'function') {
                mostrarMensajeExito('Enlace copiado al portapapeles');
            }
        } catch (err) {
            console.error('Error al copiar:', err);
            if (typeof mostrarMensajeError === 'function') {
                mostrarMensajeError('No se pudo copiar el enlace. Cópialo manualmente.');
            }
        }
    }
}
