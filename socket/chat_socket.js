var userList = []; //This is just to send to users when the connect so they can have a user list.  Only contains info we want everyone who can connect to chat have.
var auth_users = { };
var unauth_users = { };
var all_users = { };


/*global.db.watcher.add_watcher("ChatMessage", "chatmessages", "AFTER INSERT", function(msg){
    console.log("It was notified!  This is not implemented yet!  the message is ", msg);
});*/


function ClearChatMessages(){
  var timestamp = new Date();
  var cleartime = new Date(timestamp.getTime() - 1000);
  
  global.db.ChatMessage.findAll().success(function(ChatMessages){
   for(var i = 0; i < ChatMessages.length; i++){
     
     if(ChatMessages[i].createdAt <= cleartime){
       ChatMessages[i].destroy().success(function(){
       }).error(function(err){throw err;});
     }
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

var chat = global.io.sockets.on('connection', function(socket)
{
  var GUID = exports.generateGUID(32);
  
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
    exports.newUser(GUID);
    socket.on("ChatMessage", exports.onRecieveChatMessage);
  });
  // somehow return the GUID for later use?


});

exports.AuthenticateUser = function (socket, GUID, cb)
{
    socket.on("Auth", function(loginToken, fn){
     global.db.User.find({where: {login_token: loginToken}}).success(function(User){
       if(User){
       
          socket.emit("UserList", userList);
          all_users[GUID].authenticated = true;
          all_users[GUID].user = User;
          auth_users[GUID] = all_users[GUID];
          userList[GUID] = {username: User.username};
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

exports.onRecieveChatMessage = function(msgObj){
  global.db.ChatMessage.create({
    username: msgObj.username,
    msg:      msgObj.msg,
  }).success(function(msg){
      console.log(msg);
      obj.socket.emit("ChatMessage", msg);
  }).error(function(err){
      throw err;
  });
  
  for(user in auth_users){
    auth_users[user].socket.emit("ChatMessage", msgObj);
  }
  console.log(msgObj);
}


exports.generateGUID = function(length){
  length = Math.round(length);
  if(length < 1)length = 32;
  
  var GUID = '';
  
  
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  while(GUID.length < length)
  {
        GUID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return GUID;
}

exports.newUser = function(GUID){
    var user;
    for(user in auth_users){
      if(user == GUID)continue;
      auth_users[user].socket.emit("UserConnect", userList[GUID]);
    }
}

