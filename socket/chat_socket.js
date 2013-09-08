
var auth_users = { };
var unauth_users = { };

exports.GetAllSocketsInChannelAndBroadcast = function(channel, data)
{
  for(var i in auth_users)
  {
    var obj = auth_users[i];
    if(obj.channels[channel] != undefined)
    {
      obj.socket.emit(data.event, data.msg);
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

  while(GUID.length() < 32)
  {
        GUID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  var obj = {
    socket : socket,
    channels : { },
    id : GUID
  };
  unauth_users[GUID] = obj;
  
  exports.InitSocket(obj);
  // somehow return the GUID for later use?
  
  
});

exports.AuthenticateUser = function (user)
{
  
}

