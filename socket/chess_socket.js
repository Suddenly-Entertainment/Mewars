var pieces = { }; //0-7: pawns, 8-15: left->right in pairs from white perspective, 16-31: repeat for black
var users = { };
var turn = false; //= white

function resetGame(){
  //define users
  //reset pieces
  var pieces = new array(32);
  for (var i = 0; i < 32; i++) {
    pieces[i] = new Array(2);
    if (i % 16 / 7 <= 1) {
      pieces[i][0] = i % 16
    }
    else {
      pieces[i][0] = i % 2 == 0 ? i % 8 / 2 : 7 - i % 8 / 2;
    }
    pieces[i][1] = i < 16 ? i < 8 ? 1 : 0 : i < 24 ? 6 : 7;
  }
}
var selectx; //data for clicks on board
var selecty;
var movex;
var movey;
var type; //of piece //0:pawn,1:rook,2:knight,3:bishop,4:queen,5:king
function selectPiece(/*(mouseObject)*/){
  //after getting data for click
  try{
    var pieceNum = pieces[selectx,selecty];
    //type = *look in typeDict(ionary)
    //colour tile below selected piece
  }catch (NullPointerException){
    selectx = null;
    selecty = null;
  }
}
function makeMove(/*(mouseObject)*/){
  //check move
  //after getting data for click
  var x = movex - selectx;
  var y = movey - selecty;
  switch (type) {
    
  }
  //give preview
}
function confirm(){
  //commit move
  turn = false ? true : false;
}

/*  Robo(Spencer) here, figured I would communcate this way becuase, why not.
  I really like your comments, that stuff is needed on this project, and it
  seems that is a skill that I lack.  Other then that, it's looking good CaptG *\