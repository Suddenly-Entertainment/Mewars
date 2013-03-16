<?php
App::uses('Sanitize', 'Utility');
// to generate the skirmish map from the raw data
// code originally from MapgenController.php
// TODO: spellcheck
class SkermishMapGenerator {

	const SKIRMISH_SIZE = 15;
	//size of a single tile
	const SKIRMISH_TRANSITION_BORDER = 2;
	//how far will tiles next to each other interact
	const SKIRMISH_SECONDARY_COUNT_MIN = 6;
	const SKIRMISH_SECONDARY_COUNT_MAX = 10;
	const SKIRMISH_TERTIARY_COUNT_MIN = 3;
	const SKIRMISH_TERTIARY_COUNT_MAX = 8;
	//number of patches
	const SKIRMISH_SECONDARY_SIZE_MIN = 2;
	const SKIRMISH_SECONDARY_SIZE_MAX = 4;
	const SKIRMISH_TERTIARY_SIZE_MIN = 1;
	const SKIRMISH_TERTIARY_SIZE_MAX = 3;
	//patches are rectangles of varying size
	const SKIRMISH_SECONDARY_EROSION = 150;
	const SKIRMISH_TERTIARY_EROSION = 250;
	//erosion levels for patches 0 - no erosion 1000 - max erosion

	public $battleMapType;
	public $terrainType;
	public $battleMapSeed;
	public $singles;
	public $map;

	function setInit($data) {
		for ($i = 0; $i < 5; $i++) {
			for ($j = 0; $j < 5; $j++) {
				$this->battleMapType[$i][$j] = $data["data"][$i][$j];
				$this->battleMapSeed[$i][$j] = $data["seed"][$i][$j];
			}
		}
	}

	function __construct() {
		mt_srand();
		//totally random seed to init all the needed arrays
		for ($i = 0; $i < 6; ++$i) {
			for ($j = 0; $j < 6; ++$j) {
				$this->battleMapType[$i][$j] = mt_rand(0, 16);
				$this->battleMapSeed[$i][$j] = mt_rand();
			}
		}
		$this->terrainType = array( array(0, 2, 8), array(1, 10, 22), array(2, 0, 8), array(3, 0, 11), array(4, 3, 0), array(5, 3, 17), array(6, 6, 6), //this is igfod's fault
		array(7, 4, 21), array(8, 2, 9), array(9, 0, 8), array(10, 22, 1), array(11, 3, 17), array(12, 11, 13), array(13, 12, 14), array(14, 4, 14), array(15, 11, 15), array(16, 20, 16), array(17, 18, 17), array(18, 17, 18), array(19, 3, 11), array(20, 11, 16), array(21, 4, 7), array(22, 1, 10), array(9, 0, 8), //apple trees
		array(9, 0, 8), //zap apple trees
		array(11, 3, 17), //gems
		array(11, 3, 17) //DIAMONDS!
		);
	}

	function generateSkirmishPatch($singleXPos, $singleYPos, $xSize, $ySize, $xPos, $yPos, $erosionLevel, $newTerrainType) {
		for ($i = 0; $i < $xSize; ++$i) {
			for ($j = 0; $j < $ySize; ++$j) {
				if (mt_rand(0, 999) >= $erosionLevel) {
					$this->singles[$singleXPos][$singleYPos][$xPos + $i][$yPos + $j] = $newTerrainType;
				}
			}
		}
	}

	function generateSkirmishTransition2($xPos, $yPos, $xSize, $ySize, $singleXNum, $singleYNum, $singleXPos, $singleYPos) {
		for ($i = 0; $i < $xSize; ++$i) {
			for ($j = 0; $j < $ySize; ++$j) {
				$single = mt_rand(0, 1);
				$this->map[$xPos + $i][$yPos + $j] = $this -> singles[$singleXNum[$single]][$singleYNum[$single]][$singleXPos[$single] + $i][$singleYPos[$single] + $j];
			}
		}
	}

	function generateSkirmishTransition4($xPos, $yPos, $singleXNum, $singleYNum, $singleXPos, $singleYPos) {
		for ($i = 0; $i < self::SKIRMISH_TRANSITION_BORDER; ++$i) {
			for ($j = 0; $j < self::SKIRMISH_TRANSITION_BORDER; ++$j) {
				$single = mt_rand(0, 3);
				$this->map[$xPos + $i][$yPos + $j] = $this -> singles[$singleXNum[$single]][$singleYNum[$single]][$singleXPos[$single] + $i][$singleYPos[$single] + $j];
			}
		}
	}

	function generateSkirmishMap($xPos, $yPos, $xSize, $ySize) {
		for ($i = 0; $i < $xSize + 2; ++$i) {
			for ($j = 0; $j < $ySize + 2; ++$j) {//generate single maps for each tile

				mt_srand($this->battleMapSeed[$xPos + $i - 1][$yPos + $j - 1]);
				//seed the random genetator with tile seed

				for ($k = 0; $k < self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER; ++$k) {
					for ($l = 0; $l < self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER; ++$l) {
						$this->singles[$i][$j][$k][$l] = $this -> battleMapType[$xPos + $i - 1][$yPos + $j - 1];
						//fill with primary type
					}
				}

				//add secondary patches
				$patchCount = mt_rand(self::SKIRMISH_SECONDARY_COUNT_MIN, self::SKIRMISH_SECONDARY_COUNT_MAX);
				$patchType = $this -> terrainType[$this -> battleMapType[$xPos + $i - 1][$yPos + $j - 1]][1];
				for ($k = 0; $k < $patchCount; ++$k) {
					$patchXSize = mt_rand(self::SKIRMISH_SECONDARY_SIZE_MIN, self::SKIRMISH_SECONDARY_SIZE_MAX);
					$patchYSize = mt_rand(self::SKIRMISH_SECONDARY_SIZE_MIN, self::SKIRMISH_SECONDARY_SIZE_MAX);
					//random size
					$patchXPos = mt_rand(0, self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER - $patchXSize);
					$patchYPos = mt_rand(0, self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER - $patchYSize);
					//random position (makes sure it doesn't exceed the limits)
					$this->generateSkirmishPatch($i, $j, $patchXSize, $patchYSize, $patchXPos, $patchYPos, self::SKIRMISH_SECONDARY_EROSION, $patchType);
					//patch the map
				}

				//add tertiary patches
				$patchCount = mt_rand(self::SKIRMISH_TERTIARY_COUNT_MIN, self::SKIRMISH_TERTIARY_COUNT_MAX);
				$patchType = $this -> terrainType[$this -> battleMapType[$xPos + $i - 1][$yPos + $j - 1]][2];
				for ($k = 0; $k < $patchCount; ++$k) {
					$patchXSize = mt_rand(self::SKIRMISH_TERTIARY_SIZE_MIN, self::SKIRMISH_TERTIARY_SIZE_MAX);
					//random size
					$patchYSize = mt_rand(self::SKIRMISH_TERTIARY_SIZE_MIN, self::SKIRMISH_TERTIARY_SIZE_MAX);
					$patchXPos = mt_rand(0, self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER - $patchXSize);
					//random position (makes sure it doesn't exceed the limits)
					$patchYPos = mt_rand(0, self::SKIRMISH_SIZE + 2 * self::SKIRMISH_TRANSITION_BORDER - $patchYSize);
					$this->generateSkirmishPatch($i, $j, $patchXSize, $patchYSize, $patchXPos, $patchYPos, self::SKIRMISH_TERTIARY_EROSION, $patchType);
					//patch the map
				}
			}
		}

		for ($i = 0; $i < $xSize; ++$i) {
			for ($j = self::SKIRMISH_TRANSITION_BORDER; $j < self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER; ++$j) {
				for ($k = 0; $k < $ySize; ++$k) {
					for ($l = self::SKIRMISH_TRANSITION_BORDER; $l < self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER; ++$l) {
						//merge the single tiles into final map
						$this->map[$i * self::SKIRMISH_SIZE + $j][$k * self::SKIRMISH_SIZE + $l] = $this -> singles[$i + 1][$k + 1][$j + self::SKIRMISH_TRANSITION_BORDER][$l + self::SKIRMISH_TRANSITION_BORDER];
					}
				}
			}
		}

		//correct transitions here
		for ($i = 0; $i < $xSize; ++$i) {
			for ($j = 0; $j < $ySize; ++$j) {
				mt_srand($this -> battleMapSeed[$xPos + $i + 1][$yPos + $j + 1]);

				$this->generateSkirmishTransition4($i * self::SKIRMISH_SIZE, $j * self::SKIRMISH_SIZE, array($i, $i + 1, $i, $i + 1), array($j, $j, $j + 1, $j + 1), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, 0));

				$this->generateSkirmishTransition2($i * self::SKIRMISH_SIZE + self::SKIRMISH_TRANSITION_BORDER, $j * self::SKIRMISH_SIZE, self::SKIRMISH_SIZE - 2 * self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER, array($i + 1, $i + 1), array($j, $j + 1), array(self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0));

				$this->generateSkirmishTransition4(($i + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, $j * self::SKIRMISH_SIZE, array($i + 1, $i + 2, $i + 1, $i + 2), array($j, $j, $j + 1, $j + 1), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, 0));

				$this->generateSkirmishTransition2($i * self::SKIRMISH_SIZE, $j * self::SKIRMISH_SIZE + self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_SIZE - 2 * self::SKIRMISH_TRANSITION_BORDER, array($i, $i + 1), array($j + 1, $j + 1), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER));

				$this->generateSkirmishTransition2(($i + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, $j * self::SKIRMISH_SIZE + self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_SIZE - 2 * self::SKIRMISH_TRANSITION_BORDER, array($i + 1, $i + 2), array($j + 1, $j + 1), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER));

				$this->generateSkirmishTransition4($i * self::SKIRMISH_SIZE, ($j + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, array($i, $i + 1, $i, $i + 1), array($j + 1, $j + 1, $j + 2, $j + 2), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, 0));

				$this->generateSkirmishTransition2($i * self::SKIRMISH_SIZE + self::SKIRMISH_TRANSITION_BORDER, ($j + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_SIZE - 2 * self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER, array($i + 1, $i + 1), array($j + 1, $j + 2), array(0, 0), array(self::SKIRMISH_TRANSITION_BORDER, self::SKIRMISH_TRANSITION_BORDER), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0));

				$this->generateSkirmishTransition4(($i + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, ($j + 1) * self::SKIRMISH_SIZE - self::SKIRMISH_TRANSITION_BORDER, array($i + 1, $i + 2, $i + 1, $i + 2), array($j + 1, $j + 1, $j + 2, $j + 2), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0), array(self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, self::SKIRMISH_TRANSITION_BORDER + self::SKIRMISH_SIZE, 0, 0));
			}
		}
	}

}

class SkirmcachesController extends AppController {
	public $name = 'Skirmcache';
	public $uses = array('Skirmcache', 'Map');
	public $components = array('RequestHandler', 'MEW_TOOLS');

	public function index() {
		throw new NotFoundException();
	}

	// returns a SINGLE skirmish map tile from the given location
	// why single? because want to make sure flow works during testing before
	// expanding to full 3x3 block generation (which is more efficient)
	public function getskirmishtile($x, $y) {
		$this -> autoRender = false;

		if (empty($this -> request -> params['requested'])) {
			throw new ForbiddenException();
		}
		// hardcode location for testing, will be function of player location
		// centered on player location
		//$x = 13;
		if ($x == '' || $x == NULL){
			$x = 0;
		}
		//$y = 4;
		if ($y == '' || $y == NULL){
			$y = 0;
		}

		// first, check to see if we have the tile cached
		$skirmResp = $this->Skirmcache->fetchSingle($x, $y);

		if ($skirmResp["Skirmcache"]["last_turn"] < 3) {
			//return json_encode($skirmResp);
			return $this->MEW_TOOLS->phraseMEWResponce('SkirmcachesGetskirmishtile', $skirmResp);
		}

		// appears we don't have tile cached - generate new one!
		$mapdata = $this->Map->getmapsquare($x, $y);

		// should probably check to make sure that x and y match in returned,
		// but should be ok for now

		$generator = new SkermishMapGenerator();
		$generator->setInit($mapdata);
		$generator->generateSkirmishMap(2, 2, 1, 1);

		// we now store our generated skirmmap tile
		$mret = json_encode($generator -> map);
		$this->Skirmcache->writeTile($x, $y, $mret);

		$skirmResp["Skirmcache"]["last_turn"] = 0;
		$skirmResp["Skirmcache"]["coord"] = $x + ($y<<6);
		$skirmResp["Skirmcache"]["tiles"] = $mret;

		//return json_encode($skirmResp);
		return $this->MEW_TOOLS->phraseMEWResponce('SkirmcachesGetskirmishtile', $skirmResp);
	}

	// akin to the old "getnewskermishmap" (sic) function, returns a 3x3 block
	//
	public function getskirmishmap($x, $y) {
		$this -> autoRender = false;

		//$x = Sanitize::paranoid($this->request->data['Post']['x']);
		//$y = Sanitize::paranoid($this->request->data['Post']['y']);
		$x = Sanitize::paranoid($x);
		$y = Sanitize::paranoid($y);

		// just so it doesn't blow up, should probably return gracefully instead
		if ($x == '' || $x == NULL){
			$x = 13;
		}
		if ($y == '' || $y == NULL){
			$y = 4;
		}

		$resps;
		$map;

		for ($i = -1; $i < 2; $i++) {
			for ($j = -1; $j < 2; $j++) {
				$resps[$i][$j] = $this->getskirmishtile($x + $i, $y + $j);
				// because we have to smash these together
				$resps[$i][$j] = json_decode($resps[$i][$j]["Skirmcache"]["tiles"], true);
			}
		}

		//return json_encode($resps);

		for ($i = 0; $i < 3; $i++) {// 1st of resps
			for ($j = 0; $j < 3; $j++) {// 2nd of resps
				for ($k = 0; $k < 15; $k++) {// 1st of tiles
					for ($l = 0; $l < 15; $l++) {// 2nd of tiles
						$map["data"][($i * 15) + $k][($j * 15) + $l] = $resps[$i - 1][$j - 1][$k][$l];
					}
				}
			}
		}

		$map["width"] = count($map["data"]);
		$map["height"] = count($map["data"][0]);
		return $this->MEW_TOOLS->phraseMEWResponce('SkirmcachesGetskirmishmap', $map);
	}

}
?>