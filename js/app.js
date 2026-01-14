window.materiasInscritas = [];
let horarioGenerado = {};
const LIMITE_MAXIMO_CREDITOS = 60;
const LIMITE_MINIMO_CREDITOS = 40;

var materiasInscritas = window.materiasInscritas;

// Función para normalizar nombres de días 
// Convierte "Sábado", "Sábado ", "Sabado" a "sabado" etc.
function normalizarDia(dia) {
    return dia.trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
        .replace(/\s+/g, ''); // Quitar espacios
}

// Función para obtener el color (gradiente) de una materia según su código
function obtenerColorMateria(codigo) {
    // Convertir código a string para asegurar comparación correcta
    const codigoStr = String(codigo).trim();

    // Color amarillo: algebra, calculo y geometría, química, algebra lineal, calculo integral, estructura de datos 1
    const materiasAmarillas = ['1120', '1121', '1131', '1220', '1221', '1227'];

    // Color azul turquesa: estructuras discretas, mecánica, calculo vectorial, estructura de datos 2, poo, estructura de computadoras, probabilidad, ecuaciones diferenciales
    const materiasAzulTurquesa = ['1228', '1230', '1321', '1317', '1323', '1324', '1325', '1421'];

    // Color azul rey: electricidad y magnetismo, dispositivos electrónicos, lenguajes formales y autómatas, señales y sistemas, fundamentos de estadística, ingenieria de software, sistemas operativos, diseño digital moderno, base de datos
    const materiasAzulRey = ['1414', '1415', '1427', '1428', '1429', '1527', '1528', '1529', '1530'];

    if (materiasAmarillas.includes(codigoStr)) {
        // Gradiente amarillo/dorado
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)';
    } else if (materiasAzulTurquesa.includes(codigoStr)) {
        // Gradiente azul turquesa
        return 'linear-gradient(135deg, #40E0D0 0%, #20B2AA 50%, #48D1CC 100%)';
    } else if (materiasAzulRey.includes(codigoStr)) {
        // Gradiente azul rey
        return 'linear-gradient(135deg, #1E3A8A 0%, #2C5282 50%, #3182CE 100%)';
    }

    // Color por defecto (gris claro con gradiente)
    return 'linear-gradient(135deg, #00ff00 0%, #3bd93b 100%)';
}

// Función para obtener el color base (sin gradiente) para determinar el color del texto
function obtenerColorBaseMateria(codigo) {
    const codigoStr = String(codigo).trim();
    const materiasAmarillas = ['1120', '1121', '1131', '1220', '1221', '1227'];
    const materiasAzulTurquesa = ['1228', '1230', '1321', '1317', '1323', '1324', '1325', '1421'];

    if (materiasAmarillas.includes(codigoStr)) {
        return '#FFD700'; // Amarillo dorado
    } else if (materiasAzulTurquesa.includes(codigoStr)) {
        return '#40E0D0'; // Azul turquesa
    }

    // Azul rey y por defecto usan texto blanco
    return '#1E3A8A';
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function () {

    // Inicializar componentes
    inicializarHorario();
    inicializarBusqueda();
});

// Función para inicializar la búsqueda de materias
function inicializarBusqueda() {
    const busquedaInput = document.getElementById('busqueda-materia');

    if (busquedaInput) {
        let timeout;
        busquedaInput.addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (typeof aplicarFiltrosYBusqueda === 'function') {
                    aplicarFiltrosYBusqueda();
                }
            }, 500);
        });
    }

    // Event listeners para los filtros de créditos
    document.querySelectorAll('.filtro-creditos').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (typeof aplicarFiltrosYBusqueda === 'function') {
                aplicarFiltrosYBusqueda();
            }
        });
    });

    // Event listeners para los filtros de días
    document.querySelectorAll('.filtro-dias').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (typeof aplicarFiltrosYBusqueda === 'function') {
                aplicarFiltrosYBusqueda();
            }
        });
    });

    // Event listener para el botón de limpiar filtros
    const limpiarFiltrosBtn = document.getElementById('limpiar-filtros-btn');
    if (limpiarFiltrosBtn) {
        limpiarFiltrosBtn.addEventListener('click', function () {
            // Desmarcar todos los checkboxes de filtros
            document.querySelectorAll('.filtro-creditos').forEach(cb => cb.checked = false);
            document.querySelectorAll('.filtro-dias').forEach(cb => cb.checked = false);

            // Limpiar campo de búsqueda
            const busquedaInput = document.getElementById('busqueda-materia');
            if (busquedaInput) {
                busquedaInput.value = '';
            }

            // Aplicar filtros (que ahora estarán vacíos)
            if (typeof aplicarFiltrosYBusqueda === 'function') {
                aplicarFiltrosYBusqueda();
            }
        });
    }
}

// Función para inicializar la tabla de horario
function inicializarHorario() {
    const tbody = document.getElementById('horario-tbody');
    if (!tbody) return;

    // Horarios flexibles: 7:00 a 20:00 cada hora
    // Esto permite materias que empiecen a las 11:00, 13:00, 15:00, etc.
    const horas = [];
    for (let i = 7; i <= 20; i++) {
        const horaInicio = i.toString().padStart(2, '0') + ':00';
        const horaFin = (i + 1).toString().padStart(2, '0') + ':00';
        horas.push({
            inicio: horaInicio,
            fin: horaFin,
            display: horaInicio
        });
    }

    // Limpiar tbody
    tbody.innerHTML = '';

    // Crear filas para cada hora
    horas.forEach(hora => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="time-column">${hora.inicio}</td>
            <td data-dia="lunes" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
            <td data-dia="martes" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
            <td data-dia="miercoles" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
            <td data-dia="jueves" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
            <td data-dia="viernes" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
            <td data-dia="sabado" data-hora-inicio="${hora.inicio}" data-hora-fin="${hora.fin}"></td>
        `;
        tbody.appendChild(row);
    });
}
