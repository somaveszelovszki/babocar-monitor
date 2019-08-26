var http = require('http');
var fs = require('fs');
var SerialPort = require('serialport');

var port = new SerialPort('/dev/ttyAMA0', {
   baudRate: 57600,
   dataBits: 8,
   parity: 'none',
   stopBits: 1,
   flowControl: false
});

http.createServer(index).listen(8080);

function index (req, res) {
  fs.readFile('index.html', function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}
