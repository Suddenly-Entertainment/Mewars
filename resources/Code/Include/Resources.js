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

    GetResourceXMLDate: function() {
        this.Send("GetResourceXMLDate", {});
    },
    
    GetInterfaceXML: function() {
        this.Send("GetInterfaceXML", {})
    }
});

$MEW.LoadResources = function(progress_cb) {
    var setUpResources = function(){
        //loads resource configuration form storage and makes crafty sprites
        if (localStorage.getItem('MEWResourceXMLSetup')){
            var resources = JSON.parse(localStorage.getItem('MEWResourceXMLSetup'));
            // loop for craft sprite setup
        } else {
            //error
            console.log("error obtaining resource setup")
        }
        
    };
    var storeResources = function(resources){
        //sends resources and last modified date to storage
        localStorage.setItem('MEWResourceXMLSetup', JSON.stringify(resources));
        
    };
    var onGetXml = function(xml) {
        var resourceParser = new XMLResourceParser(xml);
        $MEW.WindowSkins = {};
        $MEW.PonyPartSprites = {};
        $MEW.DefaultWindowSkin = null;
        resourceParser.setUpResources(progress_cb, storeResources);
    };
    var onGetXmlError = function(e) {
        console.log(e);
    };
    var onGetDate = function(data) {
        if (localStorage.getItem('MEWResourceXMLDate')){
            if (JSON.parse(localStorage.getItem('MEWResourceXMLDate')) > data.time){
                localStorage.setItem('MEWResourceXMLDate', JSON.stringify(data.time))
                //load resource setup from local storage
            } else {
                //load and setup resources form network
            }
        } else {
            //load and setup resources form network
        }
    };
    var onGetDateError = function(e) {
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
    $MEW.Network.pBind("GetResourceXMLDate", onGetDate);
    $MEW.Network.pBind("GetResourceXMLDateError", onGetDateError);
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