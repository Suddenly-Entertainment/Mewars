/*global _, $, sprintf, $MEW, self*/

self.importScripts('WorkerBase.js', 'sprintf.js');


function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}

/******************************************************************
 * Resource Parsing
 ******************************************************************/
 
 
 var $RESOURCES = {
     SkermishTerrainSprites: [],
     WindowSkins: [],
     PonyPartSprites: [],
     DefaultWindowSkin: '',
     Sprites: []
 }
 

var $XMLResourceNodeParsers = {
    sprintf: function (resource, xml) {
        var node = new XMLsprintfNode(xml);
        return node;
    },
    sprite: function (resource, xml) {
        var node = new XMLResourceSpriteNode(resource, xml);
        return node;

    },
    loop: function (resource, xml) {
        var node = new XMLResourceLoopNode(xml);
        return node;
    },
    windowskin: function (resource, xml) {
        var node = new XMLResourceWindowSkinNode(xml);
        return node;
    }

};
//$XMLResourceNodeDelayParsers = {};

function XMLsprintfNode(xml) {
    this.name = "";
    this.func = "";
    var that = this;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.evaluate = function (map) {
        var result;
        map['mod'] = '%';
        var s = sprintf(String(that.func), map);
        result = eval(s);
        return result;
    };
    this.map =function(map) {
        map[that.name] = that.evaluate(map);
    };
    this.exec = function (map) {
        that.map(map);
    };
}

function XMLResourceURLNode(xml) {
    this.name = "";
    this.value = "";
    var that = this;
    
    var URL_MAP = {
        RESOURCE_URL: $MEW.RESOURCE_URL,
        NODE_URL: $MEW.NODE_URL,
        API_URL: $MEW.API_URL
    };
    _(xml.attributes).each( function( atter, index, attributes ) {
        if (atter.nodeName.toLowerCase() === 'name') {
            that.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'value') {
            that.value = sprintf(String(atter.nodeValue), URL_MAP);
        }
    });
}

function XMLResourceTypeNode(xml, map) {
    this.name = "";
    this.url = "";
    var that = this;
    
    _(xml.attributes).each( function( atter, index, attributes ) {
        if (atter.nodeName.toLowerCase() === 'name') {
            that.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'url') {
            that.url = map[atter.nodeValue];
        }
    });
}

function XMLResourceSpriteNode(resource, xml) {
    this.name = "";
    this.mapx = "";
    this.mapy = "";
    this.mapw = "";
    this.maph = "";
    this.url = "";
    this.id = -1;
    var that = this;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.getMappedParams = function (map) {
        var params = {};
        params.name = sprintf(String(that.name), map);
        params.id = parseInt(sprintf(String(that.id), map));
        params.mapx = parseInt(sprintf(String(that.mapx), map));
        params.mapy = parseInt(sprintf(String(that.mapy), map));
        params.mapw = parseInt(sprintf(String(that.mapw), map));
        params.maph = parseInt(sprintf(String(that.maph), map));
        params.map = {};
        params.map[params.name] = [params.mapx, params.mapy];
        params.url = sprintf(String(that.url), map);
        return params;
    };
    this.exec = function (map) {
        var params = that.getMappedParams(map);
        if (resource.filetype === 'tile') {
            $RESOURCES.SkermishTerrainSprites[params.id] = params.name;
        } else if (resource.filetype === 'sprite') {
            $RESOURCES.PonyPartSprites[params.name] = [params.url, params.mapx, params.mapy, params.mapw, params.maph];
        }
        $RESOURCES.Sprites.push([params.mapw, params.maph, params.url, params.map])
        //Crafty.sprite(params.mapw, params.maph, params.url, params.map);
    };
}

function XMLResourceWindowSkinNode(xml) {
    this.name = "";
    this.top = 0;
    this.bot = 0;
    this.left = 0;
    this.right = 0;
    this.width = 0;
    this.height = 0;
    this.url ="";
    var that = this;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.getMappedParams = function (map) {
        var params = {};
        params.name = sprintf(String(that.name), map);
        params.top = parseInt(sprintf(String(that.top), map));
        params.bot = parseInt(sprintf(String(that.bot), map));
        params.left = parseInt(sprintf(String(that.left), map));
        params.right = parseInt(sprintf(String(that.right), map));
        params.width = parseInt(sprintf(String(that.width), map));
        params.height = parseInt(sprintf(String(that.height), map));
        params.url = sprintf(String(that.url), map);
        return params;
    };
    this.exec = function (map) {
        var params = that.getMappedParams(map);
        $RESOURCES.WindowSkins[params.name] = [
            params.top,
            params.bot,
            params.left,
            params.right,
            params.width,
            params.height,
            params.url
        ]
        $RESOURCES.DefaultWindowSkin = params.name;
    };
}

function XMLResourceLoopNode (xml) {
    this.val = "";
    this.start = 0;
    this.stop = 0;
    this.nodes = [];
    this.sprintfmap = {};
    var that = this;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.parse = function () {
        var children = xml.childNodes;
        var that = this;
        var node;
        _(children).each( function( child, index, children ) {
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](that, child);
                that.nodes.push(node);
            }
        });
        this.loop();
    };
    this.loop = function () {
        var i = that.start;
        var func = function( node, index, nodes ) {
            node.exec(that.sprintfmap);
        };
        for (; i < that.stop; i++) {
            that.sprintfmap[that.val] = i;
            _(that.nodes).each(func);
        }
    };
    this.exec = function (map) {
        for (var a in map) {
            that.sprintfmap[a] = map[a];
        }
        //that.sprintfmap = clone(map); --clone doesn't seem to work
        that.parse();
    };
}

function XMLResourceNode(xml) {
    this.file = "";
    this.filetype = "";
    this.width = 0;
    this.height = 0;
    this.sprintfmap = {};
    this.nodes = [];
    this.url = "";
    var that = this;
    
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.parse = function () {
        var children = xml.childNodes;
        var node;
        _(children).each( function( child, index, children ) {
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](that, child);
                that.nodes.push(node);
            }
        });
        that.sprintfmap["width"] = that.width;
        that.sprintfmap["height"] = that.height;
        that.sprintfmap["url"] = that.url;
        _(that.nodes).each( function( node, index, nodes ) {
            node.exec(that.sprintfmap);
        });

    };
    this.exec = function (map) {
        this.sprintfmap = clone(map);
        this.parse();
    };
}

function XMLResourceParser(xml) {

    this.urls = [];
    this.types = [];
    this.resources = [];
    this.sprintfmap = {};
    this.typemap = {};
    var that = this;
    
    this.parseResources = function (xml) {
        var urls = xml.getElementsByTagName('url');
        var types = xml.getElementsByTagName('type');
        var resources = xml.getElementsByTagName('resource');
        
        _(urls).each( function( urlXML, index, urls ) {
            var url = new XMLResourceURLNode(urlXML);
            that.sprintfmap[url.name] = url.value;
            that.urls.push(url);
        });

        _(types).each( function( typeXML, index, types ) {
            var type = new XMLResourceTypeNode(typeXML, that.sprintfmap);
            that.typemap[type.name] = type.url;
            that.types.push(type);
        });

        _(resources).each( function( resourceXML, index, resources ) {
            var resource = new XMLResourceNode(resourceXML);
            resource.url = that.typemap[resource.filetype] + resource.file;
            that.resources.push(resource);
        });
    };

    this.getResourceURLS = function() {
        var urls = [];
        _(that.resources).each( function( resource, index, resources ) {
            urls.push(resource.url);
        });
        return urls;
    };

    this.setupResources = function () {
        _(that.resources).each(function(resource, index, resources){
            
            resource.exec(that.sprintfmap);
            self.postMessage({msg:'progress', data:(index + 1 / resources.length)});
        });
        self.postMessage({msg:'done', data:$RESOURCES});
    };

    this.parseResources(xml);
}

var Parser = null;


self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'setup':
        try {
            Parser = new XMLResourceParser(data.xml);
        } catch (e) {
            self.postMessage({msg:'error', data:e})
        } 
        break;
    case 'geturls':
        if (Parser !== null){
            try {
                var urls = Parser.getResourceURLS()
                self.postMessage({msg:'geturls', data:urls})
            } catch (e) {
                self.postMessage({msg:'error', data:e})
            }  
        } else {
            self.postMessage({msg:'error', data:'no parser'})
        }
        break;
    case 'start':
        if (Parser !== null){
            try {
                Parser.setupResources()
            } catch (e) {
                self.postMessage({msg:'error', data:e})
            }  
        } else {
            self.postMessage({msg:'error', data:'no parser'})
        }
        break;
    case 'stop':
        self.close(); // Terminates the worker.
        break;
    default:
        self.postMessage({msg:'error', data:'unknown'})
  };
}, false);