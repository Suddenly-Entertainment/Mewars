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
        done(null, user.username);
      });

      passport.deserializeUser(function(id, done) {
        global.db.User.find({where: {username: id}}).success(function(user){
          done(null, user);
        });
      });
      
       


var auth = {
    passport: passport,
    smptTransport: nodemailer.createTransport("SMTP",{
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
            
            res.json(returnObj);
          }else{
            returnObj.sendSuccess = true;
            returnObj.success = true;
            res.json(returnObj);
          }
      });
    },
    
    generateConfirmToken : function(){
        var now = new Date();
        return Math.floor(Math.random() * 10) + parseInt(now.getTime()).toString(36).toUpperCase();
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
};

module.exports = auth;
