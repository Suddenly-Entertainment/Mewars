/*global Crafty*/
// Set up namespace
var $MEW = {};
// Set up URLs
if (document.location.hostname === "localhost") {
    $MEW.API_URL = "http://localhost:3000";
    $MEW.NODE_URL = "http://localhost:5000";
    $MEW.RESOURCE_URL = "http://localhost/resources";
} else if (document.location.hostname === "mew.ryex.c9.io") {
    $MEW.API_URL = "http://mew.ryex.c9.io";
    $MEW.NODE_URL = "http://mew_node.ryex.c9.io";
    $MEW.RESOURCE_URL = "http://mew_resource.ryex.c9.io";
} else if (document.location.hostname === "api2.equestrianwars.com") {
    $MEW.API_URL = "http://api2.equestrianwars.com";
    $MEW.NODE_URL = "http://node2.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
} else  {
    $MEW.API_URL = "http://api.equestrianwars.com";
    $MEW.NODE_URL = "http://node.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
}

console.log($MEW.API_URL, $MEW.NODE_URL, $MEW.RESOURCE_URL);

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
        this.getIncludeMode = function () {
            return SCRIPT_INCLUDE_MODE;
        };
        this.setIncludeMode = function (mode) {
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

$MEW.DrawErrorText = function (text) {
    console.log("Error: " + text);
    $MEW.clear();
    $MEW.CTX.fillStyle="#000000";
    $MEW.CTX.font="14px sans-serif";
    var lines = text.split('\n');
    var textHeight = 14;
    var totalTextHeight = textHeight * lines.length;
    _(lines).each( function( line, index, lines ) {
        var textWidth = $MEW.CTX.measureText(line).width;
        var x = ($MEW.WIDTH - textWidth) / 2;
        var y = ($MEW.HEIGHT - totalTextHeight) / 2 - textHeight + textHeight * index;
        $MEW.CTX.fillText(line, x, y, textWidth);
    });
};

// when we have an error loading the game code
$MEW.GameLoadErrorFunc = function(retryCB, extra_text) {
    return function(xhr, status, error){
        var text = "";
        if (error == "Forbidden") {
            text = "Failed to load game (403 Forbiddenn): Are you logged in?" + "\n" + extra_text;
        } else if (error == "Not Found") {
            text = "Failed to load game (404 Not Found): Files are missing on the webserver, contact the admin immediately" + "\n" + extra_text;
        } else {
            if ($MEW.ScriptsRetryCounter >= 3) {
                text = "Failed to load game (" + status + " : " + error + "): Contact the admin to report this error" + "\n" + extra_text;
            } else {
                $MEW.ScriptsRetryCounter += 1;
                retryCB();
            }
        }
        $MEW.DrawErrorText(text);
        console.log(error.message, error.stack);
    };
};

// to load a script for the game into the locla namespace
$MEW.EvalScript = function(script, name){
    if ($MEW.DEBUG.getIncludeMode() === "EVAL") {
        //runs eval '//@ sourceURL=name.js' gives the script a name
        //remember that eval doesn't give a proper message in case of a syntax error
        var source = '\n //@ sourceURL=' + $MEW.RESOURCE_URL + '/code/include/' + name;
        $MEW.ScriptsRetryCounter = 0;
        try {
            eval(script + source);
        } catch (e) {
            console.log("Error Phrasing Game Code: " + $MEW.scripts[$MEW.CurrentLoadingScript], e.message, e);
        }
    } else if ($MEW.DEBUG.getIncludeMode() === "DIV") {
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
    var ajax = $.ajax(
        {
            type: 'GET',
            url: $MEW.RESOURCE_URL + '/code/loader',
            context: this,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        }
    )
    ajax.done(function (script) {$MEW.EvalScript(script, "loader");})
    ajax.fail($MEW.GameLoadErrorFunc(function(){$MEW.GetGameLoader();}, "Error obtaining the game loader"));
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
        var text = "" +
            "WARNING: You have selected not to load Mock Equestrian Wars. \n" +
            "If you want to load the game, reload the page and chouse 'yes'.";
        $MEW.DrawErrorText(text);
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
