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
        io.sockets.in(msg.channel).emit('feed', msg);
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

let car = {
    pos_m: { x: 0, y: 0 },
    angle_rad: 0,
    speed_mps: 0
};

let logIndex = 0;

let params = {
    motorCtrl_P: 1.0,
    isEnabled: false,
    myName: 'Soma'
};

setInterval(() => {
    car.pos_m.x += 0.5;
    car.pos_m.y += 1.0;
    car.angle_rad += Math.PI / 10;
    car.speed_mps += 0.1;

    io.sockets.in('car').emit('feed', JSON.stringify({
        channel: 'car',
        car: car
    }));

    logIndex += 1;

    let getLogLevel = () => {
        switch (logIndex % 4) {
            case 0: return 'D';
            case 1: return 'I';
            case 2: return 'W';
            case 3: return 'E';
        }
    }

    io.sockets.in('log').emit('feed', JSON.stringify({
        channel: 'log',
        log: {
            timestamp: new Date().toISOString(),
            level: getLogLevel(),
            text: `Very-very-very-very-very-very-very-very-very-very-very long log message from server #${logIndex}`
        }
    }));

    params.motorCtrl_P += 0.1;

    io.sockets.in('params').emit('feed', JSON.stringify({
        channel: 'params',
        params: params
    }));


}, 1000);