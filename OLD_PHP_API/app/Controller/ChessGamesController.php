<?php

class ChessGame {
    
    function generateGameBoard() { 
        var $board = [];
        for (var $i = 0; $i < 8; $i++) {
            $board[i] = [];
            for ($j = 7; $j >= 0; $j--) {
                // make an empty spot
                $board[$i][$j] = ["", ""];
                // set team
                if ($i == 0 || $i == 1) {
                    $board[$i][$j][1] = "0";
                } else if ($i == 6 || $i == 7) {
                    $board[$i][$j][1] = "1";
                }
                // set piece
                if ($i == 0 || $i == 7) {
                    if ($j == 0 || $j == 7) {
                        $board[$i][$j][0] = "rook";
                    } else if ($j == 1 || $j == 6) {
                        $board[$i][$j][0] = "knight";
                    } else if ($j == 2 || $j == 5) {
                        $board[$i][$j][0] = "bishop";
                    } else if ($j == 4) {
                        $board[$i][$j][0] = "queen";
                    } else if ($j == 3) {
                        $board[$i][$j][0] = "king";
                    }
                } else if ($i == 1 || $i == 6) {
                    $board[$i][$j][0] = "pawn";
                }
            }
        }
        return $board;
    }
    // accepts 
    //1. a three-dimensional array representing the layout of the board
		// col x row x ("0"=piece name, "1"=teamNumber)
		// all values are either "" or a piece name, like "bishop"
	//2. a coordinate in the form of a size-two array of the piece's current position 
		// "0"=col, "1"=row
	//3. a coordinate in the form of a size-two array of the piece's destination
	
	function validateMove ($board, $currentPosition, $destination){
	
		var $_currCol = $currentPosition[0];
		var $_currRow = $currentPosition[1];
		
		// if current position is outside of the board, it is not a valid move
		if($_currCol < 0 || $_currCol > 7 || $_currRow < 0 || $_currRow > 7)return false;
	
		var $_destCol = $destination[0];
		var $_destRow = $destination[1];
		
		// if destination is outside of the board, it is not a valid move
		if($_destCol < 0 || $_destCol > 7 || $_destRow < 0 || $_destRow > 7)return false;
		
		var $_colDiff = $_destCol - $_currCol;
		var $_rowDiff = $_destRow - $_currRow;
		
		var $_pieceTeam = $board[$_currCol][$_currRow] -> team;
		var $_pieceName = $board[$_currCol][$_currRow] -> name;
		var $_destTeam = "";
		
		// lets see if there is anypony at our destination
		// so that we can kill them
		var $_isEmptyAtDest = $board[$_destCol][$_destRow] == "";
		if(!$_isEmptyAtDest){
			
			$_destTeam = $board[$_currCol][$_currRow] -> team;
			
			if($_destTeam == $_pieceTeam)
				return false;// moving onto your own team's space...
			
			//the death of a piece is immenent... 
		}
		// else
		// the destination is empty, we're good to go!
		
		// inside the switch all of the checks take place
		// if the move fails a check at any point, the function immediately returns false
		// if the function reaches the end of the switch, the move is valid
		// at least the endpoints are
		switch($_pieceName){
			case "pawn":
				if($teamNumber == "0"){
					if($_currRow != 6){
						// if it has moved yet, it can only move one space
						if($_rowDiff < -1)return false;
					}else{
						// it is allowed to move two spaces
						if($_rowDiff < -2)return false;
						
						if($_rowDiff == -2)//just gonna check this right now, to make it easier later
							// if someone is in the way, we can't do this
							if($board[$_destCol][$_destRow-1] != "")
								return false;
					}
				}else if ($_teamNumber == "1"){
					if($_currRow != 1){
						// if it has moved yet, it can only move one space
						if($_rowDiff > 1)return false;
					}else{
						// it is allowed to move two spaces
						if($_rowDiff > 2)return false;
						
						if($_rowDiff == 2)//just gonna check this right now, to make it easier later
							// if someone is in the way, we can't do this
							if($board[$_destCol][$_destRow+1] != "")
								return false;
					}
				}
				break;
			case "knight":
				if((abs($_rowDiff) == 2 && abs($_colDiff) == 1) || (abs($_rowDiff) == 1 && abs($_colDiff) == 2)){
					// if the piece has moved 1 space in one direction, and 2 in the other, it's legal
				}else{
					return false;
				}
				break;
			case "queen":
				// I have a hard time creating outside functions that test for rook moves and bishop moves, 
				// so I stuck them inside this switch here.
				// In order to save humanity (and myself) from the redundancy of copypasta,
				// I will pull a dirty trick: letting the queen mooch off of her subjects' code
				// namely the rook and the bishop
				
			case "rook":
				// let's make sure that the rook is only moving in a straight, non-diagonal line
				// I didn't bother to check whether an XOR operator exists...
				if( !($_rowDiff != 0 && $_colDiff != 0) && ($_rowDiff != 0 || $_colDiff != 0)){
					// basically, if only one direction is traveled, not both, neither was already taken care of earlier
				}else{
					// OBJECTION, YOUR HONOR!
					// the piece tried to make an illegal move
					if($_pieceName != "queen")// she might actually be moving diagonally
						return false;
				}
				
				if($_pieceName != "queen")
					break; // You shall not pass!
					
			case "bishop":
				// now for the fun one
				
				// lets see, to account for stupid calculation errors like somehow ending up as 1.00001, what is 1/7?
				// 0.14? that's good to know
				var $ratio = abs($_rowDiff)/abs($_colDiff)
				if($ratio < 1.13 && $ratio > 0.87){
					// alright, a valid move in a perfectly diagonal line!
					
				}else{
					return false; // there's hell to pay
				}
				
				break; // even royalty must stop at some point
			
			case "king":
				if(abs($_rowDiff) > 1 || abs($_colDiff) > 1){
					return false;
				}
				break;
			default:
				// that's not a even a valid piece name...
				return false;
				break;
		
		}
		
		// so the destination is valid. But how are we going to get there?
		if($_pieceName == "knight"){
			// I'm the knight, f*ck you I do what I want
			return true;
		}else{
			// everyone else, we gotta check your papers please
			
			// so the pawn, king, and knight don't need to be checked
			// that leaves the bishop, rook, and queen
			// oh hey, that's easy!
			
			var $distance = abs($_rowDiff != 0 ? $_rowDiff : $_colDiff);
			if($distance == 1)return true;// there aren't any intermediate steps; we're only moving one square over
			
			var $arr = generateTableOfLinearCoords($currentPosition, $destination, gmp_sign($_colDiff), gmp_sign($_rowDiff));
						
			// generateTableOfLinearCoords
			// check if each one is empty
			// if not, to the moon
			
			var $count = count($arr);
			for(var $i = 0; $i<$count; $i++){
				if($board[$arr[$i]["0"]][$arr[$i]["1"]] != "")return false; // there's somebody there!
			}
			
		}
		
		// all clear!
		return true;
		
	}
	
	// return a two-dimensional array
	// array of coordinates -> each one is ("0"=col, "1"=row)
	function generateTableOfLinearCoords ($start, $end, $x, $y) {
		var $arr = array ();
		for(var $i = $start["0"], var $j = $start["1"];
					$i != $end["0"] && $j != $end["1"];
					$i += $x, $j += $y){
				push($arr, array("0"=>$i, "1"=>$j));
			}
		return $arr;
	}
}

class ChessGamesController extends Controller {

    public $name = 'ChessGames';

    

    public $components = array('RequestHandler', 'MEW_SMF', 'MEW_TOOLS');



    function create($name) {

        $this->autoRender = false;

        if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}

        $this->ChessGame->create();

        $this->ChessGame->set("name", $name);
        
        $this->ChessGame->set("user1_id", $this->MEW_SMF->GetUserID());
        
        $this->ChessGame->set("state", false); // still in lobby
        
        $this->ChessGame->set("side", false); // player 1 white
        
        $chessgame = new ChessGame();
        $board = $chessgame->generateGameBoard();
        
        $this->ChessGame->set("board", json_encode($board));
        

        if ($this->ChessGame->save()) {
            
            return $this->MEW_TOOLS->phraseMEWResponce('ChessGameCreate', true); // name was good
            
        }
            
        return $this->MEW_TOOLS->phraseMEWResponce('ChessGameCreate', false); // name was bad



    }

    function add($game_id) {

        $this->autoRender = false;
         
        if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}
        	
		$movesInGame = $this->ChessGame->ChessMove->find('count', array(
            'conditions' => array('ChessMove.game_id' => $game_id)
        ));
        
        $chessgame = new ChessGame();
        
        $game = $this->ChessGame->find('first',  array(
            'conditions' => array('>ChessGame.game_id' => $game_id)
        ));
        
        $board = json_decode($game["ChessGame"]["board"]);
        $fx = $this->request->data->whoCol;
        $fy = $this->request->data->whoRow;
        $dx = $this->request->data->destCol
        $dy = $this->request->data->destRow
        if ($chessgame->validateMove($board, [$fx, $fy], [$dx, $dy] )) {
            
            // change the game board and save
            $board[$dx][$dy] = [$board[$fx][$fy][0],  $board[$fx][$fy][1]];
			$board[$fx][$fy] = ["", ""];
            $game["ChessGame"]["board"] = json_encode($board);
            
            $this->ChessGame->save($game);
            
            // create the new move and save it
            $this->ChessGame->ChessMove->create();
    
            $this->ChessGame->ChessMove->set("game_id", $game_id);
    
            $this->ChessGame->ChessMove->set("move_num", $movesInGame + 1);
    
            $this->ChessGame->ChessMove->set("whocol", $this->request->data->whoCol);
    
            $this->ChessGame->ChessMove->set("whorow", $this->request->data->whoRow);
    
            $this->ChessGame->ChessMove->set("destcol", $this->request->data->destCol);
    		
    		$this->ChessGame->ChessMove->set("destrow", $this->request->data->destRow);
    
            if ($this->ChessGame->ChessMove->save()){
    
                return $this->MEW_TOOLS->phraseMEWResponce('ChessGameAdd', true);
            }
            
            return $this->MEW_TOOLS->phraseMEWResponce('ChessGameAdd', false);
        }

        return $this->MEW_TOOLS->phraseMEWResponce('ChessGameAdd', false);
        
    }


    function get_moves($game_id) {

        $this->autoRender = false;
		
		if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}

        $params = array(

            'conditions' => array(

                                'ChessMove.game_id' => $game_id,

								'ChessMove.move_id >' => $this->request->data->lastid

							), 

            'order' => array('ChessMove.move_id DESC'),

            'limit' => 1,

        );

        $result = $this->ChessGame->ChessMove->find('all', $params);

        return $this->MEW_TOOLS->phraseMEWResponce('ChessGameGetMoves', $result);



    }
    
    function get_games(){
        $this->autoRender = false;
		
		if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}
        
        $params = array(
        
            'contain' => array('User1', 'User2'),
            
            'order' => array('ChessGame.game_id DESC')
            
        );
        
        $result = $this->ChessGame->find('all', $params);
        
        return $this->MEW_TOOLS->phraseMEWResponce('ChessGameGetGames', $result);
    }

}