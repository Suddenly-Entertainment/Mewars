function stackSprite(x, y, z, sprite)

{

    return Crafty.e("2D, Canvas, " + sprite).attr({

        x : x,

        y : y,

        z : 10000 + z //Probably will have to adjust z

    });

}

Crafty.c("Piece",{

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
	
	
	makePiece : function(x, y, z, idx, idy, name){
		this.attr({
			x:$MEW.chessGame.getXAt(x,y),
			y:$MEW.chessGame.getYAt(x,y),
			type : parseInt((idx - idx%2)/2),
			pic : idx,
			sex: idy,
			row: y, 
			column: x,
			team:idx%2,
			name:name,
			moved:false
		});
		
		this.bodySprite = stackSprite(this.x, this.y + 32, 1, "Chessfix|" + this.pic + "|" + this.sex);
		if(this.sex>1){
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
			$MEW.chessGame.functions[0](target);
		});
		return this;
	},
	deactivate : function(){
		this.bodySprite.unbind("Click");
	},
	redraw : function(){
		//redraw me
		this.attr({
			x : $MEW.chessGame.getXAt(this.column, this.row),
			y : $MEW.chessGame.getYAt(this.column, this.row)
		});
		this.updateBody();
	}
}
);

Crafty.c("legalMove",{
	makeTile : function(posx, posy, t){
		this.attr({
			target_ : t,
			x : $MEW.chessGame.getXAt(posx,posy),
			y : $MEW.chessGame.getYAt(posx,posy),
			column : posx,
			row : posy
			});
		var light="Light";
		if((posx+posy)%2==1){light="Light";}else{light="Dark";}
		this.g = stackSprite(this.x, this.y, 1, "Highlight" + light + "|3");
		return this;
	},		
    changeTile : function (posx, posy, t){
        this.attr({					
            target : t,					
            block : $MEW.chessGame.board[posx][posy],			
            x : $MEW.chessGame.getXAt(posx,posy),			
            y : $MEW.chessGame.getYAt(posx,posy)	
        });		
        this.block.g.destroy();		
        this.block.g = this.block.addComponent($MEW.terrainSprite[this.block.id + "|" + (2+ 2*((posx+posy)%2))]);
        this.g = this.block.g;
    },
	addClick : function(){
		this.g.addComponent("Mouse");
		this.g.areaMap([0,80],[31,64],[32,64],[63,80],[32,96],[31,96]);
		var target = this;
		this.g.bind("Click",function(){
			$MEW.chessGame.functions[1](target);
		});
		return this;
	}
	

});

Crafty.c("networkHandler",{
	init : function(){
        
		return this;
	},
    
    set : function(who, dest){
        var onResult = function(result) { 
            console.log("RESULT: " + result);
            $MEW.chessGame.Network.get();
        };
        $MEW.Network.actionJSON("ChessGames", "add", 
                                {'pass' : [$MEW.chessGame.id], 
                                'post' : {whocol : who.column, whorow : who.row, destcol : dest.column, destrow : dest.row},       
                                'onSuccess' : onResult        
                                });          
    },
    
    upToDate : function(){
        var onResult = function(result){
           for(x=result.length;x>=0;x--){
               $MEW.chessGame.Network.setLocal(result[x].ChessMove);       
           }
            
        };
        
        $MEW.Network.actionJSON("ChessGames", "get",
                                {'pass' : [$MEW.chessGame.id],
                                'post' : {lastid : $MEW.chessGame.lastid},
                                'onSuccess' : onResult});
    },
    
    get : function(){
        var onResult = function(result){
    		$MEW.chessGame.Result = result;
            $MEW.chessGame.Network.setLocal(result[0].ChessMove);
        };
        
        $MEW.Network.actionJSON("ChessGames", "get",
                                {'pass' : [$MEW.chessGame.id],
                                'post' : {lastid : $MEW.chessGame.lastid},
                                'onSuccess' : onResult});
    },
    getLocal : function(){
		return $MEW.chessGame.playerArray;
	},
	setLocal : function(result){
        
        if($MEW.chessGame.playerArray[result.whocol][result.whorow] == "")return;
        
    	var who = $MEW.chessGame.playerArray[result.whocol][result.whorow];
		if($MEW.chessGame.playerArray[result.destcol][result.destrow] != ""){
				$MEW.chessGame.playerArray[result.destcol][result.destrow].bodySprite.destroy();
		}
			
		$MEW.chessGame.playerArray[result.whocol][result.whorow]= "";
		$MEW.chessGame.playerArray[result.destcol][result.destrow]=who;
		who.column=result.destcol;
		who.row=result.destrow;
        who.redraw();
        //$MEW.chessGame.lastid++;
		return this;
	}
});

