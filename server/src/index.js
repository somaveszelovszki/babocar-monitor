const cors = require('cors');
const express = require("express");
const http = require('http');
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
let server = http.Server(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.wildCardClients = new Map();

io.on('connection', (client) => {
    console.log(`${client.id} connected`);

    client.on('subscribe', function (channel) {
        if (channel == '*') {
            console.log(`${client.id} subscribed to all channels`);
            io.wildCardClients.set(client.id, { socket: client, subscriptions: new Set() });
        } else {
            console.log(`${client.id} subscribed to channel: '${channel}'`);
            client.join(channel);
        }
    })

    client.on('unsubscribe', function (channel) {
        if (channel == '*') {
            console.log(`${client.id} unsubscribed from all channels`);
            io.wildCardClients.delete(client.id);
            io.rooms.forEach((c) => client.leave(c));
        } else {
            console.log(`${client.id} unsubscribed from channel: '${channel}'`);
            client.leave(channel);
        }
    })

    client.on('send', function (msg) {
        const channel = JSON.parse(msg).channel;

        io.wildCardClients
            .forEach((c, id) => {
                if (!c.subscriptions.has(channel)) {
                    console.log(`${id} subscribed to channel: '${channel}'`);
                    c.subscriptions.add(channel);
                    c.socket.join(channel);
                }
            });

        console.log(`Broadcasting message: ${msg}`);
        client.broadcast.to(channel).emit('feed', msg);
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
