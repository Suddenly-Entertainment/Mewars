
Crafty.scene("PerformanceTest", function() {
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    $MEW.interface = Crafty.e("Interface").makeInterface(0, 500, 2);
    $MEW.players = [];
    for (i = 0; i < 15; ++i) {
        for (j = 0; j < 20; ++j) {
            var index = i * 20 + j;
            if ($MEW.compositing == 0) {
                $MEW.players[index] = Crafty.e("Player").makePlayer(i * 64, j * 64, (index % 3) + "|" + (index % 2) + "|" + (index % 50) + "|" + (index % 26) + "|" + (index % 26) + "|" + ((index % 23) + 11) + "|" + (index % 40) + "|" + ((index % 31) + 1) + "|" + (index % 4) + "|" + ((index % 31) + 1) + "|" + (index % 4) + "|" + ((index % 16) + 1) + "|" + (index % 3 == 1 ? index % 2 : 0));
            }
            else {
                $MEW.players[index] = Crafty.e("CanvasPlayer").makePlayer(i * 64, j * 64, (index % 3) + "|" + (index % 2) + "|" + (index % 50) + "|" + (index % 26) + "|" + (index % 26) + "|" + ((index % 23) + 11) + "|" + (index % 40) + "|" + ((index % 31) + 1) + "|" + (index % 4) + "|" + ((index % 31) + 1) + "|" + (index % 4) + "|" + ((index % 16) + 1) + "|" + (index % 3 == 1 ? index % 2 : 0));
            }
        }
    }
    $MEW.toggleScrolling(1);
}, function() {
    $MEW.toggleScrolling(0);
}); //@ sourceURL=/Game/PerformanceTest.js