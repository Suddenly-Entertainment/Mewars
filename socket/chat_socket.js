
var GetChats = function (socket)
{
  
  
};

var auth_users = { };
var unauth_users = { };
global.io.sockets.on('connection', function(socket)
{
  var GUID = '';
  
  
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while(GUID.length() < 32)
  {
        GUID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  unauth_users[GUID] = socket;
  
  // somehow return the GUID for later use?
  
  
});

exports.AuthenticateUser = function (user)
{
  
}

