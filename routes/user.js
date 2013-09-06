//Put requires here
var auth = require(global.APP_DIR + '/auth');

//Controller start

function UserController(){
    var self = this; //Scope and makes more sense
    

    self.login = function (req, res){
        var returnObj = {};
        if(req.user){
           global.db.User.find({where: {username: req.user.username}}).success(function(User){
              User.updateAttributes({
                logged_in: true,
                last_activity: global.db.sequelize.NOW,
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
           returnObj.user = {username: req.user.username, userID: req.user.userID,};
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
            returnObj.sequilizeNOW = global.db.sequelize.NOW;
            returnObj.confirmTokenSuccess = true;
            returnObj.username = req.body.username;
            returnObj.email = req.body.email;
                var UserModel = global.db.User.build({
                  username: req.body.username,
                  password: hash,
                  email: req.body.email,           
                  confirmation_token: confirmToken,
                  logged_in: false,
                  last_activity: global.db.sequelize.NOW,
                  
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
    self.getUserList = function(req,res){

       global.db.User.find({where: {logged_in: true}}).success(function(Users){
          
          res.json(Users);
      }).error(function(err){res.json(err);});
    }
    self.clearUserList = function(req,res){
      var successArr = [];
      global.db.User.findAll().success(function(Users){
        for(var i = 0; i < Users.length; i++){
         Users[i].destroy().success(function(){
            successArr.push(true);
         }).error(function(err){successArr.push(true);});
       }
       res.json(successArr);
      });
  }
    self.logOut = function(req, res){
      var returnObj = {success: true};
      if(req.user){
          global.db.User.find({where: {username: req.user.username}}).success(function(User){
              User.updateAttributes({
                logged_in: false,
                last_activity: global.db.sequelize.NOW,
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
    self.forceSyncDatabase = function(req, res){
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
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
    
        '/api/users/confirmAccount/:confirmtoken' : controller.confirmAccount,
        '/api/users/resendCofirm/:username' : controller.resendConfirm,
        '/api/users/getUserList' : controller.getUserList,
        '/api/users/clearUserList': controller.clearUserList,
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