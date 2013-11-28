Crafty.scene("Chess", function() {
	  console.log("Loaded Chess scene");
	
	  $MEW.ResetScene();
    $MEW.ResetNetwork();
	
	
	
	  $MEW.toggleScrolling(0);
	
    var newPiece = Crafty.e("Piece Pawn WhiteS").Piece();
    
    var chessBoard = Crafty.e("ChessBoard").makeChessBoard(200, 200, 3);
	
		
	  $MEW.interface = Crafty.e("Interface").makeInterface(300, 646, 3, 600, 154);
	  startGame();
}
);

Crafty.c("Piece", {
      init: function() {
        this.requires("2D, CANVAS, HTML");
    },
    
    Piece: function() {
      var coolfactor = 10;
      //the rest...
      //x += 2;
      
      return this;
    }
});
