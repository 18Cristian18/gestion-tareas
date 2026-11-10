<script setup>
import { ref, onMounted } from 'vue';

import AppHeader from '../components/AppHeader.vue';
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';

import { useTareaStore } from '../stores/tareaStore';

const tareaStore = useTareaStore();

const tareaEditar = ref(null);
const guardando = ref(false);

onMounted(() => {
  tareaStore.cargarTareas();
});

async function guardarTarea(datos) {
  guardando.value = true;

  try {
    let resultado;

    if (tareaEditar.value) {
      resultado = await tareaStore.modificarTarea(
        tareaEditar.value.id,
        datos
      );
    } else {
      resultado = await tareaStore.agregarTarea(datos);
    }

    if (resultado) {
      tareaEditar.value = null;
    }
  } finally {
    guardando.value = false;
  }
}

function seleccionarEdicion(tarea) {
  tareaEditar.value = { ...tarea };
}

function cancelarEdicion() {
  tareaEditar.value = null;
}

async function eliminarTarea(id) {
  const confirmar = window.confirm(
    '¿Estás seguro de que deseas eliminar esta tarea?'
  );

  if (confirmar) {
    await tareaStore.quitarTarea(id);
  }
}
</script>

<template>
  <AppHeader />

  <main class="contenedor">
    <section class="contenido">
      <TaskForm
        :tarea-editar="tareaEditar"
        :guardando="guardando"
        @guardar="guardarTarea"
        @cancelar="cancelarEdicion"
      />

      <div v-if="tareaStore.error" class="mensaje error" role="alert">
        {{ tareaStore.error }}
      </div>

      <div v-if="tareaStore.mensaje" class="mensaje exito" role="status">
        {{ tareaStore.mensaje }}
      </div>

      <TaskList
        :tareas="tareaStore.tareas"
        :cargando="tareaStore.cargando"
        @editar="seleccionarEdicion"
        @eliminar="eliminarTarea"
      />
    </section>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f3f7fb;
  font-family: Arial, Helvetica, sans-serif;
  color: #263445;
}

.contenedor {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 20px;
}

.contenido {
  display: grid;
  gap: 20px;
}

.mensaje {
  padding: 13px 16px;
  border-radius: 7px;
  font-weight: bold;
}

.error {
  background: #fde8e7;
  color: #8b1e18;
}

.exito {
  background: #d9f5e8;
  color: #145c38;
}

@media (max-width: 600px) {
  .contenedor {
    padding: 20px 12px;
  }
}
</style>
