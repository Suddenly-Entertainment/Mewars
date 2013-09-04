CONFIG = require(global.APP_DIR + '/config');


function DebugController(){
    var self = this; //Setting up scope
    
    self.database_reset = function (req, res) {
    
      if (CONFIG.debug_enabeled) {
        
      } else {
        req.send(404, "Not Found")
        
      }
      
    }
}

var controller = new DebugController()

//Sets up the urls to call to call these functions.
exports.verbs = {
    'get':  {
 //For get requests.

        '/debug/database_reset' : controller.database_reset

    },
    'post': {

    }

};
