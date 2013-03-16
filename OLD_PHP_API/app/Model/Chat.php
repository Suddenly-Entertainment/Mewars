<?php
App::uses('Sanitize','Utility');
class Chat extends AppModel {
  public $name = 'Chat';
  public $useTable = 'chats';
  public $primaryKey = 'chat_id';
  public $hasMany = array(
        'ChatMessage' => array(
            'className'     => 'ChatMessage',
            'foreignKey'    => 'chat_id',
            'order'         => 'ChatMessage.created DESC',
            'dependent'     => true
        )
    );
}
