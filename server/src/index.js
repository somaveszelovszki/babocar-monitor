const cors = require('cors');
const express = require("express");
const http = require('http');
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
var server = http.Server(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (client) => {
    console.log(`${client.id} connected`);

    client.on('subscribe', function (channel) {
        console.log(`${client.id} subscribed to '${channel}'`);
        client.join(channel);
    })

    client.on('unsubscribe', function (channel) {
        console.log(`${client.id} unsubscribed from '${channel}'`);
        client.leave(channel);
    })

    client.on('send', function (msg) {
        console.log(`Broadcasting message: ${msg}`);
        client.broadcast.to(JSON.parse(msg).channel).emit('feed', msg);
    });

    client.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/api', (_req, res) => {
    res.json({ message: "Hey!" });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
