// Set up namespace
var $MEW = {};
// Set up URLs
if (location.hostname === "localhost") {
    $MEW.API_URL = "http://localhost:3000";
    $MEW.NODE_URL = "http://localhost:3000";
    $MEW.RESOURCE_URL = "http://localhost:3000/resource";
} else if (location.hostname === 'mew-mew.rhcloud.com') {
    $MEW.API_URL = "http://mew-mew.rhcloud.com";
    $MEW.NODE_URL = "http://mew-mew.rhcloud.com";
    $MEW.RESOURCE_URL = "http://mew-mew.rhcloud.com/resource";
} else if (location.hostname === "api2.equestrianwars.com") {
    $MEW.API_URL = "http://api2.equestrianwars.com";
    $MEW.NODE_URL = "http://node2.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
} else  {
    $MEW.API_URL = "http://api.equestrianwars.com";
    $MEW.NODE_URL = "http://node.equestrianwars.com";
    $MEW.RESOURCE_URL = "http://re.equestrianwars.com";
}
var workerURLS = 'WORKER URLS: ' + $MEW.API_URL + ' ' + $MEW.NODE_URL + ' ' + $MEW.RESOURCE_URL
postMessage(workerURLS)

function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}

//load sprintf

importScripts($MEW.RESOURCE_URL + '/code/file/sprintf.js')

importScripts($MEW.API_URL + '/js/lib/underscore-min.js')
importScripts($MEW.API_URL + '/js/lib/xmlsax.js')
importScripts($MEW.API_URL + '/js/lib/xmlw3cdom.js')

/******************************************************************
 * Resource Parsing
 ******************************************************************/
 
 

var $XMLResourceNodeParsers = {
    sprintf: function (resource, xml) {
        var node = new XMLsprintfNode(resource, xml);
        return node;
    },
    sprite: function (resource, xml) {
        var node = new XMLResourceSpriteNode(resource, xml);
        return node;

    },
    loop: function (resource, xml) {
        var node = new XMLResourceLoopNode(resource, xml);
        return node;
    },
    windowskin: function (resource, xml) {
        var node = new XMLResourceWindowSkinNode(resource, xml);
        return node;
    }

};
//$XMLResourceNodeDelayParsers = {};

function XMLsprintfNode(resource, xml) {
    var self = this
    self.resource = resource
    self.nodeType = 'sprintf'    
    self.name = "";
    self.func = "";
    
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        if(val) self[atter.nodeName.toLowerCase()] = val;
    }
    self.evaluate = function (map) {
        var result;
        map['mod'] = '%';
        var s = sprintf(String(self.func), map);
        result = eval(s);
        return result;
    };
    self.map =function(map) {
        map[self.name] = self.evaluate(map);
    };
    self.exec = function (map) {
        self.map(map);
    };
}

function XMLResourceURLNode(xml) {
    var self = this    
    self.name = "";
    self.value = "";
    self.nodeType = 'url'  
    
    
    var URL_MAP = {
        RESOURCE_URL: $MEW.RESOURCE_URL,
        NODE_URL: $MEW.NODE_URL,
        API_URL: $MEW.API_URL
    };

    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        if (atter.nodeName.toLowerCase() === 'name') {
            self.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'value') {
            self.value = sprintf(String(atter.nodeValue), URL_MAP);
        }
    }
}

function XMLResourceTypeNode(xml, map) {
    var self = this    
    self.name = "";
    self.url = "";
    self.nodeType = 'type'
    self.filetype = ""
    
    
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        if (atter.nodeName.toLowerCase() === 'name') {
            self.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'url') {
            self.url = map[atter.nodeValue];
        }
    }
}

function XMLResourceSpriteNode(resource, xml) {
    var self = this
    self.nodeType = 'sprite'
    self.resource = resource   
    self.name = "";
    self.mapx = "";
    self.mapy = "";
    self.mapw = "";
    self.maph = "";
    self.url = "";
    self.id = -1;
    
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        var val = atter.nodeValue
        if(!isNaN(val)) {
            val = parseFloat(val)
        }
        if(val) self[atter.nodeName.toLowerCase()] = val;
    }
    self.getMappedParams = function (map) {
        var params = {};
        params.name = sprintf(String(self.name), map);
        params.id = parseInt(sprintf(String(self.id), map));
        params.mapx = parseInt(sprintf(String(self.mapx), map));
        params.mapy = parseInt(sprintf(String(self.mapy), map));
        params.mapw = parseInt(sprintf(String(self.mapw), map));
        params.maph = parseInt(sprintf(String(self.maph), map));
        params.map = {};
        params.map[params.name] = [params.mapx, params.mapy];
        params.url = sprintf(String(self.url), map);
        return params;
    };
    self.exec = function (map) {
        var params = self.getMappedParams(map);
        if (self.resource.filetype.toLowerCase() == 'tile') {
            postMessage({code : 'SkermishTerrainSprite', data : [params.id, params.name]})
            
        } else if (self.resource.filetype.toLowerCase() == 'sprite') {
            postMessage({code : 'PonyPartSprite', data : [params.name, params.url, params.mapx, params.mapy, params.mapw, params.maph]})
        }
        postMessage({code : 'Sprite', data : [params.mapw, params.maph, params.url, params.map]})
        //Crafty.sprite(params.mapw, params.maph, params.url, params.map);
    };
}

function XMLResourceWindowSkinNode(resource, xml) {
    var self = this
    self.resource = resource 
    self.nodeType = 'windowskin'
    self.name = "";
    self.top = 0;
    self.bot = 0;
    self.left = 0;
    self.right = 0;
    self.width = 0;
    self.height = 0;
    self.url ="";   
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        if(val) self[atter.nodeName.toLowerCase()] = val;
    }
    self.getMappedParams = function (map) {
        var params = {};
        params.name = sprintf(String(self.name), map);
        params.top = parseInt(sprintf(String(self.top), map));
        params.bot = parseInt(sprintf(String(self.bot), map));
        params.left = parseInt(sprintf(String(self.left), map));
        params.right = parseInt(sprintf(String(self.right), map));
        params.width = parseInt(sprintf(String(self.width), map));
        params.height = parseInt(sprintf(String(self.height), map));
        params.url = sprintf(String(self.url), map);
        return params;
    };
    self.exec = function (map) {
        var params = self.getMappedParams(map);
        postMessage({code : 'WindowSkin', data : [
            params.name,
            params.top,
            params.bot,
            params.left,
            params.right,
            params.width,
            params.height,
            params.url
        ]})
    };
}

function XMLResourceLoopNode (resource, xml) {
    var self = this
    self.resource = resource 
    self.nodeType = 'loop'   
    self.val = "";
    self.start = 0;
    self.stop = 0;
    self.nodes = [];
    self.sprintfmap = {};
    
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        if(val) self[atter.nodeName.toLowerCase()] = val;
    }

    self.parse = function () {
        var children = xml.childNodes;
        var node;
        for (var i = 0; i < children.length; i++) {
            var child = children.item(i)
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](self.resource, child);
                self.nodes.push(node);
            }
        }
        self.loop();
    };

    self.loop = function () {
        for (var i = self.start; i < self.stop; i++) {
            self.sprintfmap[self.val] = i;
            for (var j = 0; j < self.nodes.length; j++) {
                self.nodes[j].exec(self.sprintfmap);
            }
        }
    };

    self.exec = function (map) {
        for (var a in map) {
            self.sprintfmap[a] = map[a];
        }
        //self.sprintfmap = clone(map); //--clone doesn't seem to work
        self.parse();
    };
}

function XMLResourceNode(xml) {
    var self = this
    self.nodeType = 'resource' 
    self.file = "";
    self.filetype = "";
    self.width = 0;
    self.height = 0;
    self.sprintfmap = {};
    self.nodes = [];
    self.url = "";
    
    
    for (var i = 0; i < xml.attributes.length; i++) {
        var atter = xml.attributes.item(i)
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        if(val) self[atter.nodeName.toLowerCase()] = val;
    }
    self.parse = function () {
        var children = xml.childNodes;
        var node;
        for(var i = 0; i < children.length; i++) {
            var child = children.item(i)
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](self, child);
                self.nodes.push(node);
            }
        }
        self.sprintfmap["width"] = self.width;
        self.sprintfmap["height"] = self.height;
        self.sprintfmap["url"] = self.url;
        _(self.nodes).each( function( node, index, nodes ) {
            node.exec(self.sprintfmap);
        });

    };
    self.exec = function (map) {
        self.sprintfmap = clone(map);
        self.parse();
    };
}

function XMLResourceParser(xml) {
    var self = this    
    self.urls = [];
    self.types = [];
    self.resources = [];
    self.sprintfmap = {};
    self.typemap = {};
    
    
    self.parseResources = function (xml) {
        var urls = xml.getElementsByTagName('url');
        var types = xml.getElementsByTagName('type');
        var resources = xml.getElementsByTagName('resource');
        
        for (var i = 0; i < urls.length; i++) {
            var urlXML = urls.item(i)
            var url = new XMLResourceURLNode(urlXML)
            self.sprintfmap[url.name] = url.value
            self.urls.push(url)
        }

        for (var i = 0; i < types.length; i++) {
            var typeXML = types.item(i)
            var type = new XMLResourceTypeNode(typeXML, self.sprintfmap)
            self.typemap[type.name] = type.url
            self.types.push(type)
        }

        for (var i = 0; i < resources.length; i++) {
            var resourceXML = resources.item(i)
            var resource = new XMLResourceNode(resourceXML)
            resource.url = self.typemap[resource.filetype] + resource.file
            self.resources.push(resource)
        }

    };

    self.getResourceURLS = function() {
        var urls = [];
        _(self.resources).each( function( resource, index, resources ) {
            urls.push(resource.url);
        });
        return urls;
    };

    self.setupResources = function () {
        postMessage("Beginning Resource setup")
        var resources = self.resources
        var sprintfmap = self.sprintfmap
        var length = resources.length

        for (var i = 0; i < length; i++) {
            postMessage("Processing " + resources[i].file)
            resources[i].exec(sprintfmap)
            var progress = i / length
            postMessage({code : 'progress', data : progress})
        }
    };

    self.parseResources(xml);
    postMessage("Resources parsed")
}


var parser = null

function setup_parser(xml) {
    var domParser = new DOMImplementation()
    xmlObj = domParser.loadXML(xml)
    parser = new XMLResourceParser(xmlObj)
    var urls = parser.getResourceURLS()
    postMessage({code :'urls', data : urls})
}

function setup_resources() {
    if (parser) {
        parser.setupResources()
        postMessage({code : 'done', data: null})
    } else {
        postMessage({code : 'error', data: 'parser not set up'})
    }
}


addEventListener('message', function(e) {
    var msg = e.data;
    switch (msg.code) {
        case 'start':
            setup_parser(msg.data)
            break
        case 'setup':
            setup_resources()
            break
        case 'stop':
            postMessage('WORKER STOPPED');
            close(); // Terminates the worker.
            break
        default:
          postMessage('Unknown command: ' + data.msg);
  }
}, false)

postMessage({code : 'started', data : null})