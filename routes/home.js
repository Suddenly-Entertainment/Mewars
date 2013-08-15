// load library
var fs = require('fs'); //This is the file system library

function HomeController() {
    // define controller data
    var self = this;
    self.cache = { 'index.html': '' };
    self.cache['index.html'] = fs.readFileSync(global.APP_DIR + '/index.html');

    // define utility functions
    self.cache_get = function(key) { return self.cache[key]; };

    // define rout functions
    self.health = function(req, res) {
        res.send('1');
    };

    self.index = function(req, res) {
        res.set('Content-Type', 'text/html');
        res.send(self.cache_get('index.html') );
    };

    self.env = function(req, res) {
        var content = 'Version: ' + process.version + '\n<br/>\n' +
                      'Env: {<br/>\n<pre>';
        //  Add env entries.
        for (var k in process.env) {
           content += '   ' + k + ': ' + process.env[k] + '\n';
        }
        content += '}\n</pre><br/>\n';
        //res.send(content);
        res.send('<html>\n' +
                 '  <head><title>Node.js Process Env</title></head>\n' +
                 '  <body>\n<br/>\n' + content + '</body>\n</html>');
    };
}

var controller = new HomeController();

// define routes we handle here
exports.verbs = {
    'get':  {
        '/':       controller.index,
        '/health': controller.health,
        '/env':    controller.env

    },
    'post': {

    }

};
