//Put requires here
var auth = require(global.APP_DIR + '/auth');

//Controller start

function UserController(){
    var self = this; //Scope and makes more sense
    

    self.login = function (req, res){
        
    };
    

    self.register = function(req, res){
        //res.set('Content-Type', "application/json");
        auth.generateSaltAndHash(20, req.body.password, function(err, hash){
            if(err) res.send(500, "Error hashing password.");
            
            var confirmToken = auth.generateConfirmToken();

                
                while(auth.checkConfirmToken(confirmToken)){
                    confirmToken = auth.generateConfirmToken();
                }
                
                var UserModel = global.db.User.build({
                  username: req.body.username,
                  password: hash,
                  email: req.body.email,
                  confirmation_token: confirmToken,
                  reset_password_token: "0",
                }).save().success(function(){
            auth.sendConfirm(req, res, confirmToken);
}).error(function(){
                    res.send(500, "Failed to register");
                });
                
                
            
        });

    }
    
    self.confirmAccount = function(req, res){
        var confirmToken = req.params.confirmToken;
        if(auth.confirmAccount(confirmToken)){
            res.json(true);
        }else{
            res.json(false);
        }
    }

    self.checkLogin = function(req, res){
        res.json(req.user);
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
        '/api/users/confirmAccount/:confirmToken' : controller.confirmAccount,
    },
    'post': {
        '/api/users/login' : [auth.passport.authenticate('local', { successRedirect:"/",
                                   faiureRedirect:"/" }),controller.login],
        '/api/users/register' : controller.register,
        '/api/users/checkLogin': controller.checkLogin
    }
};