const socketIO = require("socket.io-client");

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

const SIMULATION_SPEED_MPS = 1;
const SIMULATION_INTERVAL_MS = 100;

let car = {
    pos_m: { x: 1, y: 0 },
    angle_rad: 0,
    speed_mps: SIMULATION_SPEED_MPS,
    frontWheelAngle_rad: 0.0,
    rearWheelAngle_rad: 0.0,
    line: {
        actual: { pos_m: 0.0, angle_rad: 0.0 },
        target: { pos_m: 0.0, angle_rad: 0.0 }
    },
    isRemoteControlled: true
};

let logIndex = 0;

let params = {
    motorCtrl_P: 1.0,
    isEnabled: false,
    myName: 'Soma'
};

setInterval(() => {
    broadcastCar();
}, SIMULATION_INTERVAL_MS);

setInterval(() => {
    broadcastLog();
    broadcastParams();
}, 1000);

function broadcastCar() {
    const radius = Math.sqrt(car.pos_m.x * car.pos_m.x + car.pos_m.y * car.pos_m.y);
    const distance = SIMULATION_SPEED_MPS * (SIMULATION_INTERVAL_MS / 1000);
    const d_angle = distance / radius;
    const newRadius = radius * 1.001;

    car.angle_rad += d_angle;
    if (car.angle_rad > 2 * Math.PI) {
        car.angle_rad -= 2 * Math.PI;
    }

    car.pos_m.x = newRadius * Math.cos(car.angle_rad);
    car.pos_m.y = newRadius * Math.sin(car.angle_rad);

    socket.emit('send', JSON.stringify({
        channel: 'car',
        car: car
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
            text: `Log message from server #${logIndex}`
        }
    }));
}

function broadcastParams() {
    params.motorCtrl_P += 0.1;

    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: params
    }));
}

function updateParams(paramsIn) {
    Object.keys(paramsIn).forEach(key => {
        params[key] = paramsIn[key];
        console.log(`Params updated: ${key} = ${params[key]}`);
    });

    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: params
    }));
}
