import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Lógica de Sockets
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    // Escuchar mensaje del cliente
    socket.on('chat:message', (data) => {
        // Emitir el mensaje a TODOS los conectados (incluido el que lo envió)
        io.emit('chat:message', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});