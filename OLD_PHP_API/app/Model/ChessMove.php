<?php
App::uses('Sanitize','Utility');
class ChessMove extends AppModel {
    public $name = 'ChessMove';
    public $useTable = 'chess_moves';
    public $primaryKey = 'move_id';
    public $belongsTo = array(
        'ChessGame' => array(
            'className'    => 'ChessGame',
            'foreignKey'   => 'game_id'
        )
    );
}
