var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var CONFIG = require("./config");

 passport.use(new LocalStrategy(
      function(username, password, done) {
      global.db.User.find({where: {username: username, confirmed: true}}).success(function(user){
        
        if (!user) {
            return done(null, false, { message: 'Username not found.' });
        }
        
        bcrypt.compare(password, user.password, function(err, result) {
            if(err) return done(err, false);
            if(result){
                return done(null, user);
            }else{
                return done(null, false, { message: 'Password is incorrect.' });
            }
        });
    }).error(function(error){
      return done(error, false);
    });
    }));
      
      passport.serializeUser(function(user, done) {
        var checkLoginToken = function(loginToken){
          global.db.User.find({where: {login_token: loginToken}}).success(function(loginsToken){
            if(loginsToken){
              return true;
            }else{
             user.updateAttributes({
                logged_in: true,
                login_token: loginToken,
                last_activity: new Date(),
              }).success(function() {
                 return false;
              }).error(function(err){
                throw err;
                return false;
              });
            }
          }).error(function(err){
            throw err;
          });
        };
      
        var generateLoginToken = function(length, user){
          var timestamp = new Date();
          var loginToken = user.id + " - " + user.username + " - " + timestamp.getTime();
          return bcrypt.hashSync(loginToken, bcrypt.genSaltSync(length));
        };
      
        var loginToken = generateLoginToken(5, user);
        while(checkLoginToken(loginToken)){
          loginToken = auth.generateLoginToken(5, user);
        }
       
        done(null, loginToken);
      });

      passport.deserializeUser(function(id, done) {
        global.db.User.find({where: {login_token: id}}).success(function(user){
          done(null, user);
        });
      });
      
       


var auth = {
    passport: passport,
    smtpTransport: nodemailer.createTransport("SMTP",{
         service: "Gmail",
         auth: {
           user: "contact@equestrianwars.com",
           pass: "ponyCOntact796"
         }
      }),
    checkConfirmToken : function(confirmToken){
        global.db.User.find({where: {confirmation_token: confirmToken}}).success(function(confirmsToken){
          if(confirmsToken){
            return true;
          }else{
            return false;
          }
        });
    },
    checkLoginToken: function(loginToken){
      global.db.User.find({where: {login_token: loginToken}}).success(function(loginsToken){
        if(loginsToken){
          return true;
        }else{
          return false;
        }
      }).error(function(err){
        throw err;
      });
    },
    
    sendConfirm : function(req, res, confirmToken, returnObj){
      var link = CONFIG.hostname + "api/users/confirmAccount/"+confirmToken;
      
      

      
      var mailOptions = {
        from: "No Reply <noreply@equestrianwars.com>", // sender address
        to: req.body.email, // list of receivers
        subject: "Confirm Mock Equestrian Wars Account", // Subject line
        text: "Hello, To complete your registration click this link "+link+" Your username is: "+ req.body.username + " Your password is: "+req.body.password, // plaintext body
        html: "<b>Hello,</b> <br/> To complete your registration click this link <a href'"+link+"'>"+link+"</a> <br/> Your username is: "+req.body.username+" <br/> Your password is: "+req.body.password+" <br/> " // html body
      }
      returnObj.mailOptions = mailOptions;
      
      this.smtpTransport.sendMail(mailOptions, function(error, response){
         
         returnObj.sendMailResponse = response;
         if(error){
            returnObj.sendSuccess = false;
            returnObj.success = false;
            returnObj.err = error;
            returnObj.userModel.destroy().success(function(thing){
              returnObj.userModel = null;
              returnObj.destroySuccess = true;
              res.json(returnObj);
            }).error(function(thing){
              returnObj.userModel = null;
              returnObj.destroyErr = thing;
              returnObj.destroySuccess = false;
              res.json(returnObj);
            });
            
          }else{
            returnObj.userModel = null;
            returnObj.sendSuccess = true;
            returnObj.success = true;
                        var returnObj2 = {success: true};
            res.json(returnObj2);
          }
      });
    },
    
    generateConfirmToken : function(length){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < length; i++ )
       {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
      
    },
    
    generateLoginToken : function(length, user){
        var timestamp = new Date();
        var loginToken = user.id + "-" + user.username + "-" + timestamp.getTime();
        var salt =  bcrypt.genSaltSync(length);
        var hash = bcrypt.hashSync(loginToken, salt);
        return hash;
    },
    
    generateSaltAndHash: function(length, password, cb){
       bcrypt.genSalt(length, function(err2, salt){
            if(err2)cb(err2, null);
            bcrypt.hash(password, salt, null, cb);
       });
    },
    
    confirmAccount: function(confirmToken){
       global.db.User.find({where: {confirmation_token: confirmToken}}).success(function(user){
          if(user){
              user.updateAttributes({
                confirmed : true
              }).success(function() {return true;}).error(function(){return false;});
          }else{
            return false;
          }
        }).error(function(err){
          return false;
        });
    },
    
    checkResetToken : function(passwordToken){
        global.db.User.find({where: {reset_password_token: passwordToken}}).success(function(confirmsToken){
          if(confirmsToken){
            return true;
          }else{
            return false;
          }
        });
    },
    ensureAuthenticated : function(req, res, next){
      if(req.user){
        return next();
      }else{
        res.send(403, "not authenticated");
      }
    },
};

module.exports = auth;
