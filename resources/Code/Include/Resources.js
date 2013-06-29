/*global $MEW, Crafty*/
// retry counter for getting resources
$MEW.ResourceRetryCounter = 0;

$MEW.doResourceLoad = function(progress_cb, ImageURLS) {
	Crafty.load(ImageURLS, function() {
		//when loaded
		console.log("Loaded Resources");
		$MEW.SetUpResources();
		Crafty.scene("User"); //go to main scene
	},

	function(e) {
		//progress
		progress_cb(e.percent / 100.0);
	},

	function(e) {
		//uh oh, error loading
		console.log("Error Loading resources:");
		console.log(e);
        $MEW.ResourceRetryCounter += 1
        if ($MEW.ResourceRetryCounter < 3) {
            $MEW.doResourceLoad(progress_cb, ImageURLS);
        } else {
            var text = "Could not Load Resources: Contact Admin";
            $MEW.LOADINGFUNCTIONS.text.text(text);
            $MEW.LOADINGFUNCTIONS.bar.updateProgress(0);
        }
	});
};

$MEW.LoadResources = function(progress_cb) {

	// Tile image names
	var TileImageNames = ['apple_trees_block.png', 'desert_2_block.png', 'everfree_forest_block.png', 'forest_block.png', 'ice_block.png', 'mud_block.png', 'rocky_block.png', 'swamp_block.png', 'zap_apple_tree_block.png', 'bushes_block.png', 'diamonds_block.png', 'everfree_grass_block.png', 'gemstone_block.png', 'lava_block.png', 'poison_joke_block.png', 'snow_block.png', 'volcano_block.png', 'desert_1_block.png', 'dirt_block.png', 'flower_block.png', 'grass_block.png', 'mountain_block.png', 'quicksand_block.png', 'snow_mountain_block.png', 'water_block.png', 'ravine.png', 'barren.png'];

	// Sprite image names
	var SpriteImageNames = ['ARMOROPT.PNG', 'COLOURS.PNG', 'COLOURSBLACK.png', 'EYES.png', 'EYESBACK.png', 'HAIRFEMFRONT.PNG', 
        'HAIRFEMBACK.png', 'HAIRMALEFRONT.png', 'HAIRMALEBACK.PNG', 'WEAPONSBACK1.png',
        'HATS.PNG', 'HATSback.PNG', 'HORNS.PNG', 'TAILSFEMFRONT.png', 'TAILSFEMBACK.png', 'Tailsmaleback.png', 'Tailsmalefront.png', 'WEAPONS.PNG', 
        'Wingsback.png', 'Wingsfront.png', "Chessfix.png", "snow_block3.png", "snow_block2.png"];

	// Interface image names
	var InterfaceImageNames = ['world_map_concept_mysticalpha-800.jpg', 'silouhetteavatar.png', 'anonavatar.png', 'anonavatar1.png', 'ParchmentWSV.png', 'small_v2_combined.png', 'mew_login_screen.png'];

	var TileResourceURL = $MEW.RESOURCE_URL + "/resource/image/0/";
	var SpriteResourceURL = $MEW.RESOURCE_URL + "/resource/image/1/";
	var InterfaceResourceURL = $MEW.RESOURCE_URL + "/resource/image/2/";

	// set up array of urls to load
	var ImageURLS = [];

	// create tile urls
	for(var key in TileImageNames) {
		ImageURLS.push(TileResourceURL + TileImageNames[key]);
	}

	// create sprite urls
	for(key in SpriteImageNames) {
		ImageURLS.push(SpriteResourceURL + SpriteImageNames[key]);
	}

	// create interface urls
	for(key in InterfaceImageNames) {
		ImageURLS.push(InterfaceResourceURL + InterfaceImageNames[key]);
	}

	// alright lets load our resources and switch scenes to the Main scene
	$MEW.doResourceLoad(progress_cb, ImageURLS);
};

$MEW.SetUpResources = function() {
	console.log("Setting up Resources");

	console.log("Setting up Tiles");
	$MEW.setupTiles();
	console.log("Setting up Sprites");
	$MEW.setupSprites();
	console.log("Setting up Interfaces");
	$MEW.setupInterfaces();

	// we're done
	console.log("Resources Set up");
};

$MEW.setupTiles = function() {
	var TileResourceURL = $MEW.RESOURCE_URL + "/resource/image/0/";
	//Set up sprites
	Crafty.sprite(64, 128, TileResourceURL + 'apple_trees_block.png', {
		AppleTreesSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'zap_apple_tree_block.png', {
		ZapAppleTreeSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'everfree_forest_block.png', {
		EverfreeForestSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'forest_block.png', {
		ForestSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'bushes_block.png', {
		BushesSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'poison_joke_block.png', {
		PoisonJokeSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'volcano_block.png', {
		VolcanoSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'mountain_block.png', {
		MountainSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'snow_mountain_block.png', {
		SnowMountainSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'desert_1_block.png', {
		Desert1Sprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'desert_2_block.png', {
		Desert2Sprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'ice_block.png', {
		IceSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'mud_block.png', {
		MudSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'rocky_block.png', {
		RockySprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'swamp_block.png', {
		SwampSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'gemstone_block.png', {
		GemstoneSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'lava_block.png', {
		LavaSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'snow_block.png', {
		SnowSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'dirt_block.png', {
		DirtSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'water_block.png', {
		WaterSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'quicksand_block.png', {
		QuicksandSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'grass_block.png', {
		GrassSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'everfree_grass_block.png', {
		EverfreeGrassSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'diamonds_block.png', {
		DiamondsSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'flower_block.png', {
		FlowerSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'ravine.png', {
		RavineSprite: [0, 0]
	});
	Crafty.sprite(64, 128, TileResourceURL + 'barren.png', {
		BarrenSprite: [0, 0]
	});

	// Map terain IDS to sprite components
	$MEW.SkermishTerrainSprites = {
		0: "GrassSprite",
		//grass
		1: "EverfreeGrassSprite",
		//everfree grass
		2: "FlowerSprite",
		//flowers
		3: "DirtSprite",
		//dry dirt
		4: "MudSprite",
		//wet dirt
		5: "BarrenSprite",
		//barren
		6: "BridgeSprite",
		//bridge
		7: "SwampSprite",
		//swamp
		8: "BushesSprite",
		//bushes
		9: "ForestSprite",
		//trees
		10: "EverfreeForestSprite",
		//everfree forest
		11: "RockySprite",
		//rocky
		12: "SnowSprite",
		//snow
		13: "IceSprite",
		//ice
		14: "WaterSprite",
		//water
		15: "RavineSprite",
		//ravine
		16: "VolcanoSprite",
		//volcano
		17: "MountainSprite",
		//mountains
		18: "SnowMountainSprite",
		//snowy mountains
		19: "Desert2Sprite",
		//desert
		20: "LavaSprite",
		//lava
		21: "QuicksandSprite",
		//quicksand
		22: "PoisonJokeSprite",
		//poison joke
		23: "AppleTreesSprite",
		//apple trees
		24: "ZapAppleTreesSprite",
		//zap apples
		25: "GemstoneSprite",
		//gems
		26: "DiamondsSprite",
		//DIAMONDS!
		27: "Desert1Sprite" // desert
	};
};

$MEW.setupSprites = function() {
	// pull sprite locations from images
	var SpriteResourceURL = $MEW.RESOURCE_URL + "/resource/image/1/";

	$MEW.PonyPartSprites = {};

	//uses for sprite height
	var ch = 0;
	//used for sprite width
	var cw = 0;
	// will be used for building the key format
	var key = "";
	var image;
	var colorOffset;

	// ARMOROPT.PNG
	image = Crafty.assets[SpriteResourceURL + 'ARMOROPT.PNG'];
	ch = image.height / 8;
	cw = image.width / 32;
	$MEW.PonyPartSprites["Armor|0|0|0"] = [SpriteResourceURL + 'ARMOROPT.PNG', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Armor|1|0|0"] = [SpriteResourceURL + 'ARMOROPT.PNG', 0, 1, cw, ch];
	for(y = 0; y < 8; y++) {
		for(x = 1; x < 32; x++) {
			key = "Armor|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'ARMOROPT.PNG', x, y, cw, ch];
		}
	}
	// COLOURS.PNG
	image = Crafty.assets[SpriteResourceURL + 'COLOURS.PNG'];
	ch = image.height / 4;
	cw = image.width / 50;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 50; x++) {
			key = "Body|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'COLOURS.PNG', x, y, cw, ch];
		}
	}

	// EYES.png
	image = Crafty.assets[SpriteResourceURL + 'EYES.png'];
	ch = image.height / 8;
	cw = image.width / 10;
	for(y = 0; y < 8; y++) {
		for(x = 0; x < 10; x++) {
			key = "Eyes|" + (y % 2) + "|" + (x + Math.floor(y / 2) * 10);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'EYES.png', x, y, cw, ch];
		}
	}
    
    // EYES.png
	image = Crafty.assets[SpriteResourceURL + 'EYESBACK.png'];
	ch = image.height / 8;
	cw = image.width / 10;
	for(y = 0; y < 8; y++) {
		for(x = 0; x < 10; x++) {
			key = "Eyes|" + (y % 2) + "|" + (x + Math.floor(y / 2) * 10);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'EYESBACK.png', x, y, cw, ch];
		}
	}

    // HAIRMALEFRONT.png
	image = Crafty.assets[SpriteResourceURL + 'HAIRMALEFRONT.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|0|0|0"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|1"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|2"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|3"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|4"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|5"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|6"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|7"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|8"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|9"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|10"] = [SpriteResourceURL + 'HAIRMALEFRONT.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 28; x++) {
			key = "Mane|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRMALEFRONT.png', x, y, cw, ch];
		}
	}
    // HAIRMALEBACK.png
	image = Crafty.assets[SpriteResourceURL + 'HAIRMALEBACK.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|0|0|0"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|1"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|2"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|3"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|4"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|5"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|6"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|7"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|8"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|9"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|0|0|10"] = [SpriteResourceURL + 'HAIRMALEBACK.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 28; x++) {
			key = "Mane|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRMALEBACK.png', x, y, cw, ch];
		}
	}

	// HAIRFEMFRONT.png
	image = Crafty.assets[SpriteResourceURL + 'HAIRFEMFRONT.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|1|0|0"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|1"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|2"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|3"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|4"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|5"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|6"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|7"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|8"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|9"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|10"] = [SpriteResourceURL + 'HAIRFEMFRONT.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 28; x++) {
			key = "Mane|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRFEMFRONT.png', x, y, cw, ch];
		}
	}
    
    // HAIRFEMBACK.png
	image = Crafty.assets[SpriteResourceURL + 'HAIRFEMBACK.png'];
	ch = image.height / 24;
	cw = image.width / 28;
	$MEW.PonyPartSprites["Mane|1|0|0"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|1"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|2"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|3"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|4"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|5"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|6"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|7"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|8"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|9"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Mane|1|0|10"] = [SpriteResourceURL + 'HAIRFEMBACK.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 28; x++) {
			key = "Mane|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HAIRFEMBACK.png', x, y, cw, ch];
		}
	}

	// HATS.PNG
	image = Crafty.assets[SpriteResourceURL + 'HATS.PNG'];
	ch = image.height / 8;
	cw = image.width / 32;
	$MEW.PonyPartSprites["Hat|0|0|0"] = [SpriteResourceURL + 'HATS.PNG', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Hat|1|0|0"] = [SpriteResourceURL + 'HATS.PNG', 0, 1, cw, ch];
	for(y = 0; y < 8; y++) {
		for(x = 1; x < 32; x++) {
			key = "Hat|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HATS.PNG', x, y, cw, ch];
		}
	}
    
    // HATSback.PNG
	image = Crafty.assets[SpriteResourceURL + 'HATSback.PNG'];
	ch = image.height / 8;
	cw = image.width / 32;
	$MEW.PonyPartSprites["Hat|0|0|0"] = [SpriteResourceURL + 'HATSback.PNG', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Hat|1|0|0"] = [SpriteResourceURL + 'HATSback.PNG', 0, 1, cw, ch];
	for(y = 0; y < 8; y++) {
		for(x = 1; x < 32; x++) {
			key = "Hat|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HATSback.PNG', x, y, cw, ch];
		}
	}

	// HORNS.PNG
	image = Crafty.assets[SpriteResourceURL + 'HORNS.PNG'];
	ch = image.height / 2;
	cw = image.width / 50;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 56; x++) {
			key = "Horn|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HORNS.PNG', x, y, cw, ch];
		}
	}
    // HORNSBACK.PNG
	image = Crafty.assets[SpriteResourceURL + 'HORNSBACK.PNG'];
	ch = image.height / 2;
	cw = image.width / 50;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 56; x++) {
			key = "Horn|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'HORNSBACK.PNG', x, y, cw, ch];
		}
	}

	// Tailsmalefront.png
	image = Crafty.assets[SpriteResourceURL + 'Tailsmalefront.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|0|0|0"] = [SpriteResourceURL + 'Tailsmalefront.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|1"] = [SpriteResourceURL + 'Tailsmalefront.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|2"] = [SpriteResourceURL + 'Tailsmalefront.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|3"] = [SpriteResourceURL + 'Tailsmalefront.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|4"] = [SpriteResourceURL + 'Tailsmalefront.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|5"] = [SpriteResourceURL + 'Tailsmalefront.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|6"] = [SpriteResourceURL + 'Tailsmalefront.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|7"] = [SpriteResourceURL + 'Tailsmalefront.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|8"] = [SpriteResourceURL + 'Tailsmalefront.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|9"] = [SpriteResourceURL + 'Tailsmalefront.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|10"] = [SpriteResourceURL + 'Tailsmalefront.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 26; x++) {
			key = "Tail|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Tailsmalefront.png', x, y, cw, ch];
		}
	}
    
    // Tailsmaleback.png
	image = Crafty.assets[SpriteResourceURL + 'Tailsmaleback.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|0|0|0"] = [SpriteResourceURL + 'Tailsmaleback.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|1"] = [SpriteResourceURL + 'Tailsmaleback.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|2"] = [SpriteResourceURL + 'Tailsmaleback.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|3"] = [SpriteResourceURL + 'Tailsmaleback.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|4"] = [SpriteResourceURL + 'Tailsmaleback.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|5"] = [SpriteResourceURL + 'Tailsmaleback.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|6"] = [SpriteResourceURL + 'Tailsmaleback.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|7"] = [SpriteResourceURL + 'Tailsmaleback.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|8"] = [SpriteResourceURL + 'Tailsmaleback.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|9"] = [SpriteResourceURL + 'Tailsmaleback.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|0|0|10"] = [SpriteResourceURL + 'Tailsmaleback.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 26; x++) {
			key = "Tail|0|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Tailsmaleback.png', x, y, cw, ch];
		}
	}

	//TAILFEMBACK.png
	image = Crafty.assets[SpriteResourceURL + 'TAILFEMBACK.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|1|0|0"] = [SpriteResourceURL + 'TAILFEMBACK.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|1"] = [SpriteResourceURL + 'TAILFEMBACK.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|2"] = [SpriteResourceURL + 'TAILFEMBACK.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|3"] = [SpriteResourceURL + 'TAILFEMBACK.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|4"] = [SpriteResourceURL + 'TAILFEMBACK.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|5"] = [SpriteResourceURL + 'TAILFEMBACK.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|6"] = [SpriteResourceURL + 'TAILFEMBACK.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|7"] = [SpriteResourceURL + 'TAILFEMBACK.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|8"] = [SpriteResourceURL + 'TAILFEMBACK.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|9"] = [SpriteResourceURL + 'TAILFEMBACK.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|10"] = [SpriteResourceURL + 'TAILFEMBACK.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 26; x++) {
			key = "Tail|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'TAILFEMBACK.png', x, y, cw, ch];
		}
	}
    
    //TAILFEMFRONT.png
	image = Crafty.assets[SpriteResourceURL + 'TAILFEMFRONT.png'];
	ch = image.height / 24;
	cw = image.width / 26;
	$MEW.PonyPartSprites["Tail|1|0|0"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 0, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|1"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 1, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|2"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 2, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|3"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 3, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|4"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 4, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|5"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 5, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|6"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 6, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|7"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 7, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|8"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 8, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|9"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 9, 0, cw, ch];
	$MEW.PonyPartSprites["Tail|1|0|10"] = [SpriteResourceURL + 'TAILFEMFRONT.png', 10, 0, cw, ch];
	colorOffset = 10;
	for(y = 1; y < 24; y++) {
		for(x = 0; x < 26; x++) {
			key = "Tail|1|" + x + "|" + (y + colorOffset);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'TAILFEMFRONT.png', x, y, cw, ch];
		}
	}

	// WEAPONS.PNG
	image = Crafty.assets[SpriteResourceURL + 'WEAPONS.PNG'];
	ch = image.height / 2;
	cw = image.width / 17;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 17; x++) {
			key = "Weapon|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'WEAPONS.PNG', x, y, cw, ch];
		}
	}
    // WEAPONSBACK1.PNG
	image = Crafty.assets[SpriteResourceURL + 'WEAPONSBACK1.PNG'];
	ch = image.height / 2;
	cw = image.width / 17;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 17; x++) {
			key = "Weapon|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'WEAPONSBACK1.PNG', x, y, cw, ch];
		}
	}

	// Wingsfront.png
	image = Crafty.assets[SpriteResourceURL + 'Wingsfront.png'];
	ch = image.height / 4;
	cw = image.width / 51;
	for(y = 0; y < 4; y++) {
		for(x = 0; x < 51; x++) {
			key = "WingsFront|" + (y % 2) + "|" + x + "|" + Math.floor(y / 2);
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Wingsfront.png', x, y, cw, ch];
		}
	}

	// Wingsback.png
	image = Crafty.assets[SpriteResourceURL + 'Wingsback.png'];
	ch = image.height / 2;
	cw = image.width / 51;
	for(y = 0; y < 2; y++) {
		for(x = 0; x < 51; x++) {
			key = "WingsBack|" + y + "|" + x;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Wingsback.png', x, y, cw, ch];
		}
	}

	// Chessfix.png
	image = Crafty.assets[SpriteResourceURL + 'Chessfix.png'];
	ch = image.height / 4;
	cw = image.width / 12;
	for(y = 0; y < 4; y++) {
		for(x = 0; x < 12; x++) {
			key = "Chessfix|" + x + "|" + y;
			$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'Chessfix.png', x, y, cw, ch];
		}
	}

	// highlights 1
	image = Crafty.assets[SpriteResourceURL + 'snow_block2.png'];
	ch = image.height;
	cw = image.width / 4;
	for(x = 0; x < 4; x++) {
		key = "HighlightLight|" + x;
		$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'snow_block2.png', x, 0, cw, ch];
	}

	// highlights 2
	image = Crafty.assets[SpriteResourceURL + 'snow_block3.png'];
	ch = image.height;
	cw = image.width / 4;
	for(x = 0; x < 4; x++) {
		key = "HighlightDark|" + x;
		$MEW.PonyPartSprites[key] = [SpriteResourceURL + 'snow_block3.png', x, 0, cw, ch];
	}

	for(key in $MEW.PonyPartSprites) {
		var map = {};
		map[key] = [$MEW.PonyPartSprites[key][1], $MEW.PonyPartSprites[key][2]];
		Crafty.sprite($MEW.PonyPartSprites[key][3], $MEW.PonyPartSprites[key][4], $MEW.PonyPartSprites[key][0], map);
	}
};

$MEW.setupInterfaces = function() {
	// create sprites for interface images
	var InterfaceResourceURL = $MEW.RESOURCE_URL + "/resource/image/2/";

	Crafty.sprite(800, 600, InterfaceResourceURL + 'world_map_concept_mysticalpha-800.jpg', {
		WorldMapConcept: [0, 0]
	});

	Crafty.sprite(800, 600, InterfaceResourceURL + 'mew_login_screen.png', {
		LoginScreenBackground: [0, 0]
	});

	// Set up windowskins
	$MEW.WindowSkins = {};
	$MEW.DefaultWindowSkin = null;

	$MEW.WindowSkins["ParchmentV"] = Crafty.e("WindowSkin").WindowSkin(30, 170, 32, 168, 200, 200, InterfaceResourceURL + "ParchmentWSV.png");
	$MEW.WindowSkins["small_v2_combined"] = Crafty.e("WindowSkin").WindowSkin(32, 112, 32, 112, 144, 144, InterfaceResourceURL + "small_v2_combined.png");

	$MEW.DefaultWindowSkin = "small_v2_combined";

};