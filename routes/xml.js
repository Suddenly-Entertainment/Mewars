var fs = require('fs');
var mime = require('mime');

function XmlController() {
    var self = this;
    
    self.index = function(req, res) {
        res.send(404, "Not Found");
    }
    
    self.includes = function(req, res) {
        var filepath = global.APP_DIR + '/resources/XML/';
        fs.readdir(filepath, function(err, files){
            res.set('Content-Type', "application/json"); 
            res.json(files);
        });
    }
    
    self.file = function(req, res) {
        var name = req.params.name;
        var filepath = global.APP_DIR + '/resources/XML/' + name;
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/xml');
                fs.readFile(filepath, function(err, data){
                    if (err) throw err;
                    res.send(data);
                });
            }else{
                res.send(404, name + " Not Found");
            }
        });
    }
    
    self.date = function(req, res) {
        var name = req.params.name;
        var filepath = global.APP_DIR + "/resources/XML/" + name;
        fs.exists(filepath, function(exists){
            if(exists){
                fs.stat(filepath, function(err, stats){
                    if (err) throw err;
                    res.set("Content-Type", "application/json");
                    res.json(stats.mtime);
                    
                });
            }else{
                res.send(404, name + " Not Found");
            }
        });
    }
}

var controller = new XmlController();

exports.verbs = {
    'get':  {

        '/resource/XML/includes' : controller.includes,
        '/resource/XML/file/:name' : controller.file,
        '/resource/XML/date/:name' : controller.date,
        
    },
    'post': {

    }

};
