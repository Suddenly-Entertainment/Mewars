//$MEW.clear();
//Crafty.init(800, 600);
//Crafty.canvas.context = $MEW.CTX;
//Crafty.canvas._canvas = $MEW.Canvas;
//Crafty.scene("Load");

$MEW.LOADINGFUNCTIONS.LoadResourcesCallBack = function(p) {
    var percentage = Math.floor(p * 100),
        text = 'Loading Resources...' + percentage + "%";
    $MEW.LOADINGFUNCTIONS.text.text(text);
    $MEW.LOADINGFUNCTIONS.bar.updateProgress(p);
};

//$MEW.LoadResources(callback);
$MEW.LOADINGFUNCTIONS.PostLoadCallBack = function () { 
	setTimeout(function () {
        $MEW.LoadResources($MEW.LOADINGFUNCTIONS.LoadResourcesCallBack);
    }, 10); 
};