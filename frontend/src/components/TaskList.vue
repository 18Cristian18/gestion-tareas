
<script setup>
defineProps({
  tareas: {
    type: Array,
    required: true
  },
  cargando: {
    type: Boolean,
    default: false
  }
});

defineEmits(['editar', 'eliminar']);
</script>

<template>
  <section class="lista">
    <h2>Mis tareas</h2>

    <p v-if="cargando" class="estado">
      Cargando tareas...
    </p>

    <p v-else-if="tareas.length === 0" class="estado">
      Todavía no tienes tareas registradas.
    </p>

    <div v-else class="tareas">
      <article
        v-for="tarea in tareas"
        :key="tarea.id"
        class="tarjeta"
      >
        <div class="informacion">
          <h3>{{ tarea.titulo }}</h3>
          <p>{{ tarea.descripcion || 'Sin descripción' }}</p>
          <span :class="['estado-tarea', tarea.estado]">
            {{ tarea.estado }}
          </span>
        </div>

        <div class="acciones">
          <button
            type="button"
            class="editar"
            @click="$emit('editar', tarea)"
          >
            Editar
          </button>

          <button
            type="button"
            class="eliminar"
            @click="$emit('eliminar', tarea.id)"
          >
            Eliminar
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.lista {
  margin-top: 30px;
}

h2 {
  color: #10243a;
  margin-bottom: 18px;
}

.estado {
  color: #657386;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 10px;
}

.tareas {
  display: grid;
  gap: 15px;
}

.tarjeta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 1px solid #dce4ec;
}

.informacion h3 {
  color: #10243a;
  margin: 0 0 8px;
}

.informacion p {
  color: #657386;
  margin: 0 0 10px;
}

.estado-tarea {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
  background: #e8edf3;
  color: #263445;
}

.estado-tarea.completada {
  background: #d9f5e8;
  color: #145c38;
}

.estado-tarea.pendiente {
  background: #fff0cc;
  color: #754900;
}

.estado-tarea.en.progreso {
  background: #dcecff;
  color: #174b83;
}

.acciones {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 6px;
  padding: 9px 13px;
  cursor: pointer;
  font-weight: bold;
}

.editar {
  background: #087f73;
  color: white;
}

.eliminar {
  background: #b42318;
  color: white;
}

button:focus-visible {
  outline: 3px solid #10243a;
  outline-offset: 3px;
}

@media (max-width: 600px) {
  .tarjeta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
