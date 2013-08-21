//Put requires here

//Controller start
function UserController(){
    var self = this; //Scope and makes more sense
    
    self.login = function (req, res){
       // res.set('Content-Type', "application/json");
       /* global.db.User.find({where: {username: req.body.username, password: req.body.password}}).success(function(project){
            if(project){
                res.json(200, "true, found user!");
            }else{
                res.json(500, 'false, did not find user!')
            }
        }).error(function(project){
            res.json(500, project);
        });
        */
        
        global.passport.authenticate('local', { successFlash: true,
                                   failureFlash: true })
    };

    self.register = function(req, res){
        //res.set('Content-Type', "application/json");
        var UserModel = global.db.User.build({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email || "contact@equestrianwars.com",
            confirmation_token: "1",
            reset_password_token: "1",
        }).save().success(function(){
            res.send(200, "Successfully registered");
        }).error(function(){
            res.send(500, "failed to register");
        })
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
    
    },
    'post': {
        '/api/users/login' : controller.login,
        '/api/users/register' : controller.register
    }
};