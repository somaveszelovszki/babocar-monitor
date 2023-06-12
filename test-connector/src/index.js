const socketIO = require("socket.io-client");

const data = require("./data");

const socket = socketIO.connect('http://localhost:3001', {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socket.emit('subscribe', 'update-params');

socket.on('feed', (json) => {
    console.log(`Received feed: ${json}`);
    const msg = JSON.parse(json);
    switch (msg.channel) {
        case 'update-params':
            updateParams(msg.params);
            break;

        default:
            console.log(`Received feed from unhandled channel: ${msg.channel}`);
    }
});

const SIMULATION_INTERVAL_MS = 100;

let logIndex = 0;

setInterval(() => broadcastCar(), SIMULATION_INTERVAL_MS);

setInterval(() => {
    broadcastLog();
    broadcastParams();
    broadcastTrackControlParameters()
}, 1000);

function broadcastCar() {
    const radius = Math.sqrt(data.car.pos_m.x * data.car.pos_m.x + data.car.pos_m.y * data.car.pos_m.y);
    const distance = data.car.speed_mps * (SIMULATION_INTERVAL_MS / 1000);
    const d_angle = distance / radius;
    const newRadius = radius * 1.001;

    data.car.angle_rad += d_angle;
    if (data.car.angle_rad > 2 * Math.PI) {
        data.car.angle_rad -= 2 * Math.PI;
    }

    data.car.pos_m.x = newRadius * Math.cos(data.car.angle_rad);
    data.car.pos_m.y = newRadius * Math.sin(data.car.angle_rad);

    socket.emit('send', JSON.stringify({
        channel: 'car',
        car: data.car
    }));
}

function broadcastLog() {
    logIndex += 1;

    let getLogLevel = () => {
        switch (logIndex % 4) {
            case 0: return 'D';
            case 1: return 'I';
            case 2: return 'W';
            case 3: return 'E';
        }
    }

    socket.emit('send', JSON.stringify({
        channel: 'log',
        log: {
            timestamp: new Date().toISOString(),
            level: getLogLevel(),
            text: `Log message #${logIndex}`
        }
    }));
}

function broadcastParams() {
    data.params.motorCtrl_P += 0.1;

    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: data.params
    }));
}

function broadcastTrackControlParameters() {
    socket.emit('send', JSON.stringify({
        channel: 'trackControl',
        trackControl: data.trackControl
    }));
}

function updateParams(paramsIn) {
    Object.keys(paramsIn).forEach(key => {
        data.params[key] = paramsIn[key];
        console.log(`Params updated: ${key} = ${data.params[key]}`);
    });

    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: data.params
    }));
}
