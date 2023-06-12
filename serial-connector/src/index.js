const SerialPort = require('serialport');
const SocketIO = require("socket.io-client");

console.log('Serial ports:');
SerialPort.list().then(ports => ports.forEach(console.log));

const SERIAL_PORT_PATH = '/dev/ttyAMA0'

var serialPort = new SerialPort(SERIAL_PORT_PATH,
    options = {
        baudRate: 115200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    }
);

serialPort.on('open', function () {
    console.log(`Serial port opened: ${SERIAL_PORT_PATH}`);
});

let serialData = '';
serialPort.on('data', function (data) {
    serialData += data;
    const delimiter = data.indexOf('$');
    if (delimiter !== -1) {
        handleSerialMessage(serialData.substring(0, delimiter).replace('\r', '').replace('\n', ''));
        serialData = serialData.substring(delimiter + 1);
    }
});

serialPort.on('error', function (error) {
    console.log(`Error: ${error.message}`);
    if (error.message.includes('busy') === true || error.message.includes('no device') === true) {
        SerialPort.list().then(ports => ports.forEach(console.log));
    }
});

const socket = SocketIO.connect('http://localhost:3001', {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socket.on('feed', handleSocketFeed);

socket.emit('subscribe', 'update-params');
socket.emit('subscribe', 'update-track-control');

function handleSerialMessage(msg) {
    console.log(`Received serial data: ${msg}`);
    const delimiter = msg.indexOf(':');
    if (delimiter === -1) {
        console.log(`Error: serial message does not contain match expected format: ${msg}`);
    }

    const code = msg[0];
    const data = msg.substring(2);

    switch (code) {
        case 'D':
        case 'I':
        case 'W':
        case 'E':
            broadcastLog(code, data);
            break;

        case 'C':
            broadcastCar(carFromSerial(data));
            break;

        case 'P':
            broadcastParameters(data);
            break;

        case 'R':
            broadcastTrackControl(trackControlFromSerial('race', data));
            break;

        case 'T':
            broadcastTrackControl(trackControlFromSerial('test', data));
            break;
    }
}

function handleSocketFeed(json) {
    console.log(`Received feed: ${json}`);
    const msg = JSON.parse(json);
    switch (msg.channel) {
        case 'update-params':
            serialPort.write(paramsToSerial(msg.params));
            break;

        case 'update-track-control':
            serialPort.write(trackControlToSerial(msg.trackControl));
            break;

        default:
            console.log(`Received feed from unhandled channel: ${msg.channel}`);
    }
}

function broadcastLog(level, text) {
    socket.emit('send', JSON.stringify({
        channel: 'log',
        log: {
            timestamp: new Date().toISOString(),
            level: level,
            text: text
        }
    }));
}

function broadcastCar(car) {
    socket.emit('send', JSON.stringify({
        channel: 'car',
        car: car
    }));
}

function broadcastParameters(params) {
    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: params
    }));
}

function broadcastTrackControl(control) {
    socket.emit('send', JSON.stringify({
        channel: 'track-control',
        trackControl: control
    }));
}

function carFromSerial(str) {
    const regex = /(\d+),(\d+),(\d+\.\d+),(\d+\.\d+),(\d+\.\d+),(\d+\.\d+),(\d+),(\d+\.\d+),(\d+),(\d+\.\d+),(\d)/g;
    const m = str.matchAll(regex);

    return {
        pos_m: { x: m[0] / 1000, y: m[1] / 1000 },
        angle_rad: m[2],
        speed_mps: m[3],
        frontWheelAngle_rad: m[4],
        rearWheelAngle_rad: m[5],
        line: {
            actual: { pos_m: m[6] / 1000, angle_rad: m[7] },
            target: { pos_m: m[8] / 1000, angle_rad: m[9] }
        },
        isRemoteControlled: m[10] === '1' ? true : false
    };
}

function trackControlFromSerial(trackType, str) {
    const sections = JSON.parse(str);
    let control = { type: trackType, sections: [] };

    for (s in sections) {
        control.sections.push({
            speed_mps: s[0],
            rampTime_ms: s[1],
            lineGradient: {
                from: { pos_m: s[2] / 1000, angle_rad: s[3] },
                to: { pos_m: s[4] / 1000, angle_rad: s[5] }
            }
        });
    }

    return control;
}

function paramsToSerial(params) {
    return `P:${JSON.stringify(params)}$\r\n`;
}

function trackControlToSerial(control) {
    const code = control.type == 'race' ? 'R' : 'T';
    let sections = [];

    for (s in control.sections) {
        sections.push([
            s.speed_mps,
            s.rampTime_ms,
            Math.round(s.lineGradient.from.pos_m * 1000),
            s.lineGradient.from.angle_rad,
            Math.round(s.lineGradient.to.pos_m * 1000),
            s.lineGradient.to.angle_rad
        ]);
    }

    return `${code}:${JSON.stringify(sections)}$\r\n`;
}
