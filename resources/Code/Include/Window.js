Crafty.c( "Window", {
    init: function( ) {
        this.requires( "2D" );
    },

    Window: function( x, y, z, w, h, skin ) {
        this.attr( {
            x: x,
            y: y,
            w: w,
            h: h,
            z: z
        } );
        var windowskin = skin
        if (!windowskin){
            windowskin = Crafty.e("WindowSkin");
            windowskin.WindowSkin(0, 800, 0, 600, 600, 800, "http://"+window.location.hostname+"/resource/image/2/loadinggraphic_background.png");
        }
        this.skin = Crafty.e( "WindowSkinSprite" ).WindowSkinSprite( x, y, z, w, h, windowskin );
        this.attach( this.skin );
        return this;
    }

} );

Crafty.c( "WindowSkin", {
    init: function( ) {},

    WindowSkin: function( top, bot, left, right, width, height, url ) {
        this.attr( {
            top: top,
            bot: bot,
            left: left,
            right: right,
            width: width,
            height: height,
            url: url
        } );
        return this;
    },

    drawSkin: function( width, height ) {
        var canv = null;
        canv = document.createElement( "Canvas" );
        if ( $MEW.DEBUG.DISPLAY_HIDDEN_CANVAS ) {
            $MEW.DEBUG.ADD_DEBUG_CANVAS( canv );
        }
        canv.width = width;
        canv.height = height;
        var ctx = canv.getContext( "2d" );
        var img = Crafty.assets[ this.url ];
        var w = img.width - this.right;
        var h = img.height - this.bot;
        //drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        // top left
        ctx.drawImage(
            img,
            0, 0, this.left, this.top, // source
            0, 0, this.left, this.top // dest
        );
        // top right
        ctx.drawImage(
            img,
            this.right, 0, w, this.top, // source
            width - w, 0, w, this.top // dest
        );
        // bot left
        ctx.drawImage(
            img,
            0, this.bot, this.left, h, // source
            0, height - h, this.left, h // dest
        );
        // bot right
        ctx.drawImage(
            img,
            this.right, this.bot, w, h, // source
            width - w, height - h, w, h // dest
        );
        // left side
        var dh = ( height - h ) - this.top;
        if ( dh > 0 ) {
            ctx.drawImage(
                img,
                0, this.top, this.left, this.bot - this.top, // source
                0, this.top, this.left, dh // dest
            );

            // right side
            ctx.drawImage(
                img,
                this.right, this.top, w, this.bot - this.top, // source
                width - w, this.top, w, dh // dest
            );
        }
        var dw = ( width - w ) - this.left;
        if ( dw > 0 ) {
            // top side
            ctx.drawImage(
                img,
                this.left, 0, this.right - this.left, h, // source
                this.left, 0, dw, h // dest
            );
            // bot side
            ctx.drawImage(
                img,
                this.left, this.bot, this.right - this.left, h, // source
                this.left, height - h, dw, h // dest
            );
        }
        // center
        if ( dw > 0 && dh > 0 ) {
            ctx.drawImage(
                img,
                this.left, this.top, this.right - this.left, this.bot - this.top, // source
                this.left, this.top, dw, dh // dest
            );
        }
        // all drawn lets return
        return canv;
    }
} );

Crafty.c( "WindowSkinSprite", {
    init: function( ) {
        this.requires( "2D, Canvas, DynamicSprite" );
    },

    WindowSkinSprite: function( x, y, z, w, h, skin ) {
        this.attr( {
            x: x,
            y: y,
            z: z,
            w: w,
            h: h,
            skin: skin
        } );
        this.sprite( 0, 0, w, h, w, h );
        this.updateContents( );
        this.trigger( "Change" );
        return this;
    },

    updateContents: function( ) {
        var ctx = this.canv.getContext( "2d" );
        // get windowskin
        var skincav = this.skin.drawSkin( this.w, this.h );
        // clear the canvas
        ctx.clearRect( 0, 0, this.x, this.h );
        // draw the skin
        ctx.drawImage( skincav, 0, 0, this.w, this.h, 0, 0, this.w, this.h );
        // forground
        return this;
    }

} );