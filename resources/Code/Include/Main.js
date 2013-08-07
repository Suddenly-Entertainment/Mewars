/*global $MEW, Crafty*/
//$MEW.clear();
//Crafty.init(800, 600);
//Crafty.canvas.context = $MEW.CTX;
//Crafty.canvas._canvas = $MEW.Canvas;
//Crafty.scene("Load");

$MEW.LOADINGFUNCTIONS.LoadResourcesCallBack = function(p) {
    $MEW.LOADINGFUNCTIONS.updateProgress("Loading Resources", p, (p / 3) + (1 / 3) )
};

//$MEW.LoadResources(callback);
$MEW.LOADINGFUNCTIONS.PostLoadCallBack = function () { 
	setTimeout(function () {
        $MEW.LoadResources($MEW.LOADINGFUNCTIONS.LoadResourcesCallBack);
    }, 10); 
};