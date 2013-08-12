var fs = require('fs');
var mime = require('mime');

function ResourceController(){
    var self = this;
    
    self.index = function(req, res){
            res.send(404, "Not found");
    }
    
    self.image = function(req, res){
       var filepath = "";
       var type = req.params.type;
       var name = req.params.name;
       
       switch(type){
           case 0:
               filepath = global.APP_DIR + "/resources/Images/Tiles/" + name;
           break;
           case 1:
               filepath = global.APP_DIR + "/resources/Images/Sprites" + name;
           break;
           case 2:
               filepath = global.APP_DIR + "/resources/Images/Interface" + name;   
           break;
       }
       
       fs.exists(filepath, function(exists){
          if(exists){
              var mimeType = mime.lookup(filepath);
              res.set('Content-Type', mimeType);
              self.cacheThis(req, res, filepath);
          }else{
              res.send(404, "Not found");
          }
       });
    }
    
    self.audio = function(req, res){
        var name = req.params.name;
        var filepath = global.APP_DIR + "/resources/Audio/" + name;
        
       fs.exists(filepath, function(exists){
          if(exists){
              var mimeType = mime.lookup(filepath);
              res.set('Content-Type', mimeType);
              self.cacheThis(req, res, filepath);
          }else{
              res.send(404, "Not found");
          }
       });
    }
}

var controller = new ResourceController();

// define routes we handle here
exports.verbs = {
    'get':  {
        '/resource/image/:type/:name' : controller.image,
        '/resource/audio/:name' : controller.audio
    },
    'post': {

    }

};

var co