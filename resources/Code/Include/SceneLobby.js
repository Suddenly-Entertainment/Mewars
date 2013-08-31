$MEW.Lobby = {
    
	rooms: [],
	
}

Crafty.c("LobbyBar", {
	init: function() {
		this.addComponent("2D, DOM, Color");
	},
	
	makeBar: function(x, y, method) {
		this.attr({
			x : x,
			y : y,
			z : this.z + 1,
			w : 540,
			h : 60
		});
		
		
        this.color("#000000");
		
		this.room = Crafty.e("2D, DOM, Text");
		this.room.attr({
			x : x - 20,
			y : y + 15,
			z : this.z + 1,
			w : 250,
			h : 30 
		});
		this.room.text("Room 1");
		this.room.textFont({size: '18px', weight: 'bold', family: 'Times New Roman'});
		this.room.textColor("#FFFFFF");
		
		this.host = Crafty.e("2D, DOM, Text");
        this.host.attr({
            x : x + 150,
            y : y  + 15,
            z : this.z + 1,
            w : 100,
            h : 30
        });
		this.host.text("Host 1");
		this.host.textFont({size: '12px', family: 'Times New Roman'});
		this.host.textColor("#FFFFFF");
		
        this.join = Crafty.e("2D, DOM, Mouse, Text, Color");
        this.join.attr({
            x : x + 300,
            y : y + 15,
            z : this.z + 1,
            w : 100,
            h : 30
            
        });
        this.join.color("#FFFFFF");
        this.join.bind("Click", method(this));
        this.join.text("Join");
        this.join.text.y == this.join.y + 10;
        this.join.textFont({size: '14px', family: 'Times New Roman'});
        this.join.textColor('#000000');
        
		return this;
	}
}
);

Crafty.scene("Lobby", function() {
	  console.log("Lobby scene Loaded");
    $MEW.ResetScene()
    $MEW.ResetNetwork()
	
	  $MEW.Lobby.rooms.push(Crafty.e("LobbyBar").makeBar(0, 0, function(bar){
        console.log("Joined " + bar.host.text + " in " + bar.room.text);}));
}
);