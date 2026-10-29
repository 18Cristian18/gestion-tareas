const express = require('express');
const db = require('./database/db');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const servidor = http.createServer(app);
const io = new Server(servidor);

// Gestionar conexiones en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado en tiempo real');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* Exportar las tareas a un archivo JSON */
app.get('/api/tareas/exportar', (req, res) => {
    try {
        const tareas = db.prepare(
            'SELECT * FROM tareas ORDER BY id'
        ).all();

        const rutaArchivo = path.join(
            __dirname,
            'exports',
            'tareas.json'
        );

        fs.writeFileSync(
            rutaArchivo,
            JSON.stringify(tareas, null, 2),
            'utf8'
        );

        res.json({
            mensaje: 'Tareas exportadas correctamente',
            archivo: 'exports/tareas.json',
            cantidad: tareas.length
        });
    } catch (error) {
        console.error('Error al exportar tareas:', error);

        res.status(500).json({
            error: 'No se pudieron exportar las tareas'
        });
    }
});

// Consultar todas las tareas
app.get('/api/tareas', (req, res) => {
    const tareas = db.prepare(
        'SELECT * FROM tareas ORDER BY id'
    ).all();

    res.json(tareas);
});

// Consultar una tarea por su ID
app.get('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    const tarea = db.prepare(
        'SELECT * FROM tareas WHERE id = ?'
    ).get(id);

    if (!tarea) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    res.json(tarea);
});

// Crear una tarea
app.post('/api/tareas', (req, res) => {
    const { titulo, descripcion } = req.body;

    if (typeof titulo !== 'string' || !titulo.trim()) {
        return res.status(400).json({
            error: 'El titulo es obligatorio'
        });
    }

    if (
        descripcion !== undefined &&
        typeof descripcion !== 'string'
    ) {
        return res.status(400).json({
            error: 'La descripcion debe ser texto'
        });
    }

    const resultado = db.prepare(`
        INSERT INTO tareas (titulo, descripcion)
        VALUES (?, ?)
    `).run(
        titulo.trim(),
        typeof descripcion === 'string' ? descripcion.trim() : ''
    );

    const nuevaTarea = db.prepare(
        'SELECT * FROM tareas WHERE id = ?'
    ).get(resultado.lastInsertRowid);

    io.emit('tarea:creada', nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Actualizar una tarea
app.put('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    const tareaActual = db.prepare(
        'SELECT * FROM tareas WHERE id = ?'
    ).get(id);

    if (!tareaActual) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }

    const { titulo, descripcion, estado } = req.body;

    if (
        titulo !== undefined &&
        (typeof titulo !== 'string' || !titulo.trim())
    ) {
        return res.status(400).json({
            error: 'El titulo no puede estar vacio'
        });
    }

    if (
        descripcion !== undefined &&
        typeof descripcion !== 'string'
    ) {
        return res.status(400).json({
            error: 'La descripcion debe ser texto'
        });
    }

    if (
        estado !== undefined &&
        !['pendiente', 'en progreso', 'completada'].includes(estado)
    ) {
        return res.status(400).json({
            error: 'Estado no valido'
        });
    }

    const tareaActualizada = {
        titulo: titulo !== undefined ? titulo.trim() : tareaActual.titulo,
        descripcion: descripcion !== undefined
            ? descripcion.trim()
            : tareaActual.descripcion,
        estado: estado !== undefined ? estado : tareaActual.estado
    };

    db.prepare(`
        UPDATE tareas
        SET titulo = ?, descripcion = ?, estado = ?
        WHERE id = ?
    `).run(
        tareaActualizada.titulo,
        tareaActualizada.descripcion,
        tareaActualizada.estado,
        id
    );

    const resultado = db.prepare(
        'SELECT * FROM tareas WHERE id = ?'
    ).get(id);

    io.emit('tarea:actualizada', resultado);
    res.json(resultado);
});

// Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    const resultado = db.prepare(
        'DELETE FROM tareas WHERE id = ?'
    ).run(id);

    if (resultado.changes === 0) {
        return res.status(404).json({
            error: 'Tarea no encontrada'
        });
    }
    io.emit('tarea:eliminada', { id });
    res.status(204).end();
});

// Responder cuando la ruta no existe
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
servidor.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});