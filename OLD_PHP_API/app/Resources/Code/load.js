var $MEW = {};
$MEW.URL = "http://mewdev.decisive-media.net/g";
var c = document.getElementById("MEWGame");
$MEW.Canvas = c;
$MEW.CTX = c.getContext("2d");
$MEW.WIDTH = 800;
$MEW.HEIGHT = 600;
$MEW.ScriptsRetryCounter = 0;

// For the zoom demo
$MEW.px = 13;
$MEW.py = 4;

$MEW.clear = function() {
    $MEW.CTX.clearRect(0, 0, $MEW.WIDTH, $MEW.HEIGHT);
};

$MEW.GameLoadErrorFunc = function(retryCB) {
    return function(xhr, status, error){
        $MEW.clear();
        $MEW.CTX.fillStyle="#000000";
        $MEW.CTX.font="14px sans-serif";
        var text = "";
        if (error == "Forbidden") {
            text = "Failed to load game (403 Forbiddenn): Are you logged in?";
		} else if (error == "Not Found") {
            text = "Failed to load game (404 Not Found): Files are missing on the webserver, contact the admin immediately";
        } else {
            if ($MEW.ScriptsRetryCounter >= 5) {
                text = "Failed to load game (" + status + " : " + error + "): Contact The admin to report this error";
            } else {
                $MEW.ScriptsRetryCounter += 1;
                retryCB();
            }
        }
        var textWidth = $MEW.CTX.measureText(text).width;
        var x = ($MEW.WIDTH - textWidth) / 2;
        var y = ($MEW.HEIGHT - 14) / 2 - 14;
        $MEW.CTX.fillText(text, x, y, textWidth);
    };
};

$MEW.LoadScript = function(script){
    //adds code block
    /*var codeDiv = document.getElementById('CodeDiv');
    var scriptBlock = document.createElement("script");
    scriptBlock.language = "javascript";
    scriptBlock.type = "text/javascript";
    scriptBlock.defer = false;
    scriptBlock.text = script;
    codeDiv.appendChild(scriptBlock);

    */
    //runs eval '//@ sourceURL=name.js' gives the script a name
    // 
    eval(script);
    //remember that eval doesn't give a proper message in case of a syntax error
};

$MEW.LoadScripts = function() {
    $.post($MEW.URL + '/game/action/', 
          {controller: 'code', 
           action: 'file', 
           pass: JSON.stringify(["GameLoader"]),
           named: JSON.stringify({'' : ''}),
           post: JSON.stringify([null])}, 
           $MEW.LoadScript
          ).error($MEW.GameLoadErrorFunc($MEW.LoadScripts));
          
}

$MEW.onDocLoad = function() {
    $MEW.LoadScripts();
    
};

$(document).ready($MEW.onDocLoad);
//@ sourceURL=/Game/load.js
