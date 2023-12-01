const { SerialPort } = require('serialport');
const mqtt = require('mqtt');

SerialPort.list().then(ports => {
    console.log('Serial ports:');
    ports.forEach(port => console.log(port));
});

const SERIAL_PORT_PATH = 'COM6'

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
    serialData += data.toString();
    while (true) {
        const delimiter = serialData.indexOf('\n');
        if (delimiter === -1) {
            break;
        }

        handleSerialMessage(serialData.substring(0, delimiter));
        serialData = serialData.substring(delimiter + 1);
    };
});

serialPort.on('error', function (error) {
    console.log(`Error: ${error.message}`);
});

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'serial-connector',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('Serial-connector connected to MQTT broker');

    mqttClient.subscribe('babocar/request-params');
    mqttClient.subscribe('babocar/update-params');

    mqttClient.subscribe('babocar/request-track-control');
    mqttClient.subscribe('babocar/update-track-control');
});

mqttClient.on('message', (topic, payload) => {
    const message = JSON.parse(payload.toString());
    switch (topic) {
        case 'babocar/request-params':
            serialPort.write(paramsToSerial({}));
            break;

        case 'babocar/update-params':
            serialPort.write(paramsToSerial(message));
            break;

        case 'babocar/request-track-control':
            serialPort.write(trackControlToSerial({}));
            break;

        case 'babocar/update-track-control':
            serialPort.write(trackControlToSerial(message));
            break;

        default:
            console.log(`Unhandled topic: ${topic}`);
    }
});

function handleSerialMessage(msg) {
    const delimiter = msg.indexOf(':');
    if (delimiter === -1) {
        console.log(`Error: serial message does not match expected format: ${msg}`);
        return;
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
            broadcastParams(paramsFromSerial(data));
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
    mqttClient.publish('babocar/log', JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        text
    }));
}

function broadcastCar(car) {
    mqttClient.publish('babocar/car', JSON.stringify(car));
}

function broadcastParams(params) {
    mqttClient.publish('babocar/params', JSON.stringify(params));
}

function broadcastTrackControl(trackControl) {
    mqttClient.publish('babocar/track-control', JSON.stringify(trackControl));
}

function toSerial(code, data) {
    return `${code}:${JSON.stringify(data)}\n`;
}

function radToDeg(rad) {
    return rad * 180.0 / Math.PI;
}

function degToRad(rad) {
    return rad * Math.PI / 180.0;
}

function carFromSerial(str) {
    const props = JSON.parse(str);

    return {
        pos_m: { x: props[0] / 1000, y: props[1] / 1000 },
        angle_deg: props[2],
        speed_mps: props[3],
        frontWheelAngle_deg: radToDeg(props[4]),
        rearWheelAngle_deg: radToDeg(props[5]),
        line: {
            actual: { pos_m: props[6] / 1000, angle_deg: radToDeg(props[7]) },
            target: { pos_m: props[8] / 1000, angle_deg: radToDeg(props[9]) }
        },
        isRemoteControlled: props[10] === '1' ? true : false
    };
}

function paramsFromSerial(str) {
    return str;
}

function paramsToSerial(params) {
    return toSerial('P', params);
}


function trackControlFromSerial(trackType, str) {
    const values = JSON.parse(str);
    let control = { type: trackType, section: {} };

    control.section = {
        name: values[0],
        control: {
            speed_mps: values[1],
            rampTime_ms: values[2],
            lineGradient: {
                from: { pos_m: values[3] / 1000, angle_deg: radToDeg(values[4]) },
                to: { pos_m: values[5] / 1000, angle_deg: radToDeg(values[6]) }
            }
        }
    };

    return control;
}

function trackControlToSerial(control) {
    let sections = [];

    for (s in control.sections) {
        sections.push([
            s.name,
            s.control.speed_mps,
            s.control.rampTime_ms,
            Math.round(s.control.lineGradient.from.pos_m * 1000),
            degToRad(s.control.lineGradient.from.angle_deg),
            Math.round(s.control.lineGradient.to.pos_m * 1000),
            degToRad(s.control.lineGradient.to.angle_deg)
        ]);
    }

    return toSerial('T', sections);
}
