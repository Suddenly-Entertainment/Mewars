<?php
App::uses('Sanitize','Utility');
class CodeController extends AppController {
	public $name = 'Code';
	
	public $components = array('RequestHandler', 'MEW_SMF');
	
	public function index() {
		throw new NotFoundException();
	}
	
	function file($name){
	  $this->autoRender = false;
	  $name = Sanitize::paranoid($name, array('.', '_', '-'));
	  $filepath = APP . 'Resources/Code/' . $name . '.js';
	  if (empty($this->request->params['requested'])) {
            throw new ForbiddenException();
	  }
	  if(!$this->RequestHandler->isAjax()) {
	    throw new ForbiddenException();
	  }
	  global $context;
	  // Commented out to allow anon access
	  /*
	  if ($this->MEW_SMF->UserIsGuest()) {
	    throw new ForbiddenException();
	  }
	  */
	  if (!file_exists($filepath)){
	    throw new NotFoundException($filepath);
	  }
	  $this->response->header(array('Content-type: text/javascript'));
	  return(file_get_contents($filepath));
	}
	
	function bootstrap() {
	  $this->autoRender = false;
	  $filepath = APP . 'Resources/Code/bootstrap.js';
	  if (!file_exists($filepath)){
	    throw new NotFoundException($filepath);
	  }
	  $this->response->header(array('Content-type: text/javascript'));
	  return(file_get_contents($filepath));
	}
    
    function engine() {
      $this->autoRender = false;
	  $filepath = APP . 'Resources/Code/crafty.js';
	  if (!file_exists($filepath)){
	    throw new NotFoundException($filepath);
	  }
	  $this->response->header(array('Content-type: text/javascript'));
	  return(file_get_contents($filepath));
	}
}
?>