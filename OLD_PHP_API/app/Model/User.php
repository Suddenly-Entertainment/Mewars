<?php
App::uses('Sanitize','Utility');
class User extends AppModel {
  public $name = 'User';
  public $useTable = 'users';
  public $primaryKey = 'user_id';
}
