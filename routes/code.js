var fs = require('fs');
var mime = require('mime');

function CodeController(){
    var self = this;
    
    self.cacheThis = function(req, res, filepath){
      fs.stat(filepath, function (err, stat) {
        if (err) {
          console.log(err.stack)
          res.send(500, 'Internal Server Error')
        }
        else {
          etag = stat.size + '-' + Date.parse(stat.mtime);
          res.set('Last-Modified', stat.mtime);

          if (req.get('if-none-match') === etag) {
            res.send(304, 'Not Modified')
          }
          else {
            fs.readFile(filepath, function(err,data){
              if (err) {
                console.log(err.stack)
                res.send(500, 'Internal Server Error')
              };
              res.set('ETag', etag);
              res.send(data);
            });
          }
        }
      })
    }
    
    self.includes = function(req, res){
        var filepath = global.APP_DIR + "/resources/Code/Include/";
        fs.readdir(filepath, function(err, files){
            if (err) {
              console.log(err.stack)
              res.send(500, 'Internal Server Error')
            }
            res.set('Content-Type', "application/json"); 
            res.json(files);
        });
    }
    
    self.bootstrap = function(req, res){
        var filepath = global.APP_DIR + '/resources/Code/Boot/bootstrap.js';
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/javascript');
                self.cacheThis(req, res, filepath);
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    self.loader = function(req, res){
        var filepath = global.APP_DIR + '/resources/Code/Boot/GameLoader.js';
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/javascript');
                self.cacheThis(req, res, filepath);
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    self.engine = function(req, res){
        var filepath = global.APP_DIR + "/resources/Code/Boot/crafty.js";
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/javascript');
                self.cacheThis(req, res, filepath);
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    self.file = function(req, res){
        var name = req.params.name;
        var filepath = global.APP_DIR + "/resources/Code/Include/" + name;
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/javascript');
                self.cacheThis(req, res, filepath);
            }else{
                res.send(404, "Not Found");
            }
        });
    }
    
    self.date = function(req, res){
        var name = req.params.name;
        var filepath = global.APP_DIR + "/resources/Code/Include/"+name;
        fs.exists(filepath, function(exists){
            if(exists){
               fs.stat(filepath, function(err, stats){
                    if (err) {
                      console.log(err.stack)
                      res.send(500, 'Internal Server Error')
                    }
                    res.set("Content-Type", "application/json");
                    res.json(stats.mtime);
              });
            }else{
                res.send(404, "Not Found");
            }
        });
    }
    
    self.worker = function(req, res){
        var name = req.params.name;
        var filepath = global.APP_DIR + "/resources/Code/Workers/"+ name;
        fs.exists(filepath, function(exists){
            if(exists){
                res.set('Content-Type', 'text/javascript');
                self.cacheThis(req, res, filepath);
            }else{
                res.send(404, "Not Found");
            }
        });
    }
}

var controller = new CodeController();

exports.verbs = {
    'get':  {

        '/resource/code/includes' : controller.includes,
        '/resource/code/bootstrap' : controller.bootstrap,
        '/resource/code/loader' : controller.loader,
        '/resource/code/engine' : controller.engine,
        '/resource/code/file/:name' : controller.file,
        '/resource/code/date/:name' : controller.date,
        '/resource/code/worker/:name' : controller.worker,
    },
    'post': {

    }

};

