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
    
    function resourseSetupCallback(p) {
        $MEW.LOADINGFUNCTIONS.updateProgress('Setting Up Resources', p, (p / 3) + (2 / 3));
    }
    
    function loadImages(call_after) {
        console.log("Is in loadImages, before Crafty.load(urls, function(){...})")
        var urls; 
        try{
            urls = localStorage.getItem('MEWResourceURLSList');
            urls = JSON.parse(urls);
        }catch(err){
            urls = localStorage.getItem('MEWResourceURLSList');
            console.log(err);
        }
        Crafty.load(urls, function() {
            //when loaded
            console.log("Loaded Resources");
    
            call_after();
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
                loadImages(call_after);
            }
            else {
                var text = "Could not Load Resources: Contact Admin";
                $MEW.LOADINGFUNCTIONS.text.text(text);
                $MEW.LOADINGFUNCTIONS.bar.updateProgress(0);
            }
        });
        
    }
    
    function setUpResources() {
        //loads resource configuration form storage and makes crafty sprites
        if (localStorage.getItem('MEWResourceXMLSetup')){
            var resources = JSON.parse(localStorage.getItem('MEWResourceXMLSetup'));
            $MEW.WindowSkins = {};
            $MEW.PonyPartSprites = {};
            $MEW.DefaultWindowSkin = null;
            // loop for craft sprite setup
            //Crafty.sprite(params.mapw, params.maph, params.url, params.map);
            
        } else {
            //error
            console.log("error obtaining resource setup")
        }   
    }
 
    function storeResources(resources){
        //sends resources and last modified date to storage
        try{
          localStorage.setItem('MEWResourceXMLSetup', JSON.stringify(resources));
        }catch(err){
            console.log("Caching failed!", err);
            localStorage.removeItem('MEWResourceXMLDate');
            localStorage.removeItem('MEWResourceXMLURLSList');
            
           
        }
         $MEW.UseXMLInterface();
    }
    
    function reloadResourceSetup(resources) {
        storeResources(resources);
        setUpResources();
    }
    function onGetXML(xml) {
        
        var resourceParser = new XMLResourceParser(xml);
        var urls = resourceParser.getResourceURLS();
        console.log(xml, resourceParser); //testing
        console.log('[RESOURCE LOADING] IMAGE URLS: ', urls)
        localStorage.setItem('MEWResourceURLSList', JSON.stringify(urls));
        loadImages(function(){
            resourceParser.setupResources(resourseSetupCallback, storeResources);
        })       
    }
    
    function onGetXMLError(e) {
        console.log(e);
    }
    
    function onGetDate(data) {
        var needReload = false;
        if (localStorage.getItem('MEWResourceXMLDate')){
            try{
                  console.log('[RESOURCES] XML Last M Time: ',  JSON.parse(localStorage.getItem('MEWResourceXMLDate')), data); //Cannot parse that through json, it errors out.
                  if (!(JSON.parse(localStorage.getItem('MEWResourceXMLDate')) >= data)) { //No data.time anymore, only data, and I don't think it is formatted properly, atleast it doesn't seem to be.
                      needReload = true;
                  }
            }catch(err){
                console.log(err);
                console.log('[RESOURCES] XML Last M Time: ',  localStorage.getItem('MEWResourceXMLDate'), data);
                if (!(localStorage.getItem('MEWResourceXMLDate') >= data)) {
                    needReload = true;
                }
            }
        }else{
            needReload = true; //Spencer(Robo) added this
        }
        
        if (needReload) {
            //load and setup resources form network
            localStorage.setItem('MEWResourceXMLDate', JSON.stringify(data))
            $MEW.Network.GetResourceXML();
        } else {
            //load resource setup from local storage
            loadImages(setUpResources);
        }
    }
    
    function onGetDateError(e) {
        console.log(e);
    }

    $MEW.SkermishTerrainSprites = {};
    $MEW.Network = Crafty.e("NetworkResourceAccessor");
    $MEW.Network.pBind("GetResourceXMLDate", onGetDate);
    $MEW.Network.pBind("GetResourceXMLDateError", onGetDateError);
    $MEW.Network.pBind("GetResourceXML", onGetXML);
    $MEW.Network.pBind("GetResourceXMLError", onGetXMLError);
    // check if the resource setup needs to be updated
    $MEW.Network.GetResourceXMLDate();
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