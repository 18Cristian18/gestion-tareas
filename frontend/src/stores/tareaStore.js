
import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
    obtenerTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
} from '../services/tareaService';

import { socket } from '../services/socketService';

export const useTareaStore = defineStore('tareas', () => {
    const tareas = ref([]);
    const cargando = ref(false);
    const error = ref('');
    const mensaje = ref('');

    // Evitar registrar varias veces los mismos eventos
    if (!socket.hasListeners('tarea:creada')) {
        socket.on('tarea:creada', (nuevaTarea) => {
            const existe = tareas.value.some(
                tarea => Number(tarea.id) === Number(nuevaTarea.id)
            );

            if (!existe) {
                tareas.value.push(nuevaTarea);
            }
        });

        socket.on('tarea:actualizada', (tareaActualizada) => {
            const indice = tareas.value.findIndex(
                tarea => Number(tarea.id) === Number(tareaActualizada.id)
            );

            if (indice !== -1) {
                tareas.value[indice] = tareaActualizada;
            }
        });

        socket.on('tarea:eliminada', ({ id }) => {
            tareas.value = tareas.value.filter(
                tarea => Number(tarea.id) !== Number(id)
            );
        });
    }

    // Consultar tareas
    async function cargarTareas() {
        cargando.value = true;
        error.value = '';

        try {
            tareas.value = await obtenerTareas();
        } catch (err) {
            error.value = err.message;
        } finally {
            cargando.value = false;
        }
    }

    // Crear tarea
    async function agregarTarea(datos) {
        error.value = '';
        mensaje.value = '';

        try {
            const nuevaTarea = await crearTarea(datos);

            const existe = tareas.value.some(
                tarea => Number(tarea.id) === Number(nuevaTarea.id)
            );

            if (!existe) {
                tareas.value.push(nuevaTarea);
            }

            mensaje.value = 'Tarea creada correctamente';
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        }
    }

    // Actualizar tarea
    async function modificarTarea(id, datos) {
        error.value = '';
        mensaje.value = '';

        try {
            const tareaActualizada = await actualizarTarea(id, datos);

            const indice = tareas.value.findIndex(
                tarea => Number(tarea.id) === Number(id)
            );

            if (indice !== -1) {
                tareas.value[indice] = tareaActualizada;
            }

            mensaje.value = 'Tarea actualizada correctamente';
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        }
    }

    // Eliminar tarea
    async function quitarTarea(id) {
        error.value = '';
        mensaje.value = '';

        try {
            await eliminarTarea(id);

            tareas.value = tareas.value.filter(
                tarea => Number(tarea.id) !== Number(id)
            );

            mensaje.value = 'Tarea eliminada correctamente';
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        }
    }

    return {
        tareas,
        cargando,
        error,
        mensaje,
        cargarTareas,
        agregarTarea,
        modificarTarea,
        quitarTarea
    };
});
