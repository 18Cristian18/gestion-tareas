
const Database = require('better-sqlite3');
const path = require('path');

// Ubicacion del archivo de base de datos
const rutaBD = path.join(__dirname, 'tareas.db');

// Abrir o crear la base de datos
const db = new Database(rutaBD);

// Crear la tabla de tareas si todavia no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL DEFAULT '',
        estado TEXT NOT NULL DEFAULT 'pendiente'
            CHECK (estado IN ('pendiente', 'en progreso', 'completada'))
    );
`);

console.log('Base de datos SQLite conectada correctamente');

// Exportar la conexion para utilizarla en server.js
module.exports = db;
