// Scene Chess Lobby
// * components and scene for seeing active chess games, chatting with users, creating games, and the likes

/*Crafty.c("ChessGamesList", {
   init: function () {
       this.requires("2D, Mouse");
   },
   GamesList: function (x, y, z, w, h) {
        this.attr({x: x, y: y, z: z, w: w, h: h});
        
        this.List = Crafty.e("2D, HTML")
            .attr({x: x, y: y, z: z, w: w, h: 20})
            .css({background: "#010101"});
        
        var listHTMLText = ' <input id="_MEW_login_password" type="password" class="input_password" value="password"  /> ';
   }
   
});*/
Crafty.c("NetworkChessLobby", {
    init: function() {
        this.requires("Network");
        
        //Add Routes    
        $MEW.AddRoute("GetSceneChessLobbyXML",    ['RESOURCE', 'GET',  '/XML/file/SceneChessLobby.xml', 'XML' ])
        
    },
});
Crafty.c("MEWChessLobbyForm", {
  init: function(){

  },
  MEWChessLobbyForm: function(){
    
  }
});
Crafty.c("UserList", {
    init: function() {
        this.requires("2D, DOM, HTML");
    },
    Users: [],
    UserList: function(){
        //this.attr({x: 0, y: 0, w:100, h:100,});
        /*this.css({
          "border": "solid",
          "border-width": "5px",
        });*/
        //this.append('<a href="mew-mew.rhcloud.com">Test</a>');
        var that = this;
        var cb = function(data){
            _.each(data, function(value, key, list){
                 if(that.Users.indexOf(value) == -1){
                   that.addUser(value);
                 }
                 console.log(list);
            });
        };
        
        return this;
        
    },
    addUser: function(user){
      this.Users[user.userid] = user;
      
      this.append('<div class="uIUL" id="uIUL'+user.userid+'"><span class="uIULUsername">'+user.username+'</span></div>');
      
    },
    removeUser: function(userid){
      this.Users[userid] = null;
      $("#uIUL"+userid).remove();
    },
});
Crafty.c("Chat",{
  init: function(){
    this.requires("2D, DOM, HTML, Keyboard");
  },
  Chat: function(){
  var that = this;
    this.sendMsgBox = Crafty.e("2D, HTML_INPUT")
                .attr({x: 0, y: 48, z: 103, w: 100, h: 20})
                .css({background: "#3d3c3c"});
                
            var sendMsgBoxHTMLText = ' <input id="_MEW_chat_send" type="text" class="input_email" value="email@email.com"  /> ';
            
            this.sendMsgBox.replace(sendMsgBoxHTMLText).css({
                background: 'rgba(0, 0, 0, 0.0)',
                color: 'rgb(196, 183, 135)',
                border: 'none',
                outline: 'none',
                'font-family': 'Arial',
                'font-weight': 'bold',
            });
            
    this.bind('KeyDown', function (e) {
            var active = document.activeElement;
            if ((active.id === "_MEW_chat_send") && this.isDown('ENTER')){
               
                that.sendMsg($("#_MEW_chat_send").val());
            }

    });
          $MEW.socket.on("ChatMessage", function(msg){ 
        console.log(msg);
      });
  },
  sendMsg: function(msg){
    var obj = {
      msg: msg,
      username: $MEW.user.username,
    }
    $MEW.socket.emit("ChatMessage", obj);
  }
});
Crafty.scene("ChessLobby", function() {
    
    $MEW.ResetScene()
    $MEW.ResetNetwork()
    
    $MEW.Network.requires('NetworkChessLobby')
    $MEW.Network.connectSocketIO();
    console.log($MEW.socket);
    var thing = Crafty.e("Chat").Chat();
    function viewTest() {
        console.log("Calling Test Scene");
        Crafty.scene("Map");
    }
            

    

     var XMLInterfaceSetup = function(){
      var onXMLReturn = function(data){
            $MEW.XMLParser = new XMLInterfaceParser(data);
            $MEW.Interface = $MEW.XMLParser.getInterface("ChessLobbyMain");
            $MEW.Interface.layout($MEW.Viewport);
           /* $("#_MEW_login_btn").click(function(e){
                 var Obj = { username: $("_MEW_login_username").val(), password: $("_MEW_login_password").val() };
                 $MEW.Network.pBind('UsersLogin', loginReturn);
                 $MEW.Network.pBind('UsersLoginError', loginReturnError);
                 $MEW.NEtwork.Send('UsersLogin', Obj);
            });*/
        }
        var onXMLReturnError = function(err){
            console.log(err);
        }
        
        var loginReturn = function(data){
            console.log(data);
        }
        
        var loginReturnError = function(err){
            console.log(err);
        }
        $MEW.Network.pBind('GetSceneChessLobbyXML', onXMLReturn);
        $MEW.Network.pBind('GetSceneChessLobbyXMLError', onXMLReturnError);
        $MEW.Network.Send('GetSceneChessLobbyXML');
    }
    //if (confirm('Do you want to try out the XML interface?')) {
        $MEW.isXMLInterface = true;

        $MEW.Scene.testButton = Crafty.e("Window, Mouse, 2D, Color, Canvas")
            .Window(($MEW.WIDTH - 500) / 2, ($MEW.HEIGHT - 250) / 2 + 250 / 4, 100, 100, 40)
            .setName("TestsButton").color("#000000")
            .bind("Click", viewTest);
        
        $MEW.Scene.testButtonText = Crafty.e("2D, Canvas, Text, Mouse")
            .textFont({ family: 'sans-serif', size: '16px' })
            .textColor('#FFFFFF', 1.0)
            .text("View Tests")  
            .attr({z:110, w: 100, h: 20})
            .bind("Click", viewTest);
                
            
        $MEW.Viewport.bindTo($MEW.Scene.testButton, $MEW.WIDTH - 140, $MEW.HEIGHT - 85);
        $MEW.Viewport.bindTo($MEW.Scene.testButtonText, $MEW.WIDTH - 140 + 5, $MEW.HEIGHT - 85 + 5);

        $MEW.Scene.background_old = Crafty.e("2D, Canvas, LoadingBackgroundGraphic, Tween")
            .attr({x:0, y:0, z:10, alpha: 1.0,})
            .tween({alpha: 0.0}, 100);
                
        $MEW.Scene.background = Crafty.e("2D, Canvas, mew_login_screen_sprite, Tween")
            .attr({x:0, y:0, z:10, alpha: 0.0,})
            .tween({alpha: 1.0}, 50)
            .bind("TweenEnd", XMLInterfaceSetup);

        $MEW.Scene.border = Crafty.e("2D, Canvas, BorderGraphic").attr({x:0, y:0, z:10, alpha: 1.0,});

        $MEW.Viewport.bindTo($MEW.Scene.background_old, 0, 0);
        $MEW.Viewport.bindTo($MEW.Scene.background, 0, 0);
        $MEW.Viewport.bindTo($MEW.Scene.border, 0, 0);
        //XMLInterfaceSetup();

        $MEW.toggleScrolling(0);

        console.log("Loaded Chess Lobby Scene");

        return;
        
   
}, function () {
    $MEW.Viewport.detach();
    $MEW.Scene = {};
    $MEW.clear();
    console.log("uninit Chess Lobby Scene")
});