<?php
App::uses('Sanitize','Utility');
class ChatMessage extends AppModel {
  public $name = 'ChatMessage';
  public $useTable = 'chat_messages';
  public $primaryKey = 'message_id';
  public $belongsTo = array(
        'Chat' => array(
            'className'    => 'Chat',
            'foreignKey'   => 'chat_id'
        ),
        'User' => array(
            'className'    => 'User',
            'foreignKey'   => 'user_id'
        ),
    );
}
