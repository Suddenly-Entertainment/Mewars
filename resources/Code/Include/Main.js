/*global $MEW, Crafty*/
//$MEW.clear();
//Crafty.init(800, 600);
//Crafty.canvas.context = $MEW.CTX;
//Crafty.canvas._canvas = $MEW.Canvas;
//Crafty.scene("Load");

//$MEW.LoadResources(callback);

$MEW.ResetNetwork = function() {
    // recreat the network object
    $MEW.Network = Crafty.e('Network').setName('Network')
}


$MEW.LOADINGFUNCTIONS.PostLoadCallBack = function () { 
    setTimeout(function () {
        $MEW.ResetNetwork()
        $MEW.LoadResources($MEW.LOADINGFUNCTIONS.updateProgress);
    }, 10); 
};