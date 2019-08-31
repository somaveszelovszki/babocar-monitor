var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
const cheerio = require('cheerio');

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

var socket;
io.on('connection', function(socket_) {
    socket = socket_;
    console.log('A user connected');
    sendDebugParams(JSON.parse('{"car":{"pose":{"pos":{"X":100.0000,"Y":200.0000},"angle":5.0000},"speed":1.5000},"useSafetySignal":false,"motorEnabled":true}'));
  
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

function printDebugParamValues(parent, obj) {
  let html = '';
  html += '<table>';
  if (typeof obj == 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let id = (parent == '' ? '' : parent + '-') + key;
        html += '<tr><td valign="top" id="' + id + '"><label>' + key + '</label></td>' +
                '<td><div class="param-value">';
        html += printDebugParamValues(id, obj[key]);
        html += '</div></td></tr>';
      }
    }
  } else {
    if (typeof obj == 'boolean') {
      html += '<input type="checkbox"' + (obj ? ' checked' : '') + '/>';
    } else {
      html += '<input type="text" value="' + obj + '"/>';      
    }
  }

  html += '</table>';

  return html;
}

function sendDebugParams(obj) {
  var html = printDebugParamValues('', obj);
  console.log(html);
  socket.emit('debugParamValues', html);
}

var uartRecv = '';
port.on('data', function(data) {
  uartRecv += data;
  if (data.indexOf('$') != -1) {
    console.log('Data received throguh UART: ', uartRecv);
    sendDebugParams(JSON.parse(uartRecv));
    uartRecv = '';  }
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
