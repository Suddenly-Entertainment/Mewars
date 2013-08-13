var fs = require('fs');
var mime = require('mime');

function XmlController() {
    var self = this;
    
    self.index = function(req, res) {
        res.send(404, "Not Found");
    }
    
    self.includes = function(req, res) {
        var filepath = global.APP_DIR + '/resources/XML/';
        fs.readDir(filepath, function(err, files){
            res.set('Content-Type', "application/json"); 
            res.json(files);
        });
    }
    
    self.file = function(req, res) {
        var filepath = global.APP_DIR + '/resources/XML/' + req.params.name;
        
    }
    
    self.date = function(req, res) {
        
    }
    
}