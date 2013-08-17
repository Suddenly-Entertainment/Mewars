// Scene User
// * components and scene for logging in and welcomeing the user

Crafty.c("UserAvatarSprite", {
    init: function () {
        this.requires("2D, Canvas, DynamicSprite");
    },
    
    changeURL: function(url, cb) {
        this.url = url;
        var that = this;
        var img = Crafty.asset(url);
        var imageDoneLoading = function () {
            that.ready = true;
            that.updateContents();
            that.trigger("Change");
            if (!(typeof(cb) === 'undefined')) cb();
        };
        if (!img) {
            img = new Image();
            img.src = url;
            Crafty.asset(url, img);
            img.onload = imageDoneLoading;
        } else {
            imageDoneLoading();
        }
        return this;
    },
    
    UserAvatarSprite: function(x, y, z, w, h, url) {
        this.sprite(0, 0, w, h, w, h);
        this.attr({x: x, y: y, w: w, h: h, z: z});
        this.ready = false;
        this.changeURL(url);
        return this;
    },
    
    updateContents: function() {
        var ctx = this.canv.getContext("2d");
        var img = Crafty.asset(this.url);
        if (img) {
            ctx.clearRect(0, 0, this.w, this.h);
            var x = (this.w - img.width) / 2,
                y = (this.h - img.height) / 2;
            ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width, img.height);
            this.trigger("Change");
        }
        return this;
    }
});

Crafty.c("UserAvatarWrapper", {
    init: function () {
        this.requires("2D");
    },
    
    UserAvatarWrapper: function (x, y, z, w, h, url) {
        
        this.url = url;
        this.attr({x: x, y: y, w: w, h: h, z: z});
        
        var c1 = "#FFFFFF",
            c2 = "transparent";
            
        this.sprite = Crafty.e("UserAvatarSprite").UserAvatarSprite(x , y, z, w, h, url);
            
        this.attach(this.sprite);
        
        this.changeAvatar(url);
        
        return this;
        
    },
    
    changeAvatar: function(url, cb) {
        var x = this.x + (this.w / 4),
            y = this.y + (this.h - (this.h / 8)) / 2,
            w = this.w / 2,
            h = this.h / 8;
        this.loading_dots = Crafty.e("LoadingDots").loadingDots(x, y, w, h, "#999999");
        this.loading_dots.set_z(this.z + 10);
        this.attach(this.loading_dots);
        var that = this;
        var removeDots = function () {
            that.loading_dots.destroy();
            if (!(typeof(cb) === 'undefined')) cb();
        };
        this.sprite.changeURL(url, removeDots);
        return this;
    },
    
    set_z: function(v) {
        this.background.attr({z: v});
        if(this.loading_dots) this.loading_dots.set_z(v + 10);
        this.sprite.attr({z: v + 1});
        return this;
    }
});

Crafty.c("MEWLoginForm", {
    init: function () {
        this.requires("2D, Keyboard");
    },
    
    MEWLoginForm: function(x, y, z, w, h) {
        this.attr({x: x, y: y, z: z, w: w, h: h});
        
        this.submitting = false;
        //Username Box
        this.username = Crafty.e("2D, HTML_INPUT")
            .attr({x: x, y: y, z: z, w: w, h: 20})
            .css({background: "#3d3c3c"});
            
        function onBlurDefaultTextReplace(text) {
            return function () {
                if ( $(this).val() === '' ) {
                    $(this).css('color','#999'); 
                    $(this).val(text); 
                } 
                return true;
            };
        }
        
        function onFocusDefaultTextReplace(text) {
            return function () {
                $(this).css('color','#FFF'); 
                if ($(this).val() === text ) { 
                    $(this).val('');
                }
                return true;
            };
        }
        
        var userHTMLText = '<input id="_MEW_login_username" type="text" class="input_text" value="username" />';
                         
        this.username.replace(userHTMLText);
        $("#_MEW_login_username").css({
            background: 'rgba(0, 0, 0, 0.0)', 
            color: 'rgb(196, 183, 135)',
            border: 'none',
            outline: 'none',
            'font-family': 'Arial',
            'font-weight': 'bold'
        });
        
        $("#_MEW_login_username").blur(onBlurDefaultTextReplace('Username or Email'));
        $("#_MEW_login_username").focus(onFocusDefaultTextReplace('Username or Email'));
        
        //Password box
        this.password = Crafty.e("2D, HTML_INPUT")
            .attr({x: x, y: y + 24, z: z, w: w, h: 20})
            .css({background: "#3d3c3c"});
            
        var passHTMLText = ' <input id="_MEW_login_password" type="password" class="input_password" value="password"  /> ';
        
        this.password.replace(passHTMLText).css({
            background: 'rgba(0, 0, 0, 0.0)',
            color: 'rgb(196, 183, 135)',
            border: 'none',
            outline: 'none',
            'font-family': 'Arial',
            'font-weight': 'bold',
        });
        
        $("#_MEW_login_password").blur(onBlurDefaultTextReplace('password'));
        $("#_MEW_login_password").focus(onFocusDefaultTextReplace('password'));
        
        //Result HTML
        this.resultHTML = Crafty.e("2D, HTML")
            .attr({x: x, y: y + 48, z: z, w: w, h: 20})
            .replace("")
            .css({
                'align': 'left',
                'float': 'left',
                'color': 'white'
            });
        
        // bind to wrapper to maintian relative positions
        this.bindTo(this.username, 0, 0);
        this.bindTo(this.password, 0, 24);
        this.bindTo(this.resultHTML, 0, 48);
        
        var that = this;
        //bind events

        this.bind('KeyDown', function (e) {
            var active = document.activeElement;
            if ((active.id === "_MEW_login_username" || active.id === "_MEW_login_password") && this.isDown('ENTER')){
                that.submit();
            }
            if ((active.id === "_MEW_login_password") && this.isDown('TAB')){
                // prevent it from tabing to the rest of the page
                e.stopPropagation();
                if(e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
        });
        
        //triger change and draw
        this.trigger("Change");
        
        
        return this;
    },
    
    //bind component relative positions
    bindTo: function(ent, x, y) {
    
        ent.attr({x: this.x + x, y: this.y + y});
        this.attach(ent);
        return this;
    },
    
    //submit login request
    submit: function () {
        
        //collect values via JQuery with IDs
        var username = $("#_MEW_login_username").val(),
            password = $("#_MEW_login_password").val(),
            that = this;
        //only one submit request at a time to prevent spam protention from kicking us out
        if (!this.submitting) {
            //send network request
            $MEW.User.Login(username, password, function (result) {that.processResult(result);});
            this.submitting = true;
        }
        
        return this;
    },
    
    set_successCB: function(cb) {
        this.successCB = cb;
    },
    
    processResult: function (result) {
        // ok we arn't submitting anymore 
        this.submitting = false;
        // lets see what the result was
        if (!this.resultHTML) {
            console.log(result);
        } else {
            this.resultHTML.replace(result.message);
            if (result.success) {
                this.resultHTML.css({
                    'align': 'left',
                    'float': 'left',
                    'color': 'green'
                });
                if (!(typeof(this.successCB)==='undefined')) this.successCB();
            } else {
                this.resultHTML.css({
                    'align': 'left',
                    'float': 'left',
                    'color': 'red'
                });
            }
        }
        return this;
    },
    
    set_visible: function(v) {
        this.resultHTML.visible = v;
        this.username.visible = v;
        this.password.visible = v;
    }
    
});

Crafty.c("MEWLoginWindow", {
    init: function () {
        this.requires("Window");
    },
    
    MEWLoginWindow: function (x, y, w, h) {
        this.Window(x, y, 100, w, h);
        // avatar
        this.defaultavatarURL = $MEW.RESOURCE_URL + "/resource/image/2/anonavatar.png";
        $MEW.Scene.avatar = Crafty.e("UserAvatarWrapper").UserAvatarWrapper(x + 10, y + 30, 100, 150, 150, this.defaultavatarURL);
        // login form
        $MEW.Scene.loginForm = Crafty.e("MEWLoginForm").MEWLoginForm(x + 158, y + 30, 100, 220, 150);
        //User Welcome Text
        $MEW.Scene.userWelcomeText = Crafty.e("2D, Canvas, Text")
            .textFont({ family: 'sans-serif', size: '16px' })
            .textColor('#FFFFFF', 1.0)
            .text("Welcome Guest! Please Login.")  
            .attr({x: x + 154, y: y + 4, z:100, w: 220, h: 16}); 
            
        this.attach($MEW.Scene.loginForm);
        this.attach($MEW.Scene.avatar);
        this.attach($MEW.Scene.userWelcomeText);
        return this;
    }
    
});

Crafty.scene("User", function() {
    
    // lets make a scene upbject so we can store tings out of scope and always get them (sidesteping closure hell)
    // we recreate this in every scene to remove refrences and clear the name space the old scene should be compleatly garbage collected
    $MEW.Scene = {};
     var XMLInterfaceSetup = function(){
      var onXMLReturn = function(data){
            var XMLParser = new XMLInterfaceParser(data);
            var XMLInterface = XMLParser.getInterface("LoginForm");
            XMLInterface.layout($MEW.Viewport);
            $("#_MEW_login_btn").click(function(e){
                 var Obj = { user_login: { login: $("_MEW_login_username").val(), password: $("_MEW_login_password").val() } };
                 $MEW.Network.pBind('UsersLogin', loginReturn);
                 $MEW.Network.pBind('UsersLoginError', loginReturnError);
                 $MEW.NEtwork.Send('UsersLogin', Obj);
            });
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
        $MEW.Network.pBind('GetSceneUserXML', onXMLReturn);
        $MEW.Network.pBind('GetSceneUserXMLError', onXMLReturnError);
        $MEW.Network.Send('GetSceneUserXML');
    }
    if (confirm('Do you want to try out the XML interface?')) {
        XMLInterfaceSetup();
        return;
    }
        console.log("Loaded User Scene");
        
        //set the viewport
        Crafty.viewport.x = 0;    
        Crafty.viewport.y = 0;
        
        //create network object
        $MEW.Network = Crafty.e("NetworkUser")
        
        var onTweenEnd = function() {
            // position the login window
            var h = 250,
                w = 500,
                x = ($MEW.WIDTH - w) / 2,
                y = ($MEW.HEIGHT - h) / 2 + h / 4;
            
            // create the backgournd window
            $MEW.Scene.loginWindow = Crafty.e("MEWLoginWindow").MEWLoginWindow(x, y, w, h).setName("UserWelcomeWindow");
            
            $MEW.Viewport.bindTo($MEW.Scene.loginWindow, x, y);
            
            // login updating of the interface
            function updateInterface() {
                if ($MEW.User.is_guest) {
                    //welcome Text
                    $MEW.Scene.userWelcomeText.text("Welcome Guest! Please Login.");
                    //avatar
                    $MEW.Scene.avatar.changeAvatar($MEW.Scene.defaultavatarURL);
                    //show login form
                    $MEW.Scene.loginForm.set_visible(true);
                } else {
                    //welcome Text
                    $MEW.Scene.userWelcomeText.text("Welcome " + $MEW.User.name + "!");
                    //avatar
                    if ($MEW.User.avatar_href === "") {
                        $MEW.Scene.avatar.changeAvatar($MEW.Scene.defaultavatarURL);
                    } else {
                        $MEW.Scene.avatar.changeAvatar($MEW.User.avatar_href);
                    }
                    //hide login form
                    $MEW.Scene.loginForm.set_visible(false);
                }           
            }     
            // create the login form
            function LoginUpdate() {
                $MEW.User.load_user(updateInterface);   
            }
            
            $MEW.Scene.loginForm.set_successCB(LoginUpdate);
            
            //LoginUpdate();
            
        
            //$MEW.Login.elemid = loginHTML.getDomId();
            //$MEW.Login.resultHTML = resultHTML;
            
            
            
            function viewTest() {
                console.log("Calling Test Scene");
                Crafty.scene("Map");
            }
            
            $MEW.Scene.testButton = Crafty.e("Window, Mouse")
                .Window(x, y, 100, 100, 40)
                .setName("TestsButton")
                .bind("Click", viewTest);
            
            $MEW.Scene.testButtonText = Crafty.e("2D, Canvas, Text, Mouse")
                .textFont({ family: 'sans-serif', size: '16px' })
                .textColor('#FFFFFF', 1.0)
                .text("View Tests")  
                .attr({z:110, w: 100, h: 20})
                .bind("Click", viewTest);
                
            
            $MEW.Viewport.bindTo($MEW.Scene.testButton, $MEW.WIDTH - 140, $MEW.HEIGHT - 85);
            $MEW.Viewport.bindTo($MEW.Scene.testButtonText, $MEW.WIDTH - 140 + 5, $MEW.HEIGHT - 85 + 5);
    
        };
        
        // get the background & border and change it to the map for the login screen
        $MEW.Scene.background_old = Crafty.e("2D, Canvas, LoadingBackgroundGraphic, Tween")
            .attr({x:0, y:0, z:10, alpha: 1.0,})
            .tween({alpha: 0.0}, 100);
                
        $MEW.Scene.background = Crafty.e("2D, Canvas, LoginScreenBackground, Tween")
            .attr({x:0, y:0, z:10, alpha: 0.0,})
            .tween({alpha: 1.0}, 50)
            .bind("TweenEnd", onTweenEnd);
            
        $MEW.Scene.border = Crafty.e("2D, Canvas, BorderGraphic")
            .attr({x:0, y:0, z:10, alpha: 1.0,});
        
        //bind the sprites to the viewport    
        $MEW.Viewport.bindTo($MEW.Scene.background_old, 0, 0);
        $MEW.Viewport.bindTo($MEW.Scene.background, 0, 0);
        $MEW.Viewport.bindTo($MEW.Scene.border, 0, 0);
        
        $MEW.toggleScrolling(0);
        
   
}, function () {
    $MEW.Viewport.detach();
    $MEW.Scene = {};
    $MEW.clear();
    console.log("uninit User Scene")
});

