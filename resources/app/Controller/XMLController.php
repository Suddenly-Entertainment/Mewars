<?php
App::uses('AppController', 'Controller');
App::uses('Sanitize','Utility');
class XMLController extends AppController {
    public $name = 'XML';
    
    public $uses = array();
    
    function beforeFilter() {
        // CORS
        $allowed = array(
            "http://localhost:3000",
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
    }
    
    public function index() {
        throw new NotFoundException();
    }
    
    public function file($name){
        $this->autoRender = false;
        $name = Sanitize::paranoid($name, array('.', '_', '-'));
        $filepath = APP . 'Resources/XML/' . $name;
        if (!file_exists($filepath)){
            throw new NotFoundException($filepath);
        }
        $this->response->type('xml');
        $this->response->compress();
        $this->response->sharable(true, 300);
        return(file_get_contents($filepath));
    }
    
    public function includes() {
        $this->autoRender = false;
        $filepath = APP . 'Resources/XML/';
        $files = glob($filepath . "*.xml");
        $includes = array();
        foreach($files as $file) {
            $includes[] = basename($file);
        }
        $this->response->type('json');
        $this->response->compress();
        $this->response->sharable(true, 60);
        return(json_encode($includes));
    }
    
}
?>