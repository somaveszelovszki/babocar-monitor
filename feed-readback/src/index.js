const fs = require('fs');
const lineReader = require('line-reader');
const minimist = require('minimist');
const socketIO = require("socket.io-client");

var args = minimist(process.argv.slice(2));

if (!args.file) {
    throw 'Please provide the feed file name: --file={example.feed}'
}

const socket = socketIO.connect('http://localhost:3001', {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let startTime = { actual: Date.now(), feed: 0 };

lineReader.eachLine(args.file, function (line, last) {
    const feed = JSON.parse(line);
    const feedTime = Date.parse(feed.timestamp);
    if (startTime.feed === 0) {
        startTime.feed = feedTime;
    }

    const delay = startTime.actual + (feedTime - startTime.feed) - Date.now();
    setTimeout(() => {
        socket.emit('send', feed.message);
        if (last) {
            console.log('Reached end of feed.');
            process.exit(0);
        }
    }, delay);
});
