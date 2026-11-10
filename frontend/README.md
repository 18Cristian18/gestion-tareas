# Gestión de Tareas

## Descripción del proyecto

Este proyecto consiste en una aplicación web para organizar y administrar tareas. Permite crear nuevas tareas, consultar las tareas registradas, editar su información y eliminarlas cuando ya no sean necesarias.

La aplicación fue desarrollada utilizando Vue 3 y se conecta con una API creada anteriormente con Node.js y Express. Para guardar la información se utiliza una base de datos SQLite.

## Tecnologías utilizadas

- Vue 3: para desarrollar la interfaz de la aplicación.
- Vite: para ejecutar y compilar el proyecto.
- JavaScript: para programar las funcionalidades.
- Pinia: para administrar el estado de las tareas.
- Vue Router: para la navegación.
- Node.js y Express: para crear y utilizar la API.
- SQLite: para almacenar las tareas.
- Service Worker: para permitir cargar la aplicación sin conexión.
- Manifest: para configurar la instalación como aplicación PWA.

## Funcionalidades

La aplicación permite realizar las siguientes acciones:

- Registrar tareas con título y descripción.
- Consultar la lista de tareas.
- Editar la información de una tarea.
- Cambiar el estado de las tareas.
- Eliminar tareas.
- Mantener los datos guardados en SQLite.
- Mostrar mensajes cuando se realizan operaciones o cuando ocurre un error.
- Adaptar la interfaz a diferentes tamaños de pantalla.
- Instalar la aplicación como PWA.
- Cargar la estructura y los estilos principales sin conexión a Internet.

## Estructura del proyecto

```text
frontend/
├── evidencias/
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icon-512.png
├── src/
│   ├── components/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── App.vue
│   └── main.js
├── dist/
├── index.html
└── package.json
```

## Instalación y ejecución

Para utilizar el proyecto, primero se debe instalar Node.js.

Después, desde la terminal, ingresar a la carpeta `frontend` y ejecutar:

```bash
npm install
```

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

Para generar la versión de producción:

```bash
npm run build
```

Para visualizar la versión de producción:

```bash
npm run preview
```

También es necesario tener funcionando el servidor de la API en el puerto 3000 para poder consultar, registrar, actualizar y eliminar tareas.

## Pruebas realizadas

Durante el desarrollo se realizaron pruebas para comprobar el funcionamiento de la aplicación:

- Creación, consulta, edición y eliminación de tareas.
- Persistencia de los datos después de recargar la página.
- Comunicación entre Vue y la API.
- Visualización en pantallas móviles y tabletas.
- Registro y funcionamiento del Service Worker.
- Carga de la aplicación sin conexión a Internet.
- Compilación del proyecto para producción.

## Autor

Cristian Rondal

Proyecto realizado para la asignatura de Aplicaciones Web.
