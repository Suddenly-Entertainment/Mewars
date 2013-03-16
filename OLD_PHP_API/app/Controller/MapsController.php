<?php
App::uses('Sanitize','Utility');

class MapsController extends AppController {
  public $name = 'Map';
    
  // This is very similar to game controller for testing purposes
  
  public $components = array('RequestHandler', 'MEW_TOOLS');
  
  public function index() {
    throw new NotFoundException();
  }
  
  // 5x5 centered around (x,y)
  function getmapsquare($x, $y){
    $this->autoRender = false;
    if($x == NULL)
      $x = $_GET["x"];
    if($y == NULL)
      $y = $_GET["y"];
    $ret = $this->Map->getMapsquare($x,$y);
	return $this->MEW_TOOLS->phraseMEWResponce('MapsGetmapsquare', $ret);
  }
  
  function getfullmap(){
    $this->autoRender = false;
    $mapresp = $this->Map->fetchMult(0,0,50,50);
    
    $battleMapType;
    $battleMapSeed;
    $map;
    
    //return json_encode($mapresp);
    
    foreach($mapresp as $resp){
      $coord = $resp["Map"]["coord"];
      $y = $coord >> 6;
      $x = $coord - ($y << 6);
      $battleMapType[$x][$y] = $resp["Map"]["tile"];
      $battleMapSeed[$x][$y] = $resp["Map"]["seed"];
    }
    for($i=0;$i<50;$i++){
      for($j=0;$j<50;$j++){
	if(!(array_key_exists($i,$battleMapType) &&
	     array_key_exists($j,$battleMapType[$i]))){
	  $battleMapType[$i][$j] = 17;
	  $battleMapSeed[$i][$j] = 42;
	}
      }
    }
    $map["data"] = $battleMapType;
    $map["height"] = count($battleMapType);
    $map["width"] = count($battleMapType[0]);
    
	return $this->MEW_TOOLS->phraseMEWResponce('MapsGetfullmap', $map);
  }
    
}
?>