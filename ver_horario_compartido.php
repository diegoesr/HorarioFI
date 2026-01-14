<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Horario Compartido - Horario FI</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="css/styles.css">

    <style>
        .horario-compartido-container {
            min-height: 100vh;
            padding: 40px 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%);
        }
        .header-compartido {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 50%, #b21f2d 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        .materia-item-compartido {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.2s;
        }
        .materia-item-compartido:hover {
            background-color: #f8f9fa;
        }
        .materia-item-compartido:last-child {
            border-bottom: none;
        }
    </style>
</head>

<body>
    <div class="horario-compartido-container">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="card shadow-lg">
                        <div class="header-compartido">
                            <h2 class="mb-2">
                                <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                </span>
                                Horario Compartido
                            </h2>
                            <p class="mb-0 opacity-90" id="usuario-nombre-compartido">Cargando...</p>
                        </div>
                        <div class="card-body">
                            <div id="loading" class="text-center py-5">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                                <p class="mt-3 text-muted">Cargando horario compartido...</p>
                            </div>
                            <div id="error-message" class="alert alert-danger" style="display: none;"></div>
                            <div id="horario-content" style="display: none;">
                                <div class="mb-4">
                                    <h5 class="mb-3">
                                        <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                            </svg>
                                        </span>
                                        Materias Inscritas
                                    </h5>
                                    <div id="lista-materias-compartidas"></div>
                                </div>
                                <div class="text-center mt-4">
                                    <a href="index.html" class="btn btn-primary">
                                        <span style="display: inline-flex; align-items: center; margin-right: 0.5rem;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                        </span>
                                        Volver al Inicio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Obtener código de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const codigo = urlParams.get('codigo');

        if (!codigo) {
            mostrarError('No se proporcionó un código de compartir válido.');
        } else {
            cargarHorarioCompartido(codigo);
        }

        async function cargarHorarioCompartido(codigo) {
            try {
                const response = await fetch(`php/obtener_horario_compartido.php?codigo=${encodeURIComponent(codigo)}`);
                const data = await response.json();

                document.getElementById('loading').style.display = 'none';

                if (data.status === 'success') {
                    mostrarHorario(data);
                } else {
                    mostrarError(data.message || 'Error al cargar el horario compartido.');
                }
            } catch (error) {
                document.getElementById('loading').style.display = 'none';
                mostrarError('Error de conexión al cargar el horario compartido.');
                console.error('Error:', error);
            }
        }

        function mostrarHorario(data) {
            // Mostrar nombre del usuario
            document.getElementById('usuario-nombre-compartido').textContent = 
                `Horario de ${data.usuario.nombre_completo}`;

            // Mostrar materias
            const listaMaterias = document.getElementById('lista-materias-compartidas');
            
            if (data.materias.length === 0) {
                listaMaterias.innerHTML = '<p class="text-muted">Este usuario no tiene materias inscritas.</p>';
            } else {
                listaMaterias.innerHTML = data.materias.map(materia => `
                    <div class="materia-item-compartido">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-1 fw-bold">${materia.nombre}</h6>
                                <small class="text-muted d-block">
                                    <strong>Código:</strong> ${materia.codigo} | 
                                    <strong>Profesor:</strong> ${materia.profesor || 'Sin asignar'} | 
                                    <strong>Créditos:</strong> ${materia.creditos} | 
                                    <strong>Horario:</strong> ${materia.dias} ${materia.hora_inicio.substring(0, 5)} - ${materia.hora_fin.substring(0, 5)}
                                </small>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            document.getElementById('horario-content').style.display = 'block';
        }

        function mostrarError(mensaje) {
            document.getElementById('loading').style.display = 'none';
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = mensaje;
            errorDiv.style.display = 'block';
        }
    </script>
</body>

</html>
