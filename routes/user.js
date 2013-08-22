//Put requires here
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

      passport.use(new LocalStrategy(
      function(username, password, done) {
      global.db.User.find({where: {username: username, password: password}}).success(function(user){
        
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        return done(null, user.username);
    });
    }));
      
      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(id, done) {
        global.db.User.find({where: {username: id}}).success(function(user){
          done(null, user);
        });
      });

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
        //res.send(200, thing);
    }
;

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

    self.checkLogin = function(req, res){
        res.json(req.user);
    }
}

var controller = new UserController();

exports.verbs = {
    'get':  {
    
    },
    'post': {
        '/api/users/login' : [passport.authenticate('local', { successRedirect:"/",
                                   faiureRedirect:"/" }),controller.login],
        '/api/users/register' : controller.register,
        '/api/users/checkLogin': controller.checkLogin
    }
};