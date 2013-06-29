Crafty.c("NetworkChat", {
	init: function () {
		this.requires("Network");
	},
	
	SendChatMessage: function (chat_id, message) {
		this.Send("ChatMessagesAdd", "ChatMessages", "add", 
			{
	        	'pass' : [chat_id], 
	            'post' : {body: message}, 
			}
		);
	},
	
	GetChatMessages: function (chat_id, last_id) {
		this.Send("ChatsGet", "Chats", "get", 
			{
				'pass' : [chat_id], 
				'post' : {lastid: last_id}, 
            }
		);
	}
	
});




$MEW.Chat = {
    id: 1,
    lastid: 0,
    melemid: null,
    
    onChatMessagesAdd: function (result) { 
        console.log(result);
        $MEW.Chat.get();
    },
    
    onChatsGet: function (result) { 
        var data = result.data;
        var serveroffset = result.GMTOffSet;
        var d = new Date();
        var localoffset = d.getTimezoneOffset();
        
        var keys = [];
        for (var k in data) {
            keys.unshift(k);
        }
        for (var c = keys.length, n = 0; n < c; n++) {
            $MEW.Chat.addMessage(data[keys[n]], localoffset, serveroffset);
        }
    },
    
    bind: function () {
    	$MEW.Network.bind("ChatMessagesAdd", $MEW.Chat.onChatMessagesAdd);
    	$MEW.Network.bind("ChatsGet", $MEW.Chat.onChatsGet);
    },
    
    send: function (form) {
        $MEW.Network.SendChatMessage(this.id, form.chatText.value);
        form.chatText.value = '';
        return false;
    },
    
    get: function () {
        $MEW.Network.GetChatMessages(this.id, this.lastid);
    },
    
    addMessage: function(data, local, server) {
        if (parseInt(data.ChatMessage.message_id) > $MEW.Chat.lastid) {
            $MEW.Chat.lastid = parseInt(data.ChatMessage.message_id);
        }
        var d = new Date();
        d.setTime(parseInt(data.ChatMessage.created) + (server * 60 * 60 * 1000) + (local * 60 * 60 * 1000));
        var date = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var id = "MEWChatMessage_" + data.ChatMessage.message_id;
        var html = $MEW.Chat.buildElem(id, date, data.User.user_name, data.ChatMessage.body);
        
        //finaly adding the message to the DOM
        var messages = $('#' + $MEW.Chat.melemid)
        messages.append(html);
        var message = $('#' + id)
        message.show();
        messages[0].scrollTop += message[0].scrollHeight + 10;
        
    },
    
    buildElem: function(id, date, user, message) {
        function makeSafe(text) {
          return text.replace(/\W/g, function (chr) {
            return '&#' + chr.charCodeAt(0) + ';';
          });
        }
        var html = '<p id="' + id + '"';
        html += 'style="display:none;">'; 
        html += date + ' ';
        html += '<b>' + user + ':</b> ' + makeSafe(message);
        html += '<p/>';
        return html;
    },
    
    GetTime : function ()
    {
        var pg = require('pg'); 
        //or native libpq bindings
        //var pg = require('pg').native
        
        var conString = "tcp://postgres:1234@localhost/postgres";
        
        //note: error handling omitted
        var client = new pg.Client(conString);
        client.connect(function(err) {
          client.query('SELECT NOW() AS "theTime"', function(err, result) {
              console.log(result.rows[0].theTime);
              //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
          })
        });
        
    }

};


Crafty.scene("Chat", 
function() {
    console.log("Loaded Chat Scene");
    
    // Make the network interface for this scene
    $MEW.Network = Crafty.e("NetworkChat");
     
    // set up the Chat interface
	$MEW.Chat.id = 1;
	$MEW.Chat.lastid = 0;
	$MEW.Chat.melemid = null;
	
	// bind the interface to the network
	$MEW.Chat.bind();
	
	// reset the viewport
    Crafty.viewport.x = 0;    
    Crafty.viewport.y = 0;

    // build the chat box
    var chat_html = '' /
    + '<form id="submitForm" style="float:left;width:100%;" onsubmit="return $MEW.Chat.send(this)">' /
    +    '<input id="chatText" style="float:left;width:90%;" name="chatText" maxlength="255" />' /
    +    '<input type="submit" name="sendButton" value="Send" onClick=""/>' /
    + '</form>';
    
    var chatMessages = Crafty.e("HTML, Delay")
        .attr({x:100, y:446, w:600, h:120})
        .css({
            'overflow': 'scroll',
            'align': 'left',
            'font-family': '"Times New Roman",Georgia,Serif',
            'font-size': '12px',
            'text-align': 'left',
        });
        
    $MEW.Chat.melemid = chatMessages.getDomId();
    
    var chatBar = Crafty.e("HTML")
        .attr({x:100, y:566, w:600, h:34})
        .replace(chat_html)
        .css({
            'clear': 'both',
            'align': 'left',
            'float': 'left',
        });
    
    var refreshChat = function () {
        $MEW.Chat.get();
        chatMessages.delay(refreshChat, 2000);
    };
    
    // get chat messages
    $MEW.Chat.get();
    
    // refresh the chat box every 2 seconds
    chatMessages.delay(refreshChat, 2000);
    
    // turn scrolling of the view port off
    $MEW.toggleScrolling(0);
});
