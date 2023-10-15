const fs = require('fs');
const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'feed-logger',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

const stream = fs.createWriteStream(`babocar_${new Date().toISOString()}.feed`);

mqttClient.on('connect', () => {
    console.log('Feed-logger connected to MQTT broker');
    mqttClient.subscribe('babocar/#');
});

mqttClient.on('message', (topic, payload) =>
    stream.write(`${JSON.stringify({ timestamp: new Date().toISOString(), topic, message: payload.toString() })}\n`));
