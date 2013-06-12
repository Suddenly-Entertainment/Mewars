function stackSprite(x, y, z, sprite) {

    return Crafty.e("2D, Canvas, " + sprite).attr({

        x : x,

        y : y,

        z : 10000 + z //Probably will have to adjust z

    });

}

Crafty.c("ChessLogic",{	
	
	init : function(){
        
        this.Network = null;
        this.id = 0;
        this.lastid = 0;
        this.moves = [];
	
		this.attr({
			team1:[],
			team0:[],
			playerArray:[], // col x row
			board:[],
			turn:1,
			legalMoves:[],
			selection:"",
			overPieces:false
		});
	
		for (var x = 0; x < 8; x++) {
		    this.playerArray[x] = [];
		    this.board[x] = [];
		    for (var y = 0; y < 8; y++) {
		        this.playerArray[x][y] = "";
		        this.board[x][y] = "";
		    }
		}
		
		return this;
	},
    
    getAt: function (x, y) {
        return this.playerArray[x][y];
    },

    getXAt: function (col, row) {
        return this.board[col][row]._x;
    },

    getYAt: function (col, row) {
        return this.board[col][row]._y;
    },
    
    // function 0
	ShowMoves: function (target_) {
		console.log("Show moves started");
		this.destroyLegalChessMovesMarkers();
		var col = target_.column;
		var row = target_.row;
		switch (target_.type){
			case 0: // Pawn
				if (target_.moved) {
					if (target_.team == 0) {
						if (this.checkSquare(col + 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row, target_, this).addClick());
						if (this.checkSquare(col + 1, row - 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 1, target_, this).addClick());
						if (this.checkSquare(col + 1, row + 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 1, target_, this).addClick());	
					} else if (target_.team == 1) {
						if (this.checkSquare(col - 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row, target_, this).addClick());
						if (this.checkSquare(col - 1, row - 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 1, target_, this).addClick());
						if (this.checkSquare(col - 1, row + 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 1, target_, this).addClick());
					}
				} else {
					if (target_.team == 0) {
						if (this.checkSquare(col + 1, row - 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 1, target_, this).addClick());
						if (this.checkSquare(col + 1, row + 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 1, target_, this).addClick());
						for (c = 1; c < 3; c++) {
							if (this.checkSquare(col + c, row) == 0) {
							    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + c, row, target_, this).addClick() );
							} else {
							    break;
							}
						}
					} else if (target_.team == 1) {
						if (this.checkSquare(col - 1, row - 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 1, target_, this).addClick());
						if (this.checkSquare(col - 1, row + 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 1, target_, this).addClick());
						for(c = 1; c < 3; c++) {
							if (this.checkSquare(col - c, row) == 0) {
								this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - c, row, target_, this).addClick() );
							} else {
								break;
							}
						}
					}
				}
			break;
			case 1: // Rook
				this.allHoriz(target_);
			break;
			case 2: // knight
				if (target_.team == 0) {
					if (this.checkSquare(col + 1, row - 2) == 0 || this.checkSquare(col + 1, row - 2) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 2, target_, this).addClick());
					if (this.checkSquare(col + 1, row + 2) == 0 || this.checkSquare(col + 1, row + 2) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 2, target_, this).addClick());
					if (this.checkSquare(col - 1, row - 2) == 0 || this.checkSquare(col - 1, row - 2) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 2, target_, this).addClick());
					if (this.checkSquare(col - 1, row + 2) == 0 || this.checkSquare(col - 1, row + 2) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 2, target_, this).addClick());
					
					if (this.checkSquare(col + 2, row - 1) == 0 || this.checkSquare(col + 2, row - 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 2, row - 1, target_, this).addClick());
					if (this.checkSquare(col + 2, row + 1) == 0 || this.checkSquare(col + 2, row + 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 2, row + 1, target_, this).addClick());
					if (this.checkSquare(col - 2, row - 1) == 0 || this.checkSquare(col - 2, row - 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 2, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 2, row + 1) == 0 || this.checkSquare(col - 2, row + 1) == 2) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 2, row + 1, target_, this).addClick());
				}else if(target_.team == 1) {
					if (this.checkSquare(col + 1, row - 2) == 0 || this.checkSquare(col + 1, row - 2) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 2, target_, this).addClick());
					if (this.checkSquare(col + 1, row + 2) == 0 || this.checkSquare(col + 1, row + 2) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 2, target_, this).addClick());
					if (this.checkSquare(col - 1, row - 2) == 0 || this.checkSquare(col - 1, row - 2) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 2, target_, this).addClick());
					if (this.checkSquare(col - 1, row + 2) == 0 || this.checkSquare(col - 1, row + 2) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 2, target_, this).addClick());
					
					if (this.checkSquare(col + 2, row - 1) == 0 || this.checkSquare(col + 2, row - 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 2, row - 1, target_, this).addClick());
					if (this.checkSquare(col + 2, row + 1) == 0 || this.checkSquare(col + 2, row + 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 2, row + 1, target_, this).addClick());
					if (this.checkSquare(col - 2, row - 1) == 0 || this.checkSquare(col - 2, row - 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 2, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 2, row + 1) == 0 || this.checkSquare(col - 2, row + 1) == 1) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 2, row + 1, target_, this).addClick());
				}
			break;
			case 3: // Bishop
				this.allDiag(target_);
			break;
			case 4: // King
				if (target_.team == 0) {
					if (this.checkSquare(col + 1, row) == 2 || this.checkSquare(col + 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row, target_, this).addClick());
					if (this.checkSquare(col + 1, row - 1) == 2 || this.checkSquare(col + 1, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 1, target_, this).addClick());
					if (this.checkSquare(col, row - 1) == 2 || this.checkSquare(col, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 1, row - 1) == 2 || this.checkSquare(col - 1, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 1, row) == 2 || this.checkSquare(col - 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row, target_, this).addClick());
					if (this.checkSquare(col - 1, row + 1) == 2 || this.checkSquare(col - 1, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 1, target_, this).addClick());
					if (this.checkSquare(col, row + 1) == 2 || this.checkSquare(col, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + 1, target_, this).addClick());
					if (this.checkSquare(col + 1, row + 1) == 2 || this.checkSquare(col + 1, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 1, target_, this).addClick());
				} else if (target_.team == 1) {
					if (this.checkSquare(col + 1, row) == 1 || this.checkSquare(col + 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row, target_, this).addClick());
					if (this.checkSquare(col + 1, row - 1) == 1 || this.checkSquare(col + 1, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row - 1, target_, this).addClick());
					if (this.checkSquare(col, row - 1) == 1 || this.checkSquare(col, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 1, row - 1) == 1 || this.checkSquare(col - 1, row - 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row - 1, target_, this).addClick());
					if (this.checkSquare(col - 1, row) == 1 || this.checkSquare(col - 1, row) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row, target_, this).addClick());
					if (this.checkSquare(col - 1, row + 1) == 1 || this.checkSquare(col - 1, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - 1, row + 1, target_, this).addClick());
					if (this.checkSquare(col, row + 1) == 1 || this.checkSquare(col, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + 1, target_, this).addClick());
					if (this.checkSquare(col + 1, row + 1) == 1 || this.checkSquare(col + 1, row + 1) == 0) this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + 1, row + 1, target_, this).addClick());
				}
			break;
			case 5: // Queen
				this.allHoriz(target_);
				this.allDiag(target_);
			break;
		}
		
	},
	
	// function 1
    movePiece: function (dest) {
        var target_ = dest.target_;
        target_.moved = true;
        this.Network.set(target_, dest);
        this.destroyLegalChessMovesMarkers();
        beginTurn();
    },
	
    // function 2
	destroyLegalChessMovesMarkers: function () {
	    for (var item in this.legalMoves) {
	        this.legalMoves[item].g.destroy();
	    }
	    this.legalMoves = [];
	},
    
    allHoriz: function (target_) {
        var col = target_.column;
        var row = target_.row;
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col - x, row) == 2 || this.checkSquare(col - x, row) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - x, row, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row) == 1) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(co - x, row, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col - x, row) == 1 || this.checkSquare(col - x, row) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - x, row, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row) == 2) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col - x, row, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col + x, row) == 2 || this.checkSquare(col + x, row) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + x, row, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row) == 1) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + x, row, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col + x, row) == 1 || this.checkSquare(col + x, row) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + x, row, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row) == 2) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col + x, row, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col, row + x) == 2 || this.checkSquare(col, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col, row + x) == 1) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col, row + x) == 1 || this.checkSquare(col, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col, row + x) == 2) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row + x, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col, row - x) == 2 || this.checkSquare(col, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col, row - x) == 1) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col, row - x) == 1 || this.checkSquare(col, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col, row - x) == 2) {
                    this.legalMoves.push(Crafty.e("ChessLegalMove").makeTile(col, row - x, target_, this).addClick());
                    break;
                }
            }
        }
    },
    
    allDiag: function (target_) {
        var col = target_.column;
        var row = target_.row;
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col - x, row - x) == 2 || this.checkSquare(col - x, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row - x) == 1) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row - x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col - x, row - x) == 1 || this.checkSquare(col - x, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row - x) == 2) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row - x, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col + x, row + x) == 2 || this.checkSquare(col + x, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row + x) == 1) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row + x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col + x, row + x) == 1 || this.checkSquare(col + x, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row + x) == 2) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row + x, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col - x, row + x) == 2 || this.checkSquare(col - x, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row + x) == 1) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row + x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col - x, row + x) == 1 || this.checkSquare(col - x, row + x) == 3) {
                    break;
                }
                if (this.checkSquare(col - x, row + x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row + x, target_, this).addClick());
                }
                if (this.checkSquare(col - x, row + x) == 2) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col - x, row + x, target_, this).addClick());
                    break;
                }
            }
        }
        for (x = 1; x < 10; x++) {
            if (target_.team == 1) {
                if (this.checkSquare(col + x, row - x) == 2 || this.checkSquare(col + x, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row - x) == 1) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row - x, target_, this).addClick());
                    break;
                }
            }
            if (target_.team == 0) {
                if (this.checkSquare(col + x, row - x) == 1 || this.checkSquare(col + x, row - x) == 3) {
                    break;
                }
                if (this.checkSquare(col + x, row - x) == 0) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row - x, target_, this).addClick());
                }
                if (this.checkSquare(col + x, row - x) == 2) {
                    this.legalMoves.push(Crafty.e("legalMove").makeTile(col + x, row - x, target_, this).addClick());
                    break;
                }
            }
        }
    },
    
    zOrder: function () {
        var z = -9000;
        for (var item in $MEW.chessGame.playerArray) {
            for (x = 7; x >= 0; x--) {
                var p = $MEW.chessGame.playerArray[item][x];
                if (p == "") {
                    continue;
                }
                p.z = z;
                p.redraw();
                z++;
            }
        }
    },
    
    checkSquare: function (row, column) {
        if (row < 0 || row > 7 || column < 0 || column > 7) return 3;
        if (this.getAt(row, column) == "") {
            return 0;
        }
        return this.getAt(row, column).team + 1;
    },
     
    startGame: function () {
        this.beginTurn();
    },
    
    beginTurn: function () {
        // do layering()
        this.zOrder();
        var str = "team" + this.turn;
        for (var item in this[str]) {
            if (this[str][item] != "") this[str][item].deactivate();
        }
        $MEW.chessGame.turn = ($MEW.chessGame.turn == 1) ? 0 : 1;
        //msg=turn==1?"Black's Turn":"White's Turn";
        str = "team" + $MEW.chessGame.turn;
        for (var item in $MEW.chessGame[str]) {
            if (this[str][item] != "") this[str][item].activate();
        }
    },


});

Crafty.c("ChessBoard", {
    
    /**
     * Initialisation. Adds components, sets positions, creates the board
     */
    init: function() {
        this._x = 0;
        this._y = 0;
        this.chessGame = null;
        return this;
    },
    /**
     * Set up the chess board.
     * create the board tiles and the chess pieces
     */
    _setupChessBoard: function(ox, oy) {
        var width = 64;
        var height = 32;
    	var z = -10000;
    	var id1 = 3;
    	var id2 = 0;
    	// 12&4  19&27  13&20  3&0  1&7
    	var id = id1;
    	var piece = 1;
    	
    	var whoseTurn = 0;
        for (i = 0; i < 8; i++) {
            id = id == id1 ? id2 : id1;

            for (j = 7; j >= 0; j--) {
                id = id == id1 ? id2 : id1;

                var x = ((j * width / 2) + (i * width / 2)) + ox;
                var y = ((i * height / 2) - (j * height / 2)) + oy;
                var newTile = Crafty.e("Tile").makeChess(x, y, z, i, j, id);
                this.chessGame.board[i][j] = newTile;
                whoseTurn = 0;
                var piece = "";
                if (i == 0) {
                    if (j == 0 || j == 7) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 2, 1, "RookWhite" + (i + j), this.chessGame);
                    } else if (j == 1 || j == 6) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 4, 1, "KnightWhite" + (i + j), this.chessGame);
                    } else if (j == 2 || j == 5) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 6, 1, "BishopWhite" + (i + j), this.chessGame);
                    } else if (j == 4) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 10, 1, "QueenWhite", this.chessGame);
                    } else if (j == 3) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 8, 1, "KingWhite", this.chessGame);
                    }
                } else if (i == 1) {
                    piece = Crafty.e("ChessPiece").makePiece(i, j, z, 0, 0, "PawnWhite" + j, this.chessGame);
                }
                whoseTurn = 1;
                if (i == 7) {
                    if (j == 0 || j == 7) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 3, 3, "RookBlack" + (i + j), this.chessGame);
                    } else if (j == 1 || j == 6) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 5, 3, "KnightBlack" + (i + j), this.chessGame);
                    } else if (j == 2 || j == 5) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 7, 3, "BishopBlack" + (i + j), this.chessGame);
                    } else if (j == 4) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 11, 3, "QueenBlack", this.chessGame);
                    } else if (j == 3) {
                        piece = Crafty.e("ChessPiece").makePiece(i, j, z, 9, 3, "KingBlack", this.chessGame);
                    }
                } else if (i == 6) {
                    piece = Crafty.e("ChessPiece").makePiece(i, j, z, 1, 2, "PawnBlack" + j, this.chessGame);
                }
                this.chessGame.playerArray[i][j] = piece;
                if (piece.team == 0) this.chessGame.team0.push(piece);
                else this.chessGame.team1.push(piece);
                z++;
            }


        }
    },
    /**
     * Make the chess board.
     * set the data and creat the board
     */
    makeChessBoard: function(x, y, id) {
        this._x = x;
        this._x = y;
        this.chessGame = Crafty.e("ChessLogic").init();
        this.chessGame.Network = Crafty.e("ChessNetworkHandler");
        this.chessGame.Network.game = this.chessGame;
        this.chessGame.id = id;
  
        this._setupChessBoard(x, y);
        return this;
    },
    
});

Crafty.c("ChessPiece",{

    init : function() {

        this.addComponent("2D, Canvas");
    
    },


    updateBody : function() {

        this.bodySprite.destroy();

        this.bodySprite = stackSprite(this.x, this.y + 32, 1, "Chessfix|" + this.pic + "|" + this.sex);
		this.bodySprite.addComponent("Mouse");
		if(this.sex>1){
			this.bodySprite.flip("X");
		}

    },
	
	getStyle : function(){
	
		return this.name + "|" + this.type + "|" + this.sex + "|" + this.team;
	
	},
	
	
	makePiece : function(x, y, z, idx, idy, name, board){
		this.attr({
		    board: board,
		    x: board.getXAt(x, y),
		    y: board.getYAt(x, y),
		    type: parseInt((idx - idx % 2) / 2),
		    pic: idx,
		    sex: idy,
		    row: y,
		    column: x,
		    team: idx % 2,
		    name: name,
		    moved: false
		});
		
		this.bodySprite = stackSprite(this.x, this.y + 32, 1, "Chessfix|" + this.pic + "|" + this.sex);
		if (this.sex > 1) {
		    this.bodySprite.flip("X");
		}
		this.bodySprite.addComponent("Mouse");
		return this;
	},
    
	activate : function(){
		this.bodySprite.areaMap([0,16],[16,0],[48,0],[64,16],[64,48],[48,64],[0,48]);
		var target = this;
		this.bodySprite.bind("Click",function(){
			console.log(target.getStyle());
			this.board.ShowMoves(target);
		});
		return this;
	},
    
	deactivate : function(){
		this.bodySprite.unbind("Click");
	},
    
	redraw : function(){
		//redraw me
		this.attr({
			x : this.board.getXAt(this.column, this.row),
			y : this.board.getYAt(this.column, this.row)
		});
		this.updateBody();
	}
});

Crafty.c("ChessLegalMove",{
	makeTile : function(posx, posy, t, board){
		this.attr({
		    target_: t,
            board: board,
		    x: board.getXAt(posx, posy),
		    y: board.getYAt(posx, posy),
		    column: posx,
		    row: posy
		});
		var light = "Light";
		if ((posx + posy) % 2 == 1) {
		    light = "Light";
		} else {
		    light = "Dark";
		}
		this.g = stackSprite(this.x, this.y, 1, "Highlight" + light + "|3");
		return this;
	},		
    changeTile : function (posx, posy, t){
        this.attr({
            target: t,
            block: this.board.board[posx][posy],
            x: this.board.getXAt(posx, posy),
            y: this.board.getYAt(posx, posy)
        });
        this.block.g.destroy();
        this.block.g = this.block.addComponent($MEW.terrainSprite[this.block.id + "|" + (2 + 2 * ((posx + posy) % 2))]);
        this.g = this.block.g;
    },
	addClick : function(){
		this.g.addComponent("Mouse");
		this.g.areaMap([0, 80], [31, 64], [32, 64], [63, 80], [32, 96], [31, 96]);
		var target = this;
		this.g.bind("Click", function () {
		    this.board.movePiece(target);
		});
		return this;
	}

});

Crafty.c("ChessNetworkHandler",{
	init : function(){
        this.requires("Network");
        this.game = null;
	},
    
    set : function(who, dest){
        var that = this
        var onReturn = function(result) { 
            console.log("RESULT: " + result);
            that.game.Network.get_moves();
        };
        
        $MEW.Network.bind("ChessGameAdd", onReturn);
        
        this.Send("ChessGameAdd", "ChessGames", "add", 
            {
                'pass' : [this.game.id], 
                'post' : {
                    whocol : who.column, 
                    whorow : who.row, 
                    destcol : dest.column, 
                    destrow : dest.row
                },       
            }
        );          
    },
    
    get_moves : function() {
        var that = this
        var onReturn = function(result) {
            console.log("GET_Moves:", result);
            for(var x = result.length; x >= 0; x--){
                that.game.Network.setLocal(result[x].ChessMove);       
            }
            
        };
        
        $MEW.Network.bind("ChessGameGetMoves", onReturn);
        
        this.Send("ChessGameGetMoves", "ChessGames", "get",
            {
                'pass' : [this.game.id],
                'post' : {lastid : $MEW.chessGame.lastid},
            }
        );
    },
    
    getLocal : function() {
		return this.game.playerArray;
	},
    
	setLocal : function(result) {
        
        if ($MEW.chessGame.playerArray[result.whocol][result.whorow] == "") return;
        
    	var who = $MEW.chessGame.playerArray[result.whocol][result.whorow];
		if ($MEW.chessGame.playerArray[result.destcol][result.destrow] != "") {
		    $MEW.chessGame.playerArray[result.destcol][result.destrow].bodySprite.destroy();
		}
			
		this.game.playerArray[result.whocol][result.whorow] = "";
		this.game.playerArray[result.destcol][result.destrow] = who;
		who.column = result.destcol;
		who.row = result.destrow;
        who.redraw();
        this.game.lastid = result.move_num;
		return this;
	}
});

