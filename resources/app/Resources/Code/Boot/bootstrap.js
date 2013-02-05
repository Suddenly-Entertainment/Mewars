// Set up namespace
var $MEW = {};
// Set up URLs
if (document.location.hostname === "localhost") {
    $MEW.URL = "http://localhost:3000";
    $MEW.NODE_URL = "http://localhost:5000";
} else if (document.location.hostname === "api2.equestrianwars.com") {
    $MEW.URL = "http://api2.equestrianwars.com";
    $MEW.NODE_URL = "http://node2.equestrianwars.com";
} else  {
    $MEW.URL = "http://api.equestrianwars.com";
    $MEW.NODE_URL = "http://node.equestrianwars.com";
}
$MEW.RESOURCE_URL = "http://re.equestrianwars.com";
// get our canvas
var c = document.getElementById("MEWGame");
$MEW.Canvas = c;
$MEW.CTX = c.getContext("2d");
// width height of screen
$MEW.WIDTH = 800;
$MEW.HEIGHT = 600;
// retry counter for getting scripts
$MEW.ScriptsRetryCounter = 0;

// DEBUG
(function () {
    function DEBUG() {
        var SCRIPT_INCLUDE_MODE = "EVAL";
        this.getIncludMode = function () {
            return SCRIPT_INCLUDE_MODE;
        };
        this.setIncludMode = function (mode) {
            SCRIPT_INCLUDE_MODE = mode;
        };

        var DISPLAY_CRAFTY_DEBUG_BAR = false;
        this.getDisplayCraftyDebugBar = function () {
            return DISPLAY_CRAFTY_DEBUG_BAR;
        };
        this.setDisplayCraftyDebugBar = function (value) {
            DISPLAY_CRAFTY_DEBUG_BAR = value;
        };
        var DISPLAY_HIDDEN_CANVAS = false;
        this.getDisplayHiddenCanvas = function () {
            return DISPLAY_HIDDEN_CANVAS;
        };
        this.setDisplayHiddenCanvas = function (value) {
            DISPLAY_HIDDEN_CANVAS = value;
        };
        
        this.HIDDEN_CANVAS_COUNTER = 0;

        this.HIDDEN_CANVAS_OUT = 0;
        
        //Used for displaying hidden canvas objects to the Debug Div
        this.AddDebugCanvas = function (canvas) {
            var hiddenCanvas = $(canvas);
            hiddenCanvas.css("background-color", "#FFFFFF");
            var addDiv = $(document.createElement('div')).attr("id", '_MEW_HIDDEN_CANVAS_C_' + this.HIDDEN_CANVAS_COUNTER + '_H3');
            var addh3 = $(document.createElement('h3')).attr("id", '_MEW_HIDDEN_CANVAS_C_' + this.HIDDEN_CANVAS_COUNTER + '_DIV');  
            addDiv.append('<a href="" id="_MEW_HIDDEN_CANVAS_CLOSE_' + this.HIDDEN_CANVAS_COUNTER + '">Close</a><br />');
            addh3.append('Canvas #' + this.HIDDEN_CANVAS_COUNTER);
            addDiv.append(hiddenCanvas);
            addh3.appendTo("#DebugCanvasDiv");
            addDiv.appendTo("#DebugCanvasDiv");
            var that = this;
            function removedivfunc(counter) {
                return function() {
                    $("#_MEW_HIDDEN_CANVAS_C_" + counter + '_H3').remove();
                    $("#_MEW_HIDDEN_CANVAS_C_" + counter + '_DIV').remove();
                    if (this.HIDDEN_CANVAS_OUT > 0) {$('#DebugCanvasDiv').accordion("destroy");}
                    $('#DebugCanvasDiv').accordion();
                    that.HIDDEN_CANVAS_OUT --;
                    return false;
                };
            }
            $("#_MEW_HIDDEN_CANVAS_CLOSE_" + this.HIDDEN_CANVAS_COUNTER).click(removedivfunc(this.HIDDEN_CANVAS_COUNTER));  
            if (this.HIDDEN_CANVAS_OUT > 0) {$('#DebugCanvasDiv').accordion("destroy");}
            $('#DebugCanvasDiv').accordion();
            this.HIDDEN_CANVAS_COUNTER ++;
            this.HIDDEN_CANVAS_OUT ++;
        };
    
        this.EnableDebugCanvas = function () {
            var canvas_debug_div = $(document.createElement('div'));
            var canvas_div = $(document.createElement('div')).attr("id", 'DebugCanvasDiv');
            canvas_debug_div.append(canvas_div);
            canvas_debug_div.appendTo('#MEWDebugDiv');

            $('#MEWCanvasDebugShowHide').accordion();
        };
    }

    $MEW.DEBUG = new DEBUG();
    
})();

// for global varibles that we want to store but not clutter the $MEW name space with
$MEW.Global = {};

// For the zoom demo
$MEW.px = 13;
$MEW.py = 4;

// clears the canvas
$MEW.clear = function() {
    $MEW.CTX.clearRect(0, 0, $MEW.WIDTH, $MEW.HEIGHT);
};

// when we have an error loading the game code
$MEW.GameLoadErrorFunc = function(retryCB, extra_text) {
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
                text = "Failed to load game (" + status + " : " + error + "): Contact the admin to report this error";
            } else {
                $MEW.ScriptsRetryCounter += 1;
                retryCB();
            }
        }
        
        var textWidth = $MEW.CTX.measureText(text).width;
        var x = ($MEW.WIDTH - textWidth) / 2;
        var y = ($MEW.HEIGHT - 14) / 2 - 14;
        $MEW.CTX.fillText(text, x, y, textWidth);
        if (extra_text) {
            textWidth = $MEW.CTX.measureText(extra_text).width;
            x = ($MEW.WIDTH - textWidth) / 2;
            y = (($MEW.HEIGHT - 14) / 2 - 14) + 20;
            $MEW.CTX.fillText(extra_text, x, y, textWidth);
        }
    console.log(error.message, error.stack);
    };
};

// to load a script for the game into the locla namespace
$MEW.EvalScript = function(script, name){
    if ($MEW.DEBUG.SCRIPT_INCLUDE_MODE == "EVAL") {
        //runs eval '//@ sourceURL=name.js' gives the script a name
        //remember that eval doesn't give a proper message in case of a syntax error
        source = '\n //@ sourceURL=' + $MEW.RESOURCE_URL + '/code/include/' + name;
        $MEW.ScriptsRetryCounter = 0;
        try {
            eval(script + source);
        } catch (e) {
            console.log("Error Phrasing Game Code: " + $MEW.scripts[$MEW.CurrentLoadingScript], e.message, e);
        }
    } else if ($MEW.DEBUG.SCRIPT_INCLUDE_MODE == "DIV") {
        //adds code block
        var codeDiv = document.getElementById('CodeDiv');
        var scriptBlock = document.createElement("script");
        scriptBlock.language = "javascript";
        scriptBlock.type = "text/javascript";
        scriptBlock.title = $MEW.RESOURCE_URL + '/code/include/' + name;
        scriptBlock.defer = false;
        scriptBlock.text = script;
        codeDiv.appendChild(scriptBlock);
    }
    
};

$MEW.AddScriptDiv = function(url) {
    var codeDiv = document.getElementById('CodeDiv');
    var scriptBlock = document.createElement("script");
    scriptBlock.language = "javascript";
    scriptBlock.type = "text/javascript";
    scriptBlock.defer = false;
    scriptBlock.src = url;
    codeDiv.appendChild(scriptBlock);
};

// to get a script for the game from the resourcs server
$MEW.GetGameLoader = function() {
    $.get($MEW.RESOURCE_URL + '/code/loader')
    .success(function (script) {$MEW.EvalScript(script, "loader");})
    .error($MEW.GameLoadErrorFunc(function(){$MEW.GetGameLoader();}, "Error obtaining the game loader"));
};

$MEW.onDocLoad = function() {

    var loadGameflag = false;

    function StartGame () {
        Crafty.init(800, 600);
        Crafty.canvas.context = $MEW.CTX;
        Crafty.canvas._canvas = $MEW.Canvas;
        if ($MEW.DEBUG.getDisplayCraftyDebugBar()) {
            Crafty.modules({ 'crafty-debug-bar': 'release' }, function () {
                Crafty.debugBar.show();
            });
        }
        if ($MEW.DEBUG.getDisplayHiddenCanvas()) {
            $MEW.DEBUG.EnableDebugCanvas();
        }
        $MEW.GetGameLoader();
    }

    function dialogYes () {
        loadGameflag = true;
        $( this ).dialog( "close" );
    }

    function dialogNo () {
        loadGameflag = false;
        $( this ).dialog( "close" );
    }

    function dialogClose () {
        if (loadGameflag) {
            StartGame();
        }
    }

    function AddWarnDialog () {
        
        var addDiv = $(document.createElement('div')).attr({
            "id": '_MEW_LOAD_DIALOG',
            "title": "Load Mock Equestrian Wars?"
        });
        var content = $(document.createElement('p'));
        content.append(
            '<b>Mock Equestrian Wars</b> is a browserside game that runs in JavaScript,' +
            ' it requires a modern browser like Chrome or Firefox <br/> <br/>' +
            'The game will download sevral Megabytes of data in code and resources to be ' +
            ' placed in memory. Your browser may choose to cache this data for faster' +
            ' subsequent loads depending on your settings. <br/> <br/>' +
            '<b>Would you like to Load Mock Equestrian Wars?</b>'
        );
        addDiv.append(content);
        addDiv.appendTo("#GameDiv");
        $( "#_MEW_LOAD_DIALOG" ).dialog({
            autoOpen: false,
            width: 400,
            buttons: [
                {
                    text: "Yes",
                    click: dialogYes
                },
                {
                    text: "No",
                    click: dialogNo
                }
            ],
            close: dialogClose
        });
        $( "#_MEW_LOAD_DIALOG" ).dialog("open");
    }
    
    AddWarnDialog();
    
};

$(document).ready($MEW.onDocLoad);
