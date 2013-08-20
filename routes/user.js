//Put requires here

//Controller start
function UserController(){
    var self = this; //Scope and makes more sense
    
    self.login = function (req, res){
        res.set('Content-Type', "application/json");
        console.log(req.body);
        res.json(req.body.username + " " + req.body.password);
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
    
    },
    'post': {
        '/api/user/login' : controller.login
    }
};