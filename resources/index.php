<?php
define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(__FILE__));
define('WEBROOT_DIR', 'webroot');
define('WWW_ROOT', ROOT . DS . WEBROOT_DIR . DS);

require WEBROOT_DIR . DS . 'index.php';