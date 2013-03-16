<?php
App::uses('Sanitize','Utility');
class ResourceController extends AppController {
	public $name = 'Resource';
	
	public $components = array('RequestHandler', 'MEW_SMF');
	
	public function index() {
		throw new NotFoundException();
	}
	
	function image($type, $name){
	  //$this->autoRender = false;
	  global $context;
	  // Commented to allow for anon access
	  /*if ($this->MEW_SMF->UserIsGuest()) {
	    throw new ForbiddenException();
	  }
	  */
	  $type = Sanitize::paranoid($type);
	  $name = Sanitize::paranoid($name, array('.', '_', '-'));
	  $filepath = "";
	  switch ($type) {
	  case 0:
	    $filepath = APP . 'Resources/Images/Tiles/';
	    break;
	  case 1:
	    $filepath = APP . 'Resources/Images/Sprites/';
	    break;
	  case 2:
	    $filepath = APP . 'Resources/Images/Interface/';
	    break;
	  }
	  
	  if (!file_exists($filepath . $name)){
	    throw new NotFoundException($filepath . $name);
	  }
	  
	  $this->viewClass = 'Media';
	  $fileparts = explode(".", $name);
	  $namesansext = "";
	  $i = 0;
	  foreach (array_slice($fileparts, 0, count($fileparts) - 1) as $value) {
            $namesansext = $namesansext . $value;
	  }
	  $params = array(
			  'id'        => $name,
			  'name'      => $namesansext,
			  'download'  => false,
			  'extension' => $fileparts[count($fileparts) - 1],
			  'path'      => $filepath
			  );
	  $this->set($params);
	  
	}
	
	function audio($name) {
		$this->autoRender = false;
		$filepath = APP . '/Resources/Audio/' . $name;
		if(!$this->RequestHandler->isAjax()) {
			throw new ForbiddenException();
		}
		global $context;
		if ($context['user']['is_guest']) {
			throw new ForbiddenException();
		}
		if (!file_exists($filepath)){
			throw new NotFoundException($filepath);
		}
		$fileinfo = new finfo(FILEINFO_MIME);
	    $mime_type = $fileinfo->file($filename); 
	    // The function above also returns the charset, if you don't want that:
	    $mime_type = reset(explode(";", $mime_type));
	    // gets last element of an array
	
		$this->response->header(array("Content-Type: " . $mime_type, 
								"Content-Length: " . filesize($filename)));
		return(file_get_contents($filepath));
	}
}
?>