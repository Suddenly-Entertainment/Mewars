//BROKED RIGHT NOW BRB

<?php
ob_start("ob_gzhandler");

global $ALLOWED_CORS;

$ALLOWED_CORS = array(
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
    "http://client.cors-api.appspot.com",
    "http://mewars-api-regi.aws.af.cm",
    "http://mew.ryex.c9.io"
);


if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}
if (!defined('ROOT')) {
    define('ROOT', dirname(dirname(__FILE__)));
}
if (!defined('WEBROOT_DIR')) {
    define('WEBROOT_DIR', basename(dirname(__FILE__)));
}
if (!defined('WWW_ROOT')) {
	define('WWW_ROOT', dirname(__FILE__) . DS);
}

if (!empty($_GET['vars'])) {
    $path = explode('/', $_GET['vars']);
    $size = count($path);
    if ($path[$size - 1] == '') {
        unset($path[$size - 1]);
    }
    //print_r($path);
    //echo '<br />';
    call_page($path);
} else {
    index();
}

function error_404($message="") {
    header('HTTP/1.0 404 Not Found');
    $text = '<h2 class="center">Error 404 - Not Found</h2>
            <p>The requested page does not exist!</p>
            ';
    echo $text . " <br /> " . $message;
    die();
}


function index() {
    
    echo 'Hello form Mock Equestrian Wars! <br/> What are you doing here? <br />';
}

class Code {
    static public function index() {
        echo "Root: " . ROOT . " <br />" . "WebRoot: " . WEBROOT_DIR;
    }
    static public function includes() {
        $filepath = ROOT . DS . 'Code' . DS . 'Include' . DS;
        $files = glob($filepath . "*.js");
        $includes = array();
        foreach($files as $file) {
            $includes[] = basename($file);
        }
        header('Content-type: application/json');
        echo json_encode($includes);
    }
    static public function bootstrap() {
        $filepath = ROOT . DS . 'Code' . DS . 'Boot' . DS . 'bootstrap.js';
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/javascript');
        echo file_get_contents($filepath);
    }
    static public function loader() {
        $filepath = ROOT . DS . 'Code' . DS . 'Boot' . DS . 'GameLoader.js';
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/javascript');
        echo file_get_contents($filepath);
    }
    static public function engine() {
        $filepath = ROOT . DS . 'Code' . DS . 'Boot' . DS . 'crafty.js';
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/javascript');
        echo file_get_contents($filepath);
        
    }
    static public function file($name) {
        $filepath = ROOT . DS . 'Code' . DS . 'Include' . DS . $name;
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/javascript');
        echo file_get_contents($filepath);
    }
    static public function date($name) {
        $filepath = ROOT . DS . 'Code' . DS . 'Include' . DS . $name;
        if (!file_exists($filepath)){
            error_404();
        }
        //send the file's last modified date in JSON
        $last_modified = filemtime($filepath);
        $responce = array();
        $responce['time'] = $last_modified;
        echo json_encode($responce);
    }
    
    static public function worker($name) {
        $filepath = ROOT . DS . 'Code' . DS . 'Workers' . DS . $name;
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/javascript');
        echo file_get_contents($filepath);
    }
} 

$image_mine_types = array();

//caching function for resources
function cacheThis($filepath, $info) {
    //do they have the file?
    if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
        //
        $userLastModifiedDate = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
        $fileMTime = filemtime($filepath);
        if ($fileMTime > $userLastModifiedDate) {
            header('HTTP/1.0 304 Not Modified');
        } else {
            header('Cache-Control: max-age=432000, must-revalidate');
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s T', time()));
            header("Content-Type: $info");
            echo file_get_contents($filepath);
        }
    } else {
        header('Cache-Control: max-age=432000, must-revalidate');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s T', time()));
        header("Content-Type: $info");
        echo file_get_contents($filepath);
    }
}

class Resource {
    static public function index() {
        error_404();
    }
    static public function image($type, $name) {
        $filepath = "";
    	switch ($type) {
		case 0:
			$filepath = ROOT . DS . 'Images' . DS . 'Tiles' . DS . $name;
		break;
		case 1:
			$filepath = ROOT . DS . 'Images' . DS . 'Sprites' . DS . $name;
		break;
		case 2:
			$filepath = ROOT . DS . 'Images' . DS . 'Interface' . DS . $name;
		break;
		}
        
        if (!file_exists($filepath)){
    		error_404();
		}
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $info = finfo_file($finfo, $filepath);
        finfo_close($finfo);
        
        
        
    }
    static public function audio($name) {
        $filepath = ROOT . DS . 'Audio' . DS . $name;
        if (!file_exists($filepath . $name)){
    		error_404();
		}
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $info = finfo_file($finfo, $filepath);
        finfo_close($finfo);
        header("Content-Type: $info");
        echo file_get_contents($filepath);
    }
} 

class XML {
    static public function index() {
        error_404();
    }
    static public function includes() {
        $filepath = ROOT . DS . 'XML' . DS;
        $files = glob($filepath . "*.xml");
        $includes = array();
        foreach($files as $file) {
            $includes[] = basename($file);
        }
        header('Content-type: application/json');
        echo json_encode($includes);
    }
    static public function file($name) {
        $filepath = ROOT . DS . 'XML' . DS . $name;
        if (!file_exists($filepath)){
            error_404();
        }
        header('Content-Type: text/xml');
        echo file_get_contents($filepath);
        
    }
    static public function date($name) {
        $filepath = ROOT . DS . 'XML' . DS . $name;
        if (!file_exists($filepath)){
            error_404();
        }
        
        //send the file's last modified date in JSON
        $last_modified = filemtime($filepath);
        $response = array();
        $response['time'] = $last_modified;
        header('Content-type: application/json');
        echo json_encode($response);
        
    }
    
} 


function process_CORS() {
    $headers = getallheaders();
    
    global $ALLOWED_CORS;
    
    
    if (!empty($headers['origin'])){
        header('X-Origin-Result: ' . $headers['origin']);
        $origin = $headers['origin'];
        if (in_array($origin, $ALLOWED_CORS )) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
        } else {
            error_404($origin . " not in " . json_encode($ALLOWED_CORS));
        }
    }
}

function call_page($path) {
    process_CORS();
    $klass = $path[0];
    //print_r("<br /> Class: $klass <br />");
    if ($klass != "" && class_exists($klass)) {
        $method = $path[1];
        //print_r("<br /> Method: $method <br />");
        if ($method != "" && method_exists($klass, $method)) {
            $func_string = $klass . "::" . $method;
            $args = array_slice($path, 2);
            try {
                call_user_func_array($func_string, $args);
            } catch (Exception $e) {
                echo '<br /> Caught exception: ',  $e->getMessage(), "\n";
                die();
            }
        } else {
           error_404(); 
        }
    } else {
        error_404();
    }  
}
