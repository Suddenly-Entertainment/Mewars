/*global $MEW, Crafty*/
//$MEW.clear();
//Crafty.init(800, 600);
//Crafty.canvas.context = $MEW.CTX;
//Crafty.canvas._canvas = $MEW.Canvas;
//Crafty.scene("Load");

//$MEW.LoadResources(callback);

$MEW.LOADINGFUNCTIONS.PostLoadCallBack = function () { 
    setTimeout(function () {
        $MEW.Network = Crafty.e('Network')
        $MEW.LoadResources($MEW.LOADINGFUNCTIONS.updateProgress);
    }, 10); 
};