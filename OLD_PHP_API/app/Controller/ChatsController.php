<?php
class ChatsController extends Controller {
    public $name = 'Chats';
	
	public $components = array('RequestHandler', 'MEW_SMF', 'MEW_TOOLS');

    function create($game_id) {
        $this->autoRender = false;
		if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}
		
        $this->Chat->create();
        $this->Chat->set("game_id", $game_id);
        if ($this->Chat->save()) {
        	return $this->MEW_TOOLS->phraseMEWResponce('ChatsCreate', true);
        }
		return $this->MEW_TOOLS->phraseMEWResponce('ChatsCreate', false);
    }
    
    function get($chat_id) {
        $this->autoRender = false;
		if (empty($this->request->params['requested'])) {
	        throw new ForbiddenException();
		}
		
        $params = array(
            'conditions' => array(
	            'ChatMessage.message_id >' => $this->request->data->last_id, 
	            'ChatMessage.chat_id' => $chat_id
            ), 
            'order' => array('ChatMessage.created DESC'),
            'limit' => 100,
        );
        $result = $this->Chat->ChatMessage->find('all', $params);
		return $this->MEW_TOOLS->phraseMEWResponce('ChatsGet', array(
	        'GMTOffSet' => $this->MEW_TOOLS->GetGMTOffSet(),
	        'data' => $result,
        ));
    }
}