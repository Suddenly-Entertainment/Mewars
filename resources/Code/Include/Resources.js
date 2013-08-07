/*global $MEW, Crafty, $, _, XMLResourceParser, XMLInterfaceParser*/
// retry counter for getting resources
$MEW.ResourceRetryCounter = 0;

Crafty.c("NetworkResourceAccessor", {
    init: function() {
        this.requires("Network");
    },

    GetResourceXML: function() {
        this.Send("GetResourceXML", {});
    },

    GetInterfaceXML: function() {
        this.Send("GetInterfaceXML", {})
    }
});

Crafty.c("CrossDomainWorkers", {
    
    workers: {},

    init: function () {
        var that = this;
        
        window.onmessage = function(evt){
            try {
                that.trigger(evt.data.from, evt.data.msg);
            } catch (e) {
                console.log(e.message, e.stack);
            }
        }      
    },
    
    addWorker: function(url, name) {
        var codeDiv = document.getElementById('CodeDiv');
        var workerBlock = document.createElement("script");
        workerBlock.src = url
        codeDiv.appendChild(workerBlock);
        this.workers[name] = workerBlock;
    },
    
    message: function(name, data) {
        this.workers[name].postMessage(data, $MEW.RESOURCE_URL)
    }
});

$MEW.LoadResources = function(progress_cb) {
    var onGetXml = function(xml) {
        var resourceWorker = new Worker($MEW.RESOURCE_URL + '/code/Workers/XMLResource.js');
        resourceWorker.addEventListener('message', function(e) {
            var data = e.data;
            switch (data.msg) {
                case 'error':
                    var errortxt = "[LOADING] Error in XML Resource worker";
                    console.log(errortxt, data.data.message, data.data);
                    break;
                case 'geturls':
                    setTimeout(function() {
                        var imageURLS = data.data;
                        $MEW.doResourceLoad(progress_cb, imageURLS, resourceWorker);
                    }, 0);
                    break;
                case 'progress':
                    var p = data.data;
                    $MEW.LOADINGFUNCTIONS.updateProgress("Setting Up Resources", p, (p / 3) + (2 / 3) )
                    break;
                case 'done':
                    console.log(data.data);
                    break;
                default:
                console.log('[LOADING] Unknown message from Resource parser');
            }
        }, false);
        resourceWorker.postMessage({msg:'setup', data:xml})
        resourceWorker.postMessage({msg:'geturls', data:null})
        $MEW.WindowSkins = {};
        $MEW.PonyPartSprites = {};
        $MEW.DefaultWindowSkin = null;
    };
    var onXmlError = function(e) {
        console.log(e);
    };

    var InterfaceResourceURL = $MEW.RESOURCE_URL + "/resource/image/2/";
    Crafty.sprite(800, 600, InterfaceResourceURL + 'world_map_concept_mysticalpha-800.jpg', {
        WorldMapConcept: [0, 0]
    });
    Crafty.sprite(800, 600, InterfaceResourceURL + 'mew_login_screen.png', {
        LoginScreenBackground: [0, 0]
    });

    $MEW.SkermishTerrainSprites = {};
    $MEW.Network = Crafty.e("NetworkResourceAccessor");
    $MEW.Network.pBind("GetResourceXML", onGetXml);
    $MEW.Network.pBind("GetResourceXMLError", onXmlError);
    $MEW.Network.GetResourceXML();
};

$MEW.doResourceLoad = function(progress_cb, ImageURLS, resourceWorker) {
    Crafty.load(ImageURLS, function() {
        //when loaded
        console.log("Loaded Resources");

        // set up the resources and get the display to update
        resourceWorker.postMessage({msg:'start', data:null})
    },

    function(e) {
        //progress
        progress_cb(e.percent / 100.0);
    },

    function(e) {
        //uh oh, error loading
        console.log("Error Loading resources:");
        console.log(e);
        $MEW.ResourceRetryCounter += 1
        if ($MEW.ResourceRetryCounter < 3) {
            $MEW.doResourceLoad(progress_cb, ImageURLS);
        }
        else {
            var text = "Could not Load Resources: Contact Admin";
            $MEW.LOADINGFUNCTIONS.text.text(text);
            $MEW.LOADINGFUNCTIONS.bar.updateProgress(0);
        }
    });
};

$MEW.UseXMLInterface = function() {
   /* var onGetXml = function(xml) {
        console.log(xml);
        alert('XML recieved!  Glorious days!');

        XMLInterfaceParser(xml);
        Crafty.scene("User");
    };
    var onXmlError = function(e) {
        alert(e.error);
    };

   // $MEW.Network = Crafty.e("NetworkResourceAccessor");
    $MEW.Network.pBind("GetInterfaceXML", onGetXml);
    $MEW.Network.pBind("GetInterfaceXMLError", onXmlError);
    $MEW.Network.GetInterfaceXML();*/
    $MEW.IsUsingInterfaceXML = true;
    Crafty.scene("User");
}