Crafty.scene("PonymakerTest", function() {


    Crafty.viewport.x = 0;


    Crafty.viewport.y = 0;





    if ($MEW.compositing == 0) {//messing around with variables to understand how things work


        $MEW.player = Crafty.e("Player").makePlayer(400, 400, "0|0|0|0|0|11|0|0|0|0|0|0|0");


    } else {


        $MEW.player = Crafty.e("CanvasPlayer").makePlayer(400, 400, "0|0|0|0|0|11|0|0|0|0|0|0|0");


    }


    $MEW.player.armorColorOld = 0;


    $MEW.player.hatColorOld = 0;


    $MEW.interface = Crafty.e("Interface").makeInterface(0, 500, 1);


});


