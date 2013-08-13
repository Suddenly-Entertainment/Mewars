/*global $MEW, Crafty, sprintf, _, $*/
function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}

/******************************************************************
 * Interface Parsing
 ******************************************************************/
 
 var DEPTH = 0;

var $XMLInterfaceAttrParsers = {
    component: function (that, ent, attr, base){
        ent.requires(attr.nodeValue);
    },
    name: function (that, ent, attr, base) {
        ent.setName(attr.nodeValue);
        that.name = attr.nodeValue;
    },
    x: function (that, ent, attr, base) {
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.x = val + base.basex || base.basex;
    },
    y: function (that, ent, attr, base) {
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.y = val + base.basey || base.basey;
    },
    z: function (that, ent, attr, base) {
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.z = val + base.basez || base.basez;
    }
};

var $XMLInterfaceNodeParsers = {
    e: function (that, ent, entities, nodes, node, base){
        var entity = new XMLEntityNode(node);
        entity.passAttrs(ent);
        nodes.push(entity);
    },
    sizer: function (that, ent, entities, nodes, node, base) {
        var sizer = new XMLSizerNode(node);
        ent.requires("sizer");
        sizer.passAttrs(ent);
        nodes.push(sizer);
    }
};

var $XMLInterfaceNodeDelayParsers = {
    e: function (that, ent, entities, node, base){
        //console.log(node);
        var pnode = that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height);
        entities.push(pnode.ent);
    },
    sizer: function (that, ent, entities, node, base) {
        //console.log(node);
        var pnode = that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height);
        entities.push(pnode.ent);
        node.sizer(pnode.entities);
    },
    init: function (that, ent, entities, node, base) {
        //console.log(node);
        ent[node.childNodes[0].nodeValue]();
    },
    attr: function (that, ent, entities, node, base) {
       // console.log(node);
        _(node.childNodes).each( function( attr, index, attributes) {
            var val = attr.childNodes[0].nodeValue;
            if(!isNaN(val)) {
                val = parseFloat(val);
            }
            ent.attr(attr.nodeName.toLowerCase(), val);
        });
    },
    craftyhtml: function (that, ent, entities, node, base) {
        //console.log(node);
        ent.replace(node.childNodes[0].nodeValue);
    },
    css: function (that, ent, entities, node, base) {
        //console.log(node);
        ent.css(JSON.parse(node.childNodes[0].nodeValue));
    },
    craftytext: function (that, ent, entities, node, base) {
        //console.log(node);
        _(node.childNodes).each( function( cnode, index, nodes) {
            if (cnode.nodeName.toLowerCase() === 'value') {
                var text = cnode.childNodes[0].nodeValue;
                ent.text(text);
            } else if (cnode.nodeName.toLowerCase() === 'textcolor') {
                var color = JSON.parse(cnode.childNodes[0].nodeValue);
                ent.textColor(color[0], color[1]);
            } else if (cnode.nodeName.toLowerCase() === 'textfont') {
                var font = JSON.parse(cnode.childNodes[0].nodeValue);
                ent.textFont(font);
            }
        });
    }
};

Crafty.c("sizer", {
    init: function () {
        this.requires("2D");
        this.attr({
            type: 'verticle',
            ptop: 0,
            pbottom: 0,
            pleft: 0,
            pright: 0,
            align: 'left',
            expand: true,
            rows: 1,
            cols: 1,
            vgap: 0,
            hgap: 0
        });
    },
    sizer: function(nodes) {
        this.nodes = nodes;
        var that = this;
        this.bind("Change", function(e) {
            if (e.hasOwnProperty("w") || e.hasOwnProperty("h")) {
                var w = e.w || that.w,
                    h = e.h || that.h;
                that.layout(that.x, that.y, w, h);
            }
        });
        return this;
    },
    layout: function (basex, basey, width, height) {
        var x              = 0,
            y              = 0,
            maxwidth       = 0,
            minwidth       = 0,
            maxheight      = 0,
            minheight      = 0,
            widthportion   = 0,
            widthportions  = 0,
            heightportion  = 0,
            heightportions = 0,
            lessminwidth   = 0,
            lessminHeight  = 0,
            minweight      = 0;
            
        if (this.type === 'verticle') {
            // get the height avalible for expantion and section it
            _(this.nodes).each( function( node, index, nodes ) {
                heightportions += node.portion;
                minheight      += (node.minheight || 0);
                minheight      += node.ptop + node.pbottom;
            });
            lessminHeight = height - minheight;
            if (lessminHeight > 0) {
                heightportion = Math.round(lessminHeight / heightportions);
            }
            // distribute the available height
            _(this.nodes).each( function( entity, index, entities ) {
                var subheight = heightportion * entity.portion + entity.minheight,
                    subwidth  = width - entity.pleft - entity.pright;
                if (subwidth < entity.minwidth) subwidth = entity.minwidth;
                y += entity.ptop;
                entity.attr({x: basex + entity.pleft, y: basey + y, w: subwidth, h: subheight});
                y += subheight + entity.pbottom;
            });

        } else if (this.type === 'horizontal') {
            // get the width avalible for expantion and section it
            _(this.nodes).each( function( node, index, nodes ) {
                widthportions += node.portion;
                minweight     += (node.minwidth || 0);
                minweight     += node.pleft + node.pright;
            });
            lessminwidth = width - minwidth;
            if (lessminwidth > 0) {
                widthportion = Math.round(lessminwidth / widthportions);
            }
            // distribute the available width
            _(this.nodes).each( function( entity, index, entities ) {
                var subheight = height - entity.ptop - entity.pbottom,
                    subwidth  = widthportion * entity.portion + entity.minwidth;
                if (subheight < entity.minheight) subheight = entity.minheight;
                x += entity.pleft;
                entity.attr({x: basex + x, y: basey + entity.ptop, w: subwidth, h: subheight});
                x += subwidth + entity.pright;
            });

        } else if (this.type === 'grid') {
            // divide the available width by the num of cols
            maxwidth = Math.round(width / this.cols);
            //TODO: finish grid layout
        }
    }
});


function XMLSizerNode (xml) {
    this.name    = '';
    this.type    = 'verticle';
    this.x       = 0;
    this.y       = 0;
    this.z       = 0;
    this.portion = 0;
    this.width   = 0;
    this.height  = 0;
    this.xml     = xml;
    this.ptop    = 0;
    this.pbottom = 0;
    this.pleft   = 0;
    this.pright  = 0;
    this.align   = 'left';
    this.expand  = true;
    this.rows    = 1;
    this.cols    = 1;
    this.vgap    = 0;
    this.hgap    = 0;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.passAttrs = function (ent) {
        ent.attr({
            name: this.name,
            type: this.type,
            x: this.x,
            y: this.y,
            z: this.z,
            portion: this.portion,
            width: this.width,
            height: this.height,
            xml: this.xml,
            ptop: this.ptop,
            pbottom: this.pbottom,
            pleft: this.pleft,
            pright: this.pright,
            align: this.align,
            expand: this.expand,
            rows: this.rows,
            cols: this.cols,
            vgap: this.vgap,
            hgap: this.hgap
        });
    };
}

function XMLEntityNode (xml) {
    this.name      = '';
    this.component = '';
    this.minwidth  = 0;
    this.minheight = 0;
    this.x         = 0;
    this.y         = 0;
    this.z         = 0;
    this.portion   = 0;
    this.width     = 0;
    this.height    = 0;
    this.xml       = xml;
    this.ptop      = 0;
    this.pbottom   = 0;
    this.pleft     = 0;
    this.pright    = 0;
    this.align     = '';
    this.expand    = true;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.passAttrs = function (ent) {
        ent.attr({
            name: this.name,
            component: this.component,
            minwidth: this.minwidth,
            minheight: this.minheight,
            x: this.x,
            y: this.y,
            z: this.z,
            portion: this.portion,
            width: this.width,
            height: this.height,
            xml: this.xml,
            ptop: this.ptop,
            pbottom: this.pbottom,
            pleft: this.pleft,
            pright: this.pright,
            align: this.align,
            expand: this.expand
        });
    };
}

function XMLInterfaceNode (xml) {
    this.entities    = [];
    this.delay_nodes = [];
    this.nodes       = [];
    this.children    = xml.childNodes;
    this.attributes  = xml.attributes;
    this.ent         = Crafty.e("2D");
    this.xml         = xml;
}


function XMLInterface (xml) {
    this.name       = "";
    this.delayNodes = [];
    this.ent        = null;
    this.entities   = [];
    this.xml        = xml;

    this.parseNode = function (xml, basex, basey, basez, width, height) {

        var node = new XMLInterfaceNode(xml);

        // get child nodes and figure out how to parse them
        var base = {basex: basex, basey: basey, basez: basez, width: width, height: height};
        var that = this;

        _(node.children).each( function( cnode, index, children ) {
            if ($XMLInterfaceNodeParsers.hasOwnProperty(cnode.nodeName.toLowerCase())) {
                $XMLInterfaceNodeParsers[cnode.nodeName.toLowerCase()](that, node.ent, node.entities, node.nodes, node, base);
            }
            if ($XMLInterfaceNodeDelayParsers.hasOwnProperty(cnode.nodeName.toLowerCase())) {
                that.delayNodes.push(cnode);
            }
        });

        // parse attributes
        _(node.attributes).each( function( attr, index, attributes ) {
            if ($XMLInterfaceAttrParsers.hasOwnProperty(attr.nodeName.toLowerCase())){
                $XMLInterfaceAttrParsers[attr.nodeName.toLowerCase()](that, node.ent, attr, base);
            } else {
                var val = attr.nodeValue;
                if(!isNaN(val)) {
                    val = parseFloat(val);
                }
                node.ent.attr(attr.nodeName.toLowerCase(), val);
            }
        });

        // attach the entities so that relative movements will propagate
        _(node.entities).each( function( e, index, entities ) {
            node.ent.attach(e);
        });

        // set attributes in sub nodes
        var length = that.delayNodes.length
        for (var i = 0; i < length; i++) {
            if (DEPTH > 10) continue;
            DEPTH++;
            var cnode = that.delayNodes[i];
            try {
                console.log(that.delayNodes);
                //setTimeout(function() {
                    $XMLInterfaceNodeDelayParsers[cnode.nodeName.toLowerCase()](that, node.ent, node.entities, node.nodes, cnode, base);
                //}, 10);
            } catch (e) {
                var errortxt = "Error Parasing Interface " + this.name + "on node: " + node.ent.name + ":" + cnode.nodeName.toLowerCase();
                console.log(errortxt, e.message, e);
            }  
        }

        return node;
    };

    this.layout = function (base) {
        var basex = base.x,
            basey = base.y,
            width = base.w,
            height = base.h,
            basez = base.z;
        var inter = this.parseNode(this.xml, basex, basey, basez, width, height);
        base.attach(inter.ent);
    };
    
    this.destroy = function() {
        var that = this;
        _(this.entities).each(function(entity, index, entities) {
            entity.destroy();
        });
    }
}


function XMLInterfaceParser(xml) {

    this.interfaces = [];
    this.map = [];
    var that = this;
    this.parseInterfaces = function (xml) {
        var interfaces = xml.getElementsByTagName('interface');

        _(interfaces).each( function( interfaceXML, index, interfaces ) {
            var inter = new XMLInterface(interfaceXML);
            inter.name = interfaceXML.attributes['name'].nodeValue;
            that.interfaces.push(inter);
            that.map[inter.name] = inter;
        });
    };

    this.parseInterfaces(xml);

    //this.getInterface = function (name) {
    this.getInterface = function (name) {
        var inter = that.map[name] || null ;
        return inter;
    };

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

    this.setupResources = function (progress_cb, call_after) {
        function setupChain(resources) {
            // a rather intrcate loop set up as a delayed recursion intended to allow the browser to update in the middle 
            // there is no garentee that the loop has finsihed when the function returns
            var this_fn = arguments.callee;
            var i = this_fn.start || 0;
            resources[i].exec(that.sprintfmap);
            // Next time we'll start from the next index
            var next = arguments.callee.start = i + 1;
            if (next < resources.length) {
                progress_cb(next / resources.length); // Draw progress bar, whatever.
                setTimeout(function(){
                    this_fn(resources);
                }, 10);
            } else {
                call_after($RESOURCES);
            }
        }
        setupChain(that.resources);
    };

    this.parseResources(xml);
}