//Put requires here
var auth = require(global.APP_DIR + '/auth');

//Controller start

function UserController(){
    var self = this; //Scope and makes more sense
    

    self.login = function (req, res){
        var returnObj = {};
        if(req.user){
           global.db.User.find({where: {username: req.user.username}}).success(function(User){
              if(!User){
                                returnObj.success = false;
                returnObj.err = "No user found";
                res.json(returnObj);

              }
              User.updateAttributes({
                logged_in: true,
                last_activity: new Date(),
              }).success(function() {}).error(function(err){
                returnObj.success = false;
                returnObj.err = err;
                res.json(returnObj);
            });

          }).error(function(err){
            returnObj.success = false;
            returnObj.err = err;
            res.json(returnObj);
          });
           returnObj.success = true;
           returnObj.user = {username: req.user.username, id: req.user.id,};
        }else{
           returnObj.success = false; 
        }
        res.json(returnObj);
    }
;
    

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
            
            var confirmToken = auth.generateConfirmToken(32);

                
                while(auth.checkConfirmToken(confirmToken)){
                    confirmToken = auth.generateConfirmToken(32);
                }
            var resetPasswordToken = auth.generateConfirmToken(32);

            while(auth.checkResetToken(resetPasswordToken)){
              resetPasswordToken = auth.generateConfirmToken(32);
            }
            returnObj.sequilizeNOW = global.db.Sequelize.NOW;
            returnObj.confirmTokenSuccess = true;
            returnObj.username = req.body.username;
            returnObj.email = req.body.email;
                var UserModel = global.db.User.build({
                  username: req.body.username,
                  password: hash,
                  email: req.body.email,           
                  confirmation_token: confirmToken,
                  
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
                
            
        });

    }
    
    self.confirmAccount = function(req, res){
        var confirmToken = req.params.confirmtoken;
        var returnRes = auth.confirmAccount(confirmToken);
        if(returnRes == true){
            res.json(confirmToken);
        }else{
            res.json(returnRes);
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

    self.logOut = function(req, res){
      var returnObj = {success: true};
      if(req.user){
          global.db.User.find({where: {username: req.user.username}}).success(function(User){
          
              User.updateAttributes({
                logged_in: false,
                last_activity: new Date(),
              }).success(function() {}).error(function(err){
                returnObj.success = false;
                returnObj.err = err;
                res.json(returnObj);
            });

          }).error(function(err){
            returnObj.success = false;
            returnObj.err = err;
            res.json(returnObj);
          });
          req.logout();
          res.json(returnObj);
      }else{
          res.json(returnObj);
      }
    }

}

var controller = new UserController();

exports.verbs = {
    'get':  {
    
        '/api/users/confirmAccount/:confirmtoken' : controller.confirmAccount,
        '/api/users/resendCofirm/:username' : controller.resendConfirm,
        '/api/users/loginCheck': controller.login,
        '/api/users/logout': controller.logOut,
        '/api/users/forceSync': controller.forceSyncDatabase,
    },
    'post': {
        '/api/users/login' : auth.passport.authenticate('local', { successRedirect:'/api/users/loginCheck', failureRedirect: '/api/users/loginCheck'
}),
        '/api/users/register' : controller.register,
        '/api/users/checkLogin': controller.checkLogin
    }
};