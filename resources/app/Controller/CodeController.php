<?php
App::uses('AppController', 'Controller');
App::uses('Sanitize','Utility');
class CodeController extends AppController {
    public $name = 'Code';
    
    public $uses = array();
    
    function beforeFilter() {
        // CORS
        $allowed = array(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://0.0.0.0:3000",
            "http://api.equestrianwars.com", 
            "http://node1.equestrianwars.com",
            "http://api2.equestrianwars.com",
            "http://node2.equestrianwars.com",
            "http://re.equestrianwars.com",
            "http://www.equestrianwars.com",
            "http://equestrianwars.com",
            "http://client.cors-api.appspot.com"
            );
        $origin = $this->request->header('Origin');
        $this->log($origin . ' ' . in_array($origin, $allowed ), 'debug');
        if (in_array($origin, $allowed )) {
            $this->response->header(array('Access-Control-Allow-Origin: ' . $origin));
        } elseif (!($origin == "")) {
            throw new NotFoundException();
        }
        $this->response->type(array('js' => 'application/javascript'));
    }
    
    public function index() {
        $this->autoRender = false;
        //throw new NotFoundException();
        //$this->redirect('http://www.equestrianwars.com');
        return("test");
    }
    
    public function file($name){
        $this->autoRender = false;
        $name = Sanitize::paranoid($name, array('.', '_', '-'));
        $filepath = APP . 'Resources/Code/Include/' . $name;
        if (!file_exists($filepath)){
            throw new NotFoundException($filepath);
        }
        $this->response->type('js');
        $this->response->compress();
        $this->response->sharable(true, 300);
        return(file_get_contents($filepath));
    }
    
    public function bootstrap() {
        $this->autoRender = false;
        $filepath = APP . 'Resources/Code/Boot/bootstrap.js';
        if (!file_exists($filepath)){
            throw new NotFoundException($filepath);
        }
        $this->response->type('js');
        $this->response->compress();
        $this->response->sharable(true, 300);
        return(file_get_contents($filepath));
    }
    
    public function loader() {
        $this->autoRender = false;
        $filepath = APP . 'Resources/Code/Boot/GameLoader.js';
        if (!file_exists($filepath)){
            throw new NotFoundException($filepath);
        }
        $this->response->type('js');
        $this->response->compress();
        $this->response->sharable(true, 300);
        return(file_get_contents($filepath));
    }
    
    public function includes() {
        $this->autoRender = false;
        $filepath = APP . 'Resources/Code/Include/';
        $files = glob($filepath . "*.js");
        $includes = array();
        foreach($files as $file) {
            $includes[] = basename($file);
        }
        $this->response->type('json');
        $this->response->compress();
        $this->response->sharable(true, 60);
        return(json_encode($includes));
    }
    
    public function engine() {
        $this->autoRender = false;
        $filepath = APP . 'Resources/Code/Boot/crafty.js';
        if (!file_exists($filepath)){
        throw new NotFoundException($filepath);
        }
        $this->response->type('js');
        $this->response->compress();
        $this->response->sharable(true, 300);
        return(file_get_contents($filepath));
    }
}
?>