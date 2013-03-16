<?php
class ChatMessagesController extends Controller {
    public $name = 'ChatMessages';
	
	public $components = array('RequestHandler', 'MEW_SMF', 'MEW_TOOLS');
    
    function add($chat_id) {
        $this->autoRender = false;
        if (!empty($this->request->params['requested'])) {
            $this->ChatMessage->create();
            $this->ChatMessage->set("chat_id", $chat_id);
            $this->ChatMessage->set("user_id", $this->MEW_SMF->GetUserID());
            $this->ChatMessage->set("created", $this->MEW_TOOLS->GetMiliTime());
            $this->ChatMessage->set("body", $this->request->data->body);
            if ($this->ChatMessage->save()){
            	return $this->MEW_TOOLS->phraseMEWResponce('ChatMessagesAdd', true);
            }
        }
		return $this->MEW_TOOLS->phraseMEWResponce('ChatMessagesAdd', false);
    }
}