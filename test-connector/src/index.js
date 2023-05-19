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

    socket.emit('send', JSON.stringify({
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

    socket.emit('send', JSON.stringify({
        channel: 'log',
        log: {
            timestamp: new Date().toISOString(),
            level: getLogLevel(),
            text: `Log message from server #${logIndex}`
        }
    }));

    params.motorCtrl_P += 0.1;

    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: params
    }));
}, 1000);

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
