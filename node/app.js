/**
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello from <a href="http://appfog.com">AppFog.com</a>');
}).listen(process.env.VMC_APP_PORT || 1337, null);
**/

var app = require('express')();;
var server = require('http').createServer(app)
var io = require('socket.io');

ioServ = io.listen(server, {'flash policy port': -1});


ioServ.configure('production', function(){
	/**
	ioServ.enable('browser client minification');  // send minified client
	ioServ.enable('browser client etag');          // apply etag caching logic based on version number
	ioServ.enable('browser client gzip');          // gzip the file
	ioServ.set('log level', 1);                    // reduce logging
	**/
	ioServ.set('transports', [
		'xhr-polling'
	//  , 'websocket'
	//  , 'flashsocket'
	//  , 'htmlfile'
	//  , 'jsonp-polling'
	]);
});

ioServ.configure('development', function(){
  ioServ.set('transports', [
		'xhr-polling'
	//  , 'websocket'
	//  , 'flashsocket'
	//  , 'htmlfile'
	//  , 'jsonp-polling'
	]);
});

server.listen(process.env.VCAP_APP_PORT || 5000);

app.get('/', function (req, res) {
  res.send('Hello from <a href="http://appfog.com">AppFog.com</a> our test seems to have worked.');
  //res.sendfile(__dirname + '/index.html');
});

ioServ.sockets.on('connection', function (socket) {
  socket.emit('test', { hello: 'world' });
  socket.on('test event', function (data) {
    console.log(data);
  });
});