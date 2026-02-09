// Estado de la aplicación
let appData = {
    tareas: [],
    trabajadores: [],
    tareaActual: null
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarSelectores();
    renderizarTablero();
    setFechaActual();
});

// Cargar datos desde localStorage
function cargarDatos() {
    const datosGuardados = localStorage.getItem('kanbanData');
    if (datosGuardados) {
        appData = JSON.parse(datosGuardados);
    } else {
        // Datos de ejemplo
        appData = {
            tareas: [
                {
                    id: generarId(),
                    titulo: 'Diseñar mockups de la landing page',
                    descripcion: 'Crear mockups de alta fidelidad para la nueva landing page del producto',
                    asignado: 'Juan Pérez',
                    estado: 'en-progreso',
                    plazo: 'semanal',
                    prioridad: 'alta',
                    fechaInicio: '2026-02-03',
                    fechaFin: '2026-02-10',
                    fechaCreacion: new Date().toISOString(),
                    progreso: 45,
                    microtareas: [
                        { id: generarId(), texto: 'Investigar referencias de diseño', completada: true },
                        { id: generarId(), texto: 'Crear wireframes iniciales', completada: true },
                        { id: generarId(), texto: 'Diseñar versión desktop', completada: false },
                        { id: generarId(), texto: 'Diseñar versión mobile', completada: false }
                    ]
                },
                {
                    id: generarId(),
                    titulo: 'Implementar sistema de autenticación',
                    descripcion: 'Desarrollar módulo de login y registro con JWT',
                    asignado: 'María González',
                    estado: 'en-progreso',
                    plazo: 'semanal',
                    prioridad: 'alta',
                    fechaInicio: '2026-02-05',
                    fechaFin: '2026-02-12',
                    fechaCreacion: new Date().toISOString(),
                    progreso: 60,
                    microtareas: [
                        { id: generarId(), texto: 'Configurar JWT', completada: true },
                        { id: generarId(), texto: 'Crear endpoints de login', completada: true },
                        { id: generarId(), texto: 'Crear endpoints de registro', completada: false },
                        { id: generarId(), texto: 'Implementar refresh tokens', completada: false }
                    ]
                },
                {
                    id: generarId(),
                    titulo: 'Actualizar documentación técnica',
                    descripcion: 'Documentar nuevas APIs y flujos de trabajo',
                    asignado: 'Carlos Rodríguez',
                    estado: 'pendiente',
                    plazo: 'diario',
                    prioridad: 'media',
                    fechaInicio: '2026-02-09',
                    fechaFin: '2026-02-09',
                    fechaCreacion: new Date().toISOString(),
                    progreso: 0,
                    microtareas: []
                },
                {
                    id: generarId(),
                    titulo: 'Optimizar queries de base de datos',
                    descripcion: 'Mejorar rendimiento de consultas SQL principales',
                    asignado: 'Ana Martínez',
                    estado: 'completado',
                    plazo: 'semanal',
                    prioridad: 'alta',
                    fechaInicio: '2026-02-01',
                    fechaFin: '2026-02-08',
                    fechaCreacion: new Date().toISOString(),
                    progreso: 100,
                    microtareas: [
                        { id: generarId(), texto: 'Analizar queries lentas', completada: true },
                        { id: generarId(), texto: 'Crear índices optimizados', completada: true },
                        { id: generarId(), texto: 'Testear rendimiento', completada: true }
                    ]
                }
            ],
            trabajadores: [
                { id: generarId(), nombre: 'Juan Pérez', email: 'juan.perez@empresa.com', cargo: 'Diseñador UI/UX' },
                { id: generarId(), nombre: 'María González', email: 'maria.gonzalez@empresa.com', cargo: 'Desarrolladora Backend' },
                { id: generarId(), nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', cargo: 'Documentador Técnico' },
                { id: generarId(), nombre: 'Ana Martínez', email: 'ana.martinez@empresa.com', cargo: 'DBA' }
            ]
        };
        guardarDatos();
    }
}

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('kanbanData', JSON.stringify(appData));
}

// Generar ID único
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Cambiar entre vistas
function cambiarVista(vista) {
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Actualizar vistas
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
    
    if (vista === 'tablero') {
        document.getElementById('vistaTablero').classList.add('active');
        renderizarTablero();
    } else if (vista === 'trabajadores') {
        document.getElementById('vistaTrabajadores').classList.add('active');
        renderizarVistaTrabajadores();
    } else if (vista === 'informes') {
        document.getElementById('vistaInformes').classList.add('active');
        renderizarInformes();
    }
}

// Actualizar selectores
function actualizarSelectores() {
    const selectores = [
        document.getElementById('tareaAsignado'),
        document.getElementById('filtroTrabajador')
    ];

    selectores.forEach(select => {
        if (select) {
            const esFormulario = select.id === 'tareaAsignado';
            select.innerHTML = esFormulario ? '<option value="">Seleccionar trabajador</option>' : '<option value="">Todos los trabajadores</option>';
            
            appData.trabajadores.forEach(trabajador => {
                const option = document.createElement('option');
                option.value = trabajador.nombre;
                option.textContent = trabajador.nombre;
                select.appendChild(option);
            });
        }
    });
}

// Establecer fecha actual
function setFechaActual() {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInicio = document.getElementById('tareaFechaInicio');
    if (fechaInicio) {
        fechaInicio.value = hoy;
    }
}

// Renderizar tablero Kanban
function renderizarTablero() {
    const estados = ['pendiente', 'en-progreso', 'completado'];
    
    estados.forEach(estado => {
        const container = document.getElementById(estado);
        if (!container) return;

        const tareasFiltradas = filtrarTareasPorEstado(estado);
        container.innerHTML = '';

        tareasFiltradas.forEach(tarea => {
            const card = crearTarjetaTarea(tarea);
            container.appendChild(card);
        });

        // Actualizar contador
        const column = container.closest('.kanban-column');
        const counter = column.querySelector('.task-count');
        if (counter) {
            counter.textContent = tareasFiltradas.length;
        }
    });
}

// Filtrar tareas
function filtrarTareasPorEstado(estado) {
    const trabajadorFiltro = document.getElementById('filtroTrabajador')?.value || '';
    const plazoFiltro = document.getElementById('filtroPlazo')?.value || '';

    return appData.tareas.filter(tarea => {
        const coincideEstado = tarea.estado === estado;
        const coincideTrabajador = !trabajadorFiltro || tarea.asignado === trabajadorFiltro;
        const coincidePlazo = !plazoFiltro || tarea.plazo === plazoFiltro;

        return coincideEstado && coincideTrabajador && coincidePlazo;
    });
}

function filtrarTareas() {
    renderizarTablero();
}

// Crear tarjeta de tarea
function crearTarjetaTarea(tarea) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(tarea.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);
    
    const estaAtrasada = fechaFin < hoy && tarea.estado !== 'completado';
    
    const card = document.createElement('div');
    card.className = `task-card prioridad-${tarea.prioridad}${estaAtrasada ? ' tarea-atrasada' : ''}`;
    card.onclick = () => abrirDetallesTarea(tarea.id);

    const diasRestantes = calcularDiasRestantes(tarea.fechaFin);
    const alertaVencimiento = diasRestantes < 0 ? 
        `<div class="alerta-vencimiento">⚠️ Vencida hace ${Math.abs(diasRestantes)} días</div>` :
        diasRestantes <= 2 && tarea.estado !== 'completado' ?
        `<div class="alerta-vencimiento">⏰ Vence en ${diasRestantes} días</div>` : '';

    const microCompletadas = tarea.microtareas.filter(m => m.completada).length;
    const microTotal = tarea.microtareas.length;

    card.innerHTML = `
        <div class="task-header">
            <div style="flex: 1;">
                <div class="task-title">${tarea.titulo}</div>
                <div class="task-assignee">👤 ${tarea.asignado}</div>
            </div>
            <div class="task-badges">
                <span class="badge plazo-${tarea.plazo}">${tarea.plazo}</span>
                <span class="badge prioridad-${tarea.prioridad}">${tarea.prioridad}</span>
            </div>
        </div>
        
        <div class="task-dates">
            📅 ${formatearFecha(tarea.fechaInicio)} - ${formatearFecha(tarea.fechaFin)}
        </div>

        ${alertaVencimiento}

        <div class="task-progress">
            <div class="task-progress-label">
                <span>Progreso</span>
                <strong>${tarea.progreso}%</strong>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${tarea.progreso}%"></div>
            </div>
        </div>

        ${microTotal > 0 ? `
            <div class="task-microtareas">
                📝 ${microCompletadas}/${microTotal} microtareas completadas
            </div>
        ` : ''}
    `;

    return card;
}

// Calcular días restantes
function calcularDiasRestantes(fechaFin) {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff;
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
}

// Modal handlers
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Limpiar formularios
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }
}

// Click fuera del modal para cerrar
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Crear nueva tarea
function crearTarea(event) {
    event.preventDefault();

    const nuevaTarea = {
        id: generarId(),
        titulo: document.getElementById('tareaTitulo').value,
        descripcion: document.getElementById('tareaDescripcion').value,
        asignado: document.getElementById('tareaAsignado').value,
        plazo: document.getElementById('tareaPlazo').value,
        fechaInicio: document.getElementById('tareaFechaInicio').value,
        fechaFin: document.getElementById('tareaFechaFin').value,
        prioridad: document.getElementById('tareaPrioridad').value,
        estado: 'pendiente',
        progreso: 0,
        microtareas: [],
        fechaCreacion: new Date().toISOString()
    };

    appData.tareas.push(nuevaTarea);
    guardarDatos();
    renderizarTablero();
    closeModal('modalNuevaTarea');
    
    // Mostrar notificación
    alert('✅ Tarea creada exitosamente');
}

// Crear nuevo trabajador
function crearTrabajador(event) {
    event.preventDefault();

    const nuevoTrabajador = {
        id: generarId(),
        nombre: document.getElementById('trabajadorNombre').value,
        email: document.getElementById('trabajadorEmail').value,
        cargo: document.getElementById('trabajadorCargo').value
    };

    appData.trabajadores.push(nuevoTrabajador);
    guardarDatos();
    actualizarSelectores();
    closeModal('modalNuevoTrabajador');
    
    alert('✅ Trabajador agregado exitosamente');
}

// Abrir detalles de tarea
function abrirDetallesTarea(tareaId) {
    const tarea = appData.tareas.find(t => t.id === tareaId);
    if (!tarea) return;

    appData.tareaActual = tareaId;

    // Llenar información editable
    document.getElementById('detallesTitulo').textContent = tarea.titulo;
    document.getElementById('detallesTituloInput').value = tarea.titulo;
    document.getElementById('detallesDescripcion').value = tarea.descripcion || '';
    
    // Llenar select de asignado
    const selectAsignado = document.getElementById('detallesAsignado');
    selectAsignado.innerHTML = '';
    appData.trabajadores.forEach(trabajador => {
        const option = document.createElement('option');
        option.value = trabajador.nombre;
        option.textContent = trabajador.nombre;
        option.selected = trabajador.nombre === tarea.asignado;
        selectAsignado.appendChild(option);
    });
    
    document.getElementById('detallesEstado').value = tarea.estado;
    document.getElementById('detallesFechaInicio').value = tarea.fechaInicio;
    document.getElementById('detallesFechaFin').value = tarea.fechaFin;
    document.getElementById('detallesPlazo').value = tarea.plazo;
    document.getElementById('detallesPrioridad').value = tarea.prioridad;
    document.getElementById('detallesFechaCreacion').textContent = formatearFecha(tarea.fechaCreacion);
    document.getElementById('detallesIdTarea').textContent = tarea.id;
    
    // Calcular y mostrar progreso
    calcularYActualizarProgreso(tarea);

    // Microtareas
    renderizarMicrotareas(tarea);

    showModal('modalDetallesTarea');
}

// Nueva función para actualizar campos de tarea
function actualizarCampoTarea(campo, valor) {
    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    if (!tarea) return;

    tarea[campo] = valor;
    
    // Si se cambió el título, actualizar el header del modal
    if (campo === 'titulo') {
        document.getElementById('detallesTitulo').textContent = valor;
    }
    
    guardarDatos();
    renderizarTablero();
}

// Actualizar estado de tarea
function actualizarEstadoTarea() {
    const nuevoEstado = document.getElementById('detallesEstado').value;
    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    
    if (tarea) {
        tarea.estado = nuevoEstado;
        if (nuevoEstado === 'completado') {
            // Completar todas las microtareas
            tarea.microtareas.forEach(m => m.completada = true);
            renderizarMicrotareas(tarea);
        }
        calcularYActualizarProgreso(tarea);
        guardarDatos();
        renderizarTablero();
    }
}

// Nueva función: Calcular progreso automático basado en microtareas
function calcularYActualizarProgreso(tarea) {
    let progreso = 0;
    
    if (tarea.microtareas.length > 0) {
        // Calcular basado en microtareas completadas
        const completadas = tarea.microtareas.filter(m => m.completada).length;
        const total = tarea.microtareas.length;
        progreso = Math.round((completadas / total) * 100);
    } else {
        // Si no hay microtareas, usar el progreso manual existente
        progreso = tarea.progreso || 0;
    }
    
    tarea.progreso = progreso;
    
    // Actualizar visualización
    document.getElementById('progresoValor').textContent = progreso + '%';
    document.getElementById('progressFill').style.width = progreso + '%';
    
    return progreso;
}

// Eliminar la función antigua de actualizar progreso manual
// Ya no se usa el slider

// Renderizar microtareas
function renderizarMicrotareas(tarea) {
    const lista = document.getElementById('listaMicrotareas');
    lista.innerHTML = '';

    tarea.microtareas.forEach(micro => {
        const item = document.createElement('div');
        item.className = 'microtarea-item' + (micro.completada ? ' completada' : '');
        item.innerHTML = `
            <input type="checkbox" ${micro.completada ? 'checked' : ''} 
                   onchange="toggleMicrotarea('${micro.id}')">
            <input type="text" value="${micro.texto}" 
                   onchange="editarMicrotarea('${micro.id}', this.value)">
            <button class="btn-eliminar-micro" onclick="eliminarMicrotarea('${micro.id}')">🗑️</button>
        `;
        lista.appendChild(item);
    });
}

// Agregar microtarea
function agregarMicrotarea() {
    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    if (!tarea) return;

    const nuevaMicro = {
        id: generarId(),
        texto: 'Nueva microtarea',
        completada: false
    };

    tarea.microtareas.push(nuevaMicro);
    
    // Recalcular progreso porque ahora hay más microtareas
    calcularYActualizarProgreso(tarea);
    
    guardarDatos();
    renderizarMicrotareas(tarea);
    renderizarTablero();
}

// Toggle microtarea
function toggleMicrotarea(microId) {
    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    if (!tarea) return;

    const micro = tarea.microtareas.find(m => m.id === microId);
    if (micro) {
        micro.completada = !micro.completada;
        
        // Calcular progreso automáticamente
        calcularYActualizarProgreso(tarea);
        
        guardarDatos();
        renderizarMicrotareas(tarea);
        renderizarTablero();
    }
}

// Editar microtarea
function editarMicrotarea(microId, nuevoTexto) {
    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    if (!tarea) return;

    const micro = tarea.microtareas.find(m => m.id === microId);
    if (micro) {
        micro.texto = nuevoTexto;
        guardarDatos();
    }
}

// Eliminar microtarea
function eliminarMicrotarea(microId) {
    if (!confirm('¿Eliminar esta microtarea?')) return;

    const tarea = appData.tareas.find(t => t.id === appData.tareaActual);
    if (!tarea) return;

    tarea.microtareas = tarea.microtareas.filter(m => m.id !== microId);
    
    // Recalcular progreso porque cambió el total de microtareas
    calcularYActualizarProgreso(tarea);
    
    guardarDatos();
    renderizarMicrotareas(tarea);
    renderizarTablero();
}

// Eliminar tarea
function eliminarTarea() {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    appData.tareas = appData.tareas.filter(t => t.id !== appData.tareaActual);
    guardarDatos();
    renderizarTablero();
    closeModal('modalDetallesTarea');
}

// Renderizar vista de trabajadores
function renderizarVistaTrabajadores() {
    const grid = document.getElementById('trabajadoresGrid');
    grid.innerHTML = '';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    appData.trabajadores.forEach(trabajador => {
        const tareasAsignadas = appData.tareas.filter(t => t.asignado === trabajador.nombre);
        const tareasCompletadas = tareasAsignadas.filter(t => t.estado === 'completado').length;
        const tareasEnProgreso = tareasAsignadas.filter(t => t.estado === 'en-progreso').length;
        
        // Detectar tareas atrasadas
        const tareasAtrasadas = tareasAsignadas.filter(tarea => {
            const fechaFin = new Date(tarea.fechaFin);
            fechaFin.setHours(0, 0, 0, 0);
            return fechaFin < hoy && tarea.estado !== 'completado';
        });
        
        const tieneAtrasadas = tareasAtrasadas.length > 0;

        const card = document.createElement('div');
        card.className = 'trabajador-card' + (tieneAtrasadas ? ' con-tareas-atrasadas' : '');
        card.innerHTML = `
            ${tieneAtrasadas ? `
                <div class="alerta-atrasadas">
                    ⚠️ ${tareasAtrasadas.length} atrasada${tareasAtrasadas.length > 1 ? 's' : ''}
                </div>
            ` : ''}
            <button class="btn-editar-trabajador" onclick="editarTrabajador('${trabajador.id}')">
                ✏️ Editar
            </button>
            <div class="trabajador-header">
                <div class="trabajador-info">
                    <h3>${trabajador.nombre}</h3>
                    <p>${trabajador.cargo || 'Sin cargo'}</p>
                    <p style="font-size: 12px; color: #999;">${trabajador.email || ''}</p>
                </div>
                <div class="trabajador-stats">
                    <div class="stat-value">${tareasAsignadas.length}</div>
                    <div class="stat-label">Tareas</div>
                </div>
            </div>

            <div class="info-row" style="margin-bottom: 15px;">
                <div class="info-group">
                    <label>En Progreso:</label>
                    <p style="color: var(--warning); font-weight: 600;">${tareasEnProgreso}</p>
                </div>
                <div class="info-group">
                    <label>Completadas:</label>
                    <p style="color: var(--success); font-weight: 600;">${tareasCompletadas}</p>
                </div>
            </div>

            <div class="trabajador-tareas">
                ${tareasAsignadas.length === 0 ? 
                    '<p style="text-align: center; color: #999; padding: 20px;">Sin tareas asignadas</p>' :
                    tareasAsignadas.map(tarea => {
                        const fechaFin = new Date(tarea.fechaFin);
                        fechaFin.setHours(0, 0, 0, 0);
                        const estaAtrasada = fechaFin < hoy && tarea.estado !== 'completado';
                        
                        return `
                            <div class="trabajador-task-item ${tarea.estado}${estaAtrasada ? ' atrasada' : ''}" onclick="abrirDetallesTarea('${tarea.id}')">
                                <div class="trabajador-task-title">${tarea.titulo}</div>
                                <div class="trabajador-task-meta">
                                    <span>${tarea.progreso}% completado</span>
                                    <span class="badge badge-sm prioridad-${tarea.prioridad}">${tarea.prioridad}</span>
                                </div>
                                ${estaAtrasada ? `
                                    <div style="font-size: 11px; color: var(--danger); margin-top: 5px;">
                                        Vencida: ${formatearFecha(tarea.fechaFin)}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

// Renderizar informes
function renderizarInformes() {
    renderizarResumenGeneral();
    renderizarRendimientoTrabajadores();
    renderizarTareasPorPlazo();
    renderizarTareasAtrasadas();
}

function renderizarResumenGeneral() {
    const total = appData.tareas.length;
    const pendientes = appData.tareas.filter(t => t.estado === 'pendiente').length;
    const enProgreso = appData.tareas.filter(t => t.estado === 'en-progreso').length;
    const completadas = appData.tareas.filter(t => t.estado === 'completado').length;
    const porcentajeCompletado = total > 0 ? Math.round((completadas / total) * 100) : 0;

    const container = document.getElementById('resumenGeneral');
    container.innerHTML = `
        <div class="stat-row">
            <label>Total de Tareas</label>
            <span class="value">${total}</span>
        </div>
        <div class="stat-row">
            <label>Pendientes</label>
            <span class="value" style="color: #999;">${pendientes}</span>
        </div>
        <div class="stat-row">
            <label>En Progreso</label>
            <span class="value" style="color: var(--warning);">${enProgreso}</span>
        </div>
        <div class="stat-row">
            <label>Completadas</label>
            <span class="value" style="color: var(--success);">${completadas}</span>
        </div>
        <div class="stat-row">
            <label>% de Finalización</label>
            <span class="value">${porcentajeCompletado}%</span>
        </div>
    `;
}

function renderizarRendimientoTrabajadores() {
    const container = document.getElementById('rendimientoTrabajadores');
    container.innerHTML = '';

    appData.trabajadores.forEach(trabajador => {
        const tareas = appData.tareas.filter(t => t.asignado === trabajador.nombre);
        const completadas = tareas.filter(t => t.estado === 'completado').length;
        const enProgreso = tareas.filter(t => t.estado === 'en-progreso').length;
        const pendientes = tareas.filter(t => t.estado === 'pendiente').length;

        const item = document.createElement('div');
        item.className = 'rendimiento-item';
        item.innerHTML = `
            <div class="rendimiento-nombre">${trabajador.nombre}</div>
            <div class="rendimiento-stats">
                <div>Completadas: <strong style="color: var(--success);">${completadas}</strong></div>
                <div>En Progreso: <strong style="color: var(--warning);">${enProgreso}</strong></div>
                <div>Pendientes: <strong style="color: #999;">${pendientes}</strong></div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderizarTareasPorPlazo() {
    const diarias = appData.tareas.filter(t => t.plazo === 'diario').length;
    const semanales = appData.tareas.filter(t => t.plazo === 'semanal').length;

    const container = document.getElementById('tareasPorPlazo');
    container.innerHTML = `
        <div class="stat-row">
            <label>Tareas Diarias</label>
            <span class="value">${diarias}</span>
        </div>
        <div class="stat-row">
            <label>Tareas Semanales</label>
            <span class="value">${semanales}</span>
        </div>
    `;
}

function renderizarTareasAtrasadas() {
    const hoy = new Date();
    const tareasAtrasadas = appData.tareas.filter(tarea => {
        const fechaFin = new Date(tarea.fechaFin);
        return fechaFin < hoy && tarea.estado !== 'completado';
    });

    const container = document.getElementById('tareasAtrasadas');
    
    if (tareasAtrasadas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--success); padding: 20px;">✅ No hay tareas atrasadas</p>';
        return;
    }

    container.innerHTML = tareasAtrasadas.map(tarea => {
        const diasAtrasada = Math.abs(calcularDiasRestantes(tarea.fechaFin));
        return `
            <div class="tarea-atrasada" onclick="abrirDetallesTarea('${tarea.id}')">
                <div class="tarea-atrasada-titulo">${tarea.titulo}</div>
                <div class="tarea-atrasada-info">
                    👤 ${tarea.asignado} | ⏰ ${diasAtrasada} días de retraso | 
                    📊 ${tarea.progreso}% completado
                </div>
            </div>
        `;
    }).join('');
}

// Exportar datos
function exportarDatos() {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('✅ Datos exportados exitosamente');
}

// Importar datos (función adicional)
function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const datos = JSON.parse(event.target.result);
                appData = datos;
                guardarDatos();
                actualizarSelectores();
                renderizarTablero();
                alert('✅ Datos importados exitosamente');
            } catch (error) {
                alert('❌ Error al importar datos: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Abrir modal para editar trabajador
function editarTrabajador(trabajadorId) {
    const trabajador = appData.trabajadores.find(t => t.id === trabajadorId);
    if (!trabajador) return;

    appData.trabajadorActual = trabajadorId;

    document.getElementById('editTrabajadorNombre').value = trabajador.nombre;
    document.getElementById('editTrabajadorEmail').value = trabajador.email || '';
    document.getElementById('editTrabajadorCargo').value = trabajador.cargo || '';

    showModal('modalEditarTrabajador');
}

// Guardar edición de trabajador
function guardarEdicionTrabajador(event) {
    event.preventDefault();

    const trabajador = appData.trabajadores.find(t => t.id === appData.trabajadorActual);
    if (!trabajador) return;

    const nombreAnterior = trabajador.nombre;
    const nombreNuevo = document.getElementById('editTrabajadorNombre').value;

    trabajador.nombre = nombreNuevo;
    trabajador.email = document.getElementById('editTrabajadorEmail').value;
    trabajador.cargo = document.getElementById('editTrabajadorCargo').value;

    // Actualizar tareas que tenían asignado al trabajador
    if (nombreAnterior !== nombreNuevo) {
        appData.tareas.forEach(tarea => {
            if (tarea.asignado === nombreAnterior) {
                tarea.asignado = nombreNuevo;
            }
        });
    }

    guardarDatos();
    actualizarSelectores();
    renderizarTablero();
    renderizarVistaTrabajadores();
    closeModal('modalEditarTrabajador');

    alert('✅ Trabajador actualizado exitosamente');
}

// Eliminar trabajador
function eliminarTrabajador() {
    if (!confirm('¿Estás seguro de eliminar este trabajador? Las tareas asignadas permanecerán pero sin asignación.')) return;

    const trabajador = appData.trabajadores.find(t => t.id === appData.trabajadorActual);
    if (!trabajador) return;

    // Remover asignación de tareas
    appData.tareas.forEach(tarea => {
        if (tarea.asignado === trabajador.nombre) {
            tarea.asignado = '';
        }
    });

    appData.trabajadores = appData.trabajadores.filter(t => t.id !== appData.trabajadorActual);
    guardarDatos();
    actualizarSelectores();
    renderizarTablero();
    renderizarVistaTrabajadores();
    closeModal('modalEditarTrabajador');

    alert('✅ Trabajador eliminado');
}