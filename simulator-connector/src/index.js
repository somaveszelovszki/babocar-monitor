const mqtt = require('mqtt');
const data = require("./data");

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'simulator-connector',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('Test-connector connected to MQTT broker');

    mqttClient.subscribe('babocar/update-params');
    mqttClient.subscribe('babocar/update-track-control');
});

mqttClient.on('message', (topic, payload) => {
    const message = JSON.parse(payload.toString());
    switch (topic) {
        case 'babocar/update-params':
            updateParams(message);
            break;

        case 'babocar/update-track-control':
            updateTrackControl(message);
            break;

        default:
            console.log(`Unhandled topic: ${topic}`);
    }
});

const SIMULATION_INTERVAL_MS = 100;

let logIndex = 0;

setInterval(() => broadcastCar(), SIMULATION_INTERVAL_MS);

setInterval(() => {
    broadcastLog();
    broadcastParams();
    broadcastTrackControl()
}, 1000);

function broadcastCar() {
    const radius = Math.sqrt(data.car.pos_m.x * data.car.pos_m.x + data.car.pos_m.y * data.car.pos_m.y);
    const distance = data.car.speed_mps * (SIMULATION_INTERVAL_MS / 1000);
    const d_angle = (distance / radius) * 180.0 / Math.PI;
    const newRadius = radius * 1.001;

    data.car.angle_deg += d_angle;
    if (data.car.angle_deg > 360.0) {
        data.car.angle_deg -= 360.0;
    }

    data.car.pos_m.x = newRadius * Math.cos(data.car.angle_deg / 180.0 * Math.PI);
    data.car.pos_m.y = newRadius * Math.sin(data.car.angle_deg / 180.0 * Math.PI);

    mqttClient.publish('babocar/car', JSON.stringify(data.car));
}

function broadcastLog() {
    logIndex++;

    let getLogLevel = () => {
        switch (logIndex % 4) {
            case 0: return 'D';
            case 1: return 'I';
            case 2: return 'W';
            case 3: return 'E';
        }
    }

    mqttClient.publish('babocar/log', JSON.stringify({
        timestamp: new Date().toISOString(),
        level: getLogLevel(),
        text: `Log message #${logIndex}`
    }));
}

function broadcastParams() {
    data.params.motorCtrl_P += 0.1;
    mqttClient.publish('babocar/params', JSON.stringify(data.params));
}

function broadcastTrackControl() {
    mqttClient.publish('babocar/track-control', JSON.stringify(data.trackControl));
}

function updateParams(paramsIn) {
    Object.keys(paramsIn).forEach(key => {
        data.params[key] = paramsIn[key];
        console.log(`Params updated: ${key} = ${data.params[key]}`);
    });

    mqttClient.publish('babocar/params', JSON.stringify(data.params));
}

function updateTrackControl(control) {
    if (control.type == data.trackControl.type) {
        data.trackControl.sections = control.sections;
        broadcastTrackControl();
    }
}
