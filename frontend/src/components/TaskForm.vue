
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  tareaEditar: {
    type: Object,
    default: null
  },
  guardando: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['guardar', 'cancelar']);

const titulo = ref('');
const descripcion = ref('');
const estado = ref('pendiente');

watch(
  () => props.tareaEditar,
  (tarea) => {
    if (tarea) {
      titulo.value = tarea.titulo;
      descripcion.value = tarea.descripcion || '';
      estado.value = tarea.estado;
    } else {
      limpiarFormulario();
    }
  },
  { immediate: true }
);

function limpiarFormulario() {
  titulo.value = '';
  descripcion.value = '';
  estado.value = 'pendiente';
}

function enviarFormulario() {
  if (!titulo.value.trim()) {
    return;
  }

  emit('guardar', {
    titulo: titulo.value.trim(),
    descripcion: descripcion.value.trim(),
    estado: estado.value
  });
}

function cancelarEdicion() {
  limpiarFormulario();
  emit('cancelar');
}
</script>

<template>
  <section class="formulario">
    <h2>{{ tareaEditar ? 'Editar tarea' : 'Nueva tarea' }}</h2>

    <form @submit.prevent="enviarFormulario">
      <label for="titulo">Título de la tarea</label>
      <input
        id="titulo"
        v-model="titulo"
        type="text"
        placeholder="Ejemplo: Aprender Vue 3"
        maxlength="100"
        required
      />

      <label for="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        v-model="descripcion"
        placeholder="Describe brevemente la tarea"
        rows="3"
      ></textarea>

      <template v-if="tareaEditar">
        <label for="estado">Estado</label>
        <select id="estado" v-model="estado">
          <option value="pendiente">Pendiente</option>
          <option value="en progreso">En progreso</option>
          <option value="completada">Completada</option>
        </select>
      </template>

      <div class="botones">
        <button type="submit" class="guardar" :disabled="guardando">
          {{ guardando ? 'Guardando...' : tareaEditar ? 'Actualizar tarea' : 'Crear tarea' }}
        </button>

        <button
          v-if="tareaEditar"
          type="button"
          class="cancelar"
          @click="cancelarEdicion"
        >
          Cancelar
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.formulario {
  background: white;
  padding: 25px;
  border-radius: 10px;
  border: 1px solid #dce4ec;
}

h2 {
  color: #10243a;
  margin-top: 0;
  margin-bottom: 20px;
}

form {
  display: grid;
  gap: 10px;
}

label {
  color: #263445;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #b8c5d3;
  border-radius: 6px;
  font: inherit;
}

input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #087f73;
  outline-offset: 2px;
}

textarea {
  resize: vertical;
}

.botones {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

button {
  padding: 11px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.guardar {
  background: #087f73;
  color: white;
}

.cancelar {
  background: #e8edf3;
  color: #263445;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
