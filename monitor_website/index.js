var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
const cheerio = require('cheerio')

app.get('/', function(req, res) {
    //res.sendfile('index.html');
  
    fs.readFile('index.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
  
      const $ = cheerio.load(data);
      
      console.log("Index");
      $('p').text('Hello there!');
      
      $('table#debug-params').append(
          '<tr>' +
              '<td onclick="debugParamClickHandler(this)">Jill</td>' +
              '<td>Smith</td>' +
          '</tr>'
      );
      
      res.write($.html());
      return res.end();
    }); 
  
});

io.on('connection', function(socket) {
   console.log('A user connected');
  
   setTimeout(function() {
      socket.emit('testerEvent', { desc: 'A custom event named testerEvent!'});
   }, 4000);

   socket.on('clientEvent', function (data) {
      console.log(data);
   });
  
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

var SerialPort = require('serialport');
var port = new SerialPort('/dev/serial0', {
   baudRate: 115200,
   dataBits: 8,
   parity: 'none',
   stopBits: 1,
   flowControl: false
});
 
port.on('open', function() {
  port.write('main screen turn on', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});

var uartRecv = '';
port.on('data', function(data) {
  uartRecv += data;
  if (data.indexOf('d') != -1) {
    console.log('Data received throguh UART: ', uartRecv);
    uartRecv = '';
  }
});
 
// open errors will be emitted as an error event 
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

http.listen(8080, function() {
   console.log('listening on *:8080');
});

//http.createServer(index).listen(8080);
//
//function index (req, res) {
//  if (req.method === 'POST') {
//    
//    let body = '';
//    req.on('data', chunk => {
//        body += chunk.toString();
//    });
//    req.on('end', () => {
//        console.log(body);
//        res.end('ok');
//    });
//    
//  } else {
//    
//    fs.readFile('index.html', function(err, data) {
//      if (err) {
//        res.writeHead(404, {'Content-Type': 'text/html'});
//        return res.end("404 Not Found");
//      }
//      res.writeHead(200, {'Content-Type': 'text/html'});
//  
//      const $ = cheerio.load(data);
//      
//      console.log("Index");
//      $('p').text('Hello there!');
//      
//      $('table#debug-params').append(
//          '<tr>' +
//              '<td onclick="myFunction(this)">Jill</td>' +
//              '<td>Smith</td>' +
//          '</tr>'
//      );
//      
//      res.write($.html());
//      return res.end();
//    });  
//    
//  }
//}
//
//function myFunction () {
//    console.log("clicked");
//}

//=> div appended to body
