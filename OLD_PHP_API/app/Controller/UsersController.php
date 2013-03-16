<?php
class UsersController extends AppController {
	public $name = 'Users';
	public $components = array('RequestHandler', 'MEW_TOOLS', 'MEW_SMF');
	
	function index() {
		throw new NotFoundException();	
	}
	
	function getOnline() {
		$this->autoRender = false;
		return $this->MEW_TOOLS->phraseMEWResponce('UsersGetOnline', $this->MEW_SMF->GetOnlineUsers());
	}
	
	function getCurrent() {
		$this->autoRender = false;
		return $this->MEW_TOOLS->phraseMEWResponce('UsersGetCurrent', $this->MEW_SMF->GetCurrentUser());
	}
    
    function login() {
        $this->autoRender = false;
        if (isset($this->request->data->user)) {
            $user = $this->request->data->user;
        } else {
            $user = '';
        }
        
        if (isset($this->request->data->pass)) {
            $pass = $this->request->data->pass;
        } else {
            $pass = '';
        }
        
        if (isset($this->request->data->encrypted)) {
            $encrypted = $this->request->data->encrypted;
        } else {
            $encrypted = false;
        }
        
        if (isset($this->request->data->undelete)) {
            $undelete = $this->request->data->undelete;
        } else {
            $undelete = false;
        }
        
        $result = $this->MEW_SMF->login($user, $pass, $encrypted, $undelete);
		return $this->MEW_TOOLS->phraseMEWResponce('UsersLogin', $result);
    }
    
    function logout() {
        $this->autoRender = false;
        $result = $this->MEW_SMF->logout();
		return $this->MEW_TOOLS->phraseMEWResponce('UsersLogout', $result);
    }
}
?>