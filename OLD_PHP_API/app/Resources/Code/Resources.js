function doLoad(progress_cb, ImageURLS) {
	Crafty.load(ImageURLS,
		function() {
			//when loaded
			console.log("Loaded Resources");
			$MEW.SetUpResources();
			Crafty.scene("User"); //go to main scene
		},
	
		function(e) {
		  //progress
		  progress_cb(e.percent / 100.0)
		},
	
		function(e) {
		  //uh oh, error loading
		  console.log("Error Loading resources:");
		  console.log(e);
		  doLoad(progress_cb, ImageURLS);
		}
	);
}

$MEW.LoadResources = function (progress_cb){
	var TileImageNames = ['apple_trees_block.png', 'desert_2_block.png', 'everfree_forest_block.png', 'forest_block.png', 'ice_block.png', 
						  'mud_block.png', 'rocky_block.png', 'swamp_block.png', 'zap_apple_tree_block.png', 'bushes_block.png', 'diamonds_block.png',
						  'everfree_grass_block.png', 'gemstone_block.png', 'lava_block.png', 'poison_joke_block.png', 'snow_block.png', 
						  'volcano_block.png', 'desert_1_block.png', 'dirt_block.png', 'flower_block.png', 'grass_block.png', 
						  'mountain_block.png', 'quicksand_block.png', 'snow_mountain_block.png',  'water_block.png', 'ravine.png', 'barren.png'];
			  
	var SpriteImageNames = ['ARMOROPT.PNG', 'COLOURS.PNG', 'COLOURSBLACK.png', 'EYES.png', 'HAIRFEM.png',
							'HAIRMALE.png', 'HATS.PNG', 'HORNS.PNG', 'TAILSFEM.png', 'TAILSMALE.png', 'WEAPONS.PNG', 'Wingsback.png',
                            'Wingsfront.png',"Chessfix.png","snow_block3.png","snow_block2.png"];
                            
    var ImageNames = ['world_map_concept_mysticalpha-800.jpg', 'silouhetteavatar.png'];
	
	var TileResourceURL = $MEW.URL + "/resource/image/0/";
	var SpriteResourceURL = $MEW.URL + "/resource/image/1/";
    var ImageResourceURL = $MEW.URL + "/resource/image/2/";
	
	var ImageURLS = [];
	for (var key in TileImageNames){
		ImageURLS.push(TileResourceURL + TileImageNames[key]);
	}
	for (key in SpriteImageNames) {
		ImageURLS.push(SpriteResourceURL + SpriteImageNames[key]);
	}
    for (key in ImageNames) {
        ImageURLS.push(ImageResourceURL + ImageNames[key]);
    }

	// alright lets load our resources and switch scenes to the Main scene
	doLoad(progress_cb, ImageURLS);
}


$MEW.SetUpResources = function (){
	console.log("Setting up Resources");
	var TileResourceURL = $MEW.URL + "/resource/image/0/";
	//Set up sprites                   
	Crafty.sprite(64, 128, TileResourceURL + 'apple_trees_block.png', {AppleTreesSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'zap_apple_tree_block.png', {ZapAppleTreeSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'everfree_forest_block.png', {EverfreeForestSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'forest_block.png', {ForestSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'bushes_block.png', {BushesSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'poison_joke_block.png', {PoisonJokeSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'volcano_block.png', {VolcanoSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'mountain_block.png', {MountainSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'snow_mountain_block.png', {SnowMountainSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'desert_1_block.png', {Desert1Sprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'desert_2_block.png', {Desert2Sprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'ice_block.png', {IceSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'mud_block.png', {MudSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'rocky_block.png', {RockySprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'swamp_block.png', {SwampSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'gemstone_block.png', {GemstoneSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'lava_block.png', {LavaSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'snow_block.png', {SnowSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'dirt_block.png', {DirtSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'water_block.png', {WaterSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'quicksand_block.png', {QuicksandSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'grass_block.png', {GrassSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'everfree_grass_block.png', {EverfreeGrassSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'diamonds_block.png', {DiamondsSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'flower_block.png', {FlowerSprite: [0, 0]});
	Crafty.sprite(64, 128, TileResourceURL + 'ravine.png', {RavineSprite: [0,0]});
	Crafty.sprite(64, 128, TileResourceURL + 'barren.png', {BarrenSprite: [0,0]});
	
	// Map terain IDS to sprite components
	
	$MEW.SkermishTerrainSprites = {
		0: "GrassSprite",   //grass
		1: "EverfreeGrassSprite", //everfree grass
		2: "FlowerSprite", //flowers
		3: "DirtSprite",   //dry dirt
		4: "MudSprite",   //wet dirt
		5: "BarrenSprite", //barren
		6: "BridgeSprite", //bridge
		7: "SwampSprite",   //swamp
		8: "BushesSprite", //bushes
		9: "ForestSprite",   //trees
		10: "EverfreeForestSprite", //everfree forest
		11: "RockySprite",   //rocky
		12: "SnowSprite",   //snow
		13: "IceSprite",   //ice
		14: "WaterSprite",   //water
		15: "RavineSprite", //ravine
		16: "VolcanoSprite", //volcano
		17: "MountainSprite", //mountains
		18: "SnowMountainSprite", //snowy mountains
		19: "Desert2Sprite", //desert
		20: "LavaSprite", //lava
		21: "QuicksandSprite",  //quicksand
		22: "PoisonJokeSprite",  //poison joke
		23: "AppleTreesSprite", //apple trees
		24: "ZapAppleTreesSprite", //zap apples
		25: "GemstoneSprite", //gems
		26: "DiamondsSprite", //DIAMONDS!
		27: "Desert1Sprite" // desert
	};
	
	// pull sprite locations from images
	
	var SpriteResourceURL = $MEW.URL + "/resource/image/1/";
	
	$MEW.PonyPartSprites = {};
	
	//uses for sprite height
	var ch = 0;
	//used for sprite width
	var cw = 0;
	// will be used for building the key format
	var key = "";
	
	// ARMOROPT.PNG
	var image =  Crafty.assets[SpriteResourceURL + 'ARMOROPT.PNG'];
	ch = image.height / 8;
	cw = image.width / 32;
	$MEW.PonyPartSprites["Armor|0|0|0"] = [SpriteResourceURL + 'ARMOROPT.PNG', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Armor|1|0|0"] = [SpriteResourceURL + 'ARMOROPT.PNG', 0, 1, cw, ch]
	for (y = 0; y < 8; y++) {
		for (x = 1; x < 32; x++) {
			key  = "Armor|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'ARMOROPT.PNG', x, y, cw, ch]
		}
	}			
	// COLOURS.PNG
	var image = Crafty.assets[SpriteResourceURL + 'COLOURS.PNG'];
	ch = image.height / 4;
	cw = image.width / 50;
	for (y = 0; y < 2; y++) {
		for (x = 0; x < 50; x++) {
			key  = "Body|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'COLOURS.PNG', x, y, cw, ch]
		}
	}
	
	// EYES.png
	var image = Crafty.assets[SpriteResourceURL + 'EYES.png'];
	ch = image.height / 8;
	cw = image.width / 10;
	for (y = 0; y < 8; y++) {
		for (x = 0; x < 10; x++) {
			key  = "Eyes|" + (y % 2) + "|" + (x + Math.floor(y / 2) * 10);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'EYES.png', x, y, cw, ch]
		}
	}
	
	// HAIRMALE.png
	var image = Crafty.assets[SpriteResourceURL + 'HAIRMALE.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|0|0|0"] = [SpriteResourceURL + 'HAIRMALE.png', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|1"] = [SpriteResourceURL + 'HAIRMALE.png', 1, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|2"] = [SpriteResourceURL + 'HAIRMALE.png', 2, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|3"] = [SpriteResourceURL + 'HAIRMALE.png', 3, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|4"] = [SpriteResourceURL + 'HAIRMALE.png', 4, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|5"] = [SpriteResourceURL + 'HAIRMALE.png', 5, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|6"] = [SpriteResourceURL + 'HAIRMALE.png', 6, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|7"] = [SpriteResourceURL + 'HAIRMALE.png', 7, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|8"] = [SpriteResourceURL + 'HAIRMALE.png', 8, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|9"] = [SpriteResourceURL + 'HAIRMALE.png', 9, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|0|0|10"] = [SpriteResourceURL + 'HAIRMALE.png', 10, 0, cw, ch]
	var colorOffset = 10;
	for (y = 1; y < 24; y++) {
		for (x = 0; x < 28; x++) {
			key  = "Mane|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRMALE.png', x, y, cw, ch]
		}
	}
	
	// HAIRFEM.png
	var image = Crafty.assets[SpriteResourceURL + 'HAIRFEM.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|1|0|0"] = [SpriteResourceURL + 'HAIRFEM.png', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|1"] = [SpriteResourceURL + 'HAIRFEM.png', 1, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|2"] = [SpriteResourceURL + 'HAIRFEM.png', 2, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|3"] = [SpriteResourceURL + 'HAIRFEM.png', 3, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|4"] = [SpriteResourceURL + 'HAIRFEM.png', 4, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|5"] = [SpriteResourceURL + 'HAIRFEM.png', 5, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|6"] = [SpriteResourceURL + 'HAIRFEM.png', 6, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|7"] = [SpriteResourceURL + 'HAIRFEM.png', 7, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|8"] = [SpriteResourceURL + 'HAIRFEM.png', 8, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|9"] = [SpriteResourceURL + 'HAIRFEM.png', 9, 0, cw, ch]
	$MEW.PonyPartSprites["Mane|1|0|10"] = [SpriteResourceURL + 'HAIRFEM.png', 10, 0, cw, ch]
	var colorOffset = 10;
	for (y = 1; y < 24; y++) {
		for (x = 0; x < 28; x++) {
			key  = "Mane|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRFEM.png', x, y, cw, ch]
		}
	}
	
	// HATS.PNG
	var image =  Crafty.assets[SpriteResourceURL + 'HATS.PNG'];
	ch = image.height / 8;
	cw = image.width / 32;
	$MEW.PonyPartSprites["Hat|0|0|0"] = [SpriteResourceURL + 'HATS.PNG', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Hat|1|0|0"] = [SpriteResourceURL + 'HATS.PNG', 0, 1, cw, ch]
	for (y = 0; y < 8; y++) {
		for (x = 1; x < 32; x++) {
			key  = "Hat|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HATS.PNG', x, y, cw, ch]
		}
	}

    // HORNS.PNG
	var image =  Crafty.assets[SpriteResourceURL + 'HORNS.PNG'];
	ch = image.height / 2;
	cw = image.width / 50;
	for (y = 0; y < 2; y++) {
		for (x = 0; x < 56; x++) {
			key  = "Horn|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HORNS.PNG', x, y, cw, ch]
		}
	}
	
	// TAILSMALE.png
	var image = Crafty.assets[SpriteResourceURL + 'TAILSMALE.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|0|0|0"] = [SpriteResourceURL + 'TAILSMALE.png', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|1"] = [SpriteResourceURL + 'TAILSMALE.png', 1, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|2"] = [SpriteResourceURL + 'TAILSMALE.png', 2, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|3"] = [SpriteResourceURL + 'TAILSMALE.png', 3, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|4"] = [SpriteResourceURL + 'TAILSMALE.png', 4, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|5"] = [SpriteResourceURL + 'TAILSMALE.png', 5, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|6"] = [SpriteResourceURL + 'TAILSMALE.png', 6, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|7"] = [SpriteResourceURL + 'TAILSMALE.png', 7, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|8"] = [SpriteResourceURL + 'TAILSMALE.png', 8, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|9"] = [SpriteResourceURL + 'TAILSMALE.png', 9, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|0|0|10"] = [SpriteResourceURL + 'TAILSMALE.png', 10, 0, cw, ch]
	var colorOffset = 10;
	for (y = 1; y < 24; y++) {
		for (x = 0; x < 26; x++) {
			key  = "Tail|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'TAILSMALE.png', x, y, cw, ch]
		}
	}
	
	//TAILSFEM.png
	var image = Crafty.assets[SpriteResourceURL + 'TAILSFEM.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|1|0|0"] = [SpriteResourceURL + 'TAILSFEM.png', 0, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|1"] = [SpriteResourceURL + 'TAILSFEM.png', 1, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|2"] = [SpriteResourceURL + 'TAILSFEM.png', 2, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|3"] = [SpriteResourceURL + 'TAILSFEM.png', 3, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|4"] = [SpriteResourceURL + 'TAILSFEM.png', 4, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|5"] = [SpriteResourceURL + 'TAILSFEM.png', 5, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|6"] = [SpriteResourceURL + 'TAILSFEM.png', 6, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|7"] = [SpriteResourceURL + 'TAILSFEM.png', 7, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|8"] = [SpriteResourceURL + 'TAILSFEM.png', 8, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|9"] = [SpriteResourceURL + 'TAILSFEM.png', 9, 0, cw, ch]
	$MEW.PonyPartSprites["Tail|1|0|10"] = [SpriteResourceURL + 'TAILSFEM.png', 10, 0, cw, ch]
	var colorOffset = 10;
	for (y = 1; y < 24; y++) {
		for (x = 0; x < 26; x++) {
			key  = "Tail|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'TAILSFEM.png', x, y, cw, ch]
		}
	}
	
	// WEAPONS.PNG
	var image = Crafty.assets[SpriteResourceURL + 'WEAPONS.PNG'];
	ch = image.height / 2;
	cw = image.width / 17;
	for (y = 0; y < 2; y++) {
		for (x = 0; x < 17; x++) {
			key  = "Weapon|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'WEAPONS.PNG', x, y, cw, ch]
		}
	}
	
	// Wingsfront.png
	var image = Crafty.assets[SpriteResourceURL + 'Wingsfront.png'];
	ch = image.height / 4;
	cw = image.width / 51;
	for (y = 0; y < 4; y++) {
		for (x = 0; x < 51; x++) {
			key  = "WingsFront|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Wingsfront.png', x, y, cw, ch]
		}
	}
	
	// Wingsback.png
	var image = Crafty.assets[SpriteResourceURL + 'Wingsback.png'];
	ch = image.height / 2;
	cw = image.width / 51;
	for (y = 0; y < 2; y++) {
		for (x = 0; x < 51; x++) {
			key  = "WingsBack|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Wingsback.png', x, y, cw, ch]
		}
	}
	
	// Chessfix.png
	var image = Crafty.assets[SpriteResourceURL + 'Chessfix.png'];
	ch = image.height / 4;
	cw = image.width / 12;
	for (y = 0; y < 4; y++) {
		for (x = 0; x < 12; x++) {
			key  = "Chessfix|" + x + "|" + y;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Chessfix.png', x, y, cw, ch]
		}
	}
	
	// highlights 1
	var image = Crafty.assets[SpriteResourceURL + 'snow_block2.png'];
	ch = image.height;
	cw = image.width / 4;
		for (x = 0; x < 4; x++) {
			key  = "HighlightLight|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'snow_block2.png', x, 0, cw, ch]
		}
		
	// highlights 2
	var image = Crafty.assets[SpriteResourceURL + 'snow_block3.png'];
	ch = image.height;
	cw = image.width / 4;
		for (x = 0; x < 4; x++) {
			key  = "HighlightDark|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'snow_block3.png', x, 0, cw, ch]
		}

    for (key in $MEW.PonyPartSprites) {
        var map = {};
        map[key] = [$MEW.PonyPartSprites[key][1], $MEW.PonyPartSprites[key][2]];
        Crafty.sprite($MEW.PonyPartSprites[key][3], $MEW.PonyPartSprites[key][4], $MEW.PonyPartSprites[key][0], map);
    }
    
    
    // create sprites for interface images
    var ImageResourceURL = $MEW.URL + "/resource/image/2/";
    
    Crafty.sprite(800, 600, ImageResourceURL + 'world_map_concept_mysticalpha-800.jpg', {WorldMapConcept: [0, 0]});

	// we're done
    console.log("Resources Set up");
};
//@ sourceURL=/Game/Resources.js















