Crafty.c("NetworkMap", {
	init: function () {
		this.requires("Network");
	},
  
  GetMapChunkData: function(map_id, x, y) {
    this.Send("MapsGetChunk", { map_id: map_id, x: x, y: y });
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
  
  var onGetMapChunkData = function (chunk) {
    $MEW.tilemap.addTilesToMap(chunk.width, chunk.height, chunk.chunk_x, chunk.chunk_y, chunk.data, $MEW.cb);
    console.log("Chunk Loaded (x: " + chunk.chunk_x + ", y: " + chunk.chunk_y + ")");
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
  
  //turn scrolling and chunk loading on
  $MEW.toggleScrolling(1);
  $MEW.toggleChunkLoading(1);
  
  // bind to network
  $MEW.tilemap = Crafty.e("Tilemap");
  $MEW.tilemap.makeEmptyTilemap(1000, 1000);
  $MEW.Network.bind("MapsGetChunk", onGetMapChunkData);
  $MEW.Network.GetMapChunkData(1, 0, 0);  
}, function () {
  $MEW.toggleScrolling(0);
  $MEW.toggleChunkLoading(0);
  $MEW.Global.mapViewportX = Crafty.viewport._x;
  $MEW.Global.mapViewportY = Crafty.viewport._y;
}); 

$MEW.toggleChunkLoading = function(action) {
  var chunkLoad = function() {
    tile_width = 64;
    tile_height = 32;
    x = Crafty.viewport.x;
    y = Crafty.viewport.y;
    tile_x = Math.round((x / tile_width) - (y / tile_height));
    tile_y = Math.round((x / tile_width) + (y / tile_height));
    //adjustments - above logic should match tilemap logic, but doesn't quite match up with viewport
    tile_x *= -1;
    tile_y -= 11;
    tile_y *= -1;
    if (!$MEW.tilemap._tiles[tile_x][tile_y]) {
      $MEW.Network.GetMapChunkData(1, tile_x, tile_y);
    }
  };
  
  if (action == 1) {
      Crafty.addEvent(this, Crafty.stage.elem, "mouseup", chunkLoad);
  } else {
      Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", chunkLoad);
  }
}