
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/tareas';

// Obtener la dirección base del backend, sin /api/tareas
const SERVER_URL = API_URL.replace(/\/api\/tareas\/?$/, '');

export const socket = io(SERVER_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
});

socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Desconectado de Socket.IO:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión Socket.IO:', error.message);
});
