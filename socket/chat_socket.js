var auth_users = { };
var unauth_users = { };
var all_users = { };

function ClearChatMessages(){
  var timestamp = new Date();
  var cleartime = new Date(timestamp.getTime() - 1000);
  
  global.db.ChatMessage.findAll({where:{createdAt:{lte: cleartime.toISOString()}}}).success(function(ChatMessages){
   for(var i = 0; i < ChatMessages.length; i++){
     
     ChatMessages[i].destroy().success(function(){
     }).error(function(err){throw err;});
     
   }
  }).error(function(err){throw err;});
  
  
}

var intervalID = setInterval(ClearChatMessages, 1000);

exports.GetAllSocketsInChannelAndBroadcast = function(channel, data)
{
  for(var GUID in auth_users)
  {
    var client = auth_users[GUID];
    if(typeof client.channels[channel] !== 'undefined')
    {
      client.socket.emit(data.event, data.msg);
    }
  }
  
};

exports.InitSocket = function(obj)
{
  
  var socket = obj.socket;
  
  // when recieving a message from the client
  socket.on('chatGet', function (data)
  {
    var to_channel = data.to_channel;
    var socket_channels = obj.channels;
    
    if(socket_channels[to_channel] === undefined)
      return console.log('socket cannot broadcast to channel ' + to_channel);
    
    this.GetAllSocketsInChannelAndBroadcast(to_channel, {
      event : 'chatsend',
      msg : data
    });
    
    
  });
  
}

global.io.sockets.on('connection', function(socket)
{
  var GUID = '';
  
  
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while(GUID.length < 32)
  {
        GUID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  var obj = {
    socket : socket,
    channels : { },
    id : GUID,
    authenticated: false,
    user: null,
  };
  all_users[GUID] = obj;
  
  
  exports.AuthenticateUser(socket, GUID, function(){
    exports.InitSocket(obj);
    socket.on("ChatMessage", function(msgObj){
      global.db.ChatMessage.create({
        username: msgObj.username,
        msg:      msgObj.msg,
      }).success(function(msg){
          console.log(msg);
          obj.socket.emit("ChatMessage", msg);
      }).error(function(err){
          throw err;
      });
      
      var user;
      for(user in auth_users){
        auth_users[user].socket.emit("ChatMessage", msgObj);
      }
      console.log(msgObj);
    });
  });
  // somehow return the GUID for later use?


});

exports.AuthenticateUser = function (socket, GUID, cb)
{
    socket.on("Auth", function(loginToken, fn){
     global.db.User.find({where: {login_token: loginToken}}).success(function(User){
       if(User){
          all_users[GUID].authenticated = true;
          all_users[GUID].user = User;
          auth_users[GUID] = all_users[GUID];
          fn(true);
          cb();
       }else{
         all_users[GUID] = null;
         fn(false);
         socket.disconnect('unauthorized');
       }    
         
     }).error(function(err){
       throw err;
     });

  });
}

