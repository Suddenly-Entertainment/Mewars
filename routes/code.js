var fs = require('fs'); //This is the file system, it does everything for the filesytem, accessing files, directories, reading files, ect.
var mime = require('mime');//This gets the mime type for files, as node.js doesn't normally have this functionality.


//This code controller contains functions for getting the code files, the client side javascript files.
function CodeController(){
    var self = this; //Setting up scope
    
    //This function actually opens, and reads  the file, and caches it too.
    self.cacheThis = function(req, res, filepath){
      fs.stat(filepath, function (err, stat) {  //We use stat to get the last modified time
        if (err) {
          console.log(err.stack);
          res.send(500, 'Internal Server Error');
        }
        else {
          etag = stat.size + '-' + Date.parse(stat.mtime);
          res.set('Last-Modified', stat.mtime);

          if (req.get('if-none-match') === etag) {
            res.send(304, 'Not Modified');
          }
          else {
            fs.readFile(filepath, function(err,data){ //This will read a file asychronously
              if (err) {
                console.log(err.stack);
                res.send(500, 'Internal Server Error');
              };
              res.set('ETag', etag);
              res.send(data);//Sends the file to the client.
            });
          }
        }
      })
    }
    
    //Returns to the user a json formatted array of file names in the includes folder
    self.includes = function(req, res){
        var filepath = global.APP_DIR + "/resources/Code/Include/";
        fs.readdir(filepath, function(err, files){//This will get all the file names in the directory, and subdirectories as an array
            if (err) {
              console.log(err.stack)
              res.send(500, 'Internal Server Error')
            }
            res.set('Content-Type', "application/json");  //Sets the MIME type
            res.json(files); //Json formats the array and sends it to the caller.
        });
    }
    
    //Returns the bootstrap.js file
    self.bootstrap = function(req, res){
        var filepath = global.APP_DIR + '/resources/Code/Boot/bootstrap.js';
        fs.exists(filepath, function(exists){//This function checks if a file exists asychronously.
            if(exists){
                res.set('Content-Type', 'text/javascript');//Sets the MIME type
                self.cacheThis(req, res, filepath); //Sends the file to the caller.
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    //Returns the loader.js file.
    self.loader = function(req, res){
        var filepath = global.APP_DIR + '/resources/Code/Boot/GameLoader.js';
        fs.exists(filepath, function(exists){ //This function checks if a file exists, asychronously.
            if(exists){
                res.set('Content-Type', 'text/javascript'); //Sets the MIME type
                self.cacheThis(req, res, filepath); //Sends the file to the caller.
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    //Returns the crafty.js file.
    self.engine = function(req, res){
        var filepath = global.APP_DIR + "/resources/Code/Boot/crafty.js";
        fs.exists(filepath, function(exists){//Checks if a file exists, asychronously
            if(exists){
                res.set('Content-Type', 'text/javascript'); //Sets the MIME type.
                self.cacheThis(req, res, filepath); //Sends the file to the caller.
            }else{
              res.send(404, "Not Found");
            }
        });  
    }
    
    //Returns a requested file from the code/includes folder
    self.file = function(req, res){
        var name = req.params.name; //Gets the name from the request object, as set in the url they called.
        var filepath = global.APP_DIR + "/resources/Code/Include/" + name;
        fs.exists(filepath, function(exists){  //Checks if the file exists, asychronously.
            if(exists){
                res.set('Content-Type', 'text/javascript'); //Sets the MIME type.
                self.cacheThis(req, res, filepath); //Sends the file to the caller.
            }else{
                res.send(404, "Not Found");
            }
        });
    }
    
   //Returns the last modified date of a file to the user, formatted as json.
    self.date = function(req, res){
        var name = req.params.name; //Gets the name of the file as sent in the url.
        var filepath = global.APP_DIR + "/resources/Code/Include/"+name;
        fs.exists(filepath, function(exists){ //Checks if a file exists, asychronously
            if(exists){
               fs.stat(filepath, function(err, stats){//Gets statistics about a file, more importantly, gets the last modified date of a file.
                    if (err) {
                      console.log(err.stack)
                      res.send(500, 'Internal Server Error')
                    }
                    res.set("Content-Type", "application/json");//Sets the MIME type.
                    res.json(stats.mtime); //Returns json formatted mtime to the caller.
              });
            }else{
                res.send(404, "Not Found");
            }
        });
    }
    
    //Returns javascript files from the code/workers folder
    self.worker = function(req, res){
        var name = req.params.name; //Gets the name of the file as sent in the url.
        var filepath = global.APP_DIR + "/resources/Code/Workers/"+ name;
        fs.exists(filepath, function(exists){ //Checks if the file exists, asychronously.
            if(exists){
                res.set('Content-Type', 'text/javascript'); //Sets the MIME type.
                self.cacheThis(req, res, filepath);//Sends the file to the caller.
            }else{
                res.send(404, "Not Found");
            }
        });
    }
}

var controller = new CodeController();//Creates a new code controller.

//Sets up the urls to call to call these functions.
exports.verbs = {
    'get':  { //For get requests.

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

