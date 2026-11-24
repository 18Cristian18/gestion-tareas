
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on('connect', () => {
    console.log('Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (error) => {
    console.error('Error inesperado en PostgreSQL:', error.message);
});

module.exports = pool;
