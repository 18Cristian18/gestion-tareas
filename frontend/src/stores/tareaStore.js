
import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
    obtenerTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
} from '../services/tareaService';

export const useTareaStore = defineStore('tareas', () => {
    const tareas = ref([]);
    const cargando = ref(false);
    const error = ref('');
    const mensaje = ref('');

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
            tareas.value.push(nuevaTarea);
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
                tarea => tarea.id === id
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
                tarea => tarea.id !== id
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
