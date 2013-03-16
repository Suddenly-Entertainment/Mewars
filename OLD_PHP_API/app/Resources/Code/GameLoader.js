$MEW.scripts = [
    // System 
    'RGBColor',
    'Network',
    'Resources',
    'Tools',
    
    // Game objects
    'Tilemap',
    'Window',
    'Interface',
    'Player',
    'User',
    'Chess',
    
    // Scenes
    'SceneSkirm',
    'SceneMap',
    'SceneChat',
    'SceneLobby',
    'SceneMain',
    'SceneChess',
    'SceneUser',
    
    // Tests
    'PonymakerTest',
    'PerformanceTest',

    // Main
    'Main'
    ];

$MEW.LOADINGFUNCTIONS = {};

$MEW.CurrentLoadingScript = 0;

$MEW.LOADINGFUNCTIONS.getNextScript = function (script_index) {
    var processNext = function (script) {
            $MEW.EvalScript(script); //Debug method
            $MEW.CurrentLoadingScript++;
            if ($MEW.CurrentLoadingScript < $MEW.scripts.length) {
                $MEW.LOADINGFUNCTIONS.drawProgress($MEW.CurrentLoadingScript / $MEW.scripts.length);
                $MEW.LOADINGFUNCTIONS.getNextScript($MEW.CurrentLoadingScript);
            }
        };
    var retry = function () {
            if ($MEW.CurrentLoadingScript < $MEW.scripts.length) {
                $MEW.LOADINGFUNCTIONS.getNextScript($MEW.CurrentLoadingScript);
            }
        };
    $.post($MEW.URL + '/game/action/', {
            controller: 'code',
            action: 'file',
            pass: JSON.stringify([$MEW.scripts[script_index]]),
            named: JSON.stringify({
                '': ''
            }),
            post: JSON.stringify([null, ])
        },
        //function(script) {eval(script);}
        processNext
    ).error($MEW.GameLoadErrorFunc(retry));

};

// Some tools for displaying the loading scene
Crafty.c("DynamicSprite", {
    __tile: 0,
    __tileh: 0,
    __padding: null,
    __trim: null,
    canv: null,
    ready: false,
    init: function () {
        this.__trim = [0, 0, 0, 0];
        var draw = function (e) {
                var co = e.co,
                    pos = e.pos,
                    context = e.ctx;
                context.drawImage(this.canv, co.x, co.y, co.w, co.h, pos._x, pos._y, pos._w, pos._h);
            };
        this.bind("Draw", draw).bind("RemoveComponent", function (id) {
            if (id === "DynamicSprite") this.unbind("Draw", draw);
        });
    },
    sprite: function (x, y, tile, tileh, w, h, paddingX, paddingY) {
        this.__tile = tile;
        this.__tileh = tileh;
        paddingX = paddingX || 0;
        paddingY = paddingY || paddingX;
        this.__padding = [paddingX, paddingY];
        this.__coord = [x * this.__tile + this.__padding[0] + this.__trim[0], y * this.__tileh + this.__padding[1] + this.__trim[1], this.__trim[2] || this.__tile, this.__trim[3] || this.__tileh];
        this.w = this.__coord[2];
        this.h = this.__coord[3];
        this.canv = document.createElement("Canvas");
        if ($MEW.DEBUG.DISPLAY_HIDDEN_CANVAS) {
            $MEW.DEBUG.ADD_DEBUG_CANVAS(this.canv);
        }
        this.canv.width = w;
        this.canv.height = h;
        this.ready = true;
        this.trigger("Change");
        return this;
    },
    crop: function (x, y, w, h) {
        var old = this._mbr || this.pos();
        this.__trim = [];
        this.__trim[0] = x;
        this.__trim[1] = y;
        this.__trim[2] = w;
        this.__trim[3] = h;
        this.__coord[0] += x;
        this.__coord[1] += y;
        this.__coord[2] = w;
        this.__coord[3] = h;
        this._w = w;
        this._h = h;
        this.trigger("Change", old);
        return this;
    }
});

Crafty.c("LoadingBar", {
    init: function () {
        this.requires("2D, Canvas, DynamicSprite");
    },

    LoadingBar: function (img1, img2, imgw, imgh) {
        this.sprite(0, 0, imgw, imgh, imgw, imgh);
        this.img1 = img1;
        this.img2 = img2;
        this.imgw = imgw;
        this.imgh = imgh;
        this.p = 0.0;
        this.updateContents();
        this.trigger("Change");
        return this;
    },

    updateContents: function () {
        var ctx = this.canv.getContext("2d"),
            pw = Math.round(this.p * this.imgw);
        // background
        ctx.clearRect(0, 0, this.imgw, this.imgh);
        ctx.drawImage(this.img1, 0, 0, this.imgw, this.imgh, 0, 0, this.imgw, this.imgh);
        // forground
        if (pw > 0) ctx.drawImage(this.img2, 0, 0, pw, this.imgh, 0, 0, pw, this.imgh);
        return this;
    },

    updateProgress: function (p) {
        this.p = p;
        this.updateContents();
        this.trigger("Change");
        return this;
    }
});

Crafty.c("Viewport", {
    init: function () {

        this.requires("2D, Persist");

        this.attr({
            x: Crafty.viewport.x,
            y: Crafty.viewport.y
        });

        this.bind("EnterFrame", function () {
            this.attr({
                x: Crafty.viewport.x,
                y: Crafty.viewport.y
            });
        });
    },

    bindTo: function (ent, x, y) {

        ent.attr({
            x: this.x + x,
            y: this.y + y
        });
        this.attach(ent);
        return this;
    }
});

Crafty.c("CircleSprite", {
    init: function () {
        this.requires("2D, Canvas, DynamicSprite");
    },

    CircleSprite: function (x, y, r, color) {
        var w = r * 2,
            h = w;
        this.sprite(0, 0, w, h, w, h);
        this.attr({
            x: x,
            y: y,
            w: w,
            h: h
        });
        this.color = color;
        this.r = r;
        this.updateContents();
        this.trigger("Change");
        return this;
    },

    updateContents: function () {
        var ctx = this.canv.getContext("2d");
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.beginPath();
        ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        return this;
    }
});

Crafty.c("LoadingDots", {

    init: function () {

        this.requires("2D");

    },

    loadingDots: function (x, y, w, h, color) {
        var r = Math.round(h / 2),
            n = Math.round(w / (r * 2));
        this.color = color;
        this.dots = [];
        this.dot_tween_states = [];
        var that = this;
        for (var i = 0; i < n; i++) {
            var dot = Crafty.e("CircleSprite, Tween").CircleSprite(x + r * 2 * i, y, r, this.color);
            dot.attr({
                alpha: 0.0,
                z: this.z
            });
            this.dots.push(dot);
            this.dot_tween_states.push(false);
            this.attach(dot);
        }

        var current_dot = 0;
        var total_ani = 200,
            each_ani = Math.round(total_ani / n);

        var tween_dot = function (i) {
                if (that.dot_tween_states[i]) {
                    that.dots[i].tween({
                        alpha: 0.0
                    }, each_ani);
                    that.dot_tween_states[i] = false;
                    return true;
                }
                else {
                    that.dots[i].tween({
                        alpha: 1.0
                    }, each_ani);
                    that.dot_tween_states[i] = true;
                    return false;
                }
            };

        var loop = false;

        var bind_tween = function (i) {
                var flag = false,
                    bind = tween_dot(i);
                if (bind) {
                    i = (i + 1) % n;
                    if (i !== 0 || loop) tween_dot(i);
                    flag = true;
                }
                else {
                    if (i === 0) flag = true;
                }
                if (flag) {
                    that.dots[i].bind("TweenEnd", function (i) {
                        return function () {
                            that.dots[i].unbind("TweenEnd");
                            bind_tween(i);
                        };
                    }(i));
                }
            };

        bind_tween(0);
        loop = true;

        this.bind("Remove", function () {
            if (this.dots) {
                for (var i = 0; i < this.dots.length; i++) {
                    this.dots[i].destroy()
                }
            }
        });
        return this;
    },

    set_z: function (v) {
        if (this.dots) {
            for (var i = 0; i < this.dots.length; i++) {
                this.dots[i].attr({
                    z: v
                });
            }
        }
    }

});

Crafty.scene("Load", function () {


    // lets make a permate componant that will mark the viewport so we can attach other components to it and not worry about maintaing their positions
    $MEW.Viewport = Crafty.e("Viewport");

    // lets make a scene upbject so we can store tings out of scope and always get them (sidesteping closure hell)
    // we recreate this in every scene to remove refrences and clear the name space the old scene should be compleatly garbage collected
    $MEW.Scene = {};

    var h = 16,
        w = 160,
        x = ($MEW.WIDTH - w) / 2,
        y = ($MEW.HEIGHT - h) / 2;

    $MEW.Scene.loading_dots = Crafty.e("LoadingDots").loadingDots(0, 0, w, h, "#000000");

    $MEW.Viewport.bindTo($MEW.Scene.loading_dots, x, y);

    var interfaceImagesURL = $MEW.URL + "/resource/image/2/";
    var loadingImages = ['loadinggraphic_background.png', 'loadinggraphic_barempty.png', 'loadinggraphic_barfull.png', 'loadinggraphic_border.png'];
    var ImageURLS = [];
    for (var key in loadingImages) {
        ImageURLS.push(interfaceImagesURL + loadingImages[key]);
    }

    var setUpLoadScene = function () {

            $MEW.Scene.loading_dots.destroy();

            $MEW.Scene.background = Crafty.e("2D, Canvas, LoadingBackgroundGraphic, Tween").attr({
                x: 0,
                y: 0,
                z: 10,
                alpha: 0.0
            }).tween({
                alpha: 1.0
            }, 100);

            $MEW.Scene.border = Crafty.e("2D, Canvas, BorderGraphic, Tween").attr({
                x: 0,
                y: 0,
                z: 10,
                alpha: 0.0
            }).tween({
                alpha: 1.0
            }, 100);

            $MEW.Viewport.bindTo($MEW.Scene.background, 0, 0);
            $MEW.Viewport.bindTo($MEW.Scene.border, 0, 0);

            var emptybar = interfaceImagesURL + 'loadinggraphic_barempty.png',
                fullbar = interfaceImagesURL + 'loadinggraphic_barfull.png';

            $MEW.LOADINGFUNCTIONS.bar = Crafty.e("LoadingBar, Tween").LoadingBar(Crafty.assets[emptybar], Crafty.assets[fullbar], 491, 32).attr({
                alpha: 0.0,
                z: 20
            }).tween({
                alpha: 1.0
            }, 100);

            $MEW.LOADINGFUNCTIONS.text = Crafty.e("2D, Canvas, Text, Tween").textFont({
                family: 'sans-serif',
                size: '16px'
            }).textColor('#FFFFFF', 1.0).text("Loading Game Code").attr({
                alpha: 0.0,
                z: 20,
                h: 16
            }).tween({
                alpha: 1.0
            }, 100);

            $MEW.Viewport.bindTo($MEW.LOADINGFUNCTIONS.bar, 154, 500);
            $MEW.Viewport.bindTo($MEW.LOADINGFUNCTIONS.text, 295, 458);

            $MEW.LOADINGFUNCTIONS.getNextScript = function (script_index) {
                var processNext = function (script) {
                        $MEW.EvalScript(script); //Debug method
                        $MEW.CurrentLoadingScript++;
                        if ($MEW.CurrentLoadingScript < $MEW.scripts.length) {
                            var progress = $MEW.CurrentLoadingScript / $MEW.scripts.length;
                            var percentage = Math.floor(progress * 100);
                            var text = 'Loading Game Code ... ' + percentage + "%";
                            if ($MEW.ScriptsRetryCounter > 0) {
                                text += (" (Retry " + $MEW.ScriptsRetryCounter + ")");
                            }
                            $MEW.LOADINGFUNCTIONS.bar.updateProgress(progress);
                            $MEW.LOADINGFUNCTIONS.text.text(text);
                            $MEW.LOADINGFUNCTIONS.getNextScript($MEW.CurrentLoadingScript);
                        }
                    };
                var retry = function () {
                        if ($MEW.CurrentLoadingScript < $MEW.scripts.length) {
                            $MEW.LOADINGFUNCTIONS.getNextScript($MEW.CurrentLoadingScript);
                        }
                    };
                $.post($MEW.URL + '/game/action/', {
                        controller: 'code',
                        action: 'file',
                        pass: JSON.stringify([$MEW.scripts[script_index]]),
                        named: JSON.stringify({
                            '': ''
                        }),
                        post: JSON.stringify([null, ])
                    },
                    //function(script) {eval(script);}
                    processNext
                ).error($MEW.GameLoadErrorFunc(retry));

            };

            $MEW.LOADINGFUNCTIONS.getNextScript($MEW.CurrentLoadingScript);

        };


    Crafty.load(ImageURLS, function () {
        //when loaded
        Crafty.sprite(800, 600, interfaceImagesURL + 'loadinggraphic_border.png', {
            BorderGraphic: [0, 0]
        });
        Crafty.sprite(800, 600, interfaceImagesURL + 'loadinggraphic_background.png', {
            LoadingBackgroundGraphic: [0, 0]
        });
        console.log("Loaded Loading Graphics");
        setUpLoadScene();
    },

    function (e) {
        //progress
        //lets uh not do anything! ya that will work!
    },

    function (e) {
        //uh oh, error loading
        console.log("Error Loading Loading Graphics:");
        console.log(e);
    });


});

Crafty.scene("Load");

//@ sourceURL=/Game/GameLoader.js