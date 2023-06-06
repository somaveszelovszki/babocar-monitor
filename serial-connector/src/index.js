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
            broadcastCar(stringToCar(data));
            break;

        case 'P':
            broadcastParameters(data);
            break;
    }
}

function handleSocketFeed(json) {
    console.log(`Received feed: ${json}`);
    const msg = JSON.parse(json);
    switch (msg.channel) {
        case 'update-params':
            serialPort.write(JSON.stringify(msg.params));
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
        car: JSON.stringify(car)
    }));
}

function broadcastParameters(paramsStr) {
    socket.emit('send', JSON.stringify({
        channel: 'params',
        params: paramsStr
    }));
}

function stringToCar(str) {
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
