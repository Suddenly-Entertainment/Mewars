// load library
var fs = require('fs');

function HomeController() {
    // define controller data
    this.cache = { 'index.html': '' };
    this.cache['index.html'] = fs.readFileSync(global.APP_DIR + '/index.html');

    // define utility functions
    this.cache_get = function(key) { return this.cache[key]; };

    // define rout functions
    this.health = function(req, res) {
        res.send('1');
    };

    this.index = function(req, res) {
        res.set('Content-Type', 'text/html');
        res.send(this.cache_get('index.html') );
    };

    this.env = function(req, res) {
        var content = 'Version: ' + process.version + '\n<br/>\n' +
                      'Env: {<br/>\n<pre>';
        //  Add env entries.
        for (var k in process.env) {
           content += '   ' + k + ': ' + process.env[k] + '\n';
        }
        content += '}\n</pre><br/>\n';
        res.send(content);
        res.send('<html>\n' +
                 '  <head><title>Node.js Process Env</title></head>\n' +
                 '  <body>\n<br/>\n' + content + '</body>\n</html>');
    };
}

var controller = new HomeController();

// define routes we handel here
exports.verbs = {
    'get':  {
        '/':       controller.index,
        '/health': controller.health,
        '/env':    controller.env

    },
    'post': {

    }

};
