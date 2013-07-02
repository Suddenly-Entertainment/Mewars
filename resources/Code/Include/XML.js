/*global $MEW, Crafty, sprintf, _, $*/
function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}

/******************************************************************
 * Interface Parsing
 ******************************************************************/

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
        var pnode = that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height);
        entities.push(pnode.ent);
    },
    sizer: function (that, ent, entities, node, base) {
        var pnode = that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height);
        entities.push(pnode.ent);
        node.sizer(pnode.entities);
    },
    init: function (that, ent, entities, node, base) {
        ent[node.childNodes[0].nodeValue]();
    },
    attr: function (that, ent, entities, node, base) {
        _(node.childNodes).each( function( attr, index, attributes) {
            var val = attr.childNodes[0].nodeValue;
            if(!isNaN(val)) {
                val = parseFloat(val);
            }
            ent.attr(attr.nodeName.toLowerCase(), val);
        });
    },
    html: function (that, ent, entities, node, base) {
        ent.replace(node.childNodes[0].nodeValue);
    },
    css: function (that, ent, entities, node, base) {
        ent.css(JSON.parse(node.childNodes[0].nodeValue));
    },
    text: function (that, ent, entities, node, base) {
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
            lessminHeight  = 0;
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
                minweight      += (node.minwidth || 0);
                minweight      += node.pleft + node.pright;
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
    this.delayNodes = ['css', 'html', 'init', 'attr', 'text', 'sizer'];
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
                $XMLInterfaceNodeParsers[node.nodeName.toLowerCase()](that, node.ent, node.entities, node.nodes, cnode, base);
            }
            if ($XMLInterfaceNodeDelayParsers.hasOwnProperty(cnode.nodeName.toLowerCase())) {
                delay_nodes.push(cnode);
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
        _(node.delay_nodes).each( function( cnode, index, delay_nodes ) {
            try {
                $XMLInterfaceNodeDelayParsers[cnode.nodeName.toLowerCase()](that, node.ent, node.entities, node.nodes, cnode, base);
            } catch (e) {
                var errortxt = "Error Parasing Interface " + this.name + "on node: " + node.ent.name + ":" + cnode.nodeName.toLowerCase();
                console.log(errortxt, e.message, e);
            }
        });


        return node;
    };

    this.layout = function (base) {
        var basex = base.x,
            basey = base.y,
            width = base.w,
            height = base.h,
            basez = base.z;
        var inter = this.parseNode(this.xml, basex, basey, basez, width, height);
        base.attach(inter);
    };
}


function XMLInterfaceParser(xml) {

    this.interfaces = [];
    this.map = [];

    this.parseInterfaces = function (xml) {
        var interfaces = xml.getElementsByTagName('interface');

        _(interfaces).each( function( interfaceXML, index, interfaces ) {
            var inter = new XMLInterface(interfaceXML);
            this.interfaces.push(inter);
            this.map[inter.name] = inter;
        });
    };

    this.parseInterfaces(xml);

    this.getInterface = function (name) {
        var inter = this.map[name] || null ;
        return inter;
    };

}

/******************************************************************
 * Resource Parsing
 ******************************************************************/

var $XMLResourceNodeParsers = {
    sprintf: function (resource, xml) {
        var node = new XMLsprintfNode(xml);
        return node;
    },
    sprite: function (resource, xml) {
        var node = new XMLResourceSpriteNode(xml);
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
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.evaluate = function (map) {
        var result;
        var s = sprintf(this.func, map);
        result = eval(s);
        return result;
    };
    this.map =function(map) {
        map[this.name] = this.evaluate(map);
    };
    this.exec = function (map) {
        this.map(map);
    };
}

function XMLResourceURLNode(xml) {
    this.name = "";
    this.value = "";
    var URL_MAP = {
        RESOURCE_URL: $MEW.RESOURCE_URL,
        NODE_URL: $MEW.NODE_URL,
        API_URL: $MEW.API_URL
    };
    _(xml.attributes).each( function( atter, index, attributes ) {
        if (atter.nodeName.toLowerCase() === 'name') {
            this.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'value') {
            this.value = sprintf(atter.nodeValue, URL_MAP);
        }
    });
}

function XMLResourceTypeNode(xml, map) {
    this.name = "";
    this.url = "";
    _(xml.attributes).each( function( atter, index, attributes ) {
        if (atter.nodeName.toLowerCase() === 'name') {
            this.name = atter.nodeValue;
        } else if (atter.nodeName.toLowerCase() === 'url') {
            this.url = map[atter.nodeValue];
        }
    });
}

function XMLResourceSpriteNode(xml) {
    this.name = "";
    this.mapx = "";
    this.mapy = "";
    this.mapw = "";
    this.maph = "";
    this.url = "";
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.getMapedParams = function (sprintf, map) {
        var params = {};
        params.name = sprintf(this.name, map);
        params.mapx = sprintf(this.mapx, map);
        params.mapy = sprintf(this.mapy, map);
        params.mapw = sprintf(this.mapw, map);
        params.maph = sprintf(this.maph, map);
        params.map = {};
        params.map[params.name] = [params.mapx, params.mapy];
        params.url = this.url;
        return params;
    };
    this.exec = function (map) {
        var params = this.getMapedParams(map);
        Crafty.sprite(params.mapw, params.maph, params.url, params.map);
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
    this.url = "";
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.getMapedParams = function (sprintf, map) {
        var params = {};
        params.name = sprintf(this.name, map);
        params.top = sprintf(this.top, map);
        params.bot = sprintf(this.bot, map);
        params.left = sprintf(this.left, map);
        params.right = sprintf(this.right, map);
        params.width = sprintf(this.width, map);
        params.height = sprintf(this.height, map);
        params.url = this.url;
        return params;
    };
    this.exec = function (map) {
        var params = this.getMapedParams(map);
        Crafty.e("WindowSkin").WindowSkin( params.top, params.bot, params.left, params.right, params.width, params.height, params.url);
    };
}

function XMLResourceLoopNode (xml) {
    this.val = "";
    this.start = 0;
    this.stop = 0;
    this.nodes = [];
    this.sprintfmap = {};
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.parse = function () {
        var children = xml.childNodes;
        var that = this;
        var node;
        _(children).each( function( child, index, children ) {
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](that, child);
                this.nodes.push(node);
            }
        });
        this.loop();

    };
    this.loop = function () {
        var i = this.start;
        var that = this;
        var func = function( node, index, nodes ) {
            node.exec(that.sprintfmap);
        };
        for (; i < this.stop; i++) {
            this.sprintfmap[this.val] = i;
            _(this.nodes).each(func);
        }
    };
    this.exec = function (map) {
        this.sprintfmap = clone(map);
        this.parse();
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
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.parse = function () {
        var children = xml.childNodes;
        var that = this;
        var node;
        _(children).each( function( child, index, children ) {
            if ($XMLResourceNodeParsers.hasOwnProperty(child.nodeName.toLowerCase())) {
                node = $XMLResourceNodeParsers[child.nodeName.toLowerCase()](that, child);
                this.nodes.push(node);
            }
        });
        this.sprintfmap["width"] = this.width;
        this.sprintfmap["height"] = this.height;
        this.sprintfmap["url"] = this.url;
        _(this.nodes).each( function( node, index, nodes ) {
            node.exec(this.sprintfmap);
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


    this.parseResources = function (xml) {
        var urls = xml.getElementsByTagName('url');
        var types = xml.getElementsByTagName('type');
        var resources = xml.getElementsByTagName('resource');
        
        var that = this
        
        _(urls).each( function( urlXML, index, urls ) {
            var url = new XMLResourceURLNode(urlXML);
            that.sprintfmap[url.name] = url.value;
            that.urls.push(url);
        });

        _(types).each( function( typeXML, index, types ) {
            var type = new XMLResourceTypeNode(xml, that.sprintfmap);
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
        var that = this;
        var urls = [];
        _(this.resources).each( function( resource, index, resources ) {
            urls.push(resource.url);
        });
        return urls;
    };

    this.setupResources = function () {
        var that = this;
        (this.resources).each( function( resource, index, resources ) {
            resource.exec(that.sprintfmap);
        });
    };

    this.parseResources(xml);

}