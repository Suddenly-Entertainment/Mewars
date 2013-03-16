<?php
App::uses('Sanitize','Utility');
class ChessGame extends AppModel {
    public $actsAs = array('Containable');
    public $name = 'ChessGame';
    public $useTable = 'chess_games';
    public $primaryKey = 'game_id';
    public $hasMany = array(
        'ChessMove' => array(
            'className'     => 'ChessMove',
            'foreignKey'    => 'game_id',
            'order'         => 'ChessMove.move_id DESC',
            'dependent'     => true
        )
    );
    public $belongsTo = array(
        'User1' => array(
            'className'    => 'User',
            'foreignKey'   => 'user1_id'
        ),
        'User2' => array(
            'className'    => 'User',
            'foreignKey'   => 'user2_id'
        )
    );
}
