var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var CONFIG = require("./config");

 passport.use(new LocalStrategy(
      function(username, password, done) {
      global.db.User.find({where: {username: username}}).success(function(user){
        
        if (!user) {
            return done(null, false, { message: 'Username not found.' });
        }
        
        bcrypt.compare(password, user.password, function(err, res) {
            if(err) return done(err, false);
            if(res){
                return done(null, user.username);
            }else{
                return done(null, false, { message: 'Password is incorrect.' });
            }
        });
        


          
    
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
    checkConfirmToken : function(confirmToken){
        global.db.User.find({where: {confirmation_token: confirmToken}}).success(function(confirmToken){
          if(confirmToken){
            return true;
          }else{
            return false;
          }
        });
    },
    
    sendConfirm : function(req, res, confirmToken){
      var link = CONFIG.hostname + "api/users/confirmAccount/"+confirmToken;
      var smtpTransport = nodemailer.createTransport("SMTP",{
         service: "Gmail",
         auth: {
           user: "contact@equestrianwars.com",
           pass: "ponyCOntact796"
         }
      });
      
      var mailOptions = {
        from: "No Reply <noreply@equestrianwars.com>", // sender address
        to: req.body.email, // list of receivers
        subject: "Confirm Mock Equestrian Wars Account", // Subject line
        text: "Hello, To complete your registration click this link "+link+" Your username is: "+ req.body.username + " Your password is: "+req.body.password, // plaintext body
        html: "<b>Hello,</b> <br/> To complete your registration click this link <a href'"+link+"'>"+link+"</a> <br/> Your username is: "+req.body.username+" <br/> Your password is: "+req.body.password+" <br/> " // html body
      }

      
      smtpTransport.sendMail(mailOptions, function(error, response){
         smtpTransport.close()
         if(error){
            res.send(500, error);
          }else{
            res.json(200, true);
          }
      });
    },
    
    generateConfirmToken : function(){
        var now = new Date();
        return Math.floor(Math.random() * 10) + parseInt(now.getTime()).toString(36).toUpperCase();
    },
    
    generateSaltAndHash: function(length, password, cb){
       bcrypt.genSalt(length, function(err, salt){
            bcrypt.hash(password, salt, cb);
       });
    },
    
    confirmAccount: function(confirmToken){
       global.db.User.find({where: {confirmation_token: confirmToken}}).success(function(user){
          if(user){
              user.updateAttributes({
                title: 'a very different title now'
              }).success(function() {});
          }else{
            return false;
          }
        });
    }
};

module.exports = auth;
