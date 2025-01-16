const {Server} = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        method : ['GET','POST']
    },
});
io.on('connection', (socket) => {
    console.log(`${socket.id}user connected`);
    socket.on('disconnect', () => {
        disconnectFromSocket(io, socket);
    });
});
module.exports = {app, server};