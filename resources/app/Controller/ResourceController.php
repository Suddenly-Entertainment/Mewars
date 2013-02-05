<?php
App::uses('AppController', 'Controller');
App::uses('Sanitize','Utility');
class ResourceController extends AppController {
	public $name = 'Resource';
	
	public $uses = array();
	
	public function index() {
		//throw new NotFoundException();
		$this->redirect('http://www.equestrianwars.com');
	}
	
	public function image($type, $name){
		//$this->autoRender = false;
		global $context;
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
		$modified = @filemtime($filepath . $name);
		$this->response->modified($modified);
		if ($this->response->checkNotModified($this->request))
		{
			$this->autoRender = false;
			$this->response->send();
		}
		else
		{
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
				'path'      => $filepath,
				'cache'     => '+1 day',
				'modified' => '@' . $modified
			);
			$this->set($params);
		}
	  
	}
	
	public function audio($name) {
		$this->autoRender = false;
		$filepath = APP . '/Resources/Audio/';
		
		if (!file_exists($filepath . $name)){
			throw new NotFoundException($filepath . $name);
		}
		$modified = @filemtime($filepath . $name);
		$this->response->modified($modified);
		if ($this->response->checkNotModified($this->request))
		{
			$this->autoRender = false;
			$this->response->send();
		}
		else
		{
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
				'path'      => $filepath,
				'cache'     => 18000,
				'modified' => '@' . $modified
			);
			$this->set($params);
		}
	}
}
?>