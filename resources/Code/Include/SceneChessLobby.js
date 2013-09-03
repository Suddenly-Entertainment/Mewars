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

Crafty.scene("ChessLobby", function() {
    
    $MEW.ResetScene()
    $MEW.ResetNetwork()
    
    $MEW.Network.requires('NetworkChessLobby')
    
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