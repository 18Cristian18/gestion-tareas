
# API REST - Gestión de Tareas

## Descripción
Proyecto desarrollado con Node.js y Express para administrar tareas mediante una API REST. Permite crear, consultar, actualizar y eliminar tareas, almacenando la información en una base de datos SQLite.

También incorpora Socket.IO para comunicar cambios en tiempo real y una función para exportar las tareas a un archivo JSON.

## Tecnologías utilizadas
- Node.js
- Express
- SQLite
- Better-SQLite3
- Socket.IO
- JavaScript
- HTML y CSS

## Requisitos
- Node.js instalado.
- npm instalado.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/18Cristian18/gestion-tareas.git
   ```

2. Entrar en la carpeta:

   ```bash
   cd gestion-tareas
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor:

   ```bash
   node server.js
   ```

5. Abrir en el navegador:

   http://localhost:3000

La base de datos SQLite y la tabla de tareas se crean automáticamente al iniciar el servidor.

## Rutas de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/tareas | Consultar todas las tareas |
| GET | /api/tareas/:id | Consultar una tarea por ID |
| POST | /api/tareas | Crear una tarea |
| PUT | /api/tareas/:id | Actualizar una tarea |
| DELETE | /api/tareas/:id | Eliminar una tarea |
| GET | /api/tareas/exportar | Exportar tareas a JSON |

## Ejemplo para crear una tarea

**Solicitud:**

```http
POST /api/tareas
Content-Type: application/json
```

```json
{
  "titulo": "Estudiar Node.js",
  "descripcion": "Practicar las rutas de una API REST"
}
```

**Respuesta esperada:** código HTTP 201 Created.

```json
{
  "id": 2,
  "titulo": "Estudiar Node.js",
  "descripcion": "Practicar las rutas de una API REST",
  "estado": "pendiente"
}
```

El ID es generado automáticamente por SQLite.

## Estados disponibles
- pendiente
- en progreso
- completada

## Comunicación en tiempo real

La aplicación utiliza Socket.IO para notificar los siguientes eventos:

- `tarea:creada`
- `tarea:actualizada`
- `tarea:eliminada`

Los cambios se transmiten a los clientes conectados.

## Exportación de archivos

La ruta `GET /api/tareas/exportar` genera el archivo `exports/tareas.json` con los registros almacenados en SQLite.

## Validaciones y manejo de errores

La API valida los datos recibidos y utiliza códigos HTTP para comunicar los resultados:

- 201: recurso creado.
- 200: consulta o actualización exitosa.
- 204: eliminación exitosa.
- 400: datos de entrada incorrectos.
- 404: recurso o ruta no encontrada.
- 500: error interno del servidor.

## Autor
Cristian Rondal

## Repositorio
https://github.com/18Cristian18/gestion-tareas