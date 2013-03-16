<head>
	<title>Command Processor</title>
	</head>
<?php 
class commandProcessor{
	public $useItemsStack = array(); //Place barriers, Use potions, Switch weapons.
	public $buffsStack= array(); //Barrier Skills, Start teleport/disappear skills
	public $movementStack= array(); //Each pony moves one step until all steps are completed.
	public $attacksStack= array(); //When 2 or more ponies attack each other, 
					//there is a 33% chance they will attack at the same time.
					//Otherwise, calculate initiative to see who attacks first. Include ranged attack initiative.
	public $regenerateStack= array(); //Energy, Health, Damage over Time
	
	public $mainStack= array(); // where commands go pre-processing
	
	public $GUID = 0; // goo-ed
	
	public function __construct(){
	
	}
	public function submitCommand($cmd){
		$cmd->GUID=$this->GUID;
		$this->mainStack[$this->GUID]=$cmd;
		$this->GUID=$this->GUID+1;
	}
	
	public function process(){
		for($x=0;$x<count($this->mainStack);$x++){
			$item=$this->mainStack[$x];
			if($item->type == "item"){
				array_push($this->useItemsStack,$item);
				// "$item processed to Items Stack. <br>";
			}
			elseif($item->type == "buff"){
				if(!hasDuplicate($this->buffsStack,$item,"value")){ //can't have Potion of Strength(x132), now can we?
					array_push($this->buffsStack,$item);
					// "$item processed to Buffs Stack.
				}else{
					// "$item you already have that buff!";
				}
			}
			elseif($item->type == "move"){
				if(!hasDuplicate($this->movementStack,$item,"value")){
					array_push($this->movementStack,$item);
					// "$item processed to Movement Stack.
				}
				else{
					// decide which should go first
					// get speed stats, compare and then other stuff
					// $item . " someone is already there! Who gets the spot? Nobody knows!";
				}
			}
			elseif($item->type == "attack"){
				if(!hasDuplicate($this->attacksStack,$item,"value")){
					if(mt_rand(1,100)<=33){
						$item->type="doubleAttack";
						// a special command that gets the attack stats of both target and doer, then
						// applies damage to both
					}else{
						// decide which should go first
						// get speed stats, compare and then other stuff
					}
				}
				array_push($this->attacksStack,$item);
			}
			elseif($item->type == "regen"){
				array_push($this->regenerateStack,$item);
				// "$item processed to Regenerate Stack.
			}
			else{
				// "oops, invalid command!";
			}
		}
	}
	public function hasDuplicate($arr,$_item,$name){
		for($y=0;$y<count($arr);$y++){
			if($arr[$y][$name] == $_item[$name]){
				return true;
			}
		}
		return false;
	}
	
}
class command{
	public $GUID;
	public $name;
	public $doer;
	public $target;
	public $value;
	public $type;
	
	public function __construct($name,$type,$value,$doer,$target){
		$this->name=$name;
		$this->doer=$doer;
		$this->target=$target;
		$this->value=$value;
		$this->type=$type;
	}
	public function __toString(){
		return $this->GUID . ":" . $this->type;
	}
}

 ?>