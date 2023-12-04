const cors = require('cors');
const express = require("express");
const http = require('http');
const socketIO = require("socket.io");
const mqtt = require('mqtt');

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

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'mqtt-socket',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('mqtt-socket connected to MQTT broker');
    mqttClient.subscribe('babocar/#');
});

mqttClient.on('message', (topic, payload) => {
    const message = payload.toString();
    io && io.emit('message', JSON.stringify({ topic, message }));
});

io.on('connection', (client) => {
    console.log(`${client.id} connected`);

    client.on('publish', function (message) {
        const msg = JSON.parse(message);
        mqttClient.publish(msg.topic, msg.message);
    });

    client.on('disconnect', () => {
        console.log(`${client.id} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
