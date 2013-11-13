var pieces = { }; //0-7: pawns, 8-15: left->right in pairs from white perspective, 16-31: repeat for black
var moves = { };
var enPassantMove; //piece, vulnerable to en passant
var enPassantATK = 0; //0 = false, 1 = left, 2 = right
var users = { };
var turn = false; //= white

function resetGame(){
  //define users
  //reset pieces
  pieces = new array(32);
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
var id;
function selectPiece(/*(mouseObject)*/){
  //after getting data for click
  //find type
  for (var i = turn ? 16 : 0; i < turn ? 32 : 16; i++){
    if (pieces[i][0] == selectx && pieces[i][1] == selecty){
      type = i % 16 / 7 <= 1 ? 0 : i % 16 / 9 <= 1 ? 1 : i % 16 / 11 <= 1 ? 2 : i % 16 / 13 <= 1 ? 3 : i % 16 == 14 ? 4 : 5;
      id = i;
    }
  }
  if (type = null) //if there was a piece on click
    resetClick();
  else {
    moves = new array(2);
    var x = new array();
    var y = new array();
    //calculate legal moves (needs to account for being blocked by other)
    var check = false;
    switch (type) {
      case 0:
      var direct = turn ? -1 : 1;
      //checking for blocking spieces
      for (var i = 0; i < 32 && !check; i++){
        if (pieces[i][0] == selectx && pieces[i][1] == selecty + direct){
          check = true;
        }
        else if (i == 31 && !check){
          x.push(0);
          y.push(direct);
          if (selecty == turn ? 6 : 1){
            for (var ii = 0; ii < 32 && !check; ii++){
              if (pieces[i][0] == selectx && pieces[i][1] == selecty + direct*2){
                check = true;
              }
              else if (ii == 31 && !check){
                x.push(0);
                y.push(direct*2);
                enPassantMove = id;
              }
            }
          }
        }
      }
      for (var i = turn ? 16 : 0; i < turn ? 32 : 16; i++){
        //attacks
        if (pieces[i][1] == selectx + direct && pieces[i][0] == selectx + 1){
          x.push(1);
          y.push(direct);
        }
        else if (pieces[i][1] == selectx + direct && pieces[i][0] == selectx - 1){
          x.push(-1);
          y.push(direct);
        }
      }
      //en passant (made in new for loop for efficiency's sake)
      //NOTE: remember to somewhere reset enPassantMove upon enemy final move
      if (selecty == turn ? 3 : 4 && id != null){
        for (var i = turn ? 16 : 0; i < turn ? 32 : 16; i++){
          if (i = id){
            if (pieces[i][1] == selectx && pieces[i][0] == selectx + 1){
              x.push(1);
              y.push(direct);
              id = null;
            }
            else if (pieces[i][1] == selectx && pieces[i][0] == selectx - 1){
              x.push(-1);
              y.push(direct);
              id = null;
            }
          }
        }
      }
      break;
    }
    moves[0].push(x);
    moves[1].push(y);
    //draw on squares with legal moves (and selected piece)
  }
}
function makeMove(/*(mouseObject)*/){
  //check move
  //after getting data for click
  var x = movex - selectx;
  var y = movey - selecty;
  //compare to moves array
  //give preview
}
function resetClick(){
  selectx = null;
  selecty = null;
  movex = null;
  movey = null;
  type = null;
}
function confirm(){
  //commit move
  turn = false ? true : false;
}

/*  Robo(Spencer) here, figured I would communcate this way becuase, why not.
  I really like your comments, that stuff is needed on this project, and it
  seems that is a skill that I lack.  Other then that, it's looking good CaptG *\