<?php
class MEW_TOOLSComponent extends Component {
	public function GetMiliTime() {
        $timeparts = explode(" ",microtime());
        $currenttime = bcadd(($timeparts[0]*1000),bcmul($timeparts[1],1000));
        return $currenttime;
    }
	
    public function GetGMTOffSet() {
        $local = date('U');
        $gmt = gmdate('U');
        $offset = ($local - $gmt) / 60 / 60;
        return $offset;
    }
	
	public function phraseMEWResponce($type, $data) {
		return json_encode(array("type" => $type, "data" => $data));
	}
	
}
?>