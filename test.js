global.APP_DIR = __dirname;
var fs = require('fs');

if (fs.existsSync(__dirname + '/env.seed')) {
    console.log('Preloading Envierment...');
    require(__dirname + '/env.seed');
}

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var content = 'Version: ' + process.version + '\n<br/>\n' +
                  'Env: {<br/>\n<pre>';
    //  Add env entries.
    for (var k in process.env) {
       content += '   ' + k + ': ' + process.env[k] + '\n';
    }
    content += '}\n</pre><br/>\n';
    res.write('<!doctype html>\n<html>\n' +
            '  <head><title>Node.js Process Env</title></head>\n' +
            '  <body>\n<br/>\n' + content + '</body>\n</html>');
    res.end();
}).listen(process.env.PORT, process.env.IP);
