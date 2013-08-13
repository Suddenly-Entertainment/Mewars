var fs = require('fs');
var mime = require('mime');

function GameController(){
  
    var self = this;
    self.cache = { 'game.html': '' };
    self.cache['game.html'] = fs.readFileSync(global.APP_DIR + '/game.html');

    // define utility functions
    self.cache_get = function(key) { return self.cache[key]; };
    
    self.index = function (req, res) {
        res.set('Content-Type', 'text/html');
        res.send(self.cache_get('game.html') );
    }
  
    
}

var controller = new GameController();

exports.verbs = {
  'get': {
     '/game' : controller.index,
  }
}