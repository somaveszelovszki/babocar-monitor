const { SerialPort } = require('serialport');
const mqtt = require('mqtt');

SerialPort.list().then(ports => {
    console.log(`Serial ports: ${JSON.stringify(ports)}`);
});

const SERIAL_PORT_PATH = '/dev/ttyAMA0'

const serialPort = new SerialPort({
    path: SERIAL_PORT_PATH,
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

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

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'simulator-connector',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('Serial-connector connected to MQTT broker');

    mqttClient.subscribe('babocar/update-params');
    mqttClient.subscribe('babocar/update-track-control');
});

mqttClient.on('message', (topic, payload) => {
    const message = JSON.parse(payload.toString());
    switch (topic) {
        case 'babocar/update-params':
            serialPort.write(paramsToSerial(message));
            break;

        case 'babocar/update-track-control':
            serialPort.write(trackControlToSerial(message));
            break;

        default:
            console.log(`Unhandled topic: ${topic}`);
    }
});

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
    const props = JSON.parse(str);

    return {
        pos_m: { x: props[0] / 1000, y: props[1] / 1000 },
        angle_deg: props[2],
        speed_mps: props[3],
        frontWheelAngle_deg: props[4] * 180.0 / Math.PI,
        rearWheelAngle_deg: props[5] * 180.0 / Math.PI,
        line: {
            actual: { pos_m: props[6] / 1000, angle_deg: props[7] * 180.0 / Math.PI },
            target: { pos_m: props[8] / 1000, angle_deg: props[9] * 180.0 / Math.PI }
        },
        isRemoteControlled: props[10] === '1' ? true : false
    };
}

function trackControlFromSerial(trackType, str) {
    const sections = JSON.parse(str);
    let control = { type: trackType, sections: [] };

    for (s in sections) {
        control.sections.push({
            name: s[0],
            control: {
                speed_mps: s[1],
                rampTime_ms: s[2],
                lineGradient: {
                    from: { pos_m: s[3] / 1000, angle_deg: s[4] * 180.0 / Math.PI },
                    to: { pos_m: s[5] / 1000, angle_deg: s[6] * 180.0 / Math.PI }
                }
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
            s.name,
            s.control.speed_mps,
            s.control.rampTime_ms,
            Math.round(s.control.lineGradient.from.pos_m * 1000),
            s.control.lineGradient.from.angle_deg / 180.0 * Math.PI,
            Math.round(s.control.lineGradient.to.pos_m * 1000),
            s.control.lineGradient.to.angle_deg / 180.0 * Math.PI
        ]);
    }

    return `${code}:${JSON.stringify(sections)}$\r\n`;
}
