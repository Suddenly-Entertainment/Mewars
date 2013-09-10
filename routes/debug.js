CONFIG = require(global.APP_DIR + '/config');


function DebugController(){
    var self = this; //Setting up scope
    
    self.database_reset = function (req, res) {
    
      if (CONFIG.debug_enabled) {
        
      } else {
        req.send(404, "Not Found")
        
      }
      
    }
    self.getUserList = function(req,res){
       if (CONFIG.debug_enabled) {          
         global.db.User.findAll().success(function(Users){
           res.json(Users);
         }).error(function(err){res.json(err);});
      } else {
        req.send(404, "Not Found")
      }
    }
    self.clearUserList = function(req,res){
      if (CONFIG.debug_enabled) {   
        var successArr = [];
        global.db.User.findAll().success(function(Users){
          for(var i = 0; i < Users.length; i++){
           Users[i].destroy().success(function(){
              successArr.push(true);
           }).error(function(err){successArr.push(true);});
         }
         res.json(successArr);
        });
      } else {
        req.send(404, "Not Found");
      }
    }
    self.forceSyncDatabase = function(req, res){
      if (CONFIG.debug_enabled) {
        var migrate = function(sequelize) {
          var migrationsPath = global.APP_DIR + '/migrations';
          var migratorOptions = { path: migrationsPath },
              migrator        = sequelize.getMigrator(migratorOptions);

          sequelize.migrate();
        };
       global.db.sequelize.sync({force:true}).success(function() {
       console.log("Database Forced Synced Sucessfuly");
                migrate(global.db.sequelize);
                res.send(200);
        }).error(function(error) {
            console.log("[AUTOSYNC] Could Not Sync Database", error.stack);
            res.json(500, error);
        });
      } else {
        req.send(404, "Not Found");
      }
    }
}

var controller = new DebugController()

//Sets up the urls to call to call these functions.
exports.verbs = {
    'get':  {
 //For get requests.

        '/debug/database_reset' : controller.database_reset,
        '/debug/forceSync' : controller.forceSyncDatabase,
        '/debug/getUserList': controller.getUserList,
        '/debug/clearUserList': controller.clearUserList,

    },
    'post': {

    }

};
