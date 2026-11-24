
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const pool = require('./database/postgres');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
];

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origen no permitido por CORS'));
    }
};

const servidor = http.createServer(app);

const io = new Server(servidor, {
    cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Notificaciones en tiempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado en tiempo real');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Comprobación del servidor y de PostgreSQL
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.status(200).json({
            status: 'ok',
            database: 'connected'
        });
    } catch (error) {
        console.error('Error en health check:', error.message);

        res.status(503).json({
            status: 'error',
            database: 'disconnected'
        });
    }
});

// Exportar tareas
app.get('/api/tareas/exportar', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM tareas ORDER BY id'
        );

        const directorio = path.join(__dirname, 'exports');

        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        const archivo = path.join(directorio, 'tareas.json');

        fs.writeFileSync(
            archivo,
            JSON.stringify(resultado.rows, null, 2),
            'utf8'
        );

        res.json({
            mensaje: 'Tareas exportadas correctamente',
            archivo: 'exports/tareas.json',
            cantidad: resultado.rows.length,
            tareas: resultado.rows
        });
    } catch (error) {
        console.error('Error al exportar tareas:', error.message);

        res.status(500).json({
            error: 'No se pudieron exportar las tareas'
        });
    }
});

// Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM tareas ORDER BY id'
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener tareas:', error.message);

        res.status(500).json({
            error: 'No se pudieron obtener las tareas'
        });
    }
});

// Obtener una tarea por ID
app.get('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    try {
        const resultado = await pool.query(
            'SELECT * FROM tareas WHERE id = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                error: 'Tarea no encontrada'
            });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al buscar tarea:', error.message);

        res.status(500).json({
            error: 'No se pudo buscar la tarea'
        });
    }
});

// Crear una tarea
app.post('/api/tareas', async (req, res) => {
    const { titulo, descripcion = '' } = req.body;

    if (!titulo || !titulo.trim()) {
        return res.status(400).json({
            error: 'El titulo es obligatorio'
        });
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO tareas (titulo, descripcion)
             VALUES ($1, $2)
             RETURNING *`,
            [titulo.trim(), descripcion]
        );

        const nuevaTarea = resultado.rows[0];

        io.emit('tarea:creada', nuevaTarea);

        res.status(201).json(nuevaTarea);
    } catch (error) {
        console.error('Error al crear tarea:', error.message);

        res.status(500).json({
            error: 'No se pudo crear la tarea'
        });
    }
});

// Actualizar una tarea
app.put('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descripcion, estado } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    if (
        !titulo ||
        !titulo.trim() ||
        typeof descripcion !== 'string' ||
        !['pendiente', 'en progreso', 'completada'].includes(estado)
    ) {
        return res.status(400).json({
            error: 'Los datos de la tarea no son validos'
        });
    }

    try {
        const resultado = await pool.query(
            `UPDATE tareas
             SET titulo = $1, descripcion = $2, estado = $3
             WHERE id = $4
             RETURNING *`,
            [titulo.trim(), descripcion, estado, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                error: 'Tarea no encontrada'
            });
        }

        const tareaActualizada = resultado.rows[0];

        io.emit('tarea:actualizada', tareaActualizada);

        res.json(tareaActualizada);
    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);

        res.status(500).json({
            error: 'No se pudo actualizar la tarea'
        });
    }
});

// Eliminar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un numero entero positivo'
        });
    }

    try {
        const resultado = await pool.query(
            'DELETE FROM tareas WHERE id = $1 RETURNING id',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                error: 'Tarea no encontrada'
            });
        }

        io.emit('tarea:eliminada', {
            id: resultado.rows[0].id
        });

        res.status(200).json({
            mensaje: 'Tarea eliminada correctamente',
            id: resultado.rows[0].id
        });
    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);

        res.status(500).json({
            error: 'No se pudo eliminar la tarea'
        });
    }
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// Manejo de errores
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error.message);

    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
servidor.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor PostgreSQL ejecutandose en el puerto ${PORT}`);
});

// Cierre ordenado del servidor
process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');

    servidor.close(async () => {
        await pool.end();
        process.exit(0);
    });
});
