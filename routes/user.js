//Put requires here
var auth = require(global.APP_DIR + '/auth');

//Controller start

function UserController(){
    var self = this; //Scope and makes more sense
    

    self.login = function (req, res){
        res.send(200);
    };
    

    self.register = function(req, res){
    var returnObj = {};
    returnObj.success = true;
        //res.set('Content-Type', "application/json");
        auth.generateSaltAndHash(10, req.body.password, function(err, hash){
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
           
            var passwordToken = auth.generateConfirmToken();
            
            while(auth.checkResetToken(passwordToken)){
                passwordToken = auth.generateConfirmToken();
            }
            returnObj.confirmTokenSuccess = true;
            returnObj.username = req.body.username;
            returnObj.email = req.body.email;
            try{
                var UserModel = global.db.User.build({
                  username: req.body.username,
                  password: hash,
                  email: req.body.email,
                  confirmation_token: confirmToken,
                  reset_password_token: passwordToken,
                }).save().success(function(){
                returnObj.userCreateSuccess = true;
                returnObj.userModel = UserModel;
            auth.sendConfirm(req, res, confirmToken, returnObj);
}).error(function(err){
                    returnObj.err = err;
                    returnObj.userCreateSuccess = false;
                    returnObj.success = false;
                    res.json(returnObj);
                });
            }catch(err){
              returnObj.err = err;
              returnObj.userCreateSuccess = false;
              returnObj.success = false;
              res.json(returnObj);
            }
                
            
        });

    }
    
    self.confirmAccount = function(req, res){
        var confirmToken = req.params.confirmtoken;
        if(auth.confirmAccount(confirmToken)){
            res.json(true);
        }else{
            res.json(false);
        }
    }

    self.checkLogin = function(req, res){
        res.json(req.user);
    }
    self.resendConfirm = function(req, res){
        var returnObj = {};
        var username = req.params.username;
        returnObj.username = username;
        returnObj.err = null;
        global.db.User.find({where: {username: username}}).success(function(user){
            var confirmToken = user.confirmation_token;
            auth.sendConfirm(req, res, confirmToken, returnObj);
            
        }).error(function(err){
             returnObj.err = err;
             returnObj.success = false;
             returnObj.findUserSuccess = false;
             res.json(returnObj);
        });
    }
    self.getUserList = function(req,res){
      global.db.User.findAll().success(function(Users){
          res.json(Users);
      }).error(function(err){res.json(err);});
    }
    self.clearUserList = function(req,res){
      global.db.User.findAll().success(function(Users){
         Users.destroy().success(function(){
            res.send(200);
         }).error(function(err){res.send(500, err);});
      });
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
        '/api/users/confirmAccount/:confirmtoken' : controller.confirmAccount,
        '/api/users/resendCofirm/:username' : controller.resendConfirm,
        '/api/users/getUserList' : controller.getUserList,
        '/api/users/clearUserList': controller.clearUserList,
    },
    'post': {
        '/api/users/login' : [auth.passport.authenticate('local', { successRedirect:"/",
                                   faiureRedirect:"/" }),controller.login],
        '/api/users/register' : controller.register,
        '/api/users/checkLogin': controller.checkLogin
    }
};