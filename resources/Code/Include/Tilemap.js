Crafty.c("Tile", {
    /**
     * Initialisation. Adds components, sets positions, binds mouse click handler
     */
    init: function() {
        this.addComponent("2D, Canvas, Mouse");
    },
    /**
     * Convenience method for creating new boxes
     * @param x position on the x axis
     * @param y position on the y axis
     * @param color background color
     * @param onClickCallback a callback function that is called for mouse click events
     */
    makeTile: function(x, y, z, px, py, id, cb) {
        //console.log(x, y, z, id, $MEW.SkermishTerrainSprites[id]);
        this.addComponent($MEW.SkermishTerrainSprites[id]);
        this.attr({
            x: x,
            y: y,
            z: z,
            posX: px,
            posY: py
        });
        this.bind("DoubleClick", function() {
            cb(this)
        });
        this.areaMap([31, 127], [0, 111], [0, 80], [31, 64], [32, 64], [63, 80], [63, 111], [32, 127]);
        this.trigger("Change");
        return this;
    },

    makeChess: function(x, y, z, px, py, id) {

        this.addComponent($MEW.SkermishTerrainSprites[id]);
        this.attr({
            x: x,
            y: y,
            z: z,
            column: px,
            row: py
        });

        return this;
    }
});

Crafty.c("Tilemap", {
    /**
     * Initialisation. Adds components, sets positions, creates the board
     */
    init: function() {
        this._data = [];
        this._data[0] = [];
        this._width = 0;
        this._height = 0;
        this._tiles = [];
    },
    /**
     * Set up the tilemap.
     * The tilemap is an Array of rows, which again is an Array of tiles.
     */
    _setupTilemap: function(cb) {
        this._tiles = [];
        var tile_width = 64;
        var tile_height = 32;
        var z = 0;
        for (i = 0; i < this._width; i++) {
            this._tiles[i] = [];
            for (j = this._height - 1; j >= 0; j--) { // Changed loop condition here.
                var id = this._data[i][j];
                var x = (j * tile_width / 2) + (i * tile_width / 2);
                var y = (i * tile_height / 2) - (j * tile_height / 2);
                var newTile = Crafty.e("Tile").makeTile(x, y, z, i, j, id, cb);
                this._tiles[i][j] = newTile;
                z++;
            }
        }
    },
    /**
     * Make the Tilemap.
     * set the data for the tile map and set it up the tile map
     */
    makeTilemap: function(width, height, data, cb) {
        this._width = width;
        this._height = height;
        this._data = data;
        this._setupTilemap(cb);
    },
    
    /**
     * Make empty tile map to merge chunks into later
     */
    makeEmptyTilemap: function(width, height) {
      this._width = width;
      this._height = height;
      this._tiles = [];
      for (i = 0; i < this._width; i++) {
        this._tiles[i] = [];
      }
    },
    
    /**
     * Merge new tiles into map
     */
    addTilesToMap: function(width, height, chunk_x, chunk_y, data, cb) {
      var tile_width = 64;
      var tile_height = 32;
      for (i = chunk_x; i < chunk_x + width; i++) {
        for (j = chunk_y; j < chunk_y + height; j++) {
          var id = data[i - chunk_x][j - chunk_y];
          var x = (j * tile_width / 2) + (i * tile_width / 2);
          var y = (j * tile_height / 2) - (i * tile_height / 2);
          var newTile = Crafty.e("Tile").makeTile(x, y, (j * this._width) - i, i, j, id, cb);
          this._tiles[i][j] = newTile;
        }
      }
    }
});