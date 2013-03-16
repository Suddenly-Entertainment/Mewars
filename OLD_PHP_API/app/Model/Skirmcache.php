<?php
class Skirmcache extends AppModel {
  public $name = 'Skirmcache';
  
  // so we can weed out the querys to beyond the border of map
  const MAP_MAX_WIDTH = 50;
  const MAP_MAX_HEIGHT = 50;
  const MAP_SHIFT_LEN = 6; //how many bits we have to shift $y by
  
  // Fetch a single map tile from the database
  function fetchSingle($x, $y){
    
    $coord = $x + ($y << self::MAP_SHIFT_LEN);
    
    if($x < 0 || $y < 0 || $x >= self::MAP_MAX_WIDTH || $y >= self::MAP_MAX_HEIGHT){
      $mntHold;
      for($i=0; $i<15; $i++){
	for($j=0; $j<15; $j++){
	  $mntHold[$i][$j] = 14;
	}
      }
      
      return (array('Skirmcache' => Array ( 'coord' => $coord,
					    'tiles' => json_encode($mntHold),
					    'last_turn' => 3
					    )));
    }
    
    $resp = $this->find('first',array('conditions' => array('Skirmcache.coord' => $coord)));
    if($resp != false){
      $tstring = "UPDATE skirmcaches SET last_turn = 0 WHERE coord = " .
	$coord . ";";
      $this->query($tstring, $cachequeries = false);
      return ($resp);
    }
    else{
      $mntHold;
      for($i=0; $i<15; $i++){
	for($j=0; $j<15; $j++){
	  $mntHold[$i][$j] = 14;
	}
      }
      return (array('Skirmcache' => Array ( 'coord' => $coord,
					    'tiles' => json_encode($mntHold),
					    'last_turn' => 3
					    )));
    }
  }
  
  // write the info for a single tile to the database
  function writeTile($x, $y, $jsondata){
    $coord = $x + ($y << self::MAP_SHIFT_LEN);
    
    $toSave;
    
    $toSave["Skirmcache"]["coord"] = $coord;
    $toSave["Skirmcache"]["tiles"] = $jsondata;
    $toSave["Skirmcache"]["last_turn"] = 0;
    
    return $this->save($toSave);
  }
  
  // process for chron to increment the last_turn and clean up old entries
  function doCleanup(){
    // Yea, this is a query. Shoot me
    $this->query("UPDATE skirmcaches SET last_turn = last_turn + 1;",
		 $cachequeries = false);
    $this->query("DELETE FROM skirmcaches WHERE last_turn >= 3;",
		 $cachequeries = false);
    return true;
  }
}