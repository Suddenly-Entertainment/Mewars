Crafty.c("ProgressBar", {
    ProgressBar: function(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.color = color;
        this.p = 0.0;
        return this;
    },
    draw: function() { //setup
        var ctx = Crafty.canvas.context;
        var gray = new $MEW.RGBColor("rgb(100, 100, 100)");
        var drawColor = new $MEW.RGBColor(this.color);
        var c = new $MEW.RGBColor("rgb(0, 0, 0)"); //background
        ctx.fillStyle = c.toHex();
        var i;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        for (i = 0; i < (this.h / 2 - 1); i++) {
            c.r = Math.floor(gray.r * i / (this.h / 2 - 1));
            c.g = Math.floor(gray.g * i / (this.h / 2 - 1));
            c.b = Math.floor(gray.b * i / (this.h / 2 - 1));
            ctx.fillStyle = c.toHex();
            ctx.fillRect(this.x + 1, this.y + i + 1, this.w - 2, 1);
        }
        ctx.fillStyle = gray.toHex();
        ctx.fillRect(this.x + 1, this.y + (this.h / 2), this.w - 2, 2);
        for ( i = 0; i < (this.h / 2 - 1); i++) {
            c.r = Math.floor(gray.r * i / (this.h / 2 - 1));
            c.g = Math.floor(gray.g * i / (this.h / 2 - 1));
            c.b = Math.floor(gray.b * i / (this.h / 2 - 1));
            ctx.fillStyle = c.toHex();
            ctx.fillRect(this.x + 1, this.y + this.h - i - 1, this.w - 2, 1);
        } // colored % bar
        //top
        for (i = 0; i < (this.h / 2 - 1); i++) {
            c.r = Math.floor(drawColor.r * i / (this.h / 2 - 1));
            c.g = Math.floor(drawColor.g * i / (this.h / 2 - 1));
            c.b = Math.floor(drawColor.b * i / (this.h / 2 - 1));
            ctx.fillStyle = c.toHex();
            ctx.fillRect(this.x + 1, this.y + i + 1, Math.round(this.p * (this.w - 2)), 1);
        } //middle
        ctx.fillStyle = drawColor.toHex();
        ctx.fillRect(this.x + 1, this.y + (this.h / 2), Math.round(this.p * (this.w - 2)), 2); //bottom
        for (i = 0; i < (this.h / 2 - 1); i++) {
            c.r = Math.floor(drawColor.r * i / (this.h / 2 - 1));
            c.g = Math.floor(drawColor.g * i / (this.h / 2 - 1));
            c.b = Math.floor(drawColor.b * i / (this.h / 2 - 1));
            ctx.fillStyle = c.toHex();
            ctx.fillRect(this.x + 1, this.y + this.h - i - 1, Math.round(this.p * (this.w - 2)), 1);
        }
    },
    updateProgress: function(p) {
        this.p = p;
        this.trigger("Change");
    }
}); 

//@ sourceURL=/Game/Tools.js