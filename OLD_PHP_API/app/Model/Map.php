<?php
App::uses('Sanitize','Utility');
class Map extends AppModel {
  public $name = 'Map';
  
  // so we can weed out the querys to beyond the border of map
  const MAP_MAX_WIDTH = 50;
  const MAP_MAX_HEIGHT = 50;
  const MAP_SHIFT_LEN = 6; //how many bits we have to shift $y by
  const MAP_MUL_LEN = 64; //because << isn't working right for some reason...
  
  // Fetch a single map tile from the database
  function fetchSingle($x, $y){
    
    $coord = $x + ($y << self::MAP_SHIFT_LEN);
    
    if($x < 0 || $y < 0 || $x >= self::MAP_MAX_WIDTH || $y >= self::MAP_MAX_HEIGHT){
      return (array('Map' => Array ( 'coord' => $coord,
				     'tile' => 17,
				     'attrs' => '',
				     // can get away with set seed because
				     // all map edges should be 14
				     'seed' => 42
				     )));
    }
    
    $resp = $this->find('first',array('conditions' => array('Map.coord' => $coord)));
    return ($resp);
  }
  
  // Fetch a block of map tiles from the database
  function fetchMult($x, $y, $width, $height){
    
    if($width <= 0){
      $width = 1;
    }
    if($height <= 0){
      $height = 1;
    }
    if($x < 0){
      $x = 0;
    }
    if($y < 0){
      $y = 0;
    }
    
    $coord;
    
    $coord[0] = $x + ($y << self::MAP_SHIFT_LEN);
    
    for($i = 1; $i < $height; $i++){
      $coord[$i] = $coord[$i - 1] + (1 << self::MAP_SHIFT_LEN);
    }
    
    if($x >= self::MAP_MAX_WIDTH || $y >= self::MAP_MAX_HEIGHT){
      return (array('0' => array('Map' => Array ( 'coord' => $coord,
						  'tile' => 17,
						  'attrs' => '',
						  // can get away with set seed because
						  // all map edges should be 14
						  'seed' => 42
						  ))));
    }
    
    $cond = array('OR' => array());
    
    $i = 0;
    foreach($coord as $value){
      $cond['OR'][$i++] = array('Map.coord BETWEEN ? AND ?' => array($value, $value + $width - 1));
    }    
    
    $resp = $this->find('all', array('conditions' => $cond));
    
    return ($resp);
  }
  
  function getmapsquare($x, $y){
    $x = Sanitize::paranoid($x);
    $y = Sanitize::paranoid($y);
    if($x == "")
      $x = 0;
    if($y == "")
      $y = 0;
    if($x < 0)
      $x = 0;
    if($x > 49)
      $x = 49;
    if($y < 0)
      $y = 0;
    if($y > 49)
    $y = 49;
    
    $mapresp = $this->fetchMult($x-2,$y-2,5,5);
    
    $battleMapType;
    $battleMapSeed;
    $map;
    $retType;
    $retSeed;
    
    foreach($mapresp as $resp){
      $coord = $resp["Map"]["coord"];
      $yi = $coord >> 6;
      $xi = $coord - ($yi << 6);
      $battleMapType[$xi][$yi] = $resp["Map"]["tile"];
      $battleMapSeed[$xi][$yi] = $resp["Map"]["seed"];
    }
    for($i=0;$i<5;$i++){
      for($j=0;$j<5;$j++){
	if(!(array_key_exists($x+$i-2,$battleMapType) &&
	     array_key_exists($y+$j-2,$battleMapType[$x+$i-2]))){
	  $retType[$i][$j] = 17;
	  $retSeed[$i][$j] = 42;
	}else{
	  $retType[$i][$j] = $battleMapType[$x+$i-2][$y+$j-2];
	  $retSeed[$i][$j] = $battleMapSeed[$x+$i-2][$y+$j-2];
	}
      }
    }
    $map["data"] = $retType;
    $map["seed"] = $retSeed;
    $map["height"] = count($battleMapType);
    $map["width"] = count($battleMapType[$x]);
    $map["cX"] = $x;
    $map["cY"] = $y;
    
    return $map;
  }
}
