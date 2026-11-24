
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/tareas';

// Consultar todas las tareas
export async function obtenerTareas() {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las tareas');
    }

    return await respuesta.json();
}

// Crear una tarea
export async function crearTarea(tarea) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || 'No se pudo crear la tarea');
    }

    return await respuesta.json();
}

// Actualizar una tarea
export async function actualizarTarea(id, tarea) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || 'No se pudo actualizar la tarea');
    }

    return await respuesta.json();
}

// Eliminar una tarea
export async function eliminarTarea(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || 'No se pudo eliminar la tarea');
    }

    return true;
}
