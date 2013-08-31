/*global $MEW, Crafty*/
/**
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
**/


/* *********************************************************************
 *  LOADING FUNCTIONS
 * *********************************************************************/

$MEW.LOADINGFUNCTIONS = {};

$MEW.CurrentLoadingScript = 0;


$MEW.LOADINGFUNCTIONS.PostLoadCallBack = function( ) {
    $MEW.clear( );
    $MEW.CTX.fillStyle = "#000000";
    $MEW.CTX.font = "14px sans-serif";
    var text = "Error: Post load Call Back not set, contact the admin to report this error";
    var textWidth = $MEW.CTX.measureText( text ).width;
    var x = ( $MEW.WIDTH - textWidth ) / 2;
    var y = ( $MEW.HEIGHT - 14 ) / 2 - 14;
    $MEW.CTX.fillText( text, x, y, textWidth );
};

$MEW.LOADINGFUNCTIONS.updateProgress = function( message, progress, bar ) {
    var text = message + "... " + Math.floor( progress * 100 ) + "%";
    $MEW.LOADINGFUNCTIONS.bar.updateProgress( bar );
    $MEW.LOADINGFUNCTIONS.text.text( text );
};

$MEW.LOADINGFUNCTIONS.updateScriptProgress = function( ) {
    if ( $MEW.CurrentLoadingScript < $MEW.scripts.length ) {
        var progress = $MEW.CurrentLoadingScript / $MEW.scripts.length;
        var text = 'Loading Game Code';
        if ( $MEW.ScriptsRetryCounter > 0 ) {
            text += ( " (Retry " + $MEW.ScriptsRetryCounter + ")" );
        }
        $MEW.LOADINGFUNCTIONS.updateProgress( text, progress, progress / 3 );
        $MEW.LOADINGFUNCTIONS.getNextScriptAJAX( $MEW.CurrentLoadingScript );
    } else {
        // proceed with the Main loop
        $MEW.LOADINGFUNCTIONS.PostLoadCallBack( );
    }
};

$MEW.LOADINGFUNCTIONS.getNextScriptAJAX = function( script_index ) {
    function processNext( script ) {
        $MEW.EvalScript( script, $MEW.scripts[ script_index ] ); //Debug method
        $MEW.CurrentLoadingScript++;
        $MEW.LOADINGFUNCTIONS.updateScriptProgress( );

    }
    var retry = function( ) {
        if ( $MEW.CurrentLoadingScript < $MEW.scripts.length ) {
            $MEW.LOADINGFUNCTIONS.getNextScriptAJAX( $MEW.CurrentLoadingScript );
        }
    };
    var ajax = $.ajax( {
        type: 'GET',
        url: $MEW.RESOURCE_URL + '/code/file/' + $MEW.scripts[ script_index ],
        context: this,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    } );
    ajax.done( processNext );
    ajax.fail( $MEW.GameLoadErrorFunc( retry, "Error obtaining code file: " + $MEW.scripts[ script_index ] ) );
};

$MEW.LOADINGFUNCTIONS.loadScripts = function( ) {
    $MEW.LOADINGFUNCTIONS.getNextScriptAJAX( $MEW.CurrentLoadingScript );
};



/* *********************************************************************
 *  SCENE FUNCTIONS
 * *********************************************************************/


$MEW.ResetScene = function() {

    //set the viewport
    Crafty.viewport.x = 0;    
    Crafty.viewport.y = 0;


    // lets make a componant that will mark the viewport so we can attach other components to it and not worry about maintaing their positions
    $MEW.Viewport = Crafty.e( "Viewport" ).setName('Viewport')

    // lets make a scene object so we can store things out of scope and always get them (sidesteping closure hell)
    // we recreate this in every scene to remove refrences and clear the name space the old scene should be compleatly garbage collected
    $MEW.Scene = {};
}



/* *********************************************************************
 *  Crafty Basics
 * *********************************************************************/

/* *********************************************************************
 *  Viewport
 *  - Ataches itself to the craft viewport and acts as an ancore
 *    should be remade with each new scene
 * *********************************************************************/
Crafty.c( "Viewport", {
    init: function( ) {

        this.requires( "2D" );

        this.attr( {
            x: Crafty.viewport.x,
            y: Crafty.viewport.y
        } );

        this.bind( "EnterFrame", function( ) {
            this.attr( {
                x: Crafty.viewport.x,
                y: Crafty.viewport.y
            } );
        } );
    },

    bindTo: function( ent, x, y ) {

        ent.attr( {
            x: this.x + x,
            y: this.y + y
        } );
        this.attach( ent );
        return this;
    }
} );


// Some tools for displaying the loading scene

/* *********************************************************************
 *  Dynamic Sprite
 *  - Used to maintain a sprite drawn form a hidden canvas
 * *********************************************************************/
Crafty.c( "DynamicSprite", {
    __tile: 0,
    __tileh: 0,
    __padding: null,
    __trim: null,
    canv: null,
    ready: false,
    init: function( ) {
        this.__trim = [ 0, 0, 0, 0 ];
        var draw = function( e ) {
            var co = e.co,
                pos = e.pos,
                context = e.ctx;
            context.drawImage( this.canv, co.x, co.y, co.w, co.h, pos._x, pos._y, pos._w, pos._h );
        };
        this.bind( "Draw", draw ).bind( "RemoveComponent", function( id ) {
            if ( id === "DynamicSprite" ) this.unbind( "Draw", draw );
        } );
    },
    sprite: function( x, y, tile, tileh, w, h, paddingX, paddingY ) {
        this.__tile = tile;
        this.__tileh = tileh;
        paddingX = paddingX || 0;
        paddingY = paddingY || paddingX;
        this.__padding = [ paddingX, paddingY ];
        this.__coord = [ x * this.__tile + this.__padding[ 0 ] + this.__trim[ 0 ], y * this.__tileh + this.__padding[ 1 ] + this.__trim[ 1 ], this.__trim[ 2 ] || this.__tile, this.__trim[ 3 ] || this.__tileh ];
        this.w = this.__coord[ 2 ];
        this.h = this.__coord[ 3 ];
        this.canv = document.createElement( "Canvas" );
        if ( $MEW.DEBUG.DISPLAY_HIDDEN_CANVAS ) {
            $MEW.DEBUG.ADD_DEBUG_CANVAS( this.canv );
        }
        this.canv.width = w;
        this.canv.height = h;
        this.ready = true;
        this.trigger( "Change" );
        return this;
    },
    crop: function( x, y, w, h ) {
        var old = this._mbr || this.pos( );
        this.__trim = [ ];
        this.__trim[ 0 ] = x;
        this.__trim[ 1 ] = y;
        this.__trim[ 2 ] = w;
        this.__trim[ 3 ] = h;
        this.__coord[ 0 ] += x;
        this.__coord[ 1 ] += y;
        this.__coord[ 2 ] = w;
        this.__coord[ 3 ] = h;
        this._w = w;
        this._h = h;
        this.trigger( "Change", old );
        return this;
    }
} );

/* *********************************************************************
 *  Loading Bar
 *  - Uses a Dynamic Sprite to  diplay a progress bar drawn from an 
 *    empty and full bar image
 * *********************************************************************/
Crafty.c( "LoadingBar", {
    init: function( ) {
        this.requires( "2D, Canvas, DynamicSprite" );
    },

    LoadingBar: function( img1, img2, imgw, imgh ) {
        this.sprite( 0, 0, imgw, imgh, imgw, imgh );
        this.img1 = img1;
        this.img2 = img2;
        this.imgw = imgw;
        this.imgh = imgh;
        this.p = 0.0;
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    updateContents: function( ) {
        var ctx = this.canv.getContext( "2d" ),
            pw = Math.round( this.p * this.imgw );
        // background
        ctx.clearRect( 0, 0, this.imgw, this.imgh );
        ctx.drawImage( this.img1, 0, 0, this.imgw, this.imgh, 0, 0, this.imgw, this.imgh );
        // forground
        if ( pw > 0 ) ctx.drawImage( this.img2, 0, 0, pw, this.imgh, 0, 0, pw, this.imgh );
        return this;
    },

    updateProgress: function( p ) {
        this.p = p;
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    }
} );

/* *********************************************************************
 *  Loading Bar
 *  - Uses a Dynamic Sprite to draw shadowed text
 * *********************************************************************/
Crafty.c( "ShadowTextCanvas", {
    _text: "",
    _textFont: {
        "type": "",
        "weight": "",
        "size": "",
        "family": ""
    },
    init: function( ) {
        this.requires( "2D, Canvas, DynamicSprite" );
    },

    ShadowTextCanvas: function( w, h, text, depth ) {
        this.sprite( 0, 0, w, h, w, h );
        this.attr( {
            depth: depth,
            w: w,
            h: h
        } );
        if ( !( typeof text !== "undefined" && text !== null ) ) return this._text;
        if ( typeof( text ) == "function" ) this._text = text.call( this );
        else this._text = text;
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    updateContents: function( ) {
        var ctx = this.canv.getContext( "2d" );

        ctx.clearRect( 0, 0, this.w, this.h );

        var font = this._textFont[ "type" ] + ' ' + this._textFont[ "weight" ] + ' ' + this._textFont[ "size" ] + ' ' + this._textFont[ "family" ];
        ctx.save( );

        ctx.font = font;

        ctx.translate( 0, parseInt( this._textFont[ "size" ] ) );

        //shadow
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText( this._text, 0 - this.depth, 0 - this.depth );
        ctx.fillText( this._text, 0 - this.depth, 0 + this.depth );
        ctx.fillText( this._text, 0 + this.depth, 0 - this.depth );
        ctx.fillText( this._text, 0 + this.depth, 0 + this.depth );

        //forground
        ctx.fillStyle = this._textColor || "rgb(255,255,255)";
        ctx.fillText( this._text, 0, 0 );

        var metrics = ctx.measureText( this._text );
        this._w = metrics.width;

        ctx.restore( );

        return this;
    },

    /**@
     * #.text
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
     *
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 })
     *     .text(function () { return "My position is " + this._x });
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text("Look at me!!");
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 })
     *     .text(function () { return "My position is " + this._x });
     * ~~~
     */
    text: function( text ) {
        if ( !( typeof text !== "undefined" && text !== null ) ) return this._text;
        if ( typeof( text ) == "function" ) this._text = text.call( this );
        else this._text = text;
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    /**@
     * #.textColor
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").attr({ x: 100, y: 100 }).text("Look at me!!")
     *   .textColor('#FF0000');
     *
     * Crafty.e("2D, Canvas, Text").attr({ x: 100, y: 100 }).text('Look at me!!')
     *   .textColor('#FF0000', 0.6);
     * ~~~
     * @see Crafty.toRGB
     */
    textColor: function( color, strength ) {
        this._strength = strength;
        this._textColor = Crafty.toRGB( color, this._strength );
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    /**@
     * #.textFont
     * @example
     * ~~~
     * Crafty.e("2D, DOM, Text").textFont({ type: 'italic', family: 'Arial' });
     * Crafty.e("2D, Canvas, Text").textFont({ size: '20px', weight: 'bold' });
     *
     * Crafty.e("2D, Canvas, Text").textFont("type", "italic");
     * Crafty.e("2D, Canvas, Text").textFont("type"); // italic
     * ~~~
     */
    textFont: function( key, value ) {
        if ( arguments.length === 1 ) {
            //if just the key, return the value
            if ( typeof key === "string" ) {
                return this._textFont[ key ];
            }

            if ( typeof key === "object" ) {
                for ( var propertyKey in key ) {
                    this._textFont[ propertyKey ] = key[ propertyKey ];
                }
            }
        } else {
            this._textFont[ key ] = value;
        }

        this.updateContents( );
        this.trigger( "Change" );
        return this;
    }
} );

/* *********************************************************************
 *  Circle Sprite
 *  - A simple circle drawn on a canvas
 * *********************************************************************/

Crafty.c( "CircleSprite", {
    init: function( ) {
        this.requires( "2D, Canvas, DynamicSprite" );
    },

    CircleSprite: function( x, y, r, color ) {
        var w = r * 2,
            h = w;
        this.sprite( 0, 0, w, h, w, h );
        this.attr( {
            x: x,
            y: y,
            w: w,
            h: h
        } );
        this.color = color;
        this.r = r;
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    updateContents: function( ) {
        var ctx = this.canv.getContext( "2d" );
        ctx.clearRect( 0, 0, this.w, this.h );
        ctx.beginPath( );
        ctx.arc( this.r, this.r, this.r, 0, 2 * Math.PI, false );
        ctx.closePath( );
        ctx.fillStyle = this.color;
        ctx.fill( );
        return this;
    }
} );


/* *********************************************************************
 *  Loading Dots
 *  - A series of dots that fade in and out to indicate progress is 
 *    being made, with no indication of % compleation
 * *********************************************************************/
Crafty.c( "LoadingDots", {

    init: function( ) {

        this.requires( "2D" );

    },

    loadingDots: function( x, y, w, h, color ) {
        var r = Math.round( h / 2 ),
            n = Math.round( w / ( r * 2 ) );
        this.color = color;
        this.dots = [ ];
        this.dot_tween_states = [ ];
        var that = this;
        for ( var i = 0; i < n; i++ ) {
            var dot = Crafty.e( "CircleSprite, Tween" ).CircleSprite( x + r * 2 * i, y, r, this.color );
            dot.attr( {
                alpha: 0.0,
                z: this.z
            } );
            this.dots.push( dot );
            this.dot_tween_states.push( false );
            this.attach( dot );
        }

        var current_dot = 0;
        var total_ani = 200,
            each_ani = Math.round( total_ani / n );

        var tween_dot = function( i ) {
            if ( that.dot_tween_states[ i ] ) {
                that.dots[ i ].tween( {
                    alpha: 0.0
                }, each_ani );
                that.dot_tween_states[ i ] = false;
                return true;
            } else {
                that.dots[ i ].tween( {
                    alpha: 1.0
                }, each_ani );
                that.dot_tween_states[ i ] = true;
                return false;
            }
        };

        var loop = false;

        var bind_tween = function( i ) {
            var flag = false,
                bind = tween_dot( i );
            if ( bind ) {
                i = ( i + 1 ) % n;
                if ( i !== 0 || loop ) tween_dot( i );
                flag = true;
            } else {
                if ( i === 0 ) flag = true;
            }
            if ( flag ) {
                that.dots[ i ].bind( "TweenEnd", function( i ) {
                    return function( ) {
                        that.dots[ i ].unbind( "TweenEnd" );
                        bind_tween( i );
                    };
                }( i ) );
            }
        };

        bind_tween( 0 );
        loop = true;

        this.bind( "Remove", function( ) {
            if ( this.dots ) {
                for ( var i = 0; i < this.dots.length; i++ ) {
                    this.dots[ i ].destroy( );
                }
            }
        } );
        return this;
    },

    set_z: function( v ) {
        if ( this.dots ) {
            for ( var i = 0; i < this.dots.length; i++ ) {
                this.dots[ i ].attr( {
                    z: v
                } );
            }
        }
    }

} );



/* *********************************************************************
 *  Loading Scene
 *  - The loading scene, loads game code, images, ect.
 * *********************************************************************/
Crafty.scene( "Load", function( ) {

   

    var h = 16,
        w = 160,
        x = ( $MEW.WIDTH - w ) / 2,
        y = ( $MEW.HEIGHT - h ) / 2;

    $MEW.Scene.loading_dots = Crafty.e( "LoadingDots" ).loadingDots( 0, 0, w, h, "#000000" );

    $MEW.Viewport.bindTo( $MEW.Scene.loading_dots, x, y );

    var interfaceImagesURL = $MEW.RESOURCE_URL + "/image/2/";
    var loadingImages = [ 'loadinggraphic_background.png', 'loadinggraphic_barempty.png', 'loadinggraphic_barfull.png', 'loadinggraphic_border.png' ];
    var ImageURLS = [ ];
    for ( var key in loadingImages ) {
        ImageURLS.push( interfaceImagesURL + loadingImages[ key ] );
    }

    var setUpLoadScene = function( ) {

        $MEW.Scene.loading_dots.destroy( );

        $MEW.Scene.background = Crafty.e( "2D, Canvas, LoadingBackgroundGraphic, Tween" ).attr( {
            x: 0,
            y: 0,
            z: 10,
            alpha: 0.0
        } ).tween( {
            alpha: 1.0
        }, 100 );

        $MEW.Scene.border = Crafty.e( "2D, Canvas, BorderGraphic, Tween" ).attr( {
            x: 0,
            y: 0,
            z: 10,
            alpha: 0.0
        } ).tween( {
            alpha: 1.0
        }, 100 );

        $MEW.Viewport.bindTo( $MEW.Scene.background, 0, 0 );
        $MEW.Viewport.bindTo( $MEW.Scene.border, 0, 0 );

        var emptybar = interfaceImagesURL + 'loadinggraphic_barempty.png',
            fullbar = interfaceImagesURL + 'loadinggraphic_barfull.png';

        $MEW.LOADINGFUNCTIONS.bar = Crafty.e( "LoadingBar, Tween" ).LoadingBar( Crafty.assets[ emptybar ], Crafty.assets[ fullbar ], 491, 32 ).attr( {
            alpha: 0.0,
            z: 20
        } ).tween( {
            alpha: 1.0
        }, 100 );

        $MEW.LOADINGFUNCTIONS.text = Crafty.e( "ShadowTextCanvas, Tween" ).ShadowTextCanvas( 200, 22, "Loading Game Code", 1 ).textFont( {
            family: 'sans-serif',
            size: '16px'
        } ).textColor( '#FFFFFF', 1.0 ).text( "Loading Game Code" ).attr( {
            alpha: 0.0,
            z: 20,
            h: 16
        } ).tween( {
            alpha: 1.0
        }, 100 );

        $MEW.Viewport.bindTo( $MEW.LOADINGFUNCTIONS.bar, 154, 500 );
        $MEW.Viewport.bindTo( $MEW.LOADINGFUNCTIONS.text, 295, 460 );



        // Load the scripts
        $MEW.LOADINGFUNCTIONS.loadScripts( );


    };

    function getMEWScripts( ) {
        var ajax = $.ajax( {
            type: 'GET',
            url: $MEW.RESOURCE_URL + '/code/includes',
            context: this,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        } )
        ajax.done( function( data ) {
            try {
                $MEW.scripts = JSON.parse( data );
            } catch ( e ) {
                $MEW.scripts = data;
            }
            setUpLoadScene( );
        } )
        ajax.fail( $MEW.GameLoadErrorFunc( function( ) {
            getMEWScripts( );
        }, "Error obtaining list of scripts to load" ) );
    }

    Crafty.load( ImageURLS, function( ) {
            //when loaded
            Crafty.sprite( 800, 600, interfaceImagesURL + 'loadinggraphic_border.png', {
                BorderGraphic: [ 0, 0 ]
            } );
            Crafty.sprite( 800, 600, interfaceImagesURL + 'loadinggraphic_background.png', {
                LoadingBackgroundGraphic: [ 0, 0 ]
            } );
            console.log( "Loaded Loading Graphics" );
            getMEWScripts( );
        },

        function( e ) {
            //progress
            //lets uh not do anything! ya that will work!
        },

        function( e ) {
            //uh oh, error loading
            console.log( "Error Loading Loading Graphics:" );
            console.log( e );
        } );


} );

Crafty.scene( "Load" );