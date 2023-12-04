const fs = require('fs');
const lineReader = require('line-reader');
const minimist = require('minimist');
const mqtt = require('mqtt');

var args = minimist(process.argv.slice(2));

if (!args.file) {
    throw 'Please provide the feed file name: --file={example.feed}'
}

const mqttClient = mqtt.connect('mqtt://localhost', {
    clientId: 'feed-readback-connector',
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('feed-readback connected to MQTT broker');
});

const startTime = { actual: Date.now(), feed: 0 };

lineReader.eachLine(args.file, function (line, last) {
    const feed = JSON.parse(line);
    const feedTime = Date.parse(feed.timestamp);
    if (startTime.feed === 0) {
        startTime.feed = feedTime;
    }

    const delay = startTime.actual + (feedTime - startTime.feed) - Date.now();
    setTimeout(() => {
        mqttClient.publish(feed.topic, feed.message);
        if (last) {
            console.log('Reached end of feed.');
            process.exit(0);
        }
    }, delay);
});
