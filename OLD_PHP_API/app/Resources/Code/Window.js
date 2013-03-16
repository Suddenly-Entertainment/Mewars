Crafty.c("Window", {
    init: function () { 
        this.requires("2D, Canvas, DynamicSprite");    
    },
    
    Window: function(x, y, z, w, h, color) {
        this.sprite(0, 0, w, h, w, h);
        this.attr({x: x, y: y, w: w, h: h, z: z});
        this.updateContents();
        this.trigger("Change");
        return this;
    },
    updateContents: function() {
        var ctx = this.canv.getContext("2d");
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.w, this.h);   
        return this;    
    },
}); //@ sourceURL=/Game/Window.js