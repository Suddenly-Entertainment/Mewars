Crafty.c("NetworkSkirm", {
	init: function () {
		this.requires("Network");
	},
	
	GetskirmishmapData: function () {
		this.Send("SkirmcachesGetskirmishmap", "Skirmcaches", "getskirmishmap", 
			{
				'pass' : [$MEW.px, $MEW.py]
			}
		);
	}
});

Crafty.scene("Skirm", function() {
    console.log("Loaded Skirm Scene");
    
    // set viewport
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    
    //creake Network
    $MEW.Network = Crafty.e("NetworkSkirm");
    
    $MEW.cb = function(tile) {
        if (confirm("Return to world map?")) {
            Crafty.scene("Map");
        }
    };
    
    var onGetskirmishmapData = function(map) {
        $MEW.tilemap = Crafty.e("Tilemap").makeTilemap(map.width, map.height, map.data, $MEW.cb);
    };
    
    var onError = function(xhr, status, error) {
        $MEW.CTX.fillStyle = "#FFFFFF";
        $MEW.CTX.fillRect(0, 0, $MEW.WIDTH, $MEW.HEIGHT);
        $MEW.CTX.fillStyle = "#000000";
        $MEW.CTX.font = "14px sans-serif";
        var text = "";
        if (error == "Forbidden") {
            text = "Failed to load map data (403 Forbiddenn): Are you logged in?";
        }
        else if (error == "Not Found") {
            text = "Failed to load map data (404 Not Found): Files are missing on the webserver, contact the admin imediatly";
        }
        else {
            text = "Failed to load map data (" + error + "): Contact The admin to report this error";
        }
        var textWidth = $MEW.CTX.measureText(text).width;
        var x = ($MEW.WIDTH - textWidth) / 2;
        var y = ($MEW.HEIGHT - 14) / 2 - 14;
        $MEW.CTX.fillText(text, x, y, textWidth);
    };
    
    if ($MEW.px < 1) $MEW.px = 1;
    if ($MEW.px > 48) $MEW.px = 48;
    if ($MEW.py < 1) $MEW.py = 1;
    if ($MEW.py > 48) $MEW.py = 48;
    
    console.log("Skirm->X: " + $MEW.px + " Y:" + $MEW.py);
    
    //bind to the network
    $MEW.Network.bind("SkirmcachesGetskirmishmap", onGetskirmishmapData);
    $MEW.Network.bind("SkirmcachesGetskirmishmapError", onError);
    
    //get data
    $MEW.Network.GetskirmishmapData();
    
    //this will probably be split into two interfaces one for world map and one for skirmish
    //create interface
    $MEW.interface = Crafty.e("Interface").makeInterface(0, 500, 0);
    
    //turn scrolling on
    $MEW.toggleScrolling(1);
    
}, function() {
	// turn scrolling off
    $MEW.toggleScrolling(0);
});