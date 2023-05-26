const fs = require('fs');
const socketIO = require("socket.io-client");

const socket = socketIO.connect('http://localhost:3001', {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let stream = fs.createWriteStream(`babocar_${new Date().toISOString()}.feed`);
socket.emit('subscribe', '*');
socket.on('feed', (msg) => stream.write(`${JSON.stringify({ timestamp: new Date().toISOString(), message: msg })}\n`));
