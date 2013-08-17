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
        this.Send("GetInterfaceXML", {});
    }
});

$MEW.LoadResources = function(progress_cb) {

    $MEW.Network.requires('NetworkResourceAccessor')

    var self = {}

    self.call_after = function() {
        Crafty.scene('User')
    }
    
    self.have_local_cache = function() {
        var flag = false
        if (localStorage.getItem('MEWResourceURLSList') && 
            localStorage.getItem('MEWResourceXMLDate') && 
            localStorage.getItem('MEWResourceXMLSetupWindowSkins') &&
            localStorage.getItem('MEWResourceXMLSetupPonyPartSprites') &&
            localStorage.getItem('MEWResourceXMLSetupDefaultWindowSkin') &&
            localStorage.getItem('MEWResourceXMLSetupSkermishTerrainSprites') &&
            localStorage.getItem('MEWResourceXMLSetupSprites') 
            ) {
            flag = true
        }
        return flag
    }

    self.load_from_cache = function() {
        var urls = JSON.parse(localStorage.getItem('MEWResourceURLSList'))
        Crafty.load(urls, function() {
            //when loaded
            console.log("Loaded Resources");

            progress_cb('Settingup Resources', 0.1, (0.1 / 3) + (2 / 3))

            setTimeout(function(){

                var resources = {}
                resources.WindowSkins = JSON.parse(LZString.decompress(localStorage.getItem('MEWResourceXMLSetupWindowSkins')))
                resources.PonyPartSprites = JSON.parse(LZString.decompress(localStorage.getItem('MEWResourceXMLSetupPonyPartSprites')))
                resources.DefaultWindowSkin = JSON.parse(LZString.decompress(localStorage.getItem('MEWResourceXMLSetupDefaultWindowSkin')))
                resources.SkermishTerrainSprites = JSON.parse(LZString.decompress(localStorage.getItem('MEWResourceXMLSetupSkermishTerrainSprites')))
                resources.Sprites = JSON.parse(LZString.decompress(localStorage.getItem('MEWResourceXMLSetupSprites')))

                $MEW.WindowSkins = resources.WindowSkins
                $MEW.PonyPartSprites = resources.PonyPartSprites
                $MEW.DefaultWindowSkin = resources.DefaultWindowSkin
                $MEW.SkermishTerrainSprites = resources.SkermishTerrainSprites
                $MEW.Sprites = resources.Sprites

                _($MEW.Sprites).each( function( sprite, index, sprites ) {
                    Crafty.sprite.apply(Crafty, sprite)
                })

                progress_cb('Settingup Resources', 1, 1)
                self.call_after();
            }, 10)
            
        },
    
        function(e) {
            //progress
            var p = e.percent / 100.0
            progress_cb('Loading Resources', p, (p / 3) + (1 / 3))
        },
    
        function(e) {
            //uh oh, error loading
            console.log("Error Loading resources:")
            console.log(e)
            $MEW.ResourceRetryCounter += 1
            if ($MEW.ResourceRetryCounter < 3) {
                self.load_from_cache()
            }
            else {
                progress_cb("Could not Load Resources: Contact Admin", 0 , 0)
            }
        });
    }

    self.load_from_network = function(update_date) {
        function startWorker(xml) {
            var resources = {
                 SkermishTerrainSprites: {},
                 WindowSkins: [],
                 PonyPartSprites: {},
                 DefaultWindowSkin: '',
                 Sprites: []
            }

            var worker = new Worker($MEW.RESOURCE_URL + '/code/worker/ResourceParserWorker.js')

            function done() {
                localStorage.setItem('MEWResourceXMLSetupWindowSkins', LZString.compress(JSON.stringify(resources.WindowSkins)))
                localStorage.setItem('MEWResourceXMLSetupPonyPartSprites', LZString.compress(JSON.stringify(resources.PonyPartSprites)))
                localStorage.setItem('MEWResourceXMLSetupDefaultWindowSkin', LZString.compress(JSON.stringify(resources.DefaultWindowSkin)))
                console.log(JSON.stringify(resources.SkermishTerrainSprites))
                console.log(LZString.decompress(LZString.compress(JSON.stringify(resources.SkermishTerrainSprites))))
                localStorage.setItem('MEWResourceXMLSetupSkermishTerrainSprites', LZString.compress(JSON.stringify(resources.SkermishTerrainSprites)))
                localStorage.setItem('MEWResourceXMLSetupSprites', LZString.compress(JSON.stringify(resources.Sprites)))

                $MEW.WindowSkins = resources.WindowSkins
                $MEW.PonyPartSprites = resources.PonyPartSprites
                $MEW.DefaultWindowSkin = resources.DefaultWindowSkin
                $MEW.SkermishTerrainSprites = resources.SkermishTerrainSprites
                $MEW.Sprites = resources.Sprites
                _($MEW.Sprites).each( function( sprite, index, sprites ) {
                    Crafty.sprite.apply(Crafty, sprite)
                })
                localStorage.setItem('MEWResourceXMLDate', update_date)
                self.call_after()
            }

            function sendXML() {
                var xmlString = (new XMLSerializer()).serializeToString(xml);
                worker.postMessage({code : 'start', data : xmlString})
            }

            function loadImages(urls) {
                localStorage.setItem('MEWResourceURLSList', JSON.stringify(urls));
                Crafty.load(urls, function() {
                    //when loaded
                    console.log("Loaded Resources");

                    progress_cb('Settingup Resources', 0, (0 / 3) + (2 / 3))
                    
                    worker.postMessage({code : 'setup', data : null})
                },
            
                function(e) {
                    //progress
                    var p = e.percent / 100.0
                    progress_cb('Loading Resources', p, (p / 3) + (1 / 3))
                },
            
                function(e) {
                    //uh oh, error loading
                    console.log("Error Loading resources:")
                    console.log(e)
                    $MEW.ResourceRetryCounter += 1
                    if ($MEW.ResourceRetryCounter < 3) {
                        loadImages(urls)
                    }
                    else {
                        progress_cb("Could not Load Resources: Contact Admin", 0 , 0)
                    }
                });

            }
            
            var messagemap = {}
            worker.addEventListener('message', function(e) {
                var msg = e.data;
                var key = JSON.stringify(msg)
                //if (messagemap[key]) return
                messagemap[key] = true  
                switch (msg.code) {
                    case 'started':
                        sendXML()
                        break
                    case 'urls':
                        loadImages(msg.data)
                        break
                    case 'progress':
                        progress_cb('Setting Up Resources', msg.data, (msg.data / 3) + (2 / 3))
                        break
                    case 'SkermishTerrainSprite':
                        resources.SkermishTerrainSprites[msg.data[0]] = msg.data[1]
                        break
                    case 'PonyPartSprite':
                        resources.PonyPartSprites[msg.data[0]] = [msg.data[1], msg.data[2], msg.data[3], msg.data[4], msg.data[5]]
                        break
                    case 'Sprite':
                        resources.Sprites.push(msg.data)
                        break
                    case 'WindowSkin':
                        resources.WindowSkins[msg.data[0]] = [
                            msg.data[1],
                            msg.data[2],
                            msg.data[3],
                            msg.data[4],
                            msg.data[5],
                            msg.data[6],
                            msg.data[7]
                        ]
                        resources.DefaultWindowSkin = msg.data[0]
                        break
                        
                    case 'done':
                        done()
                        worker.postMessage({code : 'stop', data : null})
                        break
                    default:
                        console.log("[RESOURCE WORKER] Message: ", msg)
                }
            }, false);

        }

        function onGetXML(xml) {
            startWorker(xml)    
        }
        
        function onGetXMLError(e) {
            console.log("Error Loading resources:")
            console.log(e)
        }

        $MEW.Network.pBind("GetResourceXML", onGetXML)
        $MEW.Network.pBind("GetResourceXMLError", onGetXMLError)
        $MEW.Network.GetResourceXML();
    }

    self.onGetDate = function(data) {
        if (self.have_local_cache()) {
            var needReload = false;
            ourTime = new Date(parseInt(localStorage.getItem('MEWResourceXMLDate')))
            theirTime = new Date(parseInt(data))
            console.log('[RESOURCES] XML Last M Time: ',  theirTime, ourTime);
            if (theirTime > ourTime) {
                needReload = true
            }    
            if (needReload) {
                //load and setup resources form network
                self.load_from_network(data)
            } else {
                //load resource setup from local storage
                self.load_from_cache()
            }
        } else {
            self.load_from_network(data)
        }
    }
    
    self.onGetDateError = function(e) {
        console.log('[RESOURCES] Error getting resource last modified time: ', e)
    }

    $MEW.Network.pBind("GetResourceXMLDate", self.onGetDate)
    $MEW.Network.pBind("GetResourceXMLDateError", self.onGetDateError)
    // check if the resource setup needs to be updated
    $MEW.Network.GetResourceXMLDate();

};

$MEW.doResourceLoad = function(progress_cb, ImageURLS, resourceWorker) {
    Crafty.load(ImageURLS, function() {
        //when loaded
        console.log("Loaded Resources")

        // set up the resources and get the display to update
        resourceWorker.postMessage({msg:'start', data:null})
    },

    function(e) {
        //progress
        progress_cb(e.percent / 100.0)
    },

    function(e) {
        //uh oh, error loading
        console.log("Error Loading resources:");
        console.log(e)
        $MEW.ResourceRetryCounter += 1
        if ($MEW.ResourceRetryCounter < 3) {
            $MEW.doResourceLoad(progress_cb, ImageURLS)
        }
        else {
            var text = "Could not Load Resources: Contact Admin";
            $MEW.LOADINGFUNCTIONS.text.text(text)
            $MEW.LOADINGFUNCTIONS.bar.updateProgress(0)
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
    $MEW.IsUsingInterfaceXML = true
    Crafty.scene("User")
} 