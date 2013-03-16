var $MEW = {};
$MEW.URL = "http://mewdev.decisive-media.net/g";
var c = document.getElementById("MEWGame");
$MEW.Canvas = c;
$MEW.CTX = c.getContext("2d");
$MEW.WIDTH = 800;
$MEW.HEIGHT = 600;
$MEW.ScriptsRetryCounter = 0;

// DEBUG
$MEW.DEBUG = {
	DISPLAY_CRAFTY_DEBUG_BAR: false,
	DISPLAY_HIDDEN_CANVAS: false,
	
	HIDDEN_CANVAS_COUNTER: 0,
	
	//Used for displaying hidden canvas objects to the Debug Div
	ADD_DEBUG_CANVAS: function (canvas) {
		var hiddenCanvas = $(canvas);
		var addDiv = $(document.createElement('div')).attr("class", '_MEW_HIDDEN_CANVAS_DIV_' + this.HIDDEN_CANVAS_COUNTER);	
		addDiv.append('<div id="_MEW_HIDDEN_CANVAS_CLOSE_' + this.HIDDEN_CANVAS_COUNTER + '">Close</div><br />');
		addDiv.append(hiddenCanvas);
		addDiv.appendTo("#MEWDebugDiv");
		var removedivfunc = function(counter) {
			return function() {
	     		$("._MEW_HIDDEN_CANVAS_DIV_" + counter).remove();
	   		};
	   	}(this.HIDDEN_CANVAS_COUNTER);
		$("#_MEW_HIDDEN_CANVAS_CLOSE_" + this.HIDDEN_CANVAS_COUNTER).click(removedivfunc);	
	   	this.HIDDEN_CANVAS_COUNTER ++;
	}
};

// for global varibles that we want to store but not clutter the $MEW name space with
$MEW.Global = {};

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
            if ($MEW.ScriptsRetryCounter >= 3) {
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

$MEW.EvalScript = function(script){
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
    $MEW.ScriptsRetryCounter = 0;
    try {
    	eval(script);
    } catch (e) {
    	console.log("Error Phrasing Game Code: " + $MEW.scripts[$MEW.CurrentLoadingScript], e.message, e)
    }
    
    //remember that eval doesn't give a proper message in case of a syntax error
};

$MEW.LoadScript = function(name) {
    $.post($MEW.URL + '/game/action/', 
          {controller: 'code', 
           action: 'file', 
           pass: JSON.stringify([name]),
           named: JSON.stringify({'' : ''}),
           post: JSON.stringify([null])}, 
           $MEW.EvalScript
          ).error($MEW.GameLoadErrorFunc(function(){$MEW.LoadScript(name)}));
          
};

$MEW.onDocLoad = function() {
    Crafty.init(800, 600);
    Crafty.canvas.context = $MEW.CTX;
    Crafty.canvas._canvas = $MEW.Canvas;
    if ($MEW.DEBUG.DISPLAY_CRAFTY_DEBUG_BAR) {
	    Crafty.modules({ 'crafty-debug-bar': 'release' }, function () {
	        Crafty.debugBar.show();
	    });
    }
    $MEW.LoadScript("GameLoader");
    
};

$(document).ready($MEW.onDocLoad);
//@ sourceURL=/Game/bootstrap.js