Crafty.c("NetworkMap", {
	init: function () {
		this.requires("Network");
	},
	
	GetFullMapData: function () {
		this.Send("MapsGetfullmap", "Maps", "getfullmap", {});
	}
})




Crafty.scene("Map", function () {
    console.log("Loaded Map Scene");
    
    // Set viewport
    $MEW.Global.mapViewportX = $MEW.Global.mapViewportX || 0;
    $MEW.Global.mapViewportY = $MEW.Global.mapViewportY || 0;
    Crafty.viewport.x = $MEW.Global.mapViewportX;
    Crafty.viewport.y = $MEW.Global.mapViewportY;
    
    //create network
    $MEW.Network = Crafty.e("NetworkMap");
    
    $MEW.cb = function (tile) {
        $MEW.px = tile.posX;
        $MEW.py = tile.posY;
        Crafty.scene("Skirm");
    };
    
    var onGetFullMapData = function (map) {
        $MEW.tilemap = Crafty.e("Tilemap").makeTilemap(map.width, map.height, map.data, $MEW.cb);
        console.log("Tilemap Created")
    };
    
    var onError = function (xhr, status, error) {
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
    
    
    
    //this will probably be split into two interfaces one for world map and one for skirmish
    $MEW.interface = Crafty.e("Interface").makeInterface(0 - Crafty.viewport._x, 500 - Crafty.viewport._y, 0);
    
    //turn scrolling on
    $MEW.toggleScrolling(1);
    
    // bind to network
    $MEW.Network.bind("MapsGetfullmap", onGetFullMapData);
    $MEW.Network.bind("MapsGetfullmapError", onError);
    $MEW.Network.GetFullMapData();
    
}, function () {
    $MEW.toggleScrolling(0);
    $MEW.Global.mapViewportX = Crafty.viewport._x;
    $MEW.Global.mapViewportY = Crafty.viewport._y;
}); 
//@ sourceURL=/Game/SceneMap.js