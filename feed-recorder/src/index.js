const fs = require('fs');
const mqtt = require('mqtt');

const RECORDINGS_DIR = '../recordings';

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'feed-recorder',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR);
}

const stream = fs.createWriteStream(`${RECORDINGS_DIR}/${getLogFileName()}`);

mqttClient.on('connect', () => {
    console.log('Feed-recorder connected to MQTT broker');
    mqttClient.subscribe('babocar/#');
});

mqttClient.on('message', (topic, payload) =>
    stream.write(`${JSON.stringify({ timestamp: new Date().toISOString(), topic, message: payload.toString() })}\n`));

function getLogFileName() {
    const date = new Date().toISOString();
    return `babocar_${date.replaceAll(':', '.')}.feed`
}