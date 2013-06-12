Crafty.scene("PonymakerTest", function() {


    Crafty.viewport.x = 0;


    Crafty.viewport.y = 0;





    if ($MEW.compositing == 0) {


        $MEW.player = Crafty.e("Player").makePlayer(200, 200, "0|0|0|0|0|11|0|0|0|0|0|0|0");


    } else {


        $MEW.player = Crafty.e("CanvasPlayer").makePlayer(200, 200, "0|0|0|0|0|11|0|0|0|0|0|0|0");


    }


    $MEW.player.armorColorOld = 0;


    $MEW.player.hatColorOld = 0;


    $MEW.interface = Crafty.e("Interface").makeInterface(0, 500, 1);


});


