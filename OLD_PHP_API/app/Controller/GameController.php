<?php
class GameController extends AppController {
	public $name = 'Game';
	public $uses = array('User');
	public $components = array('RequestHandler', 'MEW_SMF', 'MEW_TOOLS');
	
	function index() {
		throw new NotFoundException();	
	}
	
	function embed() {
		$this->layout = "embed";
	}
	
	function version() {
		$this->autoRender = false;
		return($MEW_VERSION);
	}
	
	function action() {
		$this->autoRender = false;
		if (empty($this->data)) {
			throw new ForbiddenException();
		} else {
			return $this->requestAction(
			    array(
			    	'controller' => $this->data['controller'], 
			    	'action' => $this->data['action']
					),
			    array(
				    'return', 
		            'pass' => json_decode($this->data['pass']), 
		            'named' => json_decode($this->data['named'], true),
		            'data' => json_decode($this->data['post'])
				)
			);
		}
	}
	
    function load_user() {
        $this->autoRender = false;
        if ($this->MEW_SMF->GetUserID() > 0){
            $this->User->set("user_id", $this->MEW_SMF->GetUserID());
            $this->User->set("user_name", $this->MEW_SMF->GetUsername());
            $this->User->save();
        }
		return $this->MEW_TOOLS->phraseMEWResponce('GameLoadUser', $this->MEW_SMF->GetCurrentUser());
    }
}
?>