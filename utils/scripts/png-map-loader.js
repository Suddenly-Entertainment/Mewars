exports.help = function() {
  console.log('This script generates a world map in the database ');
  console.log('  First argument: map name                        ');
  console.log('  Second argument: file name                      ');
  console.log('    - Must be a .png file                         ');
  console.log('    - Must be located in resources/Images/Maps    ');
};

exports.run = function(db, args) {
  var mapName = args[0];
  var fileName = args[1];
  
  //getting image
  var PNG = require('png-js');
  var image = new PNG.load('../resources/Images/Maps/' + fileName);
  
  //using rgba values
  image.decode(function (rgbaValues) {
    //first, convert to usable 2d array of pixels
    var pixelArray = getPixelArray(image.width, image.height, rgbaValues);
    
    //second, write to database
    writeToDb(db, mapName, pixelArray, getColorMapping());
  });
};

//configurable settings
var CHUNK_SIZE = 10;

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

//Takes in array of integers that are implicitly grouped in sets of four for
// each pixel. First value is red, then green, then blue, then alpha. This
// function returns a 2d array of integers with these four values merged. Red
// value occupies the highest 8 bits, then down in the same order to the alpha
// value.
getPixelArray = function(width, height, rgbaValues) {
  var pixelArray = [];
  for (var y = 0; y < height; y++) {
    pixelArray.push([]);
    for (var x = 0; x < width; x++) {
      var index = (((y * width) + x) * 4);
      var red = rgbaValues[index];
      var green = rgbaValues[index + 1];
      var blue = rgbaValues[index + 2];
      var alpha = rgbaValues[index + 3];
      pixelArray[y].push(getPixelValue(red, green, blue, alpha));
    }
  }
  return pixelArray;
};

//Merges red, green, blue, and alpha values of a pixel into one integer to
// allow for easier mapping to tile types
getPixelValue = function(red, green, blue, alpha) {
  return (
    (red   * 0x01000000)
  + (green * 0x00010000)
  + (blue  * 0x00000100)
  + (alpha * 0x00000001)
  );
};

//Returns a mapping of color values to the id of the tile type they represent
getColorMapping = function() {
  colorMapping = {};
  colorMapping[0x00FF00FF] = 0;    //grass
  colorMapping[0x00A080FF] = 1;    //everfree grass
  colorMapping[0xFFFF00FF] = 2;    //flowers
  colorMapping[0x808000FF] = 3;    //dirt
  colorMapping[0x400000FF] = 4;    //mud
  colorMapping[0x808040FF] = 5;    //barren
  colorMapping[0x000080FF] = 6;    //bridge
  colorMapping[0x404000FF] = 7;    //swamp
  colorMapping[0x00A000FF] = 8;    //bushes
  colorMapping[0x008000FF] = 9;    //forest
  colorMapping[0x008040FF] = 10;   //everfree forest
  colorMapping[0x804040FF] = 11;   //rocky
  colorMapping[0xC0C0C0FF] = 12;   //snow
  colorMapping[0x8080FFFF] = 13;   //ice
  colorMapping[0x0000FFFF] = 14;   //water
  colorMapping[0x000000FF] = 15;   //ravine
  colorMapping[0xFF8000FF] = 16;   //volcano
  colorMapping[0xFF00FFFF] = 17;   //mountain
  colorMapping[0xFF80FFFF] = 18;   //snow mountain
  colorMapping[0xA08050FF] = 19;   //desert 2
  colorMapping[0xFF0000FF] = 20;   //lava
  colorMapping[0xC8C864FF] = 21;   //quicksand
  colorMapping[0x8000FFFF] = 22;   //poison joke
  colorMapping[0x408000FF] = 23;   //apple trees
  colorMapping[0x800040FF] = 24;   //zap apple trees
  colorMapping[0xFF80B0FF] = 25;   //gemstones
  colorMapping[0xFFFFFFFF] = 26;   //diamonds
  colorMapping[0xFFA080FF] = 27;   //desert 1
  return colorMapping;
};

// ----------------------------------------------------------------------------
// Database Functions
// ----------------------------------------------------------------------------

//Writes data to database for map
writeToDb = function(db, mapName, pixels, colorMapping) {
  db.Map.find({where: {name: mapName}}).success(function(existingMap) {
    if (existingMap) {
      console.log('Map with name "' + mapName + '" already exists - exiting');
    } else {
      writeMap(db, mapName, pixels, colorMapping);
    }
  });
};

//Map level writing
writeMap = function(db, mapName, pixels, colorMapping) {
  db.Map.bulkCreate([
    { name: mapName}
  ], ['name']).success(function() {
    db.Map.find({where: {name: mapName}}).success(function(createdMap) {
      writeChunks(db, createdMap.id, pixels, colorMapping);
    });
  });
};

//Chunk level writing
writeChunks = function(db, mapId, pixels, colorMapping) {
  var width = pixels[0].length;
  var height = pixels.length;
  var mapChunks = [];
  for (var y = 0; y < height; y = y + CHUNK_SIZE) {
    for (var x = 0; x < width; x = x + CHUNK_SIZE) {
      mapChunks.push({MapId: mapId, x: x, y: y});
    }
  }
  db.MapChunk.bulkCreate(mapChunks, ['MapId', 'x', 'y']).success(function() {
    writeTiles(db, mapId, pixels, colorMapping);
  });
};

//Tile level writing
writeTiles = function(db, mapId, pixels, colorMapping) {
  var width = pixels[0].length;
  var height = pixels.length;
  var mapTiles = [];
  
  db.MapChunk.findAll({where: {MapId: mapId}}).success(function(chunks) {
    for (var i = 0; i < chunks.length; i++) {
      for (var y_offset = 0; y_offset < CHUNK_SIZE; y_offset++) {
        for (var x_offset = 0; x_offset < CHUNK_SIZE; x_offset++) {
          var x = chunks[i].x + x_offset;
          var y = chunks[i].y + y_offset;
          mapTiles.push({
            MapId: mapId,
            MapChunkId: chunks[i].id,
            x: x,
            y: y,
            terrain_type: colorMapping[pixels[y][x]]
          });
        }
      }
    }
    db.MapTile.bulkCreate(
      mapTiles,
      ['MapId', 'MapChunkId', 'x', 'y', 'terrain_type']
    ).success(function() {
      console.log('Map successfully written to database!');
    });
  });
};