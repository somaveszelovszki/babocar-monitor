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

let trackType = 'test';

mqttClient.on('connect', () => {
    console.log('serial-connector connected to MQTT broker');

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
            trackType = 'race';
            broadcastTrackControl(trackControlFromSerial(data));
            break;

        case 'T':
            trackType = 'test';
            broadcastTrackControl(trackControlFromSerial(data));
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
        angle_deg: radToDeg(props[2]),
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
    return JSON.parse(str);
}

function paramsToSerial(params) {
    return toSerial('P', params);
}


function trackControlFromSerial(str) {
    const values = JSON.parse(str);
    return {
        type: trackType,
        name: getTrackSectionName(values[0]),
        control: {
            speed_mps: values[1],
            rampTime_ms: values[2],
            lineGradient: {
                from: { pos_m: values[3] / 1000, angle_deg: radToDeg(values[4]) },
                to: { pos_m: values[5] / 1000, angle_deg: radToDeg(values[6]) }
            }
        }
    };
}

function trackControlToSerial(sectionControl) {
    let items = sectionControl.type === trackType && sectionControl.hasOwnProperty('name') ? [
        getTrackSectionIndex(sectionControl.name),
        sectionControl.control.speed_mps,
        sectionControl.control.rampTime_ms,
        Math.round(sectionControl.control.lineGradient.from.pos_m * 1000),
        degToRad(sectionControl.control.lineGradient.from.angle_deg),
        Math.round(sectionControl.control.lineGradient.to.pos_m * 1000),
        degToRad(sectionControl.control.lineGradient.to.angle_deg)
    ] : [];

    return toSerial('T', items);
}

function getTrackSectionIndex(name) {
    const info = trackType === 'race' ? RACE_TRACK_INFO : TEST_TRACK_INFO;
    return info.findIndex(s => s === name);
}

function getTrackSectionName(index) {
    const info = trackType === 'race' ? RACE_TRACK_INFO : TEST_TRACK_INFO;
    return info[index];
}

const RACE_TRACK_INFO = [
    'fast1',
    'slow1_prepare',
    'slow1_round1',
    'slow1_round2',
    'fast2',
    'slow2_prepare',
    'slow2_begin1',
    'slow2_begin2',
    'slow2_round1',
    'slow2_round2',
    'fast3',
    'slow3_prepare',
    'slow3_round1',
    'slow3_round2',
    'slow3_end1',
    'slow3_end2',
    'fast4',
    'slow4_prepare',
    'slow4_round1',
    'slow4_round2',
];

const TEST_TRACK_INFO = [
    'fast1',
    'slow1_prepare',
    'slow1_chicane1',
    'slow1_chicane2',
    'fast2',
    'slow2_prepare',
    'slow2_begin',
    'slow2_round1',
    'slow2_round2',
    'slow2_end1',
    'slow2_end2',
    'fast3',
    'slow3_prepare',
    'slow3_chicane1',
    'slow3_chicane2',
    'fast4',
    'slow4_prepare',
    'slow4_begin',
    'slow4_round1',
    'slow4_round2',
    'slow4_end1',
    'slow4_end2'
];