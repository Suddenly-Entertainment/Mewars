//Put requires here
var auth = require(global.APP_DIR + '/auth');

//Controller start

function UserController(){
    var self = this; //Scope and makes more sense
    

    self.login = function (req, res){
        
    };
    

    self.register = function(req, res){
    var returnObj = {};
        //res.set('Content-Type', "application/json");
        auth.generateSaltAndHash(20, req.body.password, function(err, hash){
            returnObj.err = err;
            returnObj.hash = hash;
            if(err){
              returnObj.saltSuccess = false;
              returnObj.success = false;
              res.json( returnObj);
            } 
            returnObj.saltSuccess = true;
            
            var confirmToken = auth.generateConfirmToken();

                
                while(auth.checkConfirmToken(confirmToken)){
                    confirmToken = auth.generateConfirmToken();
                }
            returnObj.confirmTokenSuccess = true;
            returnObj.username = req.body.username;
            returnObj.email = req.body.email;
            
                var UserModel = global.db.User.build({
                  username: req.body.username,
                  password: hash,
                  email: req.body.email,
                  confirmation_token: confirmToken,
                  reset_password_token: "0",
                }).save().success(function(){
                returnObj.userCreateSuccess = true;
            auth.sendConfirm(req, res, confirmToken, returnObj);
}).error(function(){
                    returnObj.userCreateSuccess = false;
                    res.json(returnObj);
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